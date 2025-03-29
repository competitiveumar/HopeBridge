import requests

def test_chatbot():
    url = 'http://localhost:8000/api/chatbot/query/'
    headers = {'Content-Type': 'application/json'}
    data = {'query': 'What is HopeBridge?'}

    try:
        response = requests.post(url, json=data, headers=headers)
        print('Status Code:', response.status_code)
        print('Response:', response.json())
    except Exception as e:
        print('Error:', str(e))

if __name__ == '__main__':
    test_chatbot() 