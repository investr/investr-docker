# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Assorted utility methods
#

import smtplib

EMAIL_SERVER = ""
EMAIL_PORT = 587
EMAIL_USERNAME = ""
EMAIL_PASSWORD = ""
EMAIL_FROM = ""

def mail(to, subject, body):

    message = "Subject:" + subject + "\n\n" + body
    try:
        server = smtplib.SMTP(EMAIL_SERVER, EMAIL_PORT)
        server.ehlo()
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.sendmail(EMAIL_FROM, to, message)
    finally:
        server.close()
    return
