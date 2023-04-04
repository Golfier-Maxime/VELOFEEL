<script setup>
import { ref } from 'vue';

const props = defineProps({
    user: { type: Object, default: () => { } }
})
const menuOpen = ref(false)
const switchMenu = () => {
    menuOpen.value = !menuOpen.value
}


</script>

<template>
    <header :class="menuOpen && ` `, !menuOpen && `backdrop-blur-sm dark:backdrop-blur-sm`"
        class="font-OpenSans font-bold text-Grey-Velofeel dark:text-Dark-Grey fixed  top-[-6px] w-full bg-Header_color  flex justify-between items-center max-w-screen px-9 lg:px-40 z-20 h-16 lg:h-[82px]   bg-opacity-75  dark:bg-opacity-20 ">
        <router-link to="/" class="w-36 ">
            <img src="/images/logo_velofeel.png" alt="Logo de Vélofeel" class="">

        </router-link>
        <nav class=" relative right-4 md:right-9 lg:right-40 ">
            <div class="flex  z-50 md:hidden w-8 h-3 flex-col justify-between"
                :class="menuOpen && `fixed right-10`, !menuOpen && `relative`" @click="switchMenu">
                <span class="w-full h-[2px] bg-Grey-Velofeel transition-all dark:bg-Dark-Grey"
                    :class="menuOpen && `rotate-45`"></span>
                <span class="h-[2px] bg-Grey-Velofeel self-end transition-all dark:bg-Dark-Grey"
                    :class="menuOpen && ` -rotate-45 absolute w-full`, !menuOpen && `w-2/3`"></span>
            </div>
            <ul class="fixed z-40 flex flex-col justify-center top-0 bottom-0 left-0 right-0 bg-Dark-Grey md:bg-transparent translate-x-full transition-all md:translate-x-0 md:flex-row md:relative gap-10 items-center dark:bg-Grey-Velofeel  dark:lg:bg-transparent "
                :class="menuOpen && `translate-x-0 md:translate-x-0`">
                <li class="md:hidden">
                    <RouterLink @click="switchMenu" to="/" class=" duration-700 2xl:text-[24px] lg:text-[18px]">Accueil
                    </RouterLink>
                </li>

                <li class="btn_header_red">
                    <RouterLink @click="switchMenu" to="/produit"
                        class="  duration-700 btn_header 2xl:text-[24px] lg:text-[20px]">
                        Nos produits
                    </RouterLink>
                </li>
                <li class="btn_header_red">
                    <RouterLink @click="switchMenu" to="/partenaires"
                        class=" duration-700 btn_header 2xl:text-[24px] lg:text-[20px]">
                        Nos Partenaires
                    </RouterLink>
                </li>
                <li class="btn_header_red">
                    <RouterLink @click="switchMenu" to="/apropos"
                        class=" duration-700 btn_header 2xl:text-[24px] lg:text-[20px]">À Propos
                    </RouterLink>
                </li>
                <li class="btn_header_red">
                    <RouterLink @click="switchMenu" to="/contact"
                        class=" duration-700 btn_header 2xl:text-[24px] lg:text-[20px]">Contact
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style>
.btn_header_red:hover {
    color: #F8344C;
}

.btn_header {
    position: relative;
    -webkit-transition: all .4s ease-in-out;
    -moz-transition: all .4s ease-in-out;
    -o-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
}


.btn_header:before,
.btn_header:after {
    width: 0;
    content: "";
    bottom: -10px;
    background: #F8344C;
    height: 2px;
    position: absolute;
    -webkit-transition: width .4s ease;
    -moz-transition: width .4s ease;
    -o-transition: width .4s ease;
    transition: width .4s ease;
}

.btn_header:before {
    right: 0%;

}

.btn_header:after {
    left: 0%;
}

.btn_header:hover:before,
.btn_header:hover:after {
    width: 50%;

}

.bg-topbar {
    background-image: linear-gradient(90deg, #d946ef, #dc2626, #fb923c);
}

nav .chevron {
    transition: rotate .4s ease;
}

nav .liste_container:hover .chevron {
    rotate: 180deg;
}

nav .liste {
    visibility: hidden;
    opacity: 0;
    top: 0%;
    transition: .4s ease-in-out;
}

nav .liste_container:hover .liste {
    visibility: visible;
    opacity: 1;
    top: 100%;
    transition: .4s ease-in-out;
}
</style>

