<?php
   $dsn = "mysql:host=localhost;charset=utf8;dbname=manage";
   $pdo = new PDO($dsn,"admin","1234");
   header('Content-Type: application/json');
