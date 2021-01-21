import json
import os
import sys
import urllib.request

api_key = os.getenv("EDUFLOW_API_KEY")
if api_key is None:
    sys.exit(
        """Enter your EDUFLOW_API_KEY:

    env EDUFLOW_API_KEY=<api_key> python app.py"""
    )

query = """{
  institution {
    name
  }
}"""

raw_data = {
    "query": query,
    "variables": {},
}
data = json.dumps(raw_data).encode("utf-8")

options = {
    "data": data,
    "headers": {
        "Content-Type": "application/json",
        "Content-Length": len(data),
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "Node",
    },
}

hostname = os.getenv("EDUFLOW_API_HOSTNAME", "app.eduflow.com")
protocol = os.getenv("EDUFLOW_API_PROTOCOL", "https")
port = os.getenv("EDUFLOW_API_PORT", 443)
url = f"{protocol}://{hostname}/api/graphql"

request = urllib.request.Request(url, **options)

try:
    response = urllib.request.urlopen(request)
    print(response.read().decode())
except urllib.error.HTTPError as e:
    print(e.read().decode())
