<?php
session_start();

/* getting the cookie value and storing in $access <= 08/16/23 19:34:02 */ 
$registered = isset($_SESSION['registered']) ? $_SESSION['registered'] : "bad";

/* getting the code from POST and storing in $code <= 08/16/23 19:34:21 */ 
$username = isset($_POST['username']) ? $_POST['username'] : "none";

$password = isset($_POST['password']) ? $_POST['password'] : "none";

$confirm = isset($_POST['confirm']) ? $_POST['confirm'] : "none";

$postRegistrationToAddress = "/testregister.php";

if ($username !== "none")


if ($registered !== "good") {

?>
    
    <form class="code" action=<?= $postRegistrationToAddress ?> method="POST">
	   <input placeholder="pick a username" class="inputCode" type="text" name="username" id="code">
	   <input placeholder="password" class="inputCode" type="text" name="password" id="code">
	   <input placeholder="confirm password" class="inputCode" type="text" name="confirm" id="code">
	       <button class="submitButton" type="submit">Submit</button>
       </form> 
    
<?php

} else if ($code === "bonk"){ 

    $_SESSION['zonk'] = "tonk";

    sleep(3);

    header("Location: " . "https://www.justindealy.org/testcookie.php");

    exit;

} else if ($access === "tonk"){

    echo "yay";

} else { echo "Error!"; };
?>

