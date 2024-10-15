import requests
import traceback
import colorama
import json
from colorama import Fore, Style

LOCAL_URL="http://127.0.0.1:8000"

test_zones_valid = ["SE1", "SE2"]
test_zones_fail = ["ThisZoneDoesNotExist", "SE0"]

def test_read_price_data_zone():
    for zone in test_zones_valid:
        url = LOCAL_URL+"/price-data/"+zone
        request = requests.get(url)
        if request.status_code != 200:
            raise ValueError("/price-data/ returned "+str(request.status_code)+" when 200 was expected.")

        data = json.loads(request.content)
        assert data["zone"] == zone

    for zone in test_zones_fail:
        url = LOCAL_URL+"/price-data/"+zone
        request = requests.get(url)
        if request.status_code != 404:
            raise ValueError("/price-data/ returned "+str(request.status_code)+" when 404 was expected.")

def test_get_price_levels():
    for zone in test_zones_valid:
        url = LOCAL_URL+"/get-price-levels/"+zone
        request = requests.get(url)
        if request.status_code != 200:
            raise ValueError("/get-price-levels/ returned "+str(request.status_code)+" when 200 was expected.")
        
        data = json.loads(request.content)
        levels = data["priceLevels"]
        assert levels['high'] >= levels['low']


NOTE=0
SUCCESS=1
ERROR=2

def log(log_type, string):
    if log_type == NOTE:
        print(Fore.YELLOW+"[NOTE] ", end='')
    if log_type == SUCCESS:
        print(Fore.GREEN+"[SUCCESS] ", end='')
    if log_type == ERROR:
        print(Fore.RED+"[ERROR] ", end='')
    print(Style.RESET_ALL, end='')
    print(string)

if __name__ == '__main__':
    tests = [test_read_price_data_zone, test_get_price_levels]
    for function in tests:
        try:
            function()
        except requests.exceptions.ConnectionError:
            log(ERROR, "Connection to "+LOCAL_URL+" failed. Is it turned on?")
            break
        except ValueError as e:
            log(ERROR, function.__name__+" failed: "+str(e))
            continue
        except Exception as e:
            print(traceback.format_exc())
            continue
        log(SUCCESS, function.__name__+" passed")
