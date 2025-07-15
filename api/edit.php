<?php
include("db.php");
$id = $_POST["id"] ?? '';
$mode = $_POST["mode"] ?? '';

switch ($mode) {
    case "route":
        $name = $_POST["name"] ?? '';
        $stations_json = $_POST["stations"];
        $stations = json_decode($stations_json, true);

        $stmt = $pdo->prepare("DELETE FROM `routestation` WHERE routeId = :id");
        $stmt->execute(['id' => $id]);

        $stmt = $pdo->prepare("UPDATE `route` SET `name` = :name WHERE id = :id");
        $stmt->execute(['name' => $name, 'id' => $id]);

        $stmt = $pdo->prepare("INSERT INTO `routestation`(`stationId`, `routeId`, `arriving`, `staying`, `seq`) VALUES (:stationId, :routeId, :arriving, :staying, :seq)");

        foreach ($stations as $row) {
            $stmt->execute([
                'stationId' => $row['stationId'],
                'routeId'   => $id,
                'arriving'  => $row['arring'],
                'staying'   => $row['staying'],
                'seq'       => $row['seq']
            ]);
        }

        echo true;
        break;
    case "bus":
        $id = $_POST["id"] ?? '';
        $runtime = $_POST["runtime"] ?? '';
        $stmt = $pdo->prepare("UPDATE `bus` SET `runtime` = :runtime WHERE id = :id");
        $stmt->execute(['runtime' => $runtime, 'id' => $id]);
        echo true;
        break;
    case "station":
        $id = $_POST["id"] ?? '';
        $name = $_POST["name"] ?? '';
        $stmt = $pdo->prepare("UPDATE `station` SET `name` = :name WHERE id = :id");
        $stmt->execute(['name' => $name, 'id' => $id]);
        echo true;
        break;

    default:
        echo false;
        break;
}
