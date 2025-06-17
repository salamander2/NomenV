import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('appState', () => {
    //'appState' is required for Pinia internals, and also for Vue Devtools to work properly.
    const state = ref('SETUP')
    const getState = computed(() => state.value)
    const questionOptions = ref(0)
    return { state, getState, questionOptions }
})
