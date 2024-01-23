import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {YStack, TextArea} from 'tamagui';

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

type OverviewScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Overview'
>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();

  return (
    <Container>
      <Main>
        <YStack>
          <Title>Add to Today</Title>
          <Subtitle>
            Save each entered data to database today with timestamps.
          </Subtitle>
          <TextInputArea />
        </YStack>
        <Button
          onPress={() => navigation.navigate('Details', {date: '23/01/2024'})}>
          <ButtonText>Save</ButtonText>
        </Button>
      </Main>
    </Container>
  );
}
