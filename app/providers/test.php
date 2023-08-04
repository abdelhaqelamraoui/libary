<?php

include 'DataProvider.php';
include 'MysqlDataProvider.php';
include '../database/Database.php';

use App\Providers\MysqlDataProvider;


$db = new MysqlDataProvider();

echo $db -> getTotalOfBooks();