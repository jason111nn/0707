<?php
include("db.php");

$mode = $_POST["mode"] ?? '';

switch ($mode) {
    case "route":
        $name = $_POST["name"];
        $stations_json = $_POST["stations"];
        $stations = json_decode($stations_json, true);

        $stmt = $pdo->prepare("INSERT INTO `route`(`name`) VALUES (:name)");
        $stmt->execute(['name' => $name]);

        $stmt = $pdo->prepare("INSERT INTO `routestation`(`stationId`, `routeId`, `arriving`, `staying`, `seq`) VALUES (:stationId, :routeId, :arriving, :staying, :seq)");

        foreach ($stations as $row) {
            $stmt->execute([
                'stationId' => $row['stationId'],
                'routeId'   => $name,
                'arriving'  => $row['arring'],
                'staying'   => $row['staying'],
                'seq'       => $row['seq']
            ]);
        }

        echo true;
        break;

    case "bus":
        $route = $_POST["route"] ?? '';
        $name = $_POST["name"] ?? '';
        $runtime = $_POST["runtime"] ?? '';
        
        $stmt = $pdo->prepare("INSERT INTO `bus`(`name`, `routeid`, `runtime`) VALUES (:name, :route, :runtime)");
        $stmt->execute([
            'name' => $name,
            'route' => $route,
            'runtime' => $runtime
        ]);
        
        echo true;
        break;
    case 'station':
        $name = $_POST["name"] ?? '';
        
        $stmt = $pdo->prepare("INSERT INTO `station`(`name`) VALUES (:name)");
        $stmt->execute(['name' => $name]);
        echo true;
        break;
    case "form":
        $name = $_POST["name"] ?? '';
        $email = $_POST["email"] ?? '';
        $route = $_POST["route"] ?? '';
        $note = $_POST["note"] ?? '';
        $stmt = $pdo->prepare("INSERT INTO `form`(`name`, `email`, `route`, `note`) VALUES (:name, :email, :route, :note)");
        $stmt->execute([
            'name' => $name,
            'email' => $email,
            'route' => $route,
            'note' => $note
        ]);
        echo true;
        break;
    default:
        echo false;
        break;
}
