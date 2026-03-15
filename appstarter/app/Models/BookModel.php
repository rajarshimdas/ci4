<?php

namespace App\Models;

use CodeIgniter\Model;

class BookModel extends Model
{
    protected $table = 'books';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'title',
        'author_id',
        'year'
    ];

    public function withAuthorInfo()
    {
        return $this
            ->select('books.*, authors.name as author_name')
            ->join('authors', 'books.author_id = authors.id');
    }
}