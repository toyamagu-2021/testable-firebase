import { getFirestore } from "@firebase/firestore";
import {
  query,
  collection,
  orderBy,
  addDoc,
  DocumentReference,
} from 'firebase/firestore';
import { getConverter } from "./firebase";
import { MessageDocumentData } from "@/types/message";

export const collectionName = 'messages';

export const messagesRef = () => collection(getFirestore(), 'messages').withConverter(getConverter<MessageDocumentData>());

export const messagesQuery = () => query(messagesRef(), orderBy('createdAt', 'asc'));

export const addMessage = async (
  message: MessageDocumentData
): Promise<DocumentReference<MessageDocumentData>> => {
  return addDoc(messagesRef(), message);
}
