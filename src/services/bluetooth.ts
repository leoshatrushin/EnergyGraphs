import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const MESSAGE_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
// const BOX_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';

const BLTManager = new BleManager();

async function requestBluetoothPermission() {
    console.log('requesting bluetooth permissions');
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
            ]);

            return (
                result['android.permission.BLUETOOTH_CONNECT'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.BLUETOOTH_SCAN'] ===
                    PermissionsAndroid.RESULTS.GRANTED
            );
        }
    }

    return false;
}

function scanDevices(setMessages: any) {
    console.log('scanning devices');
    const subscription = BLTManager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            subscription.remove();
            scanAndConnect(setMessages);
        }
    }, true);
}

function scanAndConnect(setMessages: any) {
    console.log('scan and connect');
    BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (scannedDevice && scannedDevice.name === 'UART Service') {
            BLTManager.stopDeviceScan();
            connectDevice(scannedDevice, setMessages);
        }
    });

    // stop scanning devices after 10 seconds
    setTimeout(() => {
        console.log('timeout');
        BLTManager.stopDeviceScan();
    }, 10000);
}

function connectDevice(device: Device, setMessages: any) {
    console.log('connecting device');
    device
        .connect()
        .then((device) => {
            return device.discoverAllServicesAndCharacteristics();
        })
        .then((device) => {
            console.log('connection successful');
            //  Set what to do when DC is detected
            BLTManager.onDeviceDisconnected(device.id, (error, device) => {});

            //Message
            device.monitorCharacteristicForService(
                SERVICE_UUID,
                MESSAGE_UUID,
                (error, characteristic) => {
                    if (characteristic?.value != null) {
                        const message = Buffer.from(
                            characteristic.value,
                            'base64',
                        ).readInt32LE(0);

                        setMessages((messages: any) => [...messages, message]);
                    }
                },
            );
        });
}

export function bleInit(setMessages: any) {
    requestBluetoothPermission().then((granted) => {
        if (granted) {
            scanDevices(setMessages);
        }
    });
}
