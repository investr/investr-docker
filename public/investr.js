// First thing we do is, load the user customizations from the DB if the user is logged in
loadUserCustomizations();

// Global variables that store the user defined weights
var lsE, lsF, lsG, lsH, lsI, lsJ, lsK, lsL, lsM, lsQ, lsR, lsS, lsT, lsW, lsX, lsY, lsZ;

// Get the user defined valuations. We have set the defaults.
var userValuations = [50,    25, 50,    0, 25,    0, 0,    0, 0];
if (typeof localStorage.InvestrUserValuations !== 'undefined') {
    userValuations = JSON.parse(localStorage.getItem("InvestrUserValuations"));
} else {
    localStorage.setItem("InvestrUserValuations", JSON.stringify(userValuations));
}

// GREEN/Blue Bands
var GREEN_BAND_LOWER = userValuations[0];
var BLUE_BAND_LOWER = userValuations[1];
var BLUE_BAND_HIGHER = userValuations[2];
var PE_BAND_LOWER = userValuations[3];
var PE_BAND_HIGHER = userValuations[4];
var PEG_BAND_LOWER = userValuations[5];
var PEG_BAND_HIGHER = userValuations[6];
var DY_BAND_LOWER = userValuations[7];
var DY_BAND_HIGHER = userValuations[8];
var AUTO_PEG_DY = 0;

// This my secret. When range of PEG and DY is same then we enable auto mode
// where in we green/blue band a company if its DY is greater than PEG
if ((PEG_BAND_LOWER === PEG_BAND_HIGHER) && (DY_BAND_LOWER === DY_BAND_HIGHER) &&
    (PEG_BAND_LOWER === DY_BAND_LOWER) && (PEG_BAND_HIGHER === DY_BAND_HIGHER)) {
    AUTO_PEG_DY = 1;
}

// Get the user defined tolerance. We have set the defaults.
var userTolerance = [0, 15,    0, 50,    0, 30,    3, 10,    10, 10,   3];
if (typeof localStorage.InvestrUserTolerance !== 'undefined') {
    userTolerance = JSON.parse(localStorage.getItem("InvestrUserTolerance"));
} else {
    localStorage.setItem("InvestrUserTolerance", JSON.stringify(userTolerance));
}

// Consistency and Price vs 30 DMA Tolerance
var TL_CONSISTENCY_LOWER = userTolerance[0];
var TL_CONSISTENCY_HIGHER = userTolerance[1];
var BL_CONSISTENCY_LOWER = userTolerance[2];
var BL_CONSISTENCY_HIGHER = userTolerance[3];
var PRICE_DMA_TOLERANCE = userTolerance[4];
var YOY_QTRLY_TL_BL_EPS_GRWTH_SYNC_TOLERANCE = userTolerance[5];
var INTEREST_PERCENT_TOLERANCE = userTolerance[6];
var PROFIT_MARGIN_TOLERANCE = userTolerance[7];
var YOY_QTRLY_TL_GRWTH_TOLERANCE = userTolerance[8];
var ROA_TOLERANCE = userTolerance[9];
var SCORE_CONSISTENCY_TOLERANCE = userTolerance[10];
var CR_TOLERANCE = 2;

// Number of days the scores are saved for before being overwritten
var DAYS_SCORE_SAVED = 7;

// Controls how many stocks are fetched from the database.
var rowLimit = '1000';
if (isUserLoggedIn()) {
    if (isMembershipActive()) {
        rowLimit = '1000';
    }
}

function chkPEGandDY(peg, divYield) {
    if (AUTO_PEG_DY) {
        if (peg < divYield && peg > 0)
            return true;
        else
            return false;
    } else {
        if (isBetween(peg, PEG_BAND_LOWER, PEG_BAND_HIGHER) && isBetween(divYield, DY_BAND_LOWER, DY_BAND_HIGHER))
            return true;
        else
            return false;
    }
}

function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

// Removes duplicates from an array
function uniqueArray(list) {
    var result = [];
    $.each(list, function(i, e) {
    if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

// Get the last payment
// Payments will be store in the followin JSON format after serialization
//
// [
//     {
//         "date": "",
//         "rs": 15,
//         "type": "donation",
//         "expires": "never"
//     },
//     {
//         "date": "",
//         "rs": 16,
//         "type": "charge",
//         "expires": "<date>"
//     }
// ]
function isPaidUser() {
    if (isUserLoggedIn()) {
        $.ajax({
            type: 'POST',
            url: "user.php",
            data: {
                "callFunc": "getPrefs",
                "userEmail": localStorage.getItem("InvestrUser"),
                "prefName": "DONATION"
            },
            dataType: "text",
            success: function (response) {
                response = response.replace(/^\s+|\s+$/g, ""); // Remove the trailing new line

                var payments = null;
                if (response.length === 0 || response === "NaN")
                    payments = null;
                else
                    payments = response;

                // Currently we are just checking if a there is some value in the payment.
                // But later we need to check individual payment and return true or false
                // based on the validity of those payments
                if (payments != null) {
                    return true;
                } else {
                    return false;
                }
            },
            async: false // NOTE: We want to wait for call to finish.
        });
    } else {
        return false;
    }
}

// We set the localStorage variable on user login. Check that variable
// to see if a user has logged in.
function isUserLoggedIn() {
    if (typeof localStorage.InvestrUser === 'undefined' || localStorage.getItem("InvestrUser") === "null")
        return false;
    else
        return true;
}

function getUserLoggedIn() {
    var userEmail = localStorage.getItem("InvestrUser");
    if (userEmail != null && userEmail.indexOf("@"))
        return userEmail;
    else
        null;
}

function loadSettings() {
    if (typeof localStorage.InvestrUserWeights !== 'undefined') {
        var userWeights = JSON.parse(localStorage.getItem("InvestrUserWeights"));
        lsE = userWeights[0];
        lsF = userWeights[1];
        lsG = userWeights[2];
        lsH = userWeights[3];
        lsI = userWeights[4];
        lsJ = userWeights[5];
        lsK = userWeights[6];
        lsL = userWeights[7];
        lsM = userWeights[8];
        lsQ = userWeights[9];
        lsR = userWeights[10];
        lsS = userWeights[11];
        lsT = userWeights[12];
        lsW = userWeights[13];
        lsX = userWeights[14];
        lsY = userWeights[15];
        lsZ = userWeights[16];
    } else {
        // If user is visiting for the first time then we set defaults to Growth weights!
        lsE = 5; lsF = 3; lsG = 4; lsH = 5; lsI = 3; lsJ = 4; lsK = 4; lsL = 2; lsM = 3; lsQ = lsR = lsW = lsX = lsY = lsZ = 1;
        lsS = lsT = 0;

        var userWeights = [5,3,4,    5,3,4,    4,2,3,   1,1,    0,0,    1,1,1,1];
        localStorage.setItem("InvestrUserWeights", JSON.stringify(userWeights));
    }
}

function getEncodedUserId()
{
    var encoder = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=encoder._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=encoder._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    if (getUserLoggedIn() != null)
        return encoder.encode(getUserLoggedIn());
    else
        null;
}

function standardDeviation(values){
    var avg = average(values);

    var squareDiffs = values.map(function(value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function average(data){
    var sum = data.reduce(function(sum, value) {
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}

function getGrowth(oldVal, newVal)
{
    var growth = ((newVal - oldVal)*100)/Math.abs(oldVal);

    return Math.round(growth * 100) / 100;
}

function getPercentageScore(maxPts, pts)
{
    var percent = (pts*100)/maxPts;

    // Round it off to 2 decimals
    return Math.round(percent * 100) / 100;
}

function getWeightedScore(lpts, lwts)
{
    var totalWtdScore = 0;

    for(i = 0; i < lpts.length; i++) {
        totalWtdScore = totalWtdScore + (lpts[i] * lwts[i]);
    }

    return totalWtdScore;
}

var maxWtdScore = 0;
function setMaxWtdScore() {
    var maxPts = [9, 9, 9,    9, 9, 9,    9, 9, 9,    12, 9,    9, 12,    12, 12, 9, 9];
    var wts = [lsE, lsF, lsG,     lsH, lsI, lsJ,     lsK, lsL, lsM,     lsQ, lsR,     lsS, lsT,     lsW, lsX, lsY, lsZ];

    maxWtdScore = getWeightedScore(maxPts, wts);
}

function isBetween(x, min, max) {
    return x > min && x <= max;
}

function isConsistent(d) {
    var eSD = parseFloat(d.ESD);
    var pSD = parseFloat(d.PSD);
    if (isBetween(eSD, TL_CONSISTENCY_LOWER, TL_CONSISTENCY_HIGHER) &&
        isBetween(pSD, BL_CONSISTENCY_LOWER, BL_CONSISTENCY_HIGHER)) {
        return true;
    } else
        return false;
}

function isInterest(d) {
    if (d.ST.indexOf('INVESTMENTS') != -1) {
        return true;
    } else if (d.ST.indexOf('NBFC') != -1) {
        return true;
    } else if (parseFloat(d.U) < INTEREST_PERCENT_TOLERANCE) {
        return true;
    } else {
        return false;
    }
}

function isTurnAround(score, d) {
    if (score > BLUE_BAND_LOWER &&
        parseFloat(d.V) > PROFIT_MARGIN_TOLERANCE &&
        isInterest(d) &&
        isConsistent(d) &&
        isBetween(parseFloat(d.PE), PE_BAND_LOWER, PE_BAND_HIGHER) &&
        chkPEGandDY(parseFloat(d.PEG), parseFloat(d.DY)) &&
        parseFloat(d.P) > parseFloat(d.DMA30) &&
        parseFloat(d.P) < parseFloat(d.DMA200)) {
        return true;
    } else {
        return false;
    }
}

function isContra(score, d) {
    if (score > BLUE_BAND_LOWER &&
        parseFloat(d.V) > PROFIT_MARGIN_TOLERANCE &&
        isInterest(d) &&
        isConsistent(d) &&
        isBetween(parseFloat(d.PE), PE_BAND_LOWER, PE_BAND_HIGHER) &&
        chkPEGandDY(parseFloat(d.PEG), parseFloat(d.DY)) &&
        parseFloat(d.P) < parseFloat(d.DMA30) &&
        parseFloat(d.P) < parseFloat(d.DMA200)) {
        return true;
    } else {
        return false;
    }
}

function isDiamond(score, d) {
    // For a stock to be rated diamond it must statisfy all of the following conditions:
    if (score > BLUE_BAND_LOWER &&
        parseFloat(d.V) > PROFIT_MARGIN_TOLERANCE &&
        parseFloat(d.D) > YOY_QTRLY_TL_GRWTH_TOLERANCE &&
        isInterest(d) && isConsistent(d) &&
        parseFloat(d.P) < parseFloat(d.DMA30) &&
        ((isBetween(parseFloat(d.PE), PE_BAND_LOWER, PE_BAND_HIGHER) &&
        chkPEGandDY(parseFloat(d.PEG), parseFloat(d.DY))) ||
        (parseFloat(d.PE) < parseFloat(d.PEL) && parseFloat(d.DY) > DY_BAND_LOWER &&
        parseFloat(d.PEH)/parseFloat(d.PEL) <= 1.5))) {
        return true;
    } else {
        return false;
    }
}

function isYoYQtrlyTLBLEPSGrowthSync(d) {
    var tlGrowth = parseFloat(d.D); // TL growth
    var blGrowth = parseFloat(d.A); // BL growth
    var epsGrowth = parseFloat(d.C); // EPS growth

    // Find the band
    var higher = tlGrowth + (tlGrowth * (YOY_QTRLY_TL_BL_EPS_GRWTH_SYNC_TOLERANCE/100));
    var lower = tlGrowth - (tlGrowth * (YOY_QTRLY_TL_BL_EPS_GRWTH_SYNC_TOLERANCE/100));

    if ((blGrowth  <= higher && blGrowth  >= lower) &&
        (epsGrowth <= higher && epsGrowth >= lower)) {
        return true;
    }
    else {
        return false;
    }
}

function getScoreForIndexmRender(row) {
    var pts = [row.E, row.F, row.G,     row.H, row.I, row.J,     row.K, row.L, row.M,
           row.Q, row.R,              row.S, row.T,     row.W, row.X, row.Y, row.Z];
    var wts = [lsE, lsF, lsG,     lsH, lsI, lsJ,     lsK, lsL, lsM,     lsQ, lsR,     lsS, lsT,     lsW, lsX, lsY, lsZ];

    var score = getWeightedScore(pts, wts);
    var percentScore = getPercentageScore(maxWtdScore, score);

    return percentScore;
}

function setPositiveNegativeTag(row) {
    return row.PN;
}

function setRatingsTag(row) {
    if (row.RT.length > 0)
        return '/rated/' + row.RT;
}

function setConstantGrowthTag(row) {
    var eps1 = Math.round((parseFloat(row.Q1) + parseFloat(row.Q2) + parseFloat(row.Q3) + parseFloat(row.Q4)) * 100) / 100;
    var eps2 = Math.round((parseFloat(row.Q2) + parseFloat(row.Q3) + parseFloat(row.Q4) + parseFloat(row.Q5)) * 100) / 100;
    var eps3 = Math.round((parseFloat(row.Q3) + parseFloat(row.Q4) + parseFloat(row.Q5) + parseFloat(row.Q6)) * 100) / 100;
    var eps4 = Math.round((parseFloat(row.Q4) + parseFloat(row.Q5) + parseFloat(row.Q6) + parseFloat(row.Q7)) * 100) / 100;
    var eps5 = Math.round((parseFloat(row.Q5) + parseFloat(row.Q6) + parseFloat(row.Q7) + parseFloat(row.Q8)) * 100) / 100;

    var epsGwth1 = getGrowth(eps2, eps1);
    var epsGwth2 = getGrowth(eps3, eps2);
    var epsGwth3 = getGrowth(eps4, eps3);
    var epsGwth4 = getGrowth(eps5, eps4);

    var gwthArray = [epsGwth1, epsGwth2, epsGwth3, epsGwth4];
    var epsStdDev = standardDeviation(gwthArray);

    var epsTTM = epsGwth1 + epsGwth2 + epsGwth3 + epsGwth4;

    if (epsStdDev < 1.5 && epsGwth1 > 0 && epsGwth2 > 0 && epsGwth3 > 0 && epsGwth4 > 0) {
        if (epsTTM > 12 && epsTTM <= 16) {
            return '/growth12';
        } else if (epsTTM > 16 && epsTTM <= 20) {
            return '/growth16';
        } else if (epsTTM > 20) {
            return '/growth20';
        } else {
            return '/growth';
        }
    }
}

function setTurnAroundTag(row) {
    var score = parseFloat(row.SR);
    if (typeof score == 'undefined' || isNaN(score)) {
        score = getScoreForIndexmRender(row);
    }

    if (isTurnAround(score, row)) {
        return '/turnaround';
    }
}

function setContraTag(row) {
    var score = parseFloat(row.SR);
    if (typeof score == 'undefined' || isNaN(score)) {
        score = getScoreForIndexmRender(row);
    }

    if (isContra(score, row)) {
        return '/contra';
    }
}

function setDiamondTag(row) {
    var score = parseFloat(row.SR);
    if (typeof score == 'undefined' || isNaN(score)) {
        score = getScoreForIndexmRender(row);
    }

    if (isDiamond(score, row)) {
        return '/gems';
    }
}

function setPEHighLowRangeTag(row) {
    var pe = parseFloat(row.PE);
    var pel = parseFloat(row.PEL);
    var peh = parseFloat(row.PEH);

    if (pe > 0) {
        if (pe < pel) {
            return '/pelow';
        } else if (pe > peh) {
            return '/pehigh';
        }
    }
}

function setPEHighLowRatioTag(row) {
    var pel = parseFloat(row.PEL);
    var peh = parseFloat(row.PEH);

    if (peh/pel <= 1.5) {
        return '/peconsistent';
    }
}

function setYoYQtrlyTLGrwthTag(row) {
    var growth = parseFloat(row.D);
    if (growth > YOY_QTRLY_TL_GRWTH_TOLERANCE) {
        return '/tlgrowth';
    }
}

function setCurrentRatioTag(row) {
    var cr = parseFloat(row.CR);
    if (cr >= CR_TOLERANCE) {
        return '/cratio';
    }
}

function setROATag(row) {
    var roa = parseFloat(row.ROA);
    if (roa > ROA_TOLERANCE) {
        return '/retonass';
    }
}

function setPETag(row) {
    var pe = parseFloat(row.PE);
    if (isBetween(pe, PE_BAND_LOWER, PE_BAND_HIGHER)) {
        return '/pee';
    }
}

function setDYTag(row) {
    var dy = parseFloat(row.DY);

    // If both higher and lower band are 0 then we are in auto mode.
    // In this case set the value for the bands
    if (DY_BAND_LOWER == 0 && DY_BAND_HIGHER == 0) {
        DY_BAND_LOWER = 1;
        DY_BAND_HIGHER = 100;
    }

    if (isBetween(dy, DY_BAND_LOWER, DY_BAND_HIGHER)) {
        return '/divyld';
    }
}

function setPEGTag(row) {
    var peg = parseFloat(row.PEG);

    // If both higher and lower band are 0 then we are in auto mode.
    // In this case set the value for the bands
    if (PEG_BAND_LOWER == 0 && PEG_BAND_HIGHER == 0) {
        PEG_BAND_LOWER = 0;
        PEG_BAND_HIGHER = 1;
    }

    if (isBetween(peg, PEG_BAND_LOWER, PEG_BAND_HIGHER)) {
        return '/peg';
    }
}

function setSyncTag(row) {
    if(isYoYQtrlyTLBLEPSGrowthSync(row)) {
        return '/sync';
    }
}

function setBalanceScale(nRow, aData) {
    var compName = $(nRow).find('td:eq(0)').html();
    if (isYoYQtrlyTLBLEPSGrowthSync(aData)) {
        if (compName.indexOf('fa-balance-scale') == -1) {
            var compNameWithIcon = compName.concat(" <i class=\"fa fa-balance-scale\" aria-hidden=\"true\"></i>");
            $(nRow).find('td:eq(0)').html(compNameWithIcon);
        }
    }
}

function setInterestTag(row) {
    if (isInterest(row)) {
        return '/interest';
    }
}

function setProfitMarginTag(row) {
    var margin = parseFloat(row.V);
    if (margin > PROFIT_MARGIN_TOLERANCE) {
        return '/margin';
    }
}

function setScoreConsistencyTag(row) {
    var scoreCon = parseFloat(row.SC);
    if (isBetween(scoreCon, 0, SCORE_CONSISTENCY_TOLERANCE)) {
        return '/scrcon';
    }
}

function setMarketCap(row) {
    var mc = parseFloat(row.MC);
    if (mc > 50000) {
        return '/largecap';
    } else if (mc < 5000) {
        return '/smallcap';
    } else {
        return '/midcap';
    }
}

function set30DMATag(row) {
    var price = parseFloat(row.P);
    var dma = parseFloat(row.DMA30);
    if (price < dma) {
        return '/price/below30dma';
    } else {
        var deltaPercent = (price - dma)*100/price;
        if (deltaPercent <= PRICE_DMA_TOLERANCE)
            return '/price/below30dma';
        else
            return '/notbelow30dma'
    }
}

function set100DMATag(row) {
    var price = parseFloat(row.P);
    var dma = parseFloat(row.DMA100);
    if (price < dma) {
        return '/below100dma';
    } else {
        var deltaPercent = (price - dma)*100/price;
        if (deltaPercent <= PRICE_DMA_TOLERANCE)
            return '/below100dma';
        else
            return '/notbelow100dma'
    }
}

function set200DMATag(row) {
    var price = parseFloat(row.P);
    var dma = parseFloat(row.DMA200);
    if (price < dma) {
        return '/below200dma';
    } else {
        var deltaPercent = (price - dma)*100/price;
        if (deltaPercent <= PRICE_DMA_TOLERANCE)
            return '/below200dma';
        else
            return '/notbelow200dma'
    }
}

function setDiamond(nRow, aData) {
    var compName = $(nRow).find('td:eq(0)').html();
    var score = parseFloat($(nRow).find('td:eq(1)').html());

    if (isDiamond(score, aData)) {
        if (compName.indexOf('fa-diamond') == -1) {
            var compNameWithDiamond = compName.concat(" <i class=\"fa fa-diamond\" aria-hidden=\"true\"></i>");
            $(nRow).find('td:eq(0)').html(compNameWithDiamond);
        }
    }
}

function setCaution(nRow, aData) {
    var compName = $(nRow).find('td:eq(0)').html();
    var score = parseFloat($(nRow).find('td:eq(1)').html());
    var peg = parseFloat(aData.PEG);
    var dy = parseFloat(aData.DY);

    if (score > 20 && peg <= 0.01 && dy <= 0.1 && !isConsistent(aData)) {
        if (compName.indexOf('fa-exclamation-triangle') == -1) {
            var compNameWithCaution = compName.concat(" <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>");
            $(nRow).find('td:eq(0)').html(compNameWithCaution);
        }
    }
}

function setBelow200DMA(nRow, aData) {
    var compName = $(nRow).find('td:eq(0)').html();
    var price = parseFloat(aData.P);
    var dma200 = parseFloat(aData.DMA200);

    if (price < dma200) {
        if (compName.indexOf('fa-level-down') == -1) {
            var compNameWithLevelDown = compName.concat(" <i class=\"fa fa-level-down\" aria-hidden=\"true\"></i>");
            $(nRow).find('td:eq(0)').html(compNameWithLevelDown);
        }
    }
}

function setSimilar(nRow, aData) {
    var compName = $(nRow).find('td:eq(0)').html();
    var pe = parseFloat(aData.PE);

    if (pe > 3) {
        if (compName.indexOf('fa-random') == -1) {
            var compNameWithSimilar = compName.concat(" <i id=").
                                               concat(aData.ID).
                                               concat(" class=\"fa fa-random\" aria-hidden=\"true\"></i>");
            $(nRow).find('td:eq(0)').html(compNameWithSimilar);
        }
    }
}

function set30DMA(nRow, aData) {
    var price = parseFloat(aData.P);
    var dma = parseFloat(aData.DMA30);
    var compName = $(nRow).find('td:eq(0)').html();
    if (price < dma) {
        if (compName.indexOf('fa-inr') == -1) {
            var compNameWithDMA = compName.concat(" <i class=\"fa fa-inr\" aria-hidden=\"true\"></i>");
            $(nRow).find('td:eq(0)').html(compNameWithDMA);
        }
    } else {
        var deltaPercent = (price - dma)*100/price;
        if (deltaPercent <= PRICE_DMA_TOLERANCE) {
            if (compName.indexOf('fa-inr') == -1) {
                var compNameWithDMA = compName.concat(" <i class=\"fa fa-inr\" aria-hidden=\"true\"></i>");
                $(nRow).find('td:eq(0)').html(compNameWithDMA);
            }
        }
    }
}

function setConsistencyTag(row) {
    if (isConsistent(row)) {
        return '/consistent';
    }
}

function setConsistency(nRow, aData) {
    var compName = $(nRow).find('td:eq(0)').html();
    if (isConsistent(aData)) {
        if (compName.indexOf('fa-bullseye') == -1) {
            var compNameWithConsistency = compName.concat(" <i class=\"fa fa-bullseye\" aria-hidden=\"true\"></i>");
            $(nRow).find('td:eq(0)').html(compNameWithConsistency);
        }
    }
}

function setRatingsCode(nRow, aData) {
    var compName = $(nRow).find('td:eq(0)').html();
    var compRating = aData.RT;

    if (compName.indexOf('ratingsCircle') == -1) {
        if (compRating.length > 0) {
            var compNameWithRating = compName.concat(" <span class=\"ratingsCircle\">").concat(compRating.substr(0, 1)).concat("</span>");
            $(nRow).find('td:eq(0)').html(compNameWithRating);
        }
        else {
            var compNameWithRating = compName.concat(" <span class=\"ratingsCircle\">").concat("N").concat("</span>");
            $(nRow).find('td:eq(0)').html(compNameWithRating);
        }
    }
}

function setColorCircles(nRow, aData){
    var pe = parseFloat(aData.PE);
    var peg = parseFloat(aData.PEG);
    var divYield = parseFloat(aData.DY);
    var compName = $(nRow).find('td:eq(0)').html();
    var score = parseFloat($(nRow).find('td:eq(1)').html());

    // Color code based on valuations
    if (isBetween(pe, PE_BAND_LOWER, PE_BAND_HIGHER) && chkPEGandDY(peg, divYield)) {
        if (isBetween(score, BLUE_BAND_LOWER, BLUE_BAND_HIGHER)) {
            if (compName.indexOf('fa-circle') == -1) {
                var compNameWithCircle = compName.concat(" <i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:blue;\"></i>");
                $(nRow).find('td:eq(0)').html(compNameWithCircle);
            }
        } else if (score > GREEN_BAND_LOWER) {
            if (compName.indexOf('fa-circle') == -1) {
                var compNameWithCircle = compName.concat(" <i class=\"fa fa-circle\" aria-hidden=\"true\" style=\"color:28AE1A;\"></i>");
                $(nRow).find('td:eq(0)').html(compNameWithCircle);
            }
        }
    }
}

function setLastQtrSubscript(nRow, aData){
    var lastQtr = aData.LQ;
    var compName = $(nRow).find('td:eq(0)').html();
    if (compName.indexOf(lastQtr) == -1) {
        var compNameWithLastQtr = compName.concat("  <sub>").concat(lastQtr).concat("</sub>");
        $(nRow).find('td:eq(0)').html(compNameWithLastQtr);
    }
}

function setChartLink(nRow, aData){
    var compName = $(nRow).find('td:eq(0)').html();
    if (compName.indexOf(aData.ID) == -1) {
        var compNameWithChart = compName.concat(" <a href=\"chart.html?id=").concat(aData.ID).concat("\" target=\"_blank\"><i class=\"fa fa-bar-chart\" aria-hidden=\"true\"></i></a>");
        $(nRow).find('td:eq(0)').html(compNameWithChart);
    }
}

function setPeersLink(nRow, aData){
    var compName = $(nRow).find('td:eq(0)').html();
    if (compName.indexOf('peers.html') == -1) {
        var sectorArray = aData.ST.split('/');
        var defaultSector = sectorArray[sectorArray.length - 1];
        var allSectors = aData.ST.replace(/\//g , ',').substring(1);
        var compNameWithPeers = compName.concat(" <a href=\"peers.html?sector=").concat(defaultSector).
                                         concat("&sectors=").concat(allSectors).
                                         concat("&srcStockId=").concat(aData.ID).
                                         concat("\" target=\"_blank\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i></a>");
        $(nRow).find('td:eq(0)').html(compNameWithPeers);
    }
}

function setColorTag(row) {
    var pe = parseFloat(row.PE);
    var peg = parseFloat(row.PEG);
    var divYield = parseFloat(row.DY);
    var score = parseFloat(row.SR);
    if (typeof score == 'undefined' || isNaN(score)) {
        score = getScoreForIndexmRender(row);
    }

    // Color code based on valuations
    if (isBetween(pe, PE_BAND_LOWER, PE_BAND_HIGHER) && chkPEGandDY(peg, divYield)) {
        if (isBetween(score, BLUE_BAND_LOWER, BLUE_BAND_HIGHER)) {
            return '/blue/all';
        } else if (score > GREEN_BAND_LOWER) {
            return '/green/all';
        }
    }
}

Date.prototype.prevDay = function (days) {
    var tmp = new Date (this.getFullYear(), this.getMonth(), this.getDate(), 12, 0, 0, 0);
    return new Date(Number(tmp) - (1000*days) * 3600 * 24);
}

function dateBeforeToday(days) {
    var dt = (new Date()).prevDay(days).getDate();
    if(dt<10) {dt='0'+ dt;}
    return dt;
}

function setScoreChange(nRow, aData, wts) {
    // Try to get the last saved data, if available. We search for the last 7 days.
    // If a user visits us after 7 day he/she does not get score comparision.
    // To accomplish this we mod the date with 7 and add 1, so that we will always
    // get a number between 1 and 7 (inclusive).
    // This means that scores will get over written every 7 days saving us the hassel
    // of have to manually removeing the old entries.
    for (i = 1; i <= 7; i++) {
        var pastDtMod = (dateBeforeToday(i) % 7) + 1;
        var lsPastSRName = (pastDtMod.toString()).concat(wts).concat(aData.ID).toString();
        var rawFromLS = localStorage.getItem(lsPastSRName);
        if (rawFromLS !== null) {
            var pastSR = parseFloat(rawFromLS);
            var compName = $(nRow).find('td:eq(0)').html();
            if (aData.SR > pastSR) {
                if (compName.indexOf('⬆') == -1) {
                    var compNameWithArrow = compName.concat('<span style=\"color:green;\" title=\"').concat(pastSR).concat('\"> &#x2B06;</span>');
                    $(nRow).find('td:eq(0)').html(compNameWithArrow);
                }
            } else if (aData.SR < pastSR) {
                if (compName.indexOf('⬇') == -1) {
                    var compNameWithArrow = compName.concat('<span style=\"color:red;\" title=\"').concat(pastSR).concat('\"> &#x2B07;</span>');
                    $(nRow).find('td:eq(0)').html(compNameWithArrow);
                }
            }
            break;
        }
    }
    // Get today's date in DD format
    var tdMod = (dateBeforeToday(0) % DAYS_SCORE_SAVED) + 1;
    // Create localStore name handle in the format of: 05opt1113
    var lsTdSRName = (tdMod.toString()).concat(wts).concat(aData.ID);
    // Set today score, so it can be used later.
    localStorage.setItem(lsTdSRName, aData.SR);
}

function setWatchlistTag(row) {
    // Get the wishlist from localStorage
    var watchListIDs = JSON.parse(localStorage.getItem("InvestrWatchlist"));
    if ($.inArray(row.ID, watchListIDs) >= 0){
        return "/watchlist";
    }
}

function setNameHREF(row) {
    var nameHREF = row.N;
    if (row.NC !== null && row.NC.length > 0)
        nameHREF = "<a href=\"https://finance.google.com/finance?q=NSE%3A" + row.NC + "\"target=\"_blank\">" + row.N + "</a>";
    else if (row.BC !== null && row.BC.length > 0)
        nameHREF = "<a href=\"https://finance.google.com/finance?q=BOM%3A" + row.BC + "\"target=\"_blank\">" + row.N + "</a>";
    return nameHREF;
}

function getStockAnalysis(d) {
    sdE = parseFloat(d.ESD);
    sdP = parseFloat(d.PSD);
    sdS = parseFloat(d.SC);

    var sdSLog = "";
    if (sdS === 9999)
        sdSLog = "Score consistency unavailable";
    else if (sdS > 0 && sdS <= 3)
        sdSLog = "Extremely consistent score";
    else if (sdS > 3 && sdS <= 6)
        sdSLog = "Reasonably consistent score";
    else if (sdS > 6 && sdS <= 15)
        sdSLog = "Kindof consistent score";
    else if (sdS > 15 && sdS <= 40)
        sdSLog = "Kindof inconsistent score";
    else if (sdS > 40 && sdS <= 100)
        sdSLog = "Pretty inconsistent score";
    else if (sdS > 100)
        sdSLog = "Extremely inconsistent score";


    var sdELog = "";
    if (sdE >= 0 && sdE < 5)
        sdELog = "Extremely consistent TL growth";
    else if (sdE >= 5 && sdE < 15)
        sdELog = "Reasonably consistent TL growth";
    else if (sdE >= 15 && sdE < 30)
        sdELog = "Fluctuating TL growth";
    else if (sdE >= 30)
        sdELog = "Extremely inconsistent TL growth";

    var sdPLog = "";
    if (sdP >= 0 && sdP < 10)
        sdPLog = "Extremely consistent BL growth";
    else if (sdP >= 10 && sdP < 20)
        sdPLog = "Reasonably consistent BL growth";
    else if (sdP >= 20 && sdP < 50)
        sdPLog = "Fluctuating BL growth";
    else if (sdP >= 50)
        sdPLog = "Extremely inconsistent BL growth";

    // The multiply by 100 and then divide by 100 in Math.round() is to get 2 decimals
    var priceLog = "";
    if (parseFloat(d.P) > parseFloat(d.DMA30)) {
        var deltaPercent = Math.round((parseFloat(d.P) - parseFloat(d.DMA30))*100/parseFloat(d.P) * 100)/100;
        priceLog = "CMP " + deltaPercent.toString() + "% above 30 DMA";
    }
    else {
        var deltaPercent = Math.round((parseFloat(d.DMA30) - parseFloat(d.P))*100/parseFloat(d.DMA30) * 100)/100;
        priceLog = "CMP " + deltaPercent.toString() + "% below 30 DMA";
    }

    var fwPeLog = "";
    if (isConsistent(d)) {
        var avgGrowth = ((((parseFloat(d.S6) - parseFloat(d.S7))/parseFloat(d.S7))+((parseFloat(d.S7) - parseFloat(d.S8))/parseFloat(d.S8)))/2);
        var fwEarnings = (parseFloat(d.S6) + (parseFloat(d.S6) * avgGrowth));
        var fwPe = Math.round(parseFloat(d.P)/fwEarnings * 100)/100;
        fwPeLog = "1 Year FW PE: " + fwPe.toString();
    }
    else {
        fwPeLog = "1 Year FW PE: Not Consistent";
    }

    var pvbLog = "Price to Book Ratio: " + d.PBV;

    var marginLog = "Profit Margin: " + d.M6 + "%";

    var interestLog = "Finance Cost as % of Income: " + d.I9;

    var yoyQtrTLGrowthLog = "YoY Qtrly TL Growth: " + d.E9 + "%";

    var marketCapLog = "Mid-Cap Company: " + d.MC + " Crs";
    if (parseFloat(d.MC) > 50000) {
        marketCapLog = "Large-Cap Company: " + d.MC + " Crs";
    } else if (parseFloat(d.MC) < 5000) {
        marketCapLog = "Small-Cap Company: " + d.MC + " Crs";
    }

    var peHLRatio = Math.round(parseFloat(d.PEH)/parseFloat(d.PEL) * 100)/100;
    var peRangeLog = "PE Range: " + d.PEL + " - " + d.PEH + " (" + peHLRatio + ")";

    var roaLog = "ROA up from " + d.ROA2 + " to " + d.ROA1;
    if (parseFloat(d.ROA1) < parseFloat(d.ROA2)) {
        roaLog = "ROA down from " + d.ROA2 + " to " + d.ROA1;
    }

    var crLog = "Current Ratio up from " + d.CR2 + " to " + d.CR1;
    if (parseFloat(d.CR1) < parseFloat(d.CR2)) {
        crLog = "Current Ratio down from " + d.CR2 + " to " + d.CR1;
    }

    var wcLog = "Working Capital up from " + d.WC2 + " to " + d.WC1;
    if (parseInt(d.WC1) < parseInt(d.WC2)) {
        wcLog = "Working Capital down from " + d.WC2 + " to " + d.WC1;
    }

    var eps1 = Math.round((parseFloat(d.S1) + parseFloat(d.S2)  + parseFloat(d.S3)  + parseFloat(d.S4)) * 100) / 100;
    var eps2 = Math.round((parseFloat(d.S2) + parseFloat(d.S3)  + parseFloat(d.S4)  + parseFloat(d.S5)) * 100) / 100;
    var eps3 = Math.round((parseFloat(d.S3) + parseFloat(d.S4)  + parseFloat(d.S5)  + parseFloat(d.S10)) * 100) / 100;
    var eps4 = Math.round((parseFloat(d.S4) + parseFloat(d.S5)  + parseFloat(d.S10) + parseFloat(d.S11)) * 100) / 100;
    var eps5 = Math.round((parseFloat(d.S5) + parseFloat(d.S10) + parseFloat(d.S11) + parseFloat(d.S12)) * 100) / 100;
    var epsLog = "TTM EPSes: " + eps1 + ',' + eps2 + ',' + eps3 + ',' + eps4 + ',' + eps5;

    var epsGwth1 = getGrowth(eps2, eps1);
    var epsGwth2 = getGrowth(eps3, eps2);
    var epsGwth3 = getGrowth(eps4, eps3);
    var epsGwth4 = getGrowth(eps5, eps4);
    var epsGwthLog = "TTM EPSes Gwth: " + epsGwth1 + ',' + epsGwth2 + ',' + epsGwth3 + ',' + epsGwth4;

    return [marketCapLog, peRangeLog, sdSLog, sdELog, sdPLog, priceLog, fwPeLog, pvbLog, marginLog,
            interestLog, yoyQtrTLGrowthLog, roaLog, crLog, wcLog, epsLog, epsGwthLog];
}

function analysisTooltip() {
    // Header row (Name, Score etc), will not have ID so don't show this tip for it.
    $('table').on('mouseover', 'tr', function(event) {
        var idAttr = $(this).attr('id');
        if (typeof idAttr !== typeof undefined && idAttr !== false) {
            $(this).qtip({
                overwrite: false,
                show: {
                    event: event.type,
                    ready: true,
                    solo: true
                },
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 },
                    viewport: $(window)
                },
                content: {
                    text: 'Computing...',
                    ajax: {
                        url: '/api/stock/' + idAttr,
                        type: 'GET',
                        data: {},
                        dataType: 'json',
                        success: function(d) {
                            logs = getStockAnalysis(d);
                            this.set('content.text',logs[0] + '<br>' + logs[1]  + '<br>' + logs[2]  + '<br>' +
                                                    logs[3] + '<br>' + logs[4]  + '<br>' + logs[5]  + '<br>' +
                                                    logs[6] + '<br>' + logs[7]  + '<br>' + logs[8]  + '<br>' +
                                                    logs[9] + '<br>' + logs[10] + '<br>' + logs[11] + '<br>' +
                                                    logs[12]+ '<br>' + logs[13] + '<br>' + logs[14] + '<br>' +
                                                    logs[15]);

                            // Log invocation of analysis tooltip as user activity
                            logUserSessions();
                        }
                    },
                    title: {
                        text: 'Analysis:'
                    }
                }
            }, event);
        }
    });
}

function scoreChangeTooltip() {
    // When mouse hovers on score change arrow, show the old score
    $('table').on('mouseover', 'span[style^="color"]', function(event) {
        $(this).qtip({
            overwrite: false,
            show: {
                event: event.type,
                ready: true
            },
            style: {
                classes: 'qtip-dark qtip-rounded qtip-shadow'
            },
            position: {
                my: "bottom right",
                at: 'top left'
            },
            content: {
                text: 'Old Score: ' + $(this).attr('title')
            }
        }, event);
    });
}

function cautionTooltip() {
    $('table').on('mouseover', 'i[class^="fa fa-exclamation-triangle"]', function(event) {
        $(this).qtip({
            overwrite: false,
            show: {
                event: event.type,
                ready: true,
                solo: true
            },
            hide: {
                fixed: true,
                delay: 300
            },
            style: {
                classes: 'qtip-dark qtip-rounded qtip-shadow'
            },
            content: {
                title: {
                    text: 'Caution:'
                },
                text: 'Dont go just by the score. Investigate more.'
            }
        }, event);
    });
}

function levelDownTooltip() {
    $('table').on('mouseover', 'i[class^="fa fa-level-down"]', function(event) {
        $(this).qtip({
            overwrite: false,
            show: {
                event: event.type,
                ready: true,
                solo: true
            },
            hide: {
                fixed: true,
                delay: 300
            },
            style: {
                classes: 'qtip-dark qtip-rounded qtip-shadow'
            },
            content: {
                title: {
                    text: 'Below 200 DMA:'
                },
                text: 'Stock is in a long term down trend. Investigate more!'
            }
        }, event);
    });
}

function ratingsTooltip() {
    $('table').on('mouseover', 'span[class^="ratingsCircle"]', function(event) {
        $(this).qtip({
            overwrite: false,
            show: {
                event: event.type,
                ready: true,
                solo: true
            },
            hide: {
                fixed: true,
                delay: 300
            },
            style: {
                classes: 'qtip-dark qtip-rounded qtip-shadow'
            },
            content: {
                title: {
                    text: 'Buy/Hold/Sell Rating'
                },
                text: 'B - Buy (Strong)<br>\
                       A - Accumulate<br>\
                       H - Hold<br>\
                       R - Reduce<br>\
                       S - Sell<br>\
                       N - Not Rated<br>\
                       Search for /rated'
            }
        }, event);
    });
}

function similarTooltip() {
    $('table').on('mouseover', 'i[class^="fa fa-random"]', function(event) {
        var idAttr = $(this).attr('id');
        if (typeof idAttr !== typeof undefined && idAttr !== false) {
            $(this).qtip({
                overwrite: false,
                show: {
                    event: event.type,
                    ready: true,
                    solo: true
                },
                hide: {
                    fixed: true,
                    delay: 300
                },
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                        text: 'Fetching similar companies ...',
                        ajax: {
                            url: '/api/similar/' + idAttr,
                            type: 'GET',
                            data: {},
                            dataType: 'json',
                            success: function(d) {
                                var txt = "";

                                if (d.length === 0) {
                                    txt = "No companies found"
                                }
                                else {
                                    for (var i = 0; i < d.length; i++)
                                        txt = txt + "(" + i.toString() + ") " +
                                        "<a href=\"https://investr.co.in/chart.html?id=" + d[i].ID +
                                        "\" target=\"_blank\">" + d[i].N + "</a>" + "<br>";
                                }
                                this.set('content.text', txt);
                            }
                        },
                        title: {
                            text: 'Better Companies:'
                        }
                }
            }, event);
        }
    });

}

function helpTooltip() {
    $.getJSON('res.json', function(helpStrings) {
        // The tool-tip on gift, bell and clock should not be disabled
        $('i[class="fa fa-gift"]').qtip({
            style: {
                classes: 'qtip-dark qtip-rounded qtip-shadow'
            },
            content: {
                text: "Thank you for supporting InvestR by sending an Amazon Gift Card to chirag.rathod+investr@gmail.com! :-)"
            },
            position: {
                my: 'top center',
                at: 'bottom center',
                adjust: { y: 10 }
            }
        });

        $('i[class="fa fa-clock-o"]').qtip({
            style: {
                classes: 'qtip-dark qtip-rounded qtip-shadow'
            },
            hide: {
                fixed: true,
                delay: 300
            },
            content: {
                text: 'Getting time...',
                title: {
                    text: 'Update Schedule:'
                },
                ajax: {
                    url: '/api/time',
                    type: 'GET',
                    data: {},
                    dataType: 'text',
                    success: function(d) {
                        var time = d.split(' ')[1];
                        var hours = parseInt(time.split(':')[0]);
                        var mins = parseInt(time.split(':')[1]);

                        var curMins = hours * 60 + mins;

                        var mins0  = (9  * 60 + 30) - curMins;
                        var mins1  = (10 * 60) - curMins;
                        var mins2  = (10 * 60 + 30) - curMins;
                        var mins3  = (11 * 60) - curMins;
                        var mins4  = (11 * 60 + 30) - curMins;
                        var mins5  = (12 * 60) - curMins;
                        var mins6  = (12 * 60 + 30) - curMins;
                        var mins7  = (13 * 60) - curMins;
                        var mins8  = (13 * 60 + 30) - curMins;
                        var mins9  = (14 * 60) - curMins;
                        var mins10 = (14 * 60 + 30) - curMins;
                        var mins11 = (15 * 60) - curMins;
                        var mins12 = (15 * 60 + 30) - curMins;
                        var mins13 = (16 * 60) - curMins;

                        var next = 1440;
                        if (mins0 > 0) next = Math.min(next, mins0);
                        if (mins1 > 0) next = Math.min(next, mins1);
                        if (mins2 > 0) next = Math.min(next, mins2);
                        if (mins3 > 0) next = Math.min(next, mins3);
                        if (mins4 > 0) next = Math.min(next, mins4);
                        if (mins5 > 0) next = Math.min(next, mins5);
                        if (mins6 > 0) next = Math.min(next, mins6);
                        if (mins7 > 0) next = Math.min(next, mins7);
                        if (mins8 > 0) next = Math.min(next, mins8);
                        if (mins9 > 0) next = Math.min(next, mins9);
                        if (mins10 > 0) next = Math.min(next, mins10);
                        if (mins11 > 0) next = Math.min(next, mins11);
                        if (mins12 > 0) next = Math.min(next, mins12);
                        if (mins13 > 0) next = Math.min(next, mins13);

                        var last = -1440;
                        if (mins0 < 0) last = Math.max(last, mins0);
                        if (mins1 < 0) last = Math.max(last, mins1);
                        if (mins2 < 0) last = Math.max(last, mins2);
                        if (mins3 < 0) last = Math.max(last, mins3);
                        if (mins4 < 0) last = Math.max(last, mins4);
                        if (mins5 < 0) last = Math.max(last, mins5);
                        if (mins6 < 0) last = Math.max(last, mins6);
                        if (mins7 < 0) last = Math.max(last, mins7);
                        if (mins8 < 0) last = Math.max(last, mins8);
                        if (mins9 < 0) last = Math.max(last, mins9);
                        if (mins10 < 0) last = Math.max(last, mins10);
                        if (mins11 < 0) last = Math.max(last, mins11);
                        if (mins12 < 0) last = Math.max(last, mins12);
                        if (mins13 < 0) last = Math.max(last, mins13);

                        var lastH = Math.floor((last*-1)/60);
                        var lastM = (last*-1)%60;
                        var lastLog = "Last: " + lastH + "h " + lastM + "m " + "ago";

                        if (next != 1440) {
                            // Pre market and market hours
                            if (lastH == 24) {
                                lastLog = "Last: Yesterday(?)";
                            }

                            var nextLog = "Next In: " + Math.floor(next/60) + "h " + next%60 + "m";

                            this.set('content.text', lastLog + "<br>" + nextLog);
                        } else {
                            // Post Market
                            var nextLog = "Next: Tomorrow(?)";

                            this.set('content.text', lastLog + "<br>" + nextLog);
                        }
                    }
                }
            },
            position: {
                my: 'top center',
                at: 'bottom center',
                adjust: { y: 10 }
            }
        });

        if (isUserLoggedIn()) {
            var userEmail = getUserLoggedIn();

            $('i[class="fa fa-bell"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                hide: {
                    fixed: true,
                    delay: 300
                },
                content: {
                    text: 'Fetching message...',
                    ajax: {
                        url: '/e0icqv739v/notice/' + userEmail,
                        type: 'GET',
                        data: {},
                        dataType: 'json',
                        success: function(d) {
                            var txt = "";
                            if (d === 0)
                                txt = "No new message.";
                            else {
                                for (var i = 0; i < d.length; i++)
                                txt = txt + "(" + i.toString() + ") " + d[i].NOTICE + "<br>";
                            }
                            this.set('content.text', txt);
                        }
                    }
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    adjust: { y: 10 }
                }
            });
        } else {
            $('i[class="fa fa-bell"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: helpStrings.help_bell
                },
                show: {
                    ready: true
                },
                hide: {
                    fixed: true,
                    delay: 300
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    adjust: { y: 10 }
                }
            });
        }

        // Check for Enable/Disable Help tooltip option.
        var showHelp = localStorage.getItem("InvestrTooltipHelp");

        // Show help tooltips only if our variable is NOT set or it it is set to enable.
        if (showHelp === null || showHelp === "enable") {
            $('#personal').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Personal tab calculates the scores of companies based on the weightages set by you, the user! \
                           Click on the &#x2699; icon on this tab and choose from 3 pre-defined settings: Growth, Value \
                           and Fixed Income. Users who want full control can choose Advanced Options.'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('#optimized').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Optimised tab calculates the scores of companies by giving fair and balanced weightages \
                           to both growth and valuation parameters. Use this tab if you want to start using this site \
                           without setting your personal weight preferences.'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('#sectors').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Sectors tab plots companies in the selected sector on a Bubble chart that compares 5 fundamental parameters in one view.'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('#all').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'All tab plots all available companies on a Scatter chart with customizable X axis and Y axis parameters.'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('#watchlist').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Watchlist tab adds and removes companies to your watchlist.'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('th[aria-label="Name"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Name column displays the name of the company, latest qtr included in computations, link to detailed charts, \
                           consistency in growth (bulls-eye icon) and market price wrt 30 DMA (rupee icon).'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('th[aria-label="% Score: activate to sort column ascending"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Percentage score of the company that signifies its last 2 years\' fundamentals. Higher the better!'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('th[aria-label="Price"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Last updated stock price. This is not the live price.'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('th[aria-label="PE: activate to sort column ascending"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Price to Earnings Ratio is calculated using the last known price divided by the TTM EPS. \
                           Lower the better, but should be positive!'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 }
                }
            });
            $('th[aria-label="PEG: activate to sort column ascending"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'PE to Earnings Growth ratio is calculated by dividing the PE by its yearly EPS growth. \
                           Lower the better, but should be positive!'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 },
                    my: "top right",
                    at: 'bottom left'
                }
            });
            $('th[aria-label="Div Yield: activate to sort column ascending"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                content: {
                    text: 'Dividend Yield is the dividend given by the company expressed as a percentage of the last updated share price. \
                           Higher the better!'
                },
                position: {
                    target: 'mouse',
                    adjust: { mouse: true, x: 15, y: 15 },
                    my: 'top right',
                    at: 'bottom left'
                }
            });
            $('input[type="Search"]').qtip({
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow'
                },
                title: {
                    text: 'Try Searching For:'
                },
                content: {
                    text: '<ul>\
                               <li>/gems: Can accumulate at CMP\
                               <li>/turnaround: Consider accumulating\
                               <li>/contra: Contrarian investment\
                               <li>/all: Green and Blue band companies\
                               <li>/green: Green band companies\
                               <li>/blue: Blue band companies\
                               <li>/scrcon: Consistent score\
                               <li>/consistent: Consistent TL-BL growth\
                               <li>/price: Current price < 30 DMA\
                               <li>/pee: Price to Earnings ratio\
                               <li>/peg: PE to Growth ratio\
                               <li>/divyld: Dividend Yield\
                               <li>/margin: Profit margin\
                               <li>/interest: Paying less interest\
                               <li>/tlgrowth: Good qtrly TL growth\
                               <li>/retonass: Return on Assets\
                               <li>/sync: TL,BL,EPS grwth in sync\
                               <li>/nifty: Companies within NIFTY\
                               <li>/largecap: Large-Caps\
                               <li>/midcap: Mid-Caps\
                               <li>/smallcap: Small-Cap\
                               <li>/pelow: Cheap valuation\
                               <li>/pehigh: Expensive valuation\
                               <li>/peconsistent: Consistent PE\
                               <li>Sectors: auto,nbfc,psubanks etc\
                               <li>Company Name\
                               <li>NSE Code\
                               <li>Quarter name: E.g. Jun 17\
                               <li>Watchlist: Companies in watchlist\
                               <li>Nested Search: /all /consistent /price\
                           </ul>'
                },
                position: {
                    my: "top right",
                    at: 'bottom right',
                    target: $('input[type="Search"]')
                }
            });
        }
    });
}

function setMetaDataAroundCompanyName(nRow, aData) {

    // Append last qtr to name
    setLastQtrSubscript(nRow, aData);

    // Append link to chart
    setChartLink(nRow, aData);

    // Append peer chart link
    setPeersLink(nRow, aData);

    // Append the random icon that will show companies that are similar to or better than given company
    setSimilar(nRow, aData);

    // Set ratings code: N - Not Rated, S - Sell, R - Reduce, H - Hold, A - Accumulate, B - Buy (Strong)
    setRatingsCode(nRow, aData);

    // Append Bulls eye Symbols to denote consistency
    setConsistency(nRow, aData);

    // Append INR symbol to denote price less than 30 DMA
    set30DMA(nRow, aData);

    // Append the caution symbol to denote issues with company dispite its high rating
    setCaution(nRow, aData);

    // Append the level down symbol to denote that stock is in long term down trend
    setBelow200DMA(nRow, aData);

    // Append the diamond symbol to denote how great this company is
    setDiamond(nRow, aData);

    // Append the balance symbol to denote that TL and BL growts are in sync
    setBalanceScale(nRow, aData);

    // Color code based on fundamentals and valuation
    setColorCircles(nRow, aData);
}

function setTags(row, htmlFile) {
    // Set tags:-
    //    Color Code: /green, /blue and /all
    //    Consistency: /consistent
    //    Price below 30 DMA: /price
    //    Interest Paid: /interest
    //    Profit Margin: /margin
    //    YoY TL Growth: /tlgrowth
    //    ROA: /retonass
    //    PE: /pee
    //    YoY TL Growth In Sync: /sync
    //    Great companies: /mine
    //    Good companies going thru downturn: /contra
    //    Good companies doing a turn around: /turnaround (needs to be tested)
    //    PE < Avg Aprox Low PE: /pelow
    //    PE > Avg Aprox High PE: /pehigh
    var allTags = '';
    var colorTag = setColorTag(row);
    var consistencyTag = setConsistencyTag(row);
    var dma30Tag = set30DMATag(row);
    var dma100Tag = set100DMATag(row);
    var dma200Tag = set200DMATag(row);
    var interest = setInterestTag(row);
    var mc = setMarketCap(row);
    var margin = setProfitMarginTag(row);
    var scoreCon = setScoreConsistencyTag(row);
    var tlGrowth = setYoYQtrlyTLGrwthTag(row);
    var roa = setROATag(row);
    var cr = setCurrentRatioTag(row);
    var pe = setPETag(row);
    var dy = setDYTag(row);
    var peg = setPEGTag(row);
    var sync = setSyncTag(row);
    var mine = setDiamondTag(row);
    var contra = setContraTag(row);
    var turnAround = setTurnAroundTag(row);
    var peHighLow = setPEHighLowRangeTag(row);
    var peRatio = setPEHighLowRatioTag(row);
    var posNeg = setPositiveNegativeTag(row);
    var ratings = setRatingsTag(row);
    var constantGrowth = setConstantGrowthTag(row);

    if (typeof colorTag === 'string')
        allTags = allTags.concat(colorTag);
    if (typeof consistencyTag === 'string')
        allTags = allTags.concat(consistencyTag);
    if (typeof dma30Tag === 'string')
        allTags = allTags.concat(dma30Tag);
    if (typeof dma100Tag === 'string')
        allTags = allTags.concat(dma100Tag);
    if (typeof dma200Tag === 'string')
        allTags = allTags.concat(dma200Tag);
    if (typeof interest === 'string')
        allTags = allTags.concat(interest);
    if (typeof mc === 'string')
        allTags = allTags.concat(mc);
    if (typeof margin === 'string')
        allTags = allTags.concat(margin);
    if (typeof scoreCon === 'string')
        allTags = allTags.concat(scoreCon);
    if (typeof tlGrowth === 'string')
        allTags = allTags.concat(tlGrowth);
    if (typeof roa === 'string')
        allTags = allTags.concat(roa);
    if (typeof cr === 'string')
        allTags = allTags.concat(cr);
    if (typeof pe === 'string')
        allTags = allTags.concat(pe);
    if (typeof dy === 'string')
        allTags = allTags.concat(dy);
    if (typeof peg === 'string')
        allTags = allTags.concat(peg);
    if (typeof sync === 'string')
        allTags = allTags.concat(sync);
    if (typeof mine === 'string')
        allTags = allTags.concat(mine);
    if (typeof contra === 'string')
        allTags = allTags.concat(contra);
    if (typeof turnAround === 'string')
        allTags = allTags.concat(turnAround);
    if (typeof peHighLow === 'string')
        allTags = allTags.concat(peHighLow);
    if (typeof peRatio === 'string')
        allTags = allTags.concat(peRatio);
    if (typeof posNeg === 'string')
        allTags = allTags.concat(posNeg);
    if (typeof ratings === 'string')
        allTags = allTags.concat(ratings);
    if (typeof constantGrowth === 'string')
        allTags = allTags.concat(constantGrowth);

    return allTags;
}

function setTooltips() {
    analysisTooltip();

    helpTooltip();

    cautionTooltip();

    similarTooltip();

    levelDownTooltip();

    ratingsTooltip();
}

function workHorse(htmlFile) {
    var table = $('#example').DataTable( {
        "ajax": {
            "url": "/api/wts/" + htmlFile + '/' + rowLimit,
            "dataSrc": ""
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "oLanguage": {
            "sSearch": "<span>Search:</span> _INPUT_",
            "sLengthMenu": "Show _MENU_ companies",
            "sInfo": "Showing _START_ to _END_ of _TOTAL_ companies",
            "sInfoFiltered": " - filtering from _MAX_ companies",
            "sInfoEmpty": "No companies to show",
            "sZeroRecords": "No companies to show",
            "sLoadingRecords": "Fetching companies ..."
        },
        responsive: true,
        "columns": [
            { "data": "ID" },
            { "data": "NC" },
            { "data": "BC" },
            { "data": "LQ" },
            { "data": "N" },
            { "data": "SR" },
            { "data": "P" },
            { "data": "PE" },
            { "data": "PEG" },
            { "data": "DY" },
            { "data": "B" },
            { "data": "ST" },
            { "data": "O" },
            { "data": "ESD" },
            { "data": "PSD" },
            { "data": "DMA30" }
        ],
        "order": [[ 5, "desc" ]],
        "autoWidth": false,
        "aoColumnDefs": [
            {
                "aTargets": [ 0 ],
                "bVisible": false,
                "bSearchable": true
            },
            {
                "aTargets": [ 1 ],
                "bVisible": false
            },
            {
                "aTargets": [ 2 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 3 ],
                "bVisible": false
            },
            {
                "aTargets": [ 4 ],
                "sWidth": "50%",
                "bSortable": false,
                "mRender": function (data, type, row ) {
                    return setNameHREF(row);
                }
            },
            {
                "aTargets": [ 5 ],
                "sWidth": "10%",
                "sClass": "alignRight"
            },
            {
                "aTargets": [ 6 ],
                "sWidth": "10%",
                "sClass": "alignRight",
                "bSortable": false
            },
            {
                "aTargets": [ 7 ],
                "sWidth": "10%",
                "sClass": "alignRight"
            },
            {
                "aTargets": [ 8 ],
                "sWidth": "10%",
                "sClass": "alignRight"
            },
            {
                "aTargets": [ 9 ],
                "sWidth": "10%",
                "sClass": "alignRight"
            },
            {
                "aTargets": [ 10 ],
                "bVisible": false,
                "sDefaultContent": "",
                "mRender": function (data, type, row ) {
                    return setTags(row, htmlFile);
                }
            },
            {
                "aTargets": [ 11 ],
                "bVisible": false
            },
            {
                "aTargets": [ 12 ],
                "bVisible": false,
                "sDefaultContent": "",
                "mRender": function (data, type, row ) {
                    return setWatchlistTag(row);
                }
            },
            {
                "aTargets": [ 13 ],
                "bVisible": false
            },
            {
                "aTargets": [ 14 ],
                "bVisible": false
            },
            {
                "aTargets": [ 15 ],
                "bVisible": false
            }
        ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Set metadata around company's name
            setMetaDataAroundCompanyName(nRow, aData);
        },
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            $(nRow).attr('id', aData.ID);
        }
    } );

    setTooltips();

    return table;
}

function userWorkHorse()
{
    loadSettings();

    setMaxWtdScore();

    $('#example').DataTable( {
        "ajax": {
            "url": "/api/wts/user/" + rowLimit,
            "dataSrc": ""
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "oLanguage": {
            "sSearch": "<span>Search:</span> _INPUT_",
            "sLengthMenu": "Show _MENU_ companies",
            "sInfo": "Showing _START_ to _END_ of _TOTAL_ companies",
            "sInfoFiltered": " - filtering from _MAX_ companies",
            "sInfoEmpty": "No companies to show",
            "sZeroRecords": "No companies to show",
            "sLoadingRecords": "Fetching companies ..."
        },
        responsive: true,
        "columns": [
            { "data": "ID" },
            { "data": "E" },
            { "data": "F" },
            { "data": "G" },
            { "data": "H" },
            { "data": "I" },
            { "data": "J" },
            { "data": "K" },
            { "data": "L" },
            { "data": "M" },
            { "data": "Q" },
            { "data": "R" },
            { "data": "S" },
            { "data": "T" },
            { "data": "W" },
            { "data": "X" },
            { "data": "Y" },
            { "data": "Z" },
            { "data": "NC" },
            { "data": "BC" },
            { "data": "LQ" },
            { "data": "N" },
            { "data": "SR" },
            { "data": "P" },
            { "data": "PE" },
            { "data": "PEG" },
            { "data": "DY" },
            { "data": "B" },
            { "data": "ST" },
            { "data": "O" },
            { "data": "ESD" },
            { "data": "PSD" },
            { "data": "DMA30" }
        ],
        "order": [[ 22, "desc" ]],
        "autoWidth": false,
        "aoColumnDefs": [
            {
                "aTargets": [ 0 ],
                "bVisible": false,
                "bSearchable": true
            },
            ////////////////////////
            {
                "aTargets": [ 1 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 2 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 3 ],
                "bVisible": false,
                "bSearchable": false
            },
            ////////////////////////
            {
                "aTargets": [ 4 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 5 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 6 ],
                "bVisible": false,
                "bSearchable": false
            },
            ////////////////////////
            {
                "aTargets": [ 7 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 8 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 9 ],
                "bVisible": false,
                "bSearchable": false
            },
            ////////////////////////
            {
                "aTargets": [ 10 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 11 ],
                "bVisible": false,
                "bSearchable": false
            },
            ////////////////////////
            {
                "aTargets": [ 12 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 13 ],
                "bVisible": false,
                "bSearchable": false
            },
            ////////////////////////
            {
                "aTargets": [ 14 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 15 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 16 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 17 ],
                "bVisible": false,
                "bSearchable": false
            },
            ////////////////////////
            {
                "aTargets": [ 18 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 19 ],
                "bVisible": false,
                "bSearchable": false
            },
            {
                "aTargets": [ 20 ],
                "bVisible": false
            },
            {
                "aTargets": [ 21 ],
                "sWidth": "50%",
                "bSortable": false,
                "mRender": function (data, type, row ) {
                    return setNameHREF(row);
                }
            },
            {
                "aTargets": [ 22 ],
                "sWidth": "10%",
                "sClass": "alignRight",
                "mRender": function (data, type, row ) {
                    // Calculate and set weighted score
                    return getScoreForIndexmRender(row);
                }
            },
            {
                "aTargets": [ 23 ],
                "sWidth": "10%",
                "sClass": "alignRight",
                "bSortable": false
            },
            {
                "aTargets": [ 24 ],
                "sWidth": "10%",
                "sClass": "alignRight"
            },
            {
                "aTargets": [ 25 ],
                "sWidth": "10%",
                "sClass": "alignRight"
            },
            {
                "aTargets": [ 26 ],
                "sWidth": "10%",
                "sClass": "alignRight"
            },
            {
                "aTargets": [ 27 ],
                "bVisible": false,
                "sDefaultContent": "",
                "mRender": function (data, type, row ) {
                    return setTags(row, 'user');
                }
            },
            {
                "aTargets": [ 28 ],
                "bVisible": false
            },
            {
                "aTargets": [ 29 ],
                "bVisible": false,
                "sDefaultContent": "",
                "mRender": function (data, type, row ) {
                    return setWatchlistTag(row);
                }
            },
            {
                "aTargets": [ 30 ],
                "bVisible": false
            },
            {
                "aTargets": [ 31 ],
                "bVisible": false
            },
            {
                "aTargets": [ 32 ],
                "bVisible": false
            }
        ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Set metadata around company's name
            setMetaDataAroundCompanyName(nRow, aData);
        },
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            $(nRow).attr('id', aData.ID);
        }
    } );

    setTooltips();
}

function loadUserCustomizations() {
    if (isUserLoggedIn()) {
        var userEmail = localStorage.getItem("InvestrUser");

        $.post("user.php",
            {
                "callFunc": "getPrefs",
                "userEmail": userEmail,
                "prefName": "ALL",
            },
            function (response) {
                var prefs = JSON.parse(response);

                if (prefs[0])
                    localStorage.setItem("radio_presets", prefs[0]);

                if (prefs[1])
                    localStorage.setItem("InvestrUserWeights", prefs[1]);

                if (prefs[2])
                    localStorage.setItem("InvestrUserValuations", prefs[2]);

                if (prefs[3])
                    localStorage.setItem("InvestrUserTolerance", prefs[3]);

                if (prefs[4])
                    localStorage.setItem("InvestrTooltipHelp", prefs[4]);

                if (prefs[5])
                    localStorage.setItem("InvestrMail", prefs[5]);
            }
        );

        // Load the watclist
        $.post("user.php",
            {
                "callFunc": "getWatchlist",
                "userEmail": userEmail
            },
            function (response) {
                localStorage.setItem("InvestrWatchlist", response);
            }
        );
    }
}

function googleSignInQtip() {
    $('#sign-in').qtip({
        content: $('.g-signin2'),
        hide: {
            fixed: true,
            delay: 300
        },
        style: {
            classes: 'qtip-dark qtip-rounded qtip-shadow'
        },
        position: {
            my: 'top center',
            at: 'bottom center'
        }
    });
}

function onSignIn(googleUser) {
    // First destroy the Sign In Qtip so it is not shown.
    $('#sign-in').qtip('destroy');

    var profile = googleUser.getBasicProfile();

    $.post("user.php",
        {
            "callFunc": "registerUser",
            "name": profile.getName(),
            "email": profile.getEmail(),
            "image": profile.getImageUrl(),
        },
        function (response) {
            if (response.indexOf("@")) {
                // We are getting a trailing new line character from the server which is not saved in the
                // DB. It is somehow entering during the return. We strip it with the line below.
                var userEmail = response.replace(/^\s+|\s+$/g, "");

                // Now we need to decide if we should refresh the page. That depends on whether we are
                // doing a fresh sign-in or just re-authentication. Thing is, in both cases this function
                // is called. But in case of fresh login, user would have logged out earlier so the following
                // check will fail.
                var triggerRefresh = false;
                if (!isUserLoggedIn()) {
                    triggerRefresh = true;
                }

                // Set the user name to track the login and display the user name on the front page.
                localStorage.setItem("InvestrUser", userEmail);

                // Load customization for this user
                loadUserCustomizations();

                // Diplay the name of the logged in user
                document.getElementById('sign-in').innerHTML = "<div class=\"userNameCircle\">".concat(userEmail.substr(0, 1).toUpperCase()).concat("</div>");

                if (triggerRefresh) {
                    location.href = "index.html";
                }
            } else {
                alert("Error: " + response);
            }
        }
    );
}

function onSignOut() {
    // Sign out of google
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        // Sign out of InvestR by setting user to null (string)
        localStorage.setItem("InvestrUser", "null");

        // Refresh the page now that user has logged out.
        location.href = "index.html";
    });
}

function drawSectorBubbleChart() {
    if (!isUserLoggedIn()) {
        alert("Please login to use this feature!");
        return;
    }

    var restURL = '/api/wts/opt/' + rowLimit;
    $.getJSON(restURL, function(d) {

        var name = new Array();
        var score = new Array();
        var pe = new Array();
        var dy = new Array();
        var pbv = new Array();
        var margin = new Array();
        var interest = new Array();

        sector = $("#sectorDDL").val();
        yAxis = $("#yAxisDDL").val();

        for (var i = 0; i < d.length; i++) {
            sectors = d[i]['ST'];
            if (sectors.indexOf(sector) > -1) {
                // Extreme PE values mess up the chart
                if (parseFloat(d[i]['PE']) > 100 || parseFloat(d[i]['PE']) < -10 ||
                    parseFloat(d[i]['V']) > 100 || parseFloat(d[i]['V']) < -10)
                     continue;

                name.push(d[i]['N']);
                score.push(parseFloat(d[i]['SR']));
                pe.push(parseFloat(d[i]['PE']));
                dy.push(parseFloat(d[i]['DY']));
                pbv.push(parseFloat(d[i]['PBV']));
                interest.push(parseFloat(d[i]['U']));
                margin.push(parseFloat(d[i]['V']));
            }
        }

        google.charts.setOnLoadCallback(drawSeriesChart);

        function drawSeriesChart() {
            var data = new google.visualization.DataTable();
            var yAxisLabel = '';

            data.addColumn('string', 'Name');
            data.addColumn('number', 'Optimized Score');

            // Dynamic Y Axis
            if (yAxis === 'PE') {
                data.addColumn('number', 'PE');
                yAxisLabel = 'PE';
            } else if (yAxis === 'DY') {
                data.addColumn('number', 'Div Yield');
                yAxisLabel = 'Dividend Yield';
            } else if (yAxis === 'PBV') {
                data.addColumn('number', 'Price To Book');
                yAxisLabel = 'Price To Book';
            }

            data.addColumn('number', 'Interest');
            data.addColumn('number', 'Margin');

            var total = 0.0;
            for(i = 0; i < name.length; i++) {
                if (yAxis === 'PE') {
                    data.addRow([name[i], score[i], pe[i], interest[i], margin[i]]);
                    total = total + pe[i];
                }
                else if (yAxis === 'DY') {
                    data.addRow([name[i], score[i], dy[i], interest[i], margin[i]]);
                    total = total + dy[i];
                }
                else if (yAxis === 'PBV') {
                    data.addRow([name[i], score[i], pbv[i], interest[i], margin[i]]);
                    total = total + pbv[i];
                }
            }

            var average = Math.round((total/name.length) * 100)/100;
            var averageStr = " (Average: " + average.toString() + ")";
            yAxisLabel = yAxisLabel.concat(averageStr);

            var options = {
                title: 'Relationship between Score, PE, Dividend Yield, Price to Book, Interest/Provisions & Margin',
                hAxis: {title: 'Optimized Score'},
                vAxis: {title: yAxisLabel},
                bubble: {textStyle: {color: 'none', fontSize: 8, auraColor: 'none'}},
                colorAxis: {colors: ['#009933', '#ff3300']},
                chartArea: {'width': '80%', 'height': '80%'},
                explorer: {keepInBounds: true}
            };

            var chart = new google.visualization.BubbleChart(document.getElementById('bubble_chart_div'));
            chart.draw(data, options);
        }
    });

    // This will count how many times a logged in user used this feature
    logUserSessions();
}

function drawAllScatterChart() {
    if (!isUserLoggedIn()) {
        alert("Please login to use this feature!");
        return;
    }

    var restURL = '/api/wts/opt/' + rowLimit;

    $.getJSON(restURL, function(d) {

        var name = new Array();
        var score = new Array();
        var pe = new Array();
        var dy = new Array();
        var pbv = new Array();
        var margin = new Array();
        var interest = new Array();

        for (var i = 0; i < d.length; i++) {
            // Extreme PE values mess up the chart
            if (parseFloat(d[i]['PE']) > 100 || parseFloat(d[i]['PE']) < -10 ||
                parseFloat(d[i]['V']) > 100 || parseFloat(d[i]['V']) < -10 ||
                parseFloat(d[i]['PBV']) > 30 || parseFloat(d[i]['PBV']) < 0 ||
                parseFloat(d[i]['DY']) > 15 || parseFloat(d[i]['V']) < 0)
                 continue;

            name.push(d[i]['N']);
            score.push(parseFloat(d[i]['SR']));
            pe.push(parseFloat(d[i]['PE']));
            dy.push(parseFloat(d[i]['DY']));
            pbv.push(parseFloat(d[i]['PBV']));
            interest.push(parseFloat(d[i]['U']));
            margin.push(parseFloat(d[i]['V']));
        }

        yAxis = $("#yAxisDDL").val();
        xAxis = $("#xAxisDDL").val();

        google.charts.setOnLoadCallback(drawSeriesChart);

        function drawSeriesChart() {
            var data = new google.visualization.DataTable();
            var yAxisLabel = '';

            // Dynamic X Axis
            if (xAxis === 'PE') {
                data.addColumn('number', 'PE');
                xAxisLabel = 'PE';
            } else if (xAxis === 'DY') {
                data.addColumn('number', 'Div Yield');
                xAxisLabel = 'Dividend Yield';
            } else if (xAxis === 'PBV') {
                data.addColumn('number', 'Price To Book');
                xAxisLabel = 'Price To Book';
            } else if (xAxis === 'V') {
                data.addColumn('number', 'Profit Margin');
                xAxisLabel = 'Profit Margin';
            } else if (xAxis === 'S') {
                data.addColumn('number', 'Optimized Score');
                xAxisLabel = 'Optimized Score';
            } else if (xAxis === 'U') {
                data.addColumn('number', 'Interest/Provisions');
                xAxisLabel = 'Interest/Provisions';
            }

            // Dynamic Y Axis
            if (yAxis === 'PE') {
                data.addColumn('number', 'PE');
                yAxisLabel = 'PE';
            } else if (yAxis === 'DY') {
                data.addColumn('number', 'Div Yield');
                yAxisLabel = 'Dividend Yield';
            } else if (yAxis === 'PBV') {
                data.addColumn('number', 'Price To Book');
                yAxisLabel = 'Price To Book';
            } else if (yAxis === 'V') {
                data.addColumn('number', 'Profit Margin');
                yAxisLabel = 'Profit Margin';
            } else if (yAxis === 'U') {
                data.addColumn('number', 'Interest/Provisions');
                yAxisLabel = 'Interest/Provisions';
            }

            // Column for tooltip content
            data.addColumn({type: 'string', role: 'tooltip'});

            for(i = 0; i < name.length; i++) {
                if (xAxis === 'S' && yAxis === 'PE')
                    data.addRow([score[i], pe[i], name[i]]);
                else if (xAxis === 'S' && yAxis === 'DY')
                    data.addRow([score[i], dy[i], name[i]]);
                else if (xAxis === 'S' && yAxis === 'PBV')
                    data.addRow([score[i], pbv[i], name[i]]);
                else if (xAxis === 'S' && yAxis === 'V')
                    data.addRow([score[i], margin[i], name[i]]);
                else if (xAxis === 'S' && yAxis === 'U')
                    data.addRow([score[i], interest[i], name[i]]);
                else if (xAxis === 'PE' && yAxis === 'PE')
                    data.addRow([pe[i], pe[i], name[i]]);
                else if (xAxis === 'PE' && yAxis === 'DY')
                    data.addRow([pe[i], dy[i], name[i]]);
                else if (xAxis === 'PE' && yAxis === 'PBV')
                    data.addRow([pe[i], pbv[i], name[i]]);
                else if (xAxis === 'PE' && yAxis === 'V')
                    data.addRow([pe[i], margin[i], name[i]]);
                else if (xAxis === 'PE' && yAxis === 'U')
                    data.addRow([pe[i], interest[i], name[i]]);
                else if (xAxis === 'DY' && yAxis === 'PE')
                    data.addRow([dy[i], pe[i], name[i]]);
                else if (xAxis === 'DY' && yAxis === 'DY')
                    data.addRow([dy[i], dy[i], name[i]]);
                else if (xAxis === 'DY' && yAxis === 'PBV')
                    data.addRow([dy[i], pbv[i], name[i]]);
                else if (xAxis === 'DY' && yAxis === 'V')
                    data.addRow([dy[i], margin[i], name[i]]);
                else if (xAxis === 'DY' && yAxis === 'U')
                    data.addRow([dy[i], interest[i], name[i]]);
                else if (xAxis === 'PBV' && yAxis === 'PE')
                    data.addRow([pbv[i], pe[i], name[i]]);
                else if (xAxis === 'PBV' && yAxis === 'DY')
                    data.addRow([pbv[i], dy[i], name[i]]);
                else if (xAxis === 'PBV' && yAxis === 'PBV')
                    data.addRow([pbv[i], pbv[i], name[i]]);
                else if (xAxis === 'PBV' && yAxis === 'V')
                    data.addRow([pbv[i], margin[i], name[i]]);
                else if (xAxis === 'PBV' && yAxis === 'U')
                    data.addRow([pbv[i], interest[i], name[i]]);
                else if (xAxis === 'V' && yAxis === 'PE')
                    data.addRow([margin[i], pe[i], name[i]]);
                else if (xAxis === 'V' && yAxis === 'DY')
                    data.addRow([margin[i], dy[i], name[i]]);
                else if (xAxis === 'V' && yAxis === 'PBV')
                    data.addRow([margin[i], pbv[i], name[i]]);
                else if (xAxis === 'V' && yAxis === 'V')
                    data.addRow([margin[i], margin[i], name[i]]);
                else if (xAxis === 'V' && yAxis === 'U')
                    data.addRow([margin[i], interest[i], name[i]]);
                else if (xAxis === 'U' && yAxis === 'PE')
                    data.addRow([interest[i], pe[i], name[i]]);
                else if (xAxis === 'U' && yAxis === 'DY')
                    data.addRow([interest[i], dy[i], name[i]]);
                else if (xAxis === 'U' && yAxis === 'PBV')
                    data.addRow([interest[i], pbv[i], name[i]]);
                else if (xAxis === 'U' && yAxis === 'V')
                    data.addRow([interest[i], margin[i], name[i]]);
                else if (xAxis === 'U' && yAxis === 'U')
                    data.addRow([interest[i], interest[i], name[i]]);
                }

            var options = {
                hAxis: {title: xAxisLabel},
                vAxis: {title: yAxisLabel},
                pointSize: 1,
                colors: ['RED'],
                chartArea: {'width': '90%', 'height': '85%'},
                explorer: {keepInBounds: true}
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('scatter_chart_div'));
            chart.draw(data, options);
        }
    });

    // This will count how many times a logged in user used this feature
    logUserSessions();
}

function drawEarningsChart() {
    var URL = '/earnings';

    // Load the chart packages before fetching the data
    google.charts.load('current', {'packages':['corechart']});

    $.getJSON(URL, function(d) {
        document.title = 'Earnings Growth';

        var yoyErnGrth = getGrowth(parseFloat(d["EQ5"]), parseFloat(d["EQ1"]));
        var qoqErnGrth = getGrowth(parseFloat(d["EQ2"]), parseFloat(d["EQ1"]));
        //var ttmErnGrth = getGrowth(parseFloat(d["E7"]), parseFloat(d["E6"]));
        var yoyIntGrth = getGrowth(parseFloat(d["IQ5"]), parseFloat(d["IQ1"]));
        var qoqIntGrth = getGrowth(parseFloat(d["IQ2"]), parseFloat(d["IQ1"]));
        //var ttmIntGrth = getGrowth(parseFloat(d["E7"]), parseFloat(d["E6"]));
        var yoyProGrth = getGrowth(parseFloat(d["PQ5"]), parseFloat(d["PQ1"]));
        var qoqProGrth = getGrowth(parseFloat(d["PQ2"]), parseFloat(d["PQ1"]));
        //var ttmProGrth = getGrowth(parseFloat(d["P7"]), parseFloat(d["P6"]));

        google.charts.setOnLoadCallback(drawVisualization);

        function drawVisualization() {
            var data = new google.visualization.DataTable();

            var data = google.visualization.arrayToDataTable([
            ['Quarter/TTM',  'Income',      'Profit',     'Interest/Provisions'],
            ['YoY',         yoyErnGrth,    yoyProGrth,         yoyIntGrth],
            ['QoQ',         qoqErnGrth,    qoqProGrth,         qoqIntGrth]//,
            //['TTM',         ttmErnGrth, ttmProGrth, ttmMarGrth, ttmEpsGrth, ttmIntGrth]
            ]);
            var options = {
                title : 'YoY, QoQ and TTM Growth Values',
                vAxes: { 0: { title: '% Growth' }, 1: { title: '% Interest/Provisions Growth' } },
                hAxis: {title: 'Quarter/TTM'},
                seriesType: 'bars',
                series: {2: {type: 'bars', targetAxisIndex: 1}}
            };
            var chart = new google.visualization.ComboChart(document.getElementById('chart_div_growth'));
            chart.draw(data, options);

            var data = google.visualization.arrayToDataTable([
            ['Quarters',      'Income',              'Profit',            'Interest'       ],
            ['Last -4',  parseFloat(d["EQ5"]),  parseFloat(d["PQ5"]),  parseFloat(d["IQ5"])],
            ['Last -3',  parseFloat(d["EQ4"]),  parseFloat(d["PQ4"]),  parseFloat(d["IQ4"])],
            ['Last -2',  parseFloat(d["EQ3"]),  parseFloat(d["PQ3"]),  parseFloat(d["IQ3"])],
            ['Last -1',  parseFloat(d["EQ2"]),  parseFloat(d["PQ2"]),  parseFloat(d["IQ2"])],
            ['Last',     parseFloat(d["EQ1"]),  parseFloat(d["PQ1"]),  parseFloat(d["IQ1"])]
            ]);
            var options = {
                title : 'Net Income, Net Profit and Interest paid for the Last 5 Quarters',
                vAxes: { 0: { title: 'Income/Profit (Cr. Rs.)' }, 1: { title: 'Interest (Cr. Rs.)' } },
                hAxis: {title: 'Quarters'},
                seriesType: 'bars',
                series: {2: {type: 'line', targetAxisIndex: 1}}
            };
            var chart = new google.visualization.ComboChart(document.getElementById('chart_div_qtr'));
            chart.draw(data, options);
        }
    });
}

function getLast5QtrNames(lastQtr) {
    var last5QtrNames = [lastQtr];
    var qtrMonthYear = lastQtr.split(' ');
    var lastYear = parseInt(qtrMonthYear[1]) - 1;

    if (qtrMonthYear[0] === 'Mar') {
        last5QtrNames.push('Dec '.concat(lastYear));
        last5QtrNames.push('Sep '.concat(lastYear));
        last5QtrNames.push('Jun '.concat(lastYear));
        last5QtrNames.push('Mar '.concat(lastYear));
    } else if (qtrMonthYear[0] === 'Jun') {
        last5QtrNames.push('Mar '.concat(qtrMonthYear[1]));
        last5QtrNames.push('Dec '.concat(lastYear));
        last5QtrNames.push('Sep '.concat(lastYear));
        last5QtrNames.push('Jun '.concat(lastYear));
    } else if (qtrMonthYear[0] === 'Sep') {
        last5QtrNames.push('Jun '.concat(qtrMonthYear[1]));
        last5QtrNames.push('Mar '.concat(qtrMonthYear[1]));
        last5QtrNames.push('Dec '.concat(lastYear));
        last5QtrNames.push('Sep '.concat(lastYear));
    } else if (qtrMonthYear[0] === 'Dec') {
        last5QtrNames.push('Sep '.concat(qtrMonthYear[1]));
        last5QtrNames.push('Jun '.concat(qtrMonthYear[1]));
        last5QtrNames.push('Mar '.concat(qtrMonthYear[1]));
        last5QtrNames.push('Dec '.concat(lastYear));
    }

    return last5QtrNames;
}

function getLast3YearNames(lastQtr) {
    var last3YearNames = ['TTM'];
    var qtrMonthYear = lastQtr.split(' ');
    var lastYear = parseInt(qtrMonthYear[1]) - 1;
    var last2LastYear = parseInt(qtrMonthYear[1]) - 2;

    if (qtrMonthYear[0] === 'Jun' || qtrMonthYear[0] === 'Sep' || qtrMonthYear[0] === 'Dec') {
        last3YearNames.push('FY '.concat(qtrMonthYear[1]));
        last3YearNames.push('FY '.concat(lastYear));
    } else if (qtrMonthYear[0] === 'Mar') {
        last3YearNames.push('FY '.concat(lastYear));
        last3YearNames.push('FY '.concat(last2LastYear));
    }

    return last3YearNames;
}

function drawStockChart(myId) {
    var stockURL = '/api/stock/' + myId;
    var hisScrURL = '/api/stock/hisscr/' + myId;

    // Load the chart packages before fetching the data
    google.charts.load('current', {'packages':['annotationchart']});
    google.charts.load('current', {'packages':['corechart']});

    $.getJSON(hisScrURL, function(d) {
        var dt = new Array();
        var pe = new Array();
        var score = new Array();
        var price = new Array();
        var comment = new Array();

        for (var i = 0; i < d.length; i++) {
            dt.push(d[i]['DT']);
            pe.push(parseFloat(d[i]['PE']));
            score.push(parseFloat(d[i]['S']));
            price.push(parseFloat(d[i]['P']));
            comment.push(d[i]['C']);
        }

        lowerRange = Math.min.apply(null, score) - 5 ;
        rangeDiff = (Math.max.apply(null, score) + 5) - lowerRange;

        // We need to normalize the price between 0 - 100 so the chart sets with the score
        minPrice = Math.min.apply(null, price);
        maxMinPriceDiff = Math.max.apply(null, price) - minPrice;

        var normalizedPrice = new Array();
        for (var i = 0; i < price.length; i++) {
            normalizedPrice.push(lowerRange+(((price[i] - minPrice)*rangeDiff)/maxMinPriceDiff));
        }

        google.charts.setOnLoadCallback(drawATLChart);

        function drawATLChart() {
            var data = new google.visualization.DataTable();

            data.addColumn('date', 'Date');
            data.addColumn('number', 'PE');
            data.addColumn('number', 'Score');
            data.addColumn('number', 'N. Price');
            data.addColumn('string', 'Notes');

            for(i = 0; i < dt.length; i++) {
                data.addRow([new Date(dt[i]), pe[i], score[i], normalizedPrice[i], comment[i]]);
            }

            var chart = new google.visualization.AnnotationChart(document.getElementById('hisscr_chart_div'));
            chart.draw(data,  {displayAnnotations: true});
        }
    });

    $.getJSON(stockURL, function(d) {
        document.title = d["N"];
        document.getElementById('companyName').innerHTML = d["N"];

        // Calculate growth values: YoY, QoQ, TTM for Earning, Profit, Int, Margin and EPS
        var intPercent5 = parseFloat(d["I5"])*100/parseFloat(d["E5"]);
        var intPercent4 = parseFloat(d["I4"])*100/parseFloat(d["E4"]);
        var intPercent3 = parseFloat(d["I3"])*100/parseFloat(d["E3"]);
        var intPercent2 = parseFloat(d["I2"])*100/parseFloat(d["E2"]);
        var intPercent1 = parseFloat(d["I1"])*100/parseFloat(d["E1"]);
        var intPercent6 = parseFloat(d["I6"])*100/parseFloat(d["E6"]);
        var intPercent7 = parseFloat(d["I7"])*100/parseFloat(d["E7"]);
        var intPercent8 = parseFloat(d["I8"])*100/parseFloat(d["E8"]);

        var yoyErnGrth = getGrowth(parseFloat(d["E5"]), parseFloat(d["E1"]));
        var qoqErnGrth = getGrowth(parseFloat(d["E2"]), parseFloat(d["E1"]));
        var ttmErnGrth = parseFloat(d["EY"]);
        var yoyProGrth = getGrowth(parseFloat(d["P5"]), parseFloat(d["P1"]));
        var qoqProGrth = getGrowth(parseFloat(d["P2"]), parseFloat(d["P1"]));
        var ttmProGrth = parseFloat(d["PY"]);
        var yoyIntGrth = getGrowth(intPercent5, intPercent1);
        var qoqIntGrth = getGrowth(intPercent2, intPercent1);
        var ttmIntGrth = parseFloat(d["IY"]);
        var yoyMarGrth = getGrowth(parseFloat(d["M5"]), parseFloat(d["M1"]));
        var qoqMarGrth = getGrowth(parseFloat(d["M2"]), parseFloat(d["M1"]));
        var ttmMarGrth = parseFloat(d["MY"]);
        var yoyEpsGrth = getGrowth(parseFloat(d["S5"]), parseFloat(d["S1"]));
        var qoqEpsGrth = getGrowth(parseFloat(d["S2"]), parseFloat(d["S1"]));
        var ttmEpsGrth = parseFloat(d["SY"]);

        // If the interest paid by the company is small then we dont care about its growth
        // We do this so that our growth chart is not screwed up. It gets screwed up
        // because when a company with revenue in 1000's of crores is paying an interest
        // of 20 lakhs and if for some reason the interest becomes 1 cr (which is not bad)
        // then the growth chart will get messed up.
        if (intPercent1 < 0.20 && intPercent6 < 0.20 && (yoyIntGrth > 100 || qoqIntGrth > 100 || ttmIntGrth > 100)) {
            yoyIntGrth = 0;
            qoqIntGrth = 0;
            ttmIntGrth = 0;
        }


        // Get the last quarter name and the previous 4 quarter names based on it
        var qtrNames = getLast5QtrNames(d["LQ"]);
        var yearNames = getLast3YearNames(d["LQ"]);

        google.charts.setOnLoadCallback(drawVisualization);

        function drawVisualization() {
            var data = new google.visualization.DataTable();

            var data = google.visualization.arrayToDataTable([
            ['Quarter/TTM',  'Income',   'Profit',  'Margin',    'EPS',     'Interest/Provisions'],
            ['YoY',         yoyErnGrth, yoyProGrth, yoyMarGrth, yoyEpsGrth, yoyIntGrth],
            ['QoQ',         qoqErnGrth, qoqProGrth, qoqMarGrth, qoqEpsGrth, qoqIntGrth],
            ['TTM',         ttmErnGrth, ttmProGrth, ttmMarGrth, ttmEpsGrth, ttmIntGrth]
            ]);
            var options = {
                vAxes: { 0: { title: '% Growth' }, 1: { title: '% Interest/Provisions Growth' } },
                hAxis: {title: 'Quarter/TTM'},
                seriesType: 'bars',
                series: {4: {type: 'bars', targetAxisIndex: 1}}
            };
            var chart = new google.visualization.ComboChart(document.getElementById('chart_div_growth'));
            chart.draw(data, options);

            var data = google.visualization.arrayToDataTable([
            ['Quarters',      'Income',              'Profit',           'Margin(%)'    ],
            [qtrNames[4],  parseFloat(d["E5"]),  parseFloat(d["P5"]),  parseFloat(d["M5"])],
            [qtrNames[3],  parseFloat(d["E4"]),  parseFloat(d["P4"]),  parseFloat(d["M4"])],
            [qtrNames[2],  parseFloat(d["E3"]),  parseFloat(d["P3"]),  parseFloat(d["M3"])],
            [qtrNames[1],  parseFloat(d["E2"]),  parseFloat(d["P2"]),  parseFloat(d["M2"])],
            [qtrNames[0],  parseFloat(d["E1"]),  parseFloat(d["P1"]),  parseFloat(d["M1"])]
            ]);
            var options = {
                vAxes: { 0: { title: 'Crore Rupees' }, 1: { title: '%' } },
                hAxis: {title: 'Quarters'},
                seriesType: 'bars',
                series: {2: {type: 'line', targetAxisIndex: 1}}
            };
            var chart = new google.visualization.ComboChart(document.getElementById('chart_div_qtr_big'));
            chart.draw(data, options);

            var data = google.visualization.arrayToDataTable([
            ['Quarters', 'EPS(Rs)',     'Interest(%)'      ],
            [qtrNames[4],  parseFloat(d["S5"]),  intPercent5 ],
            [qtrNames[3],  parseFloat(d["S4"]),  intPercent4 ],
            [qtrNames[2],  parseFloat(d["S3"]),  intPercent3 ],
            [qtrNames[1],  parseFloat(d["S2"]),  intPercent2 ],
            [qtrNames[0],  parseFloat(d["S1"]),  intPercent1 ]
            ]);
            var options = {
                vAxes: { 0: { title: 'Rupees' }, 1: { title: '%' } },
                hAxis: {title: 'Quarters'},
                seriesType: 'bars',
                series: {1: {type: 'line', targetAxisIndex: 1}}
            };
            var chart = new google.visualization.ComboChart(document.getElementById('chart_div_qtr_small'));
            chart.draw(data, options);

            // YEARLY COMPARISION TTM VS LAST YEAR VS LAST TO LAST YEAR

            var data = google.visualization.arrayToDataTable([
            ['Quarters',    'Income',             'Profit',             'Margin(%)'       ],
            [yearNames[2],  parseFloat(d["E8"]),  parseFloat(d["P8"]),  parseFloat(d["M8"])],
            [yearNames[1],  parseFloat(d["E7"]),  parseFloat(d["P7"]),  parseFloat(d["M7"])],
            [yearNames[0],  parseFloat(d["E6"]),  parseFloat(d["P6"]),  parseFloat(d["M6"])]
            ]);
            var options = {
                vAxes: { 0: { title: 'Crore Rupees' }, 1: { title: '%' } },
                hAxis: {title: 'Years'},
                seriesType: 'bars',
                series: {2: {type: 'line', targetAxisIndex: 1}}
            };
            var chart = new google.visualization.ComboChart(document.getElementById('chart_div_year_big'));
            chart.draw(data, options);

            var data = google.visualization.arrayToDataTable([
            ['Years',       'EPS(Rs)',            'Interest(%)'],
            [yearNames[2],  parseFloat(d["S8"]),  intPercent8  ],
            [yearNames[1],  parseFloat(d["S7"]),  intPercent7  ],
            [yearNames[0],  parseFloat(d["S6"]),  intPercent6  ]
            ]);

            var options = {
                vAxes: { 0: { title: 'Rupees' }, 1: { title: '%' } },
                hAxis: {title: 'Years'},
                seriesType: 'bars',
                series: {1: {type: 'line', targetAxisIndex: 1}}
            };

            var chart = new google.visualization.ComboChart(document.getElementById('chart_div_year_small'));
            chart.draw(data, options);
        }

        // Calculate standard deviation to find consistency in TL and BL growth, FW PE, PBV
        var logs = getStockAnalysis(d);

        document.getElementById('marketCap').innerHTML = logs[0];
        document.getElementById('peRange').innerHTML = logs[1];
        document.getElementById('score').innerHTML = logs[2];
        document.getElementById('tlGrowth').innerHTML = logs[3];
        document.getElementById('blGrowth').innerHTML = logs[4];
        document.getElementById('movingAverage').innerHTML = logs[5];
        document.getElementById('fwPe').innerHTML = logs[6];
        document.getElementById('pbv').innerHTML = logs[7];
        document.getElementById('margin').innerHTML = logs[8];
        document.getElementById('interest').innerHTML = logs[9];
        document.getElementById('yoyQtrlyTLGwth').innerHTML = logs[10];
        document.getElementById('roa').innerHTML = logs[11];
        document.getElementById('cr').innerHTML = logs[12];
        document.getElementById('wc').innerHTML = logs[13];
        document.getElementById('eps').innerHTML = logs[14];
        document.getElementById('epsGwth').innerHTML = logs[15];
    });
}

function getSectorLinks(sectors, srcStockId)
{
    var sectorList = sectors.split(',');

    var sectorLink = "";
    for (var i = 0; i < sectorList.length; i++) {
        // <a href="">SECTOR</a>
        sectorLink = sectorLink.concat("<a href=\"peers.html?sector=").concat(sectorList[i]).
                                concat("&sectors=").concat(sectors).
                                concat("&srcStockId=").concat(srcStockId).
                                concat("\">").concat(sectorList[i]).concat("</a> ");
    }

    return sectorLink;
}

function getDataViewWithAverageLine(data) {
    // Create a DataView that adds another column which is all the same (empty-string) to be able to aggregate on.
    var viewWithKey = new google.visualization.DataView(data);
    viewWithKey.setColumns([0, 1, 2, {
        type: 'string',
        label: '',
        calc: function (d, r) {
            return '';
        }
    }]);

    // Aggregate the previous view to calculate the average. This table should be a single table that looks like:
    // [['', AVERAGE]], so you can get the Average with .getValue(0,1)
    var group = google.visualization.data.group(viewWithKey, [3], [{
        column: 1,
        id: 'avg',
        label: 'Average',
        aggregation: google.visualization.data.avg,
        'type': 'number'
    }]);

    // Create a DataView where the third column is the average.
    var dataView = new google.visualization.DataView(data);
    dataView.setColumns([0, 1, 2, {
        type: 'number',
        label: 'Average',
        calc: function (d, r) {
            return group.getValue(0, 1);
        }
    }]);

    return dataView;
}

function drawWatchlistChart(idCode) {
    var watchlistURL = '/api/watchlist/' + idCode + '/1000';

    drawPeersAndWatchlistChart(watchlistURL, 0);
}

function drawPeersChart(sector, sectors, srcStockId) {
    document.title = sector + " Sector";
    document.getElementById('sector').innerHTML = sector;
    document.getElementById('sectors').innerHTML = getSectorLinks(sectors, srcStockId);

    var peersURL = '/api/peers/' + sector + '/1000';

    drawPeersAndWatchlistChart(peersURL, srcStockId);
}

function drawPeersAndWatchlistChart(url, srcStockId) {
    google.charts.load('current', {'packages':['corechart']});

    $.getJSON(url, function(d) {
        var id = new Array();
        var name = new Array();
        var price = new Array();
        var pe = new Array();
        var roa = new Array();
        var cr = new Array();
        var peg = new Array();
        var dy = new Array();
        var pbv = new Array();
        var ip = new Array();
        var margins = new Array();
        var bvg = new Array();
        var ps = new Array();
        var evEbitda = new Array();
        var eyg = new Array();
        var eqg = new Array();
        var ettmg = new Array();
        var iyg = new Array();
        var iqg = new Array();
        var ittmg = new Array();
        var pyg = new Array();
        var pqg = new Array();
        var pttmg = new Array();
        var myg = new Array();
        var mqg = new Array();
        var mttmg = new Array();
        var epsyg = new Array();
        var epsqg = new Array();
        var epsttmg = new Array();


        for (var i = 0; i < d.length; i++) {

            if (parseFloat(d[i]['PE']) > 100     || parseFloat(d[i]['PE']) < -10       ||
                parseFloat(d[i]['M']) > 100      || parseFloat(d[i]['M']) < -10        ||
                parseFloat(d[i]['EYG']) > 1000   || parseFloat(d[i]['EYG']) < -50      ||
                parseFloat(d[i]['MTTMG']) > 1000)
                 continue;

            id.push(d[i]['ID']);
            name.push(d[i]['N']);
            price.push(parseFloat(d[i]['P']));
            pe.push(parseFloat(d[i]['PE']));
            roa.push(parseFloat(d[i]['ROA']));
            cr.push(parseFloat(d[i]['CR']));
            peg.push(parseFloat(d[i]['PEG']));
            dy.push(parseFloat(d[i]['DY']));
            pbv.push(parseFloat(d[i]['PBV']));
            ip.push(parseFloat(d[i]['IP']));
            margins.push(parseFloat(d[i]['M']));
            bvg.push(parseFloat(d[i]['BVG']));
            ps.push(parseFloat(d[i]['PS']));
            evEbitda.push(parseFloat(d[i]['EVEBITDA']));
            eyg.push(parseFloat(d[i]['EYG']));
            eqg.push(parseFloat(d[i]['EQG']));
            ettmg.push(parseFloat(d[i]['ETTMG']));
            iyg.push(parseFloat(d[i]['IYG']));
            iqg.push(parseFloat(d[i]['IQG']));
            ittmg.push(parseFloat(d[i]['ITTMG']));
            pyg.push(parseFloat(d[i]['PYG']));
            pqg.push(parseFloat(d[i]['PQG']));
            pttmg.push(parseFloat(d[i]['PTTMG']));
            myg.push(parseFloat(d[i]['MYG']));
            mqg.push(parseFloat(d[i]['MQG']));
            mttmg.push(parseFloat(d[i]['MTTMG']));
            epsyg.push(parseFloat(d[i]['EPSYG']));
            epsqg.push(parseFloat(d[i]['EPSQG']));
            epsttmg.push(parseFloat(d[i]['EPSTTMG']));
        }

        var cName = "";
        var cmp = 0;
        var peAtCmp = 0;
        var pbvAtCmp = 0;
        var psAtCmp = 0;
        var roaAtCmp = 0;
        var pmAtCmp = 0;
        var ttmTlGthAtCmp = 0;
        var ttmEpsGthAtcmp = 0;
        var yoyTlGthAtCmp = 0;

        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            //
            // PE (Price to Earnings)
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'PE');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], pe[i], 'orange']);
                    peAtCmp = pe[i];
                }
                else
                    data.addRow([name[i], pe[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'PE'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('pe_chart'));
            chart.draw(dataView, options);

            //
            // PBV (Price to Book Value)
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'PBV');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], pbv[i], 'orange']);
                    pbvAtCmp = pbv[i];
                }
                else
                    data.addRow([name[i], pbv[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'PBV'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('pbv_chart'));
            chart.draw(dataView, options);

            //
            // PS (Price to Sales)
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'PS');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], ps[i], 'orange']);
                    psAtCmp = ps[i];
                }
                else
                    data.addRow([name[i], ps[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'PS'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('ps_chart'));
            chart.draw(dataView, options);

            //
            // EV/EBITDA (EV to EBITDA)
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'EV/EBITDA');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], evEbitda[i], 'orange']);
                }
                else
                    data.addRow([name[i], evEbitda[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'EV/EBITDA'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('evebitda_chart'));
            chart.draw(dataView, options);

            //
            // ROA
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'ROA');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], roa[i], 'orange']);
                    roaAtCmp = roa[i];
                }
                else
                    data.addRow([name[i], roa[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'ROA'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('roa_chart'));
            chart.draw(dataView, options);

            //
            // CR
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'CR');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId)
                    data.addRow([name[i], cr[i], 'orange']);
                else
                    data.addRow([name[i], cr[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'CR'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('cr_chart'));
            chart.draw(dataView, options);

            //
            // Profit Margins
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'Profit Margin');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], margins[i], 'orange']);
                    pmAtCmp = margins[i];
                }
                else
                    data.addRow([name[i], margins[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'Profit Margin'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('margins_chart'));
            chart.draw(dataView, options);

            //
            // Topline Quarterly YoY Growth
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'EYG');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], eyg[i], 'orange']);
                    yoyTlGthAtCmp = eyg[i];
                }
                else
                    data.addRow([name[i], eyg[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'Quarterly TL Growth (YoY)'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('eyg_chart'));
            chart.draw(dataView, options);

            //
            // Topline Quarterly QoQ Growth
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'EQG');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId)
                    data.addRow([name[i], eqg[i], 'orange']);
                else
                    data.addRow([name[i], eqg[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'Quarterly TL Growth (QoQ)'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('eqg_chart'));
            chart.draw(dataView, options);

            //
            // Topline Yearly TTM Growth
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'ETTMG');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], ettmg[i], 'orange']);
                    ttmTlGthAtCmp = ettmg[i];
                }
                else
                    data.addRow([name[i], ettmg[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'TTM Topline Growth'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('ettmg_chart'));
            chart.draw(dataView, options);

            //
            // TTM Margin Growth
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'MTTMG');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId)
                    data.addRow([name[i], mttmg[i], 'orange']);
                else
                    data.addRow([name[i], mttmg[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'TTM Margin Growth'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('mttmg_chart'));
            chart.draw(dataView, options);

            //
            // TTM EPS Growth
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'EPSTTMG');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], epsttmg[i], 'orange']);
                    ttmEpsGthAtcmp = epsttmg[i];
                }
                else
                    data.addRow([name[i], epsttmg[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'TTM EPS Growth'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('epsttmg_chart'));
            chart.draw(dataView, options);

            //
            // DY
            //
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');
            data.addColumn('number', 'DY');
            data.addColumn({type:'string', role:'style'});

            for(i = 0; i < name.length; i++) {
                if (id[i] == srcStockId) {
                    data.addRow([name[i], dy[i], 'orange']);
                    cmp = price[i];
                    cName = name[i];
                }
                else
                    data.addRow([name[i], dy[i], '']);
            }

            var dataView = getDataViewWithAverageLine(data);

            var options = {
                vAxis: {title: 'Div Yld'},
                hAxis: {title: 'Companies'},
                seriesType: 'bars',
                series: {
                    1: {
                          type: "line",
                          visibleInLegend: false
                       }
                }
            };
            var chart = new google.visualization.ComboChart(document.getElementById('dy_chart'));
            chart.draw(dataView, options);

            // Calulate fair price based on average PE, PBV, PS, Profit Margin, TTM EPS, TTM TL Growth, YoY Qtrly
            var fairPrices = new Array();

            var avgPe = google.visualization.data.avg(pe);
            var priceFromAvgPe = cmp + (((avgPe - peAtCmp) / peAtCmp) * cmp);
            fairPrices.push(priceFromAvgPe);

            var avgPbv = google.visualization.data.avg(pbv);
            var priceFromAvgPbv = cmp + (((avgPbv - pbvAtCmp) / pbvAtCmp) * cmp);
            fairPrices.push(priceFromAvgPbv);

            var avgPs = google.visualization.data.avg(ps);
            var priceFromAvgPs  = cmp + (((avgPs - psAtCmp) / psAtCmp) * cmp);
            fairPrices.push(priceFromAvgPs);

            var avgRoa = google.visualization.data.avg(roa);
            var priceFromAvgRoa  = cmp + (((roaAtCmp - avgRoa) / avgRoa) * cmp);
            fairPrices.push(priceFromAvgRoa);

            var avgPm = google.visualization.data.avg(margins);
            var priceFromAvgPm  = cmp + (((pmAtCmp - avgPm) / avgPm) * cmp);
            fairPrices.push(priceFromAvgPm);

            var avgEttmg = google.visualization.data.avg(ettmg);
            var priceFromAvgTtmTlGth  = cmp + (((ttmTlGthAtCmp - avgEttmg) / avgEttmg) * cmp);
            fairPrices.push(priceFromAvgTtmTlGth);

            var avgEpsttmg = google.visualization.data.avg(epsttmg);
            var priceFromAvgTtmEpsGth  = cmp + (((ttmEpsGthAtcmp - avgEpsttmg) / avgEpsttmg) * cmp);
            fairPrices.push(priceFromAvgTtmEpsGth);

            var avgEyg = google.visualization.data.avg(eyg);
            var priceFromAvgYoyTlGth  = cmp + (((yoyTlGthAtCmp - avgEyg) / avgEyg) * cmp);
            fairPrices.push(priceFromAvgYoyTlGth);

            // Calculate fair price only for + ve numbers
            var totalFairPrice = 0;
            var numberOfFairPrices = 0;
            for (var i = 0; i < fairPrices.length; i++) {
                if (fairPrices[i] > 0) {
                    totalFairPrice = totalFairPrice + fairPrices[i];
                    numberOfFairPrices++;
                }
            }
            var fairPrice = Math.round((totalFairPrice/numberOfFairPrices) * 100) / 100;

            // Calculate the fair price and assign it to the element id for diaplay on peers.html
            document.getElementById('cName').innerHTML = cName;
            document.getElementById('fairPrice').innerHTML = fairPrice;
        }
    });
}


function compareStocks(id1, id2) {
    var company1;
    var company2;
    var name1, name2;
    var marketCap1, marketCap2;
    var peRange1, peRange2;
    var pbv1, pbv2;
    var margin1, margin2;
    var interest1, interest2;
    var yoyQtrlyTLGwth1, yoyQtrlyTLGwth2;
    var movingAverageTxt1, movingAverageTxt2, movingAverageNum1, movingAverageNum2;
    var roa1, roa2;
    var cr1, cr2;
    var wcTxt1, wcTxt2;
    var esd1, esd2, psd1, psd2;
    var pe1, pe2, peg1, peg2, dy1, dy2;
    var fwPe1, fwPe2;
    var companyCounter1 = 0;
    var companyCounter2 = 0;
    var regex = /[+-]?\d+(\.\d+)?/g;

    var stockURL1 = '/api/stock/' + id1;
    $.getJSON(stockURL1, function(d) {
        document.getElementById('companyName1').innerHTML = name1 = d["N"];
        pe1 = parseFloat(d["PE"]);
        document.getElementById('pe1').innerHTML = "PE: ".concat(d["PE"]);
        peg1 = parseFloat(d["PEG"]);
        document.getElementById('peg1').innerHTML = "PEG: ".concat(d["PEG"]);
        dy1 = parseFloat(d["DY"]);
        document.getElementById('dy1').innerHTML = "Div Yield: ".concat(d["DY"]);
        esd1 = parseFloat(d["ESD"]);
        psd1 = parseFloat(d["PSD"]);
        ssd1 = parseFloat(d["SC"]);

        company1 = getStockAnalysis(d);

        document.getElementById('marketCap1').innerHTML = company1[0];
        marketCap1 = company1[0].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('peRange1').innerHTML = company1[1];
        peRange1 = company1[1].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('score1').innerHTML = company1[2];
        document.getElementById('tlGrowth1').innerHTML = company1[3];
        document.getElementById('blGrowth1').innerHTML = company1[4];

        document.getElementById('movingAverage1').innerHTML = company1[5];
        movingAverageTxt1 = company1[5].indexOf("below");
        movingAverageNum1 = company1[5].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('fwPe1').innerHTML = company1[6];
        fwPe1 = company1[6].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('pbv1').innerHTML = company1[7];
        pbv1 = company1[7].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('margin1').innerHTML = company1[8];
        margin1 = company1[8].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('interest1').innerHTML = company1[9];
        interest1 = company1[9].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('yoyQtrlyTLGwth1').innerHTML = company1[10];
        yoyQtrlyTLGwth1 = company1[10].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('roa1').innerHTML = company1[11];
        roa1 = company1[11].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('cr1').innerHTML = company1[12];
        cr1 = company1[12].match(regex).map(function(v) { return parseFloat(v); })

        document.getElementById('wc1').innerHTML = company1[13];
        wcTxt1 = company1[13].indexOf("up");

        var stockURL2 = '/api/stock/' + id2;
        $.getJSON(stockURL2, function(d) {
            document.getElementById('companyName2').innerHTML = name2 = d["N"];
            pe2 = parseFloat(d["PE"]);
            document.getElementById('pe2').innerHTML = "PE: ".concat(d["PE"]);
            peg2 = parseFloat(d["PEG"]);
            document.getElementById('peg2').innerHTML = "PEG: ".concat(d["PEG"]);
            dy2 = parseFloat(d["DY"]);
            document.getElementById('dy2').innerHTML = "Div Yield: ".concat(d["DY"]);
            esd2 = parseFloat(d["ESD"]);
            psd2 = parseFloat(d["PSD"]);
            ssd2 = parseFloat(d["SC"]);

            company2 = getStockAnalysis(d);

            document.getElementById('marketCap2').innerHTML = company2[0];
            marketCap2 = company2[0].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('peRange2').innerHTML = company2[1];
            peRange2 = company2[1].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('score2').innerHTML = company2[2];
            document.getElementById('tlGrowth2').innerHTML = company2[3];
            document.getElementById('blGrowth2').innerHTML = company2[4];

            document.getElementById('movingAverage2').innerHTML = company2[5];
            movingAverageTxt2 = company2[5].indexOf("below");
            movingAverageNum2 = company2[5].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('fwPe2').innerHTML = company2[6];
            fwPe2 = company2[6].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('pbv2').innerHTML = company2[7];
            pbv2 = company2[7].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('margin2').innerHTML = company2[8];
            margin2 = company2[8].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('interest2').innerHTML = company2[9];
            interest2 = company2[9].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('yoyQtrlyTLGwth2').innerHTML = company2[10];
            yoyQtrlyTLGwth2 = company2[10].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('roa2').innerHTML = company2[11];
            roa2 = company2[11].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('cr2').innerHTML = company2[12];
            cr2 = company2[12].match(regex).map(function(v) { return parseFloat(v); })

            document.getElementById('wc2').innerHTML = company2[13];
            wcTxt2 = company2[13].indexOf("up");

            // Make the comparisions

            if (marketCap1[0] > marketCap2[0]) {
                document.getElementById('marketCapCmp').innerHTML = ">";
                companyCounter1++;
            } else if (marketCap1[0] < marketCap2[0]) {
                document.getElementById('marketCapCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('marketCapCmp').innerHTML = "=";
            }

            if (pe1 > 0 && pe2 <= 0) {
                document.getElementById('peCmp').innerHTML = ">";
                companyCounter1++;
            } else if (pe1 < 0 && pe2 > 0) {
                document.getElementById('peCmp').innerHTML = "<";
                companyCounter2++;
            } else if (pe1 < pe2) {
                document.getElementById('peCmp').innerHTML = ">";
                companyCounter1++;
            } else if (pe1 > pe2) {
                document.getElementById('peCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('peCmp').innerHTML = "=";
            }

            if (peg1 > 0 && peg2 <= 0) {
                document.getElementById('pegCmp').innerHTML = ">";
                companyCounter1++;
            } else if (peg1 < 0 && peg2 > 0) {
                document.getElementById('pegCmp').innerHTML = "<";
                companyCounter2++;
            } else if (peg1 < peg2) {
                document.getElementById('pegCmp').innerHTML = ">";
                companyCounter1++;
            } else if (peg1 > peg2) {
                document.getElementById('pegCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('pegCmp').innerHTML = "=";
            }

            if (dy1 > dy2) {
                document.getElementById('dyCmp').innerHTML = ">";
                companyCounter1++;
            } else if (dy1 < dy2) {
                document.getElementById('dyCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('dyCmp').innerHTML = "=";
            }

            if (peRange1[2] < peRange2[2]) {
                document.getElementById('peRangeCmp').innerHTML = ">";
                companyCounter1++;
            } else if (peRange1[2] > peRange2[2]) {
                document.getElementById('peRangeCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('peRangeCmp').innerHTML = "=";
            }

            if (ssd1 < ssd2) {
                document.getElementById('scoreCmp').innerHTML = ">";
                companyCounter1++;
            } else if (ssd1 > ssd2) {
                document.getElementById('scoreCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('scoreCmp').innerHTML = "=";
            }

            if (esd1 < esd2) {
                document.getElementById('tlGrowthCmp').innerHTML = ">";
                companyCounter1++;
            } else if (esd1 > esd2) {
                document.getElementById('tlGrowthCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('tlGrowthCmp').innerHTML = "=";
            }

            if (psd1 < psd2) {
                document.getElementById('blGrowthCmp').innerHTML = ">";
                companyCounter1++;
            } else if (psd1 > psd2) {
                document.getElementById('blGrowthCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('blGrowthCmp').innerHTML = "=";
            }

            if (!isNaN(fwPe1[1]) && isNaN(fwPe2[1])) {
                document.getElementById('fwPeCmp').innerHTML = ">";
                companyCounter1++;
            } else if (isNaN(fwPe1[1]) && !isNaN(fwPe2[1])) {
                document.getElementById('fwPeCmp').innerHTML = "<";
                companyCounter2++;
            } else if (fwPe1[1] < fwPe2[1]) {
                document.getElementById('fwPeCmp').innerHTML = ">";
                companyCounter1++;
            } else if (fwPe1[1] > fwPe2[1]) {
                document.getElementById('fwPeCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('fwPeCmp').innerHTML = "=";
            }

            if (pbv1[0] < pbv2[0]) {
                document.getElementById('pbvCmp').innerHTML = ">";
                companyCounter1++;
            } else if (pbv1[0] > pbv2[0]) {
                document.getElementById('pbvCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('pbvCmp').innerHTML = "=";
            }

            if (margin1[0] > margin2[0]) {
                document.getElementById('marginCmp').innerHTML = ">";
                companyCounter1++;
            } else if (margin1[0] < margin2[0]) {
                document.getElementById('marginCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('marginCmp').innerHTML = "=";
            }

            if (interest1[0] < interest2[0]) {
                document.getElementById('interestCmp').innerHTML = ">";
                companyCounter1++;
            } else if (interest1[0] > interest2[0]) {
                document.getElementById('interestCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('interestCmp').innerHTML = "=";
            }

            if (yoyQtrlyTLGwth1[0] > yoyQtrlyTLGwth2[0]) {
                document.getElementById('yoyQtrlyTLGwthCmp').innerHTML = ">";
                companyCounter1++;
            } else if (yoyQtrlyTLGwth1[0] < yoyQtrlyTLGwth2[0]) {
                document.getElementById('yoyQtrlyTLGwthCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('yoyQtrlyTLGwthCmp').innerHTML = "=";
            }

            if (roa1[1] > roa2[1]) {
                document.getElementById('roaCmp').innerHTML = ">";
                companyCounter1++;
            } else if (roa1[1] < roa2[1]) {
                document.getElementById('roaCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('roaCmp').innerHTML = "=";
            }

            if (cr1[1] > cr2[1]) {
                document.getElementById('crCmp').innerHTML = ">";
                companyCounter1++;
            } else if (cr1[1] < cr2[1]) {
                document.getElementById('crCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('crCmp').innerHTML = "=";
            }

            if (movingAverageTxt1 > movingAverageTxt2) {
                document.getElementById('movingAverageCmp').innerHTML = ">";
                companyCounter1++;
            } else if (movingAverageTxt1 < movingAverageTxt2) {
                document.getElementById('movingAverageCmp').innerHTML = "<";
                companyCounter2++;
            } else {
              if (movingAverageNum1 < movingAverageNum2) {
                  document.getElementById('movingAverageCmp').innerHTML = ">";
                  companyCounter1++;
              } else if (movingAverageNum1 > movingAverageNum2) {
                  document.getElementById('movingAverageCmp').innerHTML = "<";
                  companyCounter2++;
              }
            }

            if (wcTxt1 > wcTxt2) {
                document.getElementById('wcCmp').innerHTML = ">";
                companyCounter1++;
            } else if (wcTxt1 < wcTxt2) {
                document.getElementById('wcCmp').innerHTML = "<";
                companyCounter2++;
            } else {
                document.getElementById('wcCmp').innerHTML = "=";
            }

            if (companyCounter1 > companyCounter2){
                document.getElementById('betterCompany').innerHTML = name1.concat(" Is Better!");
                document.getElementById('companyNameCmp').innerHTML = ">";
            } else if (companyCounter1 < companyCounter2){
                document.getElementById('betterCompany').innerHTML = name2.concat(" Is Better!");
                document.getElementById('companyNameCmp').innerHTML = "<";
            } else {
                document.getElementById('betterCompany').innerHTML = "Cannot Figure Out Which Company Is Better!";
                document.getElementById('companyNameCmp').innerHTML = "==";
            }

            document.getElementById('companyName1').innerHTML = name1.concat(": ").concat(companyCounter1.toString()).concat(" points");
            document.getElementById('companyName2').innerHTML = name2.concat(": ").concat(companyCounter2.toString()).concat(" points");
        });
    });
}

function isMembershipActive() {
    var url = '/account/' + getUserLoggedIn();
    var retVal = false;

    // We want the getJSON call to be synchronous.
    $.ajaxSetup({
        async: false
    });

    $.getJSON(url, function(d) {
        var membershipStatus = d.MEMBERSHIP_STATUS;
        var STATUS_WITH_ACCESS = ["LIFE", "DONOR", "FREE", "PAID", "ACTIVE"];

        if (STATUS_WITH_ACCESS.indexOf(membershipStatus) > -1) {
            retVal = true;
        }
    });

    // We should make the getJSON asynchronous again.
    $.ajaxSetup({
        async: true
    });

    return retVal;
}

function getAccountInfo() {
    if (isUserLoggedIn()) {
        var url = '/account/' + getUserLoggedIn();
        $.getJSON(url, function(d) {
            document.getElementById('membershipStatus').innerHTML = d.MEMBERSHIP_STATUS;
            document.getElementById('investrUsage').innerHTML = d.USAGE;

            var expiryDate = d.EXPIRY_DATE.substr(0, d.EXPIRY_DATE.indexOf(' '));
            if (["LIFE"].indexOf(d.MEMBERSHIP_STATUS) > -1) {
                document.getElementById('paidButton').innerHTML =
                    "<i class='inLineHelp'>Thank you for donating! You are a life member!</i>";
            } else if (["DONOR"].indexOf(d.MEMBERSHIP_STATUS) > -1) {
                document.getElementById('paidButton').innerHTML =
                    "<i class='inLineHelp'>Thank you for your generosity and supporting InvestR!</i>";
            } else if (["PAID"].indexOf(d.MEMBERSHIP_STATUS) > -1) {
                document.getElementById('paidButton').innerHTML =
                    "<i class='inLineHelp'>Payment verification pending. Generally takes a day!</i>";
            } else if (["UNPAID"].indexOf(d.MEMBERSHIP_STATUS) > -1) {
                document.getElementById('paidButton').innerHTML =
                    "<i class='inLineHelp'>Payment verification failed. Please mail chirag.rathod+investr@gmail.com with payment details!</i>";
            } else if (["ACTIVE"].indexOf(d.MEMBERSHIP_STATUS) > -1) {
                document.getElementById('paidButton').innerHTML =
                    "<i class='inLineHelp'>Thank you for supporting InvestR! Please renew before: " + expiryDate + "</i>";
            } else if (["FREE"].indexOf(d.MEMBERSHIP_STATUS) > -1) {
                document.getElementById('paidButton').innerHTML =
                    "<i class='inLineHelp'>Expires on: " + expiryDate + "</i>";
            }  else if (["EXPIRED"].indexOf(d.MEMBERSHIP_STATUS) > -1) {
                document.getElementById('paidButton').innerHTML =
                    "Activate Subscription: <button type='button' onclick='activateSubscription()'>I Have Paid!</button><br><i class='inLineHelp'>Expired on: " + expiryDate + "</i>";
            }
        });
    } else {
        document.getElementById('membershipStatus').innerHTML =  "Login To Get Membership Status";
        document.getElementById('investrUsage').innerHTML =  "Login To Get Usage Details";
    }
}

function logUserSessions() {
    // NOTE: Buffer column ATTR1 (TEXT) is used to store total session count
    if (isUserLoggedIn()) {
        var sessionCount;
        $.post("user.php",
            {
                "callFunc": "getPrefs",
                "userEmail": localStorage.getItem("InvestrUser"),
                "prefName": "ATTR1"
            },
            function (response) {
                response = response.replace(/^\s+|\s+$/g, ""); // Remove the trailing new line

                if (response.length === 0 || response === "NaN")
                    sessionCount = 0; // User clicking for the first time
                else
                    sessionCount = parseInt(response);

                sessionCount++;

                $.post("user.php",
                    {
                        "callFunc": "setPrefs",
                        "userEmail": localStorage.getItem("InvestrUser"),
                        "prefName": "ATTR1",
                        "prefs": sessionCount.toString()
                    },
                    function (response) {
                    }
                );
            }
        );
    }
}

// Dynamically include the header and footer. So we just have to change at one location.
$(function(){
    $("#footer").load("footer.html");
});
