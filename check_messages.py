
import requests
import os

api_key = os.environ.get("AGENTMAIL_API_KEY")
if not api_key:
    print("Error: AGENTMAIL_API_KEY not set")
else:
    headers = {"Authorization": f"Bearer {api_key}"}
    # Check sent messages
    response = requests.get("https://api.agentmail.to/v0/inboxes/ea2sakaar@agentmail.to/messages", headers=headers)
    if response.status_code == 200:
        data = response.json()
        if data.get("messages"):
            print(f"Found {len(data['messages'])} message(s)")
            for msg in data["messages"][:5]:
                print(f"  - To: {msg.get('to')}, Subject: {msg.get('subject')}, Status: {msg.get('status')}")
        else:
            print("No messages found in inbox")
            print(f"Response: {data}")
    else:
        print(f"Error: {response.status_code}, {response.text}")
