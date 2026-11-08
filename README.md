# Catálogo de Músicas · Checkpoint 3

App mobile em **React Native + Expo + TypeScript** feito para o Checkpoint 3 da disciplina Mobile Development & IoT (FIAP). É um catálogo com **100 mil músicas**, com cadastro e login guardados no próprio celular, uma lista que abre na hora e uma tela de detalhe no estilo de um player.

O visual é inspirado no Spotify: fundo escuro, verde como cor de destaque e botões arredondados.

---

## Integrantes

| Nome | RM |
|------|----|
|   Leonardo Fernandes Mesquita   |  559623  |
|   Vitor de Lima Domingues   |  561008  |

> A identificação oficial do grupo fica no `package.json`, nos pares `author`/`rm`, `author2`/`rm2`, logo depois de `"name"`.

---

## Funcionalidades

- **Cadastro** com validação: campos obrigatórios, senha com no mínimo 6 caracteres e confirmação igual à senha. O erro aparece na tela, embaixo do formulário.
- **Conta guardada no celular** com `AsyncStorage`. Nenhum usuário ou senha está escrito no código.
- **Login** que confere usuário e senha contra a conta guardada. Sem conta cadastrada, ou com senha errada, o app avisa e não entra.
- **Sessão**: ao entrar, o app guarda quem está logado, e a Home mostra o nome.
- **Painel do usuário** na Home, aberto pelo avatar: perfil, alterar senha, excluir conta e SAIR.
- **Lista com 100 mil músicas** usando `FlatList`, que só monta as linhas perto da tela e por isso não trava.
- **Detalhe em forma de player**: capa colorida por gênero, título, artista, ano, duração, botões VOLTAR, play e PRÓXIMA, e um botão de início com ícone de casa.

---

## Estrutura das páginas

O app usa **um único navigator, do tipo stack** (`@react-navigation/native-stack`). As rotas e os parâmetros de cada uma estão tipados em `RootStackParamList`, no `types.ts`.

| Rota | Arquivo | Recebe | O que tem |
|------|---------|--------|-----------|
| `Login` | `screens/LoginScreen.tsx` | nada | Campos de usuário e senha, botão ENTRAR e o link "Não tem conta? Cadastre-se" |
| `Register` | `screens/RegisterScreen.tsx` | nada | Campos de usuário, senha e confirmação, botão CADASTRAR e mensagem de erro |
| `Home` | `screens/HomeScreen.tsx` | nada | Avatar com a inicial do usuário, saudação, álbum "Ver músicas" e o painel lateral do usuário |
| `List` | `screens/ListScreen.tsx` | nada | Contador de músicas e `FlatList` com as 100 mil músicas |
| `Detail` | `screens/DetailScreen.tsx` | `{ music: Music }` | Player: capa, título, artista, ano, duração, VOLTAR, play, PRÓXIMA, botão de início e contador "telas no stack" |

### Login
- Lê a conta do `AsyncStorage` e compara com o que foi digitado.
- Mostra "Nenhuma conta cadastrada ainda" ou "Usuário ou senha incorretos" quando não deixa entrar.
- Ao entrar, guarda a sessão e vai para a Home.

### Cadastro
- Valida, nesta ordem: campos vazios, tamanho mínimo da senha (6) e confirmação.
- No sucesso: guarda a conta (e a sessão), mostra o `Alert` "Conta criada", e o OK leva para a Home.

### Home
- Na barra do topo ficam o avatar (círculo verde com a inicial) e "Olá, nome".
- O **álbum "Ver músicas"** é o botão que abre a Lista. Ele tem uma capa verde "100 MIL MÚSICAS" com um disco de vinil saindo por trás.
- Tocar no avatar abre o **painel lateral**, feito com `Modal`. Tocar fora do painel fecha.
  - **Perfil:** avatar grande e nome do usuário.
  - **Alterar senha:** confere a senha atual e grava a nova, com mínimo de 6 caracteres.
  - **Excluir conta:** pede confirmação, apaga a conta e a sessão e volta ao Login.
  - **SAIR:** apaga a sessão e volta ao Login.

### Lista
- `FlatList` com `data={MUSICS}`, `keyExtractor` pelo `id` da música e `renderItem` tipado com `ListRenderItemInfo<Music>`.
- Cada linha mostra título, artista, gênero e duração. Tocar abre o Detalhe daquela música.

### Detalhe
- A capa muda de cor conforme o gênero da música.
- O título, o artista e o ano ficam centralizados.
- A barra de progresso é só visual e mostra a duração.
- **VOLTAR** volta uma tela. **PRÓXIMA** abre a música seguinte do catálogo. **Play** ainda não faz nada.
- O botão com ícone de **casa**, no rodapé, volta direto para a Home.
- Os ícones são desenhados com `View`, sem biblioteca.

---

## Navegação

| # | Transição | Ação | Stack depois |
|---|-----------|------|--------------|
| 1 | Login → Cadastro | `navigate('Register')` | Login, Cadastro |
| 2 | Cadastro → Home (OK do Alert) | `popToTop()` + `replace('Home')` | Home |
| 3 | Login → Home | `replace('Home')` | Home |
| 4 | Home → Lista | `navigate('List')` | Home, Lista |
| 5 | Lista → Detalhe | `navigate('Detail', { music })` | Home, Lista, Detalhe |
| 6 | Detalhe → PRÓXIMA | `push('Detail', { music: nextMusic(music) })` | … Detalhe, Detalhe |
| 7 | Detalhe → VOLTAR | `goBack()` | uma tela a menos |
| 8 | Detalhe → INÍCIO | `popToTop()` | Home |
| 9 | Home → SAIR | `clearSession()` + `replace('Login')` | Login |

A explicação de cada escolha, com o efeito no stack e no botão voltar, está no [`RESPOSTAS.md`](RESPOSTAS.md).

---

## Estrutura de pastas

```
.
├── App.tsx              # NavigationContainer + stack com as 5 rotas e o tema escuro do header
├── index.ts             # ponto de entrada do Expo
├── types.ts             # Genre, Music, Account e RootStackParamList
├── storage.ts           # funções do AsyncStorage: conta e sessão
├── data/
│   └── musics.ts        # gerador das 100 mil músicas (MUSICS), nextMusic e formatDuration
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ListScreen.tsx
│   └── DetailScreen.tsx
├── assets/              # ícone e splash do Expo
├── app.json             # configuração do Expo
├── RESPOSTAS.md         # as 9 transições explicadas
└── package.json
```

### Armazenamento (`storage.ts`)

O `AsyncStorage` guarda só texto, então a conta é salva como JSON.

| Chave | Conteúdo | Função que grava | Função que apaga |
|-------|----------|------------------|------------------|
| `account` | `{ "username": "...", "password": "..." }` | `saveAccount` | `deleteAccount` |
| `session` | nome de quem está logado | `saveSession` | `clearSession` / `deleteAccount` |

> O `AsyncStorage` não tem criptografia. Serve para este exercício; senha de verdade iria para o `SecureStore`.

---

## Tecnologias

| Pacote | Para quê |
|--------|----------|
| `expo` (SDK 58) | Base do projeto e do Expo Go |
| `react-native` 0.88 / `react` 19 | Componentes nativos |
| `typescript` | Tipagem das telas, rotas e dados |
| `@react-navigation/native` | Container de navegação |
| `@react-navigation/native-stack` | O stack, único navigator do app |
| `react-native-screens` e `react-native-safe-area-context` | Dependências do stack |
| `@react-native-async-storage/async-storage` | Conta e sessão no celular |

Nenhuma biblioteca de componentes visuais: só `View`, `Text`, `TextInput`, `TouchableOpacity`, `Pressable`, `FlatList`, `Modal`, `Alert` e `StyleSheet`.

---

## Como rodar

### O que instalar antes
- **Node.js** 22.13 ou mais recente (recomendado: a LTS atual), que já vem com o `npm`
- **App Expo Go** no celular (Android ou iOS), na versão compatível com o SDK 58
- Celular e computador **na mesma rede Wi-Fi**

### Passo a passo

1. Clone o repositório (ou descompacte o zip) e entre na pasta do projeto, onde está o `package.json`:
   ```bash
   cd <pasta-do-projeto>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```
4. Abra o app:
    - **Android:** abra o Expo Go e leia o QR code que aparece no terminal.
    - **iOS:** leia o QR code com a câmera do iPhone.
    - **Emulador Android:** com o emulador aberto, aperte `a` no terminal.
5. Possível erro no **Expo Go**:
    - Dependendo da versão do app do **Expo Go** é exigido o cadastro na plataforma.
    - Nesse caso faça o cadastro e o login, tanto no app quanto no terminal, ao rodar:
    ```bash
    npx expo login --no-browser
    ```
    - Recomenda-se o comando acima para evitar erros de redirecionamento.
    - Para outros métodos digite:
    ```bash
    npx expo login --help
    ```

### Primeiro uso
1. Na tela de Login, toque em **"Não tem conta? Cadastre-se"**.
2. Crie uma conta. A senha precisa ter pelo menos 6 caracteres.
3. Toque em OK no aviso para ir à Home e depois no álbum **"Ver músicas"**.

> A conta fica salva no celular. Para começar do zero, use **Excluir conta** no painel do usuário ou limpe os dados do Expo Go.

### Conferir o código
```bash
npx tsc --noEmit
```
Verifica os tipos de todo o projeto. Não deve mostrar nenhum erro.

### Observações
- Para adicionar pacotes, use sempre `npx expo install <pacote>`, nunca `npm install <pacote>`: o Expo escolhe a versão compatível com o Expo Go.
- O app roda no **Expo Go**, sem development build.
- A entrega vai **sem** a pasta `node_modules`.
