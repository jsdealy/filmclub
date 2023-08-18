<?php
session_start();

/* getting the cookie value and storing in $access <= 08/16/23 19:34:02 */ 
$login = isset($_SESSION['login']) ? $_SESSION['login'] : "bad";

/* getting the code from POST and storing in $code <= 08/16/23 19:34:21 */ 
$username = isset($_POST['username']) ? $_POST['username'] : "none";
$password = isset($_POST['password']) ? $_POST['password'] : "none";


if ($login !== "good" && $username !== "none" && $password !== "none") {

?>
    
       <form class="code" action="/login.php" method="POST">
	   <input placeholder="" class="inputCode" type="text" name="code" id="code">
	       <button class="inputCodeButton" type="submit">Submit</button>
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

