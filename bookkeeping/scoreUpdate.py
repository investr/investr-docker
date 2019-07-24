#!/usr/bin/env python

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

#
# Popultes the SCORE TABLE of stocks.db with points scored base on MASTER table.
#

import os
import traceback
import requests
import logging
import sqlite3 as lite


def main():

    logFile = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'logs' + os.sep + os.path.splitext(os.path.basename(__file__))[0] + '.log'
    logging.basicConfig(filename=logFile, level=logging.DEBUG)

    try:
        stocksDBLocation = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'ec2stocks.db'
        con = lite.connect(stocksDBLocation)
        curMaster = con.cursor()
        curScore = con.cursor()

        # Get the tables in this DB
        curMaster.execute('SELECT ID, EARNINGS_YOY_GROWTH, EARNINGS_QOQ_GROWTH, EARNINGS_YEARLY_GROWTH, \
                                PROFITS_YOY_GROWTH, PROFITS_QOQ_GROWTH, PROFITS_YEARLY_GROWTH, \
                                EPS_YOY_GROWTH, EPS_QOQ_GROWTH, EPS_YEARLY_GROWTH, \
                                MARGINS_TTM, MARGINS_YEARLY_GROWTH, \
                                INTEREST_PERCENT, INTEREST_YEARLY_GROWTH, \
                                PE, PEG, DIV_YIELD, DIV_GROWTH, BV_GROWTH \
                           FROM MASTER')

        rows = curMaster.fetchall()

        # Loop thru the data
        for row in rows:

            try:
                myid = row[0]
                earningsYoYGrowth = row[1]
                earningsQoQGrowth = row[2]
                earningsYearlyGrowth = row[3]
                profitsYoYGrowth = row[4]
                profitsQoQGrowth = row[5]
                profitsYearlyGrowth = row[6]
                epsYoYGrowth = row[7]
                epsQoQGrowth = row[8]
                epsYearlyGrowth = row[9]
                marginsTTM = row[10]
                marginsYearlyGrowth = row[11]
                interestPercent = row[12]
                interestYearlyGrowth = row[13]
                pe = row[14]
                divYield = row[16]
                divGrowth = row[17]
                bvGrowth = row[18]

                logging.info('Processing ... ' + str(myid))

                # Get the High and Low PE values for this particular company from the table SCORE.
                curScore.execute('SELECT PE_LOW, PE_HIGH FROM SCORE WHERE ID = ?', [myid])
                scoreRow = curScore.fetchone()
                peLow = scoreRow[0]
                peHigh = scoreRow[1]

                if earningsYoYGrowth < 0:
                    earningsYoYGrowthPts = -3
                elif earningsYoYGrowth < 8:
                    earningsYoYGrowthPts = 0
                elif earningsYoYGrowth < 16:
                    earningsYoYGrowthPts = 3
                elif earningsYoYGrowth < 24:
                    earningsYoYGrowthPts = 6
                else:
                    earningsYoYGrowthPts = 9

                if earningsQoQGrowth < 0:
                    earningsQoQGrowthPts = -3
                elif earningsQoQGrowth < 2:
                    earningsQoQGrowthPts = 0
                elif earningsQoQGrowth < 4:
                    earningsQoQGrowthPts = 3
                elif earningsQoQGrowth < 6:
                    earningsQoQGrowthPts = 6
                else:
                    earningsQoQGrowthPts = 9

                if earningsYearlyGrowth < 0:
                    earningsYearlyGrowthPts = -3
                elif earningsYearlyGrowth < 6:
                    earningsYearlyGrowthPts = 0
                elif earningsYearlyGrowth < 12:
                    earningsYearlyGrowthPts = 3
                elif earningsYearlyGrowth < 18:
                    earningsYearlyGrowthPts = 6
                else:
                    earningsYearlyGrowthPts = 9

                if profitsYoYGrowth < 0:
                    profitsYoYGrowthPts = -3
                elif profitsYoYGrowth < 8:
                    profitsYoYGrowthPts = 0
                elif profitsYoYGrowth < 20:
                    profitsYoYGrowthPts = 3
                elif profitsYoYGrowth < 30:
                    profitsYoYGrowthPts = 6
                else:
                    profitsYoYGrowthPts = 9

                if profitsQoQGrowth < 0:
                    profitsQoQGrowthPts = -3
                elif profitsQoQGrowth < 2:
                    profitsQoQGrowthPts = 0
                elif profitsQoQGrowth < 5:
                    profitsQoQGrowthPts = 3
                elif profitsQoQGrowth < 7:
                    profitsQoQGrowthPts = 6
                else:
                    profitsQoQGrowthPts = 9

                if profitsYearlyGrowth < 0:
                    profitsYearlyGrowthPts = -3
                elif profitsYearlyGrowth < 8:
                    profitsYearlyGrowthPts = 0
                elif profitsYearlyGrowth < 16:
                    profitsYearlyGrowthPts = 3
                elif profitsYearlyGrowth < 24:
                    profitsYearlyGrowthPts = 6
                else:
                    profitsYearlyGrowthPts = 9

                if epsYoYGrowth < 0:
                    epsYoYGrowthPts = -3
                elif epsYoYGrowth < 8:
                    epsYoYGrowthPts = 0
                elif epsYoYGrowth < 20:
                    epsYoYGrowthPts = 3
                elif epsYoYGrowth < 30:
                    epsYoYGrowthPts = 6
                else:
                    epsYoYGrowthPts = 9

                if epsQoQGrowth < 0:
                    epsQoQGrowthPts = -3
                elif epsQoQGrowth < 2:
                    epsQoQGrowthPts = 0
                elif epsQoQGrowth < 5:
                    epsQoQGrowthPts = 3
                elif epsQoQGrowth < 7:
                    epsQoQGrowthPts = 6
                else:
                    epsQoQGrowthPts = 9

                if epsYearlyGrowth < 0:
                    epsYearlyGrowthPts = -3
                elif epsYearlyGrowth < 8:
                    epsYearlyGrowthPts = 0
                elif epsYearlyGrowth < 16:
                    epsYearlyGrowthPts = 3
                elif epsYearlyGrowth < 24:
                    epsYearlyGrowthPts = 6
                else:
                    epsYearlyGrowthPts = 9

                if marginsTTM < 0:
                    marginsTTMPts = 0
                elif marginsTTM < 8:
                    marginsTTMPts = 3
                elif marginsTTM < 16:
                    marginsTTMPts = 6
                elif marginsTTM < 24:
                    marginsTTMPts = 9
                else:
                    marginsTTMPts = 12

                if marginsYearlyGrowth < 0:
                    marginsYearlyGrowthPts = -3
                elif marginsYearlyGrowth < 1:
                    marginsYearlyGrowthPts = 0
                elif marginsYearlyGrowth < 10:
                    marginsYearlyGrowthPts = 3
                elif marginsYearlyGrowth < 20:
                    marginsYearlyGrowthPts = 6
                else:
                    marginsYearlyGrowthPts = 9

                if interestPercent < 1:
                    interestPercentPts = 9
                elif interestPercent < 5:
                    interestPercentPts = 6
                elif interestPercent < 10:
                    interestPercentPts = 3
                elif interestPercent < 20:
                    interestPercentPts = 0
                else:
                    interestPercentPts = -3

                if interestYearlyGrowth < 0:
                    interestYearlyGrowthPts = 12
                elif interestYearlyGrowth < 8:
                    interestYearlyGrowthPts = 9
                elif interestYearlyGrowth < 16:
                    interestYearlyGrowthPts = 6
                elif interestYearlyGrowth < 24:
                    interestYearlyGrowthPts = 3
                else:
                    interestYearlyGrowthPts = 0

                if pe <= 0:
                    pePts = 0
                elif pe < peLow:
                    pePts = 12
                elif pe < peHigh:
                    pePts = 6
                else:
                    pePts = 3

                if divYield < 0.01:
                    divYieldPts = -3
                elif divYield < 0.5:
                    divYieldPts = 0
                elif divYield < 1:
                    divYieldPts = 3
                elif divYield < 3:
                    divYieldPts = 6
                elif divYield < 5:
                    divYieldPts = 9
                else:
                    divYieldPts = 12

                if divGrowth < 0:
                    divGrowthPts = 0
                elif divGrowth < 15:
                    divGrowthPts = 3
                elif divGrowth < 25:
                    divGrowthPts = 6
                else:
                    divGrowthPts = 9

                if bvGrowth < 0:
                    bvGrowthPts = 0
                elif bvGrowth < 10:
                    bvGrowthPts = 3
                elif bvGrowth < 20:
                    bvGrowthPts = 6
                else:
                    bvGrowthPts = 9

                curScore.execute('UPDATE SCORE SET \
                                        EARNINGS_YOY_GROWTH_PTS = ?, \
                                        EARNINGS_QOQ_GROWTH_PTS = ?, \
                                        EARNINGS_YEARLY_GROWTH_PTS = ?, \
                                        PROFITS_YOY_GROWTH_PTS  = ?, \
                                        PROFITS_QOQ_GROWTH_PTS  = ?, \
                                        PROFITS_YEARLY_GROWTH_PTS = ?, \
                                        EPS_YOY_GROWTH_PTS  = ?, \
                                        EPS_QOQ_GROWTH_PTS  = ?, \
                                        EPS_YEARLY_GROWTH_PTS = ?, \
                                        MARGINS_PERCENT_PTS = ?, \
                                        MARGINS_YEARLY_GROWTH_PTS  = ?, \
                                        INTEREST_PERCENT_PTS = ?, \
                                        INTEREST_YEARLY_GROWTH_PTS = ?, \
                                        PE_PTS = ?, \
                                        DIV_YIELD_PTS = ?, \
                                        DIV_GROWTH_PTS = ?, \
                                        BV_GROWTH_PTS = ? \
                                WHERE ID = ?', ( \
                                        earningsYoYGrowthPts, earningsQoQGrowthPts, earningsYearlyGrowthPts, \
                                        profitsYoYGrowthPts, profitsQoQGrowthPts, profitsYearlyGrowthPts, \
                                        epsYoYGrowthPts, epsQoQGrowthPts, epsYearlyGrowthPts, \
                                        marginsTTMPts, marginsYearlyGrowthPts, \
                                        interestPercentPts, interestYearlyGrowthPts, \
                                        pePts, divYieldPts, divGrowthPts, bvGrowthPts, myid))

                logging.info('Row Updated.')

                # Keep commiting intermitently.
                if myid%5 == 0:
                    con.commit()
                    logging.info('Committed upto ID: ' + str(myid))

            except Exception:
                logging.info('Exception raised while processing: ' + str(myid))
                logging.info(traceback.format_exc())

    except lite.Error as er:
        logging.info(er)
    finally:
        con.commit()
        con.close()

    logging.info('Finished run!')


if __name__ == '__main__':
    main()
