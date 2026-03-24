package com.example.LibraryAPI.Repository;

import com.example.LibraryAPI.model.Book;
import com.example.LibraryAPI.model.Borrower;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends CrudRepository<Book, Integer> {

    Book findByIsbn(String isbn);

    List<Book> findByBorrower(Borrower borrower);
}
