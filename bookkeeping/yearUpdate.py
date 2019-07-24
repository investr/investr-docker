#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Populates the MASTER TABLE of stocks.db with yearly fundamental data.
#
# Run this script after Q1 results only for those companies whose Q1 result is out
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


BANKS_IDS = [2006,2589,2679,3055,3152,3177,3287,3297,3647,3725,4082,4257,4326,4866,5170,5185,5441,5551,5736,5999, \
             6039,6235,6497,6783,7084,7118,7286,7922,7964,8449,8660,8734,9104,9261,9419,9498,9507,9639,9903]


def main():

    # Get the arguments passed in the following format:
    # 1st parameter: File Name
    if len(sys.argv) < 2:
        print 'Pass correct number of parameters!'
        exit()

    args = sys.argv
    idsToProcess = args[1:]
    idsToProcess = map(int, idsToProcess) # Convert the string array to int array

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.INFO)
    logging.getLogger("requests").setLevel(logging.WARNING)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        # Get the tables in this DB
        cur.execute('SELECT ID, MC_CODE, MC_NAME, MC_S_OR_C, LAST_QTR FROM MASTER')

        rows = cur.fetchall()

        # Loop thru the data
        for row in rows:

            try:
                myid = row[0]
                mcCode = row[1]
                mcName = row[2]
                mcSOrC = row[3]
                lastQtr = row[4]

                if myid not in idsToProcess:
                    continue

                logging.info('Processing: ' + str(myid) + "-" + mcName)

                # Get details baout yearly results.
                if mcSOrC == 'consolidate':
                    url = 'http://www.moneycontrol.com/financials/' + mcName + '/results/consolidated-yearly' + '/' + mcCode
                elif mcSOrC == 'standalone':
                    url = 'http://www.moneycontrol.com/financials/' + mcName + '/results/yearly' + '/' + mcCode

                yearlyResults = requests.get(url)
                parsedHtml = BeautifulSoup(yearlyResults.text)

                # After Q4 results TTM will be same as the last year results so we need to take care of that.
                # Comment out the if condition after Q1 results. NOTE: Mar 16 has been hardcoded in shouldShiftYear
                # function. That needs to be changed while updating yearly results for FY 17.
                shiftYear = 0
                # if shouldShiftYear(parsedHtml) > 0:
                #    shiftYear = 1

                # For banks we get provision and contingencies and for other companies we get interest. We also need to add
                # various heads to calculate total earnings for a bank
                if myid not in BANKS_IDS:
                    (earningsY1, earningsY2) = getMCData(parsedHtml, 'Total Income From Operations', 2, shiftYear)
                    (interestY1, interestY2) = getMCData(parsedHtml, 'Interest', 2, shiftYear)
                else:
                    (aY1, aY2) = getMCData(parsedHtml, '(a) Int. /Disc. on Adv/Bills', 2, shiftYear)
                    (bY1, bY2) = getMCData(parsedHtml, '(b) Income on Investment', 2, shiftYear)
                    (cY1, cY2) = getMCData(parsedHtml, '(c) Int. on balances With RBI', 2, shiftYear)
                    (dY1, dY2) = getMCData(parsedHtml, '(d) Others', 2, shiftYear)
                    (eY1, eY2) = getMCData(parsedHtml, 'Other Income', 2, shiftYear)
                    earningsY1 = aY1 + bY1 + cY1 + dY1 + eY1
                    earningsY2 = aY2 + bY2 + cY2 + dY2 + eY2
                    (interestY1, interestY2) = getMCData(parsedHtml, 'Provisions And Contingencies', 2, shiftYear)

                # Try to get M.I & Accociates first. If it does not exist then we are returned -999.99.
                (profitsY1, profitsY2) = getMCData(parsedHtml, 'Net P/L After M.I & Associates', 2, shiftYear)
                if (profitsY1 == -999.99 or profitsY2 == -999.99):
                    (profitsY1, profitsY2) = getMCData(parsedHtml, 'Net Profit/(Loss) For the Period', 2, shiftYear)

                # We use the Ratios page for getting BV and Div
                url = 'http://www.moneycontrol.com/financials/' + mcName + '/ratiosVI/' + mcCode
                yearlyResults = requests.get(url)
                parsedHtml = BeautifulSoup(yearlyResults.text)

                # Book Value
                (bvY1, bvY2) = getMCData(parsedHtml, 'Book Value [ExclRevalReserve]/Share (Rs.)', 2)
                if bvY1 == -999.99 and bvY2 == -999.99:
                    (bvY1, bvY2) = getMCData(parsedHtml, 'Book Value [Excl. Reval Reserve]/Share (Rs.)', 2)

                # Dividend Yield
                (divY1, divY2) = getMCData(parsedHtml, 'Dividend / Share(Rs.)', 2)
                if divY1 == -999.99 and divY2 == -999.99:
                    (divY1, divY2) = getMCData(parsedHtml, 'Dividend/Share (Rs.)', 2)
                    if divY1 == -999.99 and divY2 == -999.99:
                        divY1 = 0.0
                        divY2 = 0.0
                        logging.info('### ERROR ###: Could not find Dividend data. Defaulting to 0.')

                cur.execute('UPDATE MASTER SET \
                                    EARNINGS_Y1 = ?, \
                                    EARNINGS_Y2 = ?, \
                                    INTEREST_Y1 = ?, \
                                    INTEREST_Y2 = ?, \
                                    PROFITS_Y1 = ?, \
                                    PROFITS_Y2 = ?, \
                                    BV_Y1 = ?, \
                                    BV_Y2 = ?, \
                                    DIV_Y1 = ?, \
                                    DIV_Y2 = ? \
                                WHERE ID = ?',
                                    (earningsY1, earningsY2, \
                                    interestY1, interestY2, \
                                    profitsY1, profitsY2, \
                                    bvY1, bvY2, divY1, divY2, \
                                    myid))

                logging.info('Updating ID: %s \n\
                                EY1: %s | EY2: %s \n\
                                IY1: %s | IY2: %s \n\
                                PY1: %s | PY2: %s \n\
                                BY1: %s | BY2: %s \n\
                                DY1: %s | DY2: %s \n',
                                myid, \
                                earningsY1, earningsY2, \
                                interestY1, interestY2, \
                                profitsY1, profitsY2, \
                                bvY1, bvY2, divY1, divY2)

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
