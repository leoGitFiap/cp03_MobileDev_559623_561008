import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account } from './types';

// as duas chaves do app no AsyncStorage
const ACCOUNT_KEY: string = 'account'; // a conta cadastrada (usuário e senha)
const SESSION_KEY: string = 'session'; // quem está logado agora

export const saveAccount = async (account: Account): Promise<void> => {
  await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
};

// null se ninguém se cadastrou ainda
export const getAccount = async (): Promise<Account | null> => {
  const text: string | null = await AsyncStorage.getItem(ACCOUNT_KEY);
  if (text === null) {
    return null;
  }
  return JSON.parse(text) as Account;
};

export const saveSession = async (username: string): Promise<void> => {
  await AsyncStorage.setItem(SESSION_KEY, username);
};

// null se ninguém está logado
export const getSession = async (): Promise<string | null> => {
  return AsyncStorage.getItem(SESSION_KEY);
};

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

// excluir conta: apaga a conta e a sessão
export const deleteAccount = async (): Promise<void> => {
  await AsyncStorage.multiRemove([ACCOUNT_KEY, SESSION_KEY]);
};
