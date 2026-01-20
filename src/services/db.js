import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Adds a document to a Firestore collection
 * @param {string} collectionName - The name of the collection
 * @param {object} data - The data to add
 * @returns {Promise<string>} - The ID of the newly created document
 */
export const addDocument = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding document:", error);
        throw error;
    }
};
