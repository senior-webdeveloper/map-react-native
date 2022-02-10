const {
  DetoxCircusEnvironment,
  SpecReporter,
  WorkerAssignReporter,
} = require('detox/runners/jest-circus');

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config) {
    super(config);

    // Can be safely removed, if you are content with the default value (=300000ms)
    this.initTimeout = 300000;

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    this.registerListeners({
      SpecReporter,
      WorkerAssignReporter,
    });
  }

  async initDetox() {
    const instance = await this.detox.init(undefined, { launchApp: false });
    await instance.device.launchApp({
      permissions: { notifications: 'YES', location: 'always' },
    });
    return instance;
  }
}

module.exports = CustomDetoxEnvironment;
