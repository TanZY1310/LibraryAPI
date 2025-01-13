package com.example.LibraryAPI.Repository;

import com.example.LibraryAPI.model.Book;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends CrudRepository<Book, Integer> {

    List<Book> findByIsbn(String isbn);
}
