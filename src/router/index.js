import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LegalView from '../views/legal.vue'
import AproposView from '../views/apropos.vue'
import PartenairesView from '../views/partenaires.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/',
      name: 'legal',
      component: LegalView
    },
    {
      path: '/',
      name: 'apropos',
      component: AproposView
    },
    {
      path: '/',
      name: 'partenaires',
      component: PartenairesView
    },
  ]
})

export default router
