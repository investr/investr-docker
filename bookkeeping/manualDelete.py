#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Manually DELETE a company and ALL its details
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
    print bcolors.BOLD + '********************************** Form To Delete A Company Manually *******************************' + bcolors.ENDC
    print bcolors.BOLD + '****************************************************************************************************' + bcolors.ENDC

    myid = input('Company ID: ')
    cur.execute('SELECT NAME FROM MASTER WHERE ID = ?', (myid,))

    row = cur.fetchone()

    name = row[0]

    print '+----------------------------------------------------------------------------------------------------------------------------------------+'
    print '| ' + name + ' Will be DELETED from both MASTER, SCORE and HISTORICAL_SCORE tables!!!'
    print '+----------------------------------------------------------------------------------------------------------------------------------------+'

    yOrN = int(raw_input('Do you want to DELETE the company? (1/0): '))

    if yOrN == 1:
        try:
            cur.execute('DELETE FROM MASTER WHERE ID = ?;', (myid,))
            cur.execute('DELETE FROM SCORE  WHERE ID = ?;', (myid,))
            cur.execute('DELETE FROM HISTORICAL_SCORE WHERE STOCK_ID = ?;', (myid,))

            print '### Row Deleted!!! Poof!!!###'
            print '### IMPORTANT: DELETE THE SAME FROM WATCHLIST TABLE!!!! ###'

        except Exception, err:
            sys.stderr.write('ERROR: %s\n' % str(err))
            sys.stderr.write(traceback.format_exc())

        finally:
            con.commit()
            con.close()

if __name__ == '__main__':
    main()
