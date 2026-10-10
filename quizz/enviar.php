<?php
/**
 * Relay do quiz A Alavanca. O navegador chama este arquivo (mesma origem),
 * ele guarda a chave e encaminha pro Control com o header X-Api-Key.
 * Reusa a config da /aplicacao (mesma chave e mesmo endpoint /api/webhooks/leads).
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin  = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed = array('https://ednaldohenper.com.br', 'https://www.ednaldohenper.com.br');
if (in_array($origin, $allowed, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405); echo json_encode(array('success' => false, 'error' => 'method')); exit;
}

// Config: usa /quizz/config.php se existir; senao reusa a da /aplicacao.
$cfg = is_file(__DIR__ . '/config.php') ? __DIR__ . '/config.php' : __DIR__ . '/../aplicacao/config.php';
if (!is_file($cfg)) {
  http_response_code(500); echo json_encode(array('success' => false, 'error' => 'config_missing')); exit;
}
require $cfg; // CONTROL_URL + CONTROL_API_KEY
if (!defined('CONTROL_URL') || !defined('CONTROL_API_KEY') || CONTROL_API_KEY === '') {
  http_response_code(500); echo json_encode(array('success' => false, 'error' => 'config_invalid')); exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) { http_response_code(400); echo json_encode(array('success' => false, 'error' => 'json')); exit; }

$nome = isset($data['nome']) ? trim($data['nome']) : '';
$zap  = preg_replace('/\D/', '', isset($data['whatsapp']) ? $data['whatsapp'] : '');
if ($nome === '' || strlen($zap) < 10) {
  http_response_code(422); echo json_encode(array('success' => false, 'error' => 'campos')); exit;
}
$data['whatsapp'] = $zap;
if (!isset($data['origem']) || $data['origem'] === '') $data['origem'] = 'quiz-alavanca';
$data['data_envio'] = gmdate('c');
$data['ip']         = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
$data['user_agent'] = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';

$ch = curl_init(CONTROL_URL);
curl_setopt_array($ch, array(
  CURLOPT_POST           => true,
  CURLOPT_POSTFIELDS     => json_encode($data, JSON_UNESCAPED_UNICODE),
  CURLOPT_HTTPHEADER     => array('Content-Type: application/json', 'X-Api-Key: ' . CONTROL_API_KEY),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT        => 8,
  CURLOPT_CONNECTTIMEOUT => 4,
));
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err  = curl_error($ch);
curl_close($ch);

if ($resp === false) {
  http_response_code(502);
  echo json_encode(array('success' => false, 'error' => 'upstream', 'detail' => $err));
  exit;
}
http_response_code($code ? $code : 502);
echo $resp;
