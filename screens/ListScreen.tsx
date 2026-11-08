import { type JSX } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Music, RootStackParamList } from '../types';
import { MUSICS, formatDuration } from '../data/musics';

// KIT do Checkpoint 3 · a tela Lista, do jeito que NÃO deve ficar: um ScrollView com um map
// desenha as músicas todas de uma vez. Com 100 mil a tela nunca chega; com TOTAL_MUSICS = 5000
// ela trava uns segundos e aparece. A sua tarefa: converter para FlatList e voltar a 100 mil
const ListScreen = (): JSX.Element => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const open = (music: Music): void => {
    // TRANSIÇÃO Lista → Detalhe: a sua escolha, levando a música junto
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>MÚSICAS</Text>
      <Text style={styles.counter}>{MUSICS.length} músicas</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {MUSICS.map((music: Music) => (
          <TouchableOpacity key={music.id} style={styles.row} onPress={() => open(music)}>
            <Text style={styles.name}>{music.title}</Text>
            <Text style={styles.detail}>{music.artist} · {music.genre} · {formatDuration(music.durationSec)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0E0E10', paddingTop: 16, paddingHorizontal: 20 },
  title: { color: '#ED145B', fontSize: 24, fontWeight: 'bold' },
  counter: { color: '#9A9AA3', fontSize: 13, marginTop: 4, marginBottom: 6 },
  list: { paddingBottom: 24 },
  row: { backgroundColor: '#17171B', borderWidth: 1, borderColor: '#2A2A31', borderRadius: 10, padding: 12, marginTop: 8 },
  name: { color: '#EDEDEF', fontSize: 16, fontWeight: 'bold' },
  detail: { color: '#9A9AA3', fontSize: 12, marginTop: 4 },
});
