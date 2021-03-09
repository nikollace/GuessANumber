import React from 'react'
import { View, Text, StyleSheet, Button, Image, Dimensions, ScrollView } from 'react-native'
import BodyText from '../components/BodyText'
import TitleText from '../components/TitleText'
import Colors from '../constants/colors'
import MainButton from '../components/MainButton'

const GameOverScreen = props => {
    return (
        <ScrollView>
        <View style={styles.screen}>
            <TitleText>The Game is Over!</TitleText>
            <View style={styles.imageContainer}>
                <Image 
                source={require('../assets/success.png')} 
                //source={{uri: 'https://images.app.goo.gl/BBi2wB8FeUx3Yqx79'}} 
                style={styles.image} 
                resizeMode="cover"/>
            </View>
            <View style={styles.resultContainer}>
            <BodyText style={styles.resultText}>
                Your phone needed <Text style={styles.highlight}>{props.roundsNumber}</Text> rounds to guess the 
                number <Text style={styles.highlight}>{props.userNumber}</Text></BodyText>
            </View>
            
            <MainButton onPress={props.onRestart}>NEW GAME</MainButton>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    image:{
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        //borderRadius: 150,
        borderRadius: Dimensions.get('window').width * 0.7 / 2,
        borderWidth: 3,
        borderColor: 'black',
       // width: 300
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        //height: 300,
        overflow: 'hidden',
        //marginVertical: 30,
        // /20 postavlja vertikalnu marginu na 5%, /40 postavlja na 2.5%
        marginVertical: Dimensions.get('window').height / 30
    },
    highlight: {
        color: Colors.primary
    },
    resultContainer: {
        width: '80%',
        marginHorizontal: 30,
        //marginVertical: 15
        marginVertical: Dimensions.get('window').height / 60
    },
    resultText: {
        textAlign:'center',
        fontSize: Dimensions.get('window').height < 400 ? 16 : 20,
        //fontSize: 20
    }
})

export default GameOverScreen
