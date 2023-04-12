import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

import './assets/main.css'

import mitt from 'mitt';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATB8QhsKTw1yflx_9Fr2Zzoy10YiM6uFY",
    authDomain: "velofeel-65ff4.firebaseapp.com",
    projectId: "velofeel-65ff4",
    storageBucket: "velofeel-65ff4.appspot.com",
    messagingSenderId: "668075386603",
    appId: "1:668075386603:web:db636b50bbbe6d6aec80ae"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);


const app = createApp(App)

export const emitter = mitt();
app.config.globalProperties.emitter = emitter;

app.use(router)

app.mount('#app')
