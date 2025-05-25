<script setup lang="ts">
import MainPanel from './components/MainPanel.vue';
// import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div id="dragzone">
    <header>
      <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
      <div class="font-bold text-3xl font-sans text-gray-400">
        Inorganic Chemistry Nomenclature <!-- This line sets the width of the visible app box -->
        <div class="text-2xl font-sans text-gray-400">
          Quiz Program
          <button class="btnX text-base" @click="$emit('exitProgram')">&times;</button>
        </div>
      </div>
    </header>
    <MainPanel />

    <div class="Xwrapper text-3xl font-bold">
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
    </div>
  </div>
</template>
