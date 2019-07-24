#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Popultes the SCORE TABLE of stocks.db with points scored base on MASTER table.
#

import os
import urllib2
import traceback
import logging
import sqlite3 as lite


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
        curMaster.execute('SELECT ID, BSE_CODE FROM MASTER')

        rows = curMaster.fetchall()

        # Loop thru the data
        for row in rows:

            try:
                myid = row[0]
                bseCode = row[1]

                curHisScr.execute('SELECT AVG(PRICE) FROM (SELECT PRICE FROM HISTORICAL_SCORE WHERE STOCK_ID = ? ORDER BY DATE(DT) DESC LIMIT 200)', (myid,))
                avgPriceRow = curHisScr.fetchone()

                curScore.execute('UPDATE SCORE SET PERCENTAGE_SCORED_OLD = ? WHERE ID = ?', (avgPriceRow[0], myid))

                logging.info('Stock ID: ' + str(myid) + ' Updated with: ' + str(avgPriceRow[0]))

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
