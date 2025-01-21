from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_socketio import SocketIO
from flask_cors import CORS
app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sensor_data.db'
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

# Initialize the database
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/sensor-data', methods=['POST'])
def receive_data():
    data = request.json
    if data:
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Write to CSV
        with open('sensor_data.csv', 'a') as file:
            file.write(f"{timestamp},{data['temperature']},{data['humidity']},{data['soil_moisture']}\n")
        
        # Write to Database
        new_entry = SensorData(
            timestamp=datetime.datetime.now(),
            temperature=data['temperature'],
            humidity=data['humidity'],
            soil_moisture=data['soil_moisture']
        )
        db.session.add(new_entry)
        db.session.commit()
        socketio.emit('update', {
            'temperature': data['temperature'],
            'humidity': data['humidity'],
            'soil_moisture': data['soil_moisture']
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
            "soil_moisture": record.soil_moisture
        } for record in records
    ])

CORS(app) 
@socketio.on('connect')
def handle_connect():
    print("Client connected")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
