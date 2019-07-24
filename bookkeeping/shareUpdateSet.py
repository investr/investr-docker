#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Popultes the MASTER TABLE of stocks.db with outstanding shares from the Companies Sheet of InvestR spread-hseet
#


import os
import logging
import traceback
import gspread
import datetime
import sqlite3 as lite
from utils import *
from oauth2client.service_account import ServiceAccountCredentials


GOOGLE_KEY_FILE = '/home/ec2-user/bookkeeping/googledriveoauth.json'
SCOPES = ['https://spreadsheets.google.com/feeds']
SHEETURL = 'https://docs.google.com/spreadsheets/d/1V6NcsKoRhJlivU05hupOVaEw0xYyxoplGyIYcEKyDNs/edit#gid=239811273'
WORKSHEETNAME = 'Companies'


def main():
    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.DEBUG)

    try:
        # Get the worksheet that will have the stock share information
        workSheet = gspread.authorize(ServiceAccountCredentials.from_json_keyfile_name(GOOGLE_KEY_FILE, SCOPES)).open_by_url(SHEETURL).worksheet(WORKSHEETNAME)

        # Get the stock IDs and outstanding shares from the google spread sheet.
        stockIds = workSheet.col_values(1)     # This the the column number of the spreadsheet that has the ID
        stockShares= workSheet.col_values(10) # This the the column number of the spreadsheet that has the outstanding shares

        # Get connection to the sqlite database
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        # Insert in the sqlite databse
        exceptionRaised = 0
        for i in range(0, len(stockIds)):
            try:
                cur.execute('UPDATE MASTER SET EQ_SHR_CAP_TTM = ? WHERE ID = ?;', (float(stockShares[i]), int(stockIds[i])))
                logging.info('Updated: ' + str(stockIds[i]) + ' with Price: ' + str(stockShares[i]))
            except ValueError:
                exceptionRaised = 1
                continue

    except:
        logging.info(traceback.format_exc())

    finally:
        con.commit()
        con.close()

    logging.info('Finished share update!')


if __name__ == '__main__':
    main()
