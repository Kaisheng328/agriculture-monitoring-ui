from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_socketio import SocketIO
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

# Database configuration
database_url = os.getenv('DATABASE_URL').replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sensor_data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
socketio = SocketIO(app)
# Database model
class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.now)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    soil_moisture = db.Column(db.Float, nullable=False)
    is_abnormal = db.Column(db.Boolean, default=False)

# Initialize the database
with app.app_context():
    db.create_all()


@app.route('/sensor-data', methods=['POST'])
def receive_data():
    data = request.json
    if data:
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # Check for abnormalities
        is_abnormal = False
        if data['temperature'] < 20 or data['temperature'] > 50:
            is_abnormal = True
        if data['humidity'] < 30 or data['humidity'] > 90:
            is_abnormal = True
        if data['soil_moisture'] < 5 or data['soil_moisture'] > 95:
            is_abnormal = True

        # Write to CSV
        with open('sensor_data.csv', 'a') as file:
            file.write(f"{timestamp},{data['temperature']},{data['humidity']},{data['soil_moisture']},{is_abnormal}\n")
        
        # Write to Database
        new_entry = SensorData(
            timestamp=datetime.datetime.now(),
            temperature=data['temperature'],
            humidity=data['humidity'],
            soil_moisture=data['soil_moisture'],
            is_abnormal=is_abnormal
        )
        db.session.add(new_entry)
        db.session.commit()
        socketio.emit('update', {
            'temperature': data['temperature'],
            'humidity': data['humidity'],
            'soil_moisture': data['soil_moisture'],
            'is_abnormal': is_abnormal
        })
        # Increment abnormal count if necessary
        if is_abnormal:
            socketio.emit('notification', {
                'message': 'Abnormal data detected!',
                'data': {
                    'temperature': data['temperature'],
                    'humidity': data['humidity'],
                    'soil_moisture': data['soil_moisture'],
                    'timestamp': timestamp
                }
            })

        return jsonify({"message": "Data received successfully"}), 200
    return jsonify({"message": "Invalid data"}), 400

@app.route('/history', methods=['GET'])
def get_history():
    # Fetch data from the database
    records = SensorData.query.order_by(SensorData.timestamp.desc()).all()
    return jsonify([
        {
            "id": record.id,
            "timestamp": record.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "temperature": record.temperature,
            "humidity": record.humidity,
            "soil_moisture": record.soil_moisture,
            "is_abnormal": record.is_abnormal
        } for record in records
    ])

@app.route('/abnormal-count', methods=['GET'])
def get_abnormal_count():
    count = SensorData.query.filter_by(is_abnormal=True).count()
    return jsonify({"count": count})

@app.route('/abnormal-history', methods=['GET'])
def get_abnormal_history():
    records = SensorData.query.filter_by(is_abnormal=True).order_by(SensorData.timestamp.desc()).all()
    return jsonify([
        {
            "timestamp": record.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "type": get_abnormal_type(record),
        } for record in records
    ])

def get_abnormal_type(record):
    if record.temperature < 20 or record.temperature > 50:
        return "Temperature"
    if record.humidity < 30 or record.humidity > 90:
        return "Humidity"
    if record.soil_moisture < 5 or record.soil_moisture > 95:
        return "Soil Moisture"
    return "Unknown"

CORS(app) 
@socketio.on('connect')
def handle_connect():
    print("Client connected")

if __name__ == '__main__':
   port = int(os.environ.get("PORT", 8080))
   app.run(host='0.0.0.0', port=port)
