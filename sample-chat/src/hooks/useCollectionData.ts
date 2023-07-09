import { Query } from 'firebase/firestore';
import {
  useMemo
} from 'react';
import {
  useCollectionData as _userCollectionData
} from 'react-firebase-hooks/firestore';

export const useCollectionData = <T>(
  _query: Query<T>,
  deps: unknown[] = []
) => {
  const query = useMemo(() => _query, deps);
  return _userCollectionData(query, {
    snapshotOptions: { serverTimestamps: 'estimate' },
  });
}
