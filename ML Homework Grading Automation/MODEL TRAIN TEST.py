# Import necessary libraries
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Load the dataset
uploaded_file_path = "homework_grading_data_expanded.csv"
df = pd.read_csv(uploaded_file_path)

# Step 1: Data Cleaning
# Check for missing values and duplicates
missing_values = df.isnull().sum()
duplicates_removed = df.duplicated().sum()
df = df.drop_duplicates()

# Step 2: Feature Selection and Preprocessing
# Define features (X) and target (y)
X = df.drop(columns=["Grade"])
y = df["Grade"]

# Define categorical and numerical columns for preprocessing
categorical_columns = ["QuestionType", "Subject", "Difficulty"]
numerical_columns = ["AnswerLength", "TimeTaken", "Correctness"]

# Preprocessing pipeline
categorical_preprocessor = OneHotEncoder(drop="first", sparse_output=False)

numerical_preprocessor = StandardScaler()

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", categorical_preprocessor, categorical_columns),
        ("num", numerical_preprocessor, numerical_columns),
    ]
)

# Step 3: Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Model Training
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", LinearRegression())
])

model.fit(X_train, y_train)

# Step 5: Model Testing and Validation
# Predict on test data
y_pred = model.predict(X_test)

# Evaluate performance
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

# Display results
print("=== Data Cleaning Results ===")
print(f"Missing Values:\n{missing_values}")
print(f"Number of Duplicates Removed: {duplicates_removed}")

print("\n=== Model Evaluation ===")
print(f"Mean Squared Error (MSE): {mse:.4f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
print(f"R² Score: {r2:.4f}")



# === Visualizations ===

# 1. Scatter Plot: Correctness vs Grade
plt.figure(figsize=(8, 6))
plt.scatter(df["Correctness"], df["Grade"], alpha=0.5, color="blue")
plt.title("Correctness vs Grade")
plt.xlabel("Correctness (%)")
plt.ylabel("Grade")
plt.grid(True)
plt.show()

# 2. Predicted vs Actual Grades
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, alpha=0.6, color="green")
plt.title("Predicted vs Actual Grades")
plt.xlabel("Actual Grades")
plt.ylabel("Predicted Grades")
plt.plot([y.min(), y.max()], [y.min(), y.max()], color="red", linestyle="--", linewidth=2)
plt.grid(True)
plt.show()

# 3. Distribution of Prediction Errors
errors = y_test - y_pred
plt.figure(figsize=(8, 6))
plt.hist(errors, bins=20, color="purple", alpha=0.7)
plt.title("Distribution of Prediction Errors")
plt.xlabel("Prediction Error")
plt.ylabel("Frequency")
plt.grid(True)
plt.show()


import joblib

# Save the model pipeline
joblib.dump(model, "homework_grading_model.pkl")


