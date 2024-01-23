import 'react-native-gesture-handler';

import React, {useEffect} from 'react';
import {TamaguiProvider} from 'tamagui';

import RootStack from './src/navigation';
import config from './tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <RootStack />
    </TamaguiProvider>
  );
}
