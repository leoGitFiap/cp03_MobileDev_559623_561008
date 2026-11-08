import { type JSX, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { saveAccount, saveSession } from '../storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const MIN_PASSWORD: number = 6;

const RegisterScreen = ({ navigation }: Props): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [error, setError] = useState<string>('');

  // devolve a mensagem de erro, ou '' se o formulário está certo
  const validate = (): string => {
    if (username.trim() === '' || password === '' || confirm === '') {
      return 'Preencha usuário, senha e confirmação';
    }
    if (password.length < MIN_PASSWORD) {
      return `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres`;
    }
    if (password !== confirm) {
      return 'A confirmação não bate com a senha';
    }
    return '';
  };

  // TRANSIÇÃO 2 · Cadastro → Home, no OK do Alert
  const goHome = (): void => {
    navigation.popToTop();
    navigation.replace('Home');
  };

  const register = async (): Promise<void> => {
    const message: string = validate();
    setError(message);
    if (message !== '') {
      return;
    }
    const name: string = username.trim();
    // 1. guarda a conta (e a sessão, para a Home saber quem entrou)
    await saveAccount({ username: name, password });
    await saveSession(name);
    // 2. avisa; 3. o OK leva à Home
    Alert.alert('Conta criada', `Bem-vindo, ${name}!`, [{ text: 'OK', onPress: goHome }]);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>CRIAR CONTA</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#727272"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder={`Senha (mínimo ${MIN_PASSWORD})`}
        placeholderTextColor="#727272"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirme a senha"
        placeholderTextColor="#727272"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>CADASTRAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', paddingHorizontal: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#3E3E3E', borderRadius: 10, padding: 12, color: '#FFFFFF', marginTop: 8 },
  error: { color: '#F15E6C', fontSize: 13, marginTop: 8 },
  button: { backgroundColor: '#1DB954', borderRadius: 500, padding: 14, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#000000', fontWeight: 'bold' },
});
