<?php declare(strict_types=1);
require('ErrorAndResponse.php');
class FilmClubDB {
    private $db;
    private $tmdbAPI;
    use ErrorAndResponse;

    function __construct() {
	require_once __DIR__ . '/../../vendor/autoload.php';
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
	    $this->tmdbAPI = $_ENV['TMDB_API'];
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

    private function ensureMyListTableExists() {
	try {
	    $this->db->query("CREATE TABLE IF NOT EXISTS mylist (user_id INTEGER NOT NULL REFERENCES users(id), movie_id INTEGER NOT NULL REFERENCES movies(id))");
	} catch(Exception $e) {
	    $this->handleError("trouble checking mylist table: " . $e->getMessage());
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

    public function getlist(string $username): bool {
	$this->ensureUsersTableExists();
	$this->ensureMyListTableExists();

	try {
	    $stmt = $this->db->prepare("SELECT title, year, length, genre, imdb, numratings, language, 
		directors, actors, writers, acclaim FROM movies, mylist, users WHERE movies.id = 
		mylist.movie_id AND users.id = mylist.user_id AND users.username = ?");
	    $stmt->bind_param("s", $username); 
	    $stmt->execute();
	    $retob = $stmt->get_result();
	} catch (Exception $e) {
	    error_log("Error: " . $e->getMessage() . "\nMysqli error number: " . mysqli_errno($this->db) . "\nMysqli error: " . mysqli_error($this->db) . "\n");
	    echo "database error 28411";
	    return false;
	}

	if (count($rows = $retob->fetch_all(MYSQLI_ASSOC))) {
	    $jsonRows = json_encode($rows);
	    echo $jsonRows;
	} else {
	    echo "list is empty!";
	}
	return true;
    }

    public function getoverview(string $imdb_id): bool {
	$ch = curl_init();

	/* first we get the tmdb movie id using the imdb_id <= 08/28/23 18:05:50 */ 
	$movieurl = 'https://api.themoviedb.org/3/find/' . $imdb_id . '?external_source=imdb_id';

	// Set the cURL options
	curl_setopt($ch, CURLOPT_URL, $movieurl);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
	    'Authorization: Bearer ' . $this->tmdbAPI,
	    'Accept: application/json',
	]);

	$tmdbFilmInfoJSON = curl_exec($ch);

	// Check for cURL errors
	if (curl_errno($ch)) {
	    error_log(curl_error($ch));
	    return false;
	}

	/* decoding the json <= 08/29/23 21:06:40 */ 
	try {
	    $tmdbFilmInfo = json_decode($tmdbFilmInfoJSON);
	} catch (Exception $e) {
	    $this->handleError($e->getMessage());
	    return false;
	}

	/* constructing the image url <= 08/29/23 21:01:54 */ 
	$response = $tmdbFilmInfo->movie_results[0]->overview;

	// Close cURL resource
	curl_close($ch);
	
	echo $this->response(true, $response);
	return true;
    }

    public function getimage(string $imdb_id): bool {
	$ch = curl_init();

	/* first we get the tmdb movie id using the imdb_id <= 08/28/23 18:05:50 */ 
	$movieurl = 'https://api.themoviedb.org/3/find/' . $imdb_id . '?external_source=imdb_id';

	// Set the cURL options
	curl_setopt($ch, CURLOPT_URL, $movieurl);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
	    'Authorization: Bearer ' . $this->tmdbAPI,
	    'Accept: application/json',
	]);

	$tmdbFilmInfoJSON = curl_exec($ch);

	// Check for cURL errors
	if (curl_errno($ch)) {
	    error_log(curl_error($ch));
	    return false;
	}

	/* decoding the json <= 08/29/23 21:06:40 */ 
	try {
	    $tmdbFilmInfo = json_decode($tmdbFilmInfoJSON);
	} catch (Exception $e) {
	    $this->handleError($e->getMessage());
	    return false;
	}

	/* getting the correct addresses for image downloads <= 08/29/23 21:01:35 */ 
	$tmdbConfigGettingUrl = 'https://api.themoviedb.org/3/configuration';

	// Set the cURL options
	curl_setopt($ch, CURLOPT_URL, $tmdbConfigGettingUrl);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
	    'Authorization: Bearer ' . $this->tmdbAPI,
	    'Accept: application/json',
	]);

	// Execute the cURL request
	$tmdbConfigInfoJSON = curl_exec($ch);

	// Check for cURL errors
	if (curl_errno($ch)) {
	    error_log(curl_error($ch));
	    $this->handleError(curl_error($ch));
	    return false;
	}

	/* decoding the json <= 08/29/23 21:07:07 */ 
	try {
	    $tmdbConfigInfo = json_decode($tmdbConfigInfoJSON);
	} catch(Exception $e) {
	    $this->handleError($e->getMessage());
	    return false;
	}

	/* constructing the image url <= 08/29/23 21:01:54 */ 
	$response = $tmdbConfigInfo->images->base_url . $tmdbConfigInfo->images->logo_sizes[4] . $tmdbFilmInfo->movie_results[0]->poster_path;

	// Close cURL resource
	curl_close($ch);
	
	echo $this->response(true, $response);
	return true;
    }
}

