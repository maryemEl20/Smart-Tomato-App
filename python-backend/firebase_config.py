import firebase_admin
from firebase_admin import credentials, db

# 1) Chemin vers votre clé de service (serviceAccountKey.json)
cred = credentials.Certificate("data/serviceAccountKey.json")

# 2) Initialiser Firebase Admin avec la base de données
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://big-data-73eb7-default-rtdb.firebaseio.com/'
})

# 3) Fonction pour récupérer les dernières données
def get_latest_sensor_data():
    ref = db.reference('capteurs')
    data = ref.get()
    if not data:
        return None
    latest_key = sorted(data.keys())[-1]  # prend la dernière entrée
    return data[latest_key]
