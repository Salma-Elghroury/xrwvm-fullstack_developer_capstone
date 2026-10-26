import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

# def get_request(endpoint, **kwargs):
# Add code for get requests to back end

def get_request(endpoint, **kwargs):
    params = ""
    if(kwargs):
        for key,value in kwargs.items():
            params=params+key+"="+value+"&"

    request_url = backend_url+endpoint+"?"+params

    print("GET from {} ".format(request_url))
    response = requests.get(request_url)
    response.raise_for_status()
    return response.json()

# def analyze_review_sentiments(text):
# request_url = sentiment_analyzer_url+"analyze/"+text
# Add code for retrieving sentiments

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    response = requests.get(request_url)
    response.raise_for_status()
    return response.json()

# def post_review(data_dict):
# Add code for posting review

def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    response = requests.post(request_url, json=data_dict)
    response.raise_for_status()
    return response.json()
