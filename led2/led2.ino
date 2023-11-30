#include <WiFi.h>
#include <PubSubClient.h>
#include <LiquidCrystal_I2C.h>

#define ssid "GIA LINh T1"
#define password "25112007"
#define mqttServer "broker.mqttdashboard.com"
#define mqttPort 1883
#define mqttUser "thuy"
#define mqttPassword "123456"
#define mqttTopic "sensorData"

WiFiClient espClient;
PubSubClient client(espClient);

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void callback(String topic, byte* payload, unsigned int length) {
  Serial.println("Message arrived in topic: " + String(topic));

  // Handle received message here
  // Convert payload to string if necessary
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  // Display received message on LCD
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Tem Hum Lux CO2");
  lcd.setCursor(0, 1);
  lcd.print(message);
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("Connected to MQTT broker");
      client.subscribe(mqttTopic);
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Trying again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  lcd.init();
  lcd.backlight();

  setup_wifi();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
