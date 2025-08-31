<script setup lang="ts">
import SimplePanel from './SimplePanel.vue';
import { computed } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { useIonListsStore } from '@/stores/ionLists';

const appState = useAppStateStore();
const ionListsStore = useIonListsStore();

const props = defineProps({
    question: Object,
    helpNumber: Number,
})

const bodyText = computed(() => {

    if (props.helpNumber == 1 && props.question?.isCovalent) {
        let text = "<HTML><div style='font-size:90%;text-align:left'><p>" +
            "There are many exceptions and complications in naming covalent compounds. " +
            "Simple covalent compounds are named in the pattern 'nA mB' , where n and m " +
            "are Greek words for numbers, and A and B are element names. " +
            "B will always end in -ide." +
            "</p><p>" +
            "For example H2O = dihydrogen monoxide.<br>Never use mono- in front of the first element. " +
            "Thus we say 'carbon dioxide' not 'monocarbon dioxide'.<br>" +
            "<u>Note</u> that some of the formulas created by the program from the <i>ions.dat</i> file " +
            "might not actually exist. e.g. Si3P4" +
            // "<u>Also</u> the algorithm does not consider electronegativity, so both NH3 and H3N are randomly generated." +
            "<br><br>Here are the numbers in Greek:<br>";
        text += "<table style='width:100px;'>";
        for (let n = 1; n <= 10; n++) {
            text += "<tr><td>" + n + "</td> <td>=</td> <td>" + ionListsStore.Greek[n] + "</td></tr>";
        }
        text += "</table>";
        /*
        +
       Ion.getGreekHTMLTable() +
       "<br><br>" +
       getIonHTMLTable(IonManager.COVALENT_SIMPLE) +
       "</p></div></HTML>";
strHelp3 = "<HTML>" +
       getIonHTMLTable(IonManager.COVALENT_COMPLEX) +
       "</HTML>";
       */
        return text;
    }

    if (props.helpNumber == 2 && props.question?.isCovalent) {
        return "This help panel is not applicable here and should be hidden.";
    }

    if (props.helpNumber == 3 && !props.question?.isCovalent) {
        let text = '<div class="text-emph">Help for this specific question:</div>';
        text += `The positive ion is <b>${props.question?.cation.name}, ${props.question?.cation.formula}</b>.<br/>`;
        if (props.question?.cation.isMultivalent) {
            text += `It is multivalent with a charge of +${props.question.cation.charge}<br><br>`
        } else {
            text += `It always has a charge of +${props.question?.cation.charge}<br><br>`
        }
        text += `The negative ion is <b>${props.question?.anion.name}</b>.<br>`
        text += `Its formula is <b>${props.question?.anion.formula}</b> and its charge is -${props.question?.anion.charge}`;
        return text;
    }

    return "place holder " + props.helpNumber;
});
/*
const bodyText =
    `<P>This program is written by </P>
      <div class="text-emph">Michael Harwood</div>
      <div style='padding-bottom:5px;'>It is free for trial purposes,
    but you must pay the registration fee if you want to continue to use it.</div>
      <P>Contact <span class="text-emph">'harwood@quarkphysics.ca'</span><br>
    for licensing information</p>
    <p>or see the webpage<br>
    <a href="https://quarkphysics.ca/nomen" target="_blank" class="text-emph">https://quarkphysics.ca/nomen</a>
      </div>`;
*/

const helpTitle = computed(() => {
    if (props.question?.isCovalent) {
        return "Help for Covalent Questions"
    } else {
        return "Help for Ionic Questions"
    }
});

const questionTypes = computed(() => {

    const lists = [];
    if (appState.questionOptions & 1) {
        lists.push(ionListsStore.getListByType(1));
    }
    if (appState.questionOptions & 2) {
        lists.push(ionListsStore.getListByType(2));
    }

    return lists;
});


</script>

<template>
    <SimplePanel class="modal shift-left text-gray-800" :bodyText="bodyText" :closeBtnTop=false
        @close-panel="$emit('closeHelp')">
        {{ helpTitle }}
    </SimplePanel>
</template>
