#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Send email to the subscribers if the any stocks in their watchlish
# are trading less than their 30 DMA.
#


import os
import json
import urllib2
import logging
import traceback
import mysql.connector
from utils import *


def generateDetails(name, currentPrice, dma30):

    percent = format(((dma30 - currentPrice)*100)/dma30, '.2f')

    return name + " @ " + str(currentPrice) + " (" + percent + "% below)\n"


def main():

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.DEBUG)

    mysqlCon = mysql.connector.connect(user="root", password="", host="localhost", database="investr")
    mysqlCur = mysqlCon.cursor()

    # The second 1 in 1 << 1, should match with the EMAIL_WATCHLIST constant in settings.html
    mysqlCur.execute('SELECT USER_ID FROM PREFS WHERE ((EMAIL_USER & (1 << 1)) > 0)')
    rows = mysqlCur.fetchall()

    # Loop thru the data

    for row in rows:
        userId = row[0]

        logging.info('Processing ... ' + str(userId))

        mysqlCur.execute('SELECT EMAIL FROM USERS WHERE ID = %s', (userId,))
        email = mysqlCur.fetchone()[0]

        # Collect the info which will be emailed
        emailBody = ""

        # Get watchlist stocks IDs for each user from the WATCHLIST table in MYSQL DB
        mysqlCur.execute('SELECT STOCK_ID FROM WATCHLIST WHERE USER_ID = %s', (userId,))
        stocksIds = mysqlCur.fetchall()

        for stocksId in stocksIds:
            logging.info(' ... ' + str(stocksId))
            mysqlCur.execute('SELECT M.PRICE, M.NAME, S.PERCENTAGE_SCORED FROM MASTER M, SCORE S WHERE M.ID = S.ID AND M.ID = %s', (stocksId))
            data = mysqlCur.fetchone()
            currentPrice = data[0]
            name = data[1]
            dma30 = data[2]

            if currentPrice < dma30:
                emailBody = emailBody + generateDetails(name, currentPrice, dma30)

        if emailBody:
            footerMessage = "\nSearch for \"Sep 18\" to search for companies whose Q4 results are out."
            emailBody = emailBody + footerMessage
            # To enable email notification you need to first setup utils.py and then uncomment the line below
            # mail(email, "List of your watchlist stocks trading below their 30 DMA", emailBody)

    mysqlCur.close()
    mysqlCon.close()

    logging.info('Finished 30 DMA vs Price Check!')


if __name__ == '__main__':
    main()
