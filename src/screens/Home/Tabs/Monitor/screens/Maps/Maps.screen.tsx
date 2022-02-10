import React from 'react';

import { AppState, TouchableOpacity } from 'react-native';

import { Box, Icons, SafeAreaView, Typography } from '~/components';

import { MapController } from '~/screens/Home/Tabs/Monitor/screens/Maps/components/MapController';
import { MapControls } from '~/screens/Home/Tabs/Monitor/screens/Maps/components/MapControls';

export default function ActivityMonitor({ navigation }) {
  return (
    <Box as={SafeAreaView} flex={1}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={18}
        style={{ zIndex: 6 }}
      >
        <Box as={TouchableOpacity} onPress={() => navigation.goBack()}>
          <Icons name="arrow_back" />
        </Box>

        <Typography type="h3">Pedalada</Typography>

        <Box as={TouchableOpacity}>
          <Icons name="settings" width={24} height={24} />
        </Box>
      </Box>
      <MapController />

      <MapControls navigation={navigation} />
    </Box>
  );
}
