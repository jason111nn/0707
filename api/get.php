<?php
    include("./db.php");

    $mode = $_GET["mode"] ?? '';
    $item = $_GET["item"] ?? '';
    $id = $_GET["id"] ?? '';
    if($id === ''){
        $stmt = $pdo->query("SELECT * FROM `$mode`");
    }else if($item === ''){
        $stmt = $pdo->query("SELECT * FROM `$mode` WHERE id = '$id'");
    }else{
        $stmt = $pdo->query("SELECT * FROM `$mode` WHERE `$item` = '$id'");
    }
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($_GET['mode'] == 'bus') {
        $sql = "SELECT bus.*, route.name as route_name FROM bus LEFT JOIN route ON bus.routeid = route.id";
        $result = $pdo->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode($data);