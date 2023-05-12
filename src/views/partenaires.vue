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
            listePartenaireSynchro: [],
            user: {
                // user se connectant
                email: null,
                password: null,
            },
            partenaire: {
                nomPartenaire: null,
                lienPartenaire: null,
                imagePartenaire: null,
            },
            refPartenaire: null,
            message: null, // Message de connexion
            Connected: false,
            img_Prod: null
        };
    },

    mounted() {
        this.getPartenaireSynchro();
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
        // avoir info pour le produit
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


        previewImage: function (event) {
            // Mise à jour de la photo du Produit
            this.file = this.$refs.file.files[0];
            // Récupérer le nom du fichier pour la photo du Produit
            this.partenaire.imagePartenaire = this.file.name;
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
    },
};

</script>


<template>
    <div class="lg:mx-20 mx-4">
        <!-- titre -->
        <div class="lg:mx-20 mx-4">
            <h1
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-[50px] text-center font-overpass leading-tight">
                Vélofeel
            </h1>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[80px] text-4xl text-center font-overpass leading-tight">
                Nos Partenaires</h2>
        </div>
        <div class="flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="arrow down" class="w-16">
        </div>

        <div class="text-Grey-Velofeel dark:text-Dark-Grey font-OpenSans md:text-xl text-lg mt-16 ">
            <p>Ici vous pourrez accéder par un simple clic aux sites et aux catalogues de nos principaux partenaires, et à
                l'exhaustivité des produits que nous sommes en mesure de vous proposer. Ce qui n'est pas en magasin, nous
                pouvons vous le fournir, n'hésitez pas à nous <router-link to="/contact"
                    class="underline underline-offset-4">contacter</router-link> même s'il s'agit d'une marque ne faisant
                pas partie
                ce cette liste.
            </p>
        </div>
        <!-- présentation des partenaires -->
        <!-- LISTE partenaire -->
        <div class="mt-16 flex flex-wrap justify-center gap-16 text-Grey-Velofeel dark:text-Dark-Grey font-OpenSans  ">
            <div class="mt-8 card_produit " v-for="partenaire in filterByName" :key="partenaire.id">

                <img :src="partenaire.imagePartenaire" class="w-[330px]  rounded-t-lg bg-white py-4 px-4" />
                <div class="border-t-0 border-[1px] pb-2 rounded-b-lg  border-gray-300">
                    <div class="flex justify-between">
                        <p class="ml-4 w-[220px] mt-3 text-lg font-semibold">{{ partenaire.nomPartenaire }}</p>
                    </div>
                    <div class="flex justify-end">
                        <a :href="partenaire.lienPartenaire" target="_blank"
                            class="mr-4 py-1 px-2 font-overpass font-sm btn-produit-p">
                            Voir le site</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.partenaires {
    background-color: white;
    padding-top: 40px;
    margin-top: 64px;
    padding-bottom: 40px;



}
</style>