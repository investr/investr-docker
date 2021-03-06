DELETE FROM MASTER;
DELETE FROM SCORE;
DELETE FROM HISTORICAL_SCORE;

load data local infile '/var/lib/mysql-files/ec2score.csv' into table SCORE fields terminated by ',' enclosed by '"' lines terminated by '\n'
(
    ID                                      ,
    EARNINGS_YOY_GROWTH_PTS                 ,
    EARNINGS_QOQ_GROWTH_PTS                 ,
    EARNINGS_YEARLY_GROWTH_PTS              ,
    PROFITS_YOY_GROWTH_PTS                  ,
    PROFITS_QOQ_GROWTH_PTS                  ,
    PROFITS_YEARLY_GROWTH_PTS               ,
    EPS_YOY_GROWTH_PTS                      ,
    EPS_QOQ_GROWTH_PTS                      ,
    EPS_YEARLY_GROWTH_PTS                   ,
    MARGINS_PERCENT_PTS                     ,
    MARGINS_YEARLY_GROWTH_PTS               ,
    INTEREST_PERCENT_PTS                    ,
    INTEREST_YEARLY_GROWTH_PTS              ,
    PE_PTS                                  ,
    PE_LOW                                  ,
    PE_HIGH                                 ,
    PEG_PTS                                 ,
    DIV_YIELD_PTS                           ,
    DIV_GROWTH_PTS                          ,
    BV_GROWTH_PTS                           ,
    MAX_WEIGHTED_POINTS                     ,
    SCORED_WEIGHTED_POINTS                  ,
    PERCENTAGE_SCORED                       ,
    PERCENTAGE_SCORED_OLD                   ,
    STD_DEV_SCORE                           ,
    STD_DEV_MARGINS                         ,
    ATTR1                                   ,
    ATTR2                                   ,
    ATTR3                                   ,
    ATTR4                                   ,
    ATTR5                                   ,
    ATTR6                                   ,
    ATTR7                                   ,
    ATTR8                                   ,
    ATTR9
);

load data local infile '/var/lib/mysql-files/ec2master.csv' into table MASTER fields terminated by ',' enclosed by '"' lines terminated by '\n'
(
    ID                                  ,
    NAME                                ,
    NSE_CODE                            ,
    BSE_CODE                            ,
    PRICE                               ,
    SECTOR                              ,
    OWNED                               ,
    MC_CODE                             ,
    MC_NAME                             ,
    MC_URL                              ,
    MC_S_OR_C                           ,
    LAST_QTR                            ,
    EARNINGS_Q1                         ,
    EARNINGS_Q2                         ,
    EARNINGS_Q3                         ,
    EARNINGS_Q4                         ,
    EARNINGS_Q5                         ,
    EARNINGS_TTM                        ,
    EARNINGS_Y1                         ,
    EARNINGS_Y2                         ,
    EARNINGS_YOY_GROWTH                 ,
    EARNINGS_QOQ_GROWTH                 ,
    EARNINGS_YEARLY_GROWTH              ,
    INTEREST_Q1                         ,
    INTEREST_Q2                         ,
    INTEREST_Q3                         ,
    INTEREST_Q4                         ,
    INTEREST_Q5                         ,
    INTEREST_TTM                        ,
    INTEREST_Y1                         ,
    INTEREST_Y2                         ,
    INTEREST_YOY_GROWTH                 ,
    INTEREST_QOQ_GROWTH                 ,
    INTEREST_YEARLY_GROWTH              ,
    INTEREST_PERCENT                    ,
    PROFITS_Q1                          ,
    PROFITS_Q2                          ,
    PROFITS_Q3                          ,
    PROFITS_Q4                          ,
    PROFITS_Q5                          ,
    PROFITS_TTM                         ,
    PROFITS_Y1                          ,
    PROFITS_Y2                          ,
    PROFITS_YOY_GROWTH                  ,
    PROFITS_QOQ_GROWTH                  ,
    PROFITS_YEARLY_GROWTH               ,
    MARGINS_Q1                          ,
    MARGINS_Q2                          ,
    MARGINS_Q3                          ,
    MARGINS_Q4                          ,
    MARGINS_Q5                          ,
    MARGINS_TTM                         ,
    MARGINS_Y1                          ,
    MARGINS_Y2                          ,
    MARGINS_YOY_GROWTH                  ,
    MARGINS_QOQ_GROWTH                  ,
    MARGINS_YEARLY_GROWTH               ,
    EQ_SHR_CAP_Q1                       ,
    EQ_SHR_CAP_Q2                       ,
    EQ_SHR_CAP_Q3                       ,
    EQ_SHR_CAP_Q4                       ,
    EQ_SHR_CAP_Q5                       ,
    EQ_SHR_CAP_TTM                      ,
    EQ_SHR_CAP_Y1                       ,
    EQ_SHR_CAP_Y2                       ,
    FV_Q1                               ,
    FV_Q2                               ,
    FV_Q3                               ,
    FV_Q4                               ,
    FV_Q5                               ,
    FV_Y1                               ,
    FV_Y2                               ,
    EPS_Q1                              ,
    EPS_Q2                              ,
    EPS_Q3                              ,
    EPS_Q4                              ,
    EPS_Q5                              ,
    EPS_TTM                             ,
    EPS_Y1                              ,
    EPS_Y2                              ,
    EPS_YOY_GROWTH                      ,
    EPS_QOQ_GROWTH                      ,
    EPS_YEARLY_GROWTH                   ,
    BV_Y1                               ,
    BV_Y2                               ,
    BV_GROWTH                           ,
    DIV_Y1                              ,
    DIV_Y2                              ,
    DIV_GROWTH                          ,
    PE                                  ,
    PEG                                 ,
    DIV_YIELD                           ,
    PBV                                 ,
    YEAR_ENDS                           ,
    EARNINGS_Q6                         ,
    EARNINGS_Q7                         ,
    EARNINGS_Q8                         ,
    INTEREST_Q6                         ,
    INTEREST_Q7                         ,
    INTEREST_Q8                         ,
    PROFITS_Q6                          ,
    PROFITS_Q7                          ,
    PROFITS_Q8                          ,
    MARGINS_Q6                          ,
    MARGINS_Q7                          ,
    MARGINS_Q8                          ,
    EPS_Q6                              ,
    EPS_Q7                              ,
    EPS_Q8                              ,
    EV_Y1                               ,
    EV_Y2                               ,
    EV_EBITDA_Y1                        ,
    EV_EBITDA_Y2                        ,
    ATTR1                               ,
    ATTR2                               ,
    ATTR3                               ,
    ATTR4                               ,
    ATTR5                               ,
    ATTR6                               ,
    ATTR7                               ,
    ATTR8                               ,
    ATTR9                               ,
    ATTR10                              ,
    ATTR11                              ,
    ATTR12                              ,
    ATTR13                              ,
    ATTR14                              ,
    ATTR15
);

load data local infile '/var/lib/mysql-files/ec2hisscr.csv' into table HISTORICAL_SCORE fields terminated by ',' enclosed by '"' lines terminated by '\n'
(
    STOCK_ID,
    DT,
    SCORE,
    SCORE_CHANGE,
    SCORE_HIGH,
    SCORE_LOW,
    PRICE,
    COMMENT,
    ATTR1,
    ATTR2,
    ATTR3,
    ATTR4,
    ATTR5
);
COMMIT;
