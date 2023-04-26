<script setup></script>

<template>
    <div class="lg:mx-20 mx-4">
        <!-- titre -->
        <div>
            <h1
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-[50px] text-center font-overpass leading-tight">
                Vélofeel</h1>
            <h2
                class="text-Grey-Velofeel dark:text-Dark-Grey font-extrabold lg:text-[100px] text-4xl text-center font-overpass leading-tight">
                Accès Zone</h2>
        </div>
        <!-- flehe rouge -->
        <div class="flex justify-center mt-10">
            <img src="/images/Arrow_Down.svg" alt="">
        </div>
        <div class="text-Grey-Velofeel dark:text-Dark-Grey flex lg:flex-row flex-col justify-center gap-4 mt-16">
            <router-link to="/privatezone" class="text-xl">zone 1</router-link>
            <router-link to="/privatezone2" class="text-xl">zone 2</router-link>
            <router-link to="/privatezone3" class="text-xl">zone 3</router-link>
        </div>
    </div>
</template>

<style scoped></style>