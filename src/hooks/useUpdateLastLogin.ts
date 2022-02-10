import { APP_VERSION } from '@env';
import { getDeviceName } from 'react-native-device-info';
import { Platform } from 'react-native';
import { useUpdateUserDataCompiledMutation } from '~/graphql/autogenerate/hooks';
import { UpdateUserDataCompiledInput } from '~/graphql/autogenerate/schemas';

function useUpdateLastLogin(): {
  handleUpdateLastLogin: () => Promise<void>;
} {
  const [updateUserDataCompiledMutation] = useUpdateUserDataCompiledMutation();

  async function handleUpdateLastLogin() {
    const deviceName = await getDeviceName();
    const data: UpdateUserDataCompiledInput = {
      last_app_version_used: APP_VERSION,
      last_platform_used: Platform.OS,
      last_time_used: new Date().toISOString(),
      last_device_used: deviceName,
    };

    await updateUserDataCompiledMutation({
      variables: {
        data,
      },
    });
  }

  return {
    handleUpdateLastLogin,
  };
}

export { useUpdateLastLogin };
