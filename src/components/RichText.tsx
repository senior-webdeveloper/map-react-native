import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import {
  actions,
  defaultActions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import SafeAreaView from './SafeAreaView';
// import { Container } from './styles';

const RichText: React.FC = () => {
  // eslint-disable-next-line prefer-const
  let richText = useRef<RichEditor>();

  return (
    <>
      <ScrollView>
        <RichEditor
          ref={richText}
          initialContentHTML="Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>"
        />
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <RichToolbar
          getEditor={() => richText.current}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertImage,
          ]}
          style={{ bottom: 0 }}
        />
      </KeyboardAvoidingView>
    </>
  );
};

export default RichText;
