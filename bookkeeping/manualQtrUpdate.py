#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Manually update a company with its quarterly results
#

import os
import sys
import traceback
import requests
import logging
import sqlite3 as lite

def main():

    # Get the arguments passed in the following format:
    # 1st parameter: File Name
    # 2nd parameter: Company ID
    # 3rd parameter: Operational Income (Revenue or TL)
    # 4th parameter: Interest
    # 5th parameter: Net Profit with minority interest but without comprehensive income
    if len(sys.argv) != 5:
        print 'Pass correct number of parameters!'
        exit()

    args = sys.argv

    stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
    con = lite.connect(stocksDBLocation)
    cur = con.cursor()

    print '*****************************************************************'
    print '********* Form To Input Quarterly Results Manually **************'
    print '*****************************************************************'

    myid = int(args[1])

    cur.execute('SELECT EARNINGS_Q1, EARNINGS_Q2, EARNINGS_Q3, EARNINGS_Q4, EARNINGS_Q5, EARNINGS_Q6, EARNINGS_Q7,\
                        INTEREST_Q1, INTEREST_Q2, INTEREST_Q3, INTEREST_Q4, INTEREST_Q5, INTEREST_Q6, INTEREST_Q7,\
                        PROFITS_Q1,  PROFITS_Q2,  PROFITS_Q3,  PROFITS_Q4,  PROFITS_Q5,  PROFITS_Q6,  PROFITS_Q7,\
                        LAST_QTR, NAME, MC_S_OR_C \
                 FROM MASTER WHERE ID = ?', (myid,))

    row = cur.fetchone()

    earningsQ2 = row[0]
    earningsQ3 = row[1]
    earningsQ4 = row[2]
    earningsQ5 = row[3]
    earningsQ6 = row[4]
    earningsQ7 = row[5]
    earningsQ8 = row[6]
    interestQ2 = row[7]
    interestQ3 = row[8]
    interestQ4 = row[9]
    interestQ5 = row[10]
    interestQ6 = row[11]
    interestQ7 = row[12]
    interestQ8 = row[13]
    profitsQ2  = row[14]
    profitsQ3  = row[15]
    profitsQ4  = row[16]
    profitsQ5  = row[17]
    profitsQ6  = row[18]
    profitsQ7  = row[19]
    profitsQ8  = row[20]
    avlbQtr    = row[21]
    name       = row[22]
    sOrC       = row[23]

    print '### Results ('+ sOrC +') of ' + name + ' updated upto: ' + avlbQtr + '###'

    lastQtr = 'Jun 19'
    print 'Updating results for ' + lastQtr + ' quarter!'
    earningsQ1 = float(args[2])
    interestQ1 = float(args[3])
    profitsQ1 = float(args[4])

    print '### MASTER table will be updated with following details: ###'
    print '=> Last Quarter: ' + str(lastQtr)
    print '=> Earnings: ' + str(earningsQ1)
    print '=> Interest: ' + str(interestQ1)
    print '=> Profits: ' + str(profitsQ1)
    print '=> EPS: Will be calculated automatically!'

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

    print '### Results updated! ###'

    con.commit()
    con.close()

if __name__ == '__main__':
    main()
