<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div :class="isDark ? 'dark' : ''"> <!--si isDark = true, Dark mode | si isDark = false, Light mode-->

    <div class="bg-[#333] dark:bg-[#eee] duration-700">
      <!-- Rajouter une transition duration pour une transition de DarkMode à LightMode + douce -->

      <div class="w-14 h-14 bg-red-300" checked @click="isDark = !isDark"></div>
      <p>test</p>
      <RouterView />
    </div>

  </div>
</template>

<style>
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