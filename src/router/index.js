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
      path: '/legal',
      name: 'Legal',
      component: LegalView
    },
    {
      path: '/apropos',
      name: 'Apropos',
      component: AproposView
    },
    {
      path: '/partenaires',
      name: 'Partenaires',
      component: PartenairesView
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
