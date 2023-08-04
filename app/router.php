<?php


declare(strict_types = 1);

namespace App;


require_once '../app/helpers/functions.php';
require_once '../app/controllers/BookController.php';
require_once '../app/models/BookModel.php';
require_once '../app/providers/DataProvider.php';
require_once '../app/providers/MysqlDataProvider.php';
require_once '../app/database/Database.php';

use App\Controllers\BookController;

use function App\Helpers\is_get;
use function App\Helpers\is_post;
use function App\Helpers\prettyPrint;

$bookController = new BookController();


if(is_get()) {

  ob_clean();
  
  $args = $_GET['action'] ?? false;
  if($args) {
    $arrArgs = explode('/', $args);
    $action = $arrArgs[0];
    $id = $arrArgs[1] ?? false;
    
    if($id === false) {
      $bookController->$action();
    } else {
      $bookController->$action((int) $id);

    }

  } else {
    $bookController->list();

  }
}


if(is_post()) {
  
  if(isset($_POST['add'])) {
    echo 'inside';
    $title = $_POST['title'];
    $author = $_POST['author'];
    $loaner = $_POST['loaner'];
    $notes = $_POST['notes'];


    if($bookController->addBook($title, $author, $loaner, $notes)) {
      // $bookController->list();
      ob_clean();
      echo 'book has een added';
    }
  }

  if(isset($_POST['confirm'])) {
    $id = (int) $_POST['id'];
    if($bookController->removeBook($id)) {
      $bookController->list();
    }
  }
  
  if(isset($_POST['cancel'])) {
    $bookController->list();
  }

  if(isset($_POST['update'])) {
    $id = (int) $_POST['id'];
    $title = $_POST['title'];
    $author = $_POST['author'];
    $loaner = $_POST['loaner'];
    $notes = $_POST['notes'];

    if($bookController->updateBook($id, $title, $author, $loaner, $notes)) {
      $bookController->list();
    }
  }
}

