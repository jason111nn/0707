<?php
include("db.php");
$mode = $_POST["mode"] ?? '';
$id = $_POST["id"] ?? '';
$id = intval($id);

switch ($mode) {
    case "route":
        $pdo->query("DELETE FROM `routestation` WHERE routeId = $id");
        $pdo->query("DELETE FROM `bus` WHERE routeid = $id");
        $pdo->query("DELETE FROM `route` WHERE id = $id");
        echo true;
        break;
    case "bus":
        $pdo->query("DELETE FROM `bus` WHERE id = $id");
        echo true;
        break;
    case "station":
        $pdo->query("DELETE FROM `routestation` WHERE routeId = $id");
        $pdo->query("DELETE FROM `station` WHERE id = $id");
        echo true;
        break;
    case "form":
        $pdo->query("DELETE FROM `form` WHERE id = $id");    
        echo true;
        break;
    default:
        echo false;
        break;
}
