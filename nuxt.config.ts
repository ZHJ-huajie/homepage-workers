// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare_module"
  },

  modules: [ "nitro-cloudflare-dev", 'nuxt-proxy'],

  css: ['~/assets/css/reset.css','~/assets/css/main.css'],

  proxy: {
    '/safarigo_collection': {
      target: 'http://159.138.8.246:3002',
      changeOrigin: true,
      pathRewrite: () => {
        console.log(123);
        
      },
    },
    options: {
      target: 'http://159.138.8.246:3002',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api/todos': '/todos',
      //   '^/api/users': '/users'
      // },
      pathFilter: [
        '/safarigo_collection',
        // '/api/users'
      ]
    }
  },
})