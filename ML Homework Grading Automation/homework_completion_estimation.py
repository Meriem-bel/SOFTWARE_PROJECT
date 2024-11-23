import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import joblib
from flask import Flask, request, jsonify
from sklearn.preprocessing import LabelEncoder

# Load the dataset
file_path = "homework_completion_data_with_new_features.csv"
df = pd.read_csv(file_path)

# Features and target variable
X = df[['StudyHours', 'Difficulty']]  # Features: Study hours and difficulty level
y = df['CompletionTime']  # Target: Completion time

# Check for missing values
print(df.isnull().sum())
#drop rows with missing values
df = df.dropna()
# Encode the 'Difficulty' column as it is categorical
label_encoder = LabelEncoder()
X['Difficulty'] = label_encoder.fit_transform(X['Difficulty'])

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model (Linear Regression)
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f'Mean Squared Error: {mse}')
print(f'Coefficients: {model.coef_}')
print(f'Intercept: {model.intercept_}')

# Save the trained model to a file
joblib.dump(model, 'homework_model.pkl')

# Flask API to serve the model
app = Flask(__name__)

# Load the trained model
model = joblib.load('homework_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    # Get input data from POST request (study_time and homework_complexity)
    data = request.get_json(force=True)
    study_time = data['study_time']
    homework_complexity = data['homework_complexity']

    # Make a prediction using the model
    prediction = model.predict([[study_time, homework_complexity]])

    return jsonify({'predicted_time': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
