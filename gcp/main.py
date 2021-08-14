from google.cloud import storage
import tensorflow as tf
from PIL import Image
import numpy as np

model = None
interpreter = None
input_index = None
output_index = None
class_names = ["Early Blight", "Late Blight", "Healthy"]

BUCKET_NAME = "potato-disease-tf"


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    blob.download_to_filename(destination_file_name)

    print(f"Blob {source_blob_name} downloaded to {destination_file_name}.")


def predict_tflite(image):
    image = image.resize((256, 256))
    test_image = np.expand_dims(image, axis=0).astype(np.float32)
    interpreter.set_tensor(input_index, test_image)
    interpreter.invoke()
    output = interpreter.tensor(output_index)
    predictions = output()[0]
    print(predictions)

    predicted_class = class_names[np.argmax(predictions)]
    confidence = round(100 * (np.max(predictions)), 2)
    return predicted_class, confidence


def predict(request):
    global interpreter
    global input_index
    global output_index

    if interpreter is None:
        download_blob(
            BUCKET_NAME,
            "models/potato-model.tflite",
            "/tmp/potato-model.tflite",
        )
        interpreter = tf.lite.Interpreter(model_path="/tmp/potato-model.tflite")
        interpreter.allocate_tensors()
        input_index = interpreter.get_input_details()[0]["index"]
        output_index = interpreter.get_output_details()[0]["index"]

    image = request.files["file"]

    image = np.array(Image.open(image).convert("RGB"))[:, :, ::-1]
    predicted_class, confidence = predict_tflite(image)
    return {"class": predicted_class, "confidence": confidence}
