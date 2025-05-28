import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

/* This is a 2D array of ion data
The top level are the types of ions loaded (0-9)

    public static final int UNKNOWN = -1;

	public static final int CATION_SINGLE = 0;
	public static final int CATION_MULTI = 1;
	//public static final int CATION_BOTH = 2;

	public static final int ANION_SIMPLE = 3;
	public static final int ANION_OXYACID = 4;
	public static final int ANION_DERIVATIVE = 5;
	public static final int ANION_HYDROGEN = 6;
	public static final int ANION_OTHER = 7;

	public static final int COVALENT_SIMPLE = 8;
	public static final int COVALENT_COMPLEX = 9;

The second level is the individual ion data.  This could be an object with key-value pairs instead.
    private String name;
	private String formula;
	private String charge;
	private String chargeUsed = "";		    //this is the actual charge that has been randomly selected for multivalent ions
	private boolean isMultivalent = false; 	// true if charge has more than 1 char
	private boolean isPolyAtom = false;		// true if formula has more than 1 capital letter
	
*/
export const useIonListsStore = defineStore('ionLists', () => {
    const lists = ref([]);
	
	const ionTypes = [
		"[cations-monovalent]",  //0
		"[cations-multivalent]",
		"[cations-both]",				// wont be used, just a filler
		"[anions-simple]",
		"[anions-polyatomic]",
		"[anions-derivative]",
		"[anions-hydrogen]",
		"[anions-other]",
		"[covalent-simple]",
		"[covalent-complex]",	//9
	];

    return { lists, ionTypes};
})
