const { init, device } = require('detox');
const adapter = require('detox/runners/jest/adapter');

const config = require('../package.json').detox;

// Set the default timeout
jest.setTimeout(60000);

beforeAll(async () => {
  await init({ config, launchApp: false });
  await device.launchApp({
    permissions: {
      notifications: 'YES',
      camera: 'YES',
      medialibrary: 'YES',
      photos: 'YES',
      microphone: 'YES',
    },
  });
}, 60000);

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});
