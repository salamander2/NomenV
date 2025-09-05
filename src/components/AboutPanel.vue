<script setup lang="ts">
import SimplePanel from './SimplePanel.vue';
// import { defineComponent } from 'vue';
// import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';

const bodyText =
    `<P>This program is written by </P>
      <div class="text-emph">Michael Harwood</div>
      <div style='padding-bottom:5px;'>It is free for trial purposes,
    but you must pay the registration fee if you want to continue to use it.</div>
      <P>Contact <a href="nomen@iquark.ca" class="text-emph">'nomen@iquark.ca'</a><br>
    for licensing information</p>
    <p>or see the webpage<br>
    <a href="https://quarkphysics.ca/nomen" target="_blank" class="text-emph">https://quarkphysics.ca/nomen</a>
      </div>`;
const aboutTitle = 'About this program';
</script>

<template>
    <SimplePanel class="modal shift-left text-gray-800" :bodyText="bodyText" :closeBtnTop=false
        @close-panel="$emit('closeAbout')">
        {{ aboutTitle }}
    </SimplePanel>
</template>
