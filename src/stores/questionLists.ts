import { ref } from 'vue'
import { defineStore } from 'pinia'

/* This stores (i) a list of questions answered correctly,
    (ii) a list of questions answered incorrectly.
    Data: name, formula, neededHelp (F3 only)
*/
export const useQuestionListsStore = defineStore('questionList', () => {

    //The questionCorrectList is an array. Each element of the array is an object:
    //    name=> string, formula=> string, neededHelp=> boolean
    const questionCorrectList = ref<Array<{ name: string, formula: string, neededHelp: boolean }>>([])
    const questionWrongList = ref<Array<{ name: string, formula: string, neededHelp: boolean }>>([])

    const questionCounter = ref(0);

    function addQuestion(name: string, formula: string, isCorrect: boolean, neededHelp: boolean) {
        if (isCorrect) {
            questionCorrectList.value.push({ name, formula, neededHelp });
        } else {
            questionWrongList.value.push({ name, formula, neededHelp });
        }
        questionCounter.value++;
    }

    function getQuestionLists() {
        return {
            correct: questionCorrectList.value,
            wrong: questionWrongList.value,
            counter: questionCounter.value
        };
    }

    function $clearQuestions() {
        questionCorrectList.value = [];
        questionWrongList.value = [];
        questionCounter.value = 0;
    }

    return { questionCorrectList, questionWrongList, questionCounter, addQuestion, getQuestionLists, $clearQuestions }
});
