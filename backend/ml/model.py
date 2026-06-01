import os
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
import sys
import json
# https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html#sklearn.linear_model.LogisticRegression.predict_proba

try: 
  # data = pd.read_csv("../data.csv") #uncomment this if youre running the python file itself
 # data = pd.read_csv("data.csv") #uncomment this if youre running via express

  current_dir = os.path.dirname(os.path.abspath(__file__))
  data_path = os.path.join(current_dir, "data.csv")
  data = pd.read_csv(data_path)
    
except:
  print(json.dumps({
    "error": True, 
    "errorMessage": "Error reading dataset"
  }))
  sys.exit(1)

input_data = data[["is_cold", "has_outerwear", "heavy_items_count", "is_formal","formality_match", "time_since_last_worn"]].values
classification_data = data['liked']

model = LogisticRegression()
model.fit(input_data, classification_data)

# Receives an  outfits from Express as one JSON string.
# we will scores each outfit and returns the best one.

if len(sys.argv) == 2:
  res = {
    "error": False,
    "errorMessage": "",
    "best_outfit": None,
    "all_scored_outfits": []
  }

  try:
    outfits = json.loads(sys.argv[1])

    for outfit in outfits:
      features = np.array([[
        int(outfit["is_cold"]),
        int(outfit["has_outerwear"]),
        int(outfit["heavy_items_count"]),
        int(outfit["is_formal"]),
        int(outfit["formality_match"]),
        int(outfit["time_since_last_worn"])
      ]])

      probability_liked = model.predict_proba(features)[0][1]

      outfit["ml_score"] = round(float(probability_liked), 2)
      res["all_scored_outfits"].append(outfit)

    res["all_scored_outfits"].sort(
      key=lambda outfit: outfit["ml_score"],
      reverse=True
    )

    res["best_outfit"] = res["all_scored_outfits"][0]

  except Exception as e:
    res["error"] = True
    res["errorMessage"] = str(e)

  print(json.dumps(res))

else:
  print(json.dumps({
    "error": True,
    "errorMessage": "Expected 1 JSON argument containing an array of outfits"
  }))