import time
import requests
from datetime import datetime, timedelta
import psycopg2
import sys
import traceback
import xml.etree.ElementTree as ET
from dateutil import parser
from dateutil import tz

# Insert API key and database URL here
# These constants will be used to establish database connections and make API calls.
DATABASE_URL = "postgresql://ElectricityPricesDatabase_owner:Sf54EaVzqjeP@ep-lingering-queen-a2q4uvi7.eu-central-1.aws.neon.tech/ElectricityPricesDatabase?sslmode=require"
ENTSOE_API_KEY = 'fdcdf1f9-4760-4792-8b50-ad0c995b3f94'

# Establish a connection to the PostgreSQL database using the DATABASE_URL.
# If the connection fails, it raises an exception and exits the script.
def database_create_connection():
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not set")
    try:
        return psycopg2.connect(DATABASE_URL)
    except (psycopg2.DatabaseError, Exception) as error:
        print(f"Database connection error: {error}")
        sys.exit(1)

# Define the zones and their EIC codes
# These will be used later when making API requests to fetch energy prices by zone.
zones = ["SE1", "SE2", "SE3", "SE4", "NO1", "NO2", "NO3", "NO4", "NO5", "DK1", "DK2", "FI"]

# Mapping of zones to their EIC codes, which will be passed in the API request.
zones_eic = {
    'SE1': '10Y1001A1001A44P',
    'SE2': '10Y1001A1001A45N',
    'SE3': '10Y1001A1001A46L',
    'SE4': '10Y1001A1001A47J',
    'NO1': '10YNO-1--------2',
    'NO2': '10YNO-2--------T',
    'NO3': '10YNO-3--------J',
    'NO4': '10YNO-4--------9',
    'NO5': '10Y1001A1001A48H',
    'DK1': '10YDK-1--------W',
    'DK2': '10YDK-2--------M',
    'FI':  '10YFI-1--------U',
}

# Function to fetch energy prices for a specific zone between a start and end date.
# The ENTSOE_API_KEY and the zones_eic dictionary defined earlier are used here.
def get_energy_prices(zone_code, start_date, end_date):
    if not ENTSOE_API_KEY:
        raise ValueError("ENTSOE_API_KEY is not set")
    url = 'https://web-api.tp.entsoe.eu/api'
    params = {
        'securityToken': ENTSOE_API_KEY,
        'documentType': 'A44',  # Day-ahead prices
        'in_Domain': zone_code,
        'out_Domain': zone_code,
        'periodStart': start_date.strftime('%Y%m%d%H%M'),
        'periodEnd': end_date.strftime('%Y%m%d%H%M'),
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print(f"Failed to fetch data for zone {zone_code}: HTTP {response.status_code}")
        print(response.text)
        return None
    else:
        return response.content

# Parse the XML data received from the API to extract energy price information.
# The previous get_energy_prices function is used here to provide XML data to this function.
def parse_energy_prices(xml_data):
    root = ET.fromstring(xml_data)
    namespaces = {'ns': root.tag.split('}')[0].strip('{')}
    timeseries_list = root.findall('.//ns:TimeSeries', namespaces)
    entries = []

    # Define time zones
    utc = tz.tzutc()
    local_tz = tz.gettz('Europe/Stockholm')  # Adjust to our local time zone

    for ts in timeseries_list:
        period = ts.find('ns:Period', namespaces)
        time_interval = period.find('ns:timeInterval', namespaces)
        start_str = time_interval.find('ns:start', namespaces).text

        # Parse the start time and set timezone to UTC
        start_time = parser.isoparse(start_str)
        start_time = start_time.replace(tzinfo=utc)

        resolution = period.find('ns:resolution', namespaces).text
        if resolution != 'PT60M':
            raise ValueError(f"Unsupported resolution {resolution}")

        points = period.findall('ns:Point', namespaces)
        for point in points:
            position = int(point.find('ns:position', namespaces).text)
            price_amount = float(point.find('ns:price.amount', namespaces).text)

            interval_start = start_time + timedelta(hours=position - 1)
            interval_end = interval_start + timedelta(hours=1)

            # Convert to local time zone
            interval_start_local = interval_start.astimezone(local_tz)
            interval_end_local = interval_end.astimezone(local_tz)

            # Remove time zone info
            interval_start_naive = interval_start_local.replace(tzinfo=None)
            interval_end_naive = interval_end_local.replace(tzinfo=None)

            # Append price and time interval to the entries list
            entries.append({
                'price_eur_mwh': price_amount,
                'time_start': interval_start_naive,
                'time_end': interval_end_naive,
            })
    return entries

# Fetch the EUR to SEK exchange rate from the European Central Bank.
def get_eur_to_sek_exchange_rate():
    url = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch exchange rates: HTTP {response.status_code}")
        return None
    try:
        xml_data = response.content
        root = ET.fromstring(xml_data)
        namespaces = {'gesmes': 'http://www.gesmes.org/xml/2002-08-01',
                      'default': 'http://www.ecb.int/vocabulary/2002-08-01/eurofxref'}
        cube_root = root.find('.//default:Cube/default:Cube', namespaces)
        rate = None
        for cube in cube_root.findall('default:Cube', namespaces):
            if cube.get('currency') == 'SEK':
                rate = float(cube.get('rate'))
                break
        if rate is None:
            print("SEK rate not found in ECB data")
            return None
        else:
            return rate
    except Exception as e:
        print(f"Error parsing exchange rate data: {e}")
        return None

# Fetches energy prices by zone and converts the price from EUR/MWh to SEK/kWh using the previous exchange rate function.
# The previous functions like get_energy_prices and get_eur_to_sek_exchange_rate are used here.
def fetch_external_price_by_zone(zone, time):
    date = datetime.utcfromtimestamp(time)
    start_date = date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_date = start_date + timedelta(days=1)

    zone_code = zones_eic.get(zone)
    if not zone_code:
        raise ValueError(f"EIC code not found for zone {zone}")

    xml_data = get_energy_prices(zone_code, start_date, end_date)
    if not xml_data:
        raise ValueError(f"Could not retrieve data for zone {zone}")

    entries = parse_energy_prices(xml_data)
    exchange_rate = get_eur_to_sek_exchange_rate()
    if not exchange_rate:
        raise ValueError("Could not retrieve exchange rate EUR to SEK")

    # Now, for each entry, convert price and construct the list of new entries
    list_of_new = []
    for e in entries:
        price_eur_mwh = e['price_eur_mwh']
        # Convert EUR/MWh to SEK/kWh
        # EUR/MWh * exchange_rate / 1000 = SEK/kWh
        price_sek_per_kwh = (price_eur_mwh * exchange_rate) / 1000
        entry = {
            'price_SEK': price_sek_per_kwh,
            'time_start': e['time_start'],
            'time_end': e['time_end']
        }
        list_of_new.append(entry)
    return list_of_new

# Insert data into the database. This function uses the previously fetched price data.
def add_item(cursor, zone, price_SEK, time_start, time_end):
    sql_query = """INSERT INTO price_data(zone, price_SEK, time_start, time_end)
    VALUES(%s, %s, %s, %s)
    ON CONFLICT DO NOTHING;
    """
    try:
        cursor.execute(sql_query, (zone, price_SEK, time_start, time_end))
    except Exception as e:
        print(f"Failed to insert data for zone {zone}: {e}")

# Simple logging function for errors.
def log(trace):
    print(trace)

# Main execution starts here.
if __name__ == '__main__':
    # Establish the database connection using the function defined earlier.
    conn = database_create_connection()
    cursor = conn.cursor()

    for z in zones:
        try:
            # Fetching prices for the current zone by calling the function fetch_external_price_by_zone.
            # This function uses the previously defined get_energy_prices, parse_energy_prices, 
            # and get_eur_to_sek_exchange_rate functions.
            print(f"Fetching prices for {z}")
            external_data = fetch_external_price_by_zone(
                z,
                datetime.utcnow().timestamp())  # Current timestamp is passed here.
            
            # For each energy price entry retrieved, insert it into the database.
            for e in external_data:
                # The add_item function is called to insert the price data into the database.
                # It uses the previously created cursor object and inserts data related to zone,
                # price_SEK, time_start, and time_end into the database.
                add_item(cursor, z, e["price_SEK"], e["time_start"], e["time_end"])
        except Exception as e:
            # Log any exceptions that occur during the process using the log function.
            # The traceback is used here to get detailed information about the error.
            log(traceback.format_exception(*sys.exc_info()))
            continue

    # Commit the changes to the database. This ensures all inserted data is saved.
    conn.commit()

    # Close the cursor and the database connection to clean up resources.
    cursor.close()
    conn.close()
 