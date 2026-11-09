// storage.ts · todo o acesso ao AsyncStorage fica aqui, e as telas só chamam estas funções
// O AsyncStorage guarda texto no disco do celular: os dados sobrevivem a fechar o app.
// Toda chamada é assíncrona (devolve Promise), por isso as funções são async e usam await.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account } from './types';

// as duas chaves do app no AsyncStorage
const ACCOUNT_KEY: string = 'account'; // a conta cadastrada (usuário e senha)
const SESSION_KEY: string = 'session'; // quem está logado agora

// guarda a conta. O AsyncStorage só aceita texto, então o objeto vira JSON com JSON.stringify
export const saveAccount = async (account: Account): Promise<void> => {
  await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
};

// lê a conta guardada. Devolve null se ninguém se cadastrou ainda
export const getAccount = async (): Promise<Account | null> => {
  const text: string | null = await AsyncStorage.getItem(ACCOUNT_KEY);
  // getItem devolve null quando a chave não existe; só dá para fazer JSON.parse se houver texto
  if (text === null) {
    return null;
  }
  // o texto JSON volta a ser objeto
  return JSON.parse(text) as Account;
};

// guarda a sessão: o nome de quem entrou (já é texto, não precisa de JSON)
export const saveSession = async (username: string): Promise<void> => {
  await AsyncStorage.setItem(SESSION_KEY, username);
};

// lê quem está logado. Devolve null se ninguém está logado
export const getSession = async (): Promise<string | null> => {
  return AsyncStorage.getItem(SESSION_KEY);
};

// SAIR: apaga só a sessão. A conta continua guardada para o próximo login
export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

// excluir conta: apaga a conta e a sessão de uma vez
export const deleteAccount = async (): Promise<void> => {
  await AsyncStorage.multiRemove([ACCOUNT_KEY, SESSION_KEY]);
};
