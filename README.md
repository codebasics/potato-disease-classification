# Potato Disease Classification

## Setup for Python:
1. Install Python ([Setup instructions](https://wiki.python.org/moin/BeginnersGuide))

2. Install Python packages
```
pip3 install -r training/requirements.txt
pip3 install -r api/requirements.txt
```
3. Install Tensorflow Serving ([Setup instructions](https://www.tensorflow.org/tfx/serving/setup))

## Setup for ReactJS
1. Install Nodejs ([Setup instructions](https://nodejs.org/en/download/package-manager/))
2. Install NPM ([Setup instructions](https://www.npmjs.com/get-npm))
3. Install dependencies
``` bash
cd frontend
npm install
npm audit fix
```

4. Copy `.env.example` as `.env`.

5. Change API url in `.env`.

## Training the Model
1. Download the data from [kaggle](https://www.kaggle.com/arjuntejaswi/plant-village).
2. Only keep folders related to Potatoes.
3. Run Jupyter Notebook in Browser.
```bash
jupyter notebook
```
4. Open `training/potato-disease-training.ipynb` in Jupyter Notebook.
5. In cell #2, update the path to dataset.
6. Run all the Cells one by one.
7. Copy the model generated and save it with the version number in the `models` folder.

## Running the API
### Using FastAPI
1. Get inside `api` folder
```bash
cd api
```
2. Run the FastAPI Server using uvicorn
```bash
uvicorn main:app --reload --host 0.0.0.0
```
3. Your API is now running at `0.0.0.0:8000`

### Using FastAPI & TF Serve
1. Get inside `api` folder
```bash
cd api
```
2. Copy the `models.config.example` as `models.config` and update the paths in file. 
3. Run the TF Serve (Update config file path below)
```bash
tensorflow_model_server --port=8500 --rest_api_port=8501 \
                        --model_config_file=/workspace/local-files/projects/codebasics/plants-detection/potato-disease-classification/models.config
```
4. Run the FastAPI Server using uvicorn
```bash
uvicorn main-tf-serving:app --reload --host 0.0.0.0
```
5. Your API is now running at `0.0.0.0:8000`


## Running the Frontend
1. Get inside `api` folder
```bash
cd frontend
```
2. Copy the `.env.example` as `.env` and update `REACT_APP_API_URL` to API URL if needed.
3. Run the frontend
```bash
npm start
```
