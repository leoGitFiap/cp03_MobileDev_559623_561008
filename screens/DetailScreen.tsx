// DetailScreen · o detalhe de uma música, com cara de player
import { type JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Genre, Music, RootStackParamList } from '../types';
import { nextMusic, formatDuration } from '../data/musics';

// tipa navigation e route para a rota 'Detail': route.params já vem como { music: Music }
type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

// uma cor de capa para cada gênero. Record<Genre, string> obriga a ter uma cor para todos os gêneros
const COVER_COLORS: Record<Genre, string> = {
  ROCK: '#E13300',
  POP: '#8D67AB',
  MPB: '#1E3264',
  JAZZ: '#BA5D07',
  ELETRONICA: '#0D73EC',
  HIP_HOP: '#148A08',
};

// Ícones desenhados com View, sem biblioteca de ícones.
// O triângulo é um truque de bordas: uma View de tamanho 0 com uma borda colorida
// e as duas vizinhas transparentes desenha um triângulo apontando para o lado colorido

// play: um triângulo apontando para a direita
const PlayIcon = (): JSX.Element => <View style={icons.play} />;

// voltar: uma barra seguida de um triângulo apontando para a esquerda  |◀
const PreviousIcon = (): JSX.Element => (
  <View style={icons.row}>
    <View style={icons.bar} />
    <View style={icons.left} />
  </View>
);

// próxima: um triângulo apontando para a direita seguido de uma barra  ▶|
const NextIcon = (): JSX.Element => (
  <View style={icons.row}>
    <View style={icons.right} />
    <View style={icons.bar} />
  </View>
);

// casa: um triângulo apontando para cima (o telhado) em cima de um retângulo (a parede)
const HomeIcon = (): JSX.Element => (
  <View style={icons.house}>
    <View style={icons.roof} />
    <View style={icons.body} />
  </View>
);

const DetailScreen = ({ route, navigation }: Props): JSX.Element => {
  // a música que a Lista (ou o PRÓXIMA) mandou como parâmetro
  const music: Music = route.params.music;

  // TRANSIÇÃO 6 · Detalhe → PRÓXIMA MÚSICA: push coloca MAIS UM Detalhe no stack,
  // mesmo sendo a mesma rota. Com navigate o Detalhe da frente só trocaria de música
  // e a anterior se perderia; com push o voltar traz a música anterior
  const goNext = (): void => {
    navigation.push('Detail', { music: nextMusic(music) });
  };

  // TRANSIÇÃO 7 · Detalhe → VOLTAR (o botão VOLTAR do player): goBack tira a tela de cima,
  // fica uma tela a menos. Faz o mesmo que a seta do header e o voltar do Android
  const goBack = (): void => {
    navigation.goBack();
  };

  // TRANSIÇÃO 8 · Detalhe → INÍCIO (o botão da casa): popToTop desmonta todas as telas
  // acima da primeira de uma vez. A primeira é a Home, porque Login e Cadastro saíram com replace
  const goHome = (): void => {
    navigation.popToTop();
  };

  // o play ainda não toca nada
  const play = (): void => {};

  return (
    <View style={styles.screen}>
      {/* capa: a cor vem do gênero. style em lista junta o estilo fixo com a cor da música */}
      <View style={[styles.cover, { backgroundColor: COVER_COLORS[music.genre] }]}>
        <Text style={styles.coverText}>{music.genre}</Text>
      </View>

      {/* descrição centralizada */}
      <View style={styles.info}>
        <Text style={styles.title}>{music.title}</Text>
        <Text style={styles.artist}>{music.artist} · {music.year}</Text>
      </View>

      {/* barra de progresso só visual: de 0:00 até a duração da música */}
      <View style={styles.progress}>
        <View style={styles.track} />
        <View style={styles.times}>
          <Text style={styles.time}>0:00</Text>
          <Text style={styles.time}>{formatDuration(music.durationSec)}</Text>
        </View>
      </View>

      {/* controles em linha: VOLTAR, play e PRÓXIMA */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.skip} onPress={goBack} accessibilityLabel="Voltar">
          <PreviousIcon />
          <Text style={styles.skipLabel}>VOLTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={play} accessibilityLabel="Tocar">
          <PlayIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skip} onPress={goNext} accessibilityLabel="Próxima música">
          <NextIcon />
          <Text style={styles.skipLabel}>PRÓXIMA</Text>
        </TouchableOpacity>
      </View>

      {/* rodapé: botão INÍCIO (casa) e o contador de telas no stack */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={goHome} accessibilityLabel="Início">
          <HomeIcon />
        </TouchableOpacity>
        {/* quantas telas estão no stack agora: ajuda a conferir cada transição */}
        <Text style={styles.stack}>telas no stack: {navigation.getState().routes.length}</Text>
      </View>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 28, paddingTop: 24, paddingBottom: 24 },
  // capa quadrada: largura da tela (até 320) e aspectRatio 1 faz a altura igual à largura
  cover: { width: '100%', maxWidth: 320, aspectRatio: 1, alignSelf: 'center', borderRadius: 8, padding: 16, justifyContent: 'flex-end' },
  coverText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  info: { alignItems: 'center', marginTop: 28 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  artist: { color: '#B3B3B3', fontSize: 15, marginTop: 6, textAlign: 'center' },
  progress: { marginTop: 24 },
  track: { height: 4, borderRadius: 2, backgroundColor: '#4D4D4D' }, // a linha da barra de progresso
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }, // 0:00 na esquerda, duração na direita
  time: { color: '#B3B3B3', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  // o rótulo fica embaixo do ícone; o paddingTop compensa a altura dele para o ícone alinhar com o play
  skip: { alignItems: 'center', width: 72, paddingTop: 22, paddingBottom: 4 },
  skipLabel: { color: '#B3B3B3', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 8 },
  playButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginHorizontal: 24 }, // círculo branco
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' }, // flex: 1 ocupa o espaço que sobra e empurra o conteúdo para o fundo
  homeButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#727272', alignItems: 'center', justifyContent: 'center' },
  stack: { color: '#727272', fontSize: 11, marginTop: 8 },
});

// estilos dos ícones. Nos triângulos, width e height são 0: só as bordas aparecem
const icons = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' }, // barra e triângulo lado a lado
  bar: { width: 3, height: 18, backgroundColor: '#FFFFFF' },
  // triângulo apontando para a direita, mais à direita do centro para parecer centralizado no círculo
  play: { width: 0, height: 0, marginLeft: 5, borderTopWidth: 12, borderBottomWidth: 12, borderLeftWidth: 20, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#000000' },
  // triângulo para a direita (borda esquerda colorida)
  right: { width: 0, height: 0, borderTopWidth: 10, borderBottomWidth: 10, borderLeftWidth: 16, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#FFFFFF' },
  // triângulo para a esquerda (borda direita colorida)
  left: { width: 0, height: 0, borderTopWidth: 10, borderBottomWidth: 10, borderRightWidth: 16, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#FFFFFF' },
  house: { alignItems: 'center' }, // telhado centralizado em cima da parede
  // telhado: triângulo para cima (borda de baixo colorida)
  roof: { width: 0, height: 0, borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FFFFFF' },
  body: { width: 14, height: 9, backgroundColor: '#FFFFFF' }, // a parede da casa
});
