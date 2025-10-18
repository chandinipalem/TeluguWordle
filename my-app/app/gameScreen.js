import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Modal,
  Button,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';
import wordListRaw from '../scripts/telugu_common_words_100.json';

const wordList = wordListRaw.filter(word => word.translit.length <= 5);

const GameScreen = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [didWin, setDidWin] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const boxMargin = 4 * 2;
  const totalPadding = 40;
  const usableWidth = screenWidth - totalPadding;
  const maxGuesses = 6;

  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'Wordle';
  const isTypingRef = useRef(true);

  // Y2K Color Scheme
  const colors = {
    primary: '#6B3F69',
    secondary: '#8D5F8C',
    tertiary: '#A376A2',
    accent: '#DDC3C3',
    correct: '#6B3F69',
    present: '#DDC3C3',
    absent: '#171317ff',
    background: '#1a1a1a',
  };

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      setTypedText(prev => {
        const nextChar = fullText.charAt(i);
        i++;
        if (i === fullText.length) {
          clearInterval(typeInterval);
          isTypingRef.current = false;
        }
        return prev + nextChar;
      });
    }, 200);
    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => {
        if (!isTypingRef.current) {
          clearInterval(blinkInterval);
          return false;
        }
        return !prev;
      });
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(newWord);
    console.log('the word is', newWord);
    setCurrentGuess([]);
    setCursor(0);
  }, []);

  const handleKeyPress = ({ nativeEvent }) => {
    const key = nativeEvent.key;
    if (!currentWord || isGameOver) return;
    
    if (key === 'Backspace') {
      if (cursor > 0) {
        const updated = [...currentGuess];
        updated[cursor - 1] = '';
        setCurrentGuess(updated);
        setCursor(cursor - 1);
      }
    } else if (/^[a-zA-Z]$/.test(key)) {
      if (cursor < currentWord.translit.length) {
        const updated = [...currentGuess];
        updated[cursor] = key.toLowerCase();
        setCurrentGuess(updated);
        setCursor(cursor + 1);
      }
    } else if (key === 'Enter') {
      if (
        currentGuess.length === currentWord.translit.length &&
        currentGuess.every(letter => letter)
      ) {
        const guessStr = currentGuess.join('');
        const newGuesses = [...guesses, guessStr];
        setGuesses(newGuesses);
        setCurrentGuess([]);
        setCursor(0);

        const isCorrect = guessStr === currentWord.translit;
        const isOutOfTries = newGuesses.length === maxGuesses;

        if (isCorrect || isOutOfTries) {
          setIsGameOver(true);
          setDidWin(isCorrect);
        }
      }
    }
  };

  const getBoxColor = (letter, idx, guess, solution) => {
    if (!letter) return 'transparent';
    if (letter === solution[idx]) return colors.correct;
    if (solution.includes(letter)) return colors.present;
    return colors.absent;
  };

  const speakerButton = (text) => {
    Speech.speak(text, {
      language: 'te-IN',
      onDone: () => console.log('Speech finished'),
      onError: (error) => console.error('Speech error:', error),
    });
  };

  if (!currentWord) return <Text>Loading word...</Text>;

  const boxSize = Math.min(
    60,
    Math.floor((usableWidth / currentWord.translit.length) - boxMargin)
  );

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingTop: 80,
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          {/* Title with Y2K gradient effect */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 44,
                color: colors.accent,
                fontFamily: Platform.OS === 'web' ? 'Baloo Tamma 2' : 'sans-serif',
                marginRight: 8,
                textShadowColor: colors.secondary,
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              తెలుగు
            </Text>
            <Text
              style={{
                fontSize: 44,
                color: colors.tertiary,
                fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
                textShadowColor: colors.primary,
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              {typedText}
              {showCursor && isTypingRef.current && '|'}
            </Text>
          </View>

          {/* How to play button */}
          <TouchableOpacity
            onPress={() => setShowInstructions(true)}
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              zIndex: 10,
              backgroundColor: colors.secondary,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 24, color: colors.accent }}>ℹ️</Text>
          </TouchableOpacity>

          {/* Instructions Modal with Y2K styling */}
          <Modal visible={showInstructions} transparent animationType="fade">
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.85)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primary,
                  padding: 25,
                  borderRadius: 24,
                  maxWidth: '85%',
                  borderWidth: 3,
                  borderColor: colors.accent,
                }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    color: colors.accent,
                    fontWeight: '700',
                    marginBottom: 15,
                    textAlign: 'center',
                  }}
                >
                  How to Play
                </Text>
                <Text style={{ fontSize: 16, color: colors.accent, marginBottom: 8 }}>
                  1. Type your guess using transliteration
                </Text>
                <Text style={{ fontSize: 16, color: colors.accent, marginBottom: 8 }}>
                  2. Hit return/enter to submit
                </Text>
                <Text style={{ fontSize: 16, color: colors.accent, marginBottom: 8 }}>
                  3. Colors show feedback:
                </Text>
                <View
                  style={{
                    backgroundColor: colors.correct,
                    padding: 8,
                    borderRadius: 12,
                    marginLeft: 10,
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#fff' }}>
                    💜 Purple: correct letter and position
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.present,
                    padding: 8,
                    borderRadius: 12,
                    marginLeft: 10,
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#fff' }}>
                    💗 Pink: correct letter, wrong position
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.absent,
                    padding: 8,
                    borderRadius: 12,
                    marginLeft: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#fff' }}>
                    🖤 Dark: not in the word
                  </Text>
                </View>
                <Text style={{ fontSize: 16, color: colors.accent, marginTop: 6 }}>
                  4. You get 6 tries!
                </Text>
                <Text style={{ fontSize: 16, color: colors.accent, marginTop: 6 }}>
                  5. Use 🔊 to hear the word!
                </Text>

                <TouchableOpacity
                  onPress={() => setShowInstructions(false)}
                  style={{
                    marginTop: 20,
                    alignSelf: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    backgroundColor: colors.accent,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }}>
                    Got it! ✨
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Text
            style={{
              fontSize: 18,
              marginBottom: 30,
              textAlign: 'center',
              color: colors.accent,
              fontWeight: '500',
            }}
          >
            Guess the word ({currentWord.translit.length} letters)
          </Text>

          {/* Game Grid with Animated Tiles */}
          <View style={{ justifyContent: 'center' }}>
            {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
              const guess =
                rowIndex < guesses.length
                  ? guesses[rowIndex].split('')
                  : rowIndex === guesses.length
                  ? currentGuess
                  : [];

              return (
                <View
                  key={rowIndex}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  {Array.from({ length: currentWord.translit.length }).map((_, colIndex) => {
                    return (
                      <AnimatedTile
                        key={colIndex}
                        letter={guess[colIndex] || ''}
                        color={
                          rowIndex < guesses.length
                            ? getBoxColor(guess[colIndex], colIndex, guess, currentWord.translit)
                            : 'transparent'
                        }
                        boxSize={boxSize}
                        delay={colIndex * 100}
                        shouldFlip={rowIndex < guesses.length}
                      />
                    );
                  })}
                </View>
              );
            })}
          </View>

          {/* Game Over Modal with Y2K styling */}
          <Modal visible={isGameOver} transparent animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.85)',
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primary,
                  padding: 30,
                  borderRadius: 28,
                  alignItems: 'center',
                  maxWidth: '85%',
                  borderWidth: 4,
                  borderColor: colors.accent,
                }}
              >
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    marginBottom: 15,
                    color: colors.accent,
                  }}
                >
                  {didWin ? '🎉 You Won! 🎉' : '💜 Game Over 💜'}
                </Text>
                <Text style={{ fontSize: 20, color: colors.accent, marginVertical: 8 }}>
                  Word: <Text style={{ fontWeight: 'bold' }}>{currentWord.translit}</Text>
                </Text>
                <Text style={{ fontSize: 20, color: colors.accent, marginVertical: 8 }}>
                  Telugu: <Text style={{ fontWeight: 'bold' }}>{currentWord.telugu}</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => speakerButton(currentWord.translit)}
                  style={{
                    backgroundColor: colors.secondary,
                    borderRadius: 20,
                    padding: 12,
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 28 }}>🔊</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    fontStyle: 'italic',
                    color: colors.accent,
                    marginTop: 15,
                    textAlign: 'center',
                  }}
                >
                  {currentWord.definition}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
                    setCurrentWord(newWord);
                    setCurrentGuess([]);
                    setCursor(0);
                    setGuesses([]);
                    setIsGameOver(false);
                    setDidWin(false);
                  }}
                  style={{
                    marginTop: 25,
                    paddingVertical: 14,
                    paddingHorizontal: 30,
                    backgroundColor: colors.accent,
                    borderRadius: 22,
                  }}
                >
                  <Text style={{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }}>
                    Play Again ✨
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TextInput
            ref={inputRef}
            style={{ height: 1, width: 1, opacity: 0 }}
            autoFocus
            blurOnSubmit={false}
            onKeyPress={handleKeyPress}
            onSubmitEditing={() => {
              if (
                currentGuess.length === currentWord.translit.length &&
                currentGuess.every(letter => letter)
              ) {
                const guessStr = currentGuess.join('');
                const newGuesses = [...guesses, guessStr];
                setGuesses(newGuesses);
                setCurrentGuess([]);
                setCursor(0);

                const isCorrect = guessStr === currentWord.translit;
                const isOutOfTries = newGuesses.length === maxGuesses;

                if (isCorrect || isOutOfTries) {
                  setIsGameOver(true);
                  setDidWin(isCorrect);
                }
              }
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

// Animated Tile Component with Flip Animation
const AnimatedTile = ({ letter, color, boxSize, delay, shouldFlip }) => {
  const flipAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    if (shouldFlip && letter) {
      // Flip animation
      flipAnim.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, {
          duration: 400,
          delay: delay,
          easing: Easing.out(Easing.ease),
        })
      );
    }
  }, [shouldFlip, letter]);

  useEffect(() => {
    if (letter && !shouldFlip) {
      // Pop animation when typing
      scaleAnim.value = withSequence(
        withSpring(1.15, { damping: 10, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 300 })
      );
    }
  }, [letter]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(flipAnim.value, [0, 0.5, 1], [0, 90, 180]);
    const backgroundColor =
      flipAnim.value > 0.5
        ? color
        : 'transparent';

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` },
        { scale: scaleAnim.value },
      ],
      backgroundColor,
    };
  });

   // Counter-rotate the text to keep it upright
  const textAnimatedStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(flipAnim.value, [0, 0.5, 1], [0, -90, -180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` },
      ],
    };
  });

  const colors = {
    primary: '#6B3F69',
    accent: '#DDC3C3',
  };

  return (
    <Animated.View
      style={[
        {
          width: boxSize,
          height: boxSize,
          margin: 4,
          borderWidth: 2,
          borderColor: letter ? colors.accent : colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
        },
        animatedStyle,
      ]}
    >
      <Animated.Text
        style={[
          {
            fontSize: boxSize * 0.5,
            fontWeight: 'bold',
            color: color === 'transparent' ? colors.accent : '#fff',
          },
          textAnimatedStyle,
        ]}
      >
        {letter.toUpperCase()}
      </Animated.Text>
    </Animated.View>
  );

  
};

export default GameScreen;