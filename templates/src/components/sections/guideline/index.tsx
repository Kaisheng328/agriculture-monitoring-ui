import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';


const UserGuide = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const steps = [
        {
            label: 'Account Setup',
            description: 'Create an account for your microcontroller',
            content: (
                <Box>
                    <Typography paragraph>
                        Before you can start collecting data, you need to create an account for your microcontroller.
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step-by-step:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', mb: 2, overflowX: 'auto' }}>
                        <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {`Navigate to the registration page by clicking on "Sign Up"

Fill in the required information:
    Username (e.g., "your-username")
    Password (e.g., "your-password")
    Email address (e.g., "example@gmail.com")
    Log in with your newly created credentials            
`}
                        </Typography>
                    </Paper>

                    <Alert severity="info" sx={{ mb: 2 }}>
                        Keep your credentials secure. You'll need them to configure your microcontroller.
                    </Alert>
                </Box>
            )
        },
        {
            label: 'Microcontroller Configuration',
            description: 'Update your microcontroller code to authenticate with the system',
            content: (
                <Box>
                    <Typography paragraph>
                        Now that you have an account, you need to update your microcontroller code to authenticate with our system.
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Add the following code to your microcontroller:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', mb: 2, overflowX: 'auto' }}>
                        <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {`#define LOGIN_URL "your-backend-url/login"
String jwtToken = ""; 

void loginAndGetToken() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(LOGIN_URL);
    http.addHeader("Content-Type", "application/json");

    String loginPayload = "{\\"username\\": \\"your-username\\", \\"password\\": \\"your-password\\"}";
    int httpResponseCode = http.POST(loginPayload);

    if (httpResponseCode == 200) {
      String response = http.getString();
      Serial.println("✅ Login successful: " + response);

      // Parse JSON to extract the token
      DynamicJsonDocument doc(512);
      deserializeJson(doc, response);
      jwtToken = doc["token"].as<String>(); // Store token
    } else {
      Serial.println("❌ Login failed: " + String(httpResponseCode));
    }
    http.end();
  }
}
`}
                        </Typography>
                    </Paper>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Make sure to replace the username and password with your own credentials.
                    </Alert>
                </Box>
            )
        },
        {
            label: 'Wi-Fi Connectivity Check',
            description: 'Ensure your microcontroller has proper internet connectivity',
            content: (
                <Box>
                    <Typography paragraph>
                        Before starting measurements, you need to ensure your microcontroller has stable internet connectivity.
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Wi-Fi Connectivity Check:
                    </Typography>
                    <Typography component="div" variant="body2">
                        <ol>
                            <li>Add the following code to test Wi-Fi connectivity:</li>
                        </ol>
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', mb: 2, overflowX: 'auto' }}>
                        <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {`#include <WiFi.h>
#define WIFI_SSID "wifi-ssid"
#define WIFI_PASSWORD "wifi-password"

// Wi-Fi connection check
void checkWiFiConnection() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost. Reconnecting...");
    WiFi.begin(ssid, password);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
      delay(500);
      Serial.print(".");
      attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\\nWiFi reconnected");
      Serial.print("IP address: ");
      Serial.println(WiFi.localIP());
    } else {
      Serial.println("\\nFailed to reconnect to WiFi");
    }
  }
}`}
                        </Typography>
                    </Paper>
                    <Typography component="div" variant="body2">
                        <ol start={2}>
                            <li>Call this function before each sensor reading or data upload</li>
                            <li>Monitor the serial output to ensure connectivity</li>
                        </ol>
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        For reliable data collection, place your microcontroller in an area with strong Wi-Fi signal.
                    </Alert>
                </Box>
            )
        },
        {
            label: 'Data Collection',
            description: 'Configure your microcontroller to take sensor readings',
            content: (
                <Box>
                    <Typography paragraph>
                        Now your microcontroller is ready to collect data. Configure it to take readings regularly over a period of one month.
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Sensor Reading Configuration:
                    </Typography>
                    <Typography component="div" variant="body2">
                        <ol>
                            <li>Set up a timer to collect readings at regular intervals:</li>
                        </ol>
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', mb: 2, overflowX: 'auto' }}>
                        <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {`// Set up timer for readings
unsigned long lastRestartMillis = 0;
unsigned long previousMillis = 0;
const long interval = 600000;

void checkRestartCondition() {
  const unsigned long restartInterval = 3610000; // 1 hour in milliseconds

  if ((unsigned long)(millis() - lastRestartMillis) >= restartInterval) {
    lastRestartMillis = millis();
    restartDevice();
  }
}

void loop() {
  unsigned long currentMillis = millis();

  if ((unsigned long)(currentMillis - previousMillis) >= interval) {
    previousMillis = currentMillis;
    sendSensorData();
  }

  checkRestartCondition(); // Restart every 24 hours
}`}
                        </Typography>
                    </Paper>
                    <Typography component="div" variant="body2">
                        <ol start={2}>
                            <li>Create a function to send data to the server:</li>
                        </ol>
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', mb: 2, overflowX: 'auto' }}>
                        <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {`#include <HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#define DATA_URL "your-backend-url/sensor-data"
#define DHTPIN 4          // Pin connected to the DHT22 sensor
#define DHTTYPE DHT22     // Specify the sensor type (DHT22)
#define SOIL_PIN 32       // Pin connected to the soil moisture sensor (analog)
DHT dht(DHTPIN, DHTTYPE);

void sendSensorData() {
  float humidity = dht.readHumidity();   // Example sensor value
  float temperature = dht.readTemperature();
  int soilValue = analogRead(SOIL_PIN);
  float soilMoisturePercent = (100.0 * (4095 - soilValue)) / 4095.0;
  if (WiFi.status() == WL_CONNECTED && jwtToken != "") {
    HTTPClient http;
    http.begin(DATA_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + jwtToken); // Add token in header
    Serial.println("soil value in analog: " + String(soilValue));
    String jsonPayload = "{ \\"temperature\\": " + String(temperature) +
                         ", \\"humidity\\": " + String(humidity) +
                         ", \\"soil_moisture\\": " + String(soilMoisturePercent) + "}";
    Serial.println("Data: " + String(jsonPayload));
    int httpResponseCode = http.POST(jsonPayload);
    if (httpResponseCode > 0) {
      Serial.println("✅ Data sent successfully");
      Serial.println("Server Response: " + http.getString());
    } else {
      Serial.println("❌ Error sending data: " + String(httpResponseCode));
    }
    http.end();
  }
}`}
                        </Typography>
                    </Paper>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Consistency is key. Make sure your microcontroller stays powered and connected throughout the data collection period.
                    </Alert>
                </Box>
            )
        },
        {
            label: 'Data Export',
            description: 'Download your collected data as a CSV file',
            content: (
                <Box>
                    <Typography paragraph>
                        After collecting data for one month, you can download your dataset as a CSV file for training your AI model.
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Download Instructions:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', mb: 2, overflowX: 'auto' }}>
                        <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {`Log in to your account on the web interface
Navigate to the "Sensor Reading Table" page
Use the date filters to select your one-month data collection period
Click the "Download CSV" button in the top right corner
Save the file to your computer
`}
                        </Typography>
                    </Paper>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        The CSV file contains timestamps and all sensor readings. Make sure to verify the data quality before using it for training.
                    </Alert>
                </Box>
            )
        },
        {
            label: 'AI Model Training',
            description: 'Train your own AI model using the collected data',
            content: (
                <Box>
                    <Typography paragraph>
                        Now that you have your dataset, you can train your own AI model to make predictions based on your sensor readings.
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Sample Code for Model Training:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', mb: 2, overflowX: 'auto' }}>
                        <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
from google.colab import files

# Upload CSV file
uploaded = files.upload()
# Load dataset
df = pd.read_csv("sensor_data.csv")

# Convert timestamp to datetime format
df["timestamp"] = pd.to_datetime(df["timestamp"])

# Create time-based features
df["timestamp_numeric"] = df["timestamp"].apply(lambda x: x.timestamp())
df["hour"] = df["timestamp"].dt.hour
df["dayofweek"] = df["timestamp"].dt.dayofweek

# Calculate the rate of change (delta) for soil moisture
df["soil_moisture_change"] = df["soil_moisture"].diff().fillna(0)

# Flag watering events (sudden increase in soil moisture > 10%)
df["watering_event"] = (df["soil_moisture_change"] > 10).astype(int)

# Select features and target
X = df[["temperature", "humidity", "timestamp_numeric", "soil_moisture_change", "hour", "dayofweek", "watering_event"]]
y = df["soil_moisture"]

# Train-test split (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save scaler for later use
joblib.dump(scaler, "soil_scaler.pkl")

# Train a Random Forest model with tuning
rf_model = RandomForestRegressor(n_estimators=300, max_depth=20, min_samples_split=5, random_state=42)
rf_model.fit(X_train_scaled, y_train)

# Evaluate the model
y_pred_rf = rf_model.predict(X_test_scaled)

mae_rf = mean_absolute_error(y_test, y_pred_rf)
mse_rf = mean_squared_error(y_test, y_pred_rf)
r2_rf = r2_score(y_test, y_pred_rf)

print(f"Random Forest Performance:\n MAE: {mae_rf:.3f}\n MSE: {mse_rf:.3f}\n R²: {r2_rf:.3f}")

# Save the model
joblib.dump(rf_model, "soil_moisture_model.pkl")

# Visualize the results
plt.scatter(y_test, y_pred_rf, color='blue', alpha=0.5)
plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], color='red', linestyle='dashed')
plt.xlabel("Actual Soil Moisture")
plt.ylabel("Predicted Soil Moisture")
plt.title("Actual vs Predicted Soil Moisture (Enhanced)")
plt.show()

from google.colab import files
files.download("/content/soil_moisture_model.pkl")   # Download PKL file
files.download("/content/soil_scaler.pkl")
`}
                        </Typography>
                    </Paper>
                    <Typography paragraph>
                        This is a basic example using a Random Forest Regressor. You may need to adjust the model and features based on your specific requirements.
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Remember to normalize your data and handle any missing values before training your model.
                    </Alert>
                </Box>
            )
        },
        {
            label: 'Plant Selection',
            description: 'Use your AI model to select optimal plants',
            content: (
                <Box>
                    <Typography paragraph>
                        With your trained AI model, you can now use the plant selection feature to determine the best plants for your conditions.
                    </Typography>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Using Your Model for Plant Selection:
                            </Typography>
                            <Typography component="div" variant="body2">
                                <ol>
                                    <li>Load your trained model:</li>
                                </ol>
                            </Typography>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', mb: 2, overflowX: 'auto' }}>
                                <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                    {`import joblib
import pandas as pd

# Load your trained model
model = joblib.load('plant_health_model.joblib')

# Load plant database
plants_db = pd.read_csv('plants_database.csv')

# Current environmental conditions
current_conditions = {
    'temperature': 25.5,
    'humidity': 65.0,
    'soil_moisture': 0.4,
    'light_level': 0.8
}

# Predict plant health scores for all plants
plants_db['predicted_health'] = model.predict(
    plants_db[['optimal_temp', 'optimal_humidity', 'water_needs', 'light_needs']]
)

# Sort by predicted health score
recommended_plants = plants_db.sort_values('predicted_health', ascending=False)

# Display top 5 recommended plants
print(recommended_plants[['name', 'type', 'predicted_health']].head(5))`}
                                </Typography>
                            </Paper>
                            <Typography paragraph>
                                This code will help you identify which plants are likely to thrive in your specific environmental conditions.
                            </Typography>
                       
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Congratulations! You've completed the entire process from data collection to making predictions with your own AI model.
                    </Alert>
                </Box>
            )
        }
    ];

    return (
        <Paper sx={{ px: 3, py: 3, height: "auto", borderRadius: 3 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                mb={3}
                spacing={1.5}
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="body1" color="text.secondary">
                    Follow these steps to set up your microcontroller for data collection and AI model training
                </Typography>
            </Stack>

            <Divider sx={{ mb: 1 }} />

            <Box>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel>
                                <Typography variant="h6">{step.label}</Typography>
                                <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                            </StepLabel>
                            <StepContent>
                                {step.content}
                                <Box sx={{ mb: 2 }}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                        </Button>
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>All steps completed - you're finished</Typography>
                        <Button  variant="contained" onClick={handleReset}>
                            Start Over
                        </Button>
                    </Paper>
                )}
            </Box>
        </Paper>
    );
};

export default UserGuide;