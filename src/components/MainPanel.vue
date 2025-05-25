<script setup lang="ts">
// import { reactive, ref } from 'vue'
// import { ref } from 'vue'
import { useAppStateStore } from '@/stores/appState';
import OptionsPanel from '@/components/OptionsPanel.vue'

//Variables
const appState = useAppStateStore();
</script>

<template>

    <!-- <h1>Nomenclature Quiz Program {{ appState.state }}</h1> -->
    <OptionsPanel v-if="appState.state === 'OPTIONS'" />

</template>
