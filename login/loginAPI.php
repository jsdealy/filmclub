<?php
session_start();
require('classes/FilmClubUser.php');

$user = new FilmClubUser();
$user->execute();
