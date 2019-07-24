#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Update Buy, Sell, Reduce, Accumulate projections
#

import os
import traceback
import logging
import sqlite3 as lite

from utils import *


def main():
    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.INFO)
    logging.getLogger("requests").setLevel(logging.WARNING)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        cur = con.cursor()

        # Reset data
        cur.execute('UPDATE PROJECTIONS SET PROJECTED_PRICE = ?, PROJECTED_PRICE_LOW = ?, PROJECTED_PRICE_HIGH = ?, CAGR = ?, CAGR_LOW = ?, CAGR_HIGH = ?, VERDICT = ?', (0, 0, 0, 0, 0, 0, ''))

        # Get the tables in this DB
        cur.execute('SELECT * FROM PROJECTIONS')

        rows = cur.fetchall()

        # Loop thru the data
        for row in rows:
            try:
                myid = int(row[0])
                price = float(row[1])
                epsTTM = float(row[2])
                peLow = float(row[3])
                divYld = float(row[4])
                dilution = float(row[5])
                stdDeviation = float(row[6])
                fwGrowth1 = float(row[7])
                fwGrowth2 = float(row[8])
                fwGrowth3 = float(row[9])
                period = float(row[10])

                # Sanitize
                if price < 20 or peLow < 1 or epsTTM < 0 or stdDeviation > 100 or fwGrowth1 > 50:
                    continue


                eps1 = epsTTM*(fwGrowth1/100) + epsTTM
                eps2 = eps1*(fwGrowth2/100) + eps1
                eps3 = eps2*(fwGrowth3/100) + eps2

                priceBeforeDilution = eps3*peLow

                projectedPrice = round(priceBeforeDilution - (priceBeforeDilution*(dilution/100)), 2)
                projectedPriceLow = round(projectedPrice - projectedPrice*(stdDeviation/100), 2)
                projectedPriceHigh = round(projectedPrice + projectedPrice*(stdDeviation/100), 2)

                cagr = round(((projectedPrice/price)**(1/period) - 1)*100, 2) + divYld
                cagrLow = round(((projectedPriceLow/price)**(1/period) - 1)*100, 2) + divYld
                cagrHigh = round(((projectedPriceHigh/price)**(1/period) - 1)*100, 2) + divYld

                if cagrLow >= 30:
                    verdict = 'Very Strong Buy'
                    logging.info(str(myid) + ': Very Strong Buy')
                if (cagrLow > 24 and cagrLow < 30) or cagr >= 30:
                    verdict = 'Strong Buy'
                    logging.info(str(myid) + ': Strong Buy')
                if cagr >= 24 and cagr < 30:
                    verdict = 'Buy'
                    logging.info(str(myid) + ': Buy')
                if cagr >= 18 and cagr < 24:
                    verdict = 'Accumulate'
                if cagr > 10 and cagr < 18:
                    verdict = 'Hold'
                if cagr > 4 and cagr < 10:
                    verdict = 'Reduce'
                if cagr < 4:
                    verdict = 'Sell'

                cur.execute('UPDATE PROJECTIONS SET PROJECTED_PRICE = ?, PROJECTED_PRICE_LOW = ?, PROJECTED_PRICE_HIGH = ?, CAGR = ?, CAGR_LOW = ?, CAGR_HIGH = ?, VERDICT = ? WHERE ID = ?', (projectedPrice, projectedPriceLow, projectedPriceHigh, cagr, cagrLow, cagrHigh, verdict, myid))

            except Exception:
                logging.info('Exception raised while processing: ' + str(myid))
                logging.info(traceback.format_exc())

    except lite.Error as er:
        logging.info(er)
    finally:
        con.commit()
        con.close()

    logging.info('Finished!')


if __name__ == '__main__':
    main()
