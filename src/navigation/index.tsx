import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button, Text} from 'tamagui';

import Details from '../screens/details';
import Overview from '../screens/overview';

export type RootStackParamList = {
  Overview: undefined;
  Details: {name: string};
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Overview">
        <Stack.Screen name="Cloud Sync POC" component={Overview} />
        <Stack.Screen
          name="Details"
          component={Details}
          options={({navigation}) => ({
            headerLeft: () => (
              <Button
                unstyled
                flexDirection="row"
                backgroundColor="transparent"
                pressStyle={{opacity: 0.5}}
                paddingLeft={20}
                onPress={navigation.goBack}>
                <Text color="#007AFF">Back</Text>
              </Button>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
