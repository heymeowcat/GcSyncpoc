import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation';
import {useNavigation} from '@react-navigation/native';
import {Button, ButtonText, Container, Title} from '../../tamagui.config';
import {Input, Main, YStack} from 'tamagui';

type LoginScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProps>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Overview');
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Login Failed',
        'Please check your credentials and try again.',
      );
    }
  };

  return (
    <Container>
      <ScrollView>
        <Main>
          <YStack>
            <Title>Login</Title>
            <View style={{padding: 12}} />

            <Input
              size="$5"
              borderWidth={2}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={{padding: 8}} />
            <Input
              size="$5"
              borderWidth={2}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button onPress={handleLogin}>
              <ButtonText>Login</ButtonText>
            </Button>
          </YStack>
        </Main>
      </ScrollView>
    </Container>
  );
};

export default LoginScreen;
