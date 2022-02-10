/* eslint-env detox/detox, mocha */
describe('Example', () => {
  it('should be able to login', async () => {
    await expect(element(by.id('app-root'))).toBeVisible();
    await element(by.id('email-login')).tap();
    await element(by.id('email-login-modal')).tap();
    await element(by.id('email-login-modal-button')).tap();
    await element(by.id('email-input')).typeText('fake@riderize.com');
    await element(by.id('send-login-button')).tap();
    await element(by.id('password-input')).typeText(
      'a51234097eb0dea133e4738fcf69f9ed',
    );
    await element(by.id('send-login-button')).tap();
    await expect(element(by.id('challenges-view'))).toBeVisible();
  });

  it('should be able to tap in tab bar', async () => {
    await expect(element(by.id('tab-bar-settings'))).toBeVisible();
    await element(by.id('tab-bar-settings')).tap();

    await expect(element(by.id('tab-bar-notification'))).toBeVisible();
    await element(by.id('tab-bar-notification')).tap();

    await expect(element(by.id('tab-bar-riderize'))).toBeVisible();
    await element(by.id('tab-bar-riderize')).tap();

    await expect(element(by.id('tab-bar-challenges'))).toBeVisible();
    await element(by.id('tab-bar-challenges')).tap();

    await expect(element(by.id('tab-bar-challenges'))).toBeVisible();
    await element(by.id('tab-bar-challenges')).tap();

    await expect(element(by.id('tab-bar-user'))).toBeVisible();
    await element(by.id('tab-bar-user')).tap();
  });
});
