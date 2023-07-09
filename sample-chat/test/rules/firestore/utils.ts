import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs';
import { getConverter, WithId } from '@/lib/firebase';
import firebase from 'firebase/compat/app';

let testEnv: RulesTestEnvironment;

export const initializeTestEnvironment = async () => {
  testEnv = await _initializeTestEnvironment({
    projectId: 'fs-sample-open-chat-test',
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
