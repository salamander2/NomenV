<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainPanel from './components/MainPanel.vue';
import AboutPanel from './components/AboutPanel.vue';
import PeriodicPanel from './components/PeriodicPanel.vue';
import UsageHelpPanel from './components/UsageHelpPanel.vue';
// import { RouterLink, RouterView } from 'vue-router'

import fileContent from './res/ions.dat?raw';

import { useAppStateStore } from '@/stores/appState';
import { useIonListsStore } from '@/stores/ionLists';

//variables
const isAboutVisible = ref(false);
const isPeriodicVisible = ref(false);
const isUsageHelpVisible = ref(false);
const appState = useAppStateStore();
const ionLists = useIonListsStore();

//Methods
const showAbout = () => isAboutVisible.value = true;
const closeAbout = () => isAboutVisible.value = false;
const showPeriodic = () => {
    // isPeriodicVisible.value = true;
    isPeriodicVisible.value = !isPeriodicVisible.value;
};
const closePeriodic = () => isPeriodicVisible.value = false;

const showUsageHelp = () => isUsageHelpVisible.value = true;
const closeUsageHelp = () => isUsageHelpVisible.value = false;

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
            if (ionType < 0) {
                console.log("Error: Invalid Question/Ion Type :" + line);
            }
        } else {
            // console.log(ionType + " " + line);
            if (ionType < 0) {
                return;
            }
            ionLists.addIon(ionType, line);
        }
    });

    // for (let i = 0; i < 100; i++) {
    //     let ion = ionLists.getRandomIon(1);
    //     if (ion[0] == 'manganese') console.log(JSON.stringify(ion));
    // }
    // console.log(JSON.stringify(ionLists.getListByType(8)));

    appState.state = 'SETUP_COMPLETE';
});

</script>

<template>
    <div id="mainApp">
        <header>
            <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
            <div class="font-bold text-3xl font-sans text-gray-400">
                Inorganic Chemistry Nomenclature <!-- This line sets the width of the visible app box -->
                <!-- <button class="btnX text-base !bg-gray-600" style="margin: -10px -16px auto 10px;" @click="$emit('exitProgram')">&times;</button> -->
                <div class="text-2xl font-sans text-gray-400">
                    Quiz Program
                </div>
            </div>
        </header>

        <div Xstyle="display:flex;justify-content: space-between;" class="flex justify-between mt-2 mb-4">
            <button type="button" @click="showAbout" class="btnOK">About</button>
            <!-- <button type="button" @click="showUsageHelp" class="btnOK">Usage</button> -->
            <button type="button" @click="showPeriodic" class="btnOK">Periodic</button>
        </div>

        <!-- put all modals to the bottom of the HTML, right before the end of BODY -->
        <teleport to="body">
            <transition name="modaltrans">
                <!-- Nothing else can be in here or it will no longer center -->
                <div v-if="isAboutVisible" class="modal-mask">
                    <AboutPanel @close-about="closeAbout" />
                </div>
            </transition>
            <!--
            <transition name="modaltrans">
                <div v-if="isUsageHelpVisible" class="modal-mask">
                    <UsageHelpPanel @closeUsageHelp="closeUsageHelp" />
                </div>
            </transition>
            -->
        </teleport>

        <PeriodicPanel v-if="isPeriodicVisible" @close-periodic="closePeriodic" />

        <MainPanel />

        <!-- <div class="Xwrapper text-3xl font-bold"> -->
        <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
        <!-- </div> -->
    </div>
    <!-- {{ fileContent }} -->
</template>
