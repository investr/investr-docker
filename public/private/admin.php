<?php
//
// Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)
//

if(isset($_POST['send'])) {
    $con = getCon();

    $toUser = $_POST['user'];
    $notice = $_POST['notice'];

    // If user is set to -1, then we send the notice to ALL the users
    if ($toUser == "-1") {
        $result = mysqli_query($con, "SELECT ID FROM USERS");

        while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
            mysqli_query($con, "INSERT INTO NOTIFICATIONS (NOTICE, SEND_TO_USER_ID, SENT) VALUES ('$notice', '$row[0]', 0)");
        }

    } else {
        mysqli_query($con, "INSERT INTO NOTIFICATIONS (NOTICE, SEND_TO_USER_ID, SENT) VALUES ('$notice', '$toUser', 0)");
    }

    mysqli_close($con);
}

// Create connection to the database
function getCon() {
    $con=mysqli_connect('localhost', 'root', '', 'investr');

    // Check connection
    if (mysqli_connect_errno())
        echo "Failed to connect to MySQL: " . mysqli_connect_error();

    return $con;
}

?>

