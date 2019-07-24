# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Utility methods to get data from Moneycontrol.com.
#

import re
import sys
import json
import hashlib
import datetime
import requests
from BeautifulSoup import BeautifulSoup

def shouldShiftYear(parsedHtml):

    tds = parsedHtml.findAll('td', {'class': 'detb'}, text='Mar \'16')
    return len(tds)


def getLastQuarterName(parsedHtml):

    th = parsedHtml.findAll('th', {'class': 'TAR'})
    return th[0].text


def getMMCPrice(mcUrl):

    stockPage = requests.get(mcUrl)
    parsedHtml = BeautifulSoup(stockPage.text)

    try:
        price = parsedHtml.findAll('span', {'id': 'Nse_Prc_tick'})[0].findChildren()[0].text.replace(',', '')
    except IndexError:
        price = parsedHtml.findAll('span', {'id': 'Bse_Prc_tick'})[0].findChildren()[0].text.replace(',', '')
    except:
        price = -999.99

    return float(price)


def getDividendYield(parsedHtml):

    divs = parsedHtml.findAll('div', {'id': 'mktdet_2'})

    bv = 0
    for div in divs:
        bvNodes = div.findAll('div', {'class': 'FR gD_12'})
        bv = bvNodes[9].text
        if len(bv) == 0:
            # If consolidaed book value is not available use the standalone
            divs = parsedHtml.findAll('div', {'id': 'mktdet_1'})
            for div in divs:
                bvNodes = div.findAll('div', {'class': 'FR gD_12'})
                bv = bvNodes[9].text

    try:
        return float(bv[:-1])
    except ValueError:
        return -999.99


def getBookValue(parsedHtml):

    # First check for consolidate book value
    divs = parsedHtml.findAll('div', {'id': 'mktdet_2'})

    bv = 0
    for div in divs:
        bvNodes = div.findAll('div', {'class': 'FR gD_12'})
        bv = bvNodes[2].text
        if len(bv) == 0:
            # If consolidaed book value is not available use the standalone
            divs = parsedHtml.findAll('div', {'id': 'mktdet_1'})
            for div in divs:
                bvNodes = div.findAll('div', {'class': 'FR gD_12'})
                bv = bvNodes[2].text

    return float(bv)

def getMCDividend(parsedHtml):

    pTag = parsedHtml.findAll('p', {'class': 'MT15 b15cn'})

    r = re.compile('amounting to Rs (.*?) per share.')
    m = r.search(pTag[0].text)
    if m:
        div = m.group(1)
    else:
        div = 0

    return div

def getLastQuarterNameMain(parsedHtml):

    td = parsedHtml.findAll('td', {'class': 'detb'})
    return td[1].text

def getMCData(parsedHtml, head, noOfResults=5, shiftYear=0, startIndex=0):

    tds = parsedHtml.findAll('td', text = head)

    try:
        children = tds[startIndex].parent.parent.findChildren()
    except IndexError:
        if noOfResults == 1:
            return -999.99
        elif noOfResults == 2:
            return (-999.99, -999.99)
        elif noOfResults == 3:
            return (-999.99, -999.99, -999.99)
        elif noOfResults == 4:
            return (-999.99, -999.99, -999.99, -999.99)
        else:
            return (-999.99, -999.99, -999.99, -999.99, -999.99)

    try:
        d1 = children[1+shiftYear].text.replace(',', '')
    except IndexError:
        d1 = '--'
    if d1 == '--' or len(d1) < 1:
        d1 = '0.0'

    # If we want 1 result sets then return now! Used to get yearly data.
    if noOfResults == 1:
        return (float(d1))

    try:
        d2 = children[2+shiftYear].text.replace(',', '')
    except IndexError:
        d2 = '--'
    if d2 == '--' or len(d2) < 1:
        d2 = '0.0'

    # If we want 2 result sets then return now! Used to get yearly data.
    if noOfResults == 2:
        return (float(d1), float(d2))

    try:
        d3 = children[3].text.replace(',', '')
    except IndexError:
        d3 = '--'
    if d3 == '--' or len(d3) < 1:
        d3 = '0.0'

    try:
        d4 = children[4].text.replace(',', '')
    except IndexError:
        d4 = '--'
    if d4 == '--' or len(d4) < 1:
        d4 = '0.0'

    try:
        d5 = children[5].text.replace(',', '')
    except IndexError:
        d5 = '--'
    if d5 == '--' or len(d5) < 1:
        d5 = '0.0'

    return (float(d1), float(d2), float(d3), float(d4), float(d5))


def getMCMobileData(parsedHtml, head, noOfResults=5):

    tds = parsedHtml.findAll('td', text = head)

    try:
        d1 = tds[0].parent.parent.find('td', {'class': ' coll_0 TAR'}).text.replace(',', '')
    except AttributeError:
        d1 = '0'
    if d1 == '--' or len(d1) < 1:
        d1 = '0'

    try:
        d2 = tds[0].parent.parent.find('td', {'class': 'combo_call coll_1 TAR'}).text.replace(',', '')
    except AttributeError:
        d2 = '0'
    if d2 == '--' or len(d2) < 1:
        d2 = '0'

    # If we want 2 result sets then return now! Used to get yearly data.
    if noOfResults == 2:
        return (float(d1), float(d2))

    try:
        d3 = tds[0].parent.parent.find('td', {'class': 'combo_call coll_2 TAR'}).text.replace(',', '')
    except AttributeError:
        d3 = '0'
    if d3 == '--' or len(d3) < 1:
        d3 = '0'

    try:
        d4 = tds[0].parent.parent.find('td', {'class': 'combo_call coll_3 TAR'}).text.replace(',', '')
    except AttributeError:
        d4 = '0'
    if d4 == '--' or len(d4) < 1:
        d4 = '0'

    try:
        d5 = tds[0].parent.parent.find('td', {'class': 'combo_call coll_4 TAR'}).text.replace(',', '')
    except AttributeError:
        d5 = '0'
    if d5 == '--' or len(d5) < 1:
        d5 = '0'

    return (float(d1), float(d2), float(d3), float(d4), float(d5))


def getMCStockCapital(mcName, mcCode):
    url = 'http://www.moneycontrol.com/financials/' + mcName + '/capital-structure/' + mcCode

    yearlyResults = requests.get(url)
    parsedHtml = BeautifulSoup(yearlyResults.text)

    yearlyResults = requests.get(url)
    parsedHtml = BeautifulSoup(yearlyResults.text)

    tds = parsedHtml.findAll('td', {'class': 'det brdB'})

    # Convert to crores
    return round(float(tds[5].text)/10000000.00, 3)

