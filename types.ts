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
