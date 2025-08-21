<script setup lang="ts">
import { defineProps, defineExpose, computed } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { ref } from 'vue';
import { jsPDF } from "jspdf";
import { useQuestionListsStore } from '@/stores/questionLists';

//props
defineProps({

});

//stores
const appState = useAppStateStore();
const questionListsStore = useQuestionListsStore();


//variables
const questionLists = questionListsStore.getQuestionLists();

const questionTypes = computed(() => {
    let index = 0;
    if (appState.questionOptions & 128) index += 1
    if (appState.questionOptions & 256) index += 2
    const covalentTypes = ['', 'Simple Covalent', 'Complex Covalent', 'Both Simple and Complex Covalent'][index];

    if (covalentTypes !== '') {
        // return covalentTypes;
        return `<b>Question Type: Covalent</b> <br> ${covalentTypes}`;
    }
    //Now determine ionic types
    index = 0;
    if (appState.questionOptions & 1) index += 1
    if (appState.questionOptions & 2) index += 2
    const cationTypes = ['Monovalent ions', 'Monovalent Ions', 'Multivalent Ions', 'both Monovalent and Multivalent Ions'][index];

    let anionTypes = '';
    if (appState.questionOptions & 4) anionTypes += 'Simple Ions, ';
    if (appState.questionOptions & 8) anionTypes += 'Common Polyatomic Ions, ';
    if (appState.questionOptions & 16) anionTypes += 'Derivative Polyatomic Ions, ';
    if (appState.questionOptions & 32) anionTypes += 'H+ Polyatomic Ions, ';
    if (appState.questionOptions & 64) anionTypes += 'Other Polyatomic Ions, ';
    if (anionTypes.endsWith(', ')) anionTypes = anionTypes.slice(0, -2); //remove trailing comma and space
    //replace ", " with "<br>"
    anionTypes = anionTypes.replace(/, /g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    if (anionTypes === '') anionTypes = 'Simple Ions'; //default to simple ions if no anion type selected

    const text = "<b>Question Type: Ionic</b>";
    return `${text}<br> (+) ${cationTypes} <br> (&ndash;) ${anionTypes}`;
});

//Using logic from MainPanel->createQuestions and binary values from OptionsPanel
const getAnswerType = computed(() => {
    let index = 0;
    if (appState.questionOptions & 512) index += 1
    if (appState.questionOptions & 1024) index += 2
    const answerType = ['', 'Names to Formulas', 'Formulas to Names', 'both Names and Formulas'][index];
    return answerType;
});


const score = computed(() => {
    const totalQuestions = questionLists.correct.length + questionLists.wrong.length;
    if (totalQuestions === 0) return 0;
    const correct = questionLists.correct.length;
    const help = questionLists.correct.filter(q => q.neededHelp).length;
    return ((correct - help / 2) / totalQuestions * 100).toFixed(0);
});

function restart() {
    appState.state = "SETUP_COMPLETE";
}

function toSubscript(number: string): string {
    const subscriptMap = {
        '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
        '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
    };
    return String(number).split('').map(digit =>
        subscriptMap[digit as keyof typeof subscriptMap]
        || digit).join('');
}

function printResults() {
    //appState.state = "PRINT_PDF";
    //get name using window alert
    const name = window.prompt("Please enter your name:");

    const doc = new jsPDF();
    // doc.text("test test", 0, 10, { align: 'center' });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(32);
    doc.text("Inorganic Nomenclature Quiz", pageWidth / 2, 20, { align: "center", });

    // Change font and font size
    doc.setFont("Times");
    doc.setFontSize(20);
    doc.text("Custom Font and Size", 10, 60);

    doc.setFont("Helvetica");
    doc.setFontSize(12);
    doc.text("Number of Questions =", 20, 30);
    doc.text("Score =", 20, 40);
    // doc.text();
    // doc.text();

    doc.save()
    return;

    // appState.state = "SETUP_COMPLETE";
}

</script>

<template>
    <div class="window" style="background-color: #EEE; width: inherit;">
        <div class="title">Summary of Answers</div>
        <div class="body text-left">
            <div class="text-base text-gray-800 font-bold bg-amber-100 p-1">
                <!-- Number of Questions: {{ questionListsStore.maxQuestions }}<br> -->
                Number of Questions: {{ questionLists.correct.length + questionLists.wrong.length }}<br>
                Score: <span style="font-size:120%">{{ score }}%</span>
                <!-- <span class="text-gray-600 font-normal">&ddagger;</span> -->
            </div>
            <div class="text-xs text-gray-600 mb-2">
                Score = [ #correct (without help) + &half; #correct (needed help) ] &divide; number of questions
            </div>

            <div class="text-base text-indigo-800  pl-6 -indent-6 px-1"><span v-html="questionTypes"></span></div>

            <div class="text-base text-fuchsia-900 pl-6 -indent-6 px-1">
                <b>Answer Type:</b><br />
                {{ getAnswerType }}
            </div>

            <hr class="my-2">

            <div class="my-1 text-base text-gray-800">
                <div class="mt-1 text-green-800 font-bold">Questions Correct: {{ questionLists.correct.length }}</div>
                <div class="ml-3" v-for="(question, index) in questionLists.correct" :key="index">
                    {{ index + 1 }}. {{ question.name }} = {{ toSubscript(question.formula) }}
                    <span v-if="question.neededHelp"> *</span>
                </div>
                <span class="text-xs text-gray-500">* indicates that help was needed to answer the
                    question</span>
            </div>

            <div class="my-1 text-base text-gray-800">
                <div class="mt-1 text-red-700 font-bold">Questions Incorrect: {{ questionLists.wrong.length }}</div>
                <div class="ml-3" v-for="(question, index) in questionLists.wrong" :key="index">
                    {{ index + 1 }}. {{ question.name }} = {{ toSubscript(question.formula) }}
                </div>
            </div>
            <hr class="my-2">
            <button type="button" class="btnQ mt-1 bg-white" @click="printResults">Print</button>
            <button type="button" class="btnX mt-2" @click="restart">Restart</button>
            &nbsp;
        </div>
    </div>
</template>
