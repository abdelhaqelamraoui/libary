<?php

declare(strict_types = 1);

namespace App\Helpers;


function is_post(): bool{
  return $_SERVER['REQUEST_METHOD'] === 'POST';
}

function is_get(): bool {
  return $_SERVER['REQUEST_METHOD'] === 'GET';
}

function prettyPrint($val, bool $dump = false) {

  echo '<pre>';
  if($dump === true) {
    var_dump($val);
  } else {
    print_r($val);
  }
  echo '</pre>';
}


function echoJSONData(array $data) {
  ob_clean();
  header('Content-Type: application/json');
  echo json_encode($data);
}