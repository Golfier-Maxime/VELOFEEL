<script >

import axios from 'axios';

export default {

    data() {
        return {
            nom: '',
            prenom: '',
            email: '',
            objet: '',
            message: ''
        }
    },
    methods: {
        submitForm() {
            const data = {
                nom: this.nom,
                prenom: this.prenom,
                email: this.email,
                objet: this.objet,
                message: this.message
            };

            axios.post('https://api.sendinblue.com/v3/smtp/email', {
                sender: { name: data.nom, email: data.email },
                to: [{ email: 'contact.@maximegolfier.fr' }],
                subject: data.objet,
                htmlContent: data.message
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': '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'
                }
            }).then(response => {
                console.log(response);
                alert('Message envoyé avec succès !');
            }).catch(error => {
                console.log(error);
                alert('Une erreur s\'est produite lors de l\'envoi du message.');
            });
        }
    }
}
</script>

<template>
    <div class="lg:mx-20 mx-4 text-Grey-Velofeel dark:text-Dark-Grey">
        <!-- titre -->
        <div>
            <h1
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-[50px] text-center font-overpass leading-tight">
                Vélofeel</h1>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-4xl text-center font-overpass leading-tight">
                Nous contactez</h2>
        </div>
        <!-- fleche rouge -->
        <div class="flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="arrow down">
        </div>
        <!-- sous titre -->
        <div class="lg:mt-14 mt-11">
            <h3 class="text-Grey-Velofeel dark:text-Dark-Grey font-overpass font-extrabold lg:text-5xl text-2xl">Nous
                contactez avec
                nos
                adresses
            </h3>
        </div>
        <!-- info -->
        <div class="flex lg:flex-row flex-col justify-evenly mt-11 font-OpenSans">
            <!--Info Contact -->
            <div class="flex flex-col gap-3">
                <div>
                    <p></p>
                    <p>Tel : 03 81 30 91 59</p>
                </div>
                <div>
                    <p></p>
                    <a href="mailto:contact.clients@velofeel.com">
                        <p>Mail : contact.clients@velofeel.com</p>
                    </a>
                </div>
                <div>
                    <p></p>
                    <p>Lieu : 2 Boulevard Moïse Foglia 25400 Audincourt</p>
                </div>
            </div>
            <!-- Horraires -->
            <div>
                <p class="font-bold text-[20px] mt-11 lg:mt-0">Horaires</p>
                <div class="flex gap-4 ">
                    <div class="mt-4 lg:mt-0">
                        <p>Lundi :</p>
                        <p>Mardi :</p>
                        <p>Mercredi :</p>
                        <p>Jeudi :</p>
                        <p>Vendredi :</p>
                        <p>Samedi :</p>
                        <p>Dimanche :</p>
                    </div>
                    <div class="mt-4 lg:mt-0">
                        <p>Fermé</p>
                        <p>09:30-12:00, 14:00-19:00</p>
                        <p>09:30-12:00, 14:00-19:00</p>
                        <p>09:30-12:00, 14:00-19:00</p>
                        <p>09:30-12:00, 14:00-19:00</p>
                        <p>09:30-12:00, 14:00-19:00</p>
                        <p>Fermé</p>
                    </div>
                </div>
            </div>

        </div>
    <!-- google maps -->
    <div class="flex lg:gap-16 gap-4 flex-col lg:flex-row mt-16">
        <div>
            <h4
                class="mb-8 mt-11 lg:mt-0 text-Grey-Velofeel dark:text-Dark-Grey font-overpass font-extrabold lg:text-5xl text-2xl">
                Nous
                sommes ici
                !
            </h4>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5392.320575227619!2d6.8393929802201265!3d47.48679074281933!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47921750511bcc73%3A0x43fdf31f4bee52c!2sCycles+Thierry+Denis!5e0!3m2!1sfr!2sfr!4v1414766931647"
                frameborder="0" class="lg:w-[500px] w-[280px] h-[400px]"></iframe>
        </div>
        <div class="lg:w-[50%]">
            <!-- CONTACT FORM HERE -->
            <form action="/" method="POST" class="">
                <input type="hidden" name="access_key" value="  ">
                <div>
                    <label for="email"
                        class="block mb-2 mt-4 font-OpenSans font-bold text-Grey-Velofeel dark:text-Dark-Grey  duration-700">E-Mail</label>
                    <input type="email" id="email"
                        class="shadow-sm bg-gray-50 border font-OpenSans border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                        placeholder="Votre@adress.fr" required>
                </div>
                <div>
                    <label for="subject"
                            class="block mb-2 mt-4  font-OpenSans font-bold   text-Grey-Velofeel dark:text-Dark-Grey duration-700">Sujet
                            du mail</label>
                        <input type="text" id="subject"
                            class="block p-3 w-full mt-4 text-sm font-OpenSans bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                            placeholder="Quelle est votre demande ?" required>
                    </div>
                    <div class="sm:col-span-2">
                        <label for="message"
                            class="block mb-2 mt-4 font-OpenSans font-bold text-Grey-Velofeel dark:text-Dark-Grey   duration-700">Votre
                            message</label>
                        <textarea id="message" rows="6"
                            class="block p-2.5 w-full mt-4 font-OpenSans bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Message"></textarea>
                    </div>
                    <input type="hidden" name="redirect" value="https://web3forms.com/success">
                    <button type="submit" class="btn-produit px-12 py-2 font-OpenSans font-bold mt-4 ">Envoyer</button>
                </form>
            </div>
        </div>
        <!-- TEST -->
        <!-- <div>
                                    <form @submit.prevent="submitForm">
                                        <div>
                                            <label>Nom:</label>
                                            <input type="text" v-model="nom" required>
                                        </div>
                                        <div>
                                            <label>Prénom:</label>
                                            <input type="text" v-model="prenom" required>
                                        </div>
                                        <div>
                                            <label>Email:</label>
                                            <input type="email" v-model="email" required>
                                        </div>
                                        <div>
                                            <label>Objet:</label>
                                            <input type="text" v-model="objet" required>
                                        </div>
                                        <div>
                                            <label>Message:</label>
                                            <textarea v-model="message" required></textarea>
                                        </div>
                                        <div>
                                            <button type="submit">Envoyer</button>
                                        </div>
                                    </form>
                                </div> -->

    </div>
</template>

<style scoped></style>