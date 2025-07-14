import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput, // keyboard input
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Modal,
  Button,
} from 'react-native';
//import { Ionicons } from '@expo/vector-icons';
import { Dimensions,ScrollView,KeyboardAvoidingView } from 'react-native'; // for game to dynamically resize regardless of phone size 
import wordListRaw from '../scripts/telugu_common_words_100.json'; 
import { TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech'; // to get speech

// Only include words with transliteration ≤ 7 characters
const wordList = wordListRaw.filter(word => word.translit.length <= 7);


const GameScreen = () => {
    const [currentWord, setCurrentWord] = useState(null);
    const [currentGuess, setCurrentGuess] = useState([]); 
    const [cursor, setCursor] = useState(0); 
    const inputRef = useRef(null); 
    const [isGameOver, setIsGameOver] = useState(false);
    const [guesses, setGuesses] = useState([]);
    const [didWin, setDidWin] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);


    // Boxes shrink when the word is long.
    // Max size of 50px (for shorter words).
    const screenWidth = Dimensions.get('window').width;
    const boxMargin = 4 * 2; // 4px margin on each side
    const totalPadding = 40; // side padding in container
    const usableWidth = screenWidth - totalPadding;
   // const boxSize = Math.min(50, Math.floor((usableWidth / currentWord.translit.length) - boxMargin));



    const maxGuesses = 6;

  const [typedText, setTypedText] = useState('');
const [showCursor, setShowCursor] = useState(true);
const fullText = 'Wordle';
const isTypingRef = useRef(true); // ⬅️ track whether typing is active

useEffect(() => {
  let i = 0;
  const typeInterval = setInterval(() => {
    setTypedText(prev => {
      const nextChar = fullText.charAt(i);
      i++;

      if (i === fullText.length) {
        clearInterval(typeInterval);
        isTypingRef.current = false; // mark typing as done
      }

      return prev + nextChar;
    });
  }, 200);

  return () => clearInterval(typeInterval);
}, []);

useEffect(() => {
  const blinkInterval = setInterval(() => {
    setShowCursor(prev => {
      // Stop blinking when typing is finished
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
        // picks a random word from wordlist 
        const newWord = wordList[Math.floor(Math.random() * wordList.length)]; 
        setCurrentWord(newWord); 
        console.log('the word is'); 
        console.log(newWord); 

        setCurrentGuess([]); 
        setCursor(0); 
    }, []); 

    const handleKeyPress = ({ nativeEvent }) => {
        const key = nativeEvent.key; // gets the key that was pressed 

        if(!currentWord || isGameOver) return; 
        if(key == 'Backspace'){
            if(cursor > 0 ){
                const updated = [...currentGuess]; // makes a copy of the current guess 
                updated[cursor - 1] = ''; 
                setCurrentGuess(updated); 
                setCursor(cursor - 1); 
            }
        }
        // A-Z or a-z
        else if (/^[a-zA-Z]$/.test(key)) {
            if(cursor < currentWord.translit.length){
                const updated = [...currentGuess]; 
                updated[cursor] = key.toLowerCase(); 
                setCurrentGuess(updated); 
                setCursor(cursor + 1); 
            }
        }
        // when guess is entered
        else if(key == 'Enter'){
            // can only submit if full word length is entered 
            if(currentGuess.length === currentWord.translit.length &&
                currentGuess.every(letter => letter)
            ){
                const guessStr = currentGuess.join(''); 
                const newGuesses = [...guesses, guessStr]; 

                setGuesses(newGuesses); 
                setCurrentGuess([]); 
                setCursor(0); 

                // win or out of tries 
                const isCorrect = guessStr === currentWord.translit; 
                const isOutOfTries = newGuesses.length === maxGuesses; 

                if(isCorrect || isOutOfTries){
                    setIsGameOver (true); 
                    setDidWin(isCorrect); 
                }
            }
        }
    }; 

    const getBoxColor = (letter, idx, guess, solution) => {
        if (!letter) return '#eee'; // empty box background
      
        if (letter === solution[idx]) {
          return '#6aaa64'; // green
        } else if (solution.includes(letter)) {
          return '#c9b458'; // yellow
        } else {
          return '#787c7e'; // gray
        }
      };

      const speakerButton = (text) => {
        console.log('Speaking:', text); // Debug log
        Speech.speak(text, {
            language: 'te-IN',
            onDone: () => console.log('Speech finished'),
            onError: (error) => console.error('Speech error:', error),
          });
      };

    
      


    if(!currentWord) return <Text> Loading word... </Text>; 
    const boxSize = Math.min(
        50,
        Math.floor((usableWidth / currentWord.translit.length) - boxMargin)
      );


      return (
        <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
             <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1, backgroundColor: '#2c2d33' }}
            >
          <ScrollView contentContainerStyle={{
                padding: 20,
                paddingTop: 80,
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1,
                }}>

                      {/* Title */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                        <Text
                          style={{
                            fontSize: 40,
                            color: '#ffffff',
                            fontFamily: Platform.OS === 'web' ? 'Baloo Tamma 2' : 'sans-serif',
                            marginRight: 8,
                          }}
                        >
                          తెలుగు
                        </Text>
                        <Text
                          style={{
                            fontSize: 40,
                            color: '#ffffff',
                            fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
                          }}
                        >
                          {typedText}
                          {showCursor && isTypingRef.current && '|'}
                          
                        </Text>
                        </View>
                
                {/* How to play button  */}
                <TouchableOpacity
                onPress={() => setShowInstructions(true)}
                style={{
                    position: 'absolute',
                    top: 50,
                    right: 20,
                    zIndex: 10,
                }}
                >
                <Text style={{ fontSize: 26 }}>ℹ️</Text>
                </TouchableOpacity>

                <Modal visible={showInstructions} transparent animationType="fade">
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={{
                        backgroundColor: '#1e1e1e',
                        padding: 25,
                        borderRadius: 12,
                        maxWidth: '85%',
                        }}>
                        <Text style={{ fontSize: 22, color: '#fff', fontWeight: '600', marginBottom: 10 }}>
                            How to Play
                        </Text>
                        <Text style={{ fontSize: 16, color: '#ddd', marginBottom: 6 }}>
                            1. Type your guess using transliteration (e.g. <Text style={{ fontWeight: 'bold' }}>dosthulu</Text>)
                        </Text>
                        <Text style={{ fontSize: 16, color: '#ddd', marginBottom: 6 }}>
                            2. Hit return/enter to submit your guess
                        </Text>
                        <Text style={{ fontSize: 16, color: '#ddd', marginBottom: 6 }}>
                            3. Colors show feedback:
                        </Text>
                        <Text style={{ fontSize: 16, color: '#6aaa64', marginLeft: 10 }}>
                            🟩 Green: correct letter and position
                        </Text>
                        <Text style={{ fontSize: 16, color: '#c9b458', marginLeft: 10 }}>
                            🟨 Yellow: correct letter, wrong position
                        </Text>
                        <Text style={{ fontSize: 16, color: '#787c7e', marginLeft: 10 }}>
                            ⬜️ Gray: not in the word
                        </Text>
                        <Text style={{ fontSize: 16, color: '#ddd', marginTop: 6 }}>
                            4. You get 6 tries to guess the word
                        </Text>
                        <Text style={{ fontSize: 16, color: '#ddd', marginTop: 6 }}>
                            5. Use the 🔊 button to hear the word in Telugu!
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowInstructions(false)}
                            style={{
                            marginTop: 20,
                            alignSelf: 'center',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            backgroundColor: '#6aaa64',
                            borderRadius: 8,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Got it!</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    </Modal>


            <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#ffffff' }}>
              Guess the word ({currentWord.translit.length} letters)
            </Text>
      
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
                      marginBottom: 8,
                    }}
                  >
                    {Array.from({ length: currentWord.translit.length }).map(
                      (_, colIndex) => {
                        const letter = guess[colIndex] || '';
                        const color =
                          rowIndex < guesses.length
                            ? getBoxColor(
                                letter,
                                colIndex,
                                guess,
                                currentWord.translit
                              )
                            : '#eee';
      
                        return (
                          <View
                            key={colIndex}
                            style={{
                              width: boxSize,
                              height: boxSize,
                              margin: 4,
                              borderWidth: 1,
                              borderColor: '#999',
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: color,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: boxSize * 0.5,
                                fontWeight: 'bold',
                                color: color === '#eee' ? '#000' : '#fff',
                              }}
                            >
                              {letter.toUpperCase()}
                            </Text>
                          </View>
                        );
                      }
                    )}
                  </View>
                );
              })}
            </View>
      
            {/* Game Over Modal */}
            <Modal visible={isGameOver} transparent animationType="slide">
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}>
                <View style={{
                  backgroundColor: '#1e1e1e',
                  padding: 30,
                  borderRadius: 16,
                  alignItems: 'center',
                  maxWidth: '85%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 8,
                }}>
                  <Text  style={{
              fontSize: 24,
              fontWeight: '700',
              marginBottom: 10,
              color: didWin ? '#6aaa64' : '#e74c3c',
              fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
            }}>
                    {didWin ? '🎉 You Won!' : '😞 Game Over'}
                  </Text>
                  <Text style={{ fontSize: 18, color: '#eee', marginVertical: 5 }}>
              Word: <Text style={{ fontWeight: 'bold' }}>{currentWord.translit}</Text>
            </Text>
            <Text style={{ fontSize: 18, color: '#eee', marginVertical: 5 }}>
              Telugu: <Text style={{ fontWeight: 'bold' }}>{currentWord.telugu}</Text>
            </Text>
            <TouchableOpacity
                onPress={() => speakerButton(currentWord.translit)}
                style={{ marginLeft: 10 }}
                accessibilityLabel="Pronounce Telugu word"
            >
                <Text style={{ fontSize: 22 }}>🔊</Text>
            </TouchableOpacity>
            <Text style={{
              fontSize: 16,
              fontStyle: 'italic',
              color: '#aaa',
              marginTop: 10,
              textAlign: 'center'
            }}>
              Definition: {currentWord.definition}
            </Text>
      
                  <View style={{ marginTop: 25 }}>
                    <Button
                      title="Play Again"
                    color="#6aaa64"
                      onPress={() => {
                        const newWord = wordList[Math.floor(Math.random() * wordList.length)];
                        setCurrentWord(newWord);
                        console.log('new word is ', newWord);
                        setCurrentGuess([]);
                        setCursor(0);
                        setGuesses([]);
                        setIsGameOver(false);
                        setDidWin(false);
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
      
            {/* Invisible TextInput to capture keystrokes */}
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

export default GameScreen;
