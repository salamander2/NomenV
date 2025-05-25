<script setup lang="ts">
import { ref } from 'vue';
import MainPanel from './components/MainPanel.vue';
import AboutPanel from './components/AboutPanel.vue';
import PeriodicPanel from './components/PeriodicPanel.vue';
// import { RouterLink, RouterView } from 'vue-router'

const isAboutVisible = ref(false);
const isPeriodicVisible = ref(false);

//Methods
const showAbout = () => {
    isAboutVisible.value = true;
}
const hideAbout = () => {
    isAboutVisible.value = false;
}
const showPeriodic = () => {
    // isPeriodicVisible.value = true;
    isPeriodicVisible.value = !isPeriodicVisible.value;
}
const closePeriodic = () => {
    isPeriodicVisible.value = false;
}
</script>

<template>
    <div id="dragzone">
        <header>
            <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
            <div class="font-bold text-3xl font-sans text-gray-400">
                Inorganic Chemistry Nomenclature <!-- This line sets the width of the visible app box -->
                <button class="btnX text-base !bg-gray-600" style="margin: -10px -16px auto 10px;"
                    @click="$emit('exitProgram')">&times;</button>
                <div class="text-2xl font-sans text-gray-400">
                    Quiz Program
                </div>
            </div>
        </header>

        <div style="display:flex;justify-content: space-between;">
            <button @click="showAbout" class="btnOK">About</button>
            <button @click="showPeriodic" class="btnOK">Periodic</button>
        </div>

        <!-- put all modals to the bottom of the HTML, right before the end of BODY -->
        <teleport to="body">
            <transition name="modaltrans">
                <!-- Nothing else can be in here or it will no longer center -->
                <div v-if="isAboutVisible" class="modal-mask">
                    <AboutPanel @close-about="hideAbout" />
                </div>
            </transition>
        </teleport>

        <PeriodicPanel v-if="isPeriodicVisible" @close-periodic="closePeriodic" />

        <MainPanel />

        <div class="Xwrapper text-3xl font-bold">
            <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
        </div>
    </div>
</template>
