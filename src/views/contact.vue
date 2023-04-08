<script setup></script>
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
            <img src="/images/Arrow_Down.svg" alt="">
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
                    <p>Lieu : Espace Lumière 2, Boulevard Moïse Foglia 25400 Audincourt</p>
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
        <div>
            <h4
                class="mb-8 mt-11 lg:mt-0 text-Grey-Velofeel dark:text-Dark-Grey font-overpass font-extrabold lg:text-5xl text-2xl">
                Nous
                sommes ici
                !
            </h4>
            <img src="/images/googlemaps.jpg" alt="">
        </div>
        <div>
            <!-- CONTACT FORM HERE -->
            <form action="https://api.web3forms.com/submit" method="POST" class="space-y-8">
                <input type="hidden" name="access_key" value="6c199d9f-bd2b-40fb-b83f-538406f464a7">
                <div>
                    <label for="email"
                        class="block mb-2 mt-4 lg:text-[24px] text-Grey-Velofeel dark:text-Dark-Grey duration-700">E-Mail</label>
                    <input type="email" id="email"
                        class="shadow-sm bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                        placeholder="Votre@adress.fr" required>
                </div>
                <div>
                    <label for="subject" class="block mb-2 mt-4 lg:text-[24px]   dark:text-white duration-700">Sujet
                        du mail</label>
                    <input type="text" id="subject"
                        class="block p-3 w-full mt-4 lg:text-[18px]  bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                        placeholder="Quelle est votre demande ?" required>
                </div>
                <div class="sm:col-span-2">
                    <label for="message" class="block mb-2 mt-4 lg:text-[24px]   dark:text-white duration-700">Votre
                        message</label>
                    <textarea id="message" rows="6"
                        class="block p-2.5 w-full mt-4 lg:text-[18px] bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Message"></textarea>
                </div>
                <input type="hidden" name="redirect" value="https://web3forms.com/success">
                <button type="submit" class="">Envoyer</button>
            </form>
        </div>
    </div>
</template>

<style scoped></style>