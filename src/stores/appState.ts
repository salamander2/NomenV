import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('appState', () => {
    const state = ref('SETUP')
    const getState = computed(() => state.value)
    const questionOptions = ref(0)
    return { state, getState, questionOptions }
})
