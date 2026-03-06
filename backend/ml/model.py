import numpy as np
from sklearn.linear_model import LogisticRegression
# https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html#sklearn.linear_model.LogisticRegression.predict_proba

#[is_cold, has_outerwear, num_heavy_items, formality_match]
data = np.array([
  [1, 1, 2, 1],
  [1, 0, 0, 1],
  [0, 0, 0, 1],
  [0, 1, 1, 0],
])

# 1 = Liked, 0 = Disliked
classification = np.array([1, 0, 1, 0]) 

model = LogisticRegression()
model.fit(data, classification)

new_outfit = np.array([[1, 1, 1, 1]])
probability_liked = model.predict_proba(new_outfit)[0][1]

print(f"Probability the user will like this outfit: {probability_liked}")

# suggestions for more features so the model is better. Add 'Item Fatigue' and/or 'Preference'