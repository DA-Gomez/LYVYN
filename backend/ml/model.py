import os
import sys
import json
import pandas as pd
import numpy as np
import joblib #library for parallel computing and disk based caching 
from sklearn.linear_model import LogisticRegression

# Receives an  outfits from Express as one JSON string.
# we will scores each outfit and returns the best one.

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(CURRENT_DIR, "data.csv")
FEEDBACK_PATH = os.path.join(CURRENT_DIR, "feedback_cache.json")
MODEL_PATH = os.path.join(CURRENT_DIR, "model.pkl") #this includes previous model so we dont have to constantly train

FEATURE_COLUMNS = ["is_cold", "has_outerwear", "heavy_items_count", "is_formal", "formality_match", "time_since_last_worn"]
LABEL_COLUMN = "liked"

def fail(message):
    print(json.dumps({
        "error": True,
        "errorMessage": message,
        "best_outfit": None,
        "all_scored_outfits": [],
    }))
    sys.exit(1)


def load_training_data():
    # start with the static CSV then add 'feedback' doc rows from firestore
    data = pd.read_csv(DATA_PATH)
    columns = FEATURE_COLUMNS + [LABEL_COLUMN]
    frames = [data[columns]] #the 2d data

    if os.path.exists(FEEDBACK_PATH):
        with open(FEEDBACK_PATH, "r", encoding="utf-8") as file:
            feedback_rows = json.load(file)
        if feedback_rows:
            frames.append(pd.DataFrame(feedback_rows)[columns])

    return pd.concat(frames, ignore_index=True)


# Reuse the saved model if we have one, otherwise train a new one and save it
# backend deletes model.pkl whenever new feedback arrives
def get_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)

    data = load_training_data()
    x = data[FEATURE_COLUMNS].values
    y = data[LABEL_COLUMN].values

    model = LogisticRegression(max_iter=1000)
    model.fit(x, y)
    joblib.dump(model, MODEL_PATH)
    return model


def main():
    # The backend sends the outfits as a JSON array on standard input.
    # (read from stdin instead of an arg because the list can be long)
    outfits_json = sys.stdin.read()

    result = {
        "error": False,
        "errorMessage": "",
        "best_outfit": None,
        "all_scored_outfits": [],
    }

    try:
        model = get_model()
        outfits = json.loads(outfits_json)

        for outfit in outfits:
            features = np.array([[
                int(outfit["is_cold"]),
                int(outfit["has_outerwear"]),
                int(outfit["heavy_items_count"]),
                int(outfit["is_formal"]),
                int(outfit["formality_match"]),
                int(outfit["time_since_last_worn"]),
            ]])

            # predict_proba returns [P(not liked), P(liked)] we want P(liked)
            probability_liked = float(model.predict_proba(features)[0][1])
            outfit["ml_score"] = round(probability_liked, 2)
            result["all_scored_outfits"].append(outfit)

        # best outfit is the one with the highest score
        result["all_scored_outfits"].sort(key=lambda o: o["ml_score"], reverse=True)
        result["best_outfit"] = result["all_scored_outfits"][0]

    except Exception as e:
        result["error"] = True
        result["errorMessage"] = str(e) # show the real error message

    print(json.dumps(result))


main()
