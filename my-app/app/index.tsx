import { Text, View } from "react-native";
// @ts-ignore
import GameScreen from './gameScreen';
import { Stack } from "expo-router";

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GameScreen />
    </>
  );
}