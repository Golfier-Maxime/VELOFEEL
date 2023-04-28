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
            refVelo: null,
            message: null, // Message de connexion
            Connected: false,
            img_Prod: null
        };
    },

    mounted() {
        this.getVeloSynchro();

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

    },
};
</script>

<template>
    <div class="lg:mx-20 mx-4">
        <!-- titre -->
        <div>
            <h1
                class="text-Grey-Velofeel dark:text-Dark-Grey lg:text-[100px] text-[50px] font-extrabold  text-center font-overpass leading-tight">
                Vélofeel</h1>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[80px] text-4xl text-center font-overpass leading-tight">
                Nos Produits</h2>
        </div>

        <!-- fleche rouge qui montre en bas -->
        <div class="flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="arrow down">
        </div>
        <div class="flex lg:flex-row flex-col">
            <!-- Filtrage par Nom en Input -->
            <div class="w-[280px] lg:ml-32  mt-16 text-Grey-Velofeel dark:text-Dark-Grey ">
                <div class="search text-Dark-Grey">
                    <input type="text" class="searchTerm border-3 border-Dark-Grey" placeholder="Filtrez par nom"
                        v-model="filter">
                    <button type="submit"
                        class="searchButton text-Dark-Grey dark:text-Grey-Velofeel dark:bg-Dark-Grey bg-Grey-Velofeel border-2 dark:border-Dark-Grey border-Grey-Velofeel">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
        <!-- LISTE VELO / PRODUIT -->
        <div class="mt-16 flex flex-wrap justify-center gap-16 text-Grey-Velofeel dark:text-Dark-Grey font-OpenSans  ">
            <div class="mt-8 card_produit " v-for="velo in filterByName" :key="velo.id">
                <img :src="velo.imageProduit" class="w-[330px] h-[220px] rounded-t-lg" />
                <div class="border-t-0 border-[1px] pb-2 rounded-b-lg  border-gray-300">
                    <div class="flex justify-between">
                        <p class="ml-4 w-[220px] mt-3 text-lg font-semibold">{{ velo.nomProduit }}</p>
                        <div class="flex">
                            <p class="mr-4  mt-3 text-sm font-light">{{ velo.typeProduit }}</p>
                            <p class="mr-4  mt-3 text-sm font-light">{{ velo.tailleProduit }}</p>
                        </div>

                    </div>
                    <div class="flex justify-between">
                        <p class="ml-4  text-lg font-extrabold">{{ velo.prixProduit }} €</p>
                        <router-link :to="`/produitFiche/${velo.id}`"
                            class="mr-4 py-1 px-2 font-overpass font-sm btn-produit-p">Voir le
                            produit</router-link>
                    </div>
                    <!-- <p class="text-center text-lg">{{ velo.descProduit }}</p> -->
                </div>
            </div>
        </div>
    </div>
</template>



<style >
.card_produit {
    transition: .3s;
}

.card_produit:hover {
    scale: 1.05;

}

.btn-produit-p {
    border: 2px solid #F8344C;
    border-radius: 8px;
    transition: .4s;
}

.btn-produit-p:hover {
    background-color: #F8344C;
    color: white;

}


.search {
    display: flex;
}

.searchTerm {
    width: 100%;
    padding: 5px;
    height: 36px;
    border-radius: 5px 0px 0px 5px;
}

.searchButton {
    width: 40px;
    height: 36px;
    text-align: center;

    border-radius: 0px 5px 5px 0px;
    cursor: pointer;
    font-size: 20px;
}

/*Resize the wrap to see the search bar change!*/
</style>