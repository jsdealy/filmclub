<?php
trait ErrorAndResponse {
    private function handleError(string $message) {
	/* TODO: need to figure this out <= 08/25/23 19:57:32 */ 
	echo $this->response(false, $message);
    }

    private function response(bool $success, string $message): string {
	$json = json_encode(['success' => $success, 'message' => $message]);
	if ($json) return $json; 
	else trigger_error("Problem converting response to json!");
    }
}
