import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';
import { Button, Text, TitleText } from '~/components';

export function ErrorComponent(props: { onPress: () => void }) {
  return (
    <>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}
      >
        <FastImage
          style={{ width: 149, height: 149 }}
          source={require('../images/out-of-stock.png')}
        />
        <TitleText style={{ textAlign: 'center' }}>
          Produto sem estoque
        </TitleText>
        <Text style={{ textAlign: 'center' }}>
          Parece que um item da sua compra ficou sem estoque.
        </Text>
        <Text style={{ textAlign: 'center' }}>
          Mas fique tranquilo, pois nenhum débito foi realizado e você poderá
          tentar comprar a inscrição novamente.
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 32,
          paddingBottom: 20,
        }}
      >
        <Button name="Ir para o desafio" onPress={props.onPress} />
      </View>
    </>
  );
}
