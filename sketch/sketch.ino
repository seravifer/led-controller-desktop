#include <ArduinoJson.h>

#define RED_LED 6
#define GREEN_LED 9
#define BLUE_LED 5

int gBright = 0;
int rBright = 0;
int bBright = 0;

String dataReceived;
DynamicJsonDocument json(32);

void setup() {
  Serial.begin(9600);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  updateColor();
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
            updateColor();
            dataReceived = "";
            // serializeJson(json, Serial);
        }
    }
}

void updateColor() {
  analogWrite(GREEN_LED, 255 - gBright);
  analogWrite(RED_LED, 255 - rBright);
  analogWrite(BLUE_LED, 255 - bBright);
}
