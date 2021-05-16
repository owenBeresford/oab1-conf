<?php
// https://stackoverflow.com/questions/10617552/swiftmailer-does-not-send-mail-why
$recipient="";
$sender="";
$subject="";
$textBody="";


$message = Swift_Message::newInstance();
$message->setSubject( $subject);
$message->setTo( $recipient );
$message->setFrom( $sender);
$message->setBody($emailBody );

$transport = Swift_MailTransport::newInstance();
$mailer = Swift_Mailer::newInstance($transport);

// *****
$logger = new Swift_Plugins_Loggers_EchoLogger();
$mailer->registerPlugin(new Swift_Plugins_LoggerPlugin($logger));
// *****

$result = $mailer->send($message, $failures);
var_dump($failures);


