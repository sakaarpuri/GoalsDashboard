#!/usr/bin/env python3
import requests
import base64

# WordPress site details
wp_url = "https://whitelabl.in/wp-json/wp/v2"
username = "openclaw"
password = "9T3uu6W5rc*wl(ND5sf(jhkQ"

# Create auth header
credentials = base64.b64encode(f"{username}:{password}".encode()).decode()
headers = {
    "Authorization": f"Basic {credentials}",
    "Content-Type": "application/json"
}

# Check all content types including trash
for content_type in ['posts', 'pages']:
    # Get published items
    content_url = f"{wp_url}/{content_type}"
    response = requests.get(content_url, headers=headers)
    
    if response.status_code == 200:
        items = response.json()
        print(f"\n=== {content_type.upper()} ({len(items)} found) ===\n")
        
        for item in items:
            item_id = item['id']
            title = item['title']['rendered']
            status = item['status']
            print(f"ID: {item_id} | Title: '{title}' | Status: {status}")
            
            # Delete Hello World and Mockup Maker
            if 'hello' in title.lower() or 'mockup' in title.lower() or title == '':
                delete_url = f"{wp_url}/{content_type}/{item_id}"
                delete_response = requests.delete(delete_url, headers=headers)
                
                if delete_response.status_code == 200:
                    print(f"  ✓ Deleted successfully\n")
                else:
                    print(f"  ✗ Failed to delete: {delete_response.status_code}\n")
            else:
                print(f"  - Skipped\n")
    else:
        print(f"Error fetching {content_type}: {response.status_code}")

# Try to delete specific post IDs we know about
print("\n=== Trying to delete specific post IDs ===\n")
for post_id in [1, 728]:
    for content_type in ['posts', 'pages']:
        delete_url = f"{wp_url}/{content_type}/{post_id}"
        delete_response = requests.delete(delete_url, headers=headers)
        print(f"Delete {content_type} ID {post_id}: {delete_response.status_code}")
        if delete_response.status_code == 200:
            print(f"  ✓ Deleted\n")
        elif delete_response.status_code == 404:
            print(f"  - Not found (may already be deleted)\n")
        else:
            print(f"  ✗ Error: {delete_response.text[:100]}\n")
