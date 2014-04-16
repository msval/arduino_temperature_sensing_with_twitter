#include <math.h>
#include <VirtualWire.h>

void setup() {
  vw_set_tx_pin(12);
  vw_setup(2000);
}

double Thermister(int RawADC) {
  double Temp;
  Temp = log(((10240000/RawADC) - 10000));
  Temp = 1 / (0.001129148 + (0.000234125 * Temp) + (0.0000000876741 * Temp * Temp * Temp));
  Temp = Temp - 273.15;
  return Temp;
}

void loop(void) {
  double temp = Thermister(analogRead(0));
  double lightLevel = (analogRead(1) / 1024.0) * 100;
  double moistureLevel = 100 - ((analogRead(2) / 1024.0) * 100);
  
  char sTemp[6] = { '\0' };
  dtostrf(temp, 5, 2, sTemp);
  
  char sLight[6] = { '\0' };
  dtostrf(lightLevel, 2, 0, sLight);
  
  char sMoist[6] = { '\0' };
  dtostrf(moistureLevel, 2, 0, sMoist);
  
  char sOut[200] = { '\0' };
  sprintf(sOut, "%s,%s,%s", deblank(sTemp), deblank(sLight), deblank(sMoist));
  
  vw_send((uint8_t *)sOut, strlen(sOut));
  vw_wait_tx();
  
  delay(1000);
}

char* deblank(char* input) {
  char *output=input;
  int i = 0;
  int j = 0;
  for (; i<strlen(input); i++,j++) {
      if (input[i] != ' ') {                                                  
          output[j]=input[i];
      } else {
          j--;
      }
  }
  output[j]='\0';
  return output;
}
