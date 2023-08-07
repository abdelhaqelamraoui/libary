<?php

declare(strict_types = 1);

namespace App\Controllers;

define('VIEWS_PATH', __DIR__ . '/../../views/');

use \App\Models\BookModel;

use function App\Helpers\echoJSONData;

class BookController {

  private BookModel $bookModel;

  public function __construct() {
    $this->bookModel = new BookModel();;
  }

  /* ************************ View methods *****************************/

  public function list() {
    $books = $this->bookModel->getBooks();
    echoJSONData($books);
    // echo "Hello from list";
  }

  public function edit($id) {
    $book = $this->bookModel->getBookById((int)$id);
    echoJSONData($book);
   
  }

  public function remove($id) {
    if($this->bookModel->deleteBook((int)$id)) {
      echo 'book has been deleted';
    }
  }

  public function count() {
    echoJSONData(['total' => $this->bookModel->getTotalOfBooks(),
                  'loaned' => $this->bookModel->getTotalOfLoanedBooks()]);
  }

  public function search(string $pattern) {
    $books = $this->bookModel->search($pattern);
    echoJSONData($books);
  }

  /* ************************ Model methods ****************************/

  public function addBook(string $title, string $author, string $loaner, string $notes): bool {
    return $this->bookModel->addBook($title, $author, $loaner, $notes);
  }


  public function updateBook(int $id, string $title, string $author, string $loaner, string $notes): bool {
    return $this->bookModel->updateBook($id, $title, $author, $loaner, $notes);
  }

  public function removeBook(int $id): bool {
    return $this->bookModel->deleteBook($id);
  }


}