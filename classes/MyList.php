<?php
require('FilmClubDB.php');
class MyList {
    private $username;
    private $list;

    function __construct() {
	/* getting POST data and storing <= 08/16/23 19:34:21 */ 
	if (!isset($_SESSION['login']) || !$_SESSION['login']) { $this->handleError("not logged in"); return; }
	if (!isset($_SESSION['username'])) {$this->handleError("no username in session"); return;} else {
	    $this->username = $_SESSION['username'];
	    $this->list = [];
	}
    }

    use ErrorAndResponse;

    public function getlist(): bool {
	$filmClubDB = new FilmClubDB;
	if ($filmClubDB->getlist($this->username)) return true;
	else return false;
    }
}
