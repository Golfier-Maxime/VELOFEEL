<script setup>
import LogoFB from './logo/facebook.vue'
import LogoInsta from './logo/insta.vue'

</script>

<template>
    <footer
        class="text-Grey-Velofeel dark:text-Dark-Grey bg-Dark-Grey dark:bg-Grey-Velofeel duration-700 tracking-wide pt-24">
        <div class="flex justify-center">
            <img src="/images/logo_velofeel.png" alt="Logo de vélofeel" class="">
        </div>
        <div class="bg-Light-Grey h-[2px] rounded-sm mx-[10%] mt-6"></div>
        <div class="mx-4 lg:mx-0 flex flex-col lg:flex-row justify-evenly gap-12 mt-6 font-OpenSans">
            <!-- Nos Réseaux -->
            <div class="flex flex-col lg:gap-6 gap-3">
                <div>
                    <h4 class="font-bold text-base">Réseaux sociaux</h4>
                </div>
                <div class="flex gap-3 items-center">
                    <LogoFB></LogoFB>
                    <a href="https://www.facebook.com/VELOFEEL" target="_blank">
                        <p>Vélofeel</p>
                    </a>
                </div>
                <div class="flex gap-3 items-center">
                    <LogoInsta></LogoInsta>
                    <a href="https://www.instagram.com/velofeel/" target="_blank">
                        <p class="">@velofeel</p>
                    </a>
                </div>
            </div>
            <!-- Légal -->
            <div class="flex flex-col lg:gap-6 gap-3">
                <h4 class="font-bold text-base">Légal</h4>
                <RouterLink to="/legal">
                    <p>Mentions légales</p>
                </RouterLink>
                <RouterLink to="/PC">
                    <p>Politique de confidentialité</p>
                </RouterLink>
                <RouterLink to="/CGU">
                    <p>CGU - Condition gérénal d'utilisation</p>
                </RouterLink>

            </div>
            <!-- Info Contact -->
            <div class="flex flex-col lg:gap-6 gap-3">
                <div>
                    <h4 class="font-bold text-base">Nous contacter</h4>
                </div>
                <div>
                    <p></p>
                    <p>03 81 30 91 59</p>
                </div>
                <div>
                    <p></p>
                    <a href="mailto:contact.clients@velofeel.com">
                        <p>contact.clients@velofeel.com</p>
                    </a>
                </div>
                <div>
                    <p></p>
                    <p>2 Boulevard Moïse Foglia 25400 Audincourt</p>
                </div>
            </div>
        </div>
        <div class="lg:mx-20 mx-4 flex lg:flex-row flex-col justify-center  pb-6 mt-6 gap-4">
            <p class="font-OpenSans font-light text-xs">@2023 Vélofeel. All rights reserved - Made by <span
                    class="text-Light-Red"><a href="https://www.portfolio.maximegolfier.fr/" target="_blank">Maxime
                        GOLFIER</a></span> </p>
            <router-link to="/acceszone" class="font-OpenSans font-light text-xs">Accès Zone</router-link>
        </div>
    </footer>
</template>

<style scoped></style>
