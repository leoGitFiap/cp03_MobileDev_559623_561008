import { Genre, Music } from '../types';

// KIT do Checkpoint 3 · gerador de músicas. Não precisa editar: só importe MUSICS e nextMusic
const ADJECTIVES: string[] = [
  'Noite', 'Luz', 'Chuva', 'Vento', 'Mar', 'Fogo', 'Sombra', 'Sol', 'Lua', 'Névoa',
  'Estrada', 'Cidade', 'Rio', 'Asfalto', 'Deserto', 'Ponte', 'Janela', 'Relógio', 'Vinil', 'Neon',
];
const NOUNS: string[] = [
  'Azul', 'Vermelha', 'Perdida', 'Eterna', 'Vazia', 'Urgente', 'Distante', 'Leve', 'Quebrada', 'Lenta',
  'Elétrica', 'Antiga', 'Secreta', 'Sem Fim', 'de Papel', 'de Vidro', 'em Chamas', 'de Prata', 'do Norte', 'do Sul',
];
const ARTISTS: string[] = [
  'Os Satélites', 'Marina Vale', 'Clube do Eco', 'Davi Lumen', 'Banda Vértice', 'Nina Sol', 'Trio Horizonte',
  'Léo Baixo', 'As Marés', 'Coletivo 42', 'Helena Prisma', 'Rafa Groove', 'Orquestra Pixel', 'Duda Ferraz',
  'Projeto Aurora', 'Teo & Vinil', 'Luz Negra', 'Bruna Cordas', 'Quarteto Maré', 'Vox Urbana',
];
const GENRES: Genre[] = ['ROCK', 'POP', 'MPB', 'JAZZ', 'ELETRONICA', 'HIP_HOP'];

// gera a lista inteira de uma vez, sempre na mesma ordem (sem aleatoriedade)
const buildMusics = (total: number): Music[] => {
  const musics: Music[] = [];
  for (let i = 0; i < total; i += 1) {
    const adjective: string = ADJECTIVES[i % ADJECTIVES.length];
    const noun: string = NOUNS[Math.floor(i / ADJECTIVES.length) % NOUNS.length];
    const number: number = Math.floor(i / (ADJECTIVES.length * NOUNS.length)) + 1;
    musics.push({
      id: String(i + 1),
      title: `${adjective} ${noun} ${number}`,
      artist: ARTISTS[(i * 7) % ARTISTS.length],
      genre: GENRES[(i * 11) % GENRES.length],
      year: 1970 + ((i * 13) % 56),
      durationSec: 120 + ((i * 37) % 300),
    });
  }
  return musics;
};

// quantas músicas o catálogo tem. Com ScrollView + map, 100 mil nunca chegam a aparecer na tela;
// para VER a tela travar e depois aparecer, experimente 5000. A FlatList abre as 100 mil na hora
export const TOTAL_MUSICS: number = 100000;

// o catálogo inteiro
export const MUSICS: Music[] = buildMusics(TOTAL_MUSICS);

// a música seguinte no catálogo; depois da última, volta para a primeira
export const nextMusic = (current: Music): Music => {
  const index: number = MUSICS.findIndex((music: Music) => music.id === current.id);
  const next: number = (index + 1) % MUSICS.length;
  return MUSICS[next];
};

// duração em texto: 185 vira "3:05"
export const formatDuration = (seconds: number): string => {
  const minutes: number = Math.floor(seconds / 60);
  const rest: number = seconds % 60;
  const padded: string = rest < 10 ? `0${rest}` : String(rest);
  return `${minutes}:${padded}`;
};
