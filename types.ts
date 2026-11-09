// types.ts · os tipos usados no app inteiro

// os gêneros possíveis: um union type, então qualquer outro texto é erro de compilação
export type Genre = 'ROCK' | 'POP' | 'MPB' | 'JAZZ' | 'ELETRONICA' | 'HIP_HOP';

// uma música do catálogo (geradas em data/musics.ts)
export interface Music {
  id: string; // chave única, usada no keyExtractor da FlatList
  title: string;
  artist: string;
  genre: Genre;
  year: number;
  durationSec: number; // duração em segundos; formatDuration transforma em "m:ss"
}

// a conta criada no cadastro, guardada no AsyncStorage
export interface Account {
  username: string;
  password: string;
}

// o nome de cada tela do stack e o que ela recebe. undefined = não recebe nada
// é este tipo que faz navigate('Detail') sem a música dar erro de compilação
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  List: undefined;
  Detail: { music: Music }; // o Detalhe precisa receber a música que vai mostrar
};
