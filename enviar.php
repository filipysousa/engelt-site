<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Apenas aceita POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'msg' => 'Método não permitido.']);
    exit;
}

// Destinatário
define('DESTINATARIO', 'engenharia@engeltengenharia.com.br');
define('ASSUNTO_PREFIXO', '[Site ENGELT] ');

// Sanitização
function limpar($valor) {
    return htmlspecialchars(strip_tags(trim($valor)), ENT_QUOTES, 'UTF-8');
}

$nome     = limpar($_POST['nome']     ?? '');
$empresa  = limpar($_POST['empresa']  ?? '');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefone = limpar($_POST['telefone'] ?? '');
$assunto  = limpar($_POST['assunto']  ?? 'Contato via site');
$mensagem = limpar($_POST['mensagem'] ?? '');

// Validação básica
if (!$nome || !$email || !$mensagem) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Preencha os campos obrigatórios.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'E-mail inválido.']);
    exit;
}

// Corpo do email
$corpo  = "Nova mensagem recebida pelo site da ENGELT Engenharia\n";
$corpo .= str_repeat('─', 50) . "\n\n";
$corpo .= "Nome:      $nome\n";
if ($empresa) $corpo .= "Empresa:   $empresa\n";
$corpo .= "E-mail:    $email\n";
if ($telefone) $corpo .= "Telefone:  $telefone\n";
$corpo .= "Assunto:   $assunto\n\n";
$corpo .= "Mensagem:\n$mensagem\n\n";
$corpo .= str_repeat('─', 50) . "\n";
$corpo .= "Enviado em: " . date('d/m/Y H:i:s') . "\n";

// Cabeçalhos do email
$headers  = "From: site@engeltengenharia.com.br\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$assunto_email = ASSUNTO_PREFIXO . $assunto;

$enviado = mail(DESTINATARIO, $assunto_email, $corpo, $headers);

if ($enviado) {
    echo json_encode(['ok' => true, 'msg' => 'Mensagem enviada com sucesso!']);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Erro ao enviar. Tente novamente ou ligue para (85) 3279-6330.']);
}
