//These are the arrays of ions in ionLists.ts
export const UNKNOWN: number = -1
export const CATION_SINGLE: number = 0
export const CATION_MULTI: number = 1
export const ANION_SIMPLE: number = 2
export const ANION_OXYACID: number = 3
export const ANION_DERIVATIVE: number = 4
export const ANION_HYDROGEN: number = 5
export const ANION_OTHER: number = 6
export const COVALENT_SIMPLE: number = 7
export const COVALENT_COMPLEX: number = 8

export interface Ion {
    name: string
    formula: string
    charge: number
    // isMultivalent?: boolean;         //this means "optional property" in TypeScript
    isMultivalent: boolean
    isPolyAtom: boolean
    greek: string
    roman: string
}
