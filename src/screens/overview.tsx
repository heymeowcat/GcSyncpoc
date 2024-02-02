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
import {
  getData,
  getDateSync,
  initDatabase,
  insertData,
  insertDateSync,
} from '../utils/database';
import {useEffect, useState} from 'react';
import _BackgroundTimer from 'react-native-background-timer';

type OverviewScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Overview'
>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  const [content, setContent] = useState('');
  useEffect(() => {
    const setupBackgroundSync = async () => {
      await initDatabase();
      const intervalId = _BackgroundTimer.setInterval(() => {
        checkAndUploadData();
      }, 24 * 60 * 60 * 1000);

      return () => {
        _BackgroundTimer.clearInterval(intervalId);
      };
    };
    setupBackgroundSync();
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
      console.log('data from db ---->' + JSON.stringify(date));

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
      const lastSaveDate = await getDateSync();

      if (lastSaveDate === null) {
        console.log('ddw');
        const currentDate = new Date().toString();
        await insertDateSync(currentDate);
      } else {
        const lastSaveTime = new Date(
          lastSaveDate.trim().replace(',', '').replace('\n', ''),
        );
        const currentTime = new Date(new Date().toString());
        const timeDifference = Math.abs(
          (currentTime.getTime() - lastSaveTime.getTime()) / (1000 * 60 * 60),
        );
        console.log('timedifference ->' + timeDifference);
        if (timeDifference >= 24) {
          uploadData(
            new Date().toLocaleDateString('en-GB').replaceAll('/', '-'),
          );
          await insertDateSync(new Date().toString());
        }
      }
    } catch (error) {
      console.error('Error checking and uploading data:', error);
    }
  };

  const handleViewTodayData = () => {
    const todayDate = new Date()
      .toLocaleDateString('en-GB')
      .replaceAll('/', '-');
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
          <Button
            onPress={() => {
              uploadData(
                new Date().toLocaleDateString('en-GB').replaceAll('/', '-'),
              );
            }}>
            <ButtonText>Force Upload</ButtonText>
          </Button>
          <Button onPress={handleViewTodayData}>
            <ButtonText>Today's Save Data</ButtonText>
          </Button>
        </Main>
      </ScrollView>
    </Container>
  );
}
