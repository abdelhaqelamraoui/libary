<?php

declare(strict_types = 1);

namespace App\Models;

use App\Providers\MysqlDataProvider;
use App\Providers\DataProvider;
use App\Classes\Book;

class BookModel {

  private DataProvider $dp;

  function __construct() {
    $this->dp = new MysqlDataProvider();
  }

  function __destruct() {
    $this->dp->close();
    unset($this->dp);
  }

  function getBooks(): array {
    return $this->dp->getBooks();
  }

  function getBookById(int $id): array {
    return $this->dp->getBookById($id);
  }

  function getBooksByTitlePattern(string $pattern): array {
    return $this->dp->getBooksByTitlePattern($pattern);
  }

  function getBooksByAuthorPattern(string $pattern): array {
    return $this->dp->getBooksByAuthorPattern($pattern);
  }

  function deleteBook(int $id): bool {
    return $this->dp->deleteBook($id);
  }

  function addBook(string $title, string $author, string $loaner, string $notes): bool {
    return $this->dp->addBook($title, $author, $loaner, $notes) ;
  }

  function updateBook(int $id, string $title, string $author, string $loaner, string $notes): bool {
    return $this->dp->updateBook($id,  $title, $author, $loaner, $notes);
  }

  function getTotalOfBooks(): int {
    return $this->dp->getTotalOfBooks();
  }

  function getTotalOfLoanedBooks(): int {
    return $this->dp->getTotalOfLoanedBooks();
  }

}