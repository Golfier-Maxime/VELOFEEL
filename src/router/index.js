import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LegalView from '../views/legal.vue'
import AproposView from '../views/apropos.vue'
import PartenairesView from '../views/partenaires.vue'
import ContactView from '../views/contact.vue'
import ProduitView from '../views/produit.vue'
import PrivateZoneView from '../views/privatezone.vue'
import ProduitFicheView from '../views/produitFiche.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/produitFiche/:id',
      name: 'ProduitFiche',
      component: ProduitFicheView
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
    {
      path: '/contact',
      name: 'Contact',
      component: ContactView
    },
    {
      path: '/produit',
      name: 'Produit',
      component: ProduitView
    },
    {
      path: '/privatezone',
      name: 'PrivateZone',
      component: PrivateZoneView
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
