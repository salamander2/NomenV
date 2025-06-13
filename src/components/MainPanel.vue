<script setup lang="ts">
import { watch, ref } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { useIonListsStore } from '@/stores/ionLists';
import { useQuestionStore } from '@/stores/question';

import OptionsPanel from '@/components/OptionsPanel.vue'
import { CATION_SINGLE, CATION_MULTI, ANION_SIMPLE, ANION_OXYACID, ANION_DERIVATIVE, ANION_HYDROGEN, ANION_OTHER, COVALENT_SIMPLE, COVALENT_COMPLEX } from '@/constants.ts';
import type { Ion } from '@/constants.ts';
import QuestionPanel from './QuestionPanel.vue';

//GLobal Variables
const Greek = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca']
const appState = useAppStateStore();
const ionLists = useIonListsStore();
const questionStore = useQuestionStore();

watch(() => appState.state, (newValue: string, oldValue: string) => {
    switch (appState.state) {
        // case 'SETUP':
        //initialize the app
        // console.log("Setting up the app...");
        //load ions from file
        // ionLists.$loadIonsFromFile();
        //set the state to SETUP_COMPLETE
        // appState.state = 'SETUP_COMPLETE';
        // break;
        case 'SETUP_COMPLETE':
            //reset the question options
            appState.questionOptions = 0;
            appState.state = 'OPTIONS';
            break;
        case 'OPTIONS_COMPLETE':
            //clear the list of questions

            appState.state = 'GENERATE_QUESTION';
            break;
        case 'GENERATE_QUESTION':
            createQuestion();
            appState.state = 'QUESTION_GENERATED';
            break;
        case 'QUESTION_GENERATED':
            //show question
            // appState.state = 'SHOW_QUESTION';
            appState.state = 'OPTIONS';
            break;
    }
    console.log(oldValue + " => " + newValue);
});

function createQuestion() {

    const data = selectIons();
    const [cation, anion, isCovalent, isSimpleCovalent] = data;

    // if ((typeof cation === 'object') && (typeof anion === 'object')) {
    if (isCovalent) {
        console.log("Generating covalent question...");
        generateCovalentQuestion(cation, anion, isSimpleCovalent);
    } else {
        console.log("Generating ionic question...");
        generateIonicQuestion(cation, anion);
    }
    // } else {
    // console.error('Invalid cation or anion:', cation, anion);
    // }
}

function selectIons(): [Ion, Ion, boolean, boolean] {
    const questionOptions = appState.questionOptions;
    let isCovalent = false;
    let isSimpleCovalent = false;
    //if it has bit 128 or 256 set, then it is a covalent question
    if (questionOptions & 128) {
        isCovalent = true;
        isSimpleCovalent = true;
    }
    if (questionOptions & 256) {
        isCovalent = true;
        isSimpleCovalent = false;
    }

    const cationType = [];
    const anionType = [];
    let cation: Ion = ionLists.$getEmptyIon();
    let anion: Ion = ionLists.$getEmptyIon();

    if (!isCovalent) {
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

        cation = ionLists.$getRandomIon(cationType[randomCationIndex]);
        anion = ionLists.$getRandomIon(anionType[randomAnionIndex]);

    }
    //generate covalent question
    else {
        if (isSimpleCovalent) {
            console.log("Generating simple covalent question...");
            while (true) {
                cation = ionLists.$getRandomIon(COVALENT_SIMPLE);
                anion = ionLists.$getRandomIon(COVALENT_SIMPLE);

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

                break;
            }
        } else {
            console.log("Generating complex covalent question...");
            cation = ionLists.$getRandomIon(COVALENT_COMPLEX);
            //anionType and anion are empty.
        }
    }

    console.log(`Cation: ${JSON.stringify(cation)}, Anion: ${JSON.stringify(anion)}`);

    return [cation, anion, isCovalent, isSimpleCovalent];
}

function generateIonicQuestion(cation: Ion, anion: Ion) {
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
    console.log("ionic formula: " + formula + " name: " + name);

    questionStore.setQuestion(name, formula, false, false, cation, anion);
}

function generateCovalentQuestion(cation: Ion, anion: Ion, isSimpleCovalent: boolean) {

    /* COVALENT QUESTIONS */
    // We HAVE to add in electronegativity to get the covalent ion order right.
    //Covalent Simple will be one long list of elements with electronegativity, positive charges, negative charge, negative name
    //We'll select two different elements from that list, and then generate the formula and name based on their electronegativity.
    //Oxygen is always the most electronegative, so it will always be the anion except for with Fluorine, which is the most electronegative element.

    //Complex covalent: we need to list alternative names for NO and N2O, so an extra column
    //And then somehow handle it in the question checking logic.

    if (isSimpleCovalent) {

        //Find LCD again (eg. C2O4 -> CO2)
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const cationCount = anion.charge / gcd(cation.charge, anion.charge);
        const anionCount = cation.charge / gcd(cation.charge, anion.charge);

        //None are polyatomic
        const formula = cation.formula + (cationCount === 1 ? '' : cationCount) + anion.formula + (anionCount === 1 ? '' : anionCount);
        const name = (cationCount > 1 ? Greek[cationCount] : '') + cation.name + " " + Greek[anionCount] + anion.name;
        console.log("covalent formula: " + formula + " name: " + name);
        console.log("formula: " + cation.formula + " name: " + cation.name);
        console.log("formula: " + anion.formula + " name: " + anion.name);

        // question.setQuestion(name, formula, cation, anion, true, isSimpleCovalent);
    }

    //Complex covalent question
    if (!isSimpleCovalent) {
        console.log("formula: " + cation.formula + " name: " + cation.name + " alt name: " + cation.altName);
    }

}

</script>

<template>

    <!-- <h1>Nomenclature Quiz Program {{ appState.state }}</h1> -->
    <OptionsPanel v-if="appState.state === 'OPTIONS'" />
    <QuestionPanel v-if="appState.state === 'SHOW_QUESTION'" />

</template>
