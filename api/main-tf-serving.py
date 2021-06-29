from fastapi import FastAPI, File, UploadFile
from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf
import requests


app = FastAPI()
class_names = ["Early Blight", "Late Blight", "Healthy"]
endpoint = "http://localhost:8501/v1/models/potatoes_model/versions/2:predict"


def read_file_as_image(data) -> Image.Image:
    image = np.array(Image.open(BytesIO(data)))
    return image


def predict(image):
    image_tensor = tf.keras.preprocessing.image.img_to_array(image)
    image_tensor = tf.expand_dims(image_tensor, 0)  # Create a batch
    image_tensor = image_tensor.numpy().tolist()
    json_data = {"instances": image_tensor}
    response = requests.post(endpoint, json=json_data)
    print(response)
    score = np.array(response.json()["predictions"][0])
    predicted_class = class_names[np.argmax(score)]
    confidence = np.max(score)
    return predicted_class, confidence


@app.get("/alive")
async def alive():
    return {"status": "Alive"}


@app.get("/predict")
async def predict_endpoint(
    file: UploadFile = File(...),
):
    image = read_file_as_image(await file.read())
    predicted_class, confidence = predict(image)
    print(predicted_class, confidence)
    return {"class": predicted_class, "confidence": float(confidence)}
