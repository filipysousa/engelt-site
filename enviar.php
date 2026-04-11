<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'msg' => 'Método não permitido.']);
    exit;
}

function limpar($valor) {
    return htmlspecialchars(strip_tags(trim($valor)), ENT_QUOTES, 'UTF-8');
}

$nome     = limpar($_POST['nome']     ?? '');
$empresa  = limpar($_POST['empresa']  ?? '');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefone = limpar($_POST['telefone'] ?? '');
$assunto  = limpar($_POST['assunto']  ?? 'Contato via site');
$mensagem = limpar($_POST['mensagem'] ?? '');

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

$corpo  = "Nova mensagem recebida pelo site da ENGELT Engenharia\n";
$corpo .= str_repeat('-', 50) . "\n\n";
$corpo .= "Nome:      $nome\n";
if ($empresa) $corpo .= "Empresa:   $empresa\n";
$corpo .= "E-mail:    $email\n";
if ($telefone) $corpo .= "Telefone:  $telefone\n";
$corpo .= "Assunto:   $assunto\n\n";
$corpo .= "Mensagem:\n$mensagem\n\n";
$corpo .= str_repeat('-', 50) . "\n";
$corpo .= "Enviado em: " . date('d/m/Y H:i:s') . "\n";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtps.uhserver.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'sabrina@engeltengenharia.com.br';
    $mail->Password   = 'se484848se';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom('sabrina@engeltengenharia.com.br', 'ENGELT Engenharia');
    $mail->addAddress('engenharia@engeltengenharia.com.br', 'ENGELT Engenharia');
    $mail->addReplyTo($email, $nome);

    $mail->Subject = '[Site ENGELT] ' . $assunto;
    $mail->Body    = $corpo;

    $mail->send();
    echo json_encode(['ok' => true, 'msg' => 'Mensagem enviada com sucesso!']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Erro: ' . $mail->ErrorInfo]);
}
