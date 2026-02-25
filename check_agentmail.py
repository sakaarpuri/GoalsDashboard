
import requests
import os
import json

api_key = os.environ.get("AGENTMAIL_API_KEY")

if not api_key:
    print("Error: AGENTMAIL_API_KEY environment variable is not set.")
else:
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        response = requests.get("https://api.agentmail.to/v0/inboxes", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data and isinstance(data, dict) and "inboxes" in data:
                inboxes_list = data["inboxes"] # Use double quotes for dictionary key access within Python
                print(f"AgentMail is configured. Found {len(inboxes_list)} inbox(es).")
                for i, inbox in enumerate(inboxes_list[:3]): 
                    print(f"- Inbox {i+1}: {inbox.get("email_address", "N/A")} (ID: {inbox.get("id", "N/A")})")
                if len(inboxes_list) > 3:
                    print("(and more...)")
            else:
                print(f"AgentMail API returned status 200 but unexpected data format or no 'inboxes' key: {data}")
        else:
            print(f"AgentMail API error. Status: {response.status_code}. Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Network or API connection error: {e}")
