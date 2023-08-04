<?php

declare(strict_types = 1);

namespace App\Database;


include('../app/classes/Book.php');

use App\Classes\Book as Book;

const HOSTNAME = 'localhost';
const PORT = 3306;
const DBNAME = 'local_libary';
const USERNAME = 'root';
const PASSWORD =   'root';




use \PDO as PDO;

class Database {

  private PDO $conn;

  function __construct() {
    $this->connect();
  }

  function __destruct() {
    $this->disconnect();
  }

  function init() {
    $sql = <<<TXT
    CREATE DATABASE IF NOT EXISTS local_libary;
    USE local_libary;

    CREATE TABLE IF NOT EXISTS books (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      loaner VARCHAR(255),
      notes VARCHAR(255)
    );
    TXT;

    if(!$this->isConnected()) $this->connect();
    if($this->isConnected()) $this->execute($sql);
    $this->disconnect();
  }

  private function connect() {
    $dsn = sprintf("mysql: host=%s; port=%d; dbname=%s", HOSTNAME, PORT, DBNAME);
    $this->conn = new PDO($dsn, USERNAME, PASSWORD);
  }

  function isConnected(): bool {
    return !is_null($this->conn);
  }

  function disconnect() {
    unset($this->conn);
  }

  function execute(string $sql, ?array $params = null): bool {
    $stmt = $this->conn->prepare($sql);
    return $stmt->execute($params);
  }

  function query(string $sql, ?array $params = null, int $mode = \PDO::FETCH_ASSOC, ?string $class = null): array | false {
    $stmt = $this->conn->prepare($sql);
    $stmt->execute($params);
    $res = ($class === null) ? $stmt->fetchAll($mode) : $stmt->fetchAll($mode, $class);
    $stmt->closeCursor();
    return $res;
  }


  
}
