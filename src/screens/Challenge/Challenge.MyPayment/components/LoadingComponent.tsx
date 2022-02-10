import {
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Icons, SafeAreaView, Text } from '~/components';

export function LoadingComponent({ onPress }: { onPress: () => void }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 14,
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          height: '90%',
        }}
      >
        <ActivityIndicator size="large" color="#0564FF" />
        <Text style={{ textAlign: 'center', marginTop: 14 }}>
          Carregando Informações de pagamento...
        </Text>
      </View>
    </SafeAreaView>
  );
}
