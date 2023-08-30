<?php
trait ErrorAndResponse {
    private function handleError(string $message) {
	error_log($message, 3, __DIR__ . ".errors.log");
	echo $this->response(false, $message);
    }

    private function response(bool $success, string $message): string {
	$json = json_encode(['success' => $success, 'message' => $message]);
	if ($json) return $json; 
	else trigger_error("Problem converting response to json!");
    }
}
