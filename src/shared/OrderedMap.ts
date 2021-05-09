/**
 * ADT for implementing a ordered map
 */
export class OrderedMap<T> {
	// Keeps track of key order
	private keys: string[] = null;
	// Maps location to key
	private keyOrder: { [key: string]: number } = null;
	// Maps data to key
	private values: { [key: string]: T } = ({} = null);

	length: number = 0;

	constructor() {
		this.keys = [];
		this.keyOrder = {};
		this.values = {};
	}

	/**
	 * Stores key value pair
	 * @param key
	 * @param value
	 */
	push(key: string, value: T) {
		if (key in this.values) {
			console.error("Key: " + key + " already exists");
			return;
		}
		this.keys.push(key);
		this.keyOrder[key] = this.keys.length - 1;
		this.values[key] = value;

		this.length++;
	}

	/**
	 * Removes key value pair
	 * @param key
	 * @param value
	 */
	remove(key: string) {
		delete this.values[key];
		delete this.keyOrder[key];

		this.keys = this.keys.filter((i: string) => {
			return key !== i;
		});

		this.length--;
	}

	/**
	 * Gets value mapped to key param
	 * @param key
	 * @returns value mapped to key
	 */
	get(key: string): T {
		return this.values[key];
	}

	getByIndex(index: number) {
		return this.keys[index];
	}

	/**
	 * Swap positions of two keys
	 * @param firstKey
	 * @param secondKey
	 */
	swap(firstKey: string, secondKey: string) {
		// perform swaps in keys array
		var tempKey = this.keys[this.keyOrder[firstKey]];
		this.keys[this.keyOrder[firstKey]] = secondKey;
		this.keys[this.keyOrder[secondKey]] = tempKey;

		// update keyOrder
		var tempOrder = this.keyOrder[firstKey];
		this.keyOrder[firstKey] = this.keyOrder[secondKey];
		this.keyOrder[secondKey] = tempOrder;
	}

	/**
	 *
	 * @returns Array of keys in their current order
	 */
	getKeys() {
		return this.keys;
	}

	/**
	 *
	 * @returns Object of key value mappings
	 */
	getMap() {
		return this.values;
	}

	/**
	 * Gets index of key location in array
	 * @param key
	 */
	getLocationOfKey(key: string) {
		return this.keyOrder[key];
	}
}
