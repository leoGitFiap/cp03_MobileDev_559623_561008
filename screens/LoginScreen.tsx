// LoginScreen · primeira tela do app: confere usuário e senha contra a conta guardada
import { type JSX, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Account, RootStackParamList } from '../types';
import { getAccount, saveSession } from '../storage';

// tipa navigation e route para a rota 'Login'. Pelas props chegam também replace, push e popToTop
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props): JSX.Element => {
  // estado do formulário: cada mudança redesenha a tela
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>(''); // '' = sem erro na tela

  // ENTRAR. Confere contra a conta guardada no AsyncStorage, nunca contra um valor fixo no código
  const enter = async (): Promise<void> => {
    const account: Account | null = await getAccount();
    // ninguém se cadastrou ainda: avisa e não entra
    if (account === null) {
      setError('Nenhuma conta cadastrada ainda');
      return;
    }
    // usuário ou senha diferentes da conta guardada: avisa e não entra
    // (trim tira espaços sobrando no usuário, do mesmo jeito que o cadastro faz)
    if (username.trim() !== account.username || password !== account.password) {
      setError('Usuário ou senha incorretos');
      return;
    }
    setError('');
    // guarda a sessão (quem está logado) para a Home mostrar o nome
    await saveSession(account.username);
    // TRANSIÇÃO 3 · Login → Home: replace troca o Login pela Home (stack: Home),
    // então o voltar não traz o login de volta
    navigation.replace('Home');
  };

  // TRANSIÇÃO 1 · Login → Cadastro: navigate abre o Cadastro por cima do Login,
  // que continua vivo embaixo; o voltar traz o Login de volta
  const goRegister = (): void => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>CATÁLOGO DE MÚSICAS</Text>
      <Text style={styles.subtitle}>entre para ouvir</Text>
      {/* campo controlado: value mostra o estado e onChangeText recebe o texto novo a cada tecla */}
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
        placeholder="Senha"
        placeholderTextColor="#727272"
        secureTextEntry // esconde a senha com bolinhas
        value={password}
        onChangeText={setPassword}
      />
      {/* a mensagem de erro só aparece quando existe */}
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

// estilos fora do componente, criados uma vez só. Paleta escura inspirada no Spotify
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', paddingHorizontal: 20 }, // conteúdo centralizado na vertical
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#B3B3B3', fontSize: 13, marginTop: 4, marginBottom: 16 },
  input: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#3E3E3E', borderRadius: 10, padding: 12, color: '#FFFFFF', marginTop: 8 },
  error: { color: '#F15E6C', fontSize: 13, marginTop: 8 },
  button: { backgroundColor: '#1DB954', borderRadius: 500, padding: 14, alignItems: 'center', marginTop: 16 }, // botão verde em formato de pílula
  buttonText: { color: '#000000', fontWeight: 'bold' },
  link: { color: '#B3B3B3', textAlign: 'center', textDecorationLine: 'underline', marginTop: 16 },
});
