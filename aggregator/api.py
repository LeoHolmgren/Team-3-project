import time
import requests
from datetime import datetime
import json
import psycopg2
import os
import sys
import traceback

def database_create_connection(url):
    try:
        return psycopg2.connect(url)
    except (psycopg2.DatabaseError, Exception) as error:
        print(error)

zones = ["SE1", "SE2", "SE3", "SE4"]
HTTP_STATUS_OK = 200


def fetch_external_price_by_zone(zone, time):
    date = datetime.utcfromtimestamp(time)
    year = str(date.year)
    month = str(date.month).zfill(2)
    day = str(date.day).zfill(2)
    url = "https://www.elprisetjustnu.se/api/v1/prices/" + year + "/" + month + "-" + day + "_" + zone + ".json"
    request = requests.get(url)

    if request.status_code != HTTP_STATUS_OK:
        raise ValueError('External API did not return data')

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


def add_item(cursor, zone, price_SEK, time_start, time_end):
    sql_query = """INSERT INTO price_data(zone, price_SEK, time_start, time_end)
    VALUES(%s, %s, %s, %s)
    ON CONFLICT DO NOTHING;
    """
    cursor.execute(sql_query,
                   (zone, price_SEK, datetime.utcfromtimestamp(time_start),
                    datetime.utcfromtimestamp(time_end)))
    return

def log(trace):
    # TODO: Better system for logging errors
    print(trace)

if __name__ == '__main__':
    with open('../.DATABASE_URL_SECRET_DO_NOT_SHARE', 'r') as file:
        url_string = file.read().replace('\n', '')

    conn = database_create_connection(url_string)
    cursor = conn.cursor()
    for z in zones:
        try:
            external_data = fetch_external_price_by_zone(
                z,
                datetime.now().timestamp())
        except Exception as e:
            log(traceback.format_exception(*sys.exc_info()))
            continue
        for e in external_data:
            add_item(cursor, z, e["price_SEK"], e["time_start"], e["time_end"])
    conn.commit()
