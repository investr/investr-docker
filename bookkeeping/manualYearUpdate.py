#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Manually update a company with its Yearly results
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
    # 6th parameter: Book Value
    # 7th parameter: Dividend
    if len(sys.argv) < 5:
        print 'Pass correct number of parameters!'
        exit()

    args = sys.argv

    stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
    con = lite.connect(stocksDBLocation)
    cur = con.cursor()

    myid = int(args[1])
    cur.execute('SELECT EARNINGS_Y1, INTEREST_Y1, PROFITS_Y1, BV_Y1, DIV_Y1, NAME FROM MASTER WHERE ID = ?', (myid,))

    row = cur.fetchone()

    earningsY2 = row[0]
    interestY2 = row[1]
    profitsY2  = row[2]
    bvY2       = row[3]
    dyY2       = row[4]
    name       = row[5]

    print '### Updating Yearly Results of ' + name + '###'
    print '### MASTER table will be updated with following details: ###'

    earningsY1 = float(args[2])
    print '=> Earnings: ' + str(earningsY1)
    interestY1 = float(args[3])
    print '=> Interest: ' + str(interestY1)
    profitsY1 = float(args[4])
    print '=> Profits: ' + str(profitsY1)
    if len(args) == 7:
        bvY1 = float(args[5])
        print '=> BV: ' + str(bvY1)
        dyY1 = float(args[6])
        print '=> Dividend: ' + str(dyY1)


    if len(args) == 7:
        cur.execute('UPDATE MASTER SET \
                            EARNINGS_Y1 = ?, \
                            EARNINGS_Y2 = ?, \
                            INTEREST_Y1 = ?, \
                            INTEREST_Y2 = ?, \
                            PROFITS_Y1 = ?, \
                            PROFITS_Y2 = ?, \
                            BV_Y1 = ?, \
                            BV_Y2 = ?, \
                            DIV_Y1 = ?, \
                            DIV_Y2 = ? \
                        WHERE ID = ?', ( \
                            earningsY1, earningsY2, \
                            interestY1, interestY2, \
                            profitsY1, profitsY2, \
                            bvY1, bvY2, dyY1, dyY2, \
                            myid))
    elif len(args) == 5:
        cur.execute('UPDATE MASTER SET \
                            EARNINGS_Y1 = ?, \
                            EARNINGS_Y2 = ?, \
                            INTEREST_Y1 = ?, \
                            INTEREST_Y2 = ?, \
                            PROFITS_Y1 = ?, \
                            PROFITS_Y2 = ? \
                        WHERE ID = ?', ( \
                            earningsY1, earningsY2, \
                            interestY1, interestY2, \
                            profitsY1, profitsY2, \
                            myid))


    print '### Results update! ###'

    con.commit()
    con.close()

if __name__ == '__main__':
    main()
