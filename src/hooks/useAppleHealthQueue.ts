import React, { useEffect, useRef, useState } from 'react';
import { useStoreActions, useStoreState } from '~/store';
import {
  GetUserActivitiesDocument,
  useCreateActivityV2Mutation,
} from '~/graphql/autogenerate/hooks';

export function useAppleHealthQueue(): {
  saveMonitorLocal: () => Promise<void>;
  loading: boolean;
} {
  const queue = useStoreState((state) => state.appleHealthQueue.queue);
  const lastUploadedActivity = useRef(0);
  const [loading, setLoading] = useState(false);
  const [createActivityMutation] = useCreateActivityV2Mutation({
    onCompleted: () => console.log('completou'),
    onError: (e) => console.log('Houve um Erro', e.message),
  });
  const setSyncLoading = useStoreActions(
    (actions) => actions.appleHealthQueue.setSyncLoading,
  );
  const removeElementFromQueue = useStoreActions(
    (actions) => actions.appleHealthQueue.removeElementFromQueue,
  );

  useEffect(() => {
    setSyncLoading(loading);
  }, [loading]);

  const saveAppleHealthActivities = async () => {
    console.log('entrou aqui ein');
    setLoading(true);

    if (queue) {
      console.log(
        '🚀 ~ file: useAppleHealthQueue.ts ~ line 35 ~ saveAppleHealthActivities ~ queue',
        queue,
      );
      console.log('tem queue');
      const { data, errors } = await createActivityMutation({
        variables: {
          activities_data: queue,
        },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: GetUserActivitiesDocument,
          },
        ],
      });
      removeElementFromQueue();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    saveAppleHealthActivities();
  }, [queue]);
  return { saveMonitorLocal: saveAppleHealthActivities, loading };
}
