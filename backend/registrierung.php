<?php
// Get secret passwords etc. 
// (The file `backend/secrets.php` is NOT in the git repository. It needs to be added manually!)
require 'secrets.php';

// Get parameters from the form
$titel = $_POST['titel'];
$vorname = $_POST['vorname'];
$nachname = $_POST['nachname'];
$email = $_POST['email'];

$body=" Name: $titel $vorname $nachname \n Email: $email";
$subject = "Neue Registrierung auf der Webseite von $vorname $nachname";

// Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'php_mailer/Exception.php';
require 'php_mailer/PHPMailer.php';
require 'php_mailer/SMTP.php';

$mail = new PHPMailer(true);

try {
  // Throw an error if origin isn't correct
  $url_whitelist = array("https://bioprojet.de", "http://bioprojet.de", "https://www.bioprojet.de", "http://www.bioprojet.de"); 
  $header_origin = $_SERVER['HTTP_ORIGIN'];
  if(!in_array($header_origin,$url_whitelist)){
    throw new Exception("False Origin! $header_origin");
  };

  // Try to send the email
  // $mail->SMTPDebug = SMTP::DEBUG_SERVER; // verbose response for debugging
  $mail->isSMTP();              
  $mail->SMTPAuth   = true; 
  $mail->SMTPSecure = 'tls'; // $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
  $mail->Port       = 587; // TCP port. Use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
  // $mail->isHTML(true); // Set email format to HTML
  
  $mail->Host       = $secret_host; // SMTP server
  $mail->Username   = $secret_username; // SMTP username
  $mail->Password   = $secret_password; // SMTP password
  
  $mail->setFrom($secret_sender_email, $secret_sender_name);
  $mail->addAddress($secret_recipient_email);
  
  $mail->Subject = $subject;
  $mail->Body    = $body;

  $mail->send();
  header('Location: https://bioprojet.de/danke-registrierung/');
  exit();
} catch (Exception $e) {
  // echo "Message could not be sent. \n $titel  , $vorname , $nachname , $email \n Error: {$mail->ErrorInfo} \n\n $e";
  header('Location: https://bioprojet.de/registrierung-fehlgeschlagen/');
  exit();
}