import { type JSX, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Modal, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Account, RootStackParamList } from '../types';
import { clearSession, deleteAccount, getAccount, getSession, saveAccount } from '../storage';
import { MUSICS } from '../data/musics';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MIN_PASSWORD: number = 6;

const HomeScreen = ({ navigation }: Props): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordOk, setPasswordOk] = useState<boolean>(false);

  // lê quem está logado uma vez, depois do primeiro desenho
  useEffect(() => {
    const load = async (): Promise<void> => {
      const saved: string | null = await getSession();
      setUsername(saved ?? '');
    };
    load();
  }, []);

  const initial: string = username.charAt(0).toUpperCase();

  const closePanel = (): void => {
    setPanelOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setPasswordMessage('');
  };

  // TRANSIÇÃO 4 · Home → Lista
  const openList = (): void => {
    navigation.navigate('List');
  };

  // confere a senha atual contra a conta guardada e grava a nova
  const changePassword = async (): Promise<void> => {
    setPasswordOk(false);
    if (currentPassword === '' || newPassword === '') {
      setPasswordMessage('Preencha a senha atual e a nova');
      return;
    }
    if (newPassword.length < MIN_PASSWORD) {
      setPasswordMessage(`A nova senha precisa ter pelo menos ${MIN_PASSWORD} caracteres`);
      return;
    }
    const account: Account | null = await getAccount();
    if (account === null || account.password !== currentPassword) {
      setPasswordMessage('Senha atual incorreta');
      return;
    }
    await saveAccount({ username: account.username, password: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setPasswordOk(true);
    setPasswordMessage('Senha alterada');
  };

  // excluir conta: apaga conta e sessão e volta ao login, como o SAIR
  const confirmDelete = (): void => {
    Alert.alert('Excluir conta', 'A conta será apagada deste celular. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async (): Promise<void> => {
          await deleteAccount();
          closePanel();
          navigation.replace('Login');
        },
      },
    ]);
  };

  // TRANSIÇÃO 9 · Home → SAIR: apaga a sessão e volta ao login
  const logout = async (): Promise<void> => {
    await clearSession();
    closePanel();
    navigation.replace('Login');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.avatar} onPress={() => setPanelOpen(true)}>
          <Text style={styles.avatarText}>{initial}</Text>
        </TouchableOpacity>
        <Text style={styles.greeting}>Olá, {username}</Text>
      </View>

      <Text style={styles.section}>Seu catálogo</Text>

      {/* o "álbum": tocar abre a Lista */}
      <TouchableOpacity style={styles.album} onPress={openList} accessibilityLabel="Ver músicas">
        <View style={styles.albumArt}>
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

      {/* painel lateral: perfil, alterar senha, excluir conta e SAIR */}
      <Modal visible={panelOpen} transparent animationType="fade" onRequestClose={closePanel}>
        <View style={styles.backdrop}>
          <View style={styles.panel}>
            <View style={styles.profile}>
              <View style={[styles.avatar, styles.avatarBig]}>
                <Text style={[styles.avatarText, styles.avatarBigText]}>{initial}</Text>
              </View>
              <Text style={styles.profileName}>{username}</Text>
              <Text style={styles.profileLabel}>Perfil</Text>
            </View>

            <View style={styles.divider} />

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
            {passwordMessage !== '' && (
              <Text style={passwordOk ? styles.success : styles.error}>{passwordMessage}</Text>
            )}
            <TouchableOpacity style={styles.smallButton} onPress={changePassword}>
              <Text style={styles.buttonText}>SALVAR SENHA</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

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
  screen: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
  greeting: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginLeft: 12 },
  section: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginTop: 32, marginBottom: 12 },

  album: { alignSelf: 'flex-start' },
  albumArt: { width: 220, height: 160 },
  vinyl: { position: 'absolute', left: 65, top: 5, width: 150, height: 150, borderRadius: 75, backgroundColor: '#000000', borderWidth: 6, borderColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' },
  vinylLabel: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1DB954', borderWidth: 6, borderColor: '#121212' },
  cover: { width: 160, height: 160, borderRadius: 6, backgroundColor: '#1DB954', padding: 12, justifyContent: 'flex-end' },
  coverBig: { color: '#000000', fontSize: 32, fontWeight: 'bold' },
  coverSmall: { color: '#000000', fontSize: 14, fontWeight: 'bold', letterSpacing: 3 },
  albumTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  albumSub: { color: '#B3B3B3', fontSize: 13, marginTop: 2 },

  backdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  panel: { width: '80%', backgroundColor: '#181818', paddingTop: 60, paddingHorizontal: 20 },
  outside: { flex: 1 },
  profile: { alignItems: 'center' },
  avatarBig: { width: 72, height: 72, borderRadius: 36 },
  avatarBigText: { fontSize: 32 },
  profileName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  profileLabel: { color: '#B3B3B3', fontSize: 13, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#282828', marginVertical: 20 },
  panelTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  input: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#3E3E3E', borderRadius: 10, padding: 12, color: '#FFFFFF', marginTop: 8 },
  error: { color: '#F15E6C', fontSize: 13, marginTop: 8 },
  success: { color: '#1DB954', fontSize: 13, marginTop: 8 },
  smallButton: { backgroundColor: '#1DB954', borderRadius: 500, padding: 12, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#000000', fontWeight: 'bold' },
  panelItem: { paddingVertical: 8 },
  danger: { color: '#F15E6C', fontSize: 15, fontWeight: 'bold' },
  outline: { borderWidth: 1, borderColor: '#727272', borderRadius: 500, padding: 12, alignItems: 'center', marginTop: 12 },
  outlineText: { color: '#FFFFFF', fontWeight: 'bold' },
});
