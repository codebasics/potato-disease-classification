from google.cloud import storage
import tensorflow as tf
from PIL import Image
import numpy as np

model = None
interpreter = None
input_index = None
output_index = None
class_names = ["Early Blight", "Late Blight", "Healthy"]

BUCKET_NAME = "codebasics-tf-models" # Here you need to put the name of your GCP bucket


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    blob.download_to_filename(destination_file_name)

    print(f"Blob {source_blob_name} downloaded to {destination_file_name}.")


def predict_using_tflite_model(image):
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
    global model
    if model is None:
        download_blob(
            BUCKET_NAME,
            "models/potatoes.h5",
            "/tmp/potatoes.h5",
        )
        model = tf.keras.models.load_model("/tmp/potatoes.h5")

    image = request.files["file"]

    image = np.array(
        Image.open(image).convert("RGB").resize((256, 256)) # image resizing
    )

    print("before scaling:", image)
    image = image/255 # normalize the image in 0 to 1 range
    print("after scaling:", image)

    predicted_class, confidence = predict_using_regular_model(image)
    return {"class": predicted_class, "confidence": confidence}

def predict_using_regular_model(img):
    global model
    img_array = tf.expand_dims(img, 0)
    predictions = model.predict(img_array)

    print("Predictions:",predictions)

    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = round(100 * (np.max(predictions[0])), 2)
    return predicted_class, confidence

def predict_lite(request):
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

    image = np.array(
        Image.open(image).convert("RGB").resize((256, 256))
    )[:, :, ::-1]
    predicted_class, confidence = predict_using_tflite_model(image)
    return {"class": predicted_class, "confidence": confidence}
