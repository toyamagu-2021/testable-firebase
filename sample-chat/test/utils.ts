import { getConverter, WithId } from '@/lib/firebase';
import firebase from 'firebase/compat/app';
import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs';
let testEnv: RulesTestEnvironment;

export const initializeTestEnvironment = async (projectId: string) => {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  testEnv = await _initializeTestEnvironment({
    projectId: projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf-8'),
    },
  });
}

export const getTestEnv = () => testEnv;

export const setCollection = <T extends firebase.firestore.DocumentData>(
  ref: firebase.firestore.CollectionReference,
  instances: WithId<T>[]
) =>
  Promise.all(
    instances.map((_) =>
      ref.doc(_.id).set(getConverter<T>().toFirestore(_))
    )
  );
