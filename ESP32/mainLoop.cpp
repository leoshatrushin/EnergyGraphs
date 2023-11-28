// The first block is for setting up variables for light sensor
// These constants won't change. They're used to give names to the pins used:
const int analogInPin = 34;  // Analog input pin that the potentiometer is attached to

int sensorValue = 0;  // current value read from the pot
int maxValue = 0;     // maximum value read from the pot
int minValue = 5000;     // minimum value read from the pot
int level = 0;        // level to tell if ON or OFF
int newTimer = 0;
int oldTimer = 0;
int deltaT = 0;

bool newStatus = 0;
bool oldStatus = 0;

/* This block is for setting up blueTooth
   Create a BLE server that, once we receive a connection, will send periodic notifications.
   The service advertises itself as: 4fafc201-1fb5-459e-8fcc-c5c9c331914b
   And has a characteristic of: beb5483e-36e1-4688-b7f5-ea07361b26a8

   The design of creating the BLE server is:
   1. Create a BLE Server
   2. Create a BLE Service
   3. Create a BLE Characteristic on the Service
   4. Create a BLE Descriptor on the characteristic
   5. Start the service.
   6. Start advertising.
*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

BLEServer *pServer = NULL;
BLECharacteristic * pTxCharacteristic;
bool deviceConnected = false;
bool oldDeviceConnected = false;

#define SERVICE_UUID           "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" // UART service UUID
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"


class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
        deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
        deviceConnected = false;
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        std::string rxValue = pCharacteristic->getValue();

        if (rxValue.length() > 0) {
            Serial.println("*********");
            Serial.print("Received Value: ");
            for (int i = 0; i < rxValue.length(); i++)
                Serial.print(rxValue[i]);

            Serial.println();
            Serial.println("*********");
        }
    }
};

void setup() {

    // initialize serial communication for debugging on computer
    Serial.begin(115200);

    // Create the BLE Device
    BLEDevice::init("UART Service");

    // Create the BLE Server
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    // Create the BLE Service
    BLEService *pService = pServer->createService(SERVICE_UUID);

    // Create a BLE Characteristic
    pTxCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_TX,
        BLECharacteristic::PROPERTY_NOTIFY
    );

    pTxCharacteristic->addDescriptor(new BLE2902());

    BLECharacteristic * pRxCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_RX,
        BLECharacteristic::PROPERTY_WRITE
    );

    pRxCharacteristic->setCallbacks(new MyCallbacks());

    // Start the service
    pService->start();

    // Start advertising
    pServer->getAdvertising()->start();

    // Start advertising
    BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(false);
    pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
    BLEDevice::startAdvertising();
    delay(10);

    Serial.println("Setting up the logic level");

    //find threshold level to tell between ON and OFF status
    while (millis() < 20000) {
        sensorValue = analogRead(analogInPin);
        maxValue = max(maxValue, sensorValue);
        minValue = min(minValue, sensorValue);
        Serial.print("\t Level = ");
        Serial.println(sensorValue);
        delay(5);
    }
    level = 0.5 * (maxValue + minValue);

}

void loop() {
    // read the analog in value at time t=newTimer:
    sensorValue = analogRead(analogInPin);
    newTimer = millis();
    pTxCharacteristic->setValue(newTimer);

    newStatus = 0;
    if (sensorValue > level) {
        newStatus = 1;
    }

    if (newStatus != oldStatus) {
        oldStatus = newStatus;  // or there is no need to update;
        deltaT = newTimer - oldTimer;
        oldTimer = newTimer;
        // notify changed value if connected
        if (deviceConnected) {
            pTxCharacteristic->notify();  // send latest time value in milliseconds
        }
    }

    // disconnecting
    if (!deviceConnected && oldDeviceConnected) {
        delay(500);                   // give the bluetooth stack the chance to get things ready
        pServer->startAdvertising();  // restart advertising
        Serial.println("start advertising");
        oldDeviceConnected = deviceConnected;
    }

    // connecting
    if (deviceConnected && !oldDeviceConnected) {
        // do stuff here on connecting
        oldDeviceConnected = deviceConnected;
    }

    // print the results to the Serial Monitor:
    Serial.print("level = ");
    Serial.print(level);
    Serial.print("\t status = ");
    Serial.print(newStatus);
    Serial.print("\t deltaT = ");
    Serial.println(deltaT);

    // wait 10 milliseconds before the next loop for the analog-to-digital
    // converter to settle after the last reading:
    delay(10);
}
