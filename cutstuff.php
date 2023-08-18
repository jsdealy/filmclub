
if (isset($grabber) && is_string($grabber) && strlen($grabber) < 5000 && isJSON($grabber)) {
    main($grabber);
declare(strict_types=1);

require "languages.php";

function error($message, $type = E_USER_ERROR) {
    trigger_error($message, $type);
    printToConsole("Error: " . $message);
}

function isJSON(string $s) {
    json_decode($s);
    return json_last_error() === JSON_ERROR_NONE;
}

function checkFieldNames(array $fromuser) {
require "fieldTypes.php";
    if (count($fromuser) > 11) { echo "a"; return true; };
    foreach ($fromuser as $object) {
        if (count(array_diff(array_keys($object), ['fieldtype', 'value'])) > 0) { echo "b"; return true; };
	$goodfields = false;
	foreach($fieldtypes as $ft) {
	    if ($ft === $object['fieldtype']) { $goodfields = true; };
	}
	if (!$goodfields) { echo "c"; return true; }
    }
    return false;
}

function printToConsole($str) {
	ob_implicit_flush(true);

	// Open stdout
	$stdout = fopen('php://stdout', 'w');

	// Print to the command line
	fwrite($stdout, $str);

	// Close stdout
	fclose($stdout);
}

function sqlQueryBuilder(array $data, int $resultSize = 20) {

    $ret = "";

    function doubleBound(string $field, string $bounds) {
	$sql = "";
	$token = strtok($bounds, "-");
	$sql = "$field >= $token";
	if (($token = strtok("-")) !== false && $token !== "Infinity") {
	    $sql = $sql . " AND $field <= $token";
	}
	return trim(trim($sql, "-"));
    };

    function simpleSelect(string $field, string $str) {
	global $languages;
	return trim(trim("$field LIKE " . '"%' . (str_starts_with($field, "language") ? $languages[$str] : $str) . '%"'), "-");
    };

    function tripleSelect(string $field, string $xstring) {
	$sql = "";
	$token = strtok($xstring, "|");
	while ($token !== false && $token !== "x") {
	    $sql = $sql . ($sql !== "" ? " AND " : "") . "$field LIKE " . '"%' . $token . '%"';
	    $token = strtok("|");
	}
	return trim(trim($sql, "-"));
    }

    function textField(string $field, string $str) {
	$sql = "";
	$str = trim(preg_replace('/,[ ]+/', ",", preg_replace('/[;\/\\:\|]|(-[-]+)/', ",", $str)));
	$commalessConnectives = [
	    '/[ ]+or[ ]+/i',
	    '/(([ ]+not)|^not)[ ]+/i',
	    '/[ ]+and[ ]+/i',
	    '/[ ]+and[ ]*,/i',
	    '/[ ]+not[ ]*,/i',
	    '/[ ]+or[ ]*,/i',
	    '/,[ ]*and[ ]+/i',
	    '/,[ ]*not[ ]+/i',
	    '/,[ ]*or[ ]+/i'
	];
	$commaConnectives = [',or,', ',not,', ',and,', ",and,", ',not,', ',or,', ',and,', ',not,', ',or,'];
	$str = preg_replace($commalessConnectives, $commaConnectives, $str);
	$str = preg_replace("/'/", '"', $str);
	$str = preg_replace('/"["]+/', '"', $str);
	$spacyCommas = ['/,[ ]+/', '/[ ]+,/'];
	$str = preg_replace($spacyCommas, ',', $str);
	$str = preg_replace('/[\[\{]/', "(", $str);
	$str = preg_replace('/[\]\}]/', ")", $str);
	$str = preg_replace('/,[,]+/', ',', $str);
	$commalessParens = ['/([^,])\(/', '/\(([^,])/','/([^,])\)/', '/\)([^,])/',];
	$fixedCommalessParens = ["$1,(", "(,$1", "$1,)", "),$1"];
	$str = preg_replace($commalessParens, $fixedCommalessParens, $str);
	$openParens = substr_count($str, "(");
	$closeParens = substr_count($str, ")");
	if ($openParens !== $closeParens) {
	    if ($openParens > $closeParens) {  
	    $str = $str . str_repeat(",)",$openParens - $closeParens);
	    } else {
	    $str = str_repeat("(,",$closeParens - $openParens) . $str;
	    }
	}
	$str = trim(trim(preg_replace('/,[,]+/', ",", $str), ","));

	$token = strtok($str, ",");
	$connNeeded = false;
	while ($token !== false) {
	    if (preg_match('/\(/', $token)) { $sql = $sql . $token; $connNeeded = false; }
	    else if (preg_match('/\)/', $token)) { $sql = $sql . $token; $connNeeded = true; }
	    else if (preg_match('/(^and$)|(^or$)/i', $token)) { $sql = ($connNeeded ? $sql = ($sql . " $token ") : $sql); $connNeeded = false; }
	    else if (preg_match('/(^not$)/i', $token)) { $sql = ($connNeeded ? $sql = $sql : ($sql . " $token ")); }
	    else if (preg_match('/^".*"$/', $token)) { $sql = $sql . ($connNeeded ? " AND " : "") . "($field LIKE " . '"%' . trim($token, '"') 
		. '" OR ' . "$field LIKE " . '"' . trim($token, '"') . '%")'; $connNeeded = true; }
	    else { $sql = $sql . ($connNeeded ? " AND " : "") . "$field LIKE " . '"%' . $token . '%"'; $connNeeded = true; };
	    $token = strtok(",");
	}
	$sql = preg_replace('/(((and)|(or)|(not))+[ \(\),]*)+$/i', "", $sql);
	$sql = trim(trim($sql, "-"));
	if (!preg_match('/^\(.*\)$/', $sql)) { $sql = "(" . $sql . ")"; };
	printToConsole("text sql: $sql\n");
	return $sql;
    };

    function andInAString(string $sql, string $thingToAppend) {
	return $sql === "" ? $thingToAppend : ($sql . " AND " . $thingToAppend);
    }

    for ($i = 0; $i < count($data); $i++) {
	switch ($x = preg_replace('/\(s\)/', "s", $data[$i]['fieldtype'])) {
	    case "genre":    $ret = andInAString($ret, tripleSelect($x, $data[$i]['value'])); break;
	    case "year":     $ret = andInAString($ret, doubleBound($x, $data[$i]['value'])); break;
	    case "length":   $ret = andInAString($ret, doubleBound($x, $data[$i]['value'])); break;
	    case "imdb":     $ret = andInAString($ret, doubleBound($x, $data[$i]['value'])); break;
	    case "acclaim":  $ret = andInAString($ret, doubleBound($x, $data[$i]['value'])); break;
	    case "language": $ret = andInAString($ret, simpleSelect($x, $data[$i]['value'])); break;
	    case "result":   $fromuser = intval($data[$i]['value']); if ($fromuser >= 0 && $fromuser <= 50) $resultSize = $fromuser; break;
	    case "directors": $ret = andInAString($ret, textField($x, $data[$i]['value'])); break;
	    case "actors":    $ret = andInAString($ret, textField($x, $data[$i]['value'])); break;
	    case "writers":   $ret = andInAString($ret, textField($x, $data[$i]['value'])); break;
	    case "title":    $ret = andInAString($ret, textField($x, $data[$i]['value'])); break;
	    default: printToConsole("hit default: " . $x . "\n"); break;
	}
    }

    $ret = $ret . " ORDER BY RAND() LIMIT $resultSize";
    return $ret;
}

// MAIN FUNCTION
function main($grabber) {
    require '../vendor/autoload.php'; // Include the Composer autoloader

	    /* getting dotenv variables <= 08/15/23 15:53:24 */ 
    try {
	$dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '.env');
	$dotenv->load();
    } catch (Exception $e) {
	echo "error 39";
	return;
    }

	    /* setting up a sqli connection <= 08/11/23 11:49:25 */ 

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    try {
	$mysql = new mysqli($_ENV['SQL_HOST'], $_ENV['SQL_USERNAME'], $_ENV['SQL_PASSWORD'], $_ENV['SQL_DB']);
    } catch (Exception $e) {
	printToConsole("Error: " . $e->getMessage() . "\nMysqli error number: " . mysqli_connect_errno() . "\n");
	echo "error 827";
	return;
    }


    // Decode the JSON data into a PHP associative array
    $data = json_decode($grabber, true);

    if ($data === null) {
	// JSON parsing failed
	echo "error 829";
	return;
    } else if (checkFieldNames($data)) { 
	echo "query error: " . $grabber;
	return;
    }
	    /* error("Failed to parse JSON.", E_USER_ERROR); */
    $query = sqlQueryBuilder($data);

    /* printToConsole("query: " . $query . "\n"); */

    try {
	$stmt = $mysql->prepare("SELECT * FROM movies WHERE " . $query);
    } catch (Exception $e) {
	printToConsole("Error: " . $e->getMessage() . "\nMysqli error number: " . mysqli_errno($mysql) . "\nMysqli error: " . mysqli_error($mysql) . "\n");
	echo "input error (missing dropdown field or bad text syntax)";
	return;
    }

    /* $stmt->bind_param("s", $username); */ 
    $stmt->execute();
    $retob = $stmt->get_result();

    if (count($rows = $retob->fetch_all())) {
	$jsonRows = json_encode($rows);
	echo $jsonRows;
    } else {
	echo "no results";
    }

    return;

}

