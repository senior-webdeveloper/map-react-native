import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Icons, Text } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { ConfirmationProps } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';

export function PhysicalEventComponent({
  onPress,
  params,
  userProfile,
}: {
  params: ConfirmationProps;
  userProfile: any;
  onPress: () => void;
}) {
  return (
    <>
      <View style={{ alignItems: 'center', marginVertical: 37 }}>
        <View
          style={{
            width: 170,
            borderBottomWidth: 0.5,
            borderBottomColor: '#161C25',
            opacity: 0.2,
          }}
        />
      </View>

      <View style={{ alignItems: 'center', width: '100%' }}>
        <Icons name="truck" />
        <Text
          style={{
            width: widthPercentageToDP('58'),
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          {params.withdrawAddresse
            ? 'Retirada no Local'
            : 'Entrega no endereço'}
        </Text>
        {params.withdrawAddresse ? (
          <>
            <Text
              style={{
                width: widthPercentageToDP('58'),
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              {params.withdrawAddresse.address_line_one},{' '}
              {params.withdrawAddresse.street_number}{' '}
              {params.withdrawAddresse.address_line_two.length > 1
                ? params.withdrawAddresse.address_line_two
                : null}
              {', '}
              {params.withdrawAddresse.city?.name}/
              {params.withdrawAddresse.city?.state.abbreviation}
            </Text>
            <Text style={{ opacity: 0.56 }}>
              CEP: {params.withdrawAddresse.zip_code}
            </Text>
          </>
        ) : (
          <>
            <Text
              style={{
                width: widthPercentageToDP('58'),
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              {userProfile?.getProfile.user.address_line_one},{' '}
              {userProfile?.getProfile.user.address_line_two},{' '}
              {userProfile?.getProfile.user.city?.name}/
              {userProfile?.getProfile.user.city?.state.abbreviation}
            </Text>
            <Text style={{ opacity: 0.56 }}>
              CEP: {userProfile?.getProfile.user.zip_code}
            </Text>
          </>
        )}

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
          }}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={onPress}
        >
          <Text style={{ color: '#0564ff', fontSize: 18 }}>Trocar</Text>
          <Icons name="arrow-right" height={9} color="#0564ff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
