<script >
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
    getDocs, // Obtenir la liste des documents d'une collection
    addDoc, // Ajouter un document à une collection
    updateDoc, // Mettre à jour un document dans une collection
    deleteDoc, // Supprimer un document d'une collection
    onSnapshot, // Demander une liste de documents d'une collection, en les synchronisant
    query, // Permet d'effectuer des requêtes sur Firestore
    orderBy, // Permet de demander le tri d'une requête query
    where,
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import { emitter } from "../main";

export default {
    name: "ListeVelo",
    data() {
        // Données de la vue
        return {
            listeVeloSynchro: [],
            user: {
                // user se connectant
                email: null,
                password: null,
            },
            message: null, // Message de connexion
            Connected: false,
        };
    },

    mounted() {
        this.getVeloSynchro();
        // this.getImageAxolott();
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

        async getVeloSynchro() {
            const firestore = getFirestore();
            const dbVelo = collection(firestore, "velo");
            const query = await onSnapshot(dbVelo, (snapshot) => {
                this.listeVeloSynchro = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            });
        },
        async createVelo() {
            const firestore = getFirestore()
            const dbVelo = collection(firestore, "velo");
            const docRef = await addDoc(dbVelo, {
                nom: this.nom,
            });
            console.log("document créé avec le id : ", docRef.id);
        },
        async updateVelo(quetes) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo", quetes.id);
            await updateDoc(docRef, {
                nom: quetes.nom,
            });
        },
        async deleteVelo(quetes) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo", quetes.id);
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
    },
};


</script>

<template>
    <div class="mt-16">
        <!--  -->
        <form @submit.prevent="onCnx" class="flex flex-col justify-center" v-if="!Connected">
            <div class="">
                <div class="">
                    <button class="text-Grey-Velofeel dark:text-Dark-Grey ">Email</button>
                </div>
                <input class="text-black" type="text" v-model="user.email" required />
            </div>
            <div class="">
                <div class="">
                    <button class="text-white">Mot de passe</button>
                </div>
                <input class="text-black" type="password" v-model="user.password" required />
            </div>
            <div class="flex justify-center">
                <button class="bouton_deco mt-4" type="submit">Se connecter</button>
            </div>
        </form>
        <button class="bouton_deco" @click="onDcnx" v-if="Connected">Se deconnecter</button>
        <!--  -->
        <!-- LISTE VELO / PRODUIT -->
        <div class="mt-16">
            <div v-for="velo in listeVeloSynchro">
                <p class="text-black">Le nom du produit est : {{ velo.nomProduit }}</p>
                <p class="text-black">La description du produit : {{ velo.descProduit }}</p>
            </div>
        </div>
        <!--  -->
    </div>
</template>


<style scoped>
.bouton_deco {
    background-color: cyan;
    border: none;
    color: white;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
    box-shadow: 1px 1px 1px black;
}
</style>