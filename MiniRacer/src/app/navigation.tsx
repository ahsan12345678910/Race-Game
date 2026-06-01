import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { GameScreen } from '../screens/GameScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Menu: undefined;
  Game: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#1a1a2e' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
