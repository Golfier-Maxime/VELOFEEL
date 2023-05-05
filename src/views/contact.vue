<script >
const WEB3FORMS_ACCESS_KEY = "9c321c59-ff81-44c6-84bf-8b67767510ec";

export default {
    data() {
        return {
            name: "",
            email: "",
            message: "",
        };
    },
    methods: {

        async submitForm() {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name: this.name,
                    email: this.email,
                    message: this.message,
                }),
            });
            const result = await response.json();
            if (result.success) {
                console.log(result);
            }
        },
        async myFunction() {
            alert("Votre message a été envoyé");
        },
    },
};
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
                Nous contacter</h2>
        </div>
        <!-- fleche rouge -->
        <div class="flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="arrow down">
        </div>
        <!-- sous titre -->
        <div class="lg:mt-14 mt-11">
            <h3 class="text-Grey-Velofeel dark:text-Dark-Grey font-overpass font-extrabold md:text-5xl text-2xl">Nous
                contacter avec
                nos
                adresses
            </h3>
        </div>
        <!-- info -->
        <div class="flex md:flex-row flex-col justify-evenly mt-11 font-OpenSans">
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
                <p class="font-bold text-[20px] mt-11 md:mt-0">Horaires</p>
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
        <h4
            class="mb-8 mt-11 lg:mt-0 text-Grey-Velofeel dark:text-Dark-Grey font-overpass font-extrabold md:text-5xl text-2xl">
            Nous
            sommes ici
            !
        </h4>
        <div class="flex justify-center items-center lg:gap-16 md:gap-8 gap-4 flex-col md:flex-row mt-16">
            <div>

                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5392.320575227619!2d6.8393929802201265!3d47.48679074281933!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47921750511bcc73%3A0x43fdf31f4bee52c!2sCycles+Thierry+Denis!5e0!3m2!1sfr!2sfr!4v1414766931647"
                    frameborder="0" class="lg:w-[500px] w-[280px] h-[400px]"></iframe>
            </div>
            <div class="lg:w-[500px] w-[300px]">
                <!-- CONTACT FORM HERE -->
                <form @submit.prevent="submitForm">
                    <div>
                        <label for="email"
                            class="block mb-2 mt-4 font-OpenSans font-bold text-Grey-Velofeel dark:text-Dark-Grey  duration-700">E-Mail</label>
                        <input type="email" name="email" v-model="email"
                            class="shadow-sm bg-gray-50 border font-OpenSans border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                            placeholder="Votre@adress.fr" required>
                    </div>
                    <div>
                        <label for="subject"
                            class="block mb-2 mt-4  font-OpenSans font-bold   text-Grey-Velofeel dark:text-Dark-Grey duration-700">Votre
                            Prénom - Nom</label>
                        <input type="text" name="name" v-model="name"
                            class="block p-3 w-full mt-4 text-sm font-OpenSans bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                            placeholder="Prénom - Nom " required>
                    </div>
                    <label for="message"
                        class="block mb-2 mt-4 font-OpenSans font-bold text-Grey-Velofeel dark:text-Dark-Grey   duration-700">Votre
                        message</label>
                    <textarea name="message" v-model="message" rows="6" placeholder="Message"
                        class="block p-2.5 w-full mt-4 font-OpenSans bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></textarea>
                    <button type="submit" class="btn-produit px-12 py-2 font-OpenSans font-bold mt-4"
                        @click="myFunction()">Envoyer</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>