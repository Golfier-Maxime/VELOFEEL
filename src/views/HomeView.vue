<script setup>
import LogoFB from '@/components/logo/facebook.vue';
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
            imageData: null,
            filter: "",
            // liste
            listeVeloSynchro: [],
            listeVelo2Synchro: [],
            user: {
                // user se connectant
                email: null,
                password: null,
            },
            velo: {
                nomProduit: null,
                descProduit: null,
                prixProduit: null,
                typeProduit: null,
                imageProduit: null,
            },
            velo2: {
                nomProduit: null,
                descProduit: null,
                prixProduit: null,
                typeProduit: null,
            },
            refVelo: null,
            message: null, // Message de connexion
            Connected: false,
            img_Prod: null
        };
    },

    mounted() {
        this.getVeloSynchro();
        this.getVelo2Synchro();
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
        this.getVelo(this.$route.params.id)
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
        // avoir info pour le produit
        async getVelo(id) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo", id);
            this.refVelo = await getDoc(docRef);
            if (this.refVelo.exists()) {
                this.velo = this.refVelo.data();
                this.img_Prod = this.velo.imageProduit;

            }
            else {
                this.console.log("Velo Inexistant");
            }
            const storage = getStorage();
            const spaceRef = ref(storage, 'VELOFEEL/' + this.velo.imageProduit);
            getDownloadURL(spaceRef)
                .then((url) => {
                    this.img_Prod = url;
                })

        },


        async getVeloSynchro() {
            const firestore = getFirestore();
            const dbVelo = collection(firestore, "velo");
            const query = await onSnapshot(dbVelo, (snapshot) => {
                this.listeVeloSynchro = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }
                ))
                // récupération des images des produit/velo
                // parcours de la liste 
                this.listeVeloSynchro.forEach(function (velo) {
                    const storage = getStorage();
                    //récup des l'image par son nom de fichier
                    const spaceRef = ref(storage, 'VELOFEEL/' + velo.imageProduit);
                    //recup de l'url de l'image
                    getDownloadURL(spaceRef).then((url) => {
                        //on remplace le nom du fichier
                        // par l'url complete de l'image
                        velo.imageProduit = url;
                    })
                        .catch((error) => {
                            console.log('erreur downloadUrl', error);
                        })
                })
            });

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

        previewImage: function (event) {
            // Mise à jour de la photo du Produit
            this.file = this.$refs.file.files[0];
            // Récupérer le nom du fichier pour la photo du Produit
            this.velo.imageProduit = this.file.name;
            // Reference to the DOM input element
            // Reference du fichier à prévisualiser
            var input = event.target;
            // On s'assure que l'on a au moins un fichier à lire
            if (input.files && input.files[0]) {
                // Creation d'un filereader
                // Pour lire l'image et la convertir en base 64
                var reader = new FileReader();
                // fonction callback appellée lors que le fichier a été chargé
                reader.onload = (e) => {
                    // Read image as base64 and set to imageData
                    // lecture du fichier pour mettre à jour
                    // la prévisualisation
                    this.imageData = e.target.result;
                };
                // Demarrage du reader pour la transformer en data URL (format base 64)
                reader.readAsDataURL(input.files[0]);
            }
        },
        // velo2
        previewImage2: function (event) {
            // Mise à jour de la photo du Produit
            this.file = this.$refs.file.files[0];
            // Récupérer le nom du fichier pour la photo du Produit
            this.velo2.imageProduit = this.file.name;
            // Reference to the DOM input element
            // Reference du fichier à prévisualiser
            var input = event.target;
            // On s'assure que l'on a au moins un fichier à lire
            if (input.files && input.files[0]) {
                // Creation d'un filereader
                // Pour lire l'image et la convertir en base 64
                var reader = new FileReader();
                // fonction callback appellée lors que le fichier a été chargé
                reader.onload = (e) => {
                    // Read image as base64 and set to imageData
                    // lecture du fichier pour mettre à jour
                    // la prévisualisation
                    this.imageData = e.target.result;
                };
                // Demarrage du reader pour la transformer en data URL (format base 64)
                reader.readAsDataURL(input.files[0]);
            }
        },


        async createVelo() {
            // Obtenir storage Firebase
            const storage = getStorage();
            const firestore = getFirestore()
            // Référence de l'image à uploader
            const refStorage = ref(storage, "VELOFEEL/" + this.velo.imageProduit);
            // Upload de l'image sur le Cloud Storage
            await uploadString(refStorage, this.imageData, "data_url").then((snapshot) => {
                console.log("Uploaded a base64 string");
                // Création du velo sur le Firestore
                const db = getFirestore();
                const docRef = addDoc(collection(db, "velo"), this.velo);
            });
            const dbVelo = collection(firestore, "velo");
            const docRef = await addDoc(dbVelo, {
                nomProduit: this.nomProduit,
                descProduit: this.descProduit,
                prixProduit: this.prixProduit,
                typeProduit: this.typeProduit,
                imageProduit: this.imageProduit,
            });
            console.log("document créé avec le id : ", docRef.id);
        },
        // velo2
        async createVelo2() {
            // Obtenir storage Firebase
            const storage = getStorage();
            const firestore = getFirestore()
            // Référence de l'image à uploader
            const refStorage = ref(storage, "VELOFEEL/" + this.velo2.imageProduit);
            // Upload de l'image sur le Cloud Storage
            await uploadString(refStorage, this.imageData, "data_url").then((snapshot) => {
                console.log("Uploaded a base64 string");
                // Création du velo sur le Firestore
                const db = getFirestore();
                const docRef = addDoc(collection(db, "velo2"), this.velo2);
            });
            const dbVelo2 = collection(firestore, "velo2");
            const docRef = await addDoc(dbVelo2, {
                nomProduit: this.nomProduit,
                descProduit: this.descProduit,
                prixProduit: this.prixProduit,
                typeProduit: this.typeProduit,
                imageProduit: this.imageProduit,
            });
            console.log("document créé avec le id : ", docRef.id);
        },

        async updateVelo(velo) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo", velo.id);
            await updateDoc(docRef, {
                nomProduit: velo.nomProduit,
                descProduit: velo.descProduit,
                prixProduit: velo.prixProduit,
                typeProduit: velo.typeProduit,
                imageProduit: velo.imageProduit,
            });
        },
        // velo2
        async updateVelo2(velo2) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo2", velo2.id);
            await updateDoc(docRef, {
                nomProduit: velo2.nomProduit,
                descProduit: velo2.descProduit,
                prixProduit: velo2.prixProduit,
                typeProduit: velo2.typeProduit,
                imageProduit: velo2.imageProduit,
            });
        },

        async deleteVelo(velo) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo", velo.id);
            await deleteDoc(docRef);
        },
        // velo2
        async deleteVelo2(velo2) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo2", velo2.id);
            await deleteDoc(docRef);
        },
    },



    computed: {
        // Tri des pays par nom en ordre croissant
        orderByName: function () {
            // Parcours et tri des pays 2 à 2
            return this.listeVeloSynchro.sort(function (a, b) {
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

        // Filtrage de la propriété calculée de tri
        filterByName: function () {
            // On effectue le fitrage seulement si le filtre est rnseigné
            if (this.filter.length > 0) {
                // On récupère le filtre saisi en minuscule (on évite les majuscules)
                let filter = this.filter.toLowerCase();
                // Filtrage de la propriété calculée de tri
                return this.orderByName.filter(function (velo) {
                    // On ne renvoie que les pays dont le nom contient
                    // la chaine de caractère du filtre
                    return velo.nomProduit.toLowerCase().includes(filter);
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
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[80px] text-4xl text-center font-overpass leading-tight">
                à
                Audincourt</h2>
            <p
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[24px]  text-center font-overpass leading-tight">
                Du Mardi au
                Samedi de 9:30-12:00 à 14:00-19:00</p>
        </div>
        <!-- Slider automatic et infini de quelque marque associé -->
        <div class="slider mt-10">
            <div class="slide-track flex gap-5 ml-40">
                <div class="slide">
                    <img src="/images/logo_cannondale.png" height="100" width="250" alt="" class="mt-8" />
                </div>
                <div class="slide">
                    <img src="/images/logo_Giant.png" height="100" width="250" alt="" class="mt-7" />
                </div>
                <div class="slide">
                    <img src="/images/logo_ktm2.jpg" height="100" width="150" alt="" class="mt-2" />
                </div>
                <div class="slide">
                    <img src="/images/logo_Thule.png" height="100" width="200" alt="" class="ml-[-80px] mt-[-10px]" />
                </div>
                <div class="slide">
                    <img src="/images/logo_peugeot.png" height="100" width="300" alt="" class="mt-4 ml-[-80px]" />
                </div>
                <div class="slide">
                    <img src="/images/logo_shimano.png" height="100" width="300" alt="" class="mt-7 ml-[-60px]" />
                </div>
                <div class="slide">
                    <img src="/images/logo_pro.jpg" height="100" width="150" alt="" class="mt-4 ml-[-30px]" />
                </div>
                <div class="slide">
                    <img src="/images/logo_lazer.png" height="100" width="250" alt="" class="mt-[-20px] ml-[-100px]" />
                </div>
            </div>
        </div>
        <div class="flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="">
        </div>
        <!-- Présentation produit a metre en avant -->
        <div
            class="lg:mx-[10%] mx-4 mt-16 text-Grey-Velofeel dark:text-Dark-Grey flex lg:flex-row flex-col-reverse justify-evenly ">
            <div>
                <h4 class="font-overpass lg:text-[50px] text-4xl mt-4 lg:mt-0 font-bold">Produit - Velo
                    Marque</h4>
                <p class="font-OpenSans lg:mr-40">Descrption : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus
                    ultricies quam in magna
                    congue vestibulum. Donec malesuada luctus dolor eu viverra. Nulla tincidunt facilisis sapien, non
                    tristique
                    mi volutpat quis. </p>
                <div class="font-OpenSans mt-11 mb-11 lg:mb-0">
                    <router-link to="/contact" class="">
                        <p class="btn-produit text-center py-3 w-52 text-base font-bold">Plus d'info</p>
                    </router-link>
                </div>
            </div>
            <div class="w-full ">
                <img src="/images/PLACEHOLDER.jpg" alt="">
            </div>
        </div>
        <!-- quelques produits -->
        <div class="lg:mx-[10%] mx-4 lg:mt-24 text-Grey-Velofeel dark:text-Dark-Grey">
            <div>
                <h4 class="font-OpenSans font-bold text-2xl">Nos Produits en avant</h4>
            </div>
            <!-- enssemble produit velo2 limité a 6 ou 3 produit présenté-->
            <div class="mt-16 flex flex-wrap justify-center gap-16 text-Grey-Velofeel dark:text-Dark-Grey font-OpenSans  ">
                <div class="mt-8 card_produit" v-for="velo2 in filterByName2" :key="velo2.id">
                    <img :src="velo2.imageProduit" class="w-[330px] h-[220px] rounded-t-lg" />
                    <div class="border-t-0 border-[1px] pb-2 rounded-b-lg  border-gray-300">
                        <div class="flex justify-between">
                            <p class="ml-4 mt-3 text-lg font-semibold">{{ velo2.nomProduit }}</p>
                            <p class="mr-4 mt-3 text-sm font-light">{{ velo2.typeProduit }}</p>
                        </div>
                        <div class="flex justify-between">
                            <p class="ml-4  text-lg font-extrabold">{{ velo2.prixProduit }}€</p>
                            <router-link :to="`/produitFiche/${velo2.id}`"
                                class="mr-4 py-1 px-2 font-overpass font-sm btn-produit-p">Voir le
                                produit</router-link>
                        </div>
                        <!-- <p class="text-center text-lg">{{ velo.descProduit }}</p> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- Présentation Facebook a metre en avant -->
        <div
            class="lg:mx-[10%] mx-4  mt-16 text-Grey-Velofeel dark:text-Dark-Grey flex lg:flex-row flex-col-reverse justify-evenly ">
            <div>
                <h4 class="font-overpass lg:text-[50px] text-4xl  mt-4 lg:mt-0 font-bold">Evènement
                    Facebook</h4>
                <p class="font-OpenSans lg:mr-40">Descrption : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus
                    ultricies quam in magna
                    congue vestibulum. Donec malesuada luctus dolor eu viverra. Nulla tincidunt facilisis sapien, non
                    tristique
                    mi volutpat quis. </p>
                <div class="font-OpenSans mt-11 mb-11 lg:mb-0 btn-facebook text-center py-3 w-52 text-base font-bold ">
                    <router-link to="/contact" class="flex justify-center gap-4">
                        <LogoFB class=""></LogoFB>
                        <p class="">
                            Nous rejoindre
                        </p>
                    </router-link>
                </div>
            </div>
            <div class="w-full ">
                <img src="/images/PLACEHOLDER.jpg" alt="">
            </div>
        </div>
        <!-- last fb post -->
        <div class="lg:mx-[10%] mx-4 lg:mt-24 text-Grey-Velofeel dark:text-Dark-Grey">
            <div>
                <h4 class="font-OpenSans font-bold text-lg">Nos derniers posts</h4>
            </div>
            <!-- ensemble post -->
            <div class="flex flex-wrap justify-between">
                <!-- post -->
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/post_fb.jpg" alt="" class="lg:w-[300px]">
                    <h5 class="font-OpenSans font-bold text-center">KTM</h5>
                    <p class="font-OpenSans lg:w-[300px] ">Macina Kapoho 7972

                        Un VTTAE passe partout en 160mm de
                        débattement.
                        Que ça grimpe fort ou que ça descende vite,
                        le plaisir sera au rendez-vous.</p>
                </div>
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/post_fb.jpg" alt="">
                    <h5 class="font-OpenSans font-bold text-center">POST 2</h5>
                    <p class="font-OpenSans font-bold text-center">6 800 €</p>
                </div>
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/post_fb.jpg" alt="">
                    <h5 class="font-OpenSans font-bold text-center">POST 3</h5>
                    <p class="font-OpenSans font-bold text-center">6 800 €</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
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
