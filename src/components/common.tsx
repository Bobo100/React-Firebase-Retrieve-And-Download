import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/init-firebase";
import { createElement } from "react";
/**
 * 讓useState獲取資料庫的內容
 * @param {setState} setCollections
 * @param {string} collectionName
 */


export async function getCollections(setCollections: (collections: Array<{ data: any; id: string }>) => void, collectionName: string) {
  const CollectionRef = collection(db, collectionName);

  try {
    const response = await getDocs(CollectionRef);
    const collections = response.docs.map((doc) => ({
      data: doc.data(),
      id: doc.id,
    }));
    setCollections(collections);
    // console.log(setCollections)
  } catch (error) {
    console.error(error);
  }
}
