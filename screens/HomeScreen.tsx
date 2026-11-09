// HomeScreen · tela inicial depois do login: mostra quem entrou, abre a Lista e tem o painel do usuário
import { type JSX, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Modal, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Account, RootStackParamList } from '../types';
import { clearSession, deleteAccount, getAccount, getSession, saveAccount } from '../storage';
import { MUSICS } from '../data/musics';

// tipa navigation e route para a rota 'Home'
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// mesmo tamanho mínimo de senha do cadastro, usado no "alterar senha"
const MIN_PASSWORD: number = 6;

const HomeScreen = ({ navigation }: Props): JSX.Element => {
  const [username, setUsername] = useState<string>(''); // quem está logado, lido da sessão
  const [panelOpen, setPanelOpen] = useState<boolean>(false); // o painel lateral está aberto?
  // estado do formulário "alterar senha" do painel
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordOk, setPasswordOk] = useState<boolean>(false); // true = mensagem verde (sucesso)

  // lê quem está logado uma vez, depois do primeiro desenho ([] = roda uma vez só).
  // A função do useEffect não pode ser async, então criamos uma async dentro e chamamos
  useEffect(() => {
    const load = async (): Promise<void> => {
      const saved: string | null = await getSession();
      setUsername(saved ?? ''); // ?? : se vier null, usa ''
    };
    load();
  }, []);

  // a primeira letra do nome, mostrada no avatar
  const initial: string = username.charAt(0).toUpperCase();

  // fecha o painel e limpa o formulário de senha, para não sobrar texto na próxima abertura
  const closePanel = (): void => {
    setPanelOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setPasswordMessage('');
  };

  // TRANSIÇÃO 4 · Home → Lista: navigate abre a Lista por cima da Home,
  // que continua viva embaixo; o voltar mostra a Home como estava
  const openList = (): void => {
    navigation.navigate('List');
  };

  // ALTERAR SENHA: confere a senha atual contra a conta guardada e grava a nova
  const changePassword = async (): Promise<void> => {
    setPasswordOk(false);
    // campos vazios não passam
    if (currentPassword === '' || newPassword === '') {
      setPasswordMessage('Preencha a senha atual e a nova');
      return;
    }
    // a senha nova segue a mesma regra de tamanho do cadastro
    if (newPassword.length < MIN_PASSWORD) {
      setPasswordMessage(`A nova senha precisa ter pelo menos ${MIN_PASSWORD} caracteres`);
      return;
    }
    // só troca se a senha atual digitada for a da conta guardada
    const account: Account | null = await getAccount();
    if (account === null || account.password !== currentPassword) {
      setPasswordMessage('Senha atual incorreta');
      return;
    }
    // regrava a conta com o mesmo usuário e a senha nova
    await saveAccount({ username: account.username, password: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setPasswordOk(true);
    setPasswordMessage('Senha alterada');
  };

  // EXCLUIR CONTA: pede confirmação; se confirmar, apaga conta e sessão e volta ao login.
  // Usa o mesmo replace do SAIR, então o voltar também não traz a Home de volta
  const confirmDelete = (): void => {
    Alert.alert('Excluir conta', 'A conta será apagada deste celular. Continuar?', [
      { text: 'Cancelar', style: 'cancel' }, // sem onPress: só fecha o aviso
      {
        text: 'Excluir',
        style: 'destructive', // no iOS o botão aparece em vermelho
        onPress: async (): Promise<void> => {
          await deleteAccount();
          closePanel();
          navigation.replace('Login');
        },
      },
    ]);
  };

  // TRANSIÇÃO 9 · Home → SAIR: primeiro apaga a sessão do AsyncStorage;
  // depois replace troca a Home pelo Login (stack: Login). Como a Home não está mais
  // no stack, o voltar não consegue trazê-la de volta
  const logout = async (): Promise<void> => {
    await clearSession();
    closePanel();
    navigation.replace('Login');
  };

  return (
    <View style={styles.screen}>
      {/* barra do topo: avatar com a inicial (abre o painel) e a saudação com o nome */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.avatar} onPress={() => setPanelOpen(true)}>
          <Text style={styles.avatarText}>{initial}</Text>
        </TouchableOpacity>
        <Text style={styles.greeting}>Olá, {username}</Text>
      </View>

      <Text style={styles.section}>Seu catálogo</Text>

      {/* o "álbum": é o botão VER MÚSICAS. Tocar abre a Lista */}
      <TouchableOpacity style={styles.album} onPress={openList} accessibilityLabel="Ver músicas">
        <View style={styles.albumArt}>
          {/* o vinil vem primeiro no código para ficar ATRÁS da capa (o último desenhado fica por cima) */}
          <View style={styles.vinyl}>
            <View style={styles.vinylLabel} />
          </View>
          <View style={styles.cover}>
            <Text style={styles.coverBig}>100 MIL</Text>
            <Text style={styles.coverSmall}>MÚSICAS</Text>
          </View>
        </View>
        <Text style={styles.albumTitle}>Ver músicas</Text>
        <Text style={styles.albumSub}>Playlist · {MUSICS.length} músicas</Text>
      </TouchableOpacity>

      {/* painel lateral: perfil, alterar senha, excluir conta e SAIR.
          É um Modal (componente nativo) e não um drawer, porque o stack é o único navigator.
          transparent deixa ver a Home atrás; onRequestClose fecha pelo voltar do Android */}
      <Modal visible={panelOpen} transparent animationType="fade" onRequestClose={closePanel}>
        {/* fundo escurecido, dividido em linha: o painel à esquerda e a área de fora à direita */}
        <View style={styles.backdrop}>
          <View style={styles.panel}>
            {/* perfil: avatar grande e nome */}
            <View style={styles.profile}>
              {/* style aceita lista: o segundo estilo sobrescreve o tamanho do primeiro */}
              <View style={[styles.avatar, styles.avatarBig]}>
                <Text style={[styles.avatarText, styles.avatarBigText]}>{initial}</Text>
              </View>
              <Text style={styles.profileName}>{username}</Text>
              <Text style={styles.profileLabel}>Perfil</Text>
            </View>

            <View style={styles.divider} />

            {/* alterar senha */}
            <Text style={styles.panelTitle}>Alterar senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha atual"
              placeholderTextColor="#727272"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder={`Nova senha (mínimo ${MIN_PASSWORD})`}
              placeholderTextColor="#727272"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            {/* mensagem só quando existe: verde no sucesso, vermelha no erro */}
            {passwordMessage !== '' && (
              <Text style={passwordOk ? styles.success : styles.error}>{passwordMessage}</Text>
            )}
            <TouchableOpacity style={styles.smallButton} onPress={changePassword}>
              <Text style={styles.buttonText}>SALVAR SENHA</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* ações da conta */}
            <TouchableOpacity style={styles.panelItem} onPress={confirmDelete}>
              <Text style={styles.danger}>Excluir conta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outline} onPress={logout}>
              <Text style={styles.outlineText}>SAIR</Text>
            </TouchableOpacity>
          </View>
          {/* tocar fora do painel fecha */}
          <Pressable style={styles.outside} onPress={closePanel} />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  // tela sem header: o paddingTop deixa espaço para a barra de status do celular
  screen: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center' }, // avatar e saudação lado a lado
  // círculo: borderRadius igual à metade da largura e da altura
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
  greeting: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginLeft: 12 },
  section: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginTop: 32, marginBottom: 12 },

  // o álbum
  album: { alignSelf: 'flex-start' }, // o botão ocupa só a largura do álbum, não a linha inteira
  albumArt: { width: 220, height: 160 }, // área da capa + o pedaço do vinil que sai pela direita
  // o vinil: círculo preto posicionado de forma absoluta, deslocado para a direita da capa
  vinyl: { position: 'absolute', left: 65, top: 5, width: 150, height: 150, borderRadius: 75, backgroundColor: '#000000', borderWidth: 6, borderColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' },
  vinylLabel: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1DB954', borderWidth: 6, borderColor: '#121212' }, // o selo do meio do disco
  cover: { width: 160, height: 160, borderRadius: 6, backgroundColor: '#1DB954', padding: 12, justifyContent: 'flex-end' }, // capa quadrada, texto no rodapé
  coverBig: { color: '#000000', fontSize: 32, fontWeight: 'bold' },
  coverSmall: { color: '#000000', fontSize: 14, fontWeight: 'bold', letterSpacing: 3 },
  albumTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  albumSub: { color: '#B3B3B3', fontSize: 13, marginTop: 2 },

  // o painel lateral
  backdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.6)' }, // preto 60% transparente
  panel: { width: '80%', backgroundColor: '#181818', paddingTop: 60, paddingHorizontal: 20 },
  outside: { flex: 1 }, // ocupa os 20% que sobram à direita do painel
  profile: { alignItems: 'center' },
  avatarBig: { width: 72, height: 72, borderRadius: 36 },
  avatarBigText: { fontSize: 32 },
  profileName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  profileLabel: { color: '#B3B3B3', fontSize: 13, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#282828', marginVertical: 20 }, // linha separadora
  panelTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  input: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#3E3E3E', borderRadius: 10, padding: 12, color: '#FFFFFF', marginTop: 8 },
  error: { color: '#F15E6C', fontSize: 13, marginTop: 8 },
  success: { color: '#1DB954', fontSize: 13, marginTop: 8 },
  smallButton: { backgroundColor: '#1DB954', borderRadius: 500, padding: 12, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#000000', fontWeight: 'bold' },
  panelItem: { paddingVertical: 8 },
  danger: { color: '#F15E6C', fontSize: 15, fontWeight: 'bold' },
  outline: { borderWidth: 1, borderColor: '#727272', borderRadius: 500, padding: 12, alignItems: 'center', marginTop: 12 }, // botão só com contorno
  outlineText: { color: '#FFFFFF', fontWeight: 'bold' },
});
