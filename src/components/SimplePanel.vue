<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
/* This is a simple window. It uses CSS from index.html
  Usage:  <AWindow :bodytext="..." :closeBtnTop=T/F> {{ title_text }}</AWindow>

  closeBtnTop will place a close button as (i) an X at the top right or (ii) an OK at the bottom middle.
  It emits a "closePanel" event when the close button is clicked.
*/

const props = defineProps({
    bodyText: String,
    closeBtnTop: { type: Boolean, default: false },
    width: { type: Number, default: 0 },
})
const emit = defineEmits(['closePanel']);
const closePanel = () => emit('closePanel');

/*
props.bodyText.match(/<tr\b[^>]*>/g) returns an array of all matches (all <tr> tags).
If there are no matches, .match() returns null.
You can’t call .length on null, so || [] ensures you always have an array.
If there are no <tr> tags, it becomes [].length, which is 0.
*/
const trCount = computed(() => {
    return props.bodyText ? (props.bodyText.match(/<tr\b[^>]*>/g) || []).length : 0;
});
// Conditionally enable scroll if bodyText is long
// const needsScroll = computed(() => (props.bodyText?.length ?? 0) > 1500); // adjust threshold as needed - number of chars
const needsScroll = computed(() => {
    if (trCount.value > 26) return true; //for tables of ions
    if ((props.bodyText?.length ?? 0) > 1000) return true;
    return false;
}); // adjust threshold as needed

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
    <div class="window" :style="props.width > 0 ? { width: props.width + 'px' } : {}">
        <div class="title">
            <slot />
            <button type="button" v-if="props.closeBtnTop" class="btnX" @click="$emit('closePanel')">&times;</button>
        </div>
        <div class="body">
            <div :class="['scroll-content', { 'scroll-enabled': needsScroll }]">
                <span v-html="props.bodyText"></span>
            </div>
        </div>
        <button v-if="!props.closeBtnTop" type="button" id="modalBtnOK" class="btnOK" @click="closePanel">
            OK
        </button>
    </div>

</template>
