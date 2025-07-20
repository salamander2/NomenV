<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
/* This is a simple window. It uses CSS from index.html
  Usage:  <AWindow :bodytext="..." :closeBtnTop=T/F> {{ title_text }}</AWindow>

  closeBtnTop will place a close button as (i) an X at the top right or (ii) an OK at the bottom middle.
  It emits a "closePanel" event when the close button is clicked.
*/

const props = defineProps({
    bodyText: String,
    closeBtnTop: { type: Boolean, default: false }

})
const emit = defineEmits(['closePanel']);
const closePanel = () => {
    emit('closePanel');
};
function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        event.stopImmediatePropagation(); // Stop the event from propagating to any other listeners
        // event.stopPropagation(); // Stop the event from propagating to parent components
        event.preventDefault(); // Prevent default behavior (e.g., form submission)
        closePanel();
    }
}

// Make OK button have focus upon loading - so that you can press ENTER
onMounted(() => {
    //add key listener to document to close panel on Esc key
    document.addEventListener('keydown', handleKeydown);

    /* if (!props.closeBtnTop) {
        const okButton = document.getElementById('modalBtnOK');
        if (okButton) {
            console.log('Setting focus to OK button');
            (okButton as HTMLButtonElement).focus();
        }
    } */
});
onUnmounted(() => {
    // Remove key listener from document
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <div class="window">
        <div class="title">
            <slot />
            <button type="button" v-if="closeBtnTop" class="btnX" @click="$emit('closePanel')">&times;</button>
        </div>
        <div class="body" v-html="bodyText"></div>
        <button v-if="!closeBtnTop" type="button" id="modalBtnOK" class="btnOK" @click="closePanel"
            Xkeydown="handleKeydown">
            OK
        </button>
    </div>

</template>