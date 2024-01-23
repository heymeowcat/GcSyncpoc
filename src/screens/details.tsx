import {RouteProp, useRoute} from '@react-navigation/native';
import {YStack} from 'tamagui';

import {Container, Main, Subtitle, Title} from '../../tamagui.config';
import {RootStackParamList} from '../navigation';

type DetailsSreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function Details() {
  const router = useRoute<DetailsSreenRouteProp>();

  return (
    <Container>
      <Main>
        <YStack>
          <Title>Saved Data</Title>
          <Subtitle>Showing added data for {router.params.date}.</Subtitle>
        </YStack>
      </Main>
    </Container>
  );
}
