export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark'
  },
  ui: {
    primary: 'amber',
    gray: 'zinc'
  },
  icon: {
    clientBundle: {
      scan: true
    }
  },
  app: {
    baseURL: '/souverainete',
    head: {
      title: 'Spade · Démarche de souveraineté numérique',
      meta: [
        {
          name: 'description',
          content: 'Analyse et comparaison des alternatives souveraines aux outils numériques actuellement utilisés chez Spade.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'https://www.spade.be/app/uploads/2022/03/cropped-favicon-512-x-512-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: 'https://www.spade.be/app/uploads/2022/03/cropped-favicon-512-x-512-192x192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: 'https://www.spade.be/app/uploads/2022/03/cropped-favicon-512-x-512-180x180.png' }
      ]
    }
  }
})
