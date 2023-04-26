import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LegalView from '../views/legal.vue'
import AproposView from '../views/apropos.vue'
import PartenairesView from '../views/partenaires.vue'
import ContactView from '../views/contact.vue'
import ProduitView from '../views/produit.vue'
import PrivateZoneView from '../views/privatezone.vue'
import PrivateZone2View from '../views/privatezone2.vue'
import PrivateZone3View from '../views/privatezone3.vue'
import PrivateZonePartenaireView from '../views/privatezonepartenaire.vue'
import ProduitFicheView from '../views/produitFiche.vue'
import ProduitFiche2View from '../views/produitFiche2.vue'
import ProduitFiche3View from '../views/produitFiche3.vue'
import AccesZoneView from '../views/acceszone.vue'
import CGUView from '../views/CGU.vue'
import PCView from '../views/PC.vue'

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
      path: '/produitFiche2/:id',
      name: 'ProduitFiche2',
      component: ProduitFiche2View
    },
    {
      path: '/produitFiche3/:id',
      name: 'ProduitFiche3',
      component: ProduitFiche3View
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
    {
      path: '/privatezone2',
      name: 'PrivateZone2',
      component: PrivateZone2View
    },
    {
      path: '/privatezone3',
      name: 'PrivateZone3',
      component: PrivateZone3View
    },
    {
      path: '/privatezonepartenaire',
      name: 'PrivateZonePartenaire',
      component: PrivateZonePartenaireView
    },
    {
      path: '/acceszone',
      name: 'AccesZone',
      component: AccesZoneView
    },
    {
      path: '/CGU',
      name: 'CGU',
      component: CGUView
    },
    {
      path: '/PC',
      name: 'PC',
      component: PCView
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
