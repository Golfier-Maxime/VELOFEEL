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
            imageData3: null,
            filter: "",
            // liste
            listeVelo3Synchro: [],
            user: {
                // user se connectant
                email: null,
                password: null,
            },
            velo3: {
                nomProduit: null,
                descProduit: null,
                prixProduit: null,
                typeProduit: null,
                lienProduit: null,
                tailleProduit: null,
            },
            refVelo: null,
            message: null, // Message de connexion
            Connected: false,
            img_Prod: null
        };
    },

    mounted() {
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
                lienProduit: this.lienProduit,
                tailleProduit: this.tailleProduit,
            });
            console.log("document créé avec le id : ", docRef.id);
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
                lienProduit: velo3.lienProduit,
                tailleProduit: velo3.tailleProduit,
            });
        },

        // velo3
        async deleteVelo3(velo3) {
            let text = "Press a button!\nEither OK or Cancel.";
            if (confirm(text) == true) {
                const firestore = getFirestore();
                const docRef = doc(firestore, "velo3", velo3.id);
                await deleteDoc(docRef);
            } else {

            }
        },
    },



    computed: {
        // Tri des pays par nom en ordre croissant
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
    <div class=" lg:mx-20 mx-4 text-Grey-Velofeel dark:text-Dark-Grey font-OpenSans">
        <!-- titre -->
        <div>
            <h1
                class="text-Grey-Velofeel dark:text-Dark-Grey lg:text-[100px] text-[50px] font-extrabold  text-center font-overpass leading-tight">
                Vélofeel</h1>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[80px] text-4xl text-center font-overpass leading-tight">
                Privatezone pour le produits phare sur la page d'accueil</h2>
        </div>
        <!-- Connection / Déconection -->
        <form @submit.prevent="onCnx" class="flex flex-col items-center mt-16" v-if="!Connected">
            <div class="">
                <div class="">
                    <button class="text-Grey-Velofeel dark:text-Dark-Grey ">Email</button>
                </div>
                <input class="text-black w-[320px]" type="text" v-model="user.email" required />
            </div>
            <div class="">
                <div class="">
                    <button class="text-Grey-Velofeel dark:text-Dark-Grey">Mot de passe</button>
                </div>
                <input class="text-black w-[320px]" type="password" v-model="user.password" required />
            </div>
            <div class="flex justify-center font-bold">
                <button class="bouton_deco mt-4" type="submit">Se connecter</button>
            </div>
        </form>
        <div class="flex justify-center mt-16">
            <button class="bouton_deco" @click="onDcnx" v-if="Connected">Se deconnecter</button>
        </div>
        <!-- Création Produit -->
        <form enctype="multipart/form-data" @submit.prevent="createVelo3" class="mb-32 mt-16" v-if="Connected">
            <div class="">
                <h2 class="shadow_text text-center font-prompt text-[30px]  font-bold">Création Velo</h2>
                <div class="line mx-auto"></div>
            </div>
            <!-- nom velo -->
            <div>
                <p class="shadow_text mt-8 text-center font-prompt text-[18px] font-bold">Nom de Velo</p>
                <input class="mx-auto flex justify-center w-[320px]" placeholder="Nom" v-model="velo3.nomProduit"
                    required />
            </div>
            <!-- desc velo -->
            <div>
                <p class="shadow_text mt-8 text-center font-prompt text-[18px] font-bold">Description de Velo</p>
                <textarea type="text" class="mx-auto flex justify-center" v-model="velo3.descProduit"
                    placeholder="Description" required cols="40" rows="4"> </textarea>
            </div>
            <!-- prix velo -->
            <div>
                <p class="shadow_text mt-8 text-center font-prompt text-[18px] font-bold">Prix du Velo</p>
                <input class="mx-auto flex justify-center w-[320px]" placeholder="Prix" v-model="velo3.prixProduit"
                    required />
            </div>
            <!-- Lien velo -->
            <div>
                <p class="shadow_text mt-8 text-center font-prompt text-[18px] font-bold">lien de la fiche technique</p>
                <input class="mx-auto flex justify-center w-[320px]" placeholder="Lien" v-model="velo3.lienProduit"
                    required />
            </div>
            <!-- Taille velo -->
            <div>
                <p class="shadow_text mt-8 text-center font-prompt text-[18px] font-bold">taille du velo</p>
                <input class="mx-auto flex justify-center w-[320px]" placeholder="Taille" v-model="velo3.tailleProduit"
                    required />
            </div>
            <!-- type velo -->
            <div>
                <p class="shadow_text mt-8 text-center font-prompt text-[18px] font-bold">Type de Velo</p>
                <input class="mx-auto flex justify-center w-[320px]" placeholder="Type" v-model="velo3.typeProduit"
                    required />
            </div>
            <div>
                <p class="shadow_text mt-2 text-center font-prompt text-[18px] font-bold">Image</p>
                <div class="flex justify-center">
                    <img class="preview img-fluid w-2/4" :src="imageData3" />
                </div>
            </div>
            <div class="custom-file mt-2 flex justify-center">
                <input type="file" class="custom-file-input" ref="file" id="file" @change="previewImage3" />
                <label class="custom-file-label" for="file">Sélectionner l'image</label>
            </div>


            <div class="mt-2 flex justify-center gap-4 pb-16">
                <button type="submit" class="bouton_liste2 font-bold">Créer</button>
                <button @click="reloadPage">Annuler</button>
            </div>
        </form>

        <!-- Filtrage par Nom en Input -->
        <div class="flex gap-2 mt-4" v-if="Connected">
            <div class="">
                <span class="">Filtrage</span>
            </div>
            <div class="flex justify-center gap-4">
                <input type="text" class="" v-model="filter" />
                <button class="bouton_liste" type="submit" title="Création">Filtrer</button>
            </div>
        </div>

        <!--Liste des vélo modifiable / Supprimable  -->
        <tbody class="flex flex-wrap gap-8 justify-center" v-if="Connected">
            <tr v-for="velo3 in filterByName3" :key="velo3.id">
                <td>
                    <form class="mt-8">
                        <div class="flex gap-2 ">
                            <div class="flex flex-col gap-1 justify-center">
                                <div>
                                    <p class="">Nom du velo</p>
                                    <input type="text" class="w-[320px]" v-model="velo3.nomProduit" required />
                                </div>

                                <div>
                                    <p class="">Prix du velo en €</p>
                                    <input type="text" class="w-[320px]" v-model="velo3.prixProduit" required />
                                </div>
                                <div>
                                    <p class="">Type du velo</p>
                                    <input type="text" class="w-[320px]" v-model="velo3.typeProduit" required />
                                </div>
                                <div>
                                    <p class="">Lien du velo</p>
                                    <input type="text" class="w-[320px]" v-model="velo3.lienProduit" required />
                                </div>
                                <div>
                                    <p class="">Taille du velo</p>
                                    <input type="text" class="w-[320px]" v-model="velo3.tailleProduit" required />
                                </div>
                            </div>
                        </div>
                        <div class="mt-2 mb-2 flex justify-center w-[320px]">
                            <img :src="velo3.imageProduit" alt="image du produit" />
                        </div>

                        <div>
                            <p class="">Description du velo</p>
                            <textarea type="text" class="" v-model="velo3.descProduit" required cols="40"
                                rows="4"> </textarea>
                        </div>
                        <div class="flex justify-center gap-4 ">
                            <button class="bouton_liste2 font-bold" type="submit" title="Création"
                                @click.prevent="updateVelo3(velo3)">MODIFIER</button>
                            <button class="bouton_liste font-bold" type="submit" title="Suppression"
                                @click.prevent="deleteVelo3(velo3)">SUPPRIMER</button>
                        </div>
                    </form>
                </td>
            </tr>
        </tbody>


    </div>
</template>


<style scoped>
.bouton_liste {
    background-color: red;
    border: none;
    color: white;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
    box-shadow: 1px 1px 1px black;
}

.bouton_liste2 {
    background-color: blue;
    border: none;
    color: white;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
    box-shadow: 1px 1px 1px black;
}

.bouton_deco {
    background-color: blue;
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