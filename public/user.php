<?php

//
// Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)
//


// Create connection to the database
$conn = getConn();

// Get which function will be called and call it
$callFunc = $_POST['callFunc'];

if ($callFunc == "registerUser") {
    registerUser();
} else if ($callFunc == "deleteUser") {
    deleteUser();
} else if ($callFunc == "getPrefs") {
    getPrefs();
} else if ($callFunc == "setPrefs") {
    setPrefs();
} else if ($callFunc == "getWatchlist") {
    getWatchlist();
} else if ($callFunc == "setWatchlist") {
    setWatchlist();
} else if ($callFunc == "deleteFromWatchlist") {
    deleteFromWatchlist();
} else if ($callFunc == "getNoticeCount") {
    getNoticeCount();
}

// Register a new user and return the mail id. If the user is already registered then
// we return the mail id. In case of any other error we return the error code.
function registerUser() {
    global $conn;
    mysqli_select_db($conn ,'investr');

    $name = $_POST['name'];
    $userEmail = $_POST['email'];
    $image = $_POST['image'];

    $insertStmt = "INSERT INTO USERS (NAME, EMAIL, IMAGE) VALUES ('$name', '$userEmail', '$image')";
    $retval = mysqli_query($conn, $insertStmt);

    if($retval) {
        // If the insert was successfull then we get the ID and insert it in the PREFS table
        // NOTE: DONATION - USED FOR MEMBERSHIP STATUS (LIFE, DONOR, FREE, PAID, UNPAID, ACTIVE, EXPIRED)
        // NOTE: NOTES - USED FOR ACCOUNT CREATED TIME STAMP
        // NOTE: MESSAGE - USED TRIAL EXPIRY TIME STAMP
        $userId = getUserId($userEmail);
        $insertStmt = "INSERT INTO PREFS (USER_ID, DONATION, NOTES, MESSAGE)
                            VALUES ('$userId', 'FREE', NOW(), '2099-12-31 23:59:59')";
        mysqli_query($conn, $insertStmt);

        echo $userEmail;
    } else {
        $err = mysqli_errno($conn);
        if ($err == 1062)
            echo $userEmail;
        else
            echo $err;
    }
}

function deleteUser() {
    global $conn;
    mysqli_select_db($conn, 'investr');

    $userEmail = $_POST['email'];

    $userId = getUserId($userEmail);

    // Delete any unsent notificaitons
    $deleteStmt = "DELETE FROM NOTIFICATIONS WHERE SEND_TO_USER_ID = '$userId'";
    $retval1 = mysqli_query($conn, $deleteStmt);

    // Delete any watchlist stocks
    $deleteStmt = "DELETE FROM WATCHLIST WHERE USER_ID = '$userId'";
    $retval2 = mysqli_query($conn, $deleteStmt);

    // Delete any saved prefs
    $deleteStmt = "DELETE FROM PREFS WHERE USER_ID = '$userId'";
    $retval3 = mysqli_query($conn, $deleteStmt);

    // Finally delete the user
    $deleteStmt = "DELETE FROM USERS WHERE ID = '$userId'";
    $retval4 = mysqli_query($conn, $deleteStmt);

    if ($retval1 && $retval2 && $retval3 && $retval4) {
        // If all the deletes were successful then show success message to user
        echo "I will miss you! See you next quarter ... maybe! :-)";
    } else {
        echo "Oops! Something went wrong. Try again and if the problem persists then please mail youremail@youremailprovider.com for a manual deletion of account!";
    }
}


// If we are sent ALL then we get all the preferences. Else we will be sent individual names.
function getPrefs() {
    global $conn;
    mysqli_select_db($conn, 'investr');

    $userEmail = $_POST['userEmail'];
    $prefName = $_POST['prefName'];

    $userId = getUserId($userEmail);

    // If user id is greater than 0, then we have a valid user.
    if ($userId > 0) {
        if ($prefName == "ALL") {
            $prefs = array();
            $selectStmt = "SELECT WEIGHT_PRESET, WEIGHTS, VALUATIONS, TOLERANCE, SHOW_TOOLTIPS, EMAIL_USER FROM PREFS WHERE USER_ID = '$userId' LIMIT 1";

            $result = mysqli_query($conn, $selectStmt);

            if ($result) {
                while ($row = mysqli_fetch_object($result)) {
                    $prefs[] = $row->WEIGHT_PRESET;
                    $prefs[] = $row->WEIGHTS;
                    $prefs[] = $row->VALUATIONS;
                    $prefs[] = $row->TOLERANCE;
                    $prefs[] = $row->SHOW_TOOLTIPS;
                    $prefs[] = $row->EMAIL_USER;
                }
            }
            echo json_encode($prefs);
        } else {
            $prefs = null;
            $selectStmt = "SELECT " . $prefName . " FROM PREFS WHERE USER_ID = '$userId' LIMIT 1";

            $result = mysqli_query($conn, $selectStmt);

            if ($result) {
                while ($row = mysqli_fetch_object($result)) {
                    $prefs = $row->$prefName;
                }
            }
            echo $prefs;
        }
    }
}

function setPrefs() {
    global $conn;
    mysqli_select_db($conn, 'investr');

    $userEmail = $_POST['userEmail'];
    $prefName = $_POST['prefName'];
    $prefs = $_POST['prefs'];

    $userId = getUserId($userEmail);

    $updateStmt = "UPDATE PREFS SET " . $prefName . " = '$prefs', ATTR2 = NOW() WHERE USER_ID = '$userId'";

    $ret = mysqli_query($conn, $updateStmt);
}

function getWatchlist() {
    global $conn;
    mysqli_select_db($conn, 'investr');

    $userEmail = $_POST['userEmail'];

    $userId = getUserId($userEmail);

    // If user id is greater than 0, then we have a valid user
    if ($userId > 0) {
        $result = mysqli_query($conn, "SELECT STOCK_ID FROM WATCHLIST WHERE USER_ID = '$userId'");

        $currentStockIds[] = "";
        while ($row = mysqli_fetch_object($result)) {
            $currentStockIds[] = $row->STOCK_ID;
        }

        echo json_encode($currentStockIds);
    } else {
        echo 0;
    }
}

function setWatchlist() {
    global $conn;
    mysqli_select_db($conn, 'investr');

    $userEmail = $_POST['userEmail'];
    $stockIds = $_POST['stockIds'];

    $userId = getUserId($userEmail);

    $stockIdsArray = json_decode($stockIds);
    foreach ($stockIdsArray as $stockId) {
        $ret = mysqli_query($conn, "INSERT INTO WATCHLIST (USER_ID, STOCK_ID) VALUES ('$userId', '$stockId')");
    }
}

function deleteFromWatchlist() {
    global $conn;
    mysqli_select_db($conn, 'investr');

    $userEmail = $_POST['userEmail'];
    $stockIds = $_POST['stockIds'];

    $userId = getUserId($userEmail);

    $stockIdsArray = json_decode($stockIds);
    foreach ($stockIdsArray as $stockId) {
        $ret = mysqli_query($conn, "DELETE FROM WATCHLIST WHERE USER_ID = '$userId' AND STOCK_ID = '$stockId'");
    }
}

function getNoticeCount() {
    global $conn;
    mysqli_select_db($conn, 'investr');

    $userEmail = $_POST['userEmail'];
    $userId = getUserId($userEmail);

    // If user id is greater than 0, then we have a valid user
    if ($userId > 0) {
        $result = mysqli_query($conn, "SELECT * FROM NOTIFICATIONS WHERE SENT = 0 AND SEND_TO_USER_ID = '$userId'");
        $num_rows = mysqli_num_rows($result);

        echo $num_rows;
    } else {
        echo 0;
    }
}

//
// PRIVATE METHODS
//

function getUserId($userEmail) {
    global $conn;
    mysqli_select_db($conn, 'investr');

    $userId = 0;

    $result = mysqli_query($conn, "SELECT ID FROM USERS WHERE EMAIL = '$userEmail' LIMIT 1");

    if ($result) {
        while ($row = mysqli_fetch_object($result)) {
            $userId = $row->ID;
        }
    }

    return $userId; // 0 if error or user does not exist. Greater than 0 for valid user.
}

function getConn() {
    $dbhost = 'localhost';
    $dbuser = 'root';
    $dbpass = 'admin';		

    $dbconn = mysqli_connect($dbhost, $dbuser, $dbpass);
    return $dbconn;
}

?>

