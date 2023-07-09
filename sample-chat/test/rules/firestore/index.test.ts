import { messagesTest } from "./collections/message";
import { usersTest } from "./collections/user";
import { initializeTestEnvironment, getTestEnv } from "@/../test/utils";


describe('firestore.rules', () => {
  beforeAll(async () => {
    await initializeTestEnvironment('fs-sample-open-chat-test-firestore');
  });

  afterAll(async () => {
    await getTestEnv().cleanup();
  })
  afterEach(async () => {
    await getTestEnv().clearFirestore();
  })

  usersTest();
  messagesTest();
})
