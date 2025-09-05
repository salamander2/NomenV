<script setup lang="ts">
import SimplePanel from './SimplePanel.vue';
// import { defineComponent } from 'vue';
// import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';

const bodyText =
    `<div class="text-left">
<p>This program quizzes you on inorganic nomenclature.</p>
<p class="mt-2">You start on the <span class="text-emph">Options page</span> by selecting which type of questions you want.
<u>Ionic</u> questions have a number of options for cations and anions that can be selected.
If you select <u>covalent</u> questions, then the ionic ones are disabled.</p>
<p>Once you press <span class="text-emph">Start</span>, you'll see the first question and will have to type in the name or formula.</p>
<ul class="list-disc ml-5">
<li>Formulas are case sensitive and require () when appropriate: <br>e.g. Ca(OH)2</li>
<li>Names are not case sensitive, but require () when appropriate: <br>e.g iron(III) chloride</li>
</ul>

<p>You can <span class="text-emph">Check your Answer</span> as many times as you want. If correct you'll go onto the next question.<br>
<span class="text-emph">"I give up"</span> will display the correct answer and go on to the next question.</p>

<p><span class="text-emph">Help</span> is available from the menu or by pressing F1, F2 or F3.<br>
Note that F3 (help for that specific question) will count against your overall score.</p>

<p class="mt-2">The standard number of questions is 20, but you can easily stop whenever you want by clicking the [X] on the question panel.</p>
<p class="mt-2">After the program has finished asking you questions, it will display a <span class="text-emph">Summary of your Results</span>.
You can print it as a PDF and send it to your chemistry teacher.</p>

<p class=mt-2>
Note that <a href="https://www.nature.com/articles/nchem.301" target="_blank" class="text-sky-800">sulfur</a> is spelled with an f, not a ph.
</p>`;
/*
Please let me know if you find any errors.
Somethings are tricky and required special cases, eg. peroxides, boron compounds (B is never an anion, and BN is not boron mononitride, but just boron nitride).
Most of the functions work with the keyboard so you don't need the mouse. Press <Enter> to check a question and <Esc> to go back to the question.
If there are any problems using this on a tablet or cell phone, please let me know.

The program reads in a list of ions and then generates questions.
Simple covalent questions take electronegativity into account when generating questions.
Complex covalent questions are not generated.
They are stored with name and formula and an alternate name, eg. [ozone, O3] or [dinitrogen monoxide, N2O ,nitrous oxide]

*/
const usageTitle = 'How to Use This Program';
</script>

<template>
    <SimplePanel class="modal  text-gray-800" :bodyText="bodyText" :closeBtnTop="false" :width="500"
        @close-panel="$emit('closeUsageHelp')">
        {{ usageTitle }}
    </SimplePanel>
    <ul class="list-disc">
        <li>asdfa</li>
    </ul>
</template>
