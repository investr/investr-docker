<?php
    $dbhost = '172.17.0.2';
    $dbuser = 'root';
    $dbpass = 'admin';
    $dbname = 'investr';

    $mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
    $dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);

    $stmt = $pdo->query('SELECT COMMENT FROM DOCKER_TEMP');
    {
        echo $row['COMMENT'] . "\n";
    }
?>
