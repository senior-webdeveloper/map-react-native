import React from 'react';
import { Alert, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from '@env';
import {
  UserEditProfileContainer,
  UserEditProfileText,
} from '~/screens/Home/Tabs/Profile/styles';

const Test: React.FC = () => {
  const documentPicker = async () => {
    const formData = new FormData();
    const universalToken = await AsyncStorage.getItem('@riderize::acesstoken');
    const universalRefreshToken = await AsyncStorage.getItem(
      '@riderize::refreshtoken',
    );
    const userIDAsyncStorage = await AsyncStorage.getItem('@riderize::userid');
    try {
      const gpxFile = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const extension = gpxFile.name.split('.');
      if (extension[1] !== 'gpx') {
        Alert.alert('Erro', 'somente arquivos gpx sao permitidos');
        return;
      }
      formData.append('activity', gpxFile);
      formData.append('user_id', userIDAsyncStorage);
      const response = await axios.post(
        `${API}/import/activity/file`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${universalToken}`,
            'x-refresh-token': `Bearer ${universalRefreshToken}`,
          },
        },
      );
      if (response.status === 201) {
        Alert.alert('Sucesso!', response.data.message);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <TouchableOpacity onPress={() => documentPicker()}>
      <UserEditProfileContainer>
        <UserEditProfileText>Enviar arquivo gpx</UserEditProfileText>
      </UserEditProfileContainer>
    </TouchableOpacity>
  );
};
export default Test;
