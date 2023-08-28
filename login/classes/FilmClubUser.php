<?php
require('FilmClubDB.php');
class FilmClubUser {
    private $login;
    private $formstate;
    private $username;
    private $password;
    private $confirm;

    function __construct() {
	/* getting session data <= 08/26/23 19:39:47 */ 
	$login = isset($_SESSION['login']) ? $_SESSION['login'] : "";

	/* getting POST data and storing <= 08/16/23 19:34:21 */ 
	$formstate = isset($_POST['formstate']) ? $_POST['formstate'] : "";
	$username = isset($_POST['username']) ? $_POST['username'] : "";
	$password = isset($_POST['password']) ? $_POST['password'] : "";
	$confirm = isset($_POST['confirm']) ? $_POST['confirm'] : "";

	/* storing in the object <= 08/26/23 19:39:59 */ 
	$this->login     = $login;
	$this->formstate = $formstate;
	$this->username  = $username;
	$this->password  = $password;
	$this->confirm   = $confirm;
    }

    use ErrorAndResponse;

    private function validateLogin(): bool {
	/* we allow login to be an empty string <= 08/25/23 19:53:06 */ 
	if (!is_bool($this->login) && $this->login !== "") return false;
	return true;
    }

    private function validateFormstate(): bool {
	$validFormstates = [ "login", "register" ];
	if (!in_array($this->formstate, $validFormstates)) return false;
	return true;
    }

    private function validateUsername(): bool {
	if (!preg_match("/^[_a-z0-9]+$/i", $this->username)) return false;
	return true;
    }

    private function validatePassword(): bool {
	if (!preg_match("/[a-z]+/", $this->password)) return false;
	if (!preg_match("/[A-Z]+/", $this->password)) return false;
	if (!preg_match("/[0-9]+/", $this->password)) return false;
	if (!preg_match("/[[:punct:]]+/", $this->password)) return false;
	if (strlen($this->password) < 8) return false;
	return true;
    }

    private function validateConfirm(): bool {
	if ($this->password !== $this->confirm) return false;
	return true;
    }

    private function validate(): bool {
	if (strlen($this->formstate . $this->username . $this->password . $this->confirm) > 500) { $this->handleError("error 34800"); return false; }
	if (!$this->validateLogin()) { $this->handleError("error 8331"); return false; }
	if (!$this->validateFormstate()) { $this->handleError("error 109223"); return false; }
	if ($this->formstate == "register") {
	    if (!$this->validateUsername()) { $this->handleError("invalid username"); return false; }
	    if (!$this->validatePassword()) { $this->handleError("invalid password"); return false; }
	    if (!$this->validateConfirm()) { $this->handleError("password and confirm do not match"); return false; }
	}
	return true;
    }

    private function register(): bool {
	$filmClubDB = new FilmClubDB;
	if ($filmClubDB->register($this->username, $this->password)) return true;
	else return false;
    }

    private function login(): bool {
	$filmClubDB = new FilmClubDB;
	if ($filmClubDB->login($this->username, $this->password)) return true;
	else return false;
    }

    public function execute(): bool {
	if ($this->validate()) {
	    $action = $this->formstate;
	    if ($this->$action()) return true;
	    else return false;
	} else return false;
    }

    public function check(): bool {
	echo $this->response(false, "just a test");
	return true;
    }
}
