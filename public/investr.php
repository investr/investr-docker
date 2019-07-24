<?php
require 'vendor/autoload.php';

//
// Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)
//

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS: MISC UTILITY
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPercentageScore($maxPts, $pts)
{
    return round((intval($pts)*100)/intval($maxPts), 2);
}

function getWeightedScore($pts, $wts)
{
    $totalWtdScore = 0;

    for($i = 0; $i < count($pts); $i++) {
        $totalWtdScore = $totalWtdScore + ($pts[$i] * $wts[$i]);
    }

    return $totalWtdScore;
}

function getPts($row)
{
    unset($pts);
    $pts[] = $row['EARNINGS_YOY_GROWTH_PTS'];
    $pts[] = $row['EARNINGS_QOQ_GROWTH_PTS'];
    $pts[] = $row['EARNINGS_YEARLY_GROWTH_PTS'];
    $pts[] = $row['PROFITS_YOY_GROWTH_PTS'];
    $pts[] = $row['PROFITS_QOQ_GROWTH_PTS'];
    $pts[] = $row['PROFITS_YEARLY_GROWTH_PTS'];
    $pts[] = $row['EPS_YOY_GROWTH_PTS'];
    $pts[] = $row['EPS_QOQ_GROWTH_PTS'];
    $pts[] = $row['EPS_YEARLY_GROWTH_PTS'];
    $pts[] = $row['MARGINS_PERCENT_PTS'];
    $pts[] = $row['MARGINS_YEARLY_GROWTH_PTS'];
    $pts[] = $row['INTEREST_PERCENT_PTS'];
    $pts[] = $row['INTEREST_YEARLY_GROWTH_PTS'];
    $pts[] = $row['PE_PTS'];
    $pts[] = $row['DIV_YIELD_PTS'];
    $pts[] = $row['DIV_GROWTH_PTS'];
    $pts[] = $row['BV_GROWTH_PTS'];

    return $pts;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS: CONVERT TO JSON ARRAY
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getOutputForPredefinedWts($row, $percentageScore)
{
    $percentageScore = number_format((float)$percentageScore, 2, '.', '');
    $price = number_format((float)$row['PRICE'], 2, '.', '');
    $pe = number_format((float)$row['PE'], 2, '.', '');
    $peg = number_format((float)$row['PEG'], 2, '.', '');
    $divYld = number_format((float)$row['DIV_YIELD'], 2, '.', '');

    $output = array('ID' => $row['ID'], 'N' => $row['NAME'], 'ST' => $row['SECTOR'], 'O' => $row['OWNED'],
                      'NC' => $row['NSE_CODE'], 'BC' => $row['BSE_CODE'], 'LQ' => $row['LAST_QTR'],
                      'P' => $price, 'PE' => $pe, 'PEL' => $row['PE_LOW'], 'PEH' => $row['PE_HIGH'],
                      'PEG' => $peg, 'DY' => $divYld, 'PBV' => $row['PBV'],
                      'U' => $row['INTEREST_PERCENT'], 'V' => $row['MARGINS_TTM'],
                      'ESD' => $row['MAX_WEIGHTED_POINTS'], 'PSD' => $row['SCORED_WEIGHTED_POINTS'],
                      'DMA30' => $row['PERCENTAGE_SCORED'], 'DMA200' => $row['PERCENTAGE_SCORED_OLD'],
                      'DMA100' => $row['ATTR1'], 'FP' => $row['ATTR8'],
                      'SR' => $percentageScore, 'B' => "", // Empty B will store color codes on client side
                      'A' => $row['PROFITS_YOY_GROWTH'], 'C' => $row['EPS_YOY_GROWTH'],
                      'D' => $row['EARNINGS_YOY_GROWTH'], 'MC' => $row['EQ_SHR_CAP_Y1'],
                      'ROA' => $row['EQ_SHR_CAP_Q3'], 'SC' => $row['STD_DEV_SCORE'],
                      'CR' => $row['EQ_SHR_CAP_Q5'], 'PN' => $row['ATTR6'], 'RT' => $row['ATTR7'],
                      'Q1' => $row['EPS_Q1'], 'Q2' => $row['EPS_Q2'], 'Q3' => $row['EPS_Q3'],
                      'Q4' => $row['EPS_Q4'], 'Q5' => $row['EPS_Q5'], 'Q6' => $row['EPS_Q6'],
                      'Q7' => $row['EPS_Q7'], 'Q8' => $row['EPS_Q8']);

    return $output;
}

function getOutputForUserWts($row)
{
    $price = number_format((float)$row['PRICE'], 2, '.', '');
    $pe = number_format((float)$row['PE'], 2, '.', '');
    $peg = number_format((float)$row['PEG'], 2, '.', '');
    $divYld = number_format((float)$row['DIV_YIELD'], 2, '.', '');

    $output = array('ID' => $row['ID'], 'N' => $row['NAME'], 'ST' => $row['SECTOR'], 'O' => $row['OWNED'],
                      'NC' => $row['NSE_CODE'], 'BC' => $row['BSE_CODE'], 'LQ' => $row['LAST_QTR'],
                      'P' => $price, 'PE' => $pe, 'PEL' => $row['PE_LOW'], 'PEH' => $row['PE_HIGH'],
                      'PEG' => $peg, 'DY' => $divYld, 'PBV' => $row['PBV'],
                      'ESD' => $row['MAX_WEIGHTED_POINTS'], 'PSD' => $row['SCORED_WEIGHTED_POINTS'],
                      'DMA30' => $row['PERCENTAGE_SCORED'], 'DMA200' => $row['PERCENTAGE_SCORED_OLD'],
                      'DMA100' => $row['ATTR1'],
                      'MC' => $row['EQ_SHR_CAP_Y1'], 'SR' => "", // We send empty SCORE and the following data so that SCORE can be calculated on client side
                      'ROA' => $row['EQ_SHR_CAP_Q3'],
                      'CR' => $row['EQ_SHR_CAP_Q5'],
                      'SC' => $row['STD_DEV_SCORE'],
                      'PN' => $row['ATTR6'],
                      'RT' => $row['ATTR7'],
                      'FP' => $row['ATTR8'],
                      'Q1' => $row['EPS_Q1'],
                      'Q2' => $row['EPS_Q2'],
                      'Q3' => $row['EPS_Q3'],
                      'Q4' => $row['EPS_Q4'],
                      'Q5' => $row['EPS_Q5'],
                      'Q6' => $row['EPS_Q6'],
                      'Q7' => $row['EPS_Q7'],
                      'Q8' => $row['EPS_Q8'],
                      'A' => $row['PROFITS_YOY_GROWTH'],
                      'B' => "", // Empty B will store color codes on client side
                      'C' => $row['EPS_YOY_GROWTH'],
                      'D' => $row['EARNINGS_YOY_GROWTH'],
                      'E' => $row['EARNINGS_YOY_GROWTH_PTS'],
                      'F' => $row['EARNINGS_QOQ_GROWTH_PTS'],
                      'G' => $row['EARNINGS_YEARLY_GROWTH_PTS'],
                      'H' => $row['PROFITS_YOY_GROWTH_PTS'],
                      'I' => $row['PROFITS_QOQ_GROWTH_PTS'],
                      'J' => $row['PROFITS_YEARLY_GROWTH_PTS'],
                      'K' => $row['EPS_YOY_GROWTH_PTS'],
                      'L' => $row['EPS_QOQ_GROWTH_PTS'],
                      'M' => $row['EPS_YEARLY_GROWTH_PTS'],
                      'Q' => $row['MARGINS_PERCENT_PTS'],
                      'R' => $row['MARGINS_YEARLY_GROWTH_PTS'],
                      'S' => $row['INTEREST_PERCENT_PTS'],
                      'T' => $row['INTEREST_YEARLY_GROWTH_PTS'],
                      'U' => $row['INTEREST_PERCENT'],
                      'V' => $row['MARGINS_TTM'],
                      'W' => $row['PE_PTS'],
                      'X' => $row['DIV_YIELD_PTS'],
                      'Y' => $row['DIV_GROWTH_PTS'],
                      'Z' => $row['BV_GROWTH_PTS']);

    return $output;
}

function getOutputForSimilars($row)
{
    $output = array('ID' => $row['ID'], 'N' => $row['NAME']);

    return $output;
}

function getOutputForPeersAndWatchlist($row)
{
    // NOTE: DIV_GROWTH is storing the price to sales ratio
    $output = array('ID' => $row['ID'], 'N' => $row['NAME'], 'P' => $row['PRICE'], 'LQ' => $row['LAST_QTR'],
                      'PE' => $row['PE'], 'PEG' => $row['PEG'], 'DY' => $row['DIV_YIELD'], 'PBV' => $row['PBV'],
                      'IP' => $row['INTEREST_PERCENT'], 'M' => $row['MARGINS_TTM'],
                      'BVG' => $row['BV_GROWTH'], 'PS' => $row['DIV_GROWTH'], 'ROA' => $row['EQ_SHR_CAP_Q3'],
                      'CR' => $row['EQ_SHR_CAP_Q5'],
                      'EVEBITDA' => $row['EV_EBITDA_Y1'],
                      'EYG' => $row['EARNINGS_YOY_GROWTH'],
                      'EQG' => $row['EARNINGS_QOQ_GROWTH'],
                      'ETTMG' => $row['EARNINGS_YEARLY_GROWTH'],
                      'IYG' => $row['INTEREST_YOY_GROWTH'],
                      'IQG' => $row['INTEREST_QOQ_GROWTH'],
                      'ITTMG' => $row['INTEREST_YEARLY_GROWTH'],
                      'PYG' => $row['PROFITS_YOY_GROWTH'],
                      'PQG' => $row['PROFITS_QOQ_GROWTH'],
                      'PTTMG' => $row['PROFITS_YEARLY_GROWTH'],
                      'MYG' => $row['MARGINS_YOY_GROWTH'],
                      'MQG' => $row['MARGINS_QOQ_GROWTH'],
                      'MTTMG' => $row['MARGINS_YEARLY_GROWTH'],
                      'EPSYG' => $row['EPS_YOY_GROWTH'],
                      'EPSQG' => $row['EPS_QOQ_GROWTH'],
                      'EPSTTMG' => $row['EPS_YEARLY_GROWTH']);

    return $output;
}

function getOutputForStockID($row)
{
    // NOTE: PERCENTAGE_SCORED is storing the 30 day moving average. We need to rename it.
    // NOTE: PERCENTAGE_SCORED_OLD is storing the 200 day moving average. We need to rename it.
    // NOTE: MAX_WEIGHTED_POINTS is storing the earning std dev. We need to rename it.
    // NOTE: MAX_WEIGHTED_POINTS is storing the profits std dev. We need to rename it.
    // NOTE: EQ_SHR_CAP_Y1 is storing market cap.
    // NOTE: EQ_SHR_CAP_Q3 is storing ROA for last financial year.
    // NOTE: EQ_SHR_CAP_Q4 is storing ROA for last to last financial year.
    // NOTE: EQ_SHR_CAP_Q5 is storing Current Ratio for last financial year.
    // NOTE: EQ_SHR_CAP_Y2 is storing Current Ratio for las to last financial year.
    // NOTE: FV_Q5 is storing Working Capital for last financial year.
    // NOTE: FV_Y1 is storing Working Capital for last to last year.
    $output = array('ID' => $row['ID'], 'N' => $row['NAME'], 'ST' => $row['SECTOR'], 'LQ' => $row['LAST_QTR'],
                      'P' => $row['PRICE'], 'PE' => $row['PE'], 'PEG' => $row['PEG'], 'DY' => $row['DIV_YIELD'],
                      'PBV' => $row['PBV'], 'PEL' => $row['PE_LOW'], 'PEH' => $row['PE_HIGH'],
                      'ESD' => $row['MAX_WEIGHTED_POINTS'], 'PSD' => $row['SCORED_WEIGHTED_POINTS'],
                      'ROA1' => $row['EQ_SHR_CAP_Q3'], 'ROA2' => $row['EQ_SHR_CAP_Q4'],
                      'CR1' => $row['EQ_SHR_CAP_Q5'], 'CR2' => $row['EQ_SHR_CAP_Y2'],
                      'WC1' => $row['FV_Q5'], 'WC2' => $row['FV_Y1'],
                      'DMA100' => $row['ATTR1'], 'DMA200' => $row['PERCENTAGE_SCORED_OLD'],
                      'DMA30' => $row['PERCENTAGE_SCORED'],
                      'FP' => $row['ATTR8'],
                      'MC' => $row['EQ_SHR_CAP_Y1'],
                      'SC' => $row['STD_DEV_SCORE'],
                      'E1' => $row['EARNINGS_Q1'],
                      'E2' => $row['EARNINGS_Q2'],
                      'E3' => $row['EARNINGS_Q3'],
                      'E4' => $row['EARNINGS_Q4'],
                      'E5' => $row['EARNINGS_Q5'],
                      'E6' => $row['EARNINGS_TTM'],
                      'E7' => $row['EARNINGS_Y1'],
                      'E8' => $row['EARNINGS_Y2'],
                      'E9' => $row['EARNINGS_YOY_GROWTH'],
                      'EY' => $row['EARNINGS_YEARLY_GROWTH'],
                      'I1' => $row['INTEREST_Q1'],
                      'I2' => $row['INTEREST_Q2'],
                      'I3' => $row['INTEREST_Q3'],
                      'I4' => $row['INTEREST_Q4'],
                      'I5' => $row['INTEREST_Q5'],
                      'I6' => $row['INTEREST_TTM'],
                      'I7' => $row['INTEREST_Y1'],
                      'I8' => $row['INTEREST_Y2'],
                      'I9' => $row['INTEREST_PERCENT'],
                      'IY' => $row['INTEREST_YEARLY_GROWTH'],
                      'P1' => $row['PROFITS_Q1'],
                      'P2' => $row['PROFITS_Q2'],
                      'P3' => $row['PROFITS_Q3'],
                      'P4' => $row['PROFITS_Q4'],
                      'P5' => $row['PROFITS_Q5'],
                      'P6' => $row['PROFITS_TTM'],
                      'P7' => $row['PROFITS_Y1'],
                      'P8' => $row['PROFITS_Y2'],
                      'PY' => $row['PROFITS_YEARLY_GROWTH'],
                      'M1' => $row['MARGINS_Q1'],
                      'M2' => $row['MARGINS_Q2'],
                      'M3' => $row['MARGINS_Q3'],
                      'M4' => $row['MARGINS_Q4'],
                      'M5' => $row['MARGINS_Q5'],
                      'M6' => $row['MARGINS_TTM'],
                      'M7' => $row['MARGINS_Y1'],
                      'M8' => $row['MARGINS_Y2'],
                      'MY' => $row['MARGINS_YEARLY_GROWTH'],
                      'S1' => $row['EPS_Q1'],
                      'S2' => $row['EPS_Q2'],
                      'S3' => $row['EPS_Q3'],
                      'S4' => $row['EPS_Q4'],
                      'S5' => $row['EPS_Q5'],
                      'S6' => $row['EPS_TTM'],
                      'S7' => $row['EPS_Y1'],
                      'S8' => $row['EPS_Y2'],
                      'S9' => $row['EPS_Q1'],
                      'S10' => $row['EPS_Q6'],
                      'S11' => $row['EPS_Q7'],
                      'S12' => $row['EPS_Q8'],
                      'SY' => $row['EPS_YEARLY_GROWTH']);

    return $output;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// PRIVATE METHODS: MYSQL DATABASE INITIALIZATION AND SELECT STATEMENTS
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getWtsStmt($db, $rowLimit)
{
    $stmt = $db->prepare('SELECT M.ID, M.NAME, M.SECTOR, M.OWNED, M.NSE_CODE, M.BSE_CODE, M.LAST_QTR,
                                 M.PRICE, M.PE, M.PEG, M.DIV_YIELD, M.PBV, M.INTEREST_PERCENT, M.MARGINS_TTM,
                                 M.EARNINGS_YOY_GROWTH, M.PROFITS_YOY_GROWTH, M.EPS_YOY_GROWTH, M.EQ_SHR_CAP_Y1,
                                 M.EQ_SHR_CAP_Q5, M.EQ_SHR_CAP_Q3,
                                 M.EPS_Q1, M.EPS_Q2, M.EPS_Q3, M.EPS_Q4, M.EPS_Q5, M.EPS_Q6, M.EPS_Q7, M.EPS_Q8,
                                 S.EARNINGS_YOY_GROWTH_PTS, S.EARNINGS_QOQ_GROWTH_PTS, S.EARNINGS_YEARLY_GROWTH_PTS,
                                 S.PROFITS_YOY_GROWTH_PTS, S.PROFITS_QOQ_GROWTH_PTS, S.PROFITS_YEARLY_GROWTH_PTS,
                                 S.EPS_YOY_GROWTH_PTS, S.EPS_QOQ_GROWTH_PTS, S.EPS_YEARLY_GROWTH_PTS,
                                 S.MARGINS_PERCENT_PTS, S.MARGINS_YEARLY_GROWTH_PTS ,
                                 S.INTEREST_PERCENT_PTS, S.INTEREST_YEARLY_GROWTH_PTS,
                                 S.PE_LOW, S.PE_HIGH, S.STD_DEV_SCORE,
                                 S.PE_PTS, S.DIV_YIELD_PTS, S.DIV_GROWTH_PTS, S.BV_GROWTH_PTS,
                                 S.MAX_WEIGHTED_POINTS, S.SCORED_WEIGHTED_POINTS,
                                 S.PERCENTAGE_SCORED, S.PERCENTAGE_SCORED_OLD,
                                 S.ATTR1, S.ATTR6, S.ATTR7, S.ATTR8
                          FROM SCORE S, MASTER M WHERE S.ID = M.ID LIMIT ' . $rowLimit);

    return $stmt;
}

function getSimilarStmt($db)
{
    $stmt = $db->prepare('SELECT M1.ID, M1.NAME FROM MASTER M1 WHERE
                          M1.EARNINGS_YEARLY_GROWTH > (SELECT M2.EARNINGS_YEARLY_GROWTH * 0.8 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.PROFITS_YEARLY_GROWTH > (SELECT M2.PROFITS_YEARLY_GROWTH * 0.8 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.EPS_YEARLY_GROWTH > (SELECT M2.EPS_YEARLY_GROWTH * 0.8 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.EARNINGS_YOY_GROWTH > (SELECT M2.EARNINGS_YOY_GROWTH * 0.75 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.PROFITS_YOY_GROWTH > (SELECT M2.PROFITS_YOY_GROWTH * 0.75 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.EPS_YOY_GROWTH > (SELECT M2.EPS_YOY_GROWTH * 0.75 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.EARNINGS_QOQ_GROWTH > (SELECT M2.EARNINGS_QOQ_GROWTH * 0.7 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.PROFITS_QOQ_GROWTH > (SELECT M2.PROFITS_QOQ_GROWTH * 0.7 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.EPS_QOQ_GROWTH > (SELECT M2.EPS_QOQ_GROWTH * 0.7 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.MARGINS_TTM > (SELECT M2.MARGINS_TTM * 0.8 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.DIV_YIELD > (SELECT M2.DIV_YIELD * 0.8 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.PE < (SELECT M2.PE * 1.2 FROM MASTER M2 WHERE M2.ID = ?) AND
                          M1.ID != ?');
    return $stmt;
}

function getPeersStmt($db, $sector, $rowLimit)
{
    $stmt = $db->prepare("SELECT M.ID, M.NAME, M.PRICE, M.LAST_QTR, M.PE, M.PEG, M.DIV_YIELD, M.PBV,
                          M.INTEREST_PERCENT, M.MARGINS_TTM, M.BV_GROWTH, M.DIV_GROWTH, M.EQ_SHR_CAP_Q5,
                          M.EARNINGS_YOY_GROWTH, M.EARNINGS_QOQ_GROWTH, M.EARNINGS_YEARLY_GROWTH,
                          M.INTEREST_YOY_GROWTH, M.INTEREST_QOQ_GROWTH, M.INTEREST_YEARLY_GROWTH,
                          M.PROFITS_YOY_GROWTH, M.PROFITS_QOQ_GROWTH, M.PROFITS_YEARLY_GROWTH,
                          M.MARGINS_YOY_GROWTH, M.MARGINS_QOQ_GROWTH, M.MARGINS_YEARLY_GROWTH,
                          M.EPS_YOY_GROWTH, M.EPS_QOQ_GROWTH, M.EPS_YEARLY_GROWTH, M.EQ_SHR_CAP_Q3,
                          M.EV_EBITDA_Y1
                          FROM MASTER M WHERE M.SECTOR LIKE '%/{$sector}%' LIMIT " . $rowLimit);

    return $stmt;
}

function getWatchlistStmt($db, $userEmail, $rowLimit)
{
    $stmt = $db->prepare("SELECT M.ID, M.NAME, M.PRICE, M.LAST_QTR, M.PE, M.PEG, M.DIV_YIELD, M.PBV,
                          M.INTEREST_PERCENT, M.MARGINS_TTM, M.BV_GROWTH, M.DIV_GROWTH, M.EQ_SHR_CAP_Q5,
                          M.EARNINGS_YOY_GROWTH, M.EARNINGS_QOQ_GROWTH, M.EARNINGS_YEARLY_GROWTH,
                          M.INTEREST_YOY_GROWTH, M.INTEREST_QOQ_GROWTH, M.INTEREST_YEARLY_GROWTH,
                          M.PROFITS_YOY_GROWTH, M.PROFITS_QOQ_GROWTH, M.PROFITS_YEARLY_GROWTH,
                          M.MARGINS_YOY_GROWTH, M.MARGINS_QOQ_GROWTH, M.MARGINS_YEARLY_GROWTH,
                          M.EPS_YOY_GROWTH, M.EPS_QOQ_GROWTH, M.EPS_YEARLY_GROWTH, M.EQ_SHR_CAP_Q3,
                          M.EV_EBITDA_Y1
                          FROM MASTER M WHERE M.ID IN (SELECT W.STOCK_ID FROM WATCHLIST W
                          WHERE W.USER_ID = (SELECT U.ID FROM USERS U WHERE U.EMAIL LIKE '" . $userEmail . "')) LIMIT " . $rowLimit);

    return $stmt;
}

function getStockStmt($db)
{
    $stmt = $db->prepare('SELECT M.ID, M.NAME, M.SECTOR, M.BSE_CODE, M.LAST_QTR,
                          M.PRICE, M.PE, M.PEG, M.DIV_YIELD, M.PBV,
                          M.EARNINGS_Q1, M.EARNINGS_Q2, M.EARNINGS_Q3, M.EARNINGS_Q4, M.EARNINGS_Q5,
                          M.EARNINGS_TTM, M.EARNINGS_Y1, M.EARNINGS_Y2, M.EARNINGS_YOY_GROWTH, M.EQ_SHR_CAP_Y1,
                          M.INTEREST_Q1, M.INTEREST_Q2, M.INTEREST_Q3, M.INTEREST_Q4, M.INTEREST_Q5,
                          M.INTEREST_TTM, M.INTEREST_Y1, M.INTEREST_Y2, M.INTEREST_PERCENT,
                          M.PROFITS_Q1, M.PROFITS_Q2, M.PROFITS_Q3, M.PROFITS_Q4, M.PROFITS_Q5,
                          M.PROFITS_TTM, M.PROFITS_Y1, M.PROFITS_Y2,
                          M.MARGINS_Q1, M.MARGINS_Q2, M.MARGINS_Q3, M.MARGINS_Q4, M.MARGINS_Q5,
                          M.MARGINS_TTM, M.MARGINS_Y1, M.MARGINS_Y2,
                          M.EPS_Q1, M.EPS_Q2, M.EPS_Q3, M.EPS_Q4, M.EPS_Q5, M.EPS_Q6, M.EPS_Q7, M.EPS_Q8,
                          M.EPS_TTM, M.EPS_Y1, M.EPS_Y2, M.EQ_SHR_CAP_Q3, M.EQ_SHR_CAP_Q4,
                          M.EQ_SHR_CAP_Q5, M.EQ_SHR_CAP_Y2, M.FV_Q5, M.FV_Y1,
                          M.EARNINGS_YEARLY_GROWTH, M.INTEREST_YEARLY_GROWTH, M.PROFITS_YEARLY_GROWTH,
                          M.MARGINS_YEARLY_GROWTH, M.EPS_YEARLY_GROWTH,
                          S.PE_LOW, S.PE_HIGH, S.MAX_WEIGHTED_POINTS, S.SCORED_WEIGHTED_POINTS,
                          S.PERCENTAGE_SCORED, S.PERCENTAGE_SCORED_OLD, S.STD_DEV_SCORE,
                          S.ATTR1, S.ATTR8
                          FROM MASTER M, SCORE S WHERE M.ID = S.ID AND M.ID = ?');

    return $stmt;
}

function getHistoricalScoreStmt($db)
{
    $stmt = $db->prepare('SELECT STOCK_ID, DT, SCORE, PRICE, ATTR1, COMMENT FROM HISTORICAL_SCORE WHERE STOCK_ID = ?');

    return $stmt;
}

function getDB()
{
    $dbhost = '172.17.0.2';
    $dbuser = 'root';
    $dbpass = 'admin';
    $dbname = 'investr';

    $mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
    $dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
    $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbConnection;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// MAIN REST API METHODS
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$app = new \Slim\App();

$maxPts = array(9, 9, 9,    9, 9, 9,    9, 9, 9,    12, 9,    9, 12,    12, 12, 9, 9);

function generateAccountJSON($response, $userEmail)
{
    try {
        $db = getDB();
        $stmt = $db->prepare('SELECT DONATION, MESSAGE, ATTR1 FROM PREFS WHERE USER_ID = (SELECT ID FROM USERS WHERE EMAIL = ?)');
        $stmt->bindParam(1, $userEmail, PDO::PARAM_STR);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $membershipStatus = $row["DONATION"];
            $expiryDate =  $row['MESSAGE'];
            $userUsage = $row['ATTR1'];

            $stmt = $db->prepare('SELECT AVG(ATTR1) AS AVGUSAGE FROM PREFS WHERE USER_ID != 1');
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $averageUsage = $row['AVGUSAGE'];

                $output = array('MEMBERSHIP_STATUS' => $membershipStatus,
                                'EXPIRY_DATE' => $expiryDate,
                                'USAGE' => "Your Usage Is " . round($userUsage/$averageUsage, 2) . "x Times The Average Usage!");

                $db = null;

                echo json_encode($output);
            }
        } else {
            echo 0;
        }
    } catch(PDOException $e) {
         echo 0;
    }
}

function generateNoticeJSON($response, $userEmail)
{
    try {
        $db = getDB();
        $stmt = $db->prepare('SELECT NOTICE FROM NOTIFICATIONS WHERE SENT = 0 AND SEND_TO_USER_ID = (SELECT ID FROM USERS WHERE EMAIL = ?)');
        $stmt->bindParam(1, $userEmail, PDO::PARAM_STR);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // This is a 2D array that will eventually be converted into a JSON object and returned.
        $output = array();

        if($rows) {
            foreach ($rows as $row) {
                $output[] = array('NOTICE' => $row['NOTICE']);
            }

            // Mark notices as sent
            $stmt = $db->prepare('UPDATE NOTIFICATIONS SET SENT = 1 WHERE SEND_TO_USER_ID = (SELECT ID FROM USERS WHERE EMAIL = ?)');
            $stmt->bindParam(1, $userEmail, PDO::PARAM_STR);
            $stmt->execute();

            $db = null;

            echo json_encode($output);
        } else {
            echo 0;
        }
    } catch(PDOException $e) {
         echo 0;
    }
}


function generateSimilarJSON($response, $stockID)
{
    try {
        $db = getDB();
        $stmt = getSimilarStmt($db);

        $stmt->bindParam(1, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(2, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(3, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(4, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(5, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(6, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(7, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(8, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(9, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(10, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(11, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(12, intval($stockID), PDO::PARAM_INT);
        $stmt->bindParam(13, intval($stockID), PDO::PARAM_INT);

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // This is a 2D array that will eventually be converted into a JSON object and returned.
        $output = array();

        if($rows) {
            foreach ($rows as $row) {
                $output[] = getOutputForSimilars($row);
            }

        }

        $db = null;

        echo json_encode($output);

    } catch(PDOException $e) {
        $response->withStatus(404)->write($e->getMessage());
    }
}

function generateWatchlistJSON($response, $userID, $rowLimit)
{
    try {
        $db = getDB();
        $stmt = getWatchlistStmt($db, base64_decode($userID), $rowLimit); // Decode to get email!

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // This is a 2D array that will eventually be converted into a JSON object and returned.
        $output = array();

        if($rows) {
            foreach ($rows as $row) {
                $output[] = getOutputForPeersAndWatchlist($row);
            }

            $db = null;

            echo json_encode($output);
        } else {
            throw new PDOException('No records found.');
        }
    } catch(PDOException $e) {
        $response->withStatus(404)->write($e->getMessage());
    }
}

function generatePeersJSON($response, $sector, $rowLimit)
{
    try {
        $db = getDB();
        $stmt = getPeersStmt($db, $sector, $rowLimit);

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // This is a 2D array that will eventually be converted into a JSON object and returned.
        $output = array();

        if($rows) {
            foreach ($rows as $row) {
                $output[] = getOutputForPeersAndWatchlist($row);
            }

            $db = null;

            echo json_encode($output);
        } else {
            throw new PDOException('No records found.');
        }
    } catch(PDOException $e) {
        $response->withStatus(404)->write($e->getMessage());
    }
}


function generateStockJSON($response, $stockID)
{
    try {
        $db = getDB();
        $stmt = getStockStmt($db);

        $stmt->bindParam(1, intval($stockID), PDO::PARAM_INT);

        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
       
        if($row) {
            $output = getOutputForStockID($row);

            $db = null;

            echo json_encode($output);
      } else {
            throw new PDOException('No records found.');
        }
    } catch(PDOException $e) {
        $response->withStatus(404)->write($e->getMessage());
    }
}

function generateHistoricalScoreJSON($response, $stockID)
{
    try {
        $db = getDB();
        $stmt = getHistoricalScoreStmt($db);

        $stmt->bindParam(1, intval($stockID), PDO::PARAM_INT);

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // This is a 2D array that will eventually be converted into a JSON object and returned.
        $output = array();

        if($rows) {
            foreach ($rows as $row) {
                $output[] = array('DT' => $row['DT'], 'S' => $row['SCORE'], 'P' => $row['PRICE'],
                                  'PE' => $row['ATTR1'], 'C' => $row['COMMENT']);
            }

            $db = null;

            echo json_encode($output);
        } else {
            throw new PDOException('No records found.');
        }
    } catch(PDOException $e) {
        $response->withStatus(404)->write($e->getMessage());
    }
}

function generateWtsJSON($response, $wts, $rowLimit)
{
    GLOBAL $maxPts;

    // Calculate MAXIMUM weighted score
    $maxWtdScore = getWeightedScore($maxPts, $wts);

    try {
        $db = getDB();
        $stmt = getWtsStmt($db, $rowLimit);

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // This is a 2D array that will eventually be converted into a JSON object and returned.
        $output = array();

        if($rows) {
            foreach ($rows as $row) {
                // In case of flat and opt weights (i.e. not user defined) we will have a +ve maxWtdScore
                if ($maxWtdScore > 0) {
                    $pts = getPts($row);
                    $wtdScore = getWeightedScore($pts, $wts);
                    $percentageScore = getPercentageScore($maxWtdScore, $wtdScore);
                    $output[] = getOutputForPredefinedWts($row, $percentageScore);
                } else {
                    // In case of user defined weights maxWtdScore will be zero.
                    // The calculation of max wt and scored wt will happen on the client side.
                    $output[] = getOutputForUserWts($row);
                }
            }

            $db = null;

            echo json_encode($output);
	    } else {
            throw new PDOException('No records found.');
        }
    } catch(PDOException $e) {
        $response->withStatus(404)->write($e->getMessage());
    }
}

function generateTime($response)
{
    $response->withStatus(200);
    date_default_timezone_set('Asia/Kolkata');
    echo date('Y-m-d H:i:s');
}


function generatePortfolioGrowthJSON($response, $userEmail)
{
    try {
        $db = getDB();
        $stmt = $db->prepare('SELECT DT, PORTFOLIO_ID, MOVE, CURRENT, NOTES FROM PORTFOLIO_GROWTH WHERE PORTFOLIO_ID = (SELECT ID FROM USERS WHERE EMAIL LIKE \'' . $userEmail . '\')');
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // This is a 2D array that will eventually be converted into a JSON object and returned.
        $output = array();

        if($rows) {
            foreach ($rows as $row) {
            $output[] = array('D' => $row['DT'], 'P' => $row['PORTFOLIO_ID'], 'M' => $row['MOVE'],
                                  'C' => $row['CURRENT'], 'N' => $row['NOTES']);
            }

            $db = null;

            echo json_encode($output);
        } else {
            throw new PDOException('No records found.');
        }
    } catch(PDOException $e) {
        $response->withStatus(404)->write($e->getMessage());
    }
}

function generateEarningsJSON($response)
{
    try {
        $db = getDB();
        $stmt = $db->prepare('SELECT SUM(EARNINGS_Q1) AS EQ1, SUM(EARNINGS_Q2) AS EQ2, SUM(EARNINGS_Q3)  AS EQ3,
                                     SUM(EARNINGS_Q4) AS EQ4, SUM(EARNINGS_Q5) AS EQ5, SUM(EARNINGS_TTM) AS ETTM,
                                     SUM(INTEREST_Q1) AS IQ1, SUM(INTEREST_Q2) AS IQ2, SUM(INTEREST_Q3)  AS IQ3,
                                     SUM(INTEREST_Q4) AS IQ4, SUM(INTEREST_Q5) AS IQ5, SUM(INTEREST_TTM) AS ITTM,
                                     SUM(PROFITS_Q1)  AS PQ1, SUM(PROFITS_Q2)  AS PQ2, SUM(PROFITS_Q3)   AS PQ3,
                                     SUM(PROFITS_Q4)  AS PQ4, SUM(PROFITS_Q5)  AS PQ5, SUM(PROFITS_TTM)  AS PTTM
                              FROM MASTER');
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);


        if($row) {
            $output = array('EQ1' => $row['EQ1'], 'EQ2' => $row['EQ2'], 'EQ3' =>$row['EQ3'],
                            'EQ4' => $row['EQ4'], 'EQ5' => $row['EQ5'], 'ETTM'=>$row['ETTM'],
                            'IQ1' => $row['IQ1'], 'IQ2' => $row['IQ2'], 'IQ3' =>$row['IQ3'],
                            'IQ4' => $row['IQ4'], 'IQ5' => $row['IQ5'], 'ITTM'=>$row['ITTM'],
                            'PQ1' => $row['PQ1'], 'PQ2' => $row['PQ2'], 'PQ3' =>$row['PQ3'],
                            'PQ4' => $row['PQ4'], 'PQ5' => $row['PQ5'], 'PTTM'=>$row['PTTM']);

            $db = null;

            echo json_encode($output);
        } else {
            throw new PDOException('No records found.');
        }
    } catch(PDOException $e) {
        $response->withStatus(404)->write($e->getMessage());
    }
}

$app->get('/api/wts/flat/{rowLimit}', function ($request, $response, $args) {
    // Set weights
    $wts = array(1, 1, 1,    1, 1, 1,    1, 1, 1,    1, 1,    0, 0,    1, 1, 1, 1);

    generateWtsJSON($response, $wts, $args['rowLimit']);
});

$app->get('/api/wts/opt/{rowLimit}', function ($request, $response, $args) {
    // Set weights
    $wts = array(2, 1, 2,    1.5, 1, 2,    2, 1, 2,    2, 3,    1, 1,    2, 2, 0, 1);

    generateWtsJSON($response, $wts, $args['rowLimit']);
});

$app->get('/api/wts/gwth/{rowLimit}', function ($request, $response, $args) {
    // Set weights
    $wts = array(5, 3, 4,    5, 3, 4,    4, 2, 3,    1, 1,    1, 1,    1, 1, 1, 1);

    generateWtsJSON($response, $wts, $args['rowLimit']);
});

$app->get('/api/wts/user/{rowLimit}', function ($request, $response, $args) {
    // Init array with zeros in case of user provided weights
    $wts = array(0, 0, 0,    0, 0, 0,    0, 0, 0,    0, 0,    0, 0,    0, 0, 0, 0);

    generateWtsJSON($response, $wts, $args['rowLimit']);
});

$app->get('/api/peers/{sector}/{rowLimit}', function ($request, $response, $args) {
    generatePeersJSON($response, $args['sector'], $args['rowLimit']);
});

$app->get('/api/stock/{stockID}', function ($request, $response, $args) {
    generateStockJSON($response, $args['stockID']);
});

$app->get('/api/stock/hisscr/{stockID}', function ($request, $response, $args) {
    generateHistoricalScoreJSON($response, $args['stockID']);
});

$app->get('/e0icqv739v/notice/{userEmail}', function ($request, $response, $args) {
    generateNoticeJSON($response, $args['userEmail']);
});

$app->get('/account/{userEmail}', function ($request, $response, $args) {
    generateAccountJSON($response, $args['userEmail']);
});

$app->get('/api/similar/{stockID}', function ($request, $response, $args) {
    generateSimilarJSON($response, $args['stockID']);
});

$app->get('/api/watchlist/{userID}/{rowLimit}', function ($request, $response, $args) {
    generateWatchlistJSON($response, $args['userID'], $args['rowLimit']);
});

$app->get('/api/time', function ($request, $response, $args) {
    generateTime($response);
});

$app->get('/portfoliogrowth/{userEmail}', function ($request, $response, $args) {
    generatePortfolioGrowthJSON($response, $args['userEmail']);
});

$app->get('/earnings', function ($request, $response, $args) {
    generateEarningsJSON($response);
});

$app->run();

