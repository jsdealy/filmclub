<?php
//    setting up twig templating
require_once '/home/justin/vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader('../templates');
$twig = new \Twig\Environment($loader, [
    'cache' => '../compilation_cache',
]);

//    rendering the basic header template
echo $twig->render("header.html");
//    setting up divs
?>

<body>
    <div id="alert"></div>
    <div id="maincontainer" class="container"></div>
</body>

<?php
$username = $_POST['username'];
$password = $_POST['password'];
$confirm = $_POST['confirm'];

//    Registration process if the POST data has been received 
if ((isset($username)) && (isset($password)) && (isset($confirm))) {
    // connect to mysql
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    @ $mysql = new mysqli('localhost', 'justin', 'B0nk', 'filmclub');

    //	checking for database connection error   
    if (mysqli_connect_errno()) {
	echo "Couldn't connect to the database.";
	exit;
    }

    //    creating users table if necessary
    $ret = $mysql->query("CREATE TABLE IF NOT EXISTS users (id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY, username TEXT NOT NULL, hash TEXT NOT NULL, club TEXT NOT NULL DEFAULT 'no' CHECK (club IN ('yes', 'no')))");

    //    TODO refactor this
    //    checking whether username is taken
    $stmt = $mysql->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username); 
    $stmt->execute();
    $retob = $stmt->get_result();

    if ($retob->fetch_row() != null) {
//    username collision, sending message and form
?>

<script charset="utf-8">alert("Username already taken! Please choose another.");</script>
<script charset="utf-8">loadRegistrationForm();</script>


<?php
    } else if ($password != $confirm) {
//    password & confirmation don't match, sending message and form
?>

<script charset="utf-8">alert("Password and confirmation don't match! Please try again.");</script>
<script charset="utf-8">loadRegistrationForm();</script>

<?php
    } else {
	$stmt = $mysql->prepare("INSERT INTO users (username, hash) VALUES (?, ?)");

	$hash = password_hash($password, PASSWORD_ARGON2ID);
	$stmt->bind_param("ss", $username, $hash);

	$resultBoolean = $stmt->execute();
	if ($resultBoolean === true) {
	session_start();
	$_SESSION['validUser'] = $username;
//    new user is registered and logged into the session, sending message and redirecting
?>

	<script charset="utf-8">
	alert("Successfully registered and logged in.");
	redirect("index.php");
	</script>

<?php
	}
    }
//    If the username and password aren't set, present the form
} else {
?>

<script charset="utf-8">loadRegistrationForm();</script>

<?php
}
?>

