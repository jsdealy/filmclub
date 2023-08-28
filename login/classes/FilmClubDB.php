<?php
require('ErrorAndResponse.php');
class FilmClubDB {
    private $db;
    use ErrorAndResponse;

    function __construct() {
	require_once __DIR__ . '/../../../vendor/autoload.php';


		/* getting dotenv variables */ 
	try {
	    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '../.env');
	    $dotenv->load();
	} catch (Exception $e) {
	    echo $this->handleError("dotenv problem: " . $e->getMessage());
	    return;
	}

	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

	/* connecting to mysql using environment variables <= 08/26/23 08:52:12 */ 
	try {
	    $this->db = new mysqli($_ENV['SQL_HOST'], $_ENV['SQL_USERNAME'], $_ENV['SQL_PASSWORD'], $_ENV['SQL_DB']);
	} catch (Exception $e) {
	    $this->handleError("mysqli problem: " . $e->getMessage() . " /// error number: " . mysqli_connect_errno());
	    die;
	}
    }

    function __destruct() {
	$this->db->close();
    }

    private function ensureUsersTableExists() {
	try {
	    $this->db->query("CREATE TABLE IF NOT EXISTS users (id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY, username TEXT NOT NULL, hash TEXT NOT NULL)");
	} catch(Exception $e) {
	    $this->handleError("trouble checking user table: " . $e->getMessage());
	    die;
	}
    }

    public function register(string $username, string $password): bool {
	$this->ensureUsersTableExists();

	/* we're going to check whether username exists already <= 08/26/23 08:58:32 */ 
	$stmt = $this->db->prepare("SELECT * FROM users WHERE username = ?");
	$stmt->bind_param("s", $username); 
	$stmt->execute();
	$retob = $stmt->get_result();

	/* if username is taken... <= 08/26/23 09:21:56 */ 
	if ($retob->fetch_row() != null) {
	    echo $this->response(false, "Username taken... please choose another.");
	    return false;
	} else {
	    /* insert username <= 08/26/23 11:08:16 */ 
	    $stmt = $this->db->prepare("INSERT INTO users (username, hash) VALUES (?, ?)");
	    $hash = password_hash($password, PASSWORD_ARGON2ID);
	    $stmt->bind_param("ss", $username, $hash);

	    /* if registration successful <= 08/26/23 14:21:39 */ 
	    if ($stmt->execute() === true) {
		/* logging the user in <= 08/26/23 14:33:26 */ 
		$_SESSION['login'] = true;
		$_SESSION['username'] = $username;
		echo $this->response(true, "registration successful! you're logged in.");
		return true;
	    } else {
		$_SESSION['login'] = false;
		echo $this->response(false, "code 48327");
		return false;
	    }
	}
    }

    public function login(string $username, string $password): bool {
	$this->ensureUsersTableExists();

	$stmt = $this->db->prepare("SELECT hash FROM users WHERE username = ?");
	$stmt->bind_param("s", $username); 
	$stmt->execute();
	$retob = $stmt->get_result();
	$hash = $retob->fetch_row();
	/* if no hash stored for that username <= 08/26/23 22:10:35 */ 
	if ($hash == null) {
	    $_SESSION['login'] = false;
	    echo $this->response(false, "username not found");
	    return false;
	    /* if the hashes don't match <= 08/26/23 22:10:44 */ 
	} else if ($hash !== password_hash($password, PASSWORD_ARGON2ID)){
	    $_SESSION['login'] = false;
	    echo $this->response(false, "incorrect password");
	    return false;
	} else {
	    $_SESSION['login'] = true;
	    $_SESSION['username'] = $username;
	    return true;
	}
    }
}

