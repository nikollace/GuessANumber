import React, {useState , useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, ScrollView, FlatList, Dimensions} from 'react-native';
import NumberContainer from '../components/numberContainer';
import Card from '../components/Card'
import DefaultStyles from '../constants/default-styles'
import MainButton from '../components/MainButton'
import { Ionicons } from '@expo/vector-icons'
import BodyText from '../components/BodyText';
import * as ScreenOrientation from 'expo-screen-orientation';

const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max-min)) + min;
    if(rndNum === exclude) {
        return generateRandomBetween(min, max, exclude);
    } else {
        return rndNum;
    }
};

const renderListItem = (listLength, itemData) => (
    <View style={styles.listItem}>
        <BodyText>#{listLength - itemData.index}</BodyText>
        <BodyText>{itemData.item}</BodyText>
    </View>
);

const GameScreen = props => {

    //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    const initialGuess = generateRandomBetween(1, 100, props.userChoice);
    const [currentGuess, setCurrentGuess] = useState(initialGuess);

    const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);

    const [availableDeviceWidth, setAvailableDeviceWidth]
     = useState(Dimensions.get('window').width);

     const [availableDeviceHeight, setAvailableDeviceHeight]
     = useState(Dimensions.get('window').height);

    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    //Cepamo objekat props i dalje koristimo ove nazive bez props...
    const { userChoice, onGameOver } = props;

    useEffect(() => {
        const updateLayout = () => {
            setAvailableDeviceWidth(Dimensions.get('window').width);
            setAvailableDeviceHeight(Dimensions.get('window').height)
        };

        Dimensions.addEventListener('change', updateLayout);
        //cleanup funkcija da se izbegne nepotrebno rerenderovanje
        return () => {
            Dimensions.removeEventListener('change', updateLayout);
        };
    });

    //Izvrsava se uvek nakon renderovanja komponente GameScreen
    useEffect(() => {
        if(currentGuess === userChoice) {
            onGameOver(pastGuesses.length);
        }
        //uglaste zagrade ispod nam sluze da proverimo da li se neki od parametara
        //unutar njih izmenio i ako jeste onda se pozive useEffect, ako nije onda nista
    }, [currentGuess, userChoice, onGameOver]);

    const nextGuessHandler = direction => {
        if((direction === 'lower' && currentGuess < props.userChoice) 
        || (direction === 'greater' && currentGuess > props.userChoice)) {
            Alert.alert('Don\'t lie!', 'You know that this is wrong...', 
            [{text: 'Sorry!', style:'cancel'}]);
            return;
        }

        if(direction === 'lower') {
            currentHigh.current = currentGuess;
        } else {
            currentLow.current = currentGuess + 1;
        }
        const nextNumber = generateRandomBetween(currentLow.current, 
            currentHigh.current, currentGuess);
        setCurrentGuess(nextNumber);
        //setRounds(curRounds => curRounds + 1);
        setPastGuesses(curPastGuesses => [nextNumber.toString(), ...curPastGuesses])
    };

    let listContainerStyle = styles.listContainer;

    if(availableDeviceWidth < 350) {
        listContainerStyle = styles.listContainerBig;
    }

    if(availableDeviceHeight < 500) {
        return (
            <View style={styles.screen}>
            <Text style={DefaultStyles.bodyText}>Opponent's Guess</Text>
            <View style={styles.controls}>
            <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>LOWER</MainButton>
            <NumberContainer>{currentGuess}</NumberContainer>
            <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>GREATER</MainButton>
            </View>
            <View style={listContainerStyle}>
                {/* <ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess, index)=> renderListItem(guess, pastGuesses.length - index))}
                </ScrollView> */}
                <FlatList 
                keyExtractor={(item) => item} 
                data={pastGuesses} 
                renderItem={renderListItem.bind(this, pastGuesses.length)}
                contentContainerStyle={styles.list}
                />
            </View>   
        </View>
        );
    }

    return (
        <View style={styles.screen}>
            <Text style={DefaultStyles.bodyText}>Opponent's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>LOWER</MainButton>
                <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>GREATER</MainButton>
            </Card>
            <View style={listContainerStyle}>
                {/* <ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess, index)=> renderListItem(guess, pastGuesses.length - index))}
                </ScrollView> */}
                <FlatList 
                keyExtractor={(item) => item} 
                data={pastGuesses} 
                renderItem={renderListItem.bind(this, pastGuesses.length)}
                contentContainerStyle={styles.list}
                />
            </View>   
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
       // marginTop: 20,
        marginTop:Dimensions.get('window').height > 600 ? 20 : 10,
        width: 400,
        maxWidth: '90%'
    },
    controls: {
        flexDirection:'row',
        justifyContent: 'space-around',
        width: '80%',
        alignItems: 'center'
    },
    listItem:{
        borderColor: '#ccc',
        borderWidth: 1,
        padding:15,
        marginVertical: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    listContainer: {
        width: '60%',
        flex: 1,
        //width: Dimensions.get('window').width > 350 ? '60%' : '80%'
    },
    listContainerBig: {
        flex: 1,
        width: '80%'
    },
    list: {
        flexGrow: 1,
        // alignItems: 'center',
        justifyContent: 'flex-end'
    }
});

export default GameScreen
