<script setup>
</script>

<template>
    <div>
        <!-- titre -->
        <div class="mx-20">
            <h1
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-center font-overpass leading-tight">
                Vélofeel
            </h1>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-center font-overpass leading-tight">
                Votre
                référence en vélo </h2>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-center font-overpass leading-tight">
                à
                Audincourt</h2>
            <p
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[24px] text-center font-overpass leading-tight">
                Du Mardi au
                Samedi de 9:30-12:00 à 14:00-19:00</p>
        </div>
        <!-- Slider automatic et infini de quelque marque associé -->
        <div class="slider mt-10">
            <div class="slide-track flex gap-5 ml-16">
                <div class="slide">
                    <img src="/images/logo_cannondale.png" height="100" width="250" alt="" class="mt-8" />
                </div>
                <div class="slide">
                <img src="/images/logo_Giant.png" height="100" width="250" alt="" class="mt-7" />
            </div>
                <!-- <div class="slide">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <img src="/images/logo_KTM.jpg" height="100" width="150" alt="" class="mt-2" />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div> -->
                <div class="slide">
                    <img src="/images/logo_Thule.png" height="100" width="200" alt="" class="ml-[-80px] mt-[-10px]" />
                </div>
                <div class="slide">
                    <img src="/images/logo_peugeot.png" height="100" width="300" alt="" class="mt-4 ml-[-80px]" />
                </div>
                <div class="slide">
                    <img src="/images/logo_shimano.png" height="100" width="300" alt="" class="mt-7 ml-[-60px]" />
                </div>
                <div class="slide">
                    <img src="/images/logo_pro.jpg" height="100" width="150" alt="" class="mt-4 ml-[-30px]" />
                </div>
                <div class="slide">
                    <img src="/images/logo_lazer.png" height="100" width="250" alt="" class="mt-[-20px] ml-[-100px]" />
                </div>
            </div>
        </div>
        <div class="flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="">
        </div>
        <!-- Présentation produit a metre en avant -->
        <div class="lg:mx-[10%] mt-16 text-Grey-Velofeel dark:text-Dark-Grey flex justify-evenly ">
            <div>
                <h4 class="font-overpass text-[50px] font-bold">Produit - Velo
                    Marque</h4>
                <p class="font-OpenSans mr-40">Descrption : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus
                    ultricies quam in magna
                    congue vestibulum. Donec malesuada luctus dolor eu viverra. Nulla tincidunt facilisis sapien, non
                    tristique
                    mi volutpat quis. </p>
                <div class="font-OpenSans mt-11">
                    <router-link to="/contact" class="">
                        <p class="btn-produit text-center py-3 w-52 text-base font-bold">Plus d'info</p>
                    </router-link>
                </div>
            </div>
            <div class="w-full ">
                <img src="/images/PLACEHOLDER.jpg" alt="">
            </div>
        </div>
        <!-- quelques produits -->
        <div class="lg:mx-[10%] lg:mt-24 text-Grey-Velofeel dark:text-Dark-Grey">
            <div>
                <h4 class="font-OpenSans font-bold text-lg">Quelques produits</h4>
            </div>
            <!-- enssemble produit -->
            <div class="flex flex-wrap justify-between">
                <!-- produit -->
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/velo_placeholder.jpg" alt="">
                    <h5 class="font-OpenSans font-bold text-center">Revolt X Advanced Pro 0</h5>
                    <p class="font-OpenSans font-bold text-center">6 800 €</p>
                </div>
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/velo_placeholder.jpg" alt="">
                    <h5 class="font-OpenSans font-bold text-center">Revolt X Advanced Pro 0</h5>
                    <p class="font-OpenSans font-bold text-center">6 800 €</p>
                </div>
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/velo_placeholder.jpg" alt="">
                    <h5 class="font-OpenSans font-bold text-center">Revolt X Advanced Pro 0</h5>
                    <p class="font-OpenSans font-bold text-center">6 800 €</p>
                </div>
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/velo_placeholder.jpg" alt="">
                    <h5 class="font-OpenSans font-bold text-center">Revolt X Advanced Pro 0</h5>
                    <p class="font-OpenSans font-bold text-center">6 800 €</p>
                </div>
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/velo_placeholder.jpg" alt="">
                    <h5 class="font-OpenSans font-bold text-center">Revolt X Advanced Pro 0</h5>
                    <p class="font-OpenSans font-bold text-center">6 800 €</p>
                </div>
                <div class="flex flex-col gap-3 mt-6">
                    <img src="/images/velo_placeholder.jpg" alt="">
                    <h5 class="font-OpenSans font-bold text-center">Revolt X Advanced Pro 0</h5>
                    <p class="font-OpenSans font-bold text-center">6 800 €</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-produit {
    border: 2px solid #F8344C;
    border-radius: 8px;
    transition: .4s;
}

.btn-produit:hover {
    background-color: #F8344C;
    color: white;

}


/* SLIDER MARQUE */

@-webkit-keyframes scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(calc(-250px * 7));
    }
}

@keyframes scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(calc(-250px * 7));
    }
}

.slider {
    background: white;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.125);
    height: 100px;

    overflow: hidden;
    position: relative;
    width: 100%;
}

.slider::before,
.slider::after {
    background: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 100%);
    content: "";
    height: 100px;
    position: absolute;
    width: 35px;
    z-index: 2;
}

.slider::after {
    right: 0;
    top: 0;
    transform: rotateZ(180deg);
}

.slider::before {
    left: 0;
    top: 0;
}

.slider .slide-track {
    -webkit-animation: scroll 40s linear infinite;
    animation: scroll 40s linear infinite;
    display: flex;
    width: calc(250px * 14);
}

.slider .slide {
    height: 100px;
    width: 250px;
}
</style>
