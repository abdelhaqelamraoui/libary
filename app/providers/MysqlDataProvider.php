<?php

declare(strict_types = 1);


namespace App\Providers;


use App\Database\Database;
use App\Classes\Book;


class MysqlDataProvider extends DataProvider {

  private $db = null;

  function __construct() {
    $this->db = new Database();
  }

  function __destruct() {
    unset($this->db);
  }

    
  function getBooks(): array {
    return $this->db->query('SELECT * FROM books ORDER BY id DESC');
  }

  function getBookById(int $id): array {
    $res =  $this->db->query(
      'SELECT * FROM books WHERE id = ?',
      [$id]
    );
    return $res[0];
  }

  function getBooksByTitlePattern(string $pattern): array {
    return $this->db->query(
      'SELECT * FROM books WHERE title LIKE ?',
      ['%'.$pattern.'%']
    );
  }

  function getBooksByAuthorPattern(string $pattern): array {
    return $this->db->query(
      'SELECT * FROM books WHERE author LIKE ?',
      ['%'.$pattern.'%']
    );
  }

  function deleteBook(int $id): bool {
    return $this->db->execute(
      'DELETE FROM books WHERE id = ?',
      [$id]
    );
  }

  function addBook(string $title, string $author, string $loaner, string $notes): bool {
    return $this->db->execute(
      'INSERT INTO books(title, author, loaner, notes) VALUES(?, ?, ?, ?)',
      [$title, $author, $loaner, $notes]
    );
  }

  function updateBook(int $id, string $title, string $author, string $loaner, string $notes): bool {
    return $this->db->execute(
      'UPDATE books SET title = ?, author = ?, loaner = ?, notes = ? WHERE id = ?',
      [$title, $author, $loaner, $notes, $id]
    );
  }

  function close() {
    $this->db->disconnect();
  }

  function getTotalOfBooks(): int {
    $res =  $this->db->query("SELECT COUNT(id) FROM books;");
    return (int) $res[0];
  }

  function getTotalOfLoanedBooks(): int {
    $res =  $this->db->query("SELECT COUNT(id) FROM books WHERE loaner <> ''");
    return (int) $res[0];
  }
}