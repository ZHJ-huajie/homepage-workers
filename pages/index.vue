<template>
    <div style="display: flex;min-height: 100vh;">
        <div :class="['wrap-content', editMode ? 'edit-mode' : '']">
            <!-- 搜索框 -->
            <div class="search-box">
                <form action="https://www.baidu.com/s" method="get">
                    <input type="text" name="wd" id="wd" autocomplete="off" autofocus>
                    <button type="submit" id="su">搜索</button>
                </form>
            </div>

            <!-- 链接列表 -->
            <div class="links-list">
                <div v-for="link in data.links" class="links-item" :key="link.id">
                    <a :href="link.url" target="_blank">
                        <template v-if="link.icon">
                            <template
                                v-if="(link.icon.startsWith('http') || link.icon.startsWith('data:image') || link.icon.toLowerCase().endsWith('.svg') || link.icon.startsWith('<svg'))">
                                <div v-if="link.icon.startsWith('<svg')" v-html="link.icon" style="width: 100%;"></div>
                                <img v-else :src="link.icon" alt="" />
                            </template>
                            <div v-else class="earth">{{ link.icon }}</div>
                        </template>
                        <div v-else class="earth"> 🔗 </div>
                        <strong v-if="!link.title" class="title">{{ link.url }}</strong>
                        <div class="links-title">{{ link.title }}</div>
                    </a>
                    <div class="link-actions">
                        <span class="sort-label">{{ link.sort || 999 }}</span>
                        <button class="edit-btn" @click="addLink(link)">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path
                                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                        <button class="delete-btn" @click="deleteLink(link.id)">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <!-- 设置面板 -->
            <div class="settings-panel">
                <div class="settings-trigger" title="设置" @click="showSetting = !showSetting">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                            d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                            fill="currentColor" />
                    </svg>
                </div>
                <div v-if="showSetting" class="settings-menu">
                    <div class="settings-items">
                        <label class="edit-mode-switch settings-item">
                            <input v-model="editMode" type="checkbox" @change="showSetting = false">
                            <span class="slider"></span>
                            编辑模式
                        </label>
                        <label class="edit-mode-switch settings-item">
                            <input v-model="bingWallpaper" type="checkbox" id="bingWallpaperToggle"
                                @change="handleBingWallpaperChange">
                            <span class="slider"></span>
                            必应每日壁纸
                        </label>
                        <button id="add-link" class="settings-item" @click="() => addLink()">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                            </svg>
                            添加链接
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="showLinkModal" class="custom-modal">
                <div class="modal-content">
                    <h3>{{ linkDetail.id ? '编辑' : '添加' }}链接</h3>
                    <div class="form-group">
                        <label for="link-title">标题</label>
                        <input v-model="linkDetail.title" type="text" id="link-title" />
                    </div>
                    <div class="form-group">
                        <label for="link-url">URL</label>
                        <input v-model="linkDetail.url" type="text" id="link-url" />
                    </div>
                    <div class="form-group">
                        <label for="link-icon">图标 (支持emoji、图片URL、SVG)</label>
                        <input v-model="linkDetail.icon" type="text" id="link-icon"
                            placeholder="🔗 或 https://example.com/icon.png 或 <svg>...</svg>" />
                        <div class="icon-preview">🔗</div>
                    </div>
                    <div class="form-group">
                        <label for="link-sort">排序 (数字越小越靠前)</label>
                        <input v-model="linkDetail.sort" type="number" id="link-sort" min="0" max="999" />
                    </div>
                    <div class="modal-actions">
                        <button class="cancel-btn" @click="showLinkModal = false">取消</button>
                        <button class="save-btn" @click="confirmAddLink">保存</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="wrap-content">
      1234
    </div> -->
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const { data, error } = useAsyncData(async () => {
    try {
        const response = await fetch('https://www.safarigo.com/safarigo_collection/links')
        const result = await response.json()
        return result
    } catch (error) {
        return error;
    }
})

const showSetting = ref(false);
const editMode = ref(false);
const bingWallpaper = ref(false);
const linkDetail = ref({ title: "", url: "", icon: "", sort: 999 });
const showLinkModal = ref(false);

onMounted(async () => {
    setBackground();
});

const deleteLink = (id) => {
    if (confirm('确定要删除这个链接吗？')) {
        const index = data.value.links.findIndex(item => item.id === id);
        if (index > -1) {
            data.value.links.splice(index, 1);
        }
        fetch(`https://www.safarigo.com/safarigo_collection/links/${id}`, {
            method: 'DELETE'
        });
    }
}
const confirmAddLink = async () => {
    try {
        await fetch(`https://www.safarigo.com/safarigo_collection/links/${linkDetail.value.id || ''}`, {
            method: linkDetail.value.id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(linkDetail.value)
        });

        // const result = await response.json();
        // if (linkDetail.value.id) {
        //     const index = data.value.links.findIndex(item => item.id === id);
        //     if (index > -1) {
        //         data.value.links.splice(index, 1, linkDetail.value);
        //     }
        // } else {
        //     data.value.links.push({
        //         id: result.id,
        //         ...linkDetail.value,
        //     });

        // }
        const res = await fetch('https://www.safarigo.com/safarigo_collection/links')
        const { links } = await res.json()
        data.value.links = links;
        showLinkModal.value = false;

        //   showToast('添加成功');
    } catch (error) {
        console.error('添加链接失败:', error);
        //   showToast('添加失败', 'error');
    }
}
const addLink = (data) => {
    console.log(data);

    if (data) {
        linkDetail.value = JSON.parse(JSON.stringify(data));
    } else {
        linkDetail.value = { title: "", url: "", icon: "", sort: 999 };
    }

    showLinkModal.value = true;
    showSetting.value = false;
}
const handleBingWallpaperChange = (val) => {
    if (bingWallpaper.value) {
        setBackground();
    } else {
        document.body.style.backgroundImage = '';
        localStorage.removeItem('bg');
    }
    showSetting.value = false;
}
const setBackground = async () => {
    const localBg = localStorage.getItem('bg');
    const today = new Date().toLocaleDateString();
    if (localBg) {
        const localData = JSON.parse(localBg);
        if (localData.day === today) {
            document.body.style.backgroundImage = localData.bg;
            bingWallpaper.value = true;
            return;
        }
    } else if (!bingWallpaper.value) {
        return;
    }
    try {
        const response = await $fetch('https://www.safarigo.com/safarigo_collection/links/bing');
        const bg = `url(https://www.bing.com${response.url})`;
        document.body.style.backgroundImage = bg;
        localStorage.setItem('bg', JSON.stringify({ day: today, bg }));
        bingWallpaper.value = true;
    } catch (error) {
        console.error(error);
    }
}
</script>