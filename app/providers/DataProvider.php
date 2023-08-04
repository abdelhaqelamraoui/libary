<?php

declare(strict_types = 1);

namespace App\Providers;

use App\Classes\Book;


abstract class DataProvider {

  abstract function getBooks() : array;
  abstract function getBookById(int $id): array;
  abstract function getBooksByTitlePattern(string $pattern): array;
  abstract function getBooksByAuthorPattern(string $pattern): array;
  abstract function deleteBook(int $id): bool;
  abstract function addBook(string $title, string $author, string $loaner, string $notes): bool;
  abstract function updateBook(int $id, string $title, string $author, string $loaner, string $notes): bool;
  abstract function close();

  abstract function getTotalOfBooks(): int;
  abstract function getTotalOfLoanedBooks(): int;
 
}