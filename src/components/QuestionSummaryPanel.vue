<script setup lang="ts">
import { defineProps, defineExpose, computed } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { ref } from 'vue';
import { jsPDF } from "jspdf";
import { font as deja_vu } from "@/assets/DejaVuSans-normal.js";
import { useQuestionListsStore } from '@/stores/questionLists';

//props
defineProps({

});

//stores
const appState = useAppStateStore();
const questionListsStore = useQuestionListsStore();


//variables
const questionLists = questionListsStore.getQuestionLists();

/* Return an object that is used both for display and PDF
  header: Ionic / Covalent
  data1: cation / covalent type
  data2: if inonic [anion types]

  in PrintPDF we can set the font and indenting.
  in Question summary, we can do the same thing, using HTML/CSS
  */

const questionTypes = computed(() => {
    const obj: { header: string; data1: string; data2: string[] } = { header: '', data1: '', data2: [] };

    let index = 0;
    if (appState.questionOptions & 128) index += 1
    if (appState.questionOptions & 256) index += 2;

    const covalentTypes = ['', 'Simple Covalent', 'Complex Covalent', 'Both Simple and Complex Covalent'][index];

    if (covalentTypes !== '') {
        obj.header = 'Covalent';
        obj.data1 = covalentTypes;
        return obj;
        // return `<b>Question Type: Covalent</b> <br> ${covalentTypes}`;
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
    if (anionTypes === '') anionTypes = 'Simple Ions'; //default to simple ions if no anion type selected

    anionTypes = "(–) " + anionTypes;
    //replace ", " with "<br>"
    // anionTypes = anionTypes.replace(/, /g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');

    // const text = "<b>Question Type: Ionic</b>";
    obj.header = "Ionic";
    obj.data1 = "(+) " + cationTypes;
    // obj.data2 = [anionTypes];
    obj.data2 = anionTypes.split(', ');
    // return `${text}<br> (+) ${cationTypes} <br> (&ndash;) ${anionTypes}`;
    return obj;
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
    const name = window.prompt("Please enter your name:");
    const finalName = name && name.trim() !== "" ? name : "?";

    const doc = new jsPDF();
    doc.addFileToVFS('DejaVuSans-normal.ttf', deja_vu);
    doc.addFont('DejaVuSans-normal.ttf', 'DejaVuSans', 'normal');

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;
    doc.setFont("Times");
    doc.setFontSize(32);
    doc.text("Inorganic Nomenclature Quiz", pageWidth / 2, y, { align: "center", }); y += 8;
    doc.setFontSize(12);
    doc.setTextColor(90, 90, 90);
    doc.text("\u00A9 Michael Harwood 2025", pageWidth / 2, y, { align: "center", }); y += 8;

    doc.setFillColor(255, 255, 234);
    doc.setDrawColor(128, 128, 128); // gray border
    doc.setLineWidth(0.5);
    doc.rect(18, y, pageWidth - 40 + 2, 35, 'FD');

    doc.setFont("Helvetica");
    doc.setFontSize(20);
    doc.text(`Name: ${finalName}`, 22, y + 10);
    doc.text(`Number of Questions: ${questionLists.correct.length + questionLists.wrong.length}`, 22, y + 20);
    const tempScore = score.value;
    doc.text(`Score: ${tempScore}%`, 22, y + 30);
    y += 43;

    doc.setFontSize(13);
    doc.text("Score = [ #correct (without help) + ½ #correct (needed help) ] ÷ number of questions", 18, y); y += 13;

    //Question types
    doc.setTextColor(0, 0, 100);
    doc.setFontSize(18);
    doc.setFont('Helvetica', '', 'bold');

    // doc.text(questionTypes.value, 22, 90);
    doc.text("Question Type: " + questionTypes.value.header, 20, y); y += 10;
    doc.setFont('Helvetica', 'normal');
    doc.text(questionTypes.value.data1, 20, y); y += 8;
    for (let i = 0; i < questionTypes.value.data2.length; i++) {
        if (i == 0) {
            doc.text(questionTypes.value.data2[i], 20, y); y += 8;
        } else {
            doc.text(questionTypes.value.data2[i], 30, y); y += 8;
        }
    }
    y += 5;

    doc.setTextColor(100, 0, 100);
    doc.setFont('Helvetica', 'bold');
    doc.text("Answer Type:", 20, y); y += 10;
    doc.setFont('Helvetica', 'normal');
    doc.text(getAnswerType.value, 30, y); y += 10;

    doc.line(20, y, pageWidth - 20, y); y += 10;

    doc.setTextColor(0, 100, 0);
    doc.setFont('Helvetica', '', 'bold');
    doc.text('Questions Correct: ' + questionLists.correct.length, 20, y); y += 10;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    doc.setFont('DejaVuSans', 'normal'); //needed for subscripts
    // doc.text("H\u2082O", 20, 20);
    for (let i = 0; i < questionLists.correct.length; i++) {
        const question = questionLists.correct[i];
        let text = `${i + 1}. ${question.name} = ${toSubscript(question.formula)}`;
        if (question.neededHelp) text += " *";
        doc.text(text, 25, y);
        y += 8; // Move down for next question
    }

    // Add note about help
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("* indicates that help was needed to answer the question", 25, y + 5); y += 15 + 5;


    doc.setFontSize(18);
    doc.setTextColor(100, 0, 0);
    doc.setFont('Helvetica', '', 'bold');
    doc.text('Questions Incorrect: ' + questionLists.wrong.length, 20, y); y += 10;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('DejaVuSans', 'normal');
    for (let i = 0; i < questionLists.wrong.length; i++) {
        const question = questionLists.wrong[i];
        const text = `${i + 1}. ${question.name} = ${toSubscript(question.formula)}`;
        doc.text(text, 25, y);
        y += 8; // Move down for next question
    }

    doc.line(20, y, pageWidth - 20, y); y += 10;
    /*
This program is written by
Michael Harwood
It is free for trial purposes, but you must pay the registration fee if you want to continue to use it.
Contact 'harwood@quarkphysics.ca'
for licensing information
or see the webpage
https://quarkphysics.ca/nomen

    */
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
            <div class="text-xs text-gray-600 mb-2 pt-1">
                Score = [ #correct (without help) + &half; #correct (needed help) ] &divide; number of questions
            </div>

            <!-- <div class="text-base text-indigo-800  pl-6 -indent-6 px-1"><span v-html="questionTypes"></span></div> -->
            <div class="text-base text-indigo-800 px-1">
                <b>Question Type: {{ questionTypes.header }}</b><br>
                {{ questionTypes.data1 }}
                <template v-if="questionTypes.header === 'Ionic'">
                    <div v-for="(item, index) in questionTypes.data2" :key="index" class=""
                        :class="index == 0 ? '' : 'pl-7'">
                        {{ item }}
                    </div>
                </template>
            </div>

            <div class="text-base text-fuchsia-900 px-1">
                <b>Answer Type:</b>
                <div class="pl-7">{{ getAnswerType }}</div>
            </div>

            <hr class="my-2">

            <div class="my-1 text-base text-gray-800">
                <div class="mt-1 text-green-800 font-bold">Questions Correct: {{ questionLists.correct.length }}</div>
                <div class="ml-3" v-for="(question, index) in questionLists.correct" :key="index">
                    {{ index + 1 }}. {{ question.name }} = {{ toSubscript(question.formula) }}
                    <span v-if="question.neededHelp"> *</span>
                </div>
                <span class="text-xs text-gray-500">* indicates that help was needed to answer the question</span>
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
