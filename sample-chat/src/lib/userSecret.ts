import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore"
import { collection } from "firebase/firestore/lite"
import { getConverter } from "./firebase";
import { UserSecretDocumentData } from "@/shared/types/userSecret";

export const userSecretsRef = () => collection(
  getFirestore(),
  'userSecrets',
).withConverter(getConverter<UserSecretDocumentData>());

export const setUserSecret = async (
  uid: string,
  { fcmToken }: { fcmToken: string }
) => {
  const userSecret = { fcmToken, createdAt: serverTimestamp() };
  await setDoc(doc(userSecretsRef(), uid), userSecret, {
    merge: true,
  })
}


