import { ref } from 'vue'
import { defineStore } from 'pinia'

const FORMULA: number = 0;
const NAME: number = 1;

//I have had to move "answerType" here because there is too much to do in QuestionPanel

export const useQuestionStore = defineStore('question', () => {
    const question = ref({
        name: '',
        formula: '',
        isCovalent: false,
        isSimpleCovalent: false,
        cation: {},
        anion: {},
        answerType: FORMULA,
        alternativeName: '',  //for complex covalent, and also for simple covalent where it stores the negative value of the name (-ide)

    })

    //FIXME why do I not need "actions: {}" here?
    function setQuestion(
        name: string,
        formula: string,
        isCovalent: boolean,
        isSimpleCovalent: boolean,
        cation: object,
        anion: object,
        answerType: number = FORMULA,
        alternativeName?: string,
    ) {
        question.value.name = name;
        question.value.formula = formula;
        question.value.isCovalent = isCovalent;
        question.value.isSimpleCovalent = isSimpleCovalent;
        question.value.cation = cation;
        question.value.anion = anion;
        question.value.answerType = answerType;
        question.value.alternativeName = alternativeName ?? ''; // Default to empty string if not provided
    }

    return { question, setQuestion }
})
