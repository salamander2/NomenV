<script setup lang="ts">
import { watch, ref } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import OptionsPanel from '@/components/OptionsPanel.vue';

//Variables
const appState = useAppStateStore();

watch(() => appState.state, (newValue: string, oldValue: string) => {
    window.alert("state updated to " + appState.state);
    switch (appState.state) {
        case 'SETUP_COMPLETE':
            //read in ions.dat. It would be nice to put this into the parent component (app.vue)
            appState.state = 'OPTIONS';
            break;
        case 'OPTIONS_COMPLETE':
            //clear the list of questions

            appState.state = 'GENERATE_QUESTION';
            break;

    }
    console.log(newValue, oldValue);
});

const setupApp = () => {

};
</script>

<template>

    <!-- <h1>Nomenclature Quiz Program {{ appState.state }}</h1> -->
    <OptionsPanel v-if="appState.state === 'OPTIONS'" />

</template>
