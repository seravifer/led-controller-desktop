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
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  updateColor();
  Serial.begin(19200);
}

void loop() {
  if (Serial.available()) {
    dataReceived = Serial.readStringUntil('\n');
    deserializeJson(json, dataReceived);
    rBright = json["r"];
    gBright = json["g"];
    bBright = json["b"];
    updateColor();
    // serializeJson(json, Serial);
  }
}

void updateColor() {
  analogWrite(GREEN_LED, 255 - gBright);
  analogWrite(RED_LED, 255 - rBright);
  analogWrite(BLUE_LED, 255 - bBright);
}
