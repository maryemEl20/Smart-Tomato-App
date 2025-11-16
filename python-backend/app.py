from flask import Flask, jsonify
from flask_cors import CORS  
import joblib
from firebase_config import get_latest_sensor_data

app = Flask(__name__)
CORS(app)  

# Charger les modèles
models = {
    "Irrigation_Label": joblib.load("models/tree_Irrigation_Label.pkl"),
    "Fertilisation_Label": joblib.load("models/tree_Fertilisation_Label.pkl"),
    "Harvest_Label": joblib.load("models/tree_Harvest_Label.pkl")
}

features = ['Temperature', 'Humidity', 'pH', 'Soil_Moisture_%']

@app.route('/predict', methods=['GET'])
def predict():
    data = get_latest_sensor_data()
    if not data:
        return jsonify({"error": "Pas de données disponibles"}), 404

    # Extraire les valeurs nécessaires
    X = [[
        float(data['temperature']),
        float(data['humidity']),
        float(data.get('pH', 6.5)),  # valeur par défaut si pH absent
        float(data['soil_moisture'])
    ]]

    result = {}
    for label, model in models.items():
        pred = model.predict(X)[0]
        result[label] = int(pred)

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
