import { type JSX } from 'react';
import { View, Text, FlatList, ListRenderItemInfo, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Music, RootStackParamList } from '../types';
import { MUSICS, formatDuration } from '../data/musics';

// a tela Lista: a FlatList monta só as músicas perto da tela, então as 100 mil abrem na hora
const ListScreen = (): JSX.Element => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const open = (music: Music): void => {
    // TRANSIÇÃO 5 · Lista → Detalhe, levando a música junto
    navigation.navigate('Detail', { music });
  };

  // a receita de uma linha: a FlatList chama só para os itens perto da tela
  const renderMusic = ({ item }: ListRenderItemInfo<Music>): JSX.Element => (
    <TouchableOpacity style={styles.row} onPress={() => open(item)}>
      <Text style={styles.name}>{item.title}</Text>
      <Text style={styles.detail}>{item.artist} · {item.genre} · {formatDuration(item.durationSec)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>MÚSICAS</Text>
      <Text style={styles.counter}>{MUSICS.length} músicas</Text>
      <FlatList
        data={MUSICS}
        keyExtractor={(music: Music) => music.id}
        renderItem={renderMusic}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212', paddingTop: 16, paddingHorizontal: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  counter: { color: '#B3B3B3', fontSize: 13, marginTop: 4, marginBottom: 6 },
  list: { paddingBottom: 24 },
  row: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#3E3E3E', borderRadius: 10, padding: 12, marginTop: 8 },
  name: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  detail: { color: '#B3B3B3', fontSize: 12, marginTop: 4 },
});
