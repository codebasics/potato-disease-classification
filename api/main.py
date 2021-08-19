from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf


app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = tf.keras.models.load_model("../models/1")
class_names = ["Early Blight", "Late Blight", "Healthy"]


def read_file_as_image(data) -> Image.Image:
    image = np.array(Image.open(BytesIO(data)).convert('RGB'))
    return image


def predict(image):
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    img_array = tf.expand_dims(img_array, 0)  # Create a batch

    predictions = model.predict(img_array)
    print(type(predictions))
    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return predicted_class, confidence


@app.get("/alive")
async def alive():
    return {"status": "Alive"}


@app.post("/predict")
async def predict_endpoint(
    file: UploadFile = File(...),
):
    image = read_file_as_image(await file.read())
    predicted_class, confidence = predict(image)
    print(predicted_class, confidence)
    return {"class": predicted_class, "confidence": float(confidence)}
