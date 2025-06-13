import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Ion } from '@/constants.ts'

/* This is a 2D array of ion data
The top level are the types of ions loaded (0-8)

    public static final int UNKNOWN = -1;

	public static final int CATION_SINGLE = 0;
	public static final int CATION_MULTI = 1;

	public static final int ANION_SIMPLE = 2;
	public static final int ANION_OXYACID = 3;
	public static final int ANION_DERIVATIVE = 4;
	public static final int ANION_HYDROGEN = 5;
	public static final int ANION_OTHER = 6;

	public static final int COVALENT_SIMPLE = 7;
	public static final int COVALENT_COMPLEX = 8;

The second level is the individual ion data.  ***This could be an object with key-value pairs instead.***
    private String name;
	private String formula;
	private String charge;
	private String chargeUsed = "";		    //this is the actual charge that has been randomly selected for multivalent ions
	private boolean isMultivalent = false; 	// true if charge has more than 1 char
	private boolean isPolyAtom = false;		// true if formula has more than 1 capital letter

*/

const Roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
const Greek = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca']

// type ListsType = Array<[string, string, number, boolean, boolean]>
export const useIonListsStore = defineStore('ionLists', () => {
    // const lists = ref([]);
    // const lists: Ref<ListsType> = ref({});
    const lists = ref<Array<Array<[string, string, number, boolean, boolean, string, number, number]>>>([])

    const ionTypes = [
        '[cations-monovalent]', //0
        '[cations-multivalent]',
        '[anions-simple]',
        '[anions-polyatomic]',
        '[anions-derivative]',
        '[anions-hydrogen]',
        '[anions-other]', //6
        '[covalent-simple]', //7
        '[covalent-complex]', //8
    ]

    /*
    function $reset() {
        lists.value = [];
    }*/

    // function $addIon(name: string, formula: string, charge: number, type: number) {
    function $addIon(type: number, line: string) {
        // Parse the line into name, formula, charge
        const parts = line.split(',');
        const name = parts[0].trim();
        const formula = parts[1].trim();
        let charge = 0;
        let altName = '';
        let chargeN = 0;
        let electronegativity = 0;
        if (type == ionTypes.indexOf('[covalent-complex]')) {
            //no charge, but rather, an alternate name
            altName = parts[2]?.trim();
        } else if (type == ionTypes.indexOf('[covalent-simple]')) {
            altName = parts[2]?.trim(); //-ide form of name
            charge = parseInt(parts[3].trim());
            chargeN = parseInt(parts[4].trim());
            electronegativity = parseFloat(parts[5].trim());

        } else {
            charge = parseInt(parts[2].trim())
            if (isNaN(charge)) {
                console.error('Invalid charge value:', parts[2].trim())
                return
            }
        }
        // Ensure the lists array has enough sub-arrays for the type
        while (lists.value.length <= type) {
            lists.value.push([]) // Initialize empty array for this type
        }
        // Validate the type
        if (type < 0 || type >= ionTypes.length || !lists.value[type]) {
            // console.error('Invalid ion type:', type)
            return
        }
        /*
        let data = {
            name: name,
            formula: formula,
            charge: charge,
            chargeUsed: "",
            isMultivalent: false,
            isPolyAtom: false
        };*/

        let isMultivalent = false
        if (charge > 9) {
            // if charge has more than 1 char, it is multivalent
            isMultivalent = true
        }
        let isPolyAtom = false
        // Determine if formula has more than one capital letter
        const capitalLetters = formula.match(/[A-Z]/g) // Match all uppercase letters
        if (capitalLetters && capitalLetters.length > 1) {
            isPolyAtom = true
        }
        //charge is for cation or anion
        //for covalent charge will be the + charge, and so multivalent will still work
        //altName is the altname for complex covalent or the -ide name for simple covalent
        const data = [name, formula, charge, isMultivalent, isPolyAtom, altName, chargeN, electronegativity] as [
            string,
            string,
            number,
            boolean,
            boolean,
            string,
            number,
            number
        ]
        lists.value[type].push(data)
    }

    //get a list of all ions of a specific type
    function $getListByType(type: number) {
        if (type < 0 || type >= ionTypes.length) {
            // console.error('Invalid ion type:', type) //this is intentional sometimes, in order to get an empty ion object
            return []
        }
        return lists.value[type] || []
    }

    function $getEmptyIon(): Ion {
        return {
            name: '',
            formula: '',
            charge: 0,
            isMultivalent: false,
            isPolyAtom: false,
            altName: '',
            chargeN: 0,
            electronegativity: 0,
            greek: '',
            roman: '',
        }
    }

    /* Get a random ion from the specified list of ions.
    Return an ARRAY -- I should have made this a Tuple.
    The array was not working with typescript, so I made it a object */
    function $getRandomIon(type: number): Ion {
        const list = $getListByType(type)
        if (list.length === 0) {
            return $getEmptyIon();
        }

        const randomIndex = Math.floor(Math.random() * list.length)

        //We will return an array with the following data:
        // name, formula, a random charge (if is multivalent), isMultiValent, isPolyAtomic, greek, roman, (the last two are empty strings if monovalent)
        const ion = list[randomIndex]
        let charge = ion[2]
        const isMultivalent = ion[3] // boolean
        if (isMultivalent) {
            // If the ion is multivalent, randomly select a charge from the available charges
            const charges = '' + charge
            const randIndex = Math.floor(Math.random() * charges.length)
            charge = parseInt(charges[randIndex])
        }
        const greek = Greek[charge]
        const roman = Roman[charge]

        /*
        return [
            ion[0], // name
            ion[1], // formula
            charge,
            ion[3], // isMultivalent
            ion[4], // isPolyAtom
            isMultivalent ? greek : '', // greek prefix
            isMultivalent ? roman : '', // roman numeral
        ]
        */
        //This must be an object not an array, since TypeScript will complain about the return type
        return {
            name: ion[0],
            formula: ion[1],
            charge: charge,
            isMultivalent: ion[3],
            isPolyAtom: ion[4],
            altName: ion[5],
            chargeN: ion[6],
            electronegativity: ion[7],
            greek: isMultivalent ? greek : '',
            roman: isMultivalent ? roman : '',
        }
    }

    return { lists, ionTypes, $addIon, $getRandomIon, $getEmptyIon, $getListByType }
})
