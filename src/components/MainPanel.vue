<script setup lang="ts">
import { watch, ref } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { useIonListsStore } from '@/stores/ionLists';

import OptionsPanel from '@/components/OptionsPanel.vue'
import { CATION_SINGLE, CATION_MULTI, ANION_SIMPLE, ANION_OXYACID, ANION_DERIVATIVE, ANION_HYDROGEN, ANION_OTHER, COVALENT_SIMPLE, COVALENT_COMPLEX } from '@/constants.ts';
import type { Ion } from '@/constants.ts';

//GLobal Variables
const appState = useAppStateStore();
const ionLists = useIonListsStore();

watch(() => appState.state, (newValue: string, oldValue: string) => {
    switch (appState.state) {
        case 'SETUP_COMPLETE':
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

    if ((typeof cation === 'object') && (typeof anion === 'object')) {
        generateQuestion(cation, anion, !!isCovalent, !!isSimpleCovalent);
    } else {
        console.error('Invalid cation or anion:', cation, anion);
    }
}
function selectIons() {
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

    } else {
        //generate covalent question
        if (isSimpleCovalent) {
            console.log("Generating simple covalent question...");
            cationType.push(COVALENT_SIMPLE);
            anionType.push(ANION_SIMPLE);
        } else {
            console.log("Generating complex covalent question...");
            cationType.push(COVALENT_COMPLEX); // Complex covalent
            //anionType is empty.
        }
    }

    const randomCationIndex = Math.floor(Math.random() * cationType.length);
    const randomAnionIndex = Math.floor(Math.random() * anionType.length);

    //cation and anion cannot be the same (eg. for covalent questions, like SeSe)
    let cation: Ion;
    let anion: Ion;
    do {
        cation = ionLists.$getRandomIon(cationType[randomCationIndex]);
        anion = ionLists.$getRandomIon(anionType[randomAnionIndex]);
    } while (cation.formula === anion.formula);

    console.log(`Cation: ${JSON.stringify(cation)}, Anion: ${JSON.stringify(anion)}`);

    // (cation, anion, isCovalent, isSimpleCovalent);
    // generateQuestion(cation, anion, isCovalent, isSimpleCovalent);
    return [cation, anion, isCovalent, isSimpleCovalent];
}

function generateQuestion(cation: Ion, anion: Ion, isCovalent: boolean, isSimpleCovalent: boolean) {
    // Generate the question based on the selected cation and anion
    // appState.question = `What is the formula for the ionic compound formed by ${cation[0]} and ${anion[0]}?`;

    if (!isCovalent) {
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
    }

    if (isCovalent && isSimpleCovalent) {
        console.log("formula: " + cation.formula + " name: " + cation.name);
        console.log("formula: " + anion.formula + " name: " + anion.name);
    }

    if (isCovalent && !isSimpleCovalent) {
        console.log("formula: " + cation.formula + " name: " + cation.name);
    }

}

</script>

<template>

    <!-- <h1>Nomenclature Quiz Program {{ appState.state }}</h1> -->
    <OptionsPanel v-if="appState.state === 'OPTIONS'" />

</template>
