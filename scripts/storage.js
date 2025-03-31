import * as SecureStore from "expo-secure-store";

/**
 * Function to save data securely.
 * @param key The identifier for the stored data.
 * @param value A JSON object containing the data to be saved.
 */
export const saveSecurely = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await SecureStore.setItemAsync(key, jsonValue);
        console.log("Saved:", key);
    } catch (error) {
        console.error("SecureStore Save Error:", error);
    }
};

/**
 * Function to fetch saved data securely.
 * @param key The identifier for the stored data.
 * @returns A parsed JSON object if data exists, otherwise null.
 */
export const fetchSecurely = async (key) => {
    try {
        const jsonValue = await SecureStore.getItemAsync(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error("SecureStore Fetch Error:", error);
        return null;
    }
};

/**
 * Function to delete saved data securely.
 * @param key The key for the stored data.
 */
export const deleteSecurely = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
        console.log("Deleted:", key);
    } catch (error) {
        console.error("SecureStore Delete Error:", error);
    }
};

/**
 * Function to save a favorite cafe.
 * If the favorites list exists, add the new cafe; otherwise, create a new list.
 * @param newValue The new cafe object to be saved.
 */
export const saveFav = async (newValue) => {
    try {
        const storedFavorites = await fetchSecurely("favorites") || [];
        
        // Check if cafe already exists in favorites
        if (!storedFavorites.some(fav => fav.cafe_id === newValue.cafe_id)) {
            const updatedFavorites = [...storedFavorites, newValue];
            await saveSecurely("favorites", updatedFavorites);
            console.log("Added to favorites:", newValue.cafe_id);
        } else {
            console.log("Cafe already in favorites:", newValue.cafe_id);
        }
    } catch (error) {
        console.error("Save Favorite Error:", error);
    }
};

/**
 * Function to remove a specific favorite cafe by ID.
 * @param cafeId The ID of the cafe to remove.
 */
export const deleteFav = async (cafeId) => {
    try {
        let storedFavorites = await fetchSecurely("favorites") || [];

        // Filter out the cafe that needs to be deleted
        const updatedFavorites = storedFavorites.filter(fav => fav.cafe_id !== cafeId);

        if (updatedFavorites.length === 0) {
            await deleteSecurely("favorites"); // Delete key only if the list is empty
            console.log("Deleted all favorites as last one was removed.");
        } else {
            await saveSecurely("favorites", updatedFavorites);
            console.log("Removed from favorites:", cafeId);
        }
    } catch (error) {
        console.error("Delete Favorite Error:", error);
    }
};

/**
 * Function to retrieve all saved favorite cafes.
 * @returns An array of favorite cafes or an empty array if none exist.
 */
export const getFavorites = async () => {
    try {
        const favorites = await fetchSecurely("favorites");
        return favorites || [];
    } catch (error) {
        console.error("Get Favorites Error:", error);
        return [];
    }
};