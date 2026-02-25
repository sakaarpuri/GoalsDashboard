import requests
import json
import sys

def search(query, api_key):
    url = "https://api.tavily.com/search"
    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": "basic",
        "include_answer": True,
        "max_results": 5
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

if __name__ == "__main__":
    api_key = "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"
    query = sys.argv[1] if len(sys.argv) > 1 else "latest creative job roles London February 2026"
    results = search(query, api_key)
    print(json.dumps(results, indent=2))
