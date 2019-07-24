#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Automatic quarterly update
# Popultes the MASTER TABLE of stocks.db with fundamental data.
#
# Also calculates the quaterly growth of income and profit of all
# the 500+ companies in the MASTER table and store them.
 #
# Change value of LAST_QUARTER variable to the quarter that needs to be updated
# Note: This script silently passes the exceptions so be careful!
# Check the log file for any exceptions.
#


import os
import traceback
import requests
import logging
import sqlite3 as lite
from utils import *
from moneyControl import *
from progressbar import ProgressBar
from BeautifulSoup import BeautifulSoup


LAST_QUARTER = 'Jun 19'
BANKS_IDS = [2006,2589,2679,3055,3152,3177,3287,3297,3647,3725,4082,4257,4326,4866,5170,5185,5441,5551,5736,5999, \
             6039,6235,6497,6783,7084,7118,7286,7922,7964,8449,8660,8734,9104,9261,9419,9498,9507,9639,9903,2426]
NBFC_IDS = [1113,1470,1566,1689,2142,2171,2850,3607,4101,4551,5471,5689,5916,6265,6306,6371,6446,6619,\
            6642,6969,7191,7326,7887,8094,8116,8344,9914,9930,9998,2428,4333,2932,2634,4643,5699,2645]
MANUAL_UPDATE_ONLY = []

def main():

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.INFO)
    logging.getLogger("requests").setLevel(logging.WARNING)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        # Get the tables in this DB
        cur.execute('SELECT ID, MC_CODE, MC_NAME, MC_S_OR_C, LAST_QTR,\
                            EARNINGS_Q1, EARNINGS_Q2, EARNINGS_Q3, EARNINGS_Q4, EARNINGS_Q5, EARNINGS_Q6, EARNINGS_Q7,\
                            INTEREST_Q1, INTEREST_Q2, INTEREST_Q3, INTEREST_Q4, INTEREST_Q5, INTEREST_Q6, INTEREST_Q7,\
                            PROFITS_Q1,  PROFITS_Q2,  PROFITS_Q3,  PROFITS_Q4,  PROFITS_Q5,  PROFITS_Q6,  PROFITS_Q7\
                    FROM MASTER')

        rows = cur.fetchall()

        # Will have the qtrly results of the company that have been upated
        emailBody = ""

        # Loop thru the data
        pbar = ProgressBar()
        for row in pbar(rows):

            try:
                myid = row[0]
                mcCode = row[1]
                mcName = row[2]
                mcSOrC = row[3]
                availableQtr = row[4]

                if myid in MANUAL_UPDATE_ONLY:
                    continue

                # If the existing result information is for the last quarter then dont insert it again.
                if availableQtr == LAST_QUARTER:
                    continue

                earningsQ2 = row[5]
                earningsQ3 = row[6]
                earningsQ4 = row[7]
                earningsQ5 = row[8]
                earningsQ6 = row[9]
                earningsQ7 = row[10]
                earningsQ8 = row[11]
                interestQ2 = row[12]
                interestQ3 = row[13]
                interestQ4 = row[14]
                interestQ5 = row[15]
                interestQ6 = row[16]
                interestQ7 = row[17]
                interestQ8 = row[18]
                profitsQ2  = row[19]
                profitsQ3  = row[20]
                profitsQ4  = row[21]
                profitsQ5  = row[22]
                profitsQ6  = row[23]
                profitsQ7  = row[24]
                profitsQ8  = row[25]

                #
                # Get details about quarterly results from the main MC site.
                #
                if mcSOrC == 'consolidate':
                    url = 'http://www.moneycontrol.com/financials/%s/results/consolidated-quarterly-results/%s' % (mcName, mcCode)
                elif mcSOrC == 'standalone':
                    url = 'http://www.moneycontrol.com/financials/%s/results/quarterly-results/%s' % (mcName, mcCode)

                quarterlyPL = requests.get(url)
                parsedHtml = BeautifulSoup(quarterlyPL.text)

                lastQtr = getLastQuarterNameMain(parsedHtml).replace('\'', '')

                # If the last qtr available in MC is not the last qtr that is coming out with results then dont update.
                if lastQtr != LAST_QUARTER:
                    continue

                # We need to enter NBFCs manually as we need to use writeoffs in the interest field.
                if myid in NBFC_IDS:
                    logging.info("NBFC: Replace interest with writeoffs")
                    emailBody = emailBody + str(myid) + ' ' + mcName + ' - NBFC: Replace interest with writeoffs' + '\n'

                # For banks we get provision and contingencies and for other companies we get interest. We also need to add
                # various heads to calculate total earnings for a bank
                if myid not in BANKS_IDS:
                    earningsQ1 = getMCData(parsedHtml, 'Total Income From Operations', 1)
                    interestQ1 = getMCData(parsedHtml, 'Interest', 1)
                else:
                    aQ1 = getMCData(parsedHtml, '(a) Int. /Disc. on Adv/Bills', 1)
                    bQ1 = getMCData(parsedHtml, '(b) Income on Investment', 1)
                    cQ1 = getMCData(parsedHtml, '(c) Int. on balances With RBI', 1)
                    dQ1 = getMCData(parsedHtml, '(d) Others', 1)
                    eQ1 = getMCData(parsedHtml, 'Other Income', 1)
                    earningsQ1 = aQ1 + bQ1 + cQ1 + dQ1 + eQ1

                    interestQ1 = getMCData(parsedHtml, 'Provisions And Contingencies', 1)

                # Try to get M.I & Accociates first. If it does not exist then we are returned -999.99.
                profitsQ1 = getMCData(parsedHtml, 'Net P/L After M.I & Associates', 1)
                if profitsQ1 == -999.99:
                    profitsQ1 = getMCData(parsedHtml, 'Net Profit/(Loss) For the Period', 1)

                cur.execute('UPDATE MASTER SET \
                                    LAST_QTR = ?, \
                                    EARNINGS_Q1 = ?, \
                                    EARNINGS_Q2 = ?, \
                                    EARNINGS_Q3 = ?, \
                                    EARNINGS_Q4 = ?, \
                                    EARNINGS_Q5 = ?, \
                                    EARNINGS_Q6 = ?, \
                                    EARNINGS_Q7 = ?, \
                                    EARNINGS_Q8 = ?, \
                                    INTEREST_Q1 = ?, \
                                    INTEREST_Q2 = ?, \
                                    INTEREST_Q3 = ?, \
                                    INTEREST_Q4 = ?, \
                                    INTEREST_Q5 = ?, \
                                    INTEREST_Q6 = ?, \
                                    INTEREST_Q7 = ?, \
                                    INTEREST_Q8 = ?, \
                                    PROFITS_Q1 = ?, \
                                    PROFITS_Q2 = ?, \
                                    PROFITS_Q3 = ?, \
                                    PROFITS_Q4 = ?, \
                                    PROFITS_Q5 = ?, \
                                    PROFITS_Q6 = ?, \
                                    PROFITS_Q7 = ?, \
                                    PROFITS_Q8 = ? \
                            WHERE ID = ?;',
                                    (lastQtr, \
                                     earningsQ1, earningsQ2, earningsQ3, earningsQ4, earningsQ5, earningsQ6, earningsQ7, earningsQ8, \
                                     interestQ1, interestQ2, interestQ3, interestQ4, interestQ5, interestQ6, interestQ7, interestQ8, \
                                     profitsQ1,  profitsQ2,  profitsQ3,  profitsQ4,  profitsQ5,  profitsQ6,  profitsQ7,  profitsQ8, \
                                     myid))

                logging.info('Updating ID: %s | Name: %s | Last Qtr: %s \n\
                                EQ1: %s | EQ2: %s | EQ3: %s | EQ4: %s | EQ5: %s \n\
                                IQ1: %s | IQ2: %s | IQ3: %s | IQ5: %s | IQ5: %s \n\
                                PQ1: %s | PQ2: %s | PQ3: %s | PQ5: %s | PQ5: %s \n',
                                myid, mcName, lastQtr, \
                                earningsQ1, earningsQ2, earningsQ3, earningsQ4, earningsQ5, \
                                interestQ1, interestQ2, interestQ3, interestQ4, interestQ5, \
                                profitsQ1, profitsQ2, profitsQ3, profitsQ4, profitsQ5)

                emailBody = emailBody + str(myid) + ' ' + mcName + '\n'

            except:
                logging.info('Exception raised while processing: ' + str(myid))
                logging.info(traceback.format_exc())

        # To enable email notification you need to first setup utils.py and then uncomment the line below
        # mail("yourmailid@yourmailprovider.com", "Quarterly update completed successful run!", emailBody)

    except lite.Error as er:
        logging.info(er)
    finally:
        con.commit()
        con.close()

    logging.info('Finished full run!')


if __name__ == '__main__':
    main()
