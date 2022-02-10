import { useEffect, useState } from 'react';
import { dbChallenges, IChallengesOfflineSchema } from '~/db';
import {
  GetChallengeDetailQuery,
  GetSubscriptionProgressQuery,
} from '~/graphql/autogenerate/operations';

function useOfflineSubscription() {
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [
    subscription,
    setSubscription,
  ] = useState<GetSubscriptionProgressQuery>();

  const handleGetLocalSubscription = async (id: string) => {
    const realm = await dbChallenges();

    if (id) {
      const dashboardLocal = realm.objectForPrimaryKey<IChallengesOfflineSchema>(
        'ChallengesOffline',
        id,
      );

      if (dashboardLocal) {
        const parsedJSON = JSON.parse(dashboardLocal.content);
        if (parsedJSON) {
          setSubscription(parsedJSON);
          setLocalLoading(false);
        }
      }
    }
  };

  const handleRealmSaveSubscription = async (
    data: GetSubscriptionProgressQuery,
  ) => {
    try {
      const realmUser = await dbChallenges();

      if (data.getSubscriptionProgress.id) {
        const dashboardLocal = realmUser.objectForPrimaryKey<IChallengesOfflineSchema>(
          'ChallengesOffline',
          data.getSubscriptionProgress.id,
        );
        if (dashboardLocal) {
          realmUser.write(() => {
            dashboardLocal.content = JSON.stringify(data);
            dashboardLocal.updated_at = new Date().toISOString();
          });
        } else {
          realmUser.write(() => {
            realmUser.create<IChallengesOfflineSchema>('ChallengesOffline', {
              id: data.getSubscriptionProgress.id,
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

  return {
    handleGetLocalSubscription,
    handleRealmSaveSubscription,
    subscription,
    localLoading,
  };
}

export { useOfflineSubscription };
