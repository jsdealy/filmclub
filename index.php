<?php

$name = "soiw3489alk";
$value = "boosh";
$expiration = time() + (30 * 24 * 60 * 60); // expires in a month
$path = "/";
$domain = "www.justindealy.org"; // Or specify your domain
setcookie($name, $value, $expiration, $path, $domain);

/* getting the cookie value and storing in $access <= 08/16/23 19:34:02 */ 
$access = isset($_COOKIE['soiw3489alk']) ? $_COOKIE['soiw3489alk'] : "boosh";

/* getting the code from POST and storing in $code <= 08/16/23 19:34:21 */ 
$code = isset($_POST['code']) ? $_POST['code'] : "boosh";

if ($access !== "98sjlkj8jjsaSsdf" && $code !== "sl348daoi3w4Vlk2SKjs84792D") {

?>
    
       <form class="code" action="/filmclub/index.php" method="POST">
	   <input placeholder="code goes here" class="inputCode" type="text" name="code" id="code">
	       <button class="inputCodeButton" type="submit">Submit</button>
       </form> 
    
<?php

} else if ($code === "sl348daoi3w4Vlk2SKjs84792D"){ 

    $name = "soiw3489alk";
    $value = "98sjlkj8jjsaSsdf";
    $expiration = time() + (30 * 24 * 60 * 60); // Expires in 1 hour
    $path = "/";
    $domain = "www.justindealy.org"; // Or specify your domain
    $secure = true; // Change to true if using HTTPS
    setcookie($name, $value, $expiration, $path, $domain);
    sleep(2);

    header("Location: " . "https://www.justindealy.org/filmclub/home.php?alk83092948092=882w398dkj");
    exit;

} else if ($access === "98sjlkj8jjsaSsdf"){

    header("Location: " . "https://www.justindealy.org/filmclub/home.php?alk83092948092=882w398dkj");
    exit;

} else { echo "Error!"; };

?>
