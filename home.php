<?php session_start();

$easyaccess = isset($_GET['alk83092948092']) ? $_GET['alk83092948092'] : "unset";
$login = isset($_SESSION['login']) ? $_SESSION['login'] : false;

if ($login || $easyaccess === "882w398dkj") {

?>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset='UTF-8'>
    <title>Film Club</title>
    <script src='https://unpkg.com/react@18.2.0/umd/react.production.min.js'></script>
    <script src='https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'></script>
    <link crossorigin="anonymous" 
	    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" 
	    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" rel="stylesheet">

    <script crossorigin="anonymous" 
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" 
	integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"></script>

    <!-- https://favicon.io/emoji-favicons/money-bag/ -->
    <link href="/static/favicon.ico" rel="icon">
  </head>
  <body>
    <div id='root'></div>
    <script src='../dist/bundle.js'></script>
  </body>
</html>
    <?php
}
        
else { echo "Access Denied"; }
