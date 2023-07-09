import {
  assertSucceeds,
  assertFails,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import {
  getTestEnv,
  setCollection
} from '@/../test/rules/firestore/utils'

import { userFactory } from '@/../test/factories/user';

const user = userFactory.build({ id: 'user-id' });
const other = userFactory.build({ id: 'other-id' })
const users = [user, other];

export const usersTest = () => {
  let env: RulesTestEnvironment;
  beforeEach(async () => {
    env = getTestEnv();
    await env.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setCollection(adminDb.collection('users'), users);
    })
  })

  describe('Not authenticated', () => {
    let db: firebase.firestore.Firestore;
    beforeEach(() => {
      db = env.unauthenticatedContext().firestore();
    })

    it('cannot read(get)', async () => {
      const ref = db.collection('users').doc(other.id);
      await assertFails(ref.get());
    })

    it('cannot read(list)', async () => {
      const ref = db.collection('users');
      await assertFails(ref.get());
    })

    it('cannot create', async () => {
      const newUser = userFactory.build();
      const ref = db.collection('users');
      await assertFails(ref.add(newUser));
    })

    it('cannot update', async () => {
      const ref = db.collection('users').doc(other.id);
      await assertFails(ref.update({ name: 'another name' }))
    })

    it('cannot delete', async () => {
      const ref = db.collection('users').doc(other.id);
      await assertFails(ref.delete())
    })
  })

  describe('Authenticated', () => {
    it('can read list', async () => {
      const db = env.authenticatedContext(user.id).firestore();
      const ref = db.collection('users');
      await assertSucceeds(ref.get());
    })

    describe('own data', () => {
      let db: firebase.firestore.Firestore;
      beforeEach(() => {
        db = env.authenticatedContext(user.id).firestore();
      });

      it('can read(get)', async () => {
        const ref = db.collection('users').doc(user.id);
        await assertSucceeds(ref.get());
      })

      it('can create', async () => {
        const newUser = userFactory.build();
        const db = env.authenticatedContext(newUser.id).firestore();
        const ref = db.collection('users');
        await assertSucceeds(ref.doc(newUser.id).set(newUser));
      })

      it('can update', async () => {
        const ref = db.collection('users').doc(user.id);
        await assertSucceeds(ref.update({ name: 'another name' }));
      })

      it('can delete', async () => {
        const ref = db.collection('users').doc(user.id);
        await assertSucceeds(ref.delete());
      })
    })

    describe('not own data', () => {
      let db: firebase.firestore.Firestore;
      beforeEach(() => {
        db = env.authenticatedContext(user.id).firestore();
      });

      it('can read(get)', async () => {
        const ref = db.collection('users').doc(other.id);
        await assertSucceeds(ref.get())
      })

      it('cannot create', async () => {
        const newUser = userFactory.build();
        const ref = db.collection('users');
        await assertFails(ref.doc(newUser.id).set(newUser));
      })

      it('cannot update', async () => {
        const ref = db.collection('users').doc(other.id);
        await assertFails(ref.update({ name: 'another name' }));
      })

      it('cannot delete', async () => {
        const ref = db.collection('users').doc(other.id);
        await assertFails(ref.delete());
      })
    })
  })
}
