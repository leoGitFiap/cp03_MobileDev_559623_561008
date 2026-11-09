// App.tsx · monta a navegação do app: um único stack com as cinco telas
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

// cria o stack ligado ao tipo RootStackParamList: nome de rota errado ou parâmetro
// faltando vira erro de compilação. Ele entrega Stack.Navigator e Stack.Screen
const Stack = createNativeStackNavigator<RootStackParamList>();

// a primeira Stack.Screen é a tela que abre o app
const App = (): JSX.Element => {
  return (
    // NavigationContainer guarda o estado da navegação (quais telas estão no stack)
    <NavigationContainer>
      {/* ícones da barra de status (hora, bateria) em branco, por causa do fundo escuro */}
      <StatusBar style="light" />
      <Stack.Navigator
        // opções que valem para todas as telas: header escuro com texto branco e fundo escuro
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#FFFFFF',
          contentStyle: { backgroundColor: '#121212' },
        }}
      >
        {/* cada Stack.Screen liga um nome de rota a um componente de tela */}
        {/* Login sem header: é a primeira tela, não há para onde voltar */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
        {/* Home sem header: ela desenha a própria barra do topo (avatar + saudação) */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="List" component={ListScreen} options={{ title: 'Músicas' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Música' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
