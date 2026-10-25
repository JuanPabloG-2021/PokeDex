import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PokemonScreen from './src/screens/PokemonScreen';
import PokedexStack from './src/navigation/PokedexStack';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <PokedexStack/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
