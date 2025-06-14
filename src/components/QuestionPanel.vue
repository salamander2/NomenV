<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SimplePanel from './SimplePanel.vue';
import { useAppStateStore } from '@/stores/appState';
import { useQuestionStore } from '@/stores/question';

// import { defineComponent } from 'vue';
// import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';

const appState = useAppStateStore();
const questionStore = useQuestionStore();

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

const isGiveupVisble = ref(false);

const bodyText = ref('');

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

function setText() {
    bodyText.value = `<span class="text-sm">The correct answer is:</span><br><span class="text-emph">${questionStore.question.name} <br> ${questionStore.question.formula}</span>`;
}

function giveUp() {
    isGiveupVisble.value = true;
}

function checkAnswer() {

}


function toSubscriptUnicode(number: string): string {
    const subscriptMap = {
        '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
        '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
    };
    return String(number).split('').map(digit =>
        subscriptMap[digit as keyof typeof subscriptMap]
        || digit).join('');
}


onMounted(() => {
    chooseAnswerType();
    setText();
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
            <p class="font-bold text-blue-900 text-lg">{{ questionStore.question.name }}</p>
            <div class="mt-2 mb-4">
                <div class="text-left text-sm text-gray-600">Enter your answer:</div>
                <input type="text" class="w-full border bg-white Xpl-2 text-bold text-center" id="inputAnswer"
                    name="inputAnswer" autofocus />
            </div>
            <div class="mt-8 flex flex-grow justify-between">
                <button type="button" class="Xw-full btnOK !bg-orange-300" @click="giveUp">
                    &nbsp;&nbsp;I Give Up&nbsp;&nbsp;</button>
                <button type="button" class="Xw-full btnOK !bg-emerald-300" @click="checkAnswer">Check Answer</button>
            </div>
        </div>

    </div>
    <!-- put all modals to the bottom of the HTML, right before the end of BODY -->
    <teleport to="body">
        <!-- Nothing else can be in here or it will no longer center -->
        <div v-if="isGiveupVisble" class="modal-mask">
            <SimplePanel class="bg-white !w-[300px]" :bodyText="bodyText" @closePanel="isGiveupVisble = false">Correct
                Answer
            </SimplePanel>
        </div>
    </teleport>
</template>
