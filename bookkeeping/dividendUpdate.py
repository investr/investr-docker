#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Update Dividend
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
    if len(sys.argv) < 2:
        print 'Pass correct number of parameters!'
        exit()

    args = sys.argv
    idsToProcess = args[2:]
    idsToProcess = map(int, idsToProcess) # Convert the string array to int array

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.INFO)
    logging.getLogger("requests").setLevel(logging.WARNING)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        # Get the tables in this DB
        cur.execute('SELECT ID, MC_CODE, MC_NAME, MC_S_OR_C, MC_URL, LAST_QTR, PRICE FROM MASTER')

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
                price = row[6]

                if myid not in idsToProcess:
                    continue

                # First get Book Value for the last two years from ratios page
                ratiosUrl = 'http://www.moneycontrol.com/financials/' + mcName + '/ratiosVI/' + mcCode
                yearlyResults = requests.get(ratiosUrl)
                parsedHtml = BeautifulSoup(yearlyResults.text)

                (divY1, divY2) = getMCData(parsedHtml, 'Dividend / Share(Rs.)', 2)

                if divY1 == -999.99 and divY2 == -999.99:
                    (divY1, divY2) = getMCData(parsedHtml, 'Dividend/Share (Rs.)', 2)

                    if divY1 == -999.99 and divY2 == -999.99:
                        divY1 = 0.0
                        divY2 = 0.0
                        logging.info('### ERROR ###: Could not find Dividend data. Defaulting to 0.')

                # Get the latest book value from the main page
                mainPage = requests.get(mcUrl)
                parsedHtml = BeautifulSoup(mainPage.text)
                divYield = getDividendYield(parsedHtml)
                divY1 = round((divYield*price)/100, 2)

                # Update DB only if the second parameter is 1. When 0, we will just log the proposed update.
                if args[1] == 1:
                    cur.execute('UPDATE MASTER SET  DIV_Y1 = ?,  DIV_Y2 = ? WHERE ID = ?', (divY1, divY2, myid))

                logging.info('Updating ID: %s \n DY1: %s | DY2: %s \n', myid, divY1, divY2)

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
