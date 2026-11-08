// KIT do Checkpoint 3 · os tipos da música. As rotas do stack (RootStackParamList) são suas: escreva-as abaixo
export type Genre = 'ROCK' | 'POP' | 'MPB' | 'JAZZ' | 'ELETRONICA' | 'HIP_HOP';

export interface Music {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  year: number;
  durationSec: number;
}

// a conta criada no cadastro, guardada no AsyncStorage
export interface Account {
  username: string;
  password: string;
}

// o nome de cada tela do stack e o que ela recebe. undefined = não recebe nada
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  List: undefined;
  Detail: { music: Music };
};
