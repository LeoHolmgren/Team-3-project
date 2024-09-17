from flask import Flask
from flask import json
import time
import requests
from datetime import datetime

app = Flask(__name__)

cached_zones = {}

# Current format for storing price data
# {
#   "SEK_per_kWh": 0.0,
#   "time_start": 0.0,
#   "time_end": 0.0
# }


def fetch_external_price_by_zone(zone):
    valid_zones = ["SE1", "SE2", "SE3", "SE4"]
    valid_zone = False
    for v in valid_zones:
        if v == zone:
            valid_zones = True
    if not valid_zones:
        raise ValueError('Client specified invalid zone')
    request = requests.get(
        "https://www.elprisetjustnu.se/api/v1/prices/2024/09-17_" + zone +
        ".json")
    if request.status_code != 200:
        raise ValueError('External API did not return data')

    # TODO: Error handling?
    data = json.loads(request.content)

    list_of_new = []
    for i in data:
        entry = {}
        entry["price_SEK"] = i["SEK_per_kWh"]
        start = datetime.fromisoformat(i["time_start"])
        end = datetime.fromisoformat(i["time_end"])
        entry["time_start"] = start.timestamp()
        entry["time_end"] = end.timestamp()
        list_of_new.append(entry)

    return list_of_new


def get_cached_price_by_zone(zone):
    current_hour = int(time.time() / (60 * 60))
    cached_item = cached_zones.get(zone)
    if cached_item != None:
        if cached_item["hour"] == current_hour:
            return cached_item["data"]

    try:
        external_content = fetch_external_price_by_zone(zone)
    except ValueError as value:
        print(value)
        return "Internal Server Error", 503
    except Exception as error:
        print('Caught this error: ' + repr(error))
        return "Internal Server Error", 503

    if cached_zones.get(zone) == None:
        cached_zones[zone] = {"data": external_content, "hour": current_hour}
        return cached_zones[zone]["data"]

    # TODO: Slow, especially since we can order entries by date. But it
    # does not seem to matter for now since this will be done once every
    # hour.
    for n in external_content:
        if n not in cached_zones[zone]["data"]:
            cached_zones[zone]["data"].append(n)

    cached_zones[zone]["hour"] = current_hour
    return cached_zones[zone]["data"]


@app.route('/api/<zone>')
def location(zone):
    return get_cached_price_by_zone(zone)
