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
            <div class="flex flex-col gap-6">
                <div>
                    <h4 class="font-bold text-base">Réseaux sociaux</h4>
                </div>
                <div class="flex gap-3 items-center">
                    <LogoFB></LogoFB>
                    <a href="https://www.facebook.com/VELOFEEL">
                        <p>Vélofeel</p>
                    </a>
                </div>
                <div class="flex gap-3 items-center">
                    <LogoInsta></LogoInsta>
                    <a href="https://www.instagram.com/velofeel/">
                        <p class="">@velofeel</p>
                    </a>
                </div>
            </div>
            <!-- Légal -->
            <div class="flex flex-col gap-6">
                <h4 class="font-bold text-base">Légal</h4>
                <RouterLink to="/legal">
                    <p>Mentions légales</p>
                </RouterLink>
                <p>Politique de confidentialité</p>
                <p>CGU - Condition gérénal d'utilisation</p>
            </div>
            <!-- Info Contact -->
            <div class="flex flex-col gap-6">
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
                    <p>Espace Lumière2, Boulevard Moïse Foglia 25400 Audincourt</p>
                </div>
            </div>
        </div>
        <div class="flex justify-center  pb-6 mt-6 ">
            <p class="font-OpenSans font-light">@2023 Vélofeel. All rights reserved </p>
        </div>
    </footer>
</template>

<style scoped>
.bar-footer {
    background-image: linear-gradient(90deg, #d946ef, #dc2626, #fb923c);
    border-radius: 2px;
}

.res:hover {
    scale: 1.2;
    transition: 0.3s;
}
</style>
