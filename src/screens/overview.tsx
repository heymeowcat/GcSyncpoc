import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {YStack, TextArea, View, TextAreaFrame} from 'tamagui';

import {
  Container,
  Main,
  Title,
  Subtitle,
  Button,
  ButtonText,
  TextInputArea,
} from '../../tamagui.config';
import {RootStackParamList} from '../navigation';
import {Alert, ScrollView} from 'react-native';
import {initDatabase, insertData} from '../utils/database';
import {useEffect, useState} from 'react';

type OverviewScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Overview'
>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  const [content, setContent] = useState('');

  useEffect(() => {
    initDatabase();
  }, []);

  const handleSave = async () => {
    try {
      const timestamp = Date.now();
      await insertData(content, timestamp);
      setContent('');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  const handleViewTodayData = () => {
    const todayDate = new Date().toLocaleDateString('en-GB');
    navigation.navigate('Details', {date: todayDate});
  };

  return (
    <Container>
      <ScrollView>
        <Main>
          <YStack>
            <Title>Add to Today</Title>
            <Subtitle>
              Save each entered data to database today with timestamps.
            </Subtitle>
            <TextInputArea value={content} onChangeText={setContent} />
          </YStack>
          <Button onPress={handleSave}>
            <ButtonText>Save</ButtonText>
          </Button>
          <Button onPress={handleViewTodayData}>
            <ButtonText>Today's Save Data</ButtonText>
          </Button>
        </Main>
      </ScrollView>
    </Container>
  );
}
