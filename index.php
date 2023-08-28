<?php
session_start();

/* getting the code from POST and storing in $code <= 08/16/23 19:34:21 */ 
$code = isset($_POST['code']) ? $_POST['code'] : "boosh";
$login = isset($_SESSION['login']) ? $_SESSION['login'] : false;

if (!$login && $code !== "sl348daoi3w4Vlk2SKjs84792D") {

?>
    
       <form class="code" action="/filmclub/index.php" method="POST">
	   <input placeholder="code goes here" class="inputCode" type="text" name="code" id="code">
	       <button class="inputCodeButton" type="submit">Submit</button>
       </form> 
    
<?php

} else {

    header("Location: " . "/filmclub/home.php?alk83092948092=882w398dkj");
    exit;

};
