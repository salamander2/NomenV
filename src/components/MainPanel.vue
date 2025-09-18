<script setup lang="ts">
import { watch, ref } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { useIonListsStore } from '@/stores/ionLists';
import { useQuestionStore } from '@/stores/question';
import { useQuestionListsStore } from '@/stores/questionLists';

import OptionsPanel from '@/components/OptionsPanel.vue'
import { CATION_SINGLE, CATION_MULTI, ANION_SIMPLE, ANION_OXYACID, ANION_DERIVATIVE, ANION_HYDROGEN, ANION_OTHER, COVALENT_SIMPLE, COVALENT_COMPLEX } from '@/constants.ts';
import type { Ion } from '@/constants.ts';
import QuestionPanel from './QuestionPanel.vue';
import QuestionSummaryPanel from './QuestionSummaryPanel.vue';

//GLobal Variables
const FORMULA: number = 0;
const NAME: number = 1;
const Greek = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca']
const appState = useAppStateStore();
const ionLists = useIonListsStore();
const questionStore = useQuestionStore();
const questionListsStore = useQuestionListsStore();
const retryCounter = ref(0);

watch(() => appState.state, (newValue: string, oldValue: string) => {
    switch (appState.state) {
        case 'SETUP':
            //initialize the app
            // console.log("Setting up the app...");
            //load ions from file
            // ionLists.$loadIonsFromFile();
            //set the state to SETUP_COMPLETE
            // appState.state = 'SETUP_COMPLETE';
            break;
        case 'SETUP_COMPLETE':
            //reset the question options
            appState.questionOptions = 0;
            appState.state = 'OPTIONS';
            break;
        case 'OPTIONS':
            break;
        case 'OPTIONS_COMPLETE':
            questionListsStore.$clearQuestions();
            appState.state = 'GENERATE_QUESTION';
            break;
        case 'GENERATE_QUESTION':
            createQuestion();
            appState.state = 'QUESTION_GENERATED';
            break;
        case 'QUESTION_GENERATED':
            //check for duplicate questions here. If so, go back to generate question.
            if (duplicateQuestion())
                appState.state = 'GENERATE_QUESTION';
            else
                appState.state = 'SHOW_QUESTION';
            break;
        case 'SHOW_QUESTION':
            break;
        case 'SUMMARY_RESULTS':
            break;
    }
    // console.log(oldValue + " => " + newValue);
});

function createQuestion() {

    const questionOptions = appState.questionOptions;
    let answerType = FORMULA;
    if (appState.questionOptions & 512) answerType = FORMULA;
    if (appState.questionOptions & 1024) answerType = NAME

    if (appState.questionOptions & 512 && appState.questionOptions & 1024) {
        //50-50 random chance of 0 or 1
        answerType = Math.random() < 0.5 ? NAME : FORMULA
    }

    let isCovalent = false;
    let isSimpleCovalent = false;

    //if it has bit 128 or 256 set, then it is a covalent question
    if (questionOptions & 128 || questionOptions & 256) {
        isCovalent = true;
    }

    if (isCovalent) {
        if (questionOptions & 128 && questionOptions & 256) {
            //50-50 chance of simple or complex covalent
            isSimpleCovalent = Math.random() < 0.5;
        }
        else {
            isSimpleCovalent = !!(questionOptions & 128);
        }

        const [cation, anion] = selectCovalentAtoms(isSimpleCovalent);
        // console.log("Generating covalent question...");
        generateCovalentQuestion(cation, anion, isSimpleCovalent, answerType);
    }
    //ionic question
    else {
        const [cation, anion] = selectIonicAtoms();
        // console.log("Generating ionic question...");
        generateIonicQuestion(cation, anion, answerType);
    }
}

function selectIonicAtoms(): [Ion, Ion] {
    const questionOptions = appState.questionOptions;

    const cationType = [];
    const anionType = [];
    let cation: Ion = ionLists.$getEmptyIon();
    let anion: Ion = ionLists.$getEmptyIon();

    // let cationType = questionOptions & 3; // 1 for monovalent, 2 for multivalent
    // let anionType = questionOptions & 124; // 4 for simple anion, 8 for common polyatomic, etc.

    if (questionOptions & 1) {
        cationType.push(CATION_SINGLE); // Monovalent
    }
    if (questionOptions & 2) {
        cationType.push(CATION_MULTI); // Multivalent
    }
    if (cationType.length === 0) {
        cationType.push(CATION_SINGLE); // Default to monovalent if no cation type is selected
    }
    //anions
    if (questionOptions & 4) {
        anionType.push(ANION_SIMPLE); // Simple anion
    }
    if (questionOptions & 8) {
        anionType.push(ANION_OXYACID); // Common polyatomic anion
    }
    if (questionOptions & 16) {
        anionType.push(ANION_DERIVATIVE); // Derivative polyatomic anion
    }
    if (questionOptions & 32) {
        anionType.push(ANION_HYDROGEN); // H+ polyatomic anion
    }
    if (questionOptions & 64) {
        anionType.push(ANION_OTHER); // Other polyatomic anion
    }
    if (anionType.length === 0) {
        anionType.push(ANION_SIMPLE); // Default to simple anion if no anion type is selected
    }

    const randomCationIndex = Math.floor(Math.random() * cationType.length);
    const randomAnionIndex = Math.floor(Math.random() * anionType.length);

    cation = ionLists.getRandomIon(cationType[randomCationIndex]);
    anion = ionLists.getRandomIon(anionType[randomAnionIndex]);

    // console.log(`Cation: ${JSON.stringify(cation)}, Anion: ${JSON.stringify(anion)}`);

    return [cation, anion];
}

function selectCovalentAtoms(isSimpleCovalent: boolean): [Ion, Ion] {

    let cation: Ion = ionLists.$getEmptyIon();
    let anion: Ion = ionLists.$getEmptyIon();

    if (isSimpleCovalent) {
        // console.log("Generating simple covalent question...");
        while (true) {
            cation = ionLists.getRandomIon(COVALENT_SIMPLE);
            anion = ionLists.getRandomIon(COVALENT_SIMPLE);

            //put the least electronegative as the cation
            if (cation.electronegativity > anion.electronegativity) {
                // console.log(`Swapping cation and anion: ${cation.name} (${cation.electronegativity}) <-> ${anion.name} (${anion.electronegativity})`);
                const temp = cation;
                cation = anion;
                anion = temp;
            }

            //Restrictive rules
            if (cation.formula === anion.formula) continue;
            if (cation.charge == 0) continue;
            if (anion.chargeN == 0) continue;
            if (anion.altName == '--') continue;  //This is for B and Si which do not have a -ide form
            //Avoid special names, they go in covalent-complex:  H3N, H4C, H2O, all NxOy, all SxOy
            if (cation.formula === 'H') {
                if (anion.formula === 'C' || anion.formula === 'N' || anion.formula === 'O') continue;
            }
            if (anion.formula === 'O') {
                if (cation.formula === 'N' || cation.formula === 'S') continue;
            }

            //ClF  --> set Cl charge = 1;
            if (cation.formula === 'Cl' && anion.formula === 'F') {
                cation.charge = 1;
                cation.isMultivalent = false;
            }
            //with halogen and a non-halogen, the halogen must be the anion
            if (cation.formula === 'F' || cation.formula === 'Cl' || cation.formula === 'Br' || cation.formula === 'I') {
                if (anion.formula !== 'F' && anion.formula !== 'Cl' && anion.formula !== 'Br' && anion.formula !== 'I') {
                    // console.log(`Swapping cation and anion: ${cation.name} <-> ${anion.name}`);
                    const temp = cation;
                    cation = anion;
                    anion = temp;
                }
            }

            break;
        }
    } else {
        // console.log("Generating complex covalent question...");
        cation = ionLists.getRandomIon(COVALENT_COMPLEX);
        //anion is empty.
    }

    // console.log(`Cation: ${JSON.stringify(cation)}, Anion: ${JSON.stringify(anion)}`);

    return [cation, anion];
}

function generateIonicQuestion(cation: Ion, anion: Ion, answerType: number) {
    // Generate the question based on the selected cation and anion
    // appState.question = `What is the formula for the ionic compound formed by ${cation[0]} and ${anion[0]}?`;

    let name = cation.name + " " + anion.name;
    if (cation.isMultivalent) {
        name = cation.name + "(" + cation.roman + ") " + anion.name;
    }

    //Find lowest common denominator of charges (which are always stored as positive integers)
    //A recursive version of the Euclidean algorithm to find the GCD
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const cationCount = anion.charge / gcd(cation.charge, anion.charge);
    const anionCount = cation.charge / gcd(cation.charge, anion.charge);
    let cationFormula = cation.formula;
    let anionFormula = anion.formula;
    if (cation.isPolyAtom && cationCount > 1) cationFormula = "(" + cation.formula + ")";
    if (anion.isPolyAtom && anionCount > 1) anionFormula = "(" + anion.formula + ")";

    const formula = cationFormula + (cationCount === 1 ? '' : cationCount) + anionFormula + (anionCount === 1 ? '' : anionCount);
    // console.log("ionic formula: " + formula + " name: " + name);

    questionStore.setQuestion(name, formula, false, false, cation, anion, answerType);
}

function generateCovalentQuestion(cation: Ion, anion: Ion, isSimpleCovalent: boolean, answerType: number) {

    /* COVALENT QUESTIONS */
    // At this point, we have removed invalid ions, and also moved the most electronegative ion to the anion position.

    //And then somehow handle it in the question checking logic.

    if (isSimpleCovalent) {

        let cationCount = anion.chargeN;
        let anionCount = cation.charge;
        //Find LCD again (eg. C2O4 -> CO2)
        //Carbon (anything with +4) must be simplified, or anything where the two charges are the same, eg. BN, maybe only for +-3 charges
        if (cation.formula === 'C' || (cation.charge === anion.chargeN && cation.charge === 3)) {
            const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
            cationCount = anion.chargeN / gcd(cation.charge, anion.chargeN);
            anionCount = cation.charge / gcd(cation.charge, anion.chargeN);
        }

        //None are polyatomic. Some are still wrong: e.g. BN is boron nitride, not boron mononitride, same as BP
        const formula = cation.formula + (cationCount === 1 ? '' : cationCount) + anion.formula + (anionCount === 1 ? '' : anionCount);
        const name = (cationCount > 1 ? Greek[cationCount] : '') + cation.name + " " + Greek[anionCount] + anion.altName;
        // console.log("covalent formula: " + formula + " name: " + name);
        // console.log("formula: " + cation.formula + " name: " + cation.name);
        // console.log("formula: " + anion.formula + " name: " + anion.altName);

        questionStore.setQuestion(name, formula, true, isSimpleCovalent, cation, anion, answerType);
    }

    //Complex covalent question
    if (!isSimpleCovalent) {
        // console.log("formula: " + cation.formula + " name: " + cation.name + " alt name: " + cation.altName);
        questionStore.setQuestion(cation.name, cation.formula, true, isSimpleCovalent, cation, anion, answerType, cation.altName,);
    }

}

function duplicateQuestion() {
    const questionFormula = questionStore.question.formula;
    // console.log("Formula generated = " + questionFormula);
    // Get the lists of correct and wrong answers
    const questionLists = questionListsStore.getQuestionLists();

    // Check if the formula exists in the correct list
    const isDuplicate = questionLists.correct.some(
        (q: { formula: string }) => q.formula === questionFormula
    );

    const isDuplicateWrong = questionLists.wrong.some(
        (q: { formula: string }) => q.formula === questionFormula
    );


    if (isDuplicate || isDuplicateWrong) {
        // console.log("duplicate formula " + questionFormula + " #" + retryCounter.value);
        retryCounter.value++;
        if (retryCounter.value > 3) {
            retryCounter.value = 0;
            // console.log("accepting duplicate formula");
            return false;
        }
    } else {
        retryCounter.value = 0;
    }


    return isDuplicate || isDuplicateWrong;


}

</script>

<template>

    <!-- <h1>Nomenclature Quiz Program {{ appState.state }}</h1> -->
    <OptionsPanel v-if="appState.state === 'OPTIONS'" />
    <QuestionPanel v-if="appState.state === 'SHOW_QUESTION'" />
    <QuestionSummaryPanel v-if="appState.state === 'SUMMARY_RESULTS'" />

</template>
