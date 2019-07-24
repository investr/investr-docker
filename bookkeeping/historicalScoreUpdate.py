#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Popultes the
#

import os
import traceback
import logging
import json
import urllib2
import requests
import gspread
import datetime
import sqlite3 as lite
from BeautifulSoup import BeautifulSoup
from oauth2client.service_account import ServiceAccountCredentials


POWERS = {'M': 10 ** 6, '0': 10 ** 0}
GOOGLE_FINANCE_URL = 'http://finance.google.com/finance?q='

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


def main():

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.INFO)
    logging.getLogger("urllib2").setLevel(logging.WARNING)

    try:

        jsonContent = json.load(urllib2.urlopen('http://investr.co.in/api/wts/opt/1000'))

        today = datetime.date.today()

        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        idPriceDict = {}
        idPeDict = {}
        idVolDict = {}

        # Save the ID - Price mapping
        cur.execute('SELECT ID, PRICE, ATTR2, PE FROM MASTER')
        rows = cur.fetchall()
        for row in rows:
            logging.info(row[0])
            idPriceDict[row[0]] = row[1]
            idVolDict[row[0]] = row[2]
            idPeDict[row[0]] = row[3]

        for stock in jsonContent:
            stockId = stock['ID']
            stockScore = stock['SR']
            price = idPriceDict[int(stockId)]
            pe = idPeDict[int(stockId)]
            vol = idVolDict[int(stockId)]

            cur.execute('INSERT INTO HISTORICAL_SCORE (STOCK_ID, DT, SCORE, PRICE, ATTR1, ATTR2) VALUES (?,?,?,?,?,?);',
                        (stockId, today, stockScore, price, pe, vol))

        logging.info("Finished!")
    except lite.Error as er:

        logging.info(er)
        logging.info(traceback.format_exc())

    finally:

        con.commit()
        con.close()


if __name__ == '__main__':
    main()
