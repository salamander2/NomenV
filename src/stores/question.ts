import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useQuestionStore = defineStore('question', () => {
    const question = ref({
        name: '',
        formula: '',
        isCovalent: false,
        isSimpleCovalent: false,
        cation: {},
        anion: {},
    })

    function setQuestion(
        name: string,
        formula: string,
        isCovalent: boolean,
        isSimpleCovalent: boolean,
        cation: object,
        anion: object,
    ) {
        question.value.name = name
        question.value.formula = formula
        question.value.isCovalent = isCovalent
        question.value.isSimpleCovalent = isSimpleCovalent
        question.value.cation = cation
        question.value.anion = anion
    }

    return { question, setQuestion }
})
