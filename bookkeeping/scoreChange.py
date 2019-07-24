#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Popultes the ATTR6 column of the SCORE table with either /POSITIVE or /NEGATIVE
# depending on if the results were better (score improved) or worse (score worsened)
#

import os
import traceback
import datetime
import logging
import sqlite3 as lite


def main():
    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.DEBUG)

    try:

        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        idOldScrDict = {}
        idNewScrDict = {}

        # Fix the dates
        today = datetime.datetime.today().strftime('%Y-%m-%d')
        logging.info('Today: ' + today)

        currentMonth = datetime.datetime.today().strftime('%m')
        currentYearYYYY = datetime.datetime.today().strftime('%Y')
        currentYearYY = datetime.datetime.today().strftime('%y')

        if currentMonth in ['01', '02', '03']:
            oldDate = currentYearYYYY + '-01-03'
            lastQtr = 'Dec ' + str(int(currentYearYY) - 1)

        if currentMonth in ['04', '05', '06']:
            oldDate = currentYearYYYY + '-04-04'
            lastQtr = 'Mar ' + currentYearYY

        if currentMonth in ['07', '08', '09']:
            oldDate = currentYearYYYY + '-07-03'
            lastQtr = 'Jun ' + currentYearYY

        if currentMonth in ['10', '11', '12']:
            oldDate = currentYearYYYY + '-10-03'
            lastQtr = 'Sep ' + currentYearYY

        logging.info('Old Date: ' + oldDate)
        logging.info('Last Qtr: ' + lastQtr)

        # Get the score at the beginning of the earnings season
        cur.execute('SELECT H.STOCK_ID, H.SCORE FROM HISTORICAL_SCORE H, MASTER M WHERE H.DT = ? AND M.LAST_QTR = ? AND H.STOCK_ID = M.ID', (oldDate, lastQtr))
        rows = cur.fetchall()
        for row in rows:
            stockId = row[0]

            idOldScrDict[stockId] = row[1]

        # Get the score after the earnings
        cur.execute('SELECT H.STOCK_ID, H.SCORE FROM HISTORICAL_SCORE H, MASTER M WHERE H.DT = ? AND M.LAST_QTR = ? AND H.STOCK_ID = M.ID', (today, lastQtr))
        rows = cur.fetchall()
        for row in rows:
            stockId = row[0]

            idNewScrDict[stockId] = row[1]

        # Note that we dont have historical data for holidays. So if data is not there then skip the wipe and update
        if len(idNewScrDict) > 0:
            # Reset the ATTR6 column of SCORE  table. This column will either have
            # /POSITIVE : If score has moved up on +ve results
            # /NEGATIVE : If score has moved down on -ve results
            cur.execute('UPDATE SCORE SET ATTR6 = ""')

            # Loop thru the old scores and find the new scores
            for key in idOldScrDict:
                try:
                    oldScr = idOldScrDict[key]
                    newScr = idNewScrDict[key]

                    result = ""
                    if newScr > oldScr:
                        result = "/POSITIVE"
                    else:
                        result = "/NEGATIVE"

                    logging.info('Result of stock ID: ' + str(key) + ' is ' + result)

                    cur.execute('UPDATE SCORE SET ATTR6 = ? WHERE ID = ?', (result, key))

                except lite.Error as er:
                    print er
                    print traceback.format_exc()

        else:
            logging.info('Score records not found for date: ' + today)

    except lite.Error as er:
        print er
        print traceback.format_exc()

    finally:
        con.commit()
        con.close()


if __name__ == '__main__':
    main()
