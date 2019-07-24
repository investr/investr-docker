#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Update Assets and Liabilities from the Balance Sheet
#


import os
import traceback
import requests
import logging
import sqlite3 as lite
from utils import *
from moneyControl import *
from BeautifulSoup import BeautifulSoup

def main():

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.DEBUG)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        # Get the tables in this DB
        cur.execute('SELECT ID, MC_CODE, MC_NAME, MC_S_OR_C FROM MASTER')

        rows = cur.fetchall()

        # Loop thru the data
        for row in rows:

            try:
                myid = row[0]
                mcCode = row[1]
                mcName = row[2]
                mcSOrC = row[3]

                logging.info('Processing ... ' + str(myid))

                if mcSOrC == 'consolidate':
                    url = 'http://www.moneycontrol.com/financials/%s/consolidated-balance-sheetVI/%s' % (mcName, mcCode)
                elif mcSOrC == 'standalone':
                    url = 'http://www.moneycontrol.com/financials/%s/balance-sheetVI/%s' % (mcName, mcCode)

                logging.info('Fetching ... ' + url)

                balSheet = requests.get(url)
                parsedHtml = BeautifulSoup(balSheet.text)

                (totalAssetsY1, totalAssetsY2) = getMCData(parsedHtml, 'Total Assets', 2, 0, 1)
                (curAssets1, curAssets2) = getMCData(parsedHtml, 'Total Current Assets', 2, 0, 0)
                (curLiabilities1, curLiabilities2) = getMCData(parsedHtml, 'Total Current Liabilities', 2, 0, 0)


                cur.execute('UPDATE MASTER SET EQ_SHR_CAP_Q1 = ?, EQ_SHR_CAP_Q2 = ?, FV_Q1 = ?, FV_Q2 = ?, FV_Q3 = ?, FV_Q4 = ? WHERE ID = ?;',
                            (totalAssetsY1, totalAssetsY2, curAssets1, curAssets2, curLiabilities1, curLiabilities2, myid))

                logging.info('Updating ID: %s | ASS1: %s | ASS2: %s | CA1: %s | CA2: %s | CL1: %s | CL2: %s', myid, totalAssetsY1, totalAssetsY2, curAssets1, curAssets2, curLiabilities1, curLiabilities2)

            except:
                logging.info('Exception raised while processing: ' + str(myid))
                logging.info(traceback.format_exc())

        # mail("yourmailid@yourmailprovider.com", "Quarterly update completed successful run!", "")

    except lite.Error as er:
        logging.info(er)
    finally:
        con.commit()
        con.close()

    logging.info('Finished full run!')


if __name__ == '__main__':
    main()
