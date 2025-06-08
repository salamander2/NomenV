<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SimplePanel from './SimplePanel.vue';
import { useAppStateStore } from '@/stores/appState';
import { useQuestionStore } from '@/stores/question';

// import { defineComponent } from 'vue';
// import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';

const appState = useAppStateStore();
const question = useQuestionStore();

const emit = defineEmits(['closePanel']);
const closePanel = () => {
    // Emit the closePanel event to the parent component
    emit('closePanel');
};

const questionTexts = [
    'Enter the formula for this compound:',
    'Enter the name for this compound:',
];
const answerType = ref(0);
// const aboutTitle = ref(questionTexts[answerType.value]);
const panelTitle = ref("Question 1 of 20");

const bodyText = ref(
    `<p class="italic font-bold text-orange-800">${questionTexts[answerType.value]}</p>
    <p class="font-bold text-blue-900 text-lg">${question.question.name}</p>
      <div class="text-emph">Michael Harwood</div>
      <div style='padding-bottom:5px;'>It is free for trial purposes,
    but you must pay the registration fee if you want to continue to use it.</div>
      <P>Contact <span class="text-emph">'harwood@quarkphysics.ca'</span><br>
    for licensing information</p>
    <p>or see the webpage<br>
    <a href="https://quarkphysics.ca/nomen" target="_blank" class="text-emph">https://quarkphysics.ca/nomen</a>
      </div>`);

function chooseAnswerType() {
    if (appState.questionOptions & 512) answerType.value = 0; //name
    if (appState.questionOptions & 1024) answerType.value = 1; //formula

    if (appState.questionOptions & 1536) {
        //50-50 random chance of 0 or 1
        answerType.value = Math.random() < 0.5 ? 0 : 1;
    }
    // panelTitle.value = questionTexts[answerType.value];
    // panelTitle.value = "testing";
}

onMounted(() => {
    chooseAnswerType();
    // setText();
});

</script>

<template>
    <div class="window bg-gray-50">
        <div class="title">
            {{ panelTitle }}
            <button class="btnX" @click="$emit('closePanel')">&times;</button>
        </div>
        <div class="body">
            <p class="italic font-bold text-orange-800">{{ questionTexts[answerType] }}</p>
            <p class="font-bold text-blue-900 text-lg">{{ question.question.name }}</p>
            <div class="mt-2 mb-4">
                <div class="text-left text-sm text-gray-600">Enter your answer:</div>
                <input type="text" class="w-full border bg-white Xpl-2 text-bold text-center" id="inputAnswer"
                    name="inputAnswer" autofocus />
            </div>
            v-html="bodyText"
            <div class="flex justify-between">
                <button type="button" class="btnOK" @click="closePanel">I Give Up</button>
                <button type="button" class="btnOK" @click="closePanel">Check Answer</button>
            </div>
        </div>

    </div>

</template>
