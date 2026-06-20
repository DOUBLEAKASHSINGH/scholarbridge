import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Opportunity } from "@/types";

// Collection Reference
const opportunitiesCollection = collection(db, "opportunities");

export const addOpportunity = async (opportunityData: Omit<Opportunity, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(opportunitiesCollection, {
      ...opportunityData,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding opportunity: ", error);
    throw error;
  }
};

export const getOpportunities = async (): Promise<Opportunity[]> => {
  try {
    const q = query(opportunitiesCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const opportunities: Opportunity[] = [];
    querySnapshot.forEach((doc) => {
      opportunities.push({ id: doc.id, ...doc.data() } as Opportunity);
    });
    return opportunities;
  } catch (error) {
    console.error("Error fetching opportunities: ", error);
    throw error;
  }
};

export const deleteOpportunity = async (id: string) => {
  try {
    await deleteDoc(doc(db, "opportunities", id));
  } catch (error) {
    console.error("Error deleting opportunity: ", error);
    throw error;
  }
};
