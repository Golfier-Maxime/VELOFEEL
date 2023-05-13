<script setup>
import LogoFB from '@/components/logo/facebook.vue';
import LogoInsta from '@/components/logo/insta.vue';
</script>

<script>
// Bibliothèques Firebase  : import des fonctions
//  signInWithEmailAndPassword : Authentification avec email et mot de passe
//  getAuth : Fonction générale d'authentification
//  signOut : Se deconnecter
//  onAuthStateChanged : connaitre le statut de l'utilisateur (connecté ou non)
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";
import {
    getFirestore, // Obtenir le Firestore
    collection, // Utiliser une collection de documents
    doc, // Obtenir un document par son id
    getDoc,
    getDocs, // Obtenir la liste des documents d'une collection
    addDoc, // Ajouter un document à une collection
    updateDoc, // Mettre à jour un document dans une collection
    deleteDoc, // Supprimer un document d'une collection
    onSnapshot, // Demander une liste de documents d'une collection, en les synchronisant
    query, // Permet d'effectuer des requêtes sur Firestore
    orderBy, // Permet de demander le tri d'une requête query
    where,
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

// Cloud Storage : import des fonctions
import {
    getStorage,             // Obtenir le Cloud Storage
    ref,                    // Pour créer une référence à un fichier à uploader
    deleteObject,
    getDownloadURL,         // Permet de récupérer l'adress complète d'un fichier du Storage
    uploadString,           // Permet d'uploader sur le Cloud Storage une image en Base64
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js'

import { emitter } from "../main";


export default {
    data() {
        // Données de la vue
        return {
            imageData2: null,
            imageData3: null,
            filter: "",
            // liste
            listeVelo2Synchro: [],
            listeVelo3Synchro: [],
            listePartenaireSynchro: [],
            user: {
                // user se connectant
                email: null,
                password: null,
            },
            velo2: {
                nomProduit: null,
                descProduit: null,
                prixProduit: null,
                typeProduit: null,
            },
            velo3: {
                nomProduit: null,
                descProduit: null,
                prixProduit: null,
                typeProduit: null,
            },
            partenaire: {
                nomPartenaire: null,
                lienPartenaire: null,
                imagePartenaire: null,
            },
            refVelo: null,
            refPartenaire: null,
            message: null, // Message de connexion
            Connected: false,
            img_Prod: null
        };
    },

    mounted() {
        this.getPartenaireSynchro();

        this.getVelo2Synchro();
        this.getVelo3Synchro();
        this.getUserConnect();
        // Montage de la vue
        // Rechercher si un user est déjà connecté
        let user = getAuth().currentUser;
        if (user) {
            this.user = user;
            this.message = "User déjà connecté : " + this.user.email;
        } else {
            this.message = "User non connecté : " + this.user.email;
        }

    },

    methods: {
        reloadPage() {
            location.reload();
        },
        async getUserConnect() {
            await getAuth().onAuthStateChanged(
                function (user) {
                    if (user) {
                        this.user = user;
                        this.getUserInfo(this.user);
                        this.Connected = true;
                    }
                }.bind(this)
            );
        },
        async getUserInfo() {
            const q = query(collection(getFirestore(), "user"), where("uid", "==", getAuth().currentUser.uid));
            await onSnapshot(q, (snapshot) => {
                let user = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log(user);
            });
        },
        onCnx() {
            // Se connecter avec user email et mot de passe
            signInWithEmailAndPassword(getAuth(), this.user.email, this.user.password)
                .then((response) => {
                    // Connexion OK
                    console.log("user connecté", response.user);
                    emitter.emit("connectUser", { user: this.user });
                    this.user = response.user;
                    this.message = "User connecté : " + this.user.email;
                    this.getUserInfo();
                    this.Connected = true;
                })
                .catch((error) => {
                    // Erreur de connexion
                    console.log("Erreur connexion", error);
                    this.message = "Erreur d'authentification";
                });
        },
        onDcnx() {
            // Se déconnecter
            signOut(getAuth())
                .then((response) => {
                    this.user = getAuth().currentUser;
                    this.user = {
                        email: null,
                        password: null,
                    };
                    emitter.emit("deConnectUser", { user: this.user });
                    console.log("user deconnecté ", this.user);
                    this.message = "user non connecté";
                    this.Connected = false;
                })
                .catch((error) => {
                    console.log("erreur deconnexion ", error);
                });
        },

        // avoir info pour le produit velo2
        async getVelo2(id) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo2", id);
            this.refVelo = await getDoc(docRef);
            if (this.refVelo.exists()) {
                this.velo2 = this.refVelo.data();
                this.img_Prod = this.velo2.imageProduit;

            }
            else {
                this.console.log("Velo Inexistant");
            }
            const storage = getStorage();
            const spaceRef = ref(storage, 'VELOFEEL/' + this.velo2.imageProduit);
            getDownloadURL(spaceRef)
                .then((url) => {
                    this.img_Prod = url;
                })
        },
        // avoir info pour le produit velo3
        async getVelo3(id) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo3", id);
            this.refVelo = await getDoc(docRef);
            if (this.refVelo.exists()) {
                this.velo3 = this.refVelo.data();
                this.img_Prod = this.velo3.imageProduit;

            }
            else {
                this.console.log("Velo Inexistant");
            }
            const storage = getStorage();
            const spaceRef = ref(storage, 'VELOFEEL/' + this.velo3.imageProduit);
            getDownloadURL(spaceRef)
                .then((url) => {
                    this.img_Prod = url;
                })
        },
        // avoir info pour partenaire
        async getPartenaire(id) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "partenaire", id);
            this.refPartenaire = await getDoc(docRef);
            if (this.refPartenaire.exists()) {
                this.partenaire = this.refPartenaire.data();
                this.img_Prod = this.partenaire.imagePartenaire;

            }
            else {
                this.console.log("Partenaire Inexistant");
            }
            const storage = getStorage();
            const spaceRef = ref(storage, 'VELOFEEL/' + this.partenaire.imagePartenaire);
            getDownloadURL(spaceRef)
                .then((url) => {
                    this.img_Prod = url;
                })
        },


        // velo2
        async getVelo2Synchro() {
            const firestore = getFirestore();
            const dbVelo2 = collection(firestore, "velo2");
            const query = await onSnapshot(dbVelo2, (snapshot) => {
                this.listeVelo2Synchro = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }
                ))
                // récupération des images des produit/velo
                // parcours de la liste 
                this.listeVelo2Synchro.forEach(function (velo2) {
                    const storage = getStorage();
                    //récup des l'image par son nom de fichier
                    const spaceRef = ref(storage, 'VELOFEEL/' + velo2.imageProduit);
                    //recup de l'url de l'image
                    getDownloadURL(spaceRef).then((url) => {
                        //on remplace le nom du fichier
                        // par l'url complete de l'image
                        velo2.imageProduit = url;
                    })
                        .catch((error) => {
                            console.log('erreur downloadUrl', error);
                        })
                })
            });
        },

        // velo3
        async getVelo3Synchro() {
            const firestore = getFirestore();
            const dbVelo3 = collection(firestore, "velo3");
            const query = await onSnapshot(dbVelo3, (snapshot) => {
                this.listeVelo3Synchro = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }
                ))
                // récupération des images des produit/velo
                // parcours de la liste 
                this.listeVelo3Synchro.forEach(function (velo3) {
                    const storage = getStorage();
                    //récup des l'image par son nom de fichier
                    const spaceRef = ref(storage, 'VELOFEEL/' + velo3.imageProduit);
                    //recup de l'url de l'image
                    getDownloadURL(spaceRef).then((url) => {
                        //on remplace le nom du fichier
                        // par l'url complete de l'image
                        velo3.imageProduit = url;
                    })
                        .catch((error) => {
                            console.log('erreur downloadUrl', error);
                        })
                })
            });

        },
        // partenaire 
        async getPartenaireSynchro() {
            const firestore = getFirestore();
            const dbPartenaire = collection(firestore, "partenaire");
            const query = await onSnapshot(dbPartenaire, (snapshot) => {
                this.listePartenaireSynchro = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }
                ))
                // récupération des images des produit/velo
                // parcours de la liste 
                this.listePartenaireSynchro.forEach(function (partenaire) {
                    const storage = getStorage();
                    //récup des l'image par son nom de fichier
                    const spaceRef = ref(storage, 'VELOFEEL/' + partenaire.imagePartenaire);
                    //recup de l'url de l'image
                    getDownloadURL(spaceRef).then((url) => {
                        //on remplace le nom du fichier
                        // par l'url complete de l'image
                        partenaire.imagePartenaire = url;
                    })
                        .catch((error) => {
                            console.log('erreur downloadUrl', error);
                        })
                })
            });

        },



    },



    computed: {
        // Tri des pays par nom en ordre croissant
        orderByName: function () {
            // Parcours et tri des pays 2 à 2
            return this.listePartenaireSynchro.sort(function (a, b) {
                // Si le nom du pays est avant on retourne -1
                if (a.nom < b.nom) return -1;
                // Si le nom du pays est après on retourne 1
                if (a.nom > b.nom) return 1;
                // Sinon ni avant ni après (homonyme) on retourne 0
                return 0;
            });
        },
        orderByName2: function () {
            // Parcours et tri des pays 2 à 2
            return this.listeVelo2Synchro.sort(function (a, b) {
                // Si le nom du pays est avant on retourne -1
                if (a.nom < b.nom) return -1;
                // Si le nom du pays est après on retourne 1
                if (a.nom > b.nom) return 1;
                // Sinon ni avant ni après (homonyme) on retourne 0
                return 0;
            });
        },
        orderByName3: function () {
            // Parcours et tri des pays 2 à 2
            return this.listeVelo3Synchro.sort(function (a, b) {
                // Si le nom du pays est avant on retourne -1
                if (a.nom < b.nom) return -1;
                // Si le nom du pays est après on retourne 1
                if (a.nom > b.nom) return 1;
                // Sinon ni avant ni après (homonyme) on retourne 0
                return 0;
            });
        },

        // Filtrage de la propriété calculée de tri
        filterByName: function () {
            // On effectue le fitrage seulement si le filtre est rnseigné
            if (this.filter.length > 0) {
                // On récupère le filtre saisi en minuscule (on évite les majuscules)
                let filter = this.filter.toLowerCase();
                // Filtrage de la propriété calculée de tri
                return this.orderByName.filter(function (partenaire) {
                    // On ne renvoie que les pays dont le nom contient
                    // la chaine de caractère du filtre
                    return partenaire.nomPartenaire.toLowerCase().includes(filter);
                });
            } else {
                // Si le filtre n'est pas saisi
                // On renvoie l'intégralité de la liste triée
                return this.orderByName;
            }
        },
        filterByName2: function () {
            // On effectue le fitrage seulement si le filtre est rnseigné
            if (this.filter.length > 0) {
                // On récupère le filtre saisi en minuscule (on évite les majuscules)
                let filter = this.filter.toLowerCase();
                // Filtrage de la propriété calculée de tri
                return this.orderByName2.filter(function (velo2) {
                    // On ne renvoie que les pays dont le nom contient
                    // la chaine de caractère du filtre
                    return velo2.nomProduit.toLowerCase().includes(filter);
                });
            } else {
                // Si le filtre n'est pas saisi
                // On renvoie l'intégralité de la liste triée
                return this.orderByName2;
            }
        },
        filterByName3: function () {
            // On effectue le fitrage seulement si le filtre est rnseigné
            if (this.filter.length > 0) {
                // On récupère le filtre saisi en minuscule (on évite les majuscules)
                let filter = this.filter.toLowerCase();
                // Filtrage de la propriété calculée de tri
                return this.orderByName3.filter(function (velo3) {
                    // On ne renvoie que les pays dont le nom contient
                    // la chaine de caractère du filtre
                    return velo3.nomProduit.toLowerCase().includes(filter);
                });
            } else {
                // Si le filtre n'est pas saisi
                // On renvoie l'intégralité de la liste triée
                return this.orderByName3;
            }
        },
    },
};

</script>

<template>
    <div class="">
        <!-- titre -->
        <div class="lg:mx-20 mx-4">
            <h1
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-[50px] text-center font-overpass leading-tight">
                Vélofeel
            </h1>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[80px] text-4xl text-center font-overpass leading-tight">
                L'expert du vélo pour tous </h2>
            <h3
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[80px] text-4xl text-center font-overpass leading-tight">
                à
                Audincourt</h3>
            <p
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[24px]  text-center font-overpass leading-tight">
                Du Mardi au
                Samedi de 9:30 à 12:00 et 14:00 à 19:00</p>
        </div>
        <!-- Slider automatic et infini de quelque marque associé -->
        <div class="slider mt-10">
            <div class="slide-track flex my-auto  gap-5 ml-40">
                <div class="slide" v-for="partenaire in filterByName" :key="partenaire.id">
                    <img :src="partenaire.imagePartenaire" alt="image partenaire" class="h-[90%] my-2" />
                </div>
            </div>
        </div>
        <div class="lg:mx-20 mx-4 flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="arrow down" class="w-16">
        </div>
        <!-- Présentation produit a metre en avant -->

        <div class="lg:mx-20 mx-4 flex justify-center">
            <meta name="description" content="Présentation du produit phare du magasin">
            <div v-for="velo3 in filterByName3" :key="velo3.id"
                class="mt-16 flex flex-col-reverse gap-4 lg:flex-row justify-evenly">
                <div class="flex flex-col gap-2">
                    <p class="text-[40px] font-overpass font-extrabold text-Grey-Velofeel dark:text-Dark-Grey">{{
                        velo3.nomProduit }}
                    </p>
                    <p class="lg:w-[600px] text-base text-Grey-Velofeel dark:text-Dark-Grey">{{ velo3.descProduit }}</p>
                    <div class="flex gap-4">
                        <p class="text-xl font-light text-Grey-Velofeel dark:text-Dark-Grey">Type : {{ velo3.typeProduit }}
                        </p>
                        <p class="text-xl font-light text-Grey-Velofeel dark:text-Dark-Grey">Tailles : {{
                            velo3.tailleProduit
                        }}</p>
                    </div>
                    <p class="text-3xl font-extrabold text-Grey-Velofeel dark:text-Dark-Grey">{{ velo3.prixProduit }} €</p>
                    <div class="font-OpenSans mt-8 mb-11 lg:mb-0">
                        <router-link :to="`/produitFiche3/${velo3.id}`" class="">
                            <p
                                class="btn-produit items-center text-center py-3 w-52 text-base font-bold text-Grey-Velofeel dark:text-Dark-Grey">
                                Plus d'info</p>
                        </router-link>
                    </div>
                </div>
                <div class="lg:mt-4 lg:w-[600px] w-[340px] mx-auto">
                    <img :src="velo3.imageProduit" alt="image d'un produit" class="">
                </div>
            </div>
        </div>
        <!-- quelques produits -->
        <div class="lg:mx-[10%] mx-4 lg:mt-24 text-Grey-Velofeel dark:text-Dark-Grey">
            <meta name="description" content="Présentation de quelques produits du magasin">
            <div>
                <h4 class="font-OpenSans font-bold text-2xl">Nos Produits en avant</h4>
                <div class="bar-title h-1 mt-2 w-[265px]"></div>
            </div>
            <!-- enssemble produit velo2 limité a  3 produit présenté-->
            <div
                class="lg:mt-16 flex flex-wrap justify-center md:gap-16 text-Grey-Velofeel dark:text-Dark-Grey font-OpenSans  ">
                <div class="mt-8 card_produit" v-for="velo2 in filterByName2" :key="velo2.id">
                    <img :src="velo2.imageProduit" class="w-[420px] h-[280px] rounded-t-lg" alt="photo du velo" />
                    <div class="border-t-0 border-[1px] pb-2 rounded-b-lg  border-gray-300">
                        <div class="flex justify-between">
                            <p class="ml-4 w-[220px] mt-3 text-lg font-semibold">{{ velo2.nomProduit }}</p>
                            <div class="flex">
                                <p class="mr-4  mt-3 text-sm font-light">{{ velo2.typeProduit }}</p>
                                <p class="mr-4  mt-3 text-sm font-light">{{ velo2.tailleProduit }}</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="ml-4  text-lg font-extrabold">{{ velo2.prixProduit }} €</p>
                            <router-link :to="`/produitFiche2/${velo2.id}`"
                                class="mr-4 py-1 px-2 font-overpass font-sm btn-produit-p">Voir le
                                produit</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Présentation Facebook a metre en avant -->
        <div class="lg:mx-[10%] mx-4 mt-16 text-Grey-Velofeel dark:text-Dark-Grey ">
            <meta name="description" content="Présentation de nos réseaux sociaux, facebook et instagram">
            <h4 class="font-overpass md:text-[50px] text-4xl  mt-4 lg:mt-0 font-bold">
                Nous retrouver sur nos réseaux</h4>
            <div class="lg:mt-16 mt-4 flex flex-col lg:flex-row justify-center lg:gap-16 gap-4">
                <div class="flex justify-center">
                    <iframe class="lg:w-[500px] lg:h-[500px] h-[350px] w-[350px]" title="Facebook"
                        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FVELOFEEL&tabs=timeline&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"></iframe>
                </div>
                <div>
                    <div class="">
                        <p class="font-OpenSans lg:mr-40">Pour suivre toute les actualités du magasin Vélofeel, n'hésitez
                            pas a
                            venir nous voir sur notre page Facebook.</p>
                        <div
                            class=" font-OpenSans lg:mt-8 mt-4  lg:mb-0 btn-facebook text-center py-3 w-52 text-base font-bold ">
                            <a href="https://www.facebook.com/VELOFEEL" class="flex justify-center gap-4 items-center"
                                target="_blank">
                                <LogoFB class=""></LogoFB>
                                <p class="">
                                    Nous rejoindre
                                </p>
                            </a>
                        </div>
                    </div>
                    <div class="lg:mt-16 mt-4  ">
                        <p class="font-OpenSans lg:mr-40">Pour suivre plus en détail l'aventure Vélofeel, n'hésitez
                            pas a
                            venir nous voir sur notre Instagram.</p>
                        <div
                            class=" font-OpenSans lg:mt-8 mt-4  lg:mb-0 btn-facebook text-center py-3 w-52 text-base font-bold ">
                            <a href="https://www.instagram.com/velofeel/" class="flex justify-center gap-4 items-center"
                                target="_blank">
                                <LogoInsta class=""></LogoInsta>
                                <p class="">
                                    Nous rejoindre
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<style>
.bar-title {
    background-image: linear-gradient(90deg, #D90429, #F8344C);
    border-radius: 2px;
}

.btn-produit {
    border: 2px solid #F8344C;
    border-radius: 8px;
    transition: .4s;
}

.btn-produit:hover {
    background-color: #F8344C;
    color: white;

}


.btn-facebook {
    border: 2px solid #8D99AE;
    border-radius: 8px;
    transition: .4s;
}

.btn-facebook:hover {
    background-color: #8D99AE;
    color: white;

}


/* SLIDER MARQUE */

@-webkit-keyframes scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(calc(-250px * 7));
    }
}

@keyframes scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(calc(-250px * 7));
    }
}

.slider {
    background: white;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.125);
    height: 100px;

    overflow: hidden;
    position: relative;
    width: 100%;
}

.slider::before,
.slider::after {
    background: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 100%);
    content: "";
    height: 100px;
    position: absolute;
    width: 35px;
    z-index: 2;
}

.slider::after {
    right: 0;
    top: 0;
    transform: rotateZ(180deg);
}

.slider::before {
    left: 0;
    top: 0;
}

.slider .slide-track {
    -webkit-animation: scroll 40s linear infinite;
    animation: scroll 40s linear infinite;
    display: flex;
    width: calc(250px * 14);
}

.slider .slide {
    height: 100px;
    width: 250px;
}
</style>
