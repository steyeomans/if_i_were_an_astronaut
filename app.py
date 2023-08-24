from flask import Flask, render_template, request, jsonify
from joblib import load

app = Flask(__name__)
tpot = load('tpot.joblib')

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate_mission_time():
    data = request.json
    print(data)
    mission_time = calculate_mission_time_function(data)
    print(mission_time)
    return jsonify({"mission_time": mission_time})

def calculate_mission_time_function(data):
    new_record = []
    if data['gender'] == 'Male':
        new_record.append(1)
    else:
        new_record.append(0)
    new_record.append(int(data['yearOfBirth']))
    new_record.append(int(data['yearOfBirth'])+int(data['ageWhenAstronaut']))
    if data['homeCountry'] == 'USA':
        new_record += [1,0]
    elif data['homeCountry'] == 'Russia':
        new_record += [0,1]
    else:
        new_record += [0,0]
    print(new_record)
    prediction = tpot.predict([new_record,])
    hours = prediction[0]
    days = hours/24
    days_formatted = "{:.1f}".format(days)
    return days_formatted

#if __name__ == '__main__':
#    app.run(debug=True)
