import { messagesTest } from "./rules/firestore/colleactions/message";
import { usersTest } from "./rules/firestore/colleactions/user";
import { initializeTestEnvironment, getTestEnv } from "./rules/firestore/utils";

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

describe('firestore.rules', () => {
  beforeAll(async () => {
    await initializeTestEnvironment();
  })

  afterAll(async () => {
    await getTestEnv().cleanup();
  })
  afterEach(async () => {
    await getTestEnv().clearFirestore();
  })

  usersTest();
  messagesTest();
})
