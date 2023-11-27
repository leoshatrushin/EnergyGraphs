import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import {Buffer} from 'buffer';

const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const MESSAGE_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
const BOX_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';

const BLTManager = new BleManager();

export async function requestBluetoothPermission() {
    if (Platform.OS === 'ios') {
        return true;
    }
    if (
        Platform.OS === 'android' &&
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
        const apiLevel = parseInt(Platform.Version.toString(), 10);

        if (apiLevel < 31) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        if (
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        ) {
            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);

            return (
                result['android.permission.BLUETOOTH_CONNECT'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.BLUETOOTH_SCAN'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.ACCESS_FINE_LOCATION'] ===
                    PermissionsAndroid.RESULTS.GRANTED
            );
        }
    }

    console.log('Permission have not been granted');

    return false;
}

// Scans availbale BLT Devices and then call connectDevice
export async function scanDevices(
    setIsConnected: (value: boolean) => void,
    setConnectedDevice: (value: Device) => void,
    setMessage: (value: number) => void,
    setBoxValue: (value: boolean) => void,
    messages: number[],
    setMessages: React.Dispatch<React.SetStateAction<number[]>>,
) {
    console.log('requesting permissions');
    await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'Permission Localisation Bluetooth',
            message: 'Requirement for Bluetooth',
            buttonNeutral: 'Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        },
    );

    console.log('scanning');
    // display the Activityindicator

    BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
            console.warn(error);
        }

        if (scannedDevice && scannedDevice.name === 'UART Service') {
            BLTManager.stopDeviceScan();
            console.log('device found');
            connectDevice(
                scannedDevice,
                BLTManager,
                setIsConnected,
                setConnectedDevice,
                setMessage,
                setBoxValue,
                messages,
                setMessages,
            );
        } else {
            if (scannedDevice) {
                console.log('found device', scannedDevice.serviceUUIDs);
            } else {
                console.log('no device found');
            }
        }
    });

    // stop scanning devices after 5 seconds
    setTimeout(() => {
        console.log('timeout');
        BLTManager.stopDeviceScan();
    }, 10000);
}

// handle the device disconnection (poorly)
export async function disconnectDevice(
    connectedDevice: Device,
    setIsConnected: (value: boolean) => void,
) {
    console.log('Disconnecting start');

    // if (connectedDevice != null) {
    //     const isDeviceConnected = await connectedDevice.isConnected();
    //     if (isDeviceConnected) {
    //         BLTManager.cancelTransaction('messagetransaction');
    //         BLTManager.cancelTransaction('nightmodetransaction');

    //         BLTManager.cancelDeviceConnection(connectedDevice.id).then(() =>
    //             console.log('DC completed'),
    //         );
    //     }

    //     const connectionStatus = await connectedDevice.isConnected();
    //     if (!connectionStatus) {
    //         setIsConnected(false);
    //     }
    // }
}

//Function to send data to ESP32
// async function sendBoxValue(value: boolean) {
//     BLTManager.writeCharacteristicWithResponseForDevice(
//         connectedDevice?.id,
//         SERVICE_UUID,
//         BOX_UUID,
//         base64.encode(value.toString()),
//     ).then((characteristic) => {
//         console.log(
//             'Boxvalue changed to :',
//             base64.decode(characteristic.value),
//         );
//     });
// }

//Connect the device and start monitoring characteristics
export async function connectDevice(
    device: Device,
    BLTManager: BleManager,
    setIsConnected: (value: boolean) => void,
    setConnectedDevice: (value: Device) => void,
    setMessage: (value: number) => void,
    setBoxValue: (value: boolean) => void,
    messages: number[],
    setMessages: React.Dispatch<React.SetStateAction<number[]>>,
) {
    console.log('connecting to Device:', device.name);

    device
        .connect()
        .then(device => {
            setConnectedDevice(device);
            setIsConnected(true);
            return device.discoverAllServicesAndCharacteristics();
        })
        .then(device => {
            //  Set what to do when DC is detected
            BLTManager.onDeviceDisconnected(device.id, (error, device) => {
                console.log('Device DC');
                setIsConnected(false);
            });

            //Read inital values

            //Message
            // device
            //     .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
            //     .then((valenc) => {
            //         if (valenc?.value != null) {
            //             // Convert base64 to raw bytes
            //             const rawBytes = base64.decode(valenc?.value);

            //             // Convert raw bytes to integer
            //             const message = Buffer.from(
            //                 rawBytes,
            //                 'binary',
            //             ).readInt32LE(0);

            //             setMessage(message);
            //         }
            //     });

            //    //BoxValue
            //    // device
            //    //     .readCharacteristicForService(SERVICE_UUID, BOX_UUID)
            //    //     .then((valenc) => {
            //    //         if (valenc?.value != null) {
            //    //             setBoxValue(StringToBool(base64.decode(valenc.value)));
            //    //         }
            //    //     });

            //    //monitor values and tell what to do when receiving an update

            //Message
            device.monitorCharacteristicForService(
                SERVICE_UUID,
                MESSAGE_UUID,
                (error, characteristic) => {
                    if (characteristic?.value != null) {
                        // Convert base64 to raw bytes
                        const rawBytes = base64.decode(characteristic?.value);

                        // Convert raw bytes to integer
                        const message = Buffer.from(
                            rawBytes,
                            'binary',
                        ).readInt32LE(0);

                        setMessage(message);
                        console.log(messages);
                        setMessages(messages => [...messages, message]);
                        console.log('Message update received: ', message);
                        console.log(messages);
                    }
                },
                'messagetransaction',
            );

            //    //BoxValue
            //    // device.monitorCharacteristicForService(
            //    //     SERVICE_UUID,
            //    //     BOX_UUID,
            //    //     (error, characteristic) => {
            //    //         if (characteristic?.value != null) {
            //    //             setBoxValue(
            //    //                 StringToBool(base64.decode(characteristic?.value)),
            //    //             );
            //    //             console.log(
            //    //                 'Box Value update received: ',
            //    //                 base64.decode(characteristic?.value),
            //    //             );
            //    //         }
            //    //     },
            //    //     'boxtransaction',
            //    // );

            //    console.log('Connection established');
        });
}

function StringToBool(input: String) {
    if (input == '1') {
        return true;
    } else {
        return false;
    }
}

function BoolToString(input: boolean) {
    if (input == true) {
        return '1';
    } else {
        return '0';
    }
}
