---
name: agentmail
description: API-first email platform designed for AI agents. Create and manage dedicated email inboxes, send and receive emails programmatically, and handle email-based workflows with webhooks and real-time events. Use when defining agent email identity, sending emails from agents, handling incoming email workflows, or replacing traditional email providers like Gmail with agent-friendly infrastructure.
---

# AgentMail

## Overview

AgentMail is an API-first email platform specifically designed for AI agents. It allows for programmatic creation and management of email inboxes, sending/receiving emails, and handling email-based workflows. This skill provides direct access to AgentMail's core inbox management and email sending features.

## Core Capabilities

### Authentication

All requests require an `Authorization` header with a `Bearer` token. Replace `YOUR_API_KEY` with the actual key.

```
Authorization: Bearer YOUR_API_KEY
```

### 1. List Inboxes

Retrieve a list of all inboxes associated with your AgentMail account.

**Endpoint:** `GET https://api.agentmail.to/v0/inboxes`

**Example Usage:**
```python
import requests
import os

api_key = os.environ.get("AGENTMAIL_API_KEY")
headers = {"Authorization": f"Bearer {api_key}"}
response = requests.get("https://api.agentmail.to/v0/inboxes", headers=headers)

if response.status_code == 200:
    inboxes_data = response.json()
    print("Inboxes:", inboxes_data["inboxes"])
else:
    print("Error:", response.status_code, response.text)
```

### 2. Get Inbox

Retrieve details for a specific inbox using its `inbox_id`.

**Endpoint:** `GET https://api.agentmail.to/v0/inboxes/:inbox_id`

**Parameters:**
*   `inbox_id` (path parameter): The full email address of the inbox (e.g., `user@example.com`).

**Example Usage:**
```python
import requests
import os

api_key = os.environ.get("AGENTMAIL_API_KEY")
inbox_id = "example@agentmail.to" # Replace with the desired inbox ID
headers = {"Authorization": f"Bearer {api_key}"}
response = requests.get(f"https://api.agentmail.to/v0/inboxes/{inbox_id}", headers=headers)

if response.status_code == 200:
    inbox_details = response.json()
    print("Inbox Details:", inbox_details)
else:
    print("Error:", response.status_code, response.text)
```

### 3. Create Inbox

Create a new AgentMail inbox.

**Endpoint:** `POST https://api.agentmail.to/v0/inboxes`

**Body Parameters (JSON):**
*   `username` (optional): The desired username for the inbox (e.g., "myagent"). If not provided, AgentMail will generate one.
*   `client_id` (optional): A unique identifier from your system for idempotency.

**Example Usage:**
```python
import requests
import os
import json

api_key = os.environ.get("AGENTMAIL_API_KEY")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
payload = {
    "username": "my-new-agent",
    "client_id": "unique-id-123"
}
response = requests.post("https://api.agentmail.to/v0/inboxes", headers=headers, data=json.dumps(payload))

if response.status_code == 201:
    new_inbox_details = response.json()
    print("New Inbox Created:", new_inbox_details)
else:
    print("Error:", response.status_code, response.text)
```

### 4. Send an Email

Send an email from a specific inbox.

**Endpoint:** `POST https://api.agentmail.to/v0/inboxes/{inbox_id}/messages`

**Path Parameters:**
*   `inbox_id`: The ID of the inbox from which to send the email (e.g., `ea2sakaar@agentmail.to`).

**Body Parameters (JSON):**
*   `to` (array of strings): Recipient email address(es).
*   `subject` (string): The subject of the email.
*   `text` (string): The plain text body of the email.
*   `html` (string, optional): The HTML body of the email.

**Example Usage:**
```python
import requests
import os
import json

api_key = os.environ.get("AGENTMAIL_API_KEY")
sender_inbox_id = "ea2sakaar@agentmail.to" # Your AgentMail inbox ID
recipient_email = "recipient@example.com" # The email address to send to
email_subject = "Hello from Openclaw AgentMail!"
email_body_text = "This is a test email sent from my Openclaw AI agent using AgentMail."

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
payload = {
    "to": [recipient_email],
    "subject": email_subject,
    "text": email_body_text
}
url = f"https://api.agentmail.to/v0/inboxes/{sender_inbox_id}/messages"

response = requests.post(url, headers=headers, data=json.dumps(payload))

if response.status_code == 200:
    print("Email sent successfully!")
    print("Response:", response.json())
else:
    print("Error sending email:", response.status_code, response.text)
```
