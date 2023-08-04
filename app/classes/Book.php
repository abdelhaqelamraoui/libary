<?php

declare(strict_types = 1);

namespace App\Classes;

class Book {
  public int $id;
  public string $title;
  public string $author;
  public string $loaner;
  public string $notes;
}