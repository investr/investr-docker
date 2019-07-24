#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Manually update a company and ALL its details
#

import os
import sys
import traceback
import requests
import logging
import sqlite3 as lite

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def main():
    stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
    con = lite.connect(stocksDBLocation)
    cur = con.cursor()

    print bcolors.BOLD + '****************************************************************************************************' + bcolors.ENDC
    print bcolors.BOLD + '******************************** Form To Update/Rectify Results Manually ***************************' + bcolors.ENDC
    print bcolors.BOLD + '****************************************************************************************************' + bcolors.ENDC

    myid = input('Company ID: ')
    cur.execute('SELECT NAME, SECTOR, NSE_CODE, BSE_CODE, MC_CODE, MC_NAME, MC_URL, MC_S_OR_C, LAST_QTR, \
                EARNINGS_Q1,   EARNINGS_Q2,   EARNINGS_Q3,  EARNINGS_Q4, EARNINGS_Q5, \
                INTEREST_Q1,   INTEREST_Q2,   INTEREST_Q3,  INTEREST_Q4, INTEREST_Q5, \
                PROFITS_Q1,    PROFITS_Q2,    PROFITS_Q3,   PROFITS_Q4,  PROFITS_Q5, \
                EPS_Q1,        EPS_Q2,        EPS_Q3,       EPS_Q4,      EPS_Q5, \
                EARNINGS_Y1,   EARNINGS_Y2,   INTEREST_Y1,  INTEREST_Y2, PROFITS_Y1, PROFITS_Y2, \
                EQ_SHR_CAP_Q1, EQ_SHR_CAP_Q2, FV_Q1,        FV_Q2,       FV_Q3,      FV_Q4, \
                EPS_Y1,        EPS_Y2,        BV_Y1,        BV_Y2,       DIV_Y1,     DIV_Y2, \
                EQ_SHR_CAP_TTM FROM MASTER WHERE ID = ?', (myid,))

    row = cur.fetchone()

    print bcolors.BOLD + '****************************************************************************************************' + bcolors.ENDC
    print bcolors.BOLD + '**************************************** Currently Available Data **********************************' + bcolors.ENDC
    print bcolors.BOLD + '****************************************************************************************************' + bcolors.ENDC

    name = row[0]
    sector = row[1]
    nse = row[2]
    bse = row[3]
    mcCode = row[4]
    mcName = row[5]
    mcUrl = row[6]
    sOrC = row[7]
    lastQtr = row[8]
    earningsQ1 = row[9]
    earningsQ2 = row[10]
    earningsQ3 = row[11]
    earningsQ4 = row[12]
    earningsQ5 = row[13]
    interestQ1 = row[14]
    interestQ2 = row[15]
    interestQ3 = row[16]
    interestQ4 = row[17]
    interestQ5 = row[18]
    profitsQ1 = row[19]
    profitsQ2 = row[20]
    profitsQ3 = row[21]
    profitsQ4 = row[22]
    profitsQ5 = row[23]
    epsQ1 = row[24]
    epsQ2 = row[25]
    epsQ3 = row[26]
    epsQ4 = row[27]
    epsQ5 = row[28]
    earningsY1 = row[29]
    earningsY2 = row[30]
    interestY1 = row[31]
    interestY2 = row[32]
    profitsY1 = row[33]
    profitsY2 = row[34]
    totalAssetsY1 = row[35]
    totalAssetsY2 = row[36]
    currentAssetsY1 = row[37]
    currentAssetsY2 = row[38]
    currentLiabilitiesY1 = row[39]
    currentLiabilitiesY2 = row[40]
    epsY1 = row[41]
    epsY2 = row[42]
    bvY1 = row[43]
    bvY2 = row[44]
    dyY1 = row[45]
    dyY2 = row[46]
    shares = row[47]

    # Check nse for NoneType
    if nse is None:
        nse = ''

    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [1] Name: ' + name + ' | [2] Sectors: ' + sector
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [3] NSE Code: ' + nse + ' | [4] BSE Code: ' + bse
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [5] MC Code: ' + mcCode + ' | [6] MC Name: ' + mcName
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [7] MC URL: ' + mcUrl
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [8] Standalone/Consolidate: ' + sOrC
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [9] Last Quarter: ' + lastQtr
    print '+----------+-----------------------------------------------------------------------------------------------------------------------------+'
    print '| Earnings | [10] Q1: ' + str(earningsQ1) + ' | [11] Q2: ' + str(earningsQ2) + ' | [12] Q3: ' + str(earningsQ3) + ' | [13] Q4: ' + str(earningsQ4) + ' | [14] Q5: ' + str(earningsQ5)
    print '+----------+-----------------------------------------------------------------------------------------------------------------------------+'
    print '| Interest | [15] Q1: ' + str(interestQ1) + ' | [16] Q2: ' + str(interestQ2) + ' | [17] Q3: ' + str(interestQ3) + ' | [18] Q4: ' + str(interestQ4) + ' | [19] Q5: ' + str(interestQ5)
    print '+----------+-----------------------------------------------------------------------------------------------------------------------------+'
    print '| Profits  | [20] Q1: ' + str(profitsQ1) + ' | [21] Q2: ' + str(profitsQ2) + ' | [22] Q3: ' + str(profitsQ3) + ' | [23] Q4: ' + str(profitsQ4) + ' | [24] Q5: ' + str(profitsQ5)
    print '+----------+-----------------------------------------------------------------------------------------------------------------------------+'
    print '| EPS      | [25] Q1: ' + str(epsQ1) + ' | [26] Q2: ' + str(epsQ2) + ' | [27] Q3: ' + str(epsQ3) + ' | [28] Q4: ' + str(epsQ4) + ' | [29] Q5: ' + str(epsQ5)
    print '+----------+-----------------------------------------------------------------------------------------------------------------------------+'
    print '| [30] Earnings Y1: ' + str(earningsY1) + ' | [31] Earnings Y2: ' + str(earningsY2)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [32] Interest Y1: ' + str(interestY1) + ' | [33] Interest Y2: ' + str(interestY2)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [34] Profits Y1: ' + str(profitsY1) + ' | [35] Profits Y2: ' + str(profitsY2)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [36] EPS Y1: ' + str(epsY1) + ' | [37] EPS Y2: ' + str(epsY2)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [38] Book Value Y1: ' + str(bvY1) + ' | [39] Book Value Y2: ' + str(bvY2)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [40] Dividend Y1: ' + str(dyY1) + ' | [41] Dividend Y2: ' + str(dyY2) + ' | [42] Shares: ' + str(shares)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [43] Total Assets Y1: ' + str(totalAssetsY1) + ' | [44] Total Assets Y2: ' + str(totalAssetsY2)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [45] Current Assets Y1: ' + str(currentAssetsY1) + ' | [46] Current Assets Y2: ' + str(currentAssetsY2)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| [47] Current Liabilities Y1: ' + str(currentLiabilitiesY1) + ' | [48] Current Liabilities Y2: ' + str(currentLiabilitiesY2)
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'

    rawInput = raw_input('Enter Sr No Of Parameter That You Wish To Change. 0 For Exit.): ').split()
    rawInput = map(int, rawInput)

    for index in range(len(rawInput)):

        if rawInput[index] not in rawInput:
            break;

        if rawInput[index] == 1:
            name = str(raw_input('=> Name: '))
        if rawInput[index] == 2:
            sector = str(raw_input('=> Sectors: '))
        if rawInput[index] == 3:
            nse = str(raw_input('=> NSE Code: '))
        if rawInput[index] == 4:
            bse = str(raw_input('=> BSE Code: '))
        if rawInput[index] == 5:
            mcCode = str(raw_input('=> MC Code: '))
        if rawInput[index] == 6:
            mcName = str(raw_input('=> MC Name: '))
        if rawInput[index] == 7:
            mcUrl = str(raw_input('=> MC URL: '))
        if rawInput[index] == 8:
            sOrC = str(raw_input('=> Standalone/Consolidate: '))
        if rawInput[index] == 9:
            lastQtr = str(raw_input('=> Last Quarter (E.g. Mar 16): '))
        if rawInput[index] == 10:
            earningsQ1 = float(raw_input('=> Earnings Q1 (in Crores): '))
        if rawInput[index] == 11:
            earningsQ2 = float(raw_input('=> Earnings Q2 (in Crores): '))
        if rawInput[index] == 12:
            earningsQ3 = float(raw_input('=> Earnings Q3 (in Crores): '))
        if rawInput[index] == 13:
            earningsQ4 = float(raw_input('=> Earnings Q4 (in Crores): '))
        if rawInput[index] == 14:
            earningsQ5 = float(raw_input('=> Earnings Q5 (in Crores): '))
        if rawInput[index] == 15:
            interestQ1 = float(raw_input('=> Interest Q1 (in Crores): '))
        if rawInput[index] == 16:
            interestQ2 = float(raw_input('=> Interest Q2 (in Crores): '))
        if rawInput[index] == 17:
            interestQ3 = float(raw_input('=> Interest Q3 (in Crores): '))
        if rawInput[index] == 18:
            interestQ4 = float(raw_input('=> Interest Q4 (in Crores): '))
        if rawInput[index] == 19:
            interestQ5 = float(raw_input('=> Interest Q5 (in Crores): '))
        if rawInput[index] == 20:
            profitsQ1 = float(raw_input('=> Profits Q1 (in Crores): '))
        if rawInput[index] == 21:
            profitsQ2 = float(raw_input('=> Profits Q2 (in Crores): '))
        if rawInput[index] == 22:
            profitsQ3 = float(raw_input('=> Profits Q3 (in Crores): '))
        if rawInput[index] == 23:
            profitsQ4 = float(raw_input('=> Profits Q4 (in Crores): '))
        if rawInput[index] == 24:
            profitsQ5 = float(raw_input('=> Profits Q5 (in Crores): '))
        if rawInput[index] == 25:
            epsQ1 = float(raw_input('=> EPS Q1: '))
        if rawInput[index] == 26:
            epsQ2 = float(raw_input('=> EPS Q2: '))
        if rawInput[index] == 27:
            epsQ3 = float(raw_input('=> EPS Q3: '))
        if rawInput[index] == 28:
            epsQ4 = float(raw_input('=> EPS Q4: '))
        if rawInput[index] == 29:
            epsQ5 = float(raw_input('=> EPS Q5: '))
        if rawInput[index] == 30:
            earningsY1 = float(raw_input('=> Earnings Y1 (in Crores): '))
        if rawInput[index] == 31:
            earningsY2 = float(raw_input('=> Earnings Y2 (in Crores): '))
        if rawInput[index] == 32:
            interestY1 = float(raw_input('=> Interest Y1 (in Crores): '))
        if rawInput[index] == 33:
            interestY2 = float(raw_input('=> Interest Y2 (in Crores): '))
        if rawInput[index] == 34:
            profitsY1 = float(raw_input('=> Profits Y1 (in Crores): '))
        if rawInput[index] == 35:
            profitsY2 = float(raw_input('=> Profits Y2 (in Crores): '))
        if rawInput[index] == 36:
            epsY1 = float(raw_input('=> EPS Y1: '))
        if rawInput[index] == 37:
            epsY2 = float(raw_input('=> EPS Y2: '))
        if rawInput[index] == 38:
            bvY1 = float(raw_input('=> Book Value Y1: '))
        if rawInput[index] == 39:
            bvY2 = float(raw_input('=> Book Value Y2: '))
        if rawInput[index] == 40:
            dyY1 = float(raw_input('=> Dividend Y1: '))
        if rawInput[index] == 41:
            dyY2 = float(raw_input('=> Dividend Y2: '))
        if rawInput[index] == 42:
            shares = float(raw_input('=> Shares (in Crores): '))
        if rawInput[index] == 43:
            totalAssetsY1 = float(raw_input('=> Total Assets Y1 (in Crores): '))
        if rawInput[index] == 44:
            totalAssetsY2 = float(raw_input('=> Total Assets Y2 (in Crores): '))
        if rawInput[index] == 45:
            currentAssetsY1 = float(raw_input('=> Current Assets Y1 (in Crores): '))
        if rawInput[index] == 46:
            currentAssetsY2 = float(raw_input('=> Current Assets Y2 (in Crores): '))
        if rawInput[index] == 47:
            currentLiabilitiesY1 = float(raw_input('=> Current Liabilities Y1 (in Crores): '))
        if rawInput[index] == 48:
            currentLiabilitiesY2 = float(raw_input('=> Current Liabilities Y2 (in Crores): '))

    if len(rawInput) > 0 and rawInput[0] != 0:
        yOrN = int(raw_input('Do you want to update the database? (1/0): '))

        if yOrN == 1:
            try:
                cur.execute('UPDATE MASTER SET NAME = ?, SECTOR = ?, NSE_CODE = ?, BSE_CODE = ?, MC_CODE = ?, MC_NAME = ?, MC_URL = ?, MC_S_OR_C = ?, LAST_QTR = ?, \
                                                 EARNINGS_Q1 = ?,   EARNINGS_Q2 = ?,   EARNINGS_Q3 = ?, EARNINGS_Q4 = ?, EARNINGS_Q5 = ?, \
                                                 INTEREST_Q1 = ?,   INTEREST_Q2 = ?,   INTEREST_Q3 = ?, INTEREST_Q4 = ?, INTEREST_Q5 = ?, \
                                                 PROFITS_Q1 = ?,    PROFITS_Q2 = ?,    PROFITS_Q3 = ?,  PROFITS_Q4 = ?,  PROFITS_Q5 = ?, \
                                                 EPS_Q1 = ?,        EPS_Q2 = ?,        EPS_Q3 = ?,      EPS_Q4 = ?,      EPS_Q5 = ?, \
                                                 EARNINGS_Y1 = ?,   EARNINGS_Y2 = ?,   INTEREST_Y1 = ?, INTEREST_Y2 = ?, PROFITS_Y1 = ?, PROFITS_Y2 = ?, \
                                                 EQ_SHR_CAP_Q1 = ?, EQ_SHR_CAP_Q2 = ?, FV_Q1 = ?,       FV_Q2 = ?,       FV_Q3 = ?,      FV_Q4 = ?, \
                                                 EPS_Y1 = ?,        EPS_Y2 = ?,        BV_Y1 = ?,       BV_Y2 = ?,       DIV_Y1 = ?,     DIV_Y2 = ?, EQ_SHR_CAP_TTM = ? \
                                                 WHERE ID = ?;', \
                                                 (name, sector, nse, bse, mcCode, mcName, mcUrl, sOrC, lastQtr, \
                                                 earningsQ1, earningsQ2, earningsQ3, earningsQ4, earningsQ5, \
                                                 interestQ1, interestQ2, interestQ3, interestQ4, interestQ5, \
                                                 profitsQ1, profitsQ2, profitsQ3, profitsQ4, profitsQ5, \
                                                 epsQ1, epsQ2, epsQ3, epsQ4, epsQ5, \
                                                 earningsY1, earningsY2, interestY1, interestY2, profitsY1, profitsY2, \
                                                 totalAssetsY1, totalAssetsY2, currentAssetsY1, currentAssetsY2, currentLiabilitiesY1, currentLiabilitiesY2, \
                                                 epsY1, epsY2, bvY1, bvY2, dyY1, dyY2, shares, myid))


                print '### Row Updated! ###'
            except Exception, err:
                sys.stderr.write('ERROR: %s\n' % str(err))

    con.commit()
    con.close()

if __name__ == '__main__':
    main()
