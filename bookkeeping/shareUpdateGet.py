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
        # Get the worksheet that will have the stock price information
        workSheet = gspread.authorize(ServiceAccountCredentials.from_json_keyfile_name(GOOGLE_KEY_FILE, SCOPES)).open_by_url(SHEETURL).worksheet(WORKSHEETNAME)

        # Get the stock IDs and stock prices from the google spread sheet.
        #stockIds = workSheet.col_values(1)     # This the the column number of the spreadsheet that has the ID
        #stockPrices = workSheet.col_values(11) # This the the column number of the spreadsheet that has the price

        # Get connection to the sqlite database
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        cur.execute('SELECT EQ_SHR_CAP_TTM FROM MASTER ORDER BY ID ASC')
        shares = [item[0] for item in cur.fetchall()]

        # Bulk update the column in our spreadsheet with the share values
        cell_list = workSheet.range('M1:M685')
        index = 0
        for cell in cell_list:
            cell.value = shares[index]
            index = index + 1
        workSheet.update_cells(cell_list)

    except:
        logging.info(traceback.format_exc())

    finally:
        con.commit()
        con.close()

    logging.info('Finished share update!')


if __name__ == '__main__':
    main()
