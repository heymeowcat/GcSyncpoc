import {RouteProp, useRoute} from '@react-navigation/native';
import {Separator, Text, YGroup, YStack} from 'tamagui';

import {Container, ListItem, Main, Subtitle, Title} from '../../tamagui.config';
import {RootStackParamList} from '../navigation';
import {getData} from '../utils/database';
import {useEffect, useState} from 'react';

type DetailsSreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function Details() {
  const route = useRoute<DetailsSreenRouteProp>();
  const [data, setData] = useState<
    {id: number; content: string; timestamp: number}[]
  >([]);

  useEffect(() => {
    fetchData(route.params.date);
  }, [route.params.date]);

  const fetchData = async (selectedDate: string) => {
    try {
      const allData = await getData();
      const filteredData = allData.filter(item => {
        const itemDate = new Date(item.timestamp).toLocaleDateString('en-GB');
        return itemDate === selectedDate;
      });

      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Container>
      <Main>
        <YStack>
          <Title>Saved Data</Title>
          <Subtitle>Showing added data for {route.params.date}.</Subtitle>
          <YGroup
            alignSelf="center"
            bordered
            size="$5"
            separator={<Separator />}>
            {data.map(item => (
              <YGroup.Item key={item.id}>
                <ListItem title={item.content} />
              </YGroup.Item>
            ))}
          </YGroup>
        </YStack>
      </Main>
    </Container>
  );
}
