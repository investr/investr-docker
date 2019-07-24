<?php
    //
    // Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)
    //

    include_once 'admin.php';

    //Connect to our MySQL database using the PDO extension.
    $dbhost = 'localhost';
    $dbuser = 'root';
    $dbpass = '';
    $dbname = 'investr';

    $mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
    $pdo = new PDO($mysql_conn_string, $dbuser, $dbpass);

    //Our select statement. This will retrieve the data that we want.
    $sql = "SELECT ID, EMAIL FROM USERS";

    //Prepare the select statement.
    $stmt = $pdo->prepare($sql);

    //Execute the statement.
    $stmt->execute();

    //Retrieve the rows using fetchAll.
    $users = $stmt->fetchAll();
?>

<form method="POST">
    <label>To: </label>
    <select name="user">
        <option value="-1">All</option>
        <?php foreach($users as $user): ?>
            <option value="<?php echo $user['ID']; ?>"><?php echo $user['EMAIL']; ?></option>
        <?php endforeach; ?>
    </select>
    <label>Message: </label><input name="notice" type="text"/>
    <input type="submit" name="send" value="Send"/>
</form>
