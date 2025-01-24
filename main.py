from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_socketio import SocketIO
from flask_cors import CORS
import os
import pytz
from dotenv import load_dotenv
from sqlalchemy.types import TypeDecorator, DateTime
import csv
from flask import Response

load_dotenv()

app = Flask(__name__)

# Timezone configuration
MALAYSIA_TZ = pytz.timezone('Asia/Kuala_Lumpur')

class TimestampTZ(TypeDecorator):
    impl = DateTime
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            value = datetime.datetime.now(MALAYSIA_TZ)
        return value.astimezone(pytz.UTC)

# Database configuration
database_url = os.getenv('DATABASE_URL').replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'connect_args': {
        'options': '-c timezone=Asia/Kuala_Lumpur'
    }
}

db = SQLAlchemy(app)
socketio = SocketIO(app)

# Database model
class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(TimestampTZ, default=lambda: datetime.datetime.now(MALAYSIA_TZ))
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
        timestamp = datetime.datetime.now(MALAYSIA_TZ)
        
        # Check for abnormalities
        is_abnormal = (
            data['temperature'] < 20 or data['temperature'] > 50 or
            data['humidity'] < 30 or data['humidity'] > 90 or
            data['soil_moisture'] < 5 or data['soil_moisture'] > 95
        )
        
        # Write to Database
        new_entry = SensorData(
            timestamp=timestamp,
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
        
        if is_abnormal:
            socketio.emit('notification', {
                'message': 'Abnormal data detected!',
                'data': {
                    'temperature': data['temperature'],
                    'humidity': data['humidity'],
                    'soil_moisture': data['soil_moisture'],
                    'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S')
                }
            })

        return jsonify({"message": "Data received successfully"}), 200
    return jsonify({"message": "Invalid data"}), 400

@app.route('/history', methods=['GET'])
def get_history():
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

@app.route('/download-csv', methods=['GET'])
def download_csv():
    # Query all data from the SensorData table
    records = SensorData.query.order_by(SensorData.timestamp.desc()).all()
    
    # Create a list of rows to be written to the CSV
    csv_data = [
        ["timestamp", "temperature", "humidity", "soil_moisture"]  # CSV headers
    ]
    
    for record in records:
        csv_data.append([
            record.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            record.temperature,
            record.humidity,
            record.soil_moisture
        ])
    
    # Create a CSV response
    def generate_csv():
        for row in csv_data:
            yield ','.join(map(str, row)) + '\n'
    
    response = Response(generate_csv(), mimetype='text/csv')
    response.headers.set("Content-Disposition", "attachment", filename="sensor_data.csv")
    return response


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