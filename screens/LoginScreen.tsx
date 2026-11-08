import { type JSX, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Account, RootStackParamList } from '../types';
import { getAccount, saveSession } from '../storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // confere contra a conta guardada no AsyncStorage, nunca contra um valor fixo
  const enter = async (): Promise<void> => {
    const account: Account | null = await getAccount();
    if (account === null) {
      setError('Nenhuma conta cadastrada ainda');
      return;
    }
    if (username.trim() !== account.username || password !== account.password) {
      setError('Usuário ou senha incorretos');
      return;
    }
    setError('');
    await saveSession(account.username);
    // TRANSIÇÃO 3 · Login → Home
    navigation.replace('Home');
  };

  // TRANSIÇÃO 1 · Login → Cadastro
  const goRegister = (): void => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>CATÁLOGO DE MÚSICAS</Text>
      <Text style={styles.subtitle}>entre para ouvir</Text>
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
        placeholder="Senha"
        placeholderTextColor="#727272"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={enter}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goRegister}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', paddingHorizontal: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#B3B3B3', fontSize: 13, marginTop: 4, marginBottom: 16 },
  input: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#3E3E3E', borderRadius: 10, padding: 12, color: '#FFFFFF', marginTop: 8 },
  error: { color: '#F15E6C', fontSize: 13, marginTop: 8 },
  button: { backgroundColor: '#1DB954', borderRadius: 500, padding: 14, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#000000', fontWeight: 'bold' },
  link: { color: '#B3B3B3', textAlign: 'center', textDecorationLine: 'underline', marginTop: 16 },
});
