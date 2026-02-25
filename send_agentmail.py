
import requests
import os
import json

api_key = os.environ.get("AGENTMAIL_API_KEY")

if not api_key:
    print(f"Error: AGENTMAIL_API_KEY not found in environment variables.")
else:
    sender_inbox_id = "ea2sakaar@agentmail.to"
    recipient_email = "nikitasharma2217@gmail.com"
    email_subject = "i am sakaar's assistant"
    email_body_text = "do you have an agent to talk to sakaar's agent?"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "to": [recipient_email],
        "subject": email_subject,
        "text": email_body_text
    }
    url = f"https://api.agentmail.to/v0/inboxes/{sender_inbox_id}/messages/send"

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        print("Email sent successfully!")
        print("Response:", response.json())
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        if response is not None:
            print(f"Response Status: {response.status_code}")
            print(f"Response Body: {response.text}")
    except requests.exceptions.RequestException as req_err:
        print(f"Other request error occurred: {req_err}")
