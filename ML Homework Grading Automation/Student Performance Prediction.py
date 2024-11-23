import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor

# Load the dataset
file_path = "homework_completion_data_with_new_features.csv"
df = pd.read_csv(file_path)

# Features and target variable
X = df.drop("CompletionTime", axis=1)  # Features
y = df["CompletionTime"]  # Target variable

# 1. Data Preprocessing Pipeline
# List of categorical features
categorical_features = ['HomeworkType', 'Difficulty', 'Subject', 'SubmissionUrgency', 'ResourcesProvided']

# Numerical features
numerical_features = ['Length', 'StudyHours', 'PreviousCompletionTime', 'StudentFocusLevel', 'TeacherClarity']

# Preprocessing steps for categorical features (OneHotEncoding)
categorical_transformer = OneHotEncoder(drop='first')

# Preprocessing steps for numerical features (StandardScaler)
numerical_transformer = StandardScaler()

# Combine both into a ColumnTransformer
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# 2. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Model Pipeline
# You can try Linear Regression or RandomForestRegressor
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))  # Using Random Forest for better accuracy
])

# Train the model
model.fit(X_train, y_train)

# 4. Make predictions on the test set
y_pred = model.predict(X_test)

# 5. Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse}")
print(f"R2 Score: {r2}")

# 6. Visualize the results
# Plotting Actual vs Predicted values
plt.figure(figsize=(8, 6))
sns.scatterplot(x=y_test, y=y_pred)
plt.xlabel("Actual Completion Time")
plt.ylabel("Predicted Completion Time")
plt.title("Actual vs Predicted Completion Time")
plt.show()

# Plotting residuals
residuals = y_test - y_pred
plt.figure(figsize=(8, 6))
sns.histplot(residuals, kde=True)
plt.xlabel("Residuals")
plt.title("Residuals Distribution")
plt.show()

# Feature importance plot (only relevant for tree-based models like RandomForest)
if isinstance(model.named_steps['regressor'], RandomForestRegressor):
    feature_importance = model.named_steps['regressor'].feature_importances_
    feature_names = numerical_features + list(
        model.named_steps['preprocessor'].transformers_[1][1].get_feature_names_out())

    # Create a DataFrame for better visualization
    importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': feature_importance})
    importance_df = importance_df.sort_values(by='Importance', ascending=False)

    # Plotting feature importance
    plt.figure(figsize=(10, 6))
    sns.barplot(x='Importance', y='Feature', data=importance_df)
    plt.title('Feature Importance')
    plt.show()
