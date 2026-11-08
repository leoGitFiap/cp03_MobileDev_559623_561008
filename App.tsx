import { type JSX } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// a primeira Stack.Screen é a tela que abre o app
const App = (): JSX.Element => {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#FFFFFF',
          contentStyle: { backgroundColor: '#121212' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="List" component={ListScreen} options={{ title: 'Músicas' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Música' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
