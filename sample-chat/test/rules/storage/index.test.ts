// @vitest-environment node
import { getTestEnv, initializeTestEnvironment } from "../../utils";
import { messagesTest } from "./messages"

describe('storage.rules', () => {
  beforeAll(async () => {
    await initializeTestEnvironment(
      'testable-firebase-sample-chat-storage-rules-test'
    );
  });

  afterAll(async () => {
    await getTestEnv().cleanup();
  })

  afterEach(async () => {
    await getTestEnv().clearStorage();
  });

  messagesTest();

});
