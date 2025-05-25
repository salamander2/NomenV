<script setup lang="ts">
/* This is a simple window. It uses CSS from index.html
  Usage:  <AWindow :bodytext="..." :closeBtnTop=T/F> {{ title_text }}</AWindow>

  closeBtnTop will place a close button as (i) an X at the top right or (ii) an OK at the bottom middle.
  It emits a "closePanel" event when the close button is clicked.
*/

defineProps({
  bodyText: String,
  closeBtnTop: { type: Boolean, default: false }

})
const emit = defineEmits(['closePanel']);
const closePanel = () => {
  // Emit the closePanel event to the parent component
  emit('closePanel');
};
</script>

<template>
  <div class="window">
    <div class="title">
      <slot />
      <button v-if="closeBtnTop" class="btnX" @click="$emit('closePanel')">&times;</button>
    </div>
    <!-- <div class="body">{{ bodyText }}</div> -->
    <div class="body" v-html="bodyText"></div>
    <button v-if="!closeBtnTop" class="btnOK" @click="closePanel">OK</button>
  </div>

</template>



export default {


props: {
bodytext: String,
closeBtnTop: {type:Boolean, default:false}
},

emits: ['closePanel']

}