<script setup lang="ts">
// import { reactive, ref } from 'vue'
import { ref } from 'vue'
import { useAppStateStore } from '@/stores/appState';
import AboutPanel from './AboutPanel.vue'
import PeriodicPanel from './PeriodicPanel.vue'
// import OptionsPanel from './OptionsPanel.vue';

//Variables
const appState = useAppStateStore();
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

  <!-- <h1>Nomenclature Quiz Program {{ appState.state }}</h1> -->

  <div style="display:flex;justify-content: space-between;">
    <button @click="showAbout" class="btnOK">About</button>
    <button @click="showPeriodic" class="btnOK">Periodic</button>
  </div>

  <!-- put all modals to the bottom of the HTML, right before the end of BODY -->
  <teleport to="body">
    <transition name="modaltrans">
      <div v-if="isAboutVisible" class="modal-mask">
        <AboutPanel @close-about="hideAbout"></AboutPanel>
      </div>
    </transition>
  </teleport>

  <!-- <optionsPanel v-if="appState.state === 'OPTIONS'" :appState="appState"></optionsPanel> -->
  <PeriodicPanel v-if="isPeriodicVisible" @close-periodic="closePeriodic"></PeriodicPanel>

</template>
