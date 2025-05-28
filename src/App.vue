<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainPanel from './components/MainPanel.vue';
import AboutPanel from './components/AboutPanel.vue';
import PeriodicPanel from './components/PeriodicPanel.vue';
// import { RouterLink, RouterView } from 'vue-router'

import fileContent from './res/ions.dat?raw';

import { useAppStateStore } from '@/stores/appState';
import { useIonListsStore } from '@/stores/ionLists';

//variables
const isAboutVisible = ref(false);
const isPeriodicVisible = ref(false);
const appState = useAppStateStore();
const ionLists = useIonListsStore();

//Methods
const showAbout = () => {
    isAboutVisible.value = true;
};
const hideAbout = () => {
    isAboutVisible.value = false;
};
const showPeriodic = () => {
    // isPeriodicVisible.value = true;
    isPeriodicVisible.value = !isPeriodicVisible.value;
};
const closePeriodic = () => {
    isPeriodicVisible.value = false;
};

//method to parse fileContent and store it in a store.
onMounted(() => {
    const lines = fileContent.split(/\r\n|\n/);
    let ionType = -1;

    lines.forEach((line) => {
        line = line.trim();
        if (line.length === 0) return;
        if (line.charAt(0) === ';') return;
        if (line.charAt(0) == '[' && line.charAt(line.length - 1) == ']') {
            ionType = ionLists.ionTypes.indexOf(line.toLowerCase());
            // console.log(ionType + " " + line);
        } else {
            // console.log(ionType + " " + line);
            ionLists.$addIon(ionType, line);
        }
    });

    // for (let i = 0; i < 100; i++) {
    //     let ion = ionLists.$getRandomIon(1);
    //     if (ion[0] == 'manganese') console.log(JSON.stringify(ion));
    // }
    // console.log(JSON.stringify(ionLists.$getListByType(0)));

    appState.state = 'SETUP_COMPLETE';
});

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
            <button type="button" @click="showAbout" class="btnOK">About</button>
            <button type="button" @click="showPeriodic" class="btnOK">Periodic</button>
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
    {{ fileContent }}
</template>
