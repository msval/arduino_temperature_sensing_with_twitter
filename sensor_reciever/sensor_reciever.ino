#include <VirtualWire.h>

byte message[VW_MAX_MESSAGE_LEN];
byte messageLength = VW_MAX_MESSAGE_LEN;

void setup() {
  Serial.begin(9600);
  Serial.println("Device is ready");
  vw_setup(2000);
  vw_rx_start();
}

void loop() {
  if (vw_get_message(message, &messageLength)) {
    for (int i = 0; i < messageLength; i++) {
      Serial.write(message[i]);
    }
    Serial.println();
  }
}
