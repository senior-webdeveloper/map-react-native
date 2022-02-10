import { useEffect, useState } from 'react';
import { dbChallenges, IChallengesOfflineSchema } from '~/db';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';

function useOfflineChallenge(id: string) {
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [challenge, setChallenge] = useState();

  const handleGetLocalChallenge = async () => {
    const realm = await dbChallenges();

    if (id) {
      const dashboardLocal = realm.objectForPrimaryKey<IChallengesOfflineSchema>(
        'ChallengesOffline',
        id,
      );

      if (dashboardLocal) {
        const parsedJSON = JSON.parse(dashboardLocal.content);
        if (parsedJSON) {
          setChallenge(parsedJSON);
          setLocalLoading(false);
        }
      }
    }
  };

  const handleRealmSaveChallenge = async (data: GetChallengeDetailQuery) => {
    try {
      const realmUser = await dbChallenges();

      if (id) {
        const dashboardLocal = realmUser.objectForPrimaryKey<IChallengesOfflineSchema>(
          'ChallengesOffline',
          id,
        );
        if (dashboardLocal) {
          realmUser.write(() => {
            dashboardLocal.content = JSON.stringify(data);
            dashboardLocal.updated_at = new Date().toISOString();
          });
        } else {
          realmUser.write(() => {
            realmUser.create<IChallengesOfflineSchema>('ChallengesOffline', {
              id,
              content: JSON.stringify(data),
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
    handleGetLocalChallenge();
  }, []);

  return {
    handleRealmSaveDashboard: handleRealmSaveChallenge,
    exploreChallenges: challenge,
    localLoading,
  };
}

export { useOfflineChallenge };
