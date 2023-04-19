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
            imageData2: null,
            imageData3: null,
            filter: "",
            // liste
            listeVeloSynchro: [],
            listeVelo2Synchro: [],
            listeVelo3Synchro: [],
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
            refVelo: null,
            message: null, // Message de connexion
            Connected: false,
            img_Prod: null
        };
    },

    mounted() {
        this.getVeloSynchro();
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
        this.getVelo(this.$route.params.id)
        this.getVelo2(this.$route.params.id)
        this.getVelo3(this.$route.params.id)
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
                    this.imageData2 = e.target.result;
                };
                // Demarrage du reader pour la transformer en data URL (format base 64)
                reader.readAsDataURL(input.files[0]);
            }
        },
        // velo3
        previewImage3: function (event) {
            // Mise à jour de la photo du Produit
            this.file = this.$refs.file.files[0];
            // Récupérer le nom du fichier pour la photo du Produit
            this.velo3.imageProduit = this.file.name;
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
                    this.imageData3 = e.target.result;
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
            await uploadString(refStorage, this.imageData2, "data_url").then((snapshot) => {
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
        // velo3
        async createVelo3() {
            // Obtenir storage Firebase
            const storage = getStorage();
            const firestore = getFirestore()
            // Référence de l'image à uploader
            const refStorage = ref(storage, "VELOFEEL/" + this.velo3.imageProduit);
            // Upload de l'image sur le Cloud Storage
            await uploadString(refStorage, this.imageData3, "data_url").then((snapshot) => {
                console.log("Uploaded a base64 string");
                // Création du velo sur le Firestore
                const db = getFirestore();
                const docRef = addDoc(collection(db, "velo3"), this.velo3);
            });
            const dbVelo2 = collection(firestore, "velo3");
            const docRef = await addDoc(dbVelo3, {
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
        // velo3
        async updateVelo3(velo3) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo3", velo3.id);
            await updateDoc(docRef, {
                nomProduit: velo3.nomProduit,
                descProduit: velo3.descProduit,
                prixProduit: velo3.prixProduit,
                typeProduit: velo3.typeProduit,
                imageProduit: velo3.imageProduit,
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
        // velo3
        async deleteVelo3(velo3) {
            const firestore = getFirestore();
            const docRef = doc(firestore, "velo3", velo3.id);
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
    <div class="lg:mx-20 mx-4">
        <!-- titre -->
        <div>
            <h1
                class="text-Grey-Velofeel dark:text-Dark-Grey lg:text-[100px] text-[50px] font-extrabold  text-center font-overpass leading-tight">
                Vélofeel</h1>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[80px] text-4xl text-center font-overpass leading-tight">
                Le produit phare</h2>
        </div>
        <!-- fleche rouge qui montre en bas -->
        <div class="flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="">
        </div>
        <!-- fiche produit -->
        <div class="mt-16 flex flex-col-reverse lg:flex-row justify-evenly">
            <div class="flex flex-col gap-2">
                <p class="text-[50px] font-overpass font-extrabold text-Grey-Velofeel dark:text-Dark-Grey">{{
                    velo3.nomProduit }}
                </p>
                <p class="text-xl font-light text-Grey-Velofeel dark:text-Dark-Grey">{{ velo3.typeProduit }}</p>
                <p class="mr-16 text-lg text-Grey-Velofeel dark:text-Dark-Grey">{{ velo3.descProduit }}</p>
                <p class="text-3xl font-extrabold text-Grey-Velofeel dark:text-Dark-Grey">{{ velo3.prixProduit }} €</p>
            </div>
            <img :src="img_Prod" class="lg:w-1/2" />
        </div>




    </div>
</template>