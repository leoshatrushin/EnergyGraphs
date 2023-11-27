import React, {
    useEffect,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import {
    Text,
    LayoutChangeEvent,
    StyleSheet,
    View,
    ViewStyle,
    Pressable,
} from 'react-native';
import {AppContext} from '../App.provider';
import {MainChart} from '../components/MainChart';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Device} from 'react-native-ble-plx';
import {disconnectDevice, scanDevices} from '../services/bluetooth';
import {chartZoomOptions, chartZoomLabels} from '../constants';

export const Home: React.FC = () => {
    const {orientation, messages, setMessages} = useContext(AppContext);

    const [isConnected, setIsConnected] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState<Device>();
    const [message, setMessage] = useState(0);
    const [boxvalue, setBoxValue] = useState(false);

    useEffect(() => {
        if (!connectedDevice || !(connectedDevice.name === 'UART Service')) {
            console.log('need to scan devices');
            scanDevices(
                setIsConnected,
                setConnectedDevice,
                setMessage,
                setBoxValue,
                messages,
                setMessages,
            );
        } else {
            console.log('already connected');
            // console.log(messages);
        }

        return () => {
            if (connectedDevice) {
                disconnectDevice(connectedDevice, setIsConnected);
            }
        };
    }, [connectedDevice, messages, setMessages]);

    const [chartDim, setChartDim] = useState({width: 0, height: 0});
    const [chartZoom, setChartDuration] = useState(chartZoomOptions.ONE_HOUR);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        const {width, height} = event.nativeEvent.layout;
        setChartDim({width, height});
    }, []);

    const flexOrientation = useMemo<ViewStyle>(() => {
        return orientation.includes('PORTRAIT') ? flexCol : flexRow;
    }, [orientation]);

    const flexOppositeOrientation = useMemo<ViewStyle>(() => {
        return orientation.includes('PORTRAIT') ? flexRow : flexCol;
    }, [orientation]);

    return (
        <View style={[flexOrientation, styles.container]}>
            <View style={[styles.chartAreaContainer]}>
                <View style={styles.chartContainer} onLayout={onLayout}>
                    <MainChart />
                </View>
                <View style={[styles.chartOptionsContainer, flexOrientation]}>
                    <MaterialIcons name="zoom-in" />
                    <MaterialIcons.Button
                        name="zoom-in"
                        onPress={() => {}}
                        iconStyle={styles.reflectX}
                        style={styles.chartOption}>
                        {chartZoomLabels[chartZoom]}
                    </MaterialIcons.Button>
                    <MaterialIcons.Button
                        name="bar-chart"
                        onPress={() => {}}
                        style={styles.chartOption}>
                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Text style={styles.numerator}>d</Text>
                            <Text style={styles.denominator}>
                                <Text>d</Text>
                                <Text style={styles.italic}>x</Text>
                            </Text>
                        </View>
                    </MaterialIcons.Button>
                    <Entypo.Button
                        name="line-graph"
                        onPress={() => {}}
                        style={styles.chartOption}>
                        <Text>1x</Text>
                    </Entypo.Button>
                    <Pressable onPress={() => {}} style={styles.chartOption}>
                        <Text>AVG</Text>
                    </Pressable>
                    <Pressable onPress={() => {}} style={styles.chartOption}>
                        <Text>E</Text>
                    </Pressable>
                </View>
            </View>
            <Text style={styles.text}>Hello {orientation}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
    },
    chartAreaContainer: {
        flex: 4,
        display: 'flex',
        flexDirection: 'column',
    },
    chartContainer: {
        flex: 14,
    },
    text: {
        flex: 1,
    },
    chartOptionsContainer: {
        flex: 1,
        display: 'flex',
    },
    chartOption: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reflectX: {
        transform: [{scaleX: -1}],
    },
    numerator: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        display: 'flex',
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
