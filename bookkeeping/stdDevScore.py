#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Calculates standard deviation of the TL and BL
#

import os
import urllib2
import numpy
import traceback
import logging
import sqlite3 as lite


def getScoreSD(curHisScr, stockID):
    try:
        curHisScr.execute('SELECT SCORE FROM HISTORICAL_SCORE WHERE STOCK_ID = ?', (stockID,))

        rows = curHisScr.fetchall()

        stdDev = 9999
        noOfRows = len(rows)
        growthList = []

        if noOfRows > 100:
            for i in range(noOfRows-1):
                growthList.append(getGrowth(rows[i][0], rows[i+1][0]))

            stdDev = round(numpy.std(growthList, ddof=1), 2)

        return stdDev
    except:
        return 9999


def getGrowth(d1, d2):
    return (d1 - d2)*100/d2


def main():
    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.DEBUG)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        curHisScr = con.cursor()
        curMaster = con.cursor()
        curScore = con.cursor()

        curMaster.execute('SELECT ID FROM MASTER')

        rows = curMaster.fetchall()

        # Loop thru the data
        for row in rows:

            try:
                stockID = row[0]
                scoreSD = getScoreSD(curHisScr, stockID)

                curScore.execute('UPDATE SCORE SET STD_DEV_SCORE = ? WHERE ID = ?', (scoreSD, stockID))

                logging.info(str(stockID) + ',' + str(scoreSD))

            except Exception:
                logging.info('Exception raised while processing: ' + str(stockID))
                logging.info(traceback.format_exc())

    except lite.Error as er:
        logging.info(er)
    finally:
        con.commit()
        con.close()

    logging.info('Finished run!')


if __name__ == '__main__':
    main()
