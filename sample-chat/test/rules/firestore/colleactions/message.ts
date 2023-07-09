import {
  assertFails,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import {
  getTestEnv,
  setCollection
} from '@/../test/rules/firestore/utils'

import { messageFactory } from '@/../test/factories/message';
import { userFactory } from '@/../test/factories/user';

const user = userFactory.build({ id: 'user-id' });
const other = userFactory.build({ id: 'other-id' });
const users = [user, other];
const userMessage = messageFactory.build({
  id: 'user-message-id',
  senderId: user.id,
});

const otherMessage = messageFactory.build({
  id: 'other-message-id',
  senderId: other.id,
})

const messages = [userMessage, otherMessage];

export const messagesTest = () => {
  let env: RulesTestEnvironment;

  beforeEach(async () => {
    env = getTestEnv();
    await env.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setCollection(adminDb.collection('users'), users);
      await setCollection(adminDb.collection('messages'), messages);
    })
  })

  describe('Not authenticated', async () => {
    let db: firebase.firestore.Firestore;
    beforeEach(() => {
      db = env.unauthenticatedContext().firestore();
    })

    it('cannnot read(get)', async () => {
      const ref = db.collection('messages').doc(otherMessage.id)
      await assertFails(ref.get())
    })
  })
}

