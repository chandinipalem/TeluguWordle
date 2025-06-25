import { Stack } from 'expo-router';

import { ExpoRoot } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  const base = document.querySelector('base');
  if (base) base.setAttribute('href', '/TeluguWordle/');
}


export const unstable_settings = {
  initialRouteName: '/',
};

export default function Layout() {
  return <Stack />;
}
