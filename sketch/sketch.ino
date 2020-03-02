#include <ArduinoJson.h>

#define RED_LED 6
#define BLUE_LED 5
#define GREEN_LED 9

int gBright = 0;
int rBright = 0;
int bBright = 0;

String dataReceived;

DynamicJsonDocument json(32);

boolean newData = false;

void setup() {
  Serial.begin(9600);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  changeColor();
}

void loop() {
  read();
}

void read() {
    char endMarker = '\n';
    char c;

    while (Serial.available() > 0) {
        c = Serial.read();

        if (c != endMarker) {
            dataReceived += c;
        } else {
            deserializeJson(json, dataReceived);
            gBright = json["g"];
            rBright = json["r"];
            bBright = json["b"];
            // serializeJson(json, Serial);
            changeColor();
            dataReceived = "";
        }
    }
}

void changeColor() {
  analogWrite(GREEN_LED, 255 - gBright);
  analogWrite(RED_LED, 255 - rBright);
  analogWrite(BLUE_LED, 255 - bBright);
}
