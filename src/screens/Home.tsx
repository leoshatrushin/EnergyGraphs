import React, { useContext, useEffect, useMemo } from 'react';
import { Text, StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { AppContextType, AppContext } from '../App.provider';
import { MainChart } from '../components/MainChart';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
// import { bleInit } from '../services/bluetooth';
// import '../services/websocket';

function connectToWebSocket() {
    const webSocket = new WebSocket('ws://192.168.0.136:80/ws');

    webSocket.onopen = () => {
        console.log('Connection opened!');
        webSocket.send('Hello Server!');
        webSocket.send('Hello Server2!');
    };

    // Listen for messages
    webSocket.onmessage = event => {
        console.log('Message from server ', event.data);
    };

    // Listen for possible errors
    webSocket.onerror = error => {
        console.log('WebSocket Error ', error);
    };

    // Listen for connection close
    webSocket.onclose = e => {
        console.log('WebSocket connection closed: ', e);
    };
}

export const Home: React.FC = () => {
    const { orientation, setMessages } = useContext<AppContextType>(AppContext);

    // useEffect(() => {
    //     bleInit(setMessages);
    // }, []);

    const flexOrientation = useMemo<ViewStyle>(() => {
        return orientation.includes('PORTRAIT') ? flexCol : flexRow;
    }, [orientation]);

    return (
        <View style={[flexOrientation, styles.container]}>
            <View style={[styles.chartSectionContainer]}>
                <View style={styles.chartAreaContiner}>
                    <View style={styles.yAxisLabelContainer}>
                        <Text style={styles.yAxisLabel}>Watts</Text>
                    </View>
                    <View style={styles.chartContainer}>
                        <MainChart />
                    </View>
                    <View style={styles.yAxisLabelContainer}>
                        <Text style={styles.yAxisLabel}>Dollars per hour</Text>
                    </View>
                </View>
                <View style={styles.xAxisLabelContainer}>
                    <Text style={styles.xAxisLabel}>Seconds</Text>
                </View>
                <View style={[flexOrientation, styles.chartOptionsContainer]}>
                    <MaterialIcons name="zoom-in" />
                    <MaterialIcons.Button
                        name="zoom-in"
                        onPress={() => {}}
                        iconStyle={styles.reflectX}
                        style={styles.chartOption}
                    >
                        tmp
                    </MaterialIcons.Button>
                    <MaterialIcons.Button name="bar-chart" onPress={() => {}} style={styles.chartOption}>
                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.numerator}>c</Text>
                            <Text style={styles.denominator}>
                                <Text>d</Text>
                                <Text style={styles.italic}>x</Text>
                            </Text>
                        </View>
                    </MaterialIcons.Button>
                    <Entypo.Button name="line-graph" onPress={() => {}} style={styles.chartOption}>
                        <Text>1x</Text>
                    </Entypo.Button>
                    <Pressable onPress={() => {}} style={styles.chartOption}>
                        <Text>AVG</Text>
                    </Pressable>
                    <Pressable onPress={() => {}} style={styles.chartOption}>
                        <Text>E</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => connectToWebSocket()}
                        style={[styles.chartOption, { backgroundColor: 'blue' }]}
                    >
                        <Text>Connect</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.sidebarContainer}>
                <Text style={styles.text}>Hello {orientation}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        color: 'white',
    },
    chartSectionContainer: {
        flex: 4,
        flexDirection: 'column',
    },
    sidebarContainer: {
        flex: 1,
    },
    xAxisLabelContainer: {
        height: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    xAxisLabel: {
        textAlign: 'center',
        color: 'white',
    },
    chartAreaContiner: {
        flex: 14,
        flexDirection: 'row',
    },
    yAxisLabelContainer: {
        width: 15,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-90deg' }],
    },
    yAxisLabel: {
        width: 100,
        textAlign: 'center',
        color: 'white',
    },
    chartContainer: {
        flexGrow: 1,
    },
    text: {},
    chartOptionsContainer: {
        flex: 1,
    },
    chartOption: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reflectX: {
        transform: [{ scaleX: -1 }],
    },
    numerator: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    denominator: {},
    italic: {
        fontStyle: 'italic',
    },
});

const flexCol: ViewStyle = {
    flexDirection: 'column',
};

const flexRow: ViewStyle = {
    flexDirection: 'row',
};
