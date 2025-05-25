<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useAppStateStore } from '@/stores/appState';
// import { ref } from 'vue'
defineProps({

})

const appState = useAppStateStore();

const questionType = [
    // display questionType, system questionType, key
    //cation type
    ["Monovalent ions", "[cations-monovalent]", 1],
    ["Multivalent ions", "[cations-multivalent]", 2],
    //anion type
    ["Simple Ions", "[anions-simple]", 4],
    ["Common Polyatomic Ions", "[anions-polyatomic]", 8],
    ["Derivative Polyatomic Ions", "[anions-derivative]", 16],
    ["H+ Polyatomic Ions", "[anions-hydrogen]", 32],
    ["Other Polyatomic Ions", "[anions-other]", 64],
    //covalent
    ["Simple Covalent", "[covalent-simple]", 128],
    ["Complex Covalent", "[covalent-complex]", 256],
    //type of question
    ["Names ==> Formulas", "[-]", 512],
    ["Formulas ==> Names", "[-]", 1024],
]


const getCations = computed(() => {
    const data = [];
    for (let i = 0; i <= 1; i++) {
        data[i] = questionType[i];
    }
    return data;
});
const getAnions = computed(() => {
    const data = [];
    for (let i = 2; i <= 6; i++) {
        data.push(questionType[i]);
    }
    return data;
});
const getCovalent = computed(() => {
    const data = [];
    for (let i = 7; i <= 8; i++) {
        data.push(questionType[i]);
    }
    return data;
});
const getQuestion = computed(() => {
    return ["Names ==> Formulas", "Formulas ==> Names", "Names <==> Formulas"];
})

const updateState = () => {
    appState.state = "MAIN_STREET";
    window.alert("OPTIONSPANEL: state updated to " + appState.state);
}

</script>

<template>
    <div class="window" style="background-color: #EEE">
        <div class="title">Options</div>
        <div class="body">

            <div style="background-color:#FFB; padding:6px;text-align:left; margin-bottom:8px;">
                <fieldset>
                    <legend>Positive Ion Type</legend>
                    <div v-for="text in getCations" :key=text[2]>
                        <input type="checkbox" name="cation" id={{text[0]}} value={{text[0]}}>
                        <label class="ml-2" for={{text[0]}}>{{ text[0] }}</label>
                    </div>
                </fieldset>
            </div>

            <div style="background-color:#BFB; padding:6px;text-align:left; margin-bottom:8px;">
                <fieldset>
                    <legend>Negative Ion Type</legend>
                    <div v-for="text in getAnions" :key=text[2]>
                        <input type="checkbox" name="anion" id={{text[0]}} value={{text[0]}}>
                        <label class="ml-2" for={{text[0]}}>{{ text[0] }}</label>
                    </div>
                </fieldset>
            </div>

            <div style="background-color:#FBC; padding:6px;text-align:left; margin-bottom:8px;">
                <fieldset>
                    <legend>Covalent Bonds?</legend>
                    <div v-for="text in getCovalent" :key=text[2]>
                        <input type="checkbox" name="covalent" id={{text[0]}} value={{text[0]}}>
                        <label class="ml-2" for={{text[0]}}>{{ text[0] }}</label>
                    </div>
                </fieldset>
            </div>

            <div style="background-color:#CDF; padding:6px;text-align:left; margin-bottom:8px;">
                <fieldset>
                    <legend>Question type</legend>
                    <div v-for="label in getQuestion" :key=label>
                        <input type="radio" name="question" id={{label}} value={{label}} checked>
                        <label class="ml-2" for={{label}}>{{ label }}</label>
                    </div>
                </fieldset>
            </div>


        </div>
        <button class="btnOK" @click="updateState()">Start</button>
    </div>

</template>