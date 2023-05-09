<script setup>
import { RouterLink, RouterView } from "vue-router";
import headerVue from "@/components/header.vue";
import footerVue from "@/components/footer.vue";

</script>

<template>
  <div :class="isDark ? 'dark' : ''" class="text-Grey-Velofeel dark:text-Dark-Grey">
    <!--si isDark = true, Dark mode | si isDark = false, Light mode-->
    <headerVue></headerVue>
    <div class="pt-[88px]   bg-Dark-Grey dark:bg-Grey-Velofeel duration-700">
      <!-- Rajouter une transition duration pour une transition de DarkMode à LightMode + douce -->
      <div class="lg:ml-4 ml-2 -mt-4 lg:mt-0   fixed" checked @click="isDark = !isDark">
        <div class="invisible dark:visible">
          <svg class=" svg_darkmode" width="56px" height="56px" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g id="Environment / Moon">
              <path id="Vector"
                d="M9 6C9 10.9706 13.0294 15 18 15C18.9093 15 19.787 14.8655 20.6144 14.6147C19.4943 18.3103 16.0613 20.9999 12 20.9999C7.02944 20.9999 3 16.9707 3 12.0001C3 7.93883 5.69007 4.50583 9.38561 3.38574C9.13484 4.21311 9 5.09074 9 6Z"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </svg>
        </div>
        <div class="dark:hidden -mt-12">
          <svg class="svg_lightmode" width="56" height="56" viewBox="0 0 734 734" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M367.333 100.667V34M367.333 634V700.667M181.14 181.14L134 134M558.267 558.267L605.407 605.407M100.667 367.333H34M634 367.333H700.667M558.283 181.14L605.423 134M181.157 558.267L134.016 605.407M367.333 534C275.286 534 200.667 459.38 200.667 367.333C200.667 275.286 275.286 200.667 367.333 200.667C459.38 200.667 534 275.286 534 367.333C534 459.38 459.38 534 367.333 534Z"
              stroke-width="66.6667" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <RouterView />
    </div>
    <footerVue></footerVue>

  </div>
</template>

<style>
.svg_lightmode {
  stroke: #EDF2F4;
  fill: #222226;
  transition: .2s;
}

.svg_lightmode:hover {
  fill: #EDF2F4;
}

.svg_darkmode {
  stroke: #222226;
  fill: #EDF2F4;
  transition: .2s;
}

.svg_darkmode:hover {
  fill: #222226;
}


.switch {
  width: 60px;
  height: 34px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;

}

.slider:before {
  position: absolute;
  content: "";
  height: 23px;
  width: 23px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked+.slider {
  background-color: #222;
}

input:focus+.slider {
  box-shadow: 0 0 1px #222;
}

input:checked+.slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.button1 {
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  transition-duration: 300ms;
}

.v-enter-active,
.v-leave-active {
  transition: 0.6s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  translate: 0px 150px;
}
</style>

<script>

export default {
  data() {
    return {
      isDark: true,
    };
  },
  components: {

  },
};



</script>