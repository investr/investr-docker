#
#
# Utility methods to get data from Google Finance.
#
#

import os
import sys
import json
import logging
import urllib2
import requests
import datetime
import traceback
import sqlite3 as lite
from BeautifulSoup import BeautifulSoup
from moneyControl import *


GOOGLE_FINANCE_URL = 'http://finance.google.com/finance/info?q='
GOOGLE_FINANCE_BACKUP_URL = 'http://finance.google.com/finance?q='
GOOGLE_FINANCE_URL = 'http://finance.google.com/finance?q='


POWERS = {'M': 10 ** 6, '0': 10 ** 0}


def getAndParseVolumeData(urlToFetch):
    try:

        stockPage = requests.get(urlToFetch)
        parsedHtml = BeautifulSoup(stockPage.text)

        volNodes = parsedHtml.findAll('td', {'data-snapfield': 'vol_and_avg'})
        v = volNodes[0].parent.findAll('td', {'class': 'val'})[0].text

        # Cleanse the data by stripping that commas.
        # Stock volume that is in millions is returned as 1.5M. Use POWERS to convert it into a string of numbers.
        if len(v) > 0:
            v = v.replace(',', '')
            power = v[-1]
            v = float(v[:-1]) * POWERS[power]
        else:
            v = 0

        return int(v)

    except:
        logging.info(traceback.format_exc())
        return 0

def getTotalVolume(nse, bse):
    nseVol = 0;
    bseVol = 0;

    if nse != None and len(nse) > 0:
        nse = nse.replace('&', '%26')
        urlToFetch = GOOGLE_FINANCE_URL + "NSE" + ':' + nse
        nseVol = getAndParseVolumeData(urlToFetch)

    if bse != None and len(bse) > 0:
        urlToFetch = GOOGLE_FINANCE_URL + "BOM" + ':' + bse
        bseVol = getAndParseVolumeData(urlToFetch)

    return nseVol + bseVol



def getStockPriceBackup(bseCode, nseCode):

    # Some companies have an & in their NSE codes. Replace them with %26

    if nseCode is not None and len(nseCode) > 0:
        nseCode = nseCode.replace('&', '%26')
        urlToFetch = GOOGLE_FINANCE_BACKUP_URL + 'NSE' + ':' + nseCode
    else:
        urlToFetch = GOOGLE_FINANCE_BACKUP_URL + 'BOM' + ':' + bseCode

    stockPage = requests.get(urlToFetch)
    parsedHtml = BeautifulSoup(stockPage.text)

    priceNodes = parsedHtml.findAll('span', {'class': 'pr'})
    price = priceNodes[0].findChildren()[0].text
    price = price.replace(',', '')

    return float(price)


def getStockPrice(bseCode, nseCode):

    # Some companies have an & in their NSE codes. Replace them with %26

    if nseCode is not None and len(nseCode) > 0:
        nseCode = nseCode.replace('&', '%26')
        urlToFetch = GOOGLE_FINANCE_URL + 'NSE' + ':' + nseCode
    else:
        urlToFetch = GOOGLE_FINANCE_URL + 'BOM' + ':' + bseCode

    url = urllib2.urlopen(urlToFetch)

    content = url.read()
    jsonContent = json.loads(content[3:])
    stockInfo = jsonContent[0]

    price = stockInfo['l']
    price = price.replace(',', '')

    return float(price)



def get200DayAveragePrice(bseCode):
    # We are getting data for 10 months for 200 DMA
    urlToFetch = 'https://www.google.com/finance/getprices?q=' + bseCode + '&x=BOM&i=86400&p=10M&f=c'
    url = urllib2.urlopen(urlToFetch)
    content = url.read()

    # Convert the data returned into a list of lines
    data = [y for y in (x.strip() for x in content.splitlines()) if y]

    if (len(data) > 7):
        totalPrice = 0
        noOfItems = 0
        # We start from the 8th line as the first few lines of the output has some related text
        for i in range(7, len(data)):
            priceVolume = data[i].split(',')
            totalPrice = totalPrice + float(priceVolume[0])
            noOfItems = noOfItems + 1

        return round(totalPrice/noOfItems, 2)

    return 0


def get30DayAveragePrice(bseCode):
    # We are getting both price and volume but using only price as of now.
    urlToFetch = 'https://www.google.com/finance/getprices?q=' + bseCode + '&p=30d&f=c,v'

    url = urllib2.urlopen(urlToFetch)
    content = url.read()

    # Convert the data returned into a list of lines
    data = [y for y in (x.strip() for x in content.splitlines()) if y]

    if (len(data) > 7):
        totalPrice = 0
        noOfItems = 0
        # We start from the 8th line as the first few lines of the output has some related text
        for i in range(7, len(data)):
            priceVolume = data[i].split(',')
            totalPrice = totalPrice + float(priceVolume[0])
            noOfItems = noOfItems + 1

        return round(totalPrice/noOfItems, 2)

    return 0
