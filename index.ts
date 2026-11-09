// Ponto de entrada do app (o "main" do package.json aponta para este arquivo)
import { registerRootComponent } from 'expo';

import App from './App';

// registra o App como componente raiz: funciona no Expo Go e em build nativo
registerRootComponent(App);
