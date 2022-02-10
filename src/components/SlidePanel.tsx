import React, { useEffect, useRef, useState } from 'react';
import { Button, Text, View } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
    height: 200,
    marginTop: '150%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 30,
  },
};
interface Props {
  panelStatus: boolean;
  Content: () => JSX.Element;
}
const SlidePanel: React.FC<Props> = ({ panelStatus, Content }) => {
  const panel = useRef<SlidingUpPanel>();
  useEffect(() => {
    panel.current?.show();
  }, [panelStatus]);
  return (
    <SlidingUpPanel ref={panel} containerStyle={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          // alignItems: 'center',
          // justifyContent: 'center',
          height: 200,
          marginTop: '150%',
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          padding: 30,
        }}
      >
        <Content />
      </View>
    </SlidingUpPanel>
  );
};

export default SlidePanel;
