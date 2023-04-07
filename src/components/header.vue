<script setup>
import { ref } from 'vue';

const props = defineProps({
    user: { type: Object, default: () => { } }
})
const menuOpen = ref(false)
const switchMenu = () => {
    if (window.innerWidth <= 768) {
        menuOpen.value = !menuOpen.value
    }
}


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    var dropdown = document.getElementById("myDropdown");
    dropdown.classList.toggle("show");
    var svg = document.getElementById("mySvg");
    svg.classList.toggle("rotate-180deg", dropdown.classList.contains("show"));
}


// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }

        }
    }
}




</script>

<template>
    <header :class="menuOpen && ``, !menuOpen && `backdrop-blur-md `"
        class="font-OpenSans  font-bold text-Grey-Velofeel dark:text-Dark-Grey fixed  top-[-6px] w-full bg-Header_color  flex justify-between items-center max-w-screen px-9 lg:px-40 z-20 h-16 lg:h-[82px]   bg-opacity-75  dark:bg-opacity-20 ">
        <router-link to="/" class="w-36 ">
            <img src="/images/logo_velofeel.png" alt="Logo de Vélofeel" class="">
        </router-link>
        <nav class=" relative right-4 md:right-9 lg:right-40 ">
            <div class="flex  z-50 md:hidden w-8 h-3 flex-col justify-between"
                :class="menuOpen && `fixed right-10`, !menuOpen && `relative`" @click="switchMenu">
                <span class="w-full h-[3px] bg-Grey-Velofeel transition-all dark:bg-Dark-Grey"
                    :class="menuOpen && `rotate-45`"></span>
                <span class="h-[3px] bg-Grey-Velofeel self-end transition-all dark:bg-Dark-Grey"
                    :class="menuOpen && ` -rotate-45 absolute w-full`, !menuOpen && `w-2/3`"></span>
            </div>
            <ul class="fixed z-40 flex flex-col justify-center top-0 bottom-0 left-0 right-0 bg-Dark-Grey md:bg-transparent translate-x-full transition-all md:translate-x-0 md:flex-row md:relative gap-10 items-center dark:bg-Grey-Velofeel  dark:lg:bg-transparent "
                :class="menuOpen && `translate-x-0 md:translate-x-0`">
                <li class="md:hidden">
                    <RouterLink @click="switchMenu" to="/" class=" 2xl:text-[24px] lg:text-[18px]">Accueil
                    </RouterLink>
                </li>

                <li class="">
                    <div @click="switchMenu" class="dropdown  2xl:text-[24px] lg:text-[20px]">
                        <div class="flex items-center gap-2 ">
                            <button @click="myFunction" class="dropbtn">Nos produits</button>
                            <svg id="mySvg" width="21" height="12" viewBox="0 0 21 12" fill="none"
                                xmlns="http://www.w3.org/2000/svg" class="transi-rota">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M0.43934 0.43934C1.02513 -0.146447 1.97487 -0.146447 2.56066 0.43934L10.5 8.37868L18.4393 0.43934C19.0251 -0.146447 19.9749 -0.146447 20.5607 0.43934C21.1464 1.02513 21.1464 1.97487 20.5607 2.56066L11.5607 11.5607C10.9749 12.1464 10.0251 12.1464 9.43934 11.5607L0.43934 2.56066C-0.146447 1.97487 -0.146447 1.02513 0.43934 0.43934Z"
                                    fill="#222226" :class="menuOpen && `hidden`" class="origin-center " />
                            </svg>
                        </div>
                        <div id="myDropdown" class="dropdown-content  ">
                            <div class="flex gap-5 ml-4 mr-4">
                                <div class="">
                                    <router-link to="/produit">
                                        <h6 href="#home" class=" ">Route</h6>
                                    </router-link>
                                    <p class="font-medium text-base ">TEST1</p>
                                    <p class="font-medium text-base ">TEST2</p>
                                    <p class="font-medium text-base ">TEST3</p>
                                </div>
                                <div class="">
                                    <h6 href="#home" class=" ">Enfant</h6>
                                    <p class="font-medium text-base ">TEST1</p>
                                </div>
                                <div class="">
                                    <h6 href="#home" class=" ">VTT</h6>
                                    <p class="font-medium text-base ">TEST1</p>
                                </div>
                                <div class="">
                                    <h6 href="#home" class=" ">Electrique</h6>
                                    <p class="font-medium text-base ">TEST1</p>
                                </div>
                                <div class="">
                                    <h6 href="#home" class=" ">Accesoires</h6>
                                    <p class="font-medium text-base ">TEST1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="btn_header_red">
                    <RouterLink @click="switchMenu" to="/partenaires" class="  btn_header 2xl:text-[24px] lg:text-[20px]">
                        Nos Partenaires
                    </RouterLink>
                </li>
                <li class="btn_header_red">
                    <RouterLink @click="switchMenu" to="/apropos" class="  btn_header 2xl:text-[24px] lg:text-[20px]">À
                        Propos
                    </RouterLink>
                </li>
                <li class="btn_header_red">
                    <RouterLink @click="switchMenu" to="/contact" class="  btn_header 2xl:text-[24px] lg:text-[20px]">
                        Contact
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style>
.rotate-180deg {
    transform: rotate(180deg);

}

.transi-rota {
    transition: .2s;
}

/* menu dropdown */


.dropbtn {
    border: none;
    cursor: pointer;
}

.dropdown {
    position: relative;
    display: inline-block;

}

.dropdown-content {
    margin-top: 26px;
    display: none;
    position: absolute;
    background-color: #FFF;

    overflow: auto;
}


.show {
    display: block;

}

/* 
.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 100%;
    padding: 12px 16px;
    z-index: 1;
}

.dropdown:hover .dropdown-content {
    display: block;
} */

/*  */


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

