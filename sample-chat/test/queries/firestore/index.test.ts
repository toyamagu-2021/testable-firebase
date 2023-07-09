import { initializeTestEnvironment, getTestEnv } from '@/../test/utils';
import { messagesTest } from '@/../test/queries/firestore/collections/messages';

describe('firestore.queries', () => {
  beforeAll(async () => {
    await initializeTestEnvironment('sample-chat-toyamagu-2021');
  });

  afterAll(async () => {
    await getTestEnv().cleanup();
  });

  afterEach(async () => {
    await getTestEnv().clearFirestore();
  });

  messagesTest();
});
