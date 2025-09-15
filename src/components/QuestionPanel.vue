<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import SimplePanel from './SimplePanel.vue';
import HelpPanel from './HelpPanel.vue';
import { useAppStateStore } from '@/stores/appState';
import { useQuestionStore } from '@/stores/question';
import { useQuestionListsStore } from '@/stores/questionLists';
import { useIonListsStore } from '@/stores/ionLists';

// import { defineComponent } from 'vue';
// import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';
const FORMULA: number = 0;
const NAME: number = 1;

const appState = useAppStateStore();
const questionStore = useQuestionStore();
const questionListsStore = useQuestionListsStore();
const ionListsStore = useIonListsStore();

// const emit = defineEmits(['closePanel']);
// const closePanel = () => {
// Emit the closePanel event to the parent component
// emit('closePanel');
// };

/*
    This file needs a lot of fixing. It's really messed up. It's too complicated and needs to be simplified.
    Too many things that are error prone.

    modals: isGiveUpVisible,
            isCorrectVisible

            Help modals

    variables for text:
            questionTexts -- the question that is asked
            answerText    -- when you give up. Created by setAnswerText
            successText   -- when you get the answer correct (Well done)
            failureText   -- when you get the answer wrong (INCORRECT! (Check spelling) Try again.)
*/
//TODO: separate checkAnswer into two functions: checkNameAnswer and checkFormulaAnswer
//TODO: should save question be moved to nextQuestion()?

// ========  Constants and Data ======== //
const questionTexts = [
    'Enter the formula for this compound:',
    'Enter the name for this compound:',
];
// const aboutTitle = ref(questionTexts[answerType.value]);
const panelTitle = ref("Question 1 of 20");

const answerText = ref('');
const resultText = ref('');
const successText = '<span class="text-lg font-bold text-green-700 uppercase">Correct!</span><br>' +
    '<span class="text-gray-800 text-base">Well done.</span><br>';
const failureText = '<span class="text-lg font-bold text-red-700 uppercase">Incorrect!</span><br>' +
    '<span class="text-gray-800 text-base">Check spelling and try again.</span><br>';
const helpMenuText = computed(() => {
    const iText = ['', 'List of Cations used', 'List of Anions used', 'Help for this specific question'];
    const cText = ['', 'Help for Covalent Naming', '--', '--'];
    if (questionStore.question.isCovalent) {
        if (appState.questionOptions & 128) {         //simple covalent
            cText[2] = 'Common oxidation numbers';
        }
        if (appState.questionOptions & 256) {
            cText[3] = 'All complex covalent compounds';
        }
        return cText;
    }
    else return iText;
});


const inputAnswer = ref<HTMLInputElement | null>(null);

const isGiveupVisble = ref(false);
const isCorrectVisible = ref(false);
const isWrongVisible = ref(false);
const helpNumber = ref(0);
const isHelpRequested = ref(false);
const answerType = ref(NAME);
const formulaSub = ref('');

// ========  Event Handler Methods ======== //
//detect F1 keypress
function handleFNKeydown(event: KeyboardEvent) {
    if (event.key === 'F1') {
        event.preventDefault(); // Prevent the default help action
        showHelp(1);
    }
    if (event.key === 'F2') {
        event.preventDefault();
        showHelp(2);
    }
    if (event.key === 'F3') {
        event.preventDefault();
        showHelp(3);
    }
}
function handleInputKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        checkAnswer();
    }

    inputAnswer.value = document.querySelector('#inputAnswer') as HTMLInputElement;

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

function fromSubscript(text: string): string {
    const subscripts = [
        '\u2080', '\u2081', '\u2082', '\u2083', '\u2084',
        '\u2085', '\u2086', '\u2087', '\u2088', '\u2089'
    ];
    return text.split('').map(char => {
        const index = subscripts.indexOf(char);
        return index !== -1 ? String(index) : char;
    }).join('');
}

// ======== Methods ======== //

//List of Cations Used : F1
//List of Anions  Used : F2
//Help for this specific question : F3
function showHelp(n: number) {

    //This is handled in HelpPanel.vue
    // if (n == 2 && questionStore.question.isCovalent) return;

    if (n == 3) {  //record that they asked for help
        if (!questionStore.question.isCovalent) isHelpRequested.value = true; //for all ionic questions
        if (questionStore.question.isCovalent && !questionStore.question.isSimpleCovalent) isHelpRequested.value = true; //for complex covalent questions
    }

    if (n >= 1 && n <= 3) helpNumber.value = n; //This triggers the help panel
}

function setAnswerText() {
    formulaSub.value = toSubscript(questionStore.question.formula);
    let text = `<span class="text-base">The correct answer is:</span><br>
        <span class="text-emph text-base">${questionStore.question.name} <br>
         ${formulaSub.value}</span><br>`;

    if (questionStore.question.isCovalent && !questionStore.question.isSimpleCovalent) {
        const altName = questionStore.question.alternativeName;
        if (altName) text += `<span class="font-bold">Alternative name: ${altName}</span>`;
    }
    answerText.value = text;
}

function showGiveUp() {
    isGiveupVisble.value = true;
}
function afterWrongModal() {
    isWrongVisible.value = false;

    if (inputAnswer.value) {
        inputAnswer.value.focus();
    }
}

function nextQuestion() {

    questionListsStore.addQuestion(questionStore.question.name, questionStore.question.formula, isCorrectVisible.value, isHelpRequested.value);

    isGiveupVisble.value = false;
    isCorrectVisible.value = false;
    isHelpRequested.value = false;

    if (inputAnswer.value) {
        inputAnswer.value.blur(); // Remove focus from the input field
    }

    //When there have been 20 questions ...
    if (questionListsStore.questionCounter >= questionListsStore.maxQuestions) {
        appState.state = 'SUMMARY_RESULTS';
        return;
    }

    appState.state = 'GENERATE_QUESTION';
}

function checkAnswer() {

    const answer = inputAnswer.value ? inputAnswer.value.value.trim() : '';

    if (answerType.value === NAME) checkNameAnswer(answer);
    if (answerType.value === FORMULA) checkFormulaAnswer(answer);

}

function checkNameAnswer(answer: string) {

    answer = answer.toLowerCase();

    // Check if the answer matches the name/altname for complex covalent compounds
    if (questionStore.question.isCovalent && !questionStore.question.isSimpleCovalent) {

        if (answer === questionStore.question.name.toLowerCase() || answer === questionStore.question.alternativeName?.toLowerCase()) {
            //If there is an alternative name, add it to resultText
            let addText = '';
            if (questionStore.question.alternativeName) {
                addText = `<span class="font-bold">Name: ${questionStore.question.name}</span><br>`;
                addText += `<span class="font-bold">Alternative name: ${questionStore.question.alternativeName}</span>`;
            }
            resultText.value = successText + addText;
            isCorrectVisible.value = true;
        }
        //Incorrect
        else {
            resultText.value = failureText;
            isWrongVisible.value = true;
        }
    }
    //All other correct answers
    else if (answer === questionStore.question.name.toLowerCase()) {
        resultText.value = successText;
        isCorrectVisible.value = true;
    }
    //Incorrect
    else {
        resultText.value = failureText;
        isWrongVisible.value = true;
    }
}

function checkFormulaAnswer(answer: string) {
    //change all subscripts back to normal text
    answer = fromSubscript(answer);

    console.log('Checking formula answer:', answer);
    console.log('Correct formula:', questionStore.question.formula);

    // Check if the answer matches the formula
    if (answer === questionStore.question.formula) {
        resultText.value = successText;
        isCorrectVisible.value = true;
    } else {
        // Incorrect answer
        resultText.value = failureText;
        isWrongVisible.value = true;
    }
}

function closeHelp() {
    helpNumber.value = 0;
}

function closePanel() {
    appState.state = 'SUMMARY_RESULTS';
}

// =========== Watchers and Lifecycle Hooks =========== //
//Watch for changes in the questionStore.question
watch(() => questionStore.question.name, (newQuestion) => {
    if (newQuestion) {
        answerType.value = questionStore.question.answerType;
        setAnswerText();

        panelTitle.value = `Question ${questionListsStore.questionCounter + 1} of ${questionListsStore.maxQuestions}`;
        //clear the input field
        if (inputAnswer.value) {
            inputAnswer.value.value = '';
            inputAnswer.value.focus();
        }
    }
}, { immediate: true });

onMounted(() => {
    document.addEventListener('keydown', handleFNKeydown);

    if (inputAnswer.value) {
        inputAnswer.value.addEventListener('keyup', handleInputKey);
    }

    answerType.value = questionStore.question.answerType;
    setAnswerText();

    panelTitle.value = `Question ${questionListsStore.questionCounter + 1} of ${questionListsStore.maxQuestions}`;
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
            <!-- <button class="btnQ" @click="showHelpMenu">?</button> -->
            <Menu as="div" class="float-left relative inline-block" v-slot="{ open }">
                <MenuButton
                    class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 pb-1 font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    ?
                    <ChevronDownIcon v-if="open" class="-mr-1 size-5 text-gray-400" aria-hidden="true" />
                    <!-- <ChevronRightIcon v-else class="-mr-1 size-5 text-gray-400" aria-hidden="true" /> -->
                </MenuButton>

                <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100"
                    leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100"
                    leave-to-class="transform opacity-0 scale-95">
                    <MenuItems
                        class="absolute left-0 z-10 text-left mt-3 w-66 origin-top-left rounded-md bg-white shadow-lg outline-1 outline-black/30">
                        <div class="py-1 text-sm">
                            <MenuItem>
                            <div @click="showHelp(1)" class="text-gray-800 hover:bg-blue-200 block px-2 py-0">
                                {{ helpMenuText[1] }}
                                <span class="float-right text-gray-500">F1</span>
                            </div>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                            <div @click="showHelp(2)"
                                :class="[active ? 'bg-blue-200 text-gray-800 outline-none' : 'text-gray-800', 'block px-2 py-0']">
                                {{ helpMenuText[2] }}
                                <span class="float-right text-gray-500">F2</span>
                            </div>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                            <div @click="showHelp(3)"
                                :class="[active ? 'bg-yellow-200 text-gray-800 outline-none' : 'text-gray-800', 'block px-2 py-0']">
                                {{ helpMenuText[3] }}
                                <span class="float-right text-gray-500">F3</span>
                            </div>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </transition>
            </Menu>

            {{ panelTitle }}
            <button class="btnX" @click="closePanel">&times;</button>
        </div>

        <div class="body">
            <p class="italic font-bold text-orange-800">{{ questionTexts[answerType] }}</p>
            <p class="font-bold text-blue-900 text-lg">
                <!-- {{ answerType ? questionStore.question.formula : questionStore.question.name }} -->
                {{ answerType ? formulaSub : questionStore.question.name }}
            </p>
            <div class="mt-2 mb-4">
                <div class="text-left text-sm text-gray-600">Enter your answer:</div>
                <input type="text" class="w-full border text-black text-lg bg-white Xpl-2 font-bold text-center"
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
        <transition name="modaltrans">
            <div v-if="isGiveupVisble" class="modal-mask">
                <SimplePanel class="bg-white !w-[300px]" :bodyText="answerText" @closePanel="nextQuestion">
                    Answer
                </SimplePanel>
            </div>
        </transition>
        <transition name="modaltrans">
            <div v-if="isCorrectVisible" class="modal-mask">
                <SimplePanel class="bg-white !w-[300px]" :bodyText="resultText" @closePanel="nextQuestion">
                    Result
                </SimplePanel>
            </div>
        </transition>
        <transition name="modaltrans">
            <div v-if="isWrongVisible" class="modal-mask">
                <SimplePanel class="bg-white !w-[300px]" :bodyText="resultText" @closePanel="afterWrongModal">
                    Result
                </SimplePanel>
            </div>
        </transition>
        <transition name="modaltrans">
            <div v-if="helpNumber > 0" class="modal-mask">
                <HelpPanel :question="questionStore.question" :helpNumber="helpNumber" @close-help="closeHelp" />
            </div>
        </transition>
    </teleport>


</template>
