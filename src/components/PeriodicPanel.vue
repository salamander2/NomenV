<script setup lang="ts">
//This is not importing SimplePanel but recreating most of it.

import { ref } from 'vue';

const isDragging = ref(false);
const mx = ref(0);
const my = ref(0);
const x = ref(100);
const y = ref(100);

defineEmits(['closePeriodic']);
const dragOn = (e) => {
  if (isDragging.value) {
    const diffX = e.clientX - mx.value;
    const diffY = e.clientY - my.value;
    x.value += diffX;
    y.value += diffY;
  }
  mx.value = e.clientX;
  my.value = e.clientY;
};
/* const dragOff = () => {
  isDragging.value = false;
};*/
</script>


<template>
  <div id="periodic" class="window" style="position:fixed;width:596px;height:400px;padding-bottom:0;z-index:10;"
    @mousedown="isDragging = true" @mouseup="isDragging = false" @mousemove="dragOn" Xmouseleave="dragOff"
    Xdraggable="false" :style="{
      cursor: isDragging ? 'grabbing' : 'grab',
      left: x + 'px',
      top: y + 'px',
    }">
    <div class="title">Periodic Table
      <button class="btnX" @click="$emit('closePeriodic')">&times;</button>
    </div>
    <div v-if="isDragging" class="text-red bold">Dragging</div>
    <img src="../res/periodictable.png" alt="Periodic Table" style="width:596px;height:365px">
  </div>
</template>
