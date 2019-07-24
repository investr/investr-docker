#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Manually insert a company and ALL its details
#

import os
import sys
import traceback
import requests
import logging
import sqlite3 as lite

def main():

    stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
    con = lite.connect(stocksDBLocation)
    cur = con.cursor()

    print '*****************************************************************'
    print '********* Form To Insert Basic Company Data Manually ************'
    print '*****************************************************************'

    # Basic Details
    myid = int(raw_input('=> Unique ID: '))
    name = str(raw_input('=> Name: '))
    sector = str(raw_input('=> Sectors: '))
    nse = str(raw_input('=> NSE Code: '))
    bse = str(raw_input('=> BSE Code: '))
    mcUrl = str(raw_input('=> MC URL: '))
    mcCode = str(raw_input('=> MC Code: '))
    mcName = str(raw_input('=> MC Name: '))
    sOrC = str(raw_input('=> Standalone/Consolidate: '))
    shares = str(raw_input('=> No. of Shares (in crores): '))

    # Yearly Details

    # Assets and Liabilities
    rawInput = raw_input('=> Yearly Total Assests for 2 Years (in Crores): ').split()
    totalAssetsY1 = float(rawInput[0].replace(',', ''))
    totalAssetsY2 = float(rawInput[1].replace(',', ''))

    rawInput = raw_input('=> Yearly Current Assests for 2 Years (in Crores): ').split()
    currentAssetsY1 = float(rawInput[0].replace(',', ''))
    currentAssetsY2 = float(rawInput[1].replace(',', ''))

    rawInput = raw_input('=> Yearly Current Liabilities for 2 Years (in Crores): ').split()
    currentLiabilitiesY1 = float(rawInput[0].replace(',', ''))
    currentLiabilitiesY2 = float(rawInput[1].replace(',', ''))

    rawInput = raw_input('=> Yearly Earnings for 2 Years (in Crores): ').split()
    earningsY1 = float(rawInput[0].replace(',', ''))
    earningsY2 = float(rawInput[1].replace(',', ''))

    rawInput = raw_input('=> Yearly Interest for 2 Years (in Crores): ').split()
    interestY1 = float(rawInput[0].replace(',', ''))
    interestY2 = float(rawInput[1].replace(',', ''))

    rawInput = raw_input('=> Yearly Profits for 2 Years (in Crores): ').split()
    profitsY1 = float(rawInput[0].replace(',', ''))
    profitsY2 = float(rawInput[1].replace(',', ''))

    rawInput = raw_input('=> Yearly Book Value for 2 Years: ').split()
    bvY1 = float(rawInput[0].replace(',', ''))
    bvY2 = float(rawInput[1].replace(',', ''))

    rawInput = raw_input('=> Yearly Dividend for 2 Years: ').split()
    dyY1 = float(rawInput[0].replace(',', ''))
    dyY2 = float(rawInput[1].replace(',', ''))

    yearEnds = str(raw_input('=> Financial Year Ends (E.g. Mar or Dec): '))

    # Quarterly Details
    lastQtr = str(raw_input('=> Last Quarter (E.g. Dec 17): '))
    rawInput = raw_input('=> Quarterly Earnings for 8 Quarters (in Crores): ').split()
    earningsQ1 = float(rawInput[0].replace(',', ''))
    earningsQ2 = float(rawInput[1].replace(',', ''))
    earningsQ3 = float(rawInput[2].replace(',', ''))
    earningsQ4 = float(rawInput[3].replace(',', ''))
    earningsQ5 = float(rawInput[4].replace(',', ''))
    earningsQ6 = float(rawInput[5].replace(',', ''))
    earningsQ7 = float(rawInput[6].replace(',', ''))
    earningsQ8 = float(rawInput[7].replace(',', ''))

    rawInput = raw_input('=> Quarterly Interest for 8 Quarters (in Crores): ').split()
    interestQ1 = float(rawInput[0].replace(',', ''))
    interestQ2 = float(rawInput[1].replace(',', ''))
    interestQ3 = float(rawInput[2].replace(',', ''))
    interestQ4 = float(rawInput[3].replace(',', ''))
    interestQ5 = float(rawInput[4].replace(',', ''))
    interestQ6 = float(rawInput[5].replace(',', ''))
    interestQ7 = float(rawInput[6].replace(',', ''))
    interestQ8 = float(rawInput[7].replace(',', ''))

    rawInput = raw_input('=> Quarterly Profits for 8 Quarters (in Crores): ').split()
    profitsQ1 = float(rawInput[0].replace(',', ''))
    profitsQ2 = float(rawInput[1].replace(',', ''))
    profitsQ3 = float(rawInput[2].replace(',', ''))
    profitsQ4 = float(rawInput[3].replace(',', ''))
    profitsQ5 = float(rawInput[4].replace(',', ''))
    profitsQ6 = float(rawInput[5].replace(',', ''))
    profitsQ7 = float(rawInput[6].replace(',', ''))
    profitsQ8 = float(rawInput[7].replace(',', ''))


    yOrN = int(raw_input('Do you want to update the database? (1/0): '))

    if yOrN == 1:
        try:
            cur.execute('INSERT INTO MASTER (ID, NAME, SECTOR, NSE_CODE, BSE_CODE, MC_CODE, MC_NAME, MC_URL, MC_S_OR_C, LAST_QTR, YEAR_ENDS, \
                                             EARNINGS_Q1, EARNINGS_Q2, EARNINGS_Q3, EARNINGS_Q4, EARNINGS_Q5, EARNINGS_Q6, EARNINGS_Q7, EARNINGS_Q8, \
                                             INTEREST_Q1, INTEREST_Q2, INTEREST_Q3, INTEREST_Q4, INTEREST_Q5, INTEREST_Q6, INTEREST_Q7, INTEREST_Q8, \
                                             PROFITS_Q1,  PROFITS_Q2,  PROFITS_Q3,  PROFITS_Q4,  PROFITS_Q5,  PROFITS_Q6,  PROFITS_Q7,  PROFITS_Q8, \
                                             EARNINGS_Y1, EARNINGS_Y2, INTEREST_Y1, INTEREST_Y2, PROFITS_Y1, PROFITS_Y2, \
                                             EQ_SHR_CAP_Q1, EQ_SHR_CAP_Q2, FV_Q1, FV_Q2, FV_Q3, FV_Q4, \
                                             BV_Y1, BV_Y2, DIV_Y1, DIV_Y2, EQ_SHR_CAP_TTM \
                                             ) \
                                             VALUES \
                                             (?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?)', \
                                            (myid, name, sector, nse, bse, mcCode, mcName, mcUrl, sOrC, lastQtr, yearEnds, \
                                             earningsQ1, earningsQ2, earningsQ3, earningsQ4, earningsQ5, earningsQ6, earningsQ7, earningsQ8, \
                                             interestQ1, interestQ2, interestQ3, interestQ4, interestQ5, interestQ6, interestQ7, interestQ8, \
                                             profitsQ1,  profitsQ2,  profitsQ3,  profitsQ4,  profitsQ5,  profitsQ6,  profitsQ7,  profitsQ8, \
                                             earningsY1, earningsY2, interestY1, interestY2, profitsY1,  profitsY2, \
                                             totalAssetsY1, totalAssetsY2, currentAssetsY1, currentAssetsY2, currentLiabilitiesY1, currentLiabilitiesY2, \
                                             bvY1, bvY2, dyY1, dyY2, shares))

            cur.execute('INSERT INTO SCORE (ID, PE_LOW, PE_HIGH) VALUES (?, ?, ?)', (myid, 10, 20))

            print '### Row Inserted! ###'
            print '### Dont forget to update high and low PE in SCORE using: ###'
            print '### UPDATE SCORE SET PE_LOW = 10, PE_HIGH = 20 WHERE ID = nnnn ###'
            print '### Run stdDevDMAUpdate.sh, priceUpdate.sh and 200dmaUpdate.sh'
        except Exception, err:
            sys.stderr.write('ERROR: %s\n' % str(err))

    con.commit()
    con.close()

if __name__ == '__main__':
    main()
