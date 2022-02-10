import { useState } from 'react';
import { dbPayments, IPaymentsSchema } from '~/db';
import { GetPaymentsOfASubscriptionQuery } from '~/graphql/autogenerate/operations';

function useOfflinePayments() {
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [
    subscription,
    setSubscription,
  ] = useState<GetPaymentsOfASubscriptionQuery>();

  const handleGetLocalPayments = async (id: string) => {
    const realm = await dbPayments();

    if (id) {
      const dashboardLocal = realm.objectForPrimaryKey<IPaymentsSchema>(
        'Payments',
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

  const handleRealmSavePayment = async (
    data: GetPaymentsOfASubscriptionQuery,
    sub_id: string,
  ) => {
    try {
      const realmUser = await dbPayments();

      if (data.getPaymentsOfASubscription) {
        const dashboardLocal = realmUser.objectForPrimaryKey<IPaymentsSchema>(
          'Payments',
          sub_id,
        );
        if (dashboardLocal) {
          realmUser.write(() => {
            dashboardLocal.content = JSON.stringify(data);
            dashboardLocal.updated_at = new Date().toISOString();
          });
        } else {
          realmUser.write(() => {
            realmUser.create<IPaymentsSchema>('Payments', {
              id: sub_id,
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
    handleGetLocalPayments,
    handleRealmSavePayment,
    subscription,
    localLoading,
  };
}

export { useOfflinePayments };
