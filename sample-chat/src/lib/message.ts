import { getFirestore } from "@firebase/firestore";
import {
  query,
  collection,
  orderBy,
} from 'firebase/firestore';
import { getConverter } from "./firebase";
import { MessageDocumentData } from "@/types/message";

export const messagesRef = () => collection(getFirestore(), 'messages').withConverter(
  getConverter<MessageDocumentData>()
);

export const messagesQuery = () => query(messagesRef(), orderBy('createdAt', 'asc'))
