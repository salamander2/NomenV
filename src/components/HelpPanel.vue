<script setup lang="ts">
import SimplePanel from './SimplePanel.vue';
import { computed, ref } from 'vue';
import { useAppStateStore } from '@/stores/appState';
import { useIonListsStore } from '@/stores/ionLists';

const appState = useAppStateStore();
const ionListsStore = useIonListsStore();

const props = defineProps({
    question: Object,
    helpNumber: Number,
})

const panelWidth = computed(() => {
    if (props.helpNumber == 1 && !props.question?.isCovalent) return 280;
    if (props.helpNumber == 2 && !props.question?.isCovalent) return 280;
    // if (props.helpNumber == 1 && props.question?.isCovalent) return 180;
    // ...other cases...
    return 0; // default
});

const bodyText = computed(() => {

    /*** IONIC HELP ***/
    if (props.helpNumber == 1 && !props.question?.isCovalent) {
        let text = "<div style='font-size:90%;text-align:left'>";
        text += "<table style='width:240px;'>";
        let list = null;

        if (appState.questionOptions & 1) {         //monovalent cations
            list = ionListsStore.getListByType(0);
            text += '<tr><td colspan=3 class="text-emph text-center">List of Monovalent Cations</td></tr>';

            for (let i = 0; i < list.length; i++) {
                const ion = list[i];
                text += "<tr><td>" + ion[0] + "</td> <td>" + ion[1] + "</td> <td>+" + ion[2] + "</td></tr>";
            }
        }

        if (appState.questionOptions & 2) {         //multivalent cations
            text += '<tr><td colspan=3 class="text-emph text-center">List of Multivalent Cations</td></tr>';
            list = ionListsStore.getListByType(1);

            for (let i = 0; i < list.length; i++) {
                const ion = list[i];
                text += "<tr valign='top'><td>" + ion[0] + "</td> <td width='25%'>" + ion[1] + "</td> <td width='25%'>"
                //loop through each character in  ion[2]
                for (let c = 0; c < String(ion[2]).length; c++) {
                    text += "+" + String(ion[2])[c] + " ";
                }
                text += "</td></tr>";
            }
        }
        text += "</table></div>";
        return text;
    }

    if (props.helpNumber == 2 && !props.question?.isCovalent) {

        let text = "<div style='font-size:90%;text-align:left'>";
        text += "<table style='width:240px;'>";
        let list = null;

        if (appState.questionOptions & 4) {         //simple anions
            list = ionListsStore.getListByType(2);
            text += '<tr><td colspan=3 class="text-emph text-center">List of Simple Anions</td></tr>';

            for (let i = 0; i < list.length; i++) {
                const ion = list[i];
                text += "<tr><td>" + ion[0] + "</td> <td>" + ion[1] + "</td> <td>-" + ion[2] + "</td></tr>";
            }
        }

        if (appState.questionOptions & 8) {         //polyatomic anions
            list = ionListsStore.getListByType(3);
            text += '<tr><td colspan=3 class="text-emph text-center">List of Common Polyatomic Anions</td></tr>';

            for (let i = 0; i < list.length; i++) {
                const ion = list[i];
                text += "<tr><td>" + ion[0] + "</td> <td>" + toSubscript(ion[1]) + "</td> <td>-" + ion[2] + "</td></tr>";
            }
        }

        if (appState.questionOptions & 16) {         //derivative polyatomic anions
            list = ionListsStore.getListByType(4);
            text += '<tr><td colspan=3 class="text-emph text-center">List of Derivative Polyatomic Anions</td></tr>';

            for (let i = 0; i < list.length; i++) {
                const ion = list[i];
                text += "<tr><td>" + ion[0] + "</td> <td>" + toSubscript(ion[1]) + "</td> <td>-" + ion[2] + "</td></tr>";
            }
        }

        if (appState.questionOptions & 32) {         //H+ polyatomic anions
            list = ionListsStore.getListByType(5);
            text += '<tr><td colspan=3 class="text-emph text-center">List of H+ Polyatomic Anions</td></tr>';

            for (let i = 0; i < list.length; i++) {
                const ion = list[i];
                text += "<tr><td>" + ion[0] + "</td> <td>" + toSubscript(ion[1]) + "</td> <td>-" + ion[2] + "</td></tr>";
            }
        }

        if (appState.questionOptions & 64) {         //Other polyatomic anions
            list = ionListsStore.getListByType(6);
            text += '<tr><td colspan=3 class="text-emph text-center">List of Other Polyatomic Anions</td></tr>';

            for (let i = 0; i < list.length; i++) {
                const ion = list[i];
                text += "<tr><td>" + ion[0] + "</td> <td>" + toSubscript(ion[1]) + "</td> <td>-" + ion[2] + "</td></tr>";
            }
        }


        text += "</table></div>";
        return text;
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
        text += `Its formula is <b>${toSubscript(props.question?.anion.formula)}</b> and its charge is -${props.question?.anion.charge}`;
        return text;
    }

    /*** COVALENT HELP ***/
    if (props.helpNumber == 1 && props.question?.isCovalent) {
        let text = "<div style='font-size:90%;text-align:left'><p>" +
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
        return text;
    }

    if (props.helpNumber == 2 && props.question?.isCovalent) {
        return "This help panel is not applicable here and should be hidden.";
    }


    return "Place holder " + props.helpNumber;
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


function toSubscript(number: string): string {
    const subscriptMap = {
        '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
        '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
    };
    return String(number).split('').map(digit =>
        subscriptMap[digit as keyof typeof subscriptMap]
        || digit).join('');
}

</script>

<template>
    <SimplePanel class="modal shift-left text-gray-800" :bodyText="bodyText" :closeBtnTop=false :width="panelWidth"
        @close-panel="$emit('closeHelp')">
        {{ helpTitle }}
    </SimplePanel>
</template>
