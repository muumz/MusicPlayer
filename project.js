import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Dimensions, Image, FlatList, Animated} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import songs from '../modal/data';
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';

const { width, height } = Dimensions.get('window');

const setupPlayer = async() => {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.add(songs);
}

const togglePlayback = async(playbackState) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if ( currentTrack !== 'null' ) {
        if ( playbackState == State.Paused ){
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    }
}

const Player = () => { 
    //usePlayBackState stores the current state in playbackstate constant
    const playbackState = usePlaybackState();
    
    const scrollX = useRef( new Animated.Value(0)).current;
    const[songIndex, setSongIndex] = useState (0);

    const songSlider = useRef(null);

    useEffect(() => {
        setupPlayer();

        scrollX.addListener(({ value }) => {
            //console.log('scrollX', scrollX);
            //console.log('Device width', width);

            const index = Math.round( value / width );
            setSongIndex(index);

            //console.log('Index', index);
        });
        //need to remove any event listeners remaining 
        return () => {
            scrollX.removeAllListeners();
        }
    }, []);

    const skipToNext = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex + 1) * width,
        });
    }

    const skipToPrevious = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex - 1) * width,
        });
    }

    const renderSongs = ({ index, item }) => {
    return (    
        <Animated.View style={{
            width: width,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={styles.imgWrapper}>
                    <Image 
                    source={item.image}
                    style={styles.img}
                    />
            </View> 
        </Animated.View>
        ); 
    }

    return(
        <SafeAreaView style={styles.container} >
        <View style={styles.mainView}>

            <Animated.FlatList 
                ref = { songSlider }
                data={songs}
                renderItem={renderSongs}
                keyExtractors={(item) => item.id}
                horizontal 
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: {
                        contentOffset: {x: scrollX}
                    } } ],
                {useNativeDriver: true}
                )}
            />
            
            <View>
                <Text style={styles.title}>{songs[songIndex].title}</Text>
                <Text style={styles.artist}>{songs[songIndex].artist}</Text>
            </View>
            <View>
                <Slider style={styles.progressLine}
                value={10}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor="#FFD369"
                minimumTrackTintColor="#FFD369"
                maximumTrackTintColor="#FFF"
                onSlidingComplete={() => {}}
                />
                <View style={styles.progressLabel}>
                    <Text style={styles.progressLabelText}>0:00</Text>
                    <Text style={styles.progressLabelText}>3:55</Text>
                </View>
            </View>

            <View style={styles.musicButtons}>
            <TouchableOpacity onPress={skipToPrevious}>
                <FontAwesome5 name="step-backward" size={35} color="#FFD369" style={{marginTop:25}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => togglePlayback(playbackState)}> 
                <FontAwesome5 name={ playbackState === State.Playing ? "pause-circle" : "play-circle"} size={75} color="#FFD369" />
            </TouchableOpacity>                                        
            <TouchableOpacity onPress={skipToNext}>
                <FontAwesome5 name="step-forward" size={35} color="#FFD369" style={{marginTop:25}}/>
            </TouchableOpacity>
            </View>


        </View>

        <View style={styles.bottomContainer}>
        <View style={styles.bottomControls}>
        <TouchableOpacity onPress={() => {}}>
            <FontAwesome5 name="heart" size={25} color="#777777" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="repeat" size={25} color="#777777" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="share" size={25} color="#777777" />
        </TouchableOpacity>
        </View>
        </View>
        </SafeAreaView>
    )
                }



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222831' 
    },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgWrapper: {
        width: 300,
        height: 340,
        marginBottom: 25,
        
        elevation: 5
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 15
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#eeeeee'
    },
    artist: {
        fontSize: 16,
        fontWeight: '200',
        textAlign: 'center',
        color: '#eeeeee'
    },
    progressLine: {
        width: 350,
        height: 40,
        marginTop: 25,
        flexDirection: 'row'
    },
    progressLabel: {
        width: 340,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    progressLabelText: {
        color: '#fff'
    },
    musicButtons: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'space-between',
        marginTop: 10
    },
    bottomContainer: {
        borderTopColor: "#393E46",
        borderTopWidth: 1,
        width: width,
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'flex-end',
       //flexDirection: 'row'
    },
    bottomControls: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: "80%"}
})

export default Player;