<script setup lang="ts">
import { watch, ref } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import OptionsPanel from '@/components/OptionsPanel.vue';

//Variables
const appState = useAppStateStore();

watch(() => appState.state, (newValue: string, oldValue: string) => {
    window.alert("state updated to " + appState.state);
    switch (appState.state) {
        case 'SETUP_COMPLETE':
            appState.state = 'OPTIONS';
            break;
        case 'OPTIONS_COMPLETE':
            //clear the list of questions

            appState.state = 'GENERATE_QUESTION';
            break;
        case 'GENERATE_QUESTION':
            generateQuestion();
            appState.state = 'QUESTION_GENERATED';
            break;
        case 'QUESTION_GENERATED':
            //show question
            appState.state = 'SHOW_QUESTION';
            break;
    }
    console.log(newValue, oldValue);
});

function generateQuestion() {
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

    if (!isCovalent) {
        // let cationType = questionOptions & 3; // 1 for monovalent, 2 for multivalent
        // let anionType = questionOptions & 124; // 4 for simple anion, 8 for common polyatomic, etc.

        const cationType = [];
        if (questionOptions & 1) {
            cationType.push(0); // Monovalent
        }
        if (questionOptions & 2) {
            cationType.push(1); // Multivalent
        }
        if (cationType.length === 0) {
            cationType.push(0); // Default to monovalent if no cation type is selected
        }
        const anionType = [];
        if (questionOptions & 4) {
            anionType.push(2); // Simple anion
        }
        if (questionOptions & 8) {
            anionType.push(3); // Common polyatomic anion
        }
        if (questionOptions & 16) {
            anionType.push(4); // Derivative polyatomic anion
        }
        if (questionOptions & 32) {
            anionType.push(5); // H+ polyatomic anion
        }
        if (questionOptions & 64) {
            anionType.push(6); // Other polyatomic anion
        }
        if (anionType.length === 0) {
            anionType.push(2); // Default to simple anion if no anion type is selected
        }

    } else {
        //generate covalent question
        if (isSimpleCovalent) {
            console.log("Generating simple covalent question...");
            //cation = "covalent-simple";
            //anion = "anion-simple";
        } else {
            console.log("Generating complex covalent question...");
        }
    }
    console.log("Generating question...");
}


</script>

<template>

    <!-- <h1>Nomenclature Quiz Program {{ appState.state }}</h1> -->
    <OptionsPanel v-if="appState.state === 'OPTIONS'" />

</template>
