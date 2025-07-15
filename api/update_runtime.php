<?php
header('Content-Type: application/json');

include("./db.php");

$sql = "UPDATE `bus` SET `runtime` = `runtime` + 1";
$stmt = $pdo->prepare($sql);
$updatedRows = $stmt->rowCount();