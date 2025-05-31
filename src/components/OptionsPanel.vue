<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { ref } from 'vue';
//props
defineProps({

});

//stores
const appState = useAppStateStore();

//variables
const isCovalent = ref(false);

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
    ["Names <==> Formulas", "[-]", 1536]
]


const getCationText = computed(() => {
    const data = [];
    for (let i = 0; i <= 1; i++) {
        data[i] = questionType[i];
    }
    return data;
});
const getAnionText = computed(() => {
    const data = [];
    for (let i = 2; i <= 6; i++) {
        data.push(questionType[i]);
    }
    return data;
});
const getCovalentText = computed(() => {
    const data = [];
    for (let i = 7; i <= 8; i++) {
        data.push(questionType[i]);
    }
    return data;
});
const getQuestionTypeText = computed(() => {
    const data = [];
    for (let i = 9; i <= 11; i++) {
        data.push(questionType[i]);
    }
    return data;
});

const updateState = () => {
    let total = 0;
    /*     const cat1 = document.querySelector('input[name="cation1"]');
        if (cat1 && cat1.checked) {
            total += parseInt(cat1.value, 10);
        }
        const cat2 = document.querySelector('input[name="cation2"]');
        if (cat2 && cat2.checked) {
            total += parseInt(cat2.value, 10);
        } */

    /*  const ionicCheckboxes = document.querySelectorAll('input[name^="check"]');
     ionicCheckboxes.forEach((checkbox) => {
         const ck = checkbox as HTMLInputElement;
         if (ck.checked) {
             total += parseInt(ck.value, 10);
         }
     }); */

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        const ck = checkbox as HTMLInputElement;
        if (ck.checked) {
            total += parseInt(ck.value, 10);
        }
        console.log(total + " " + ck.value + " " + ck.checked);

    });
    console.log("radio buttons");

    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
        const rb = radio as HTMLInputElement;
        if (rb.checked) {
            total += parseInt(rb.value, 10);
        }
        console.log(total + " " + rb.value + " " + rb.checked);
    });

    //If no "positive ion type" is selected, assume monovalent
    if (!isCovalent.value && !(total & 3)) {
        total += 1; // Monovalent
    }
    //If no "negative ion type" is selected, assume simple anion
    if (!isCovalent.value && !(total & 124)) {
        total += 4; // Simple anion
    }

    appState.questionOptions = total;
    appState.state = "OPTIONS_COMPLETE";
};

const updateCovalent = () => {

    // const total = 0;
    isCovalent.value = false;

    const covalent1 = document.getElementById('covalent128') as HTMLInputElement;
    if (covalent1 && covalent1.checked) {
        isCovalent.value = true;
        // total += 128;
    }
    const covalent2 = document.getElementById('covalent256') as HTMLInputElement;
    if (covalent2 && covalent2.checked) {
        isCovalent.value = true;
        // total += 256;
    }
}

</script>

<template>
    <div class="window" style="background-color: #EEE">
        <div class="title">Options</div>
        <div class="body">

            <div style="background-color:#FFB; padding:2px;text-align:left; margin-bottom:8px;">
                <fieldset>
                    <legend>Positive Ion Type</legend>
                    <div v-for="text in getCationText" :key=text[2]>
                        <input type="checkbox" :name="'check' + text[2]" :id="'check' + text[2]" :value=text[2]
                            :disabled="isCovalent">
                        <!-- <input type="checkbox" name="cation" id={{text[2]}} value={{text[2]}}> -->
                        <label class="ml-2 text-gray-800" :for="'check' + text[2]">{{ text[0] }}</label>
                    </div>
                </fieldset>
            </div>

            <div style="background-color:#BFB; padding:6px;text-align:left; margin-bottom:8px;">
                <fieldset>
                    <legend>Negative Ion Type</legend>
                    <div v-for="text in getAnionText" :key=text[2]>
                        <input type="checkbox" :name="'check' + text[2]" :id="'check' + text[2]" :value=text[2]
                            :disabled="isCovalent">
                        <label class="ml-2 text-gray-800" :for="'check' + text[2]">{{ text[0] }}</label>
                    </div>
                </fieldset>
            </div>

            <div style="background-color:#FBC; padding:6px;text-align:left; margin-bottom:8px;"
                title="Selecting covalent disables ionic options">
                <fieldset>
                    <legend>Covalent Bonds?</legend>
                    <div v-for="text in getCovalentText" :key=text[2]>
                        <input type="checkbox" :name="'covalent' + text[2]" :id="'covalent' + text[2]" :value=text[2]
                            @change="updateCovalent">
                        <label class="ml-2 text-gray-800" :for="'covalent' + text[2]">{{ text[0] }}</label>
                    </div>
                </fieldset>
            </div>

            <div style="background-color:#CDF; padding:6px;text-align:left; margin-bottom:8px;">
                <fieldset>
                    <legend>Question type</legend>
                    <div v-for="text in getQuestionTypeText" :key=text[2]>
                        <input type="radio" name="'radio' + text[2]" id="'radio' + text[2]" :value=text[2] checked>
                        <label class="ml-2 text-gray-800" :for="'radio' + text[2]">{{ text[0] }}</label>
                    </div>
                </fieldset>
            </div>


        </div>
        <button class="btnOK" @click="updateState()">Start</button>
    </div>

</template>