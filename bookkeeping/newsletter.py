#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Send newsletter
#


import os
import json
import urllib2
import logging
import traceback
import mysql.connector
from utils import *

def main():

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.DEBUG)

    mysqlCon = mysql.connector.connect(user="root", password="", host="localhost", database="investr")
    mysqlCur = mysqlCon.cursor()

    # The 2 in 1 << 2, should match with the EMAIL_NEWSLETTER constant in settings.html
    # Note this query will return only those users who have subscribe to the newsletter
    mysqlCur.execute('SELECT USER_ID FROM PREFS WHERE ((EMAIL_USER & (1 << 2)) > 0)')
    rows = mysqlCur.fetchall()

    # Loop thru users that have subscribed to the newsletter

    for row in rows:
        userId = row[0]

        logging.info('Processing ... ' + str(userId))

        # Comment the following lines to send to every subscriber
        #if userId != 1:
        #    continue

        mysqlCur.execute('SELECT EMAIL FROM USERS WHERE ID = %s', (userId,))
        email = mysqlCur.fetchone()[0]

        # Enter subject here
        emailSubject = "InvestR Newsletter: Handling Steep Market Corrections"

        # Enter email body here
        emailBody = \
"\
http://chiragr.me/post/179857443117/handling-steep-market-corrections \n\
\n\
Link to all newsletters: http://chiragr.me/tagged/newsletter \n\
"\

        mail(email, emailSubject, emailBody)

    mysqlCur.close()
    mysqlCon.close()

    logging.info('Finished Mailing Newsletters')


if __name__ == '__main__':
    main()
