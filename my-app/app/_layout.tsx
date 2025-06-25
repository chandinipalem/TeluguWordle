import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      let base = document.querySelector('base');
      if (base) {
        base.setAttribute('href', '/TeluguWordle/');
      } else {
        base = document.createElement('base');
        base.setAttribute('href', '/TeluguWordle/');
        document.head.appendChild(base);
      }
    }
  }, []);

  return <Stack />;
}
