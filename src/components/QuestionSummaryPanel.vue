<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { ref } from 'vue';
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
    const covalentTypes = ['', 'Simple Covalent', 'Complex Covalent', 'both Simple and Complex Covalent'][index];

    if (covalentTypes !== '') {
        return covalentTypes;
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

    return `(+) ${cationTypes} <br> (-) ${anionTypes}`;
});

//Using logic from MainPanel->createQuestions and binary values from OptionsPanel
const getAnswerType = computed(() => {
    let index = 0;
    if (appState.questionOptions & 512) index += 1
    if (appState.questionOptions & 1024) index += 2
    const answerType = ['', 'Names to Formulas', 'Formulas to Names', 'both Names and Formulas'][index];
    return answerType;
});

const questionsCorrect = computed(() => {
    console.log('lists', JSON.stringify(questionLists));
    return '...';
});

const score = computed(() => {
    const totalQuestions = questionLists.correct.length + questionLists.wrong.length;
    if (totalQuestions === 0) return 0;
    const correct = questionLists.correct.length;
    const help = questionLists.correct.filter(q => q.neededHelp).length;
    return ((correct - help / 2) / totalQuestions * 100).toFixed(0);
});

</script>

<template>
    <div class="window" style="background-color: #EEE; width: inherit;">
        <div class="title">Summary of Answers</div>
        <div class="body">
            Number of Questions: 20<br>
            <!-- Score: (correct + help/2 / number of questions) * 100 -->
            Score: {{ score }}%<br>
            <div class="text-left text-base text-gray-800 pl-6 -indent-6"><b>Question Type(s):</b><br />
                <span v-html="questionTypes"></span>
            </div>
            <div class="text-left text-base text-gray-800 pl-6 -indent-6"><b>Answer Type:</b><br />
                {{ getAnswerType }}
            </div>
            <hr>

            <div class="my-1 text-left text-base text-gray-800">
                <div class="mt-1"><b>Questions Correct:</b> {{ questionLists.correct.length }}</div>
                <div class="ml-3" v-for="(question, index) in questionLists.correct" :key="index">
                    {{ index + 1 }}. {{ question.name }} = {{ question.formula }}
                    <span v-if="question.neededHelp"> *</span>
                </div>
                Questions Correct with help (7)
            </div>

            <div class="my-1 text-left text-base text-gray-800">
                <div class="mt-1"><b>Questions Incorrect:</b> {{ questionLists.wrong.length }}</div>
                <div class="ml-3" v-for="(question, index) in questionLists.wrong" :key="index">
                    {{ index + 1 }}. {{ question.name }} = {{ question.formula }}
                </div>
            </div>
            <hr>
            Print (enter name) / Restart
        </div>
    </div>
</template>