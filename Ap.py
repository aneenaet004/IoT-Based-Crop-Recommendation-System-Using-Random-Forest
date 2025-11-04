import os
import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

app = Flask(__name__)
CORS(app)

# 🌦️ OpenWeather API Key
API_KEY = "c8c5592102f8c1c4c614d0b0065617d0"

# 📁 Paths
DATA_PATH = r"D:\mini_project Sem-6\crop-prediction\Crop_recommendation (1).csv"
RAINFALL_PATH = r"D:\mini_project Sem-6\crop-prediction\rainfall.csv"
MODEL_PATH = "crop_model.pkl"

# 📄 Feature columns
feature_order = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

# 📊 Load data
df = pd.read_csv(DATA_PATH)
rainfall_df = pd.read_csv(RAINFALL_PATH)

# 🌧️ Get average monthly rainfall for a district
def get_annual_rainfall(city):
    city_data = rainfall_df[rainfall_df['DISTRICT'].str.lower() == city.lower()]
    if not city_data.empty:
        return round(float(city_data['ANNUAL'].values[0]) / 12, 2)
    return 0.0

# 🧠 Train and save model
def train_and_save_model():
    X = df[feature_order]
    y = df['label']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    print(f"Training Accuracy: {model.score(X_train, y_train):.2%}")
    print(f"Test Accuracy: {model.score(X_test, y_test):.2%}")

    # 📉 Confusion matrix
    y_pred = model.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(10, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap="Blues",
                xticklabels=model.classes_, yticklabels=model.classes_)
    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.show()

    joblib.dump(model, MODEL_PATH)
    return model

# 🔁 Load or train model
if not os.path.exists(MODEL_PATH):
    model = train_and_save_model()
else:
    model = joblib.load(MODEL_PATH)

# 🔮 Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("Received data:", data)

        # Validate input
        if not all(key in data for key in feature_order):
            return jsonify({"error": "Missing input values"}), 400

        input_features = [float(data[feature]) for feature in feature_order]
        probabilities = model.predict_proba([input_features])[0]

        # Return all probabilities, sorted
        result = [
            {"crop": model.classes_[i], "probability": round(float(probabilities[i]), 4)}
            for i in range(len(probabilities))
        ]
        result.sort(key=lambda x: x["probability"], reverse=True)

        print("Prediction result:", [crop for crop in result if crop["probability"] > 0.50])  # Show crops with probability > 0.50
        return jsonify({'high_prob_crops': result[:5]})

    except Exception as e:
        print("Error in prediction:", str(e))
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

# 🌦️ Weather endpoint
@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    try:
        response = requests.get(url)
        data = response.json()

        if data.get("cod") != 200:
            return jsonify({"error": data.get("message", "Unknown error")}), 400

        weather_data = {
            "temperature": float(data["main"]["temp"]),
            "humidity": float(data["main"]["humidity"]),
            "rainfall": get_annual_rainfall(city),
            "city": data["name"]
        }
        return jsonify(weather_data)

    except Exception as e:
        print("Error fetching weather:", str(e))
        return jsonify({"error": str(e)}), 500

# ▶️ Run server
if __name__ == '__main__':
    app.run(debug=True, port=5000)
