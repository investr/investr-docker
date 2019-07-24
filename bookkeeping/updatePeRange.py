#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Update LOW and HIGH PE range
#

import os
import sys
import json
import urllib2
import traceback
import logging
import sqlite3 as lite
from progressbar import ProgressBar
from utils import *


def main():
    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.INFO)
    logging.getLogger("requests").setLevel(logging.WARNING)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        curMaster = con.cursor()
        curHisScr = con.cursor()
        curScore = con.cursor()

        # Get the tables in this DB
        curMaster.execute('SELECT ID FROM MASTER')

        rows = curMaster.fetchall()

        # Loop thru the data
        pbar = ProgressBar()
        for row in pbar(rows):
            try:
                myid = row[0]

                curHisScr.execute('SELECT CAST(ATTR1 AS REAL) FROM HISTORICAL_SCORE WHERE STOCK_ID = ? ORDER BY DATE(DT) DESC', (myid,))
                peTuple = curHisScr.fetchall()
                peList = [i[0] for i in peTuple]

                peList = [x for x in peList if x is not None]

                peList.sort()
                daysToConsider = 92
                peLowRange = round(sum(peList[:daysToConsider])/daysToConsider, 2)
                peHighRange = round(sum(peList[-daysToConsider:])/daysToConsider, 2)

                curScore.execute('UPDATE SCORE SET PE_LOW = ?, PE_HIGH = ? WHERE ID = ?', (peLowRange, peHighRange, myid))

                logging.info('ID: ' + str(myid) + ' PE LOW: ' + str(peLowRange) + ' PE HIGH: ' + str(peHighRange))
            except Exception:
                logging.info('Exception raised while processing: ' + str(myid))
                logging.info(traceback.format_exc())

    except lite.Error as er:
        logging.info(er)
    finally:
        con.commit()
        con.close()

    logging.info('Finished!')


if __name__ == '__main__':
    main()
