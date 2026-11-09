// RegisterScreen · cadastro: valida o formulário, guarda a conta no celular e leva à Home
import { type JSX, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { saveAccount, saveSession } from '../storage';

// tipa navigation e route para a rota 'Register'
type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

// tamanho mínimo da senha; aparece no placeholder e na mensagem de erro
const MIN_PASSWORD: number = 6;

const RegisterScreen = ({ navigation }: Props): JSX.Element => {
  // estado do formulário
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [error, setError] = useState<string>(''); // '' = sem erro na tela

  // devolve a mensagem de erro, ou '' se o formulário está certo.
  // As regras são conferidas nesta ordem e para na primeira que falhar
  const validate = (): string => {
    // 1. campo vazio não passa (trim: usuário só com espaços conta como vazio)
    if (username.trim() === '' || password === '' || confirm === '') {
      return 'Preencha usuário, senha e confirmação';
    }
    // 2. senha mínima, dizendo qual é o tamanho
    if (password.length < MIN_PASSWORD) {
      return `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres`;
    }
    // 3. confirmação igual à senha
    if (password !== confirm) {
      return 'A confirmação não bate com a senha';
    }
    return '';
  };

  // TRANSIÇÃO 2 · Cadastro → Home, no OK do Alert. Duas ações em sequência:
  // popToTop tira o Cadastro e deixa só o Login; replace troca o Login pela Home.
  // O stack fica só com a Home: o voltar não traz nem o cadastro nem o login
  const goHome = (): void => {
    navigation.popToTop();
    navigation.replace('Home');
  };

  // CADASTRAR
  const register = async (): Promise<void> => {
    const message: string = validate();
    setError(message); // mostra o erro, ou limpa um erro antigo
    if (message !== '') {
      return; // formulário com erro: não guarda nada
    }
    const name: string = username.trim();
    // no sucesso, três coisas nesta ordem:
    // 1. guarda a conta (e a sessão, para a Home saber quem entrou)
    await saveAccount({ username: name, password });
    await saveSession(name);
    // 2. avisa com um Alert; 3. o onPress do botão OK leva à Home
    Alert.alert('Conta criada', `Bem-vindo, ${name}!`, [{ text: 'OK', onPress: goHome }]);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>CRIAR CONTA</Text>
      {/* campos controlados: value mostra o estado e onChangeText atualiza */}
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#727272"
        autoCapitalize="none" // não coloca a primeira letra em maiúscula sozinho
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder={`Senha (mínimo ${MIN_PASSWORD})`}
        placeholderTextColor="#727272"
        secureTextEntry // esconde a senha
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
      {/* o erro aparece na tela, embaixo do formulário, só quando existe */}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>CADASTRAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

// estilos da tela (mesma paleta do Login)
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', paddingHorizontal: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#3E3E3E', borderRadius: 10, padding: 12, color: '#FFFFFF', marginTop: 8 },
  error: { color: '#F15E6C', fontSize: 13, marginTop: 8 },
  button: { backgroundColor: '#1DB954', borderRadius: 500, padding: 14, alignItems: 'center', marginTop: 16 }, // botão verde em formato de pílula
  buttonText: { color: '#000000', fontWeight: 'bold' },
});
