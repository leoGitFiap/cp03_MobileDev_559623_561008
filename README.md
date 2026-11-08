# Kit do Checkpoint 3 · Catálogo de músicas

Três arquivos para copiar para a raiz do seu projeto Expo, mantendo as pastas:

| Arquivo | O que é |
|---------|---------|
| `types.ts` | os tipos `Genre` e `Music`. O `RootStackParamList` é seu: escreva-o neste arquivo |
| `data/musics.ts` | o gerador das 100 mil músicas (`MUSICS`), `nextMusic` e `formatDuration` |
| `screens/ListScreen.tsx` | a tela Lista do jeito que **não** deve ficar: `ScrollView` + `map`. Converta para `FlatList` |

A `ListScreen` importa `RootStackParamList` de `../types` e espera uma rota `Detail` que recebe `{ music: Music }`. Sem isso o `npx tsc --noEmit` acusa erro: é o primeiro sinal de que o seu `types.ts` ainda está incompleto.
