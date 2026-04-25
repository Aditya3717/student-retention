import requests

print("Training RandomForest with 5000 samples...")
resp = requests.post(
    "http://localhost:8000/ml/train",
    json={"model_type": "random_forest", "n_samples": 5000},
    timeout=120
)
data = resp.json()
if data.get("success"):
    meta = data["meta"]
    print("SUCCESS!")
    print("  Accuracy:  " + str(meta["accuracy"]) + "%")
    print("  Precision: " + str(meta["precision"]) + "%")
    print("  Recall:    " + str(meta["recall"]) + "%")
    print("  F1 Score:  " + str(meta["f1"]) + "%")
    print("  Samples:   " + str(meta["training_samples"]))
    best = max(meta["feature_importance"], key=meta["feature_importance"].get)
    print("  Top feature: " + best)
else:
    print("FAILED: " + str(data))
