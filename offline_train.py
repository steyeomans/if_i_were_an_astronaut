import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from tpot import TPOTRegressor
from joblib import dump

# Load the CSV file
df = pd.read_csv('astronauts.csv')

# Grouping and aggregation
grouped = (df
    .groupby(['name', 'sex', 'year_of_birth', 'nationality', 'year_of_selection'])
    .agg({'hours_mission': 'sum'})
    .reset_index()
)
grouped['is_USA'] = np.where(grouped['nationality'] == 'U.S.', 1, 0)
grouped['is_russia'] = np.where(grouped['nationality'] == 'U.S.S.R/Russia', 1, 0)
grouped['is_male'] = np.where(grouped['sex'] == 'male', 1, 0)
grouped['age'] = grouped['year_of_selection'] - grouped['year_of_birth']

# Prepare data for regression
X = grouped[['is_male', 'year_of_birth', 'age', 'is_USA', 'is_russia']]
y = grouped['hours_mission']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and run TPOTRegressor
tpot = TPOTRegressor(generations=5, population_size=20, verbosity=2, random_state=42, n_jobs=-2, scoring='r2')
tpot.fit(X_train, y_train)

# Evaluate the best pipeline on the test set
r2 = tpot.score(X_test, y_test)
print(f"TPOT R2: {r2}")

# Export the best pipeline if desired
#tpot.export('best_pipeline.py')
dump(tpot.fitted_pipeline_,'tpot.joblib')
print(tpot.fitted_pipeline_.score(X,y))