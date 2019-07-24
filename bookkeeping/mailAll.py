#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Send mail to registered users
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

    mysqlCur.execute('SELECT USER_ID FROM PREFS')
    rows = mysqlCur.fetchall()

    for row in rows:
        userId = row[0]

        logging.info('Processing ... ' + str(userId))

        # Comment the following lines to send to every subscriber
        #if userId != 1:
        #    continue

        mysqlCur.execute('SELECT EMAIL FROM USERS WHERE ID = %s', (userId,))
        email = mysqlCur.fetchone()[0]

        # Enter subject here
        emailSubject = "Subject"

        # Enter email body here
        emailBody = \
"\
Hi!\n\
\n\
Message line 1 \n\
\n\
Message line 2 \n\
\n\
Message line 3 \n\
\n\
Name \n\
"\

        mail(email, emailSubject, emailBody)

        logging.info('Mail sent to: ' + email)

    mysqlCur.close()
    mysqlCon.close()

    logging.info('Finished mailing everyone!')


if __name__ == '__main__':
    main()
