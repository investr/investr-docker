CREATE TABLE SCORE (
    ID             INTEGER PRIMARY KEY NOT NULL,
    EARNINGS_YOY_GROWTH_PTS       INTEGER          ,
    EARNINGS_QOQ_GROWTH_PTS       INTEGER          ,
    EARNINGS_YEARLY_GROWTH_PTS    INTEGER          ,
    PROFITS_YOY_GROWTH_PTS        INTEGER          ,
    PROFITS_QOQ_GROWTH_PTS        INTEGER          ,
    PROFITS_YEARLY_GROWTH_PTS     INTEGER          ,
    EPS_YOY_GROWTH_PTS            INTEGER          ,
    EPS_QOQ_GROWTH_PTS            INTEGER          ,
    EPS_YEARLY_GROWTH_PTS         INTEGER          , 
    MARGINS_PERCENT_PTS           INTEGER          ,
    MARGINS_YEARLY_GROWTH_PTS     INTEGER          ,
    INTEREST_PERCENT_PTS          INTEGER          ,
    INTEREST_YEARLY_GROWTH_PTS    INTEGER          ,
    PE_PTS             INTEGER                     ,
    PE_LOW             INTEGER                     ,
    PE_HIGH            INTEGER                     ,
    PEG_PTS            INTEGER                     ,
    DIV_YIELD_PTS      INTEGER                     ,
    DIV_GROWTH_PTS     INTEGER                     ,
    BV_GROWTH_PTS      INTEGER                     ,
    MAX_WEIGHTED_POINTS    REAL                    ,
    SCORED_WEIGHTED_POINTS REAL                    ,
    PERCENTAGE_SCORED      REAL                    ,
    PERCENTAGE_SCORED_OLD  REAL
, STD_DEV_SCORE REAL, STD_DEV_MARGINS REAL, ATTR1 REAL, ATTR2 REAL, ATTR3 REAL, ATTR4 REAL, ATTR5 REAL, ATTR6 TEXT, ATTR7 TEXT, ATTR8 TEXT, ATTR9 TEXT);
CREATE TABLE MASTER (
    ID             INTEGER PRIMARY KEY NOT NULL,
    NAME           TEXT                NOT NULL,
    NSE_CODE       TEXT                        ,
    BSE_CODE       TEXT                        ,
    PRICE          REAL                        ,
    SECTOR         TEXT                        ,
    OWNED          TEXT                        ,
    MC_CODE        TEXT                        ,
    MC_NAME        TEXT                        ,
    MC_URL         TEXT                        ,
    MC_S_OR_C      TEXT                        ,
    LAST_QTR       TEXT                        ,
    EARNINGS_Q1    REAL                     ,
    EARNINGS_Q2    REAL                     ,
    EARNINGS_Q3    REAL                     ,
    EARNINGS_Q4    REAL                     ,
    EARNINGS_Q5    REAL                     ,
    EARNINGS_TTM   REAL                     ,
    EARNINGS_Y1    REAL                     ,
    EARNINGS_Y2    REAL                     ,
    EARNINGS_YOY_GROWTH       REAL          ,
    EARNINGS_QOQ_GROWTH       REAL          ,
    EARNINGS_YEARLY_GROWTH    REAL          ,
    INTEREST_Q1    REAL                     ,
    INTEREST_Q2    REAL                     ,
    INTEREST_Q3    REAL                     ,
    INTEREST_Q4    REAL                     ,
    INTEREST_Q5    REAL                     ,
    INTEREST_TTM   REAL                     ,
    INTEREST_Y1    REAL                     ,
    INTEREST_Y2    REAL                     ,
    INTEREST_YOY_GROWTH       REAL          ,
    INTEREST_QOQ_GROWTH       REAL          ,
    INTEREST_YEARLY_GROWTH    REAL          ,
    INTEREST_PERCENT          REAL          ,
    PROFITS_Q1     REAL                     ,
    PROFITS_Q2     REAL                     ,
    PROFITS_Q3     REAL                     ,
    PROFITS_Q4     REAL                     ,
    PROFITS_Q5     REAL                     ,
    PROFITS_TTM    REAL                     ,
    PROFITS_Y1     REAL                     ,
    PROFITS_Y2     REAL                     ,
    PROFITS_YOY_GROWTH       REAL           ,
    PROFITS_QOQ_GROWTH       REAL           ,
    PROFITS_YEARLY_GROWTH    REAL           ,
    MARGINS_Q1     REAL                     ,
    MARGINS_Q2     REAL                     ,
    MARGINS_Q3     REAL                     ,
    MARGINS_Q4     REAL                     ,
    MARGINS_Q5     REAL                     ,
    MARGINS_TTM    REAL                     ,
    MARGINS_Y1     REAL                     ,
    MARGINS_Y2     REAL                     ,
    MARGINS_YOY_GROWTH       REAL           ,
    MARGINS_QOQ_GROWTH       REAL           ,
    MARGINS_YEARLY_GROWTH    REAL           ,
    EQ_SHR_CAP_Q1  REAL                     ,
    EQ_SHR_CAP_Q2  REAL                     ,
    EQ_SHR_CAP_Q3  REAL                     ,
    EQ_SHR_CAP_Q4  REAL                     ,
    EQ_SHR_CAP_Q5  REAL                     ,
    EQ_SHR_CAP_TTM REAL                     ,
    EQ_SHR_CAP_Y1  REAL                     ,
    EQ_SHR_CAP_Y2  REAL                     ,
    FV_Q1          INTEGER                  ,
    FV_Q2          INTEGER                  ,
    FV_Q3          INTEGER                  ,
    FV_Q4          INTEGER                  ,
    FV_Q5          INTEGER                  ,
    FV_Y1          INTEGER                  ,
    FV_Y2          INTEGER                  ,
    EPS_Q1         REAL                     ,
    EPS_Q2         REAL                     ,
    EPS_Q3         REAL                     ,
    EPS_Q4         REAL                     ,
    EPS_Q5         REAL                     ,
    EPS_TTM        REAL                     ,
    EPS_Y1         REAL                     ,
    EPS_Y2         REAL                     ,
    EPS_YOY_GROWTH           REAL           ,
    EPS_QOQ_GROWTH           REAL           ,
    EPS_YEARLY_GROWTH        REAL           , 
    BV_Y1          REAL                     ,
    BV_Y2          REAL                     ,
    BV_GROWTH      REAL                     ,
    DIV_Y1         REAL                     ,
    DIV_Y2         REAL                     ,
    DIV_GROWTH     REAL                     ,
    PE             REAL                     ,
    PEG            REAL                     ,
    DIV_YIELD      REAL                     ,
    PBV            REAL   
, YEAR_ENDS TEXT, EARNINGS_Q6 REAL, EARNINGS_Q7 REAL, EARNINGS_Q8 REAL, INTEREST_Q6 REAL, INTEREST_Q7 REAL, INTEREST_Q8 REAL, PROFITS_Q6 REAL, PROFITS_Q7 REAL, PROFITS_Q8 REAL, MARGINS_Q6 REAL, MARGINS_Q7 REAL, MARGINS_Q8 REAL, EPS_Q6 REAL, EPS_Q7 REAL, EPS_Q8 REAL, EV_Y1 REAL, EV_Y2 REAL, EV_EBITDA_Y1 REAL, EV_EBITDA_Y2 REAL, ATTR1 REAL, ATTR2 REAL, ATTR3 REAL, ATTR4 REAL, ATTR5 REAL, ATTR6 REAL, ATTR7 REAL, ATTR8 REAL, ATTR9 REAL, ATTR10 REAL, ATTR11 TEXT, ATTR12 TEXT, ATTR13 TEXT, ATTR14 TEXT, ATTR15 TEXT);
CREATE TABLE TEMP (
    ID             INTEGER    PRIMARY KEY,
    DT             TEXT       UNIQUE     ,
    PORTFOLIO_ID   INTEGER               ,
    MOVE           REAL                  ,
    CURRENT        REAL                  ,
    NOTES          TEXT                  ,
    ATTR1          TEXT                  ,
    ATTR2          TEXT                  ,
    ATTR3          TEXT                  ,
    ATTR4          TEXT                  ,
    ATTR5          TEXT
);
CREATE TABLE HISTORICAL_SCORE (
    STOCK_ID INTEGER NOT NULL,
    DT DATE NOT NULL,
    SCORE REAL,
    SCORE_CHANGE REAL,
    SCORE_HIGH REAL,
    SCORE_LOW REAL,
    PRICE REAL,
    COMMENT TEXT,
    ATTR1 TEXT,
    ATTR2 TEXT,
    ATTR3 TEXT,
    ATTR4 TEXT,
    ATTR5 TEXT,
    UNIQUE (STOCK_ID, DT)
);
CREATE TRIGGER QTRLY_GROWTH AFTER UPDATE ON MASTER
BEGIN
    UPDATE MASTER
        SET EARNINGS_TTM = ROUND(EARNINGS_Q1 + EARNINGS_Q2 + EARNINGS_Q3 + EARNINGS_Q4, 2),
            INTEREST_TTM = ROUND(INTEREST_Q1 + INTEREST_Q2 + INTEREST_Q3 + INTEREST_Q4, 2),
            PROFITS_TTM = ROUND(PROFITS_Q1 + PROFITS_Q2 + PROFITS_Q3 + PROFITS_Q4, 2),
            EPS_TTM = ROUND(PROFITS_TTM/EQ_SHR_CAP_TTM, 2),
            MARGINS_Q1 = ROUND(PROFITS_Q1*100/EARNINGS_Q1, 2),
            MARGINS_Q2 = ROUND(PROFITS_Q2*100/EARNINGS_Q2, 2),
            MARGINS_Q3 = ROUND(PROFITS_Q3*100/EARNINGS_Q3, 2),
            MARGINS_Q4 = ROUND(PROFITS_Q4*100/EARNINGS_Q4, 2),
            MARGINS_Q5 = ROUND(PROFITS_Q5*100/EARNINGS_Q5, 2),
            MARGINS_Q6 = ROUND(PROFITS_Q6*100/EARNINGS_Q6, 2),
            MARGINS_Q7 = ROUND(PROFITS_Q7*100/EARNINGS_Q7, 2),
            MARGINS_Q8 = ROUND(PROFITS_Q8*100/EARNINGS_Q8, 2),
            MARGINS_TTM = ROUND(PROFITS_TTM*100/EARNINGS_TTM, 2),
            EPS_Q1 = ROUND(PROFITS_Q1/EQ_SHR_CAP_TTM, 2),
            EPS_Q2 = ROUND(PROFITS_Q2/EQ_SHR_CAP_TTM, 2),
            EPS_Q3 = ROUND(PROFITS_Q3/EQ_SHR_CAP_TTM, 2),
            EPS_Q4 = ROUND(PROFITS_Q4/EQ_SHR_CAP_TTM, 2),
            EPS_Q5 = ROUND(PROFITS_Q5/EQ_SHR_CAP_TTM, 2),
            EPS_Q6 = ROUND(PROFITS_Q6/EQ_SHR_CAP_TTM, 2),
            EPS_Q7 = ROUND(PROFITS_Q7/EQ_SHR_CAP_TTM, 2),
            EPS_Q8 = ROUND(PROFITS_Q8/EQ_SHR_CAP_TTM, 2),
            EARNINGS_YOY_GROWTH = ROUND((EARNINGS_Q1 - EARNINGS_Q5)*100/ABS(EARNINGS_Q5), 2),
            EARNINGS_QOQ_GROWTH = ROUND((EARNINGS_Q1 - EARNINGS_Q2)*100/ABS(EARNINGS_Q2), 2),
            INTEREST_YOY_GROWTH = ROUND((INTEREST_Q1 - INTEREST_Q5)*100/ABS(INTEREST_Q5), 2),
            INTEREST_QOQ_GROWTH = ROUND((INTEREST_Q1 - INTEREST_Q2)*100/ABS(INTEREST_Q2), 2),
            PROFITS_YOY_GROWTH = ROUND((PROFITS_Q1 - PROFITS_Q5)*100/ABS(PROFITS_Q5), 2),
            PROFITS_QOQ_GROWTH = ROUND((PROFITS_Q1 - PROFITS_Q2)*100/ABS(PROFITS_Q2), 2),
            MARGINS_YOY_GROWTH = ROUND((MARGINS_Q1 - MARGINS_Q5)*100/ABS(MARGINS_Q5), 2),
            MARGINS_QOQ_GROWTH = ROUND((MARGINS_Q1 - MARGINS_Q2)*100/ABS(MARGINS_Q2), 2),
            EPS_YOY_GROWTH = ROUND((EPS_Q1 - EPS_Q5)*100/ABS(EPS_Q5), 2),
            EPS_QOQ_GROWTH = ROUND((EPS_Q1 - EPS_Q2)*100/ABS(EPS_Q2), 2)
        WHERE ID = NEW.ID;
END;
CREATE TABLE AUTO_CALLS (
    STOCK_ID                  INTEGER,
    NAME                      TEXT,
    STATUS                    TEXT DEFAULT 'OPEN', -- VALID VALUES: OPEN / CLOSED
    CALL_TYPE                 TEXT, -- VALID VALUES: BUY / SELL
    CALL_PRICE                REAL,
    CALL_TIMESTAMP            DATETIME DEFAULT CURRENT_TIMESTAMP,
    SQUAREOFF_PRICE           REAL,
    SQUAREOFF_TIMESTAMP       DATETIME,
    BUY_STRATEGY_CODE         INTEGER,
    SELL_STRATEGY_CODE        INTEGER,
    BUY_STRATEGY_COMMENTS     TEXT,
    SELL_STRATEGY_COMMENTS    TEXT,
    PERCENT_GAIN              REAL,
    HELD_DAYS                 INTEGER,
    PERCENT_GAIN_PER_DAY_HELD REAL
);
CREATE TRIGGER AUTO_CALLS_GAINS AFTER UPDATE ON AUTO_CALLS
BEGIN
    UPDATE AUTO_CALLS
        SET PERCENT_GAIN = ROUND(((SQUAREOFF_PRICE - CALL_PRICE)/CALL_PRICE)*100, 2),
            HELD_DAYS = ROUND(JULIANDAY(SQUAREOFF_TIMESTAMP) - JULIANDAY(CALL_TIMESTAMP), 2),
            PERCENT_GAIN_PER_DAY_HELD = ROUND(ROUND(((SQUAREOFF_PRICE - CALL_PRICE)/CALL_PRICE)*100, 2)/ROUND(JULIANDAY(SQUAREOFF_TIMESTAMP) - JULIANDAY(CALL_TIMESTAMP), 2), 2)
        WHERE STOCK_ID = NEW.STOCK_ID;
END;
CREATE TABLE BACK_TEST_AUTO_CALLS (
    STOCK_ID                  INTEGER,
    NAME                      TEXT,
    STATUS                    TEXT DEFAULT 'OPEN', -- VALID VALUES: OPEN / CLOSED
    CALL_TYPE                 TEXT, -- VALID VALUES: BUY / SELL
    CALL_PRICE                REAL,
    CALL_TIMESTAMP            DATETIME,
    SQUAREOFF_PRICE           REAL,
    SQUAREOFF_TIMESTAMP       DATETIME,
    BUY_STRATEGY_CODE         INTEGER,
    SELL_STRATEGY_CODE        INTEGER,
    BUY_STRATEGY_COMMENTS     TEXT,
    SELL_STRATEGY_COMMENTS    TEXT,
    PERCENT_GAIN              REAL,
    HELD_DAYS                 INTEGER,
    PERCENT_GAIN_PER_DAY_HELD REAL
);
CREATE TRIGGER BACK_TEST_AUTO_CALLS_GAINS AFTER UPDATE ON BACK_TEST_AUTO_CALLS
BEGIN
    UPDATE BACK_TEST_AUTO_CALLS
        SET PERCENT_GAIN = ROUND(((SQUAREOFF_PRICE - CALL_PRICE)/CALL_PRICE)*100, 2),
            HELD_DAYS = ROUND(JULIANDAY(SQUAREOFF_TIMESTAMP) - JULIANDAY(CALL_TIMESTAMP), 2),
            PERCENT_GAIN_PER_DAY_HELD = ROUND(ROUND(((SQUAREOFF_PRICE - CALL_PRICE)/CALL_PRICE)*100, 2)/ROUND(JULIANDAY(SQUAREOFF_TIMESTAMP) - JULIANDAY(CALL_TIMESTAMP), 2), 2)
        WHERE STOCK_ID = NEW.STOCK_ID;
END;
CREATE TRIGGER YEARLY_GROWTH AFTER UPDATE ON MASTER
BEGIN
    UPDATE MASTER
        SET EPS_Y1 = ROUND(PROFITS_Y1/EQ_SHR_CAP_TTM, 2),
            EPS_Y2 = ROUND(PROFITS_Y2/EQ_SHR_CAP_TTM, 2),
            EARNINGS_YEARLY_GROWTH = ROUND((EARNINGS_TTM - EARNINGS_Y1)*100/ABS(EARNINGS_Y1), 2),
            INTEREST_YEARLY_GROWTH = ROUND((INTEREST_TTM - INTEREST_Y1)*100/ABS(INTEREST_Y1), 2),
            PROFITS_YEARLY_GROWTH = ROUND((PROFITS_TTM - PROFITS_Y1)*100/ABS(PROFITS_Y1), 2),
            MARGINS_Y1 = ROUND(PROFITS_Y1*100/EARNINGS_Y1, 2),
            MARGINS_Y2 = ROUND(PROFITS_Y2*100/EARNINGS_Y2, 2),
            MARGINS_YEARLY_GROWTH = ROUND((MARGINS_TTM - MARGINS_Y1)*100/ABS(MARGINS_Y1), 2),
            EPS_YEARLY_GROWTH = ROUND((EPS_TTM - EPS_Y1)*100/ABS(EPS_Y1), 2),
            BV_GROWTH = ROUND((BV_Y1 - BV_Y2)*100/ABS(BV_Y2), 2),
            INTEREST_PERCENT = ROUND((INTEREST_TTM*100)/EARNINGS_TTM, 2),
            EQ_SHR_CAP_Q3 = ROUND((PROFITS_Y1/EQ_SHR_CAP_Q1)*100, 2),
            EQ_SHR_CAP_Q4 = ROUND((PROFITS_Y2/EQ_SHR_CAP_Q2)*100, 2),
            EQ_SHR_CAP_Q5 = ROUND(FV_Q1/FV_Q3, 2),
            EQ_SHR_CAP_Y2 = ROUND(FV_Q2/FV_Q4, 2),
            FV_Q5 = ROUND(FV_Q1 - FV_Q3, 2),
            FV_Y1 = ROUND(FV_Q2 - FV_Q4, 2)
        WHERE ID = NEW.ID;

    UPDATE MASTER
        SET EARNINGS_YEARLY_GROWTH = ROUND((EARNINGS_TTM - EARNINGS_Q5 - EARNINGS_Q6 - EARNINGS_Q7 - EARNINGS_Q8)*100/ABS(EARNINGS_Q5 + EARNINGS_Q6 + EARNINGS_Q7 + EARNINGS_Q8), 2),
            INTEREST_YEARLY_GROWTH = ROUND((INTEREST_TTM - INTEREST_Q5 - INTEREST_Q6 - INTEREST_Q7 - INTEREST_Q8)*100/ABS(INTEREST_Q5 + INTEREST_Q6 + INTEREST_Q7 + INTEREST_Q8), 2),
            PROFITS_YEARLY_GROWTH = ROUND((PROFITS_TTM - PROFITS_Q5 - PROFITS_Q6 - PROFITS_Q7 - PROFITS_Q8)*100/ABS(PROFITS_Q5 + PROFITS_Q6 + PROFITS_Q7 + PROFITS_Q8), 2),
            MARGINS_YEARLY_GROWTH = ROUND((MARGINS_TTM - MARGINS_Q5 - MARGINS_Q6 - MARGINS_Q7 - MARGINS_Q8)*100/ABS(MARGINS_Q5 + MARGINS_Q6 + MARGINS_Q7 + MARGINS_Q8), 2),
            EPS_YEARLY_GROWTH = ROUND((EPS_TTM - EPS_Q5 - EPS_Q6 - EPS_Q7 - EPS_Q8)*100/ABS(EPS_Q5 + EPS_Q6 + EPS_Q7 + EPS_Q8), 2)
        WHERE ID = NEW.ID AND LAST_QTR = 'Jun 18';
END;
CREATE TRIGGER RATIOS AFTER UPDATE ON MASTER
BEGIN
    UPDATE MASTER
        SET PE = ROUND(PRICE/EPS_TTM, 2),
            PEG = ROUND(PE/EPS_YEARLY_GROWTH, 2),
            DIV_YIELD = ROUND(DIV_Y1*100/PRICE, 2),
            PBV = ROUND(PRICE/BV_Y1, 2),
            DIV_GROWTH = ROUND(PRICE/(EARNINGS_TTM/EQ_SHR_CAP_TTM), 2),
            EQ_SHR_CAP_Y1 = ROUND(PRICE*EQ_SHR_CAP_TTM, 2)
        WHERE ID = NEW.ID;
END;
CREATE TABLE PROJECTIONS (
    ID INTEGER PRIMARY KEY NOT NULL, 
    PRICE REAL,                      
    EPS_TTM REAL,                    
    PE_LOW REAL,                     
    DIV_YIELD REAL,                  
    DILUTION REAL,                   
    STD_DEVIATION REAL,              
    FW_GROWTH_1 REAL,                
    FW_GROWTH_2 REAL,                
    FW_GROWTH_3 REAL,                
    PERIOD REAL,                     
    PROJECTED_PRICE REAL,            
    PROJECTED_PRICE_LOW REAL,        
    PROJECTED_PRICE_HIGH REAL,       
    CAGR REAL,                       
    CAGR_LOW REAL,                   
    CAGR_HIGH REAL,                  
    VERDICT TEXT                     
);
CREATE TRIGGER UPDATE_CALLS_SCORE AFTER UPDATE ON SCORE
BEGIN
    UPDATE SCORE SET ATTR7 = "Sell"       WHERE ID = NEW.ID AND ATTR2 <= 5;
    UPDATE SCORE SET ATTR7 = "Reduce"     WHERE ID = NEW.ID AND ATTR2 BETWEEN 5  AND 10;
    UPDATE SCORE SET ATTR7 = "Hold"       WHERE ID = NEW.ID AND ATTR2 BETWEEN 10 AND 18;
    UPDATE SCORE SET ATTR7 = "Accumulate" WHERE ID = NEW.ID AND ATTR2 BETWEEN 18 AND 30;
    UPDATE SCORE SET ATTR7 = "Buy(Strong)" WHERE ID = NEW.ID AND ATTR2 IS NOT NULL AND ATTR2 > 30;
END;
