#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Updates enterprise value and EBITDA
#
# Note: This script silently passes the exceptions so be careful!
# Check the log file for any exceptions.
#


import os
import sys
import traceback
import requests
import logging
import sqlite3 as lite
from moneyControl import *
from BeautifulSoup import BeautifulSoup

def main():

    # Get the arguments passed in the following format:
    # 1st parameter: File Name
    # 2nd parameter: 1 or 0 (1 Updates backend DB, 0 just logs the results)
    # 3rd or more parameters: Stocks IDs
    if len(sys.argv) < 3:
        print 'Pass correct number of parameters!'
        exit()

    args = sys.argv
    idsToProcess = args[2:]
    idsToProcess = map(int, idsToProcess) # Convert the string array to int array

    # Logging
    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.INFO)
    logging.getLogger("requests").setLevel(logging.WARNING)

    # Get and populate data
    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        # Get the tables in this DB
        cur.execute('SELECT ID, MC_CODE, MC_NAME, MC_S_OR_C, MC_URL, LAST_QTR FROM MASTER')

        rows = cur.fetchall()

        # Loop thru the data
        for row in rows:

            try:
                myid = row[0]
                mcCode = row[1]
                mcName = row[2]
                mcSOrC = row[3]
                mcUrl = row[4]
                lastQtr = row[5]

                if myid not in idsToProcess:
                    continue

                # First get EV/EBITDA ratio for the last two years from ratios page
                ratiosUrl = 'http://www.moneycontrol.com/financials/' + mcName + '/ratiosVI/' + mcCode
                yearlyResults = requests.get(ratiosUrl)
                parsedHtml = BeautifulSoup(yearlyResults.text)
                (dataY1, dataY2) = getMCData(parsedHtml, 'EV/EBITDA (X)', 2)

                # Banks dont have this ratio and will return -999.99. Change it to 0.
                if dataY1 == -999.99:
                    dataY1 = 0

                if dataY2 == -999.99:
                    dataY2 = 0

                # Update DB only if the second parameter is 1. When 0, we will just log the proposed update.
                if args[1] == "1":
                    cur.execute('UPDATE MASTER SET EV_EBITDA_Y1 = ?, EV_EBITDA_Y2 = ? WHERE ID = ?', (dataY1, dataY2, myid))

                logging.info('Updating ID: %s \n EV_EBITDA_Y1: %s | EV_EBITDA_Y2: %s \n', myid, dataY1, dataY2)

            except Exception:
                logging.info('Exception raised while processing: ' + str(myid) + ' ... Name ... ' + mcName)
                logging.info(traceback.format_exc())

    except lite.Error as er:
        logging.info(er)
    finally:
        con.commit()
        con.close()

    logging.info('Finished Updating Data!')


if __name__ == '__main__':
    main()
