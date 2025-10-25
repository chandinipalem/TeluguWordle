import GameScreen from './gameScreen';
import { Stack } from 'expo-router';

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GameScreen />
    </>
  );
}