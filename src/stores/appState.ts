import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('appState', () => {
    const state = ref('OPTIONS')
    const QTypeIonic = ref(0)
    return { state, QTypeIonic }
})
