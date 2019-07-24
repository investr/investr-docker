# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
#
# Utility methods to get data from finance.google.com.
#
#

import requests
from BeautifulSoup import BeautifulSoup


POWERS = {'B':10 ** 2, 'M': 10 ** -1, '0': 10 ** -7}
GOOGLE_FINANCE_URL = 'http://finance.google.com/finance?q='


def getGoogleStockData(bseCode, nseCode, attr):

    # Some companies have an & in their NSE codes. Replace them with %26

    if nseCode is not None and len(nseCode) > 0:
        nseCode = nseCode.replace('&', '%26')
        urlToFetch = GOOGLE_FINANCE_URL + 'NSE' + ':' + nseCode
    else:
        urlToFetch = GOOGLE_FINANCE_URL + 'BOM' + ':' + bseCode

    stockPage = requests.get(urlToFetch)
    parsedHtml = BeautifulSoup(stockPage.text)

    if attr == 'price': # Value returned in rupees
        dataNodes = parsedHtml.findAll('span', {'class': 'pr'})
        data = dataNodes[0].findChildren()[0].text
        data = data.replace(',', '')
    elif attr == 'shares': # Value returned in crores of rupees
        dataNodes = parsedHtml.findAll('td', {'data-snapfield': 'shares'})
        data = dataNodes[0].parent.findChildren()[1].text
        if len(data) > 0:
            data = data.replace(',', '')
            power = data[-1]
            data = float(data[:-1]) * POWERS[power]
        else:
            data = 0

    return float(data)
