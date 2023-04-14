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
    name: "ListeVelo",
    data() {
        // Données de la vue
        return {
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
            },
            refVelo: null,
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
        async createVelo() {
            const firestore = getFirestore()
            const dbVelo = collection(firestore, "velo");
            const docRef = await addDoc(dbVelo, {
                nomProduit: this.nomProduit,
            });
            console.log("document créé avec le id : ", docRef.id);
        },
        async updateVelo(velo) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo", velo.id);
            await updateDoc(docRef, {
                nomProduit: velo.nomProduit,
            });
        },
        async deleteVelo(velo) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo", velo.id);
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
    <div class="mt-16 mx-20 text-black">
        <!--  -->
        <form @submit.prevent="onCnx" class="flex flex-col items-center mt-4" v-if="!Connected">
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
        <div class="flex gap-2">
            <div class="">
                <span class="text-black">Filtrage</span>
            </div>
            <div class="flex justify-center gap-4">
                <input type="text" class="" v-model="filter" />
                <button class="bouton_liste" type="submit" title="Création">Filtrer</button>
            </div>
        </div>
        <!--  -->
        <tbody class="">
            <tr v-for="velo in filterByName" :key="velo.id">
                <td>
                    <form class="mt-8">
                        <div class="flex gap-2 ">
                            <div class="flex flex-col gap-1 justify-center">
                                <div>
                                    <p class="">Nom du velo</p>
                                    <input type="text" class="" v-model="velo.nomProduit" required />
                                </div>

                                <div>
                                    <p class="">Prix du velo en €</p>
                                    <input type="text" class="" v-model="velo.prixProduit" required />
                                </div>
                                <div>
                                    <p class="">Type du velo</p>
                                    <input type="text" class="" v-model="velo.typeProduit" required />
                                </div>
                            </div>

                            <div class="mt-2 mb-2 flex justify-center w-[320px]">
                                <img :src="velo.imageProduit" alt="" />
                            </div>
                            <div class="flex justify-center gap-4 ">
                                <button class="bouton_liste" type="submit" title="Création"
                                    @click.prevent="updateVelo(velo)">MODIFIER</button>
                                <button class="bouton_liste" type="submit" title="Suppression"
                                    @click.prevent="deleteVelo(velo)">SUPPRIMER</button>
                            </div>
                        </div>
                        <div>
                            <p class="">Description du velo</p>
                            <textarea type="text" class="" v-model="velo.descProduit" required cols="40"
                                rows="4"> </textarea>
                        </div>
                    </form>
                </td>
            </tr>
        </tbody>

        <!-- LISTE VELO / PRODUIT -->
        <div class="mt-16 flex gap-16">
            <div class="mt-8" v-for="velo in filterByName" :key="velo.id">
                <p class=" text-black">Le nom du produit est : {{ velo.nomProduit }}</p>
                <p class="text-black">La description du produit : {{ velo.descProduit }}</p>
                <p class="text-black">le prix du produit est : {{ velo.prixProduit }}€</p>
                <p class="text-black">le type du produit est : {{ velo.typeProduit }}</p>
                <img :src="velo.imageProduit" class="w-[300px]" />

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