import { type JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Genre, Music, RootStackParamList } from '../types';
import { nextMusic, formatDuration } from '../data/musics';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

// uma cor de capa para cada gênero
const COVER_COLORS: Record<Genre, string> = {
  ROCK: '#E13300',
  POP: '#8D67AB',
  MPB: '#1E3264',
  JAZZ: '#BA5D07',
  ELETRONICA: '#0D73EC',
  HIP_HOP: '#148A08',
};

// ícones desenhados com View (triângulos feitos com bordas), sem biblioteca
const PlayIcon = (): JSX.Element => <View style={icons.play} />;

const PreviousIcon = (): JSX.Element => (
  <View style={icons.row}>
    <View style={icons.bar} />
    <View style={icons.left} />
  </View>
);

const NextIcon = (): JSX.Element => (
  <View style={icons.row}>
    <View style={icons.right} />
    <View style={icons.bar} />
  </View>
);

const HomeIcon = (): JSX.Element => (
  <View style={icons.house}>
    <View style={icons.roof} />
    <View style={icons.body} />
  </View>
);

const DetailScreen = ({ route, navigation }: Props): JSX.Element => {
  const music: Music = route.params.music;

  // TRANSIÇÃO 6 · Detalhe → PRÓXIMA MÚSICA
  const goNext = (): void => {
    navigation.push('Detail', { music: nextMusic(music) });
  };

  // TRANSIÇÃO 7 · Detalhe → VOLTAR (o botão ANTERIOR do player)
  const goBack = (): void => {
    navigation.goBack();
  };

  // TRANSIÇÃO 8 · Detalhe → INÍCIO (o botão da casa)
  const goHome = (): void => {
    navigation.popToTop();
  };

  // o play ainda não toca nada
  const play = (): void => {};

  return (
    <View style={styles.screen}>
      <View style={[styles.cover, { backgroundColor: COVER_COLORS[music.genre] }]}>
        <Text style={styles.coverText}>{music.genre}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{music.title}</Text>
        <Text style={styles.artist}>{music.artist} · {music.year}</Text>
      </View>

      <View style={styles.progress}>
        <View style={styles.track} />
        <View style={styles.times}>
          <Text style={styles.time}>0:00</Text>
          <Text style={styles.time}>{formatDuration(music.durationSec)}</Text>
        </View>
      </View>

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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={goHome} accessibilityLabel="Início">
          <HomeIcon />
        </TouchableOpacity>
        <Text style={styles.stack}>telas no stack: {navigation.getState().routes.length}</Text>
      </View>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 28, paddingTop: 24, paddingBottom: 24 },
  cover: { width: '100%', maxWidth: 320, aspectRatio: 1, alignSelf: 'center', borderRadius: 8, padding: 16, justifyContent: 'flex-end' },
  coverText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  info: { alignItems: 'center', marginTop: 28 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  artist: { color: '#B3B3B3', fontSize: 15, marginTop: 6, textAlign: 'center' },
  progress: { marginTop: 24 },
  track: { height: 4, borderRadius: 2, backgroundColor: '#4D4D4D' },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  time: { color: '#B3B3B3', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  // o rótulo fica embaixo do ícone; o paddingTop compensa a altura dele para o ícone alinhar com o play
  skip: { alignItems: 'center', width: 72, paddingTop: 22, paddingBottom: 4 },
  skipLabel: { color: '#B3B3B3', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 8 },
  playButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginHorizontal: 24 },
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  homeButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#727272', alignItems: 'center', justifyContent: 'center' },
  stack: { color: '#727272', fontSize: 11, marginTop: 8 },
});

const icons = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  bar: { width: 3, height: 18, backgroundColor: '#FFFFFF' },
  // triângulo apontando para a direita, mais à direita do centro para parecer centralizado no círculo
  play: { width: 0, height: 0, marginLeft: 5, borderTopWidth: 12, borderBottomWidth: 12, borderLeftWidth: 20, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#000000' },
  right: { width: 0, height: 0, borderTopWidth: 10, borderBottomWidth: 10, borderLeftWidth: 16, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#FFFFFF' },
  left: { width: 0, height: 0, borderTopWidth: 10, borderBottomWidth: 10, borderRightWidth: 16, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#FFFFFF' },
  house: { alignItems: 'center' },
  roof: { width: 0, height: 0, borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FFFFFF' },
  body: { width: 14, height: 9, backgroundColor: '#FFFFFF' },
});
