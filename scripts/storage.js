import * as SecureStore from "expo-secure-store";

/**
 * Function to save data to user's storage (so it persists after the app is closed).
 * @param key: the "id" of the attached value. This key is needed to fetch this data.
 * @param value: a JSON object containing the data that needs to be saved.
 */
export const saveSecurely = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await SecureStore.setItemAsync(key, jsonValue);
        console.log('saved cafe ', key)
    }catch (error){
        throw error;
    }
}

/**
 * Function to save data to user's storage (so it persists after the app is closed). Synchronous.
 * @param key: the "id" of the attached value. This key is needed to fetch this data.
 * @param value: a JSON object containing the data that needs to be saved.
 */
export const saveSync = (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        SecureStore.setItem(key, jsonValue);
        console.log('saved cafe ', key)
    }catch (error){
        throw error;
    }
}

/**
 * This function will add the new cafe to the favorites list.
 * It will check if a list already exists, if it does, then it will add
 * the new value. Otherwise, it will create the list with the new value inside.
 * @param newValue 
 */
export const saveFav = async (newValue) =>{
    try{
        if (fetchSync('favorites') != null){
            let fetchData = JSON.parse(fetchSync('favorites'));
            if (!fetchData.includes(newValue)){
                fetchData.push(newValue);
                await deleteSecurely('favorites');
                saveSync('favorites', JSON.stringify(fetchData));
            }
        } else {
            saveSync('favorites', JSON.stringify([newValue]));
        }
    }catch (error){
        throw error;
    }
}

/**
 * Function to fetch the saved data.
 * @param key: the "id" of the attached value. This key is needed to fetch this data.
 * @returns a JSON object containing the data that was fetched. If no data was found, returns null
 */
export const fetchSecurely = async (key) => {
    try {
        const jsonValue = await SecureStore.getItemAsync(key);
        console.log('fetched value: ', jsonValue != null ? JSON.parse(jsonValue).slug : null);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }catch (error){
        throw error;
    }
}

/**
 * Function to fetch the saved data (synchronous, scopes the localStorage).
 * @param key: the "id" of the attached value. This key is needed to fetch this data.
 * @returns a JSON object containing the data that was fetched. If no data was found, returns null
 */
export const fetchSync = (key) => {
    try {
        const jsonValue = SecureStore.getItem(key);
        console.log('fetched value: ', JSON.parse(jsonValue)?.slug);
        return jsonValue != null ? JSON.parse(jsonValue) : null 
    }catch (error){
        throw error;
    }
}

/**
 * Function to delete saved data
 * @param key : the key attached to the saved data that needs to be removed
 */
export const deleteSecurely = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
    }catch (error) {
        throw error;
    }
}