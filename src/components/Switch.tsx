import React, { useState } from 'react';
import { Switch as NativeSwitch } from 'react-native-switch';

interface SwitchProps {
  active: boolean;
  setActive: (e: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ active, setActive }) => {
  return (
    <NativeSwitch
      value={active}
      onValueChange={setActive}
      activeText="On"
      inActiveText="Off"
      circleSize={24}
      barHeight={32}
      circleBorderWidth={0}
      backgroundActive="#0564FF"
      backgroundInactive=" rgba(9, 16, 28, 0.0797913)"
      circleActiveColor="#FFFFFF"
      circleInActiveColor="#FFFFFF"
      changeValueImmediately // if rendering inside circle, change state immediately or wait for animation to complete
      innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }} // style for inner animated circle for what you (may) be rendering inside the circle
      outerCircleStyle={{}} // style for outer animated circle
      renderActiveText={false}
      renderInActiveText={false}
      switchLeftPx={1.5} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
      switchRightPx={1.5} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
      switchWidthMultiplier={2.5} // multipled by the `circleSize` prop to calculate total width of the Switch
      switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
    />
  );
};

export default Switch;
