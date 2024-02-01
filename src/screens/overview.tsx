import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {YStack, TextArea, View, TextAreaFrame} from 'tamagui';
import storage from '@react-native-firebase/storage';

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
import {getData, initDatabase, insertData} from '../utils/database';
import {useEffect, useState} from 'react';
import _BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';

type OverviewScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Overview'
>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  const [content, setContent] = useState('');

  useEffect(() => {
    initDatabase();
    checkAndUploadData();
    const intervalId = _BackgroundTimer.setInterval(() => {
      checkAndUploadData();
    }, 24 * 60 * 60 * 1000);
    return () => {
      _BackgroundTimer.clearInterval(intervalId);
    };
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

  const uploadData = async date => {
    try {
      const data = await getData(date);

      if (data.length > 0) {
        const jsonContent = JSON.stringify(data);
        const fileName = `${date}.json`;

        const storageRef = storage().ref(fileName);
        await storageRef.putString(jsonContent);

        console.log('File uploaded successfully:', fileName);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const checkAndUploadData = async () => {
    try {
      const lastSaveDate = await getData('lastSave');

      if (lastSaveDate.length === 0) {
        const currentDate = moment().format('DD-MM-YYYY');
        await insertData('lastSave', currentDate);
      } else {
        const lastSaveTime = moment(lastSaveDate[0].timestamp);
        const currentTime = moment();
        const timeDifference = currentTime.diff(lastSaveTime, 'milliseconds');

        if (timeDifference >= 24 * 60 * 60 * 1000) {
          const currentDate = moment().format('DD-MM-YYYY');
          await uploadData(currentDate);
          await insertData('lastSave', currentDate);
        }
      }
    } catch (error) {
      console.error('Error checking and uploading data:', error);
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
