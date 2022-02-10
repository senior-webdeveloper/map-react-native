import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { dbDashboard, IDashboardSchema } from '~/db';
import { ExploreChallengesV2Query } from '~/graphql/autogenerate/operations';

function useOfflineDashboard() {
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [exploreChallenges, setExploreChallenges] = useState([]);

  const handleGetLocalDashboard = async () => {
    const realm = await dbDashboard();
    const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

    if (userIdAsync) {
      const dashboardLocal = realm.objectForPrimaryKey<IDashboardSchema>(
        'Dashboard',
        userIdAsync,
      );

      if (dashboardLocal) {
        const parsedJSON = JSON.parse(dashboardLocal.content);
        if (parsedJSON) {
          setExploreChallenges(parsedJSON);
          setLocalLoading(false);
        }
      }
    }
  };

  const handleRealmSaveDashboard = async (data: ExploreChallengesV2Query) => {
    try {
      const realmUser = await dbDashboard();
      const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

      if (userIdAsync) {
        const dashboardLocal = realmUser.objectForPrimaryKey<IDashboardSchema>(
          'Dashboard',
          userIdAsync,
        );
        if (dashboardLocal) {
          realmUser.write(() => {
            dashboardLocal.content = JSON.stringify(data.exploreChallengesV2);
            dashboardLocal.updated_at = new Date().toISOString();
          });
        } else {
          realmUser.write(() => {
            realmUser.create<IDashboardSchema>('Dashboard', {
              id: userIdAsync,
              content: JSON.stringify(data.exploreChallengesV2),
              updated_at: new Date().toISOString(),
            });
          });
        }
        setLocalLoading(false);
        return;
      }
      setLocalLoading(false);
    } catch (error) {
      setLocalLoading(false);
    }
    setLocalLoading(false);

    // realmUser.close();
  };

  useEffect(() => {
    handleGetLocalDashboard();
  }, []);

  return { handleRealmSaveDashboard, exploreChallenges, localLoading };
}

export { useOfflineDashboard };
