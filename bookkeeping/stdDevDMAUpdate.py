#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Update standard deviation and daily moving averages
#

import os
import urllib2
import numpy
import traceback
import logging
import sqlite3 as lite


def getGrowth(d1, d2):
    return (d1 - d2)*100/d2


def main():

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.DEBUG)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        curMaster = con.cursor()
        curScore = con.cursor()
        curHisScr = con.cursor()

        # Get the tables in this DB
        curMaster.execute('SELECT ID, BSE_CODE, \
                           EARNINGS_Q1, EARNINGS_Q2, EARNINGS_Q3, EARNINGS_Q4, EARNINGS_Q5, \
                           PROFITS_Q1,  PROFITS_Q2,  PROFITS_Q3,  PROFITS_Q4,  PROFITS_Q5 \
                           FROM MASTER')

        rows = curMaster.fetchall()

        # Loop thru the data
        for row in rows:

            try:
                myid = row[0]
                bseCode = row[1]
                eq1 = row[2]
                eq2 = row[3]
                eq3 = row[4]
                eq4 = row[5]
                eq5 = row[6]
                pq1 = row[7]
                pq2 = row[8]
                pq3 = row[9]
                pq4 = row[10]
                pq5 = row[11]

                eList = []
                eList.append(getGrowth(eq1, eq2))
                eList.append(getGrowth(eq2, eq3))
                eList.append(getGrowth(eq3, eq4))
                eList.append(getGrowth(eq4, eq5))
                eSD = round(numpy.std(eList, ddof=1), 2)

                pList = []
                pList.append(getGrowth(pq1, pq2))
                pList.append(getGrowth(pq2, pq3))
                pList.append(getGrowth(pq3, pq4))
                pList.append(getGrowth(pq4, pq5))
                pSD = round(numpy.std(pList, ddof=1), 2)

                curHisScr.execute('SELECT AVG(PRICE) FROM (SELECT PRICE FROM HISTORICAL_SCORE WHERE STOCK_ID = ? ORDER BY DATE(DT) DESC LIMIT 30)', (myid,))
                avg30PriceRow = curHisScr.fetchone()

                curHisScr.execute('SELECT AVG(PRICE) FROM (SELECT PRICE FROM HISTORICAL_SCORE WHERE STOCK_ID = ? ORDER BY DATE(DT) DESC LIMIT 100)', (myid,))
                avg100PriceRow = curHisScr.fetchone()

                curScore.execute('UPDATE SCORE SET PERCENTAGE_SCORED = ?, ATTR1 = ?,\
                                               MAX_WEIGHTED_POINTS = ?, \
                                               SCORED_WEIGHTED_POINTS = ? \
                                  WHERE ID = ?', (avg30PriceRow[0], avg100PriceRow[0], eSD, pSD, myid))

                logging.info('Stock ID: ' + str(myid) + ' Updated with: ' + str(avg30PriceRow[0]) + ' and ' + str(avg100PriceRow[0]))

            except Exception:
                logging.info('Exception raised while processing: ' + str(myid))
                logging.info(traceback.format_exc())

    except lite.Error as er:
        logging.info(er)
    finally:
        con.commit()
        con.close()

    logging.info('Finished run!')


if __name__ == '__main__':
    main()
