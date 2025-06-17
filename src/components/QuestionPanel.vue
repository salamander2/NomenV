<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import SimplePanel from './SimplePanel.vue';
import { useAppStateStore } from '@/stores/appState';
import { useQuestionStore } from '@/stores/question';
import { useQuestionListsStore } from '@/stores/questionLists';

// import { defineComponent } from 'vue';
// import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';
const FORMULA: number = 0;
const NAME: number = 1;

const appState = useAppStateStore();
const questionStore = useQuestionStore();
const questionListsStore = useQuestionListsStore();

// const emit = defineEmits(['closePanel']);
// const closePanel = () => {
// Emit the closePanel event to the parent component
// emit('closePanel');
// };

// ========  Constants and Data ======== //
const questionTexts = [
    'Enter the formula for this compound:',
    'Enter the name for this compound:',
];
const answerType = ref(FORMULA);
// const aboutTitle = ref(questionTexts[answerType.value]);
const panelTitle = ref("Question 1 of 20");

const correctAnswer = ref('');
const inputAnswer = ref<HTMLInputElement | null>(null);

const isGiveupVisble = ref(false);

// ========  Event Handler Methods ======== //
//detect F1 keypress
function handleFNKeydown(event: KeyboardEvent) {
    if (event.key === 'F1') {
        event.preventDefault(); // Prevent the default help action
        showHelp();
    }
    if (event.key === 'F2') {
        event.preventDefault();
        showHelp();
    }
    if (event.key === 'F3') {
        event.preventDefault();
        showHelp();
    }
}
function handleInputKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        checkAnswer();
    }

    console.log('Input key:', event.key);
    inputAnswer.value = document.querySelector('#inputAnswer') as HTMLInputElement;

    console.log('Input element:', inputAnswer.value?.value);

    // Set the value of the input element
    if (inputAnswer.value) {
        inputAnswer.value.value = toSubscript(inputAnswer.value.value);
    }
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
// ======== Methods ======== //

function showHelp() {
    // This function can be used to show help or instructions
    // window.alert('Help: Enter the name or formula of the compound as prompted. Use the buttons to check your answer or give up.');
    let altName = '';
    if (questionStore.question.alternativeName) { //This only happens for complex covalent
        altName = questionStore.question.alternativeName;
    }
    let text = "The correct answer is: " + questionStore.question.name + " = " + toSubscript(questionStore.question.formula)
    if (altName) {
        text += `\n\nAlternative name: ${altName}`;
    }
    window.alert(text)
}

function chooseAnswerType() {
    if (appState.questionOptions & 512) answerType.value = NAME;
    if (appState.questionOptions & 1024) answerType.value = FORMULA

    if (appState.questionOptions & 1536) {
        //50-50 random chance of 0 or 1
        answerType.value = Math.random() < 0.5 ? NAME : FORMULA
    }
    // panelTitle.value = questionTexts[answerType.value];
}

function setAnswerText() {
    const formula = toSubscript(questionStore.question.formula);
    let text = `<span class="text-sm">The correct answer is:</span><br>
        <span class="text-emph">${questionStore.question.name} <br>
         ${formula}</span><br>`;

    if (questionStore.question.isCovalent && !questionStore.question.isSimpleCovalent) {
        const altName = questionStore.question.alternativeName;
        if (altName) text += `<span class="font-bold">Alternative name: ${altName}</span>`;
    }
    correctAnswer.value = text;
}

function showGiveUp() {
    isGiveupVisble.value = true;
    //Add question to list of wrong questions
    questionListsStore.addQuestion(questionStore.question.name, questionStore.question.formula, false, false);
}
function hideGiveUp() {
    isGiveupVisble.value = false;
    //Generate next question
    appState.state = 'GENERATE_QUESTION';
}

function checkAnswer() {

}

//Watch for changes in the questionStore.question
watch(() => questionStore.question.name, (newQuestion) => {
    if (newQuestion) {
        setAnswerText();
        panelTitle.value = `Question ${questionListsStore.questionCounter + 1} of 20`;
    }
}, { immediate: true });

onMounted(() => {
    document.addEventListener('keydown', handleFNKeydown);

    if (inputAnswer.value) {
        inputAnswer.value.addEventListener('keyup', handleInputKey);
    }

    chooseAnswerType();
    setAnswerText();

    panelTitle.value = `Question ${questionListsStore.questionCounter + 1} of 20`;
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleFNKeydown);
    if (inputAnswer.value) {
        inputAnswer.value.removeEventListener('keyup', handleInputKey);
    }
});

</script>

<template>
    <div class="window bg-gray-50">
        <div class="title">
            {{ panelTitle }}
            <button class="btnQ" @click="showHelp">?</button>
            <button class="btnX" @click="$emit('closePanel')">&times;</button>
        </div>
        <div class="body">
            <p class="italic font-bold text-orange-800">{{ questionTexts[answerType] }}</p>
            <p class="font-bold text-blue-900 text-lg">{{ questionStore.question.name }}</p>
            <div class="mt-2 mb-4">
                <div class="text-left text-sm text-gray-600">Enter your answer:</div>
                <input type="text" class="w-full border text-black bg-white Xpl-2 text-bold text-center"
                    id="inputAnswer" ref="inputAnswer" autofocus />
            </div>
            <div class="mt-8 flex flex-grow justify-between">
                <button type="button" class="Xw-full btnOK !bg-orange-300" @click="showGiveUp">
                    &nbsp;&nbsp;I Give Up&nbsp;&nbsp;</button>
                <button type="button" class="Xw-full btnOK !bg-emerald-300" @click="checkAnswer">Check Answer</button>
            </div>
        </div>

    </div>
    <!-- put all modals to the bottom of the HTML, right before the end of BODY -->
    <teleport to="body">
        <!-- Nothing else can be in here or it will no longer center -->
        <div v-if="isGiveupVisble" class="modal-mask">
            <SimplePanel class="bg-white !w-[300px]" :bodyText="correctAnswer" @closePanel="hideGiveUp">
                Correct Answer
            </SimplePanel>
        </div>
    </teleport>
</template>
