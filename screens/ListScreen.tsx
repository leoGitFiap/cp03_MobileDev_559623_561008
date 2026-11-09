// ListScreen · as 100 mil músicas do catálogo numa FlatList
import { type JSX } from 'react';
import { View, Text, FlatList, ListRenderItemInfo, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Music, RootStackParamList } from '../types';
import { MUSICS, formatDuration } from '../data/musics';

// Por que FlatList e não ScrollView: o ScrollView com map monta TODAS as 100 mil linhas
// de uma vez e a tela trava. A FlatList recebe o array (data) e uma receita (renderItem)
// e monta só as linhas perto da tela, criando as outras conforme a rolagem
const ListScreen = (): JSX.Element => {
  // useNavigation pega a navegação sem receber props. Tipado com NavigationProp,
  // conhece navigate e goBack (o suficiente aqui)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const open = (music: Music): void => {
    // TRANSIÇÃO 5 · Lista → Detalhe: navigate abre o Detalhe por cima da Lista,
    // levando a música como parâmetro. O voltar volta para a Lista no mesmo ponto da rolagem
    navigation.navigate('Detail', { music });
  };

  // a receita de uma linha. A FlatList chama só para os itens perto da tela.
  // ListRenderItemInfo<Music> diz que o item recebido é uma Music
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
        data={MUSICS} // o array com as 100 mil músicas
        keyExtractor={(music: Music) => music.id} // chave estável de cada item: o id, nunca a posição
        renderItem={renderMusic} // a receita de cada linha
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default ListScreen;

// estilos da tela
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212', paddingTop: 16, paddingHorizontal: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  counter: { color: '#B3B3B3', fontSize: 13, marginTop: 4, marginBottom: 6 },
  list: { paddingBottom: 24 }, // espaço no fim da lista, para a última linha não colar na borda
  row: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#3E3E3E', borderRadius: 10, padding: 12, marginTop: 8 }, // o cartão de cada música
  name: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  detail: { color: '#B3B3B3', fontSize: 12, marginTop: 4 },
});
