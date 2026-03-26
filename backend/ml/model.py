import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
import sys
import json
# https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html#sklearn.linear_model.LogisticRegression.predict_proba

try: 
  # data = pd.read_csv("../data.csv") #uncomment this if youre running the python file itself
  data = pd.read_csv("data.csv") #uncomment this if youre running via express
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

#Recieves data from express and returns it as a JSON
#we will be using command line arguments to pass data from express to python
if len(sys.argv) == 7:
  res = {
    "result": 0,
    "error": False, 
    "errorMessage": "",
  }
  
  try:
    is_cold = int(sys.argv[1])
    has_outerwear = int(sys.argv[2])
    heavy_items_count = int(sys.argv[3])
    is_formal = int(sys.argv[4])
    formality_match = int(sys.argv[5])
    time_since_last_worn = int(sys.argv[6])
    
    outfit = np.array([[is_cold, has_outerwear, heavy_items_count, is_formal, formality_match, time_since_last_worn]])
    probability_liked = model.predict_proba(outfit)[0][1]

    res["result"] = probability_liked
  except Exception as e:
    res["error"] = True
    res["errorMessage"] = str(e)

  print(json.dumps(res))

else: 
  print(json.dumps({
    "error": True, 
    "errorMessage": "Expected 6 arguments"
  }))