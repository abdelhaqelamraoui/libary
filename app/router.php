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
    $arg = $arrArgs[1] ?? false;
    
    if($arg === false) {
      $bookController->$action();
    } else {
      $bookController->$action($arg);

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

  if(isset($_POST['csv'])) {

    $tmpName = $_FILES['csv-file']['tmp_name'];

    $lines = file($tmpName);

    foreach($lines as $line) {

      $line = str_replace('،', ',', $line); // replacing the arabic comma for getting csv format
      $rowData = str_getcsv($line);

      if(empty($rowData[0])) {
          continue;
        }
        
      $title = trim($rowData[0]);
      $auhtor = trim($rowData[1] ?? '');
      $loaner = trim($rowData[2] ?? '');
      $notes = trim($rowData[3] ?? '');
      $bookController->addBook($title, $auhtor, $loaner, $notes);

    }
    
  }


} // is_post

