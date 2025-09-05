<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['closeAbout']);
const closePanel = () => emit('closeAbout');

// Conditionally enable scroll if bodyText is long
const bodyText = computed(() => activeTab.value === 'about' ? aboutText : usageText);
const needsScroll = computed(() => (bodyText.value?.length ?? 0) > 1000); // adjust threshold as needed - number of chars (eg 1000)
// const needsScroll = true;
// const width = 260;

const activeTab = ref<'about' | 'usage'>('about');

const aboutTabLabel = computed(() =>
    activeTab.value === 'about' ? 'About this Program' : 'About'
);
const usageTabLabel = computed(() =>
    activeTab.value === 'about' ? 'Usage' : 'How to Use this Program'
);

const aboutText =
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

const usageText =
    `<div class="text-left">
<p class="text-center">This program quizzes you on inorganic nomenclature.</p>
<p class="mt-2">You start on the <span class="text-emph">Options page</span> by selecting which type of questions you want.
<u>Ionic</u> questions have a number of options for cations and anions that can be selected.
If you select <u>covalent</u> questions, then the ionic ones are disabled.</p>
<p>Once you press <span class="text-emph">Start</span>, you'll see the first question and will have to type in the name or formula.</p>
<ul class="list-disc ml-5">
<li>Formulas are case sensitive and require () when appropriate: <br>e.g. Ca(OH)2</li>
<li>Names are not case sensitive, but require () when appropriate: <br>e.g iron(III) chloride</li>
<li><a href="https://www.nature.com/articles/nchem.301" target="_blank" class="text-sky-800">sulfur</a> is spelled with an f, not a ph.</li>
</ul>

<p>You can <span class="text-emph">Check your Answer</span> as many times as you want. If correct you'll go onto the next question.<br>
<span class="text-emph">"I give up"</span> will display the correct answer and go on to the next question.</p>

<p><span class="text-emph">Help</span> is available from the menu or by pressing F1, F2 or F3.<br>
Note that F3 (help for that specific question) will count against your overall score.</p>

<p class="mt-2">The standard number of questions is 20, but you can easily stop whenever you want by clicking the [X] on the question panel.</p>
<p class="mt-2">After the program has finished asking you questions, it will display a <span class="text-emph">Summary of your Results</span>.
You can print it as a PDF and send it to your chemistry teacher.</p>
`;

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        event.stopImmediatePropagation(); // Stop the event from propagating to any other listeners
        // event.stopPropagation(); // Stop the event from propagating to parent components
        event.preventDefault(); // Prevent default behavior (e.g., form submission)
        closePanel();
    }
}
onMounted(() => {
    //add key listener to document to close panel on Esc key
    document.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
    // Remove key listener from document
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <div class="modal Xshift-left text-gray-800">

        <div class="window" :style="activeTab === 'about' ? 'width:380px' : 'width:500px'">
            <div class="tabs align-center">
                <button :class="['tab', { active: activeTab === 'about' }]" @click="activeTab = 'about'"
                    type="button">{{ aboutTabLabel }}</button>
                <button :class="['tab', { active: activeTab === 'usage' }]" @click="activeTab = 'usage'"
                    type="button">{{ usageTabLabel }}</button>
            </div>
            <div class="body h-[400px]">
                <div :class="['scroll-content', { 'scroll-enabled': needsScroll }]">
                    <span v-html="bodyText"></span>
                </div>
            </div>
            <button type="button" id="modalBtnOK" class="btnOK" @click="closePanel">
                OK
            </button>
        </div>
    </div>

</template>
