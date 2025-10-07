package com.example.LibraryAPI.controller;

import com.example.LibraryAPI.Repository.BookRepository;
import com.example.LibraryAPI.Repository.BorrowerRepository;
import com.example.LibraryAPI.model.Book;
import com.example.LibraryAPI.model.Borrower;
import com.example.LibraryAPI.service.ILibraryService;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping(path="/library")
public class LibraryController {

    @Autowired
    private BorrowerRepository borrowerRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ILibraryService libraryService;

    //Register a new borrower to the library
    @PostMapping(path="/registerBorrower")
    public ResponseEntity<String> registerBorrower(@RequestParam(required = false) String name, @RequestParam(required = false) String email) {

        if (StringUtils.isEmpty(name) || StringUtils.isEmpty(email)) {
            return ResponseEntity.badRequest().body("Please fill in all necessary information");
        }

        //Email validation
        Boolean isEmailValid = libraryService.isEmailValid(email);

        if (!isEmailValid) {
            return ResponseEntity.badRequest().body("Email invalid");
        }

        Borrower borrower = new Borrower();
        borrower.setName(name);
        borrower.setEmail(email);
        borrowerRepository.save(borrower);
        displayAllBorrowers();
        return ResponseEntity.ok().body("New Borrower registered");
    }

    //Get a list of all the books in the library
    @GetMapping(path = "/borrower/all")
    public @ResponseBody Iterable<Borrower> displayAllBorrowers() {
        return borrowerRepository.findAll();
    }

    //Register a new book to the library
    @PostMapping(path="/registerBook")
    public ResponseEntity<String> registerBook(@RequestParam(required = false) String isbn, @RequestParam(required = false) String title,
                                               @RequestParam(required = false) String author) {

        if (StringUtils.isEmpty(isbn) || StringUtils.isEmpty(title) || StringUtils.isEmpty(author)) {
            return ResponseEntity.badRequest().body("Please fill in all necessary information");
        }

        Boolean isISBNValid = libraryService.isISBNValid(isbn);
        if (!isISBNValid) {
            return ResponseEntity.badRequest().body("ISBN invalid");
        }

        List<Book> bookList = bookRepository.findByIsbn(isbn);

        //Same title, same author, different isbn => different books
        //If isbn is the same, check if title and author is the same
        if (!CollectionUtils.isEmpty(bookList)) {
            Boolean isValid = libraryService.validateTitleAuthor(bookList.get(0), title, author);
            if (!isValid) {
                return ResponseEntity.badRequest().body("Same ISBN invalid info detected");
            }
        }

        Book book = new Book();
        book.setIsbn(isbn);
        book.setTitle(title);
        book.setAuthor(author);
        book.setBorrowed(Boolean.FALSE);
        book.setBorrower(null);
        bookRepository.save(book);

        return ResponseEntity.ok().body("New Book registered");
    }

    //Get a list of all the books in the library
    @GetMapping(path = "/book/all")
    public @ResponseBody Iterable<Book> displayAllBooks() {
        return bookRepository.findAll();
    }

    @PostMapping(path = "/borrow")
    public ResponseEntity<String> borrowBook(@RequestParam(required = false) String isbn, @RequestParam(required = false) String borrowerName) {

        // Add try-catch block to handle errors
        try{
            if (StringUtils.isEmpty(isbn) || StringUtils.isEmpty(borrowerName)) {
                return ResponseEntity.badRequest().body("Please fill in all necessary information");
            }

            Borrower borrower = borrowerRepository.findByName(borrowerName);
            if (borrower == null) {
                return ResponseEntity.badRequest().body("Borrower is not registered in this library.");
            }

            List<Book> bookList = bookRepository.findByIsbn(isbn);
            if (CollectionUtils.isEmpty(bookList)) {
                return ResponseEntity.badRequest().body("Book not found.");
            }

            Book book = null;
            //Loop to check through borrowed books and obtain book that is not borrowed
            for (Book eachBook : bookList) {
                if (eachBook.getBorrowed().equals(Boolean.FALSE)) {
                    book = eachBook;
                    break;
                }
            }

            if (book == null) {
                return ResponseEntity.badRequest().body("Book has been borrowed");
            }

            book.setBorrowed(Boolean.TRUE);
            book.setBorrower(borrower);
            bookRepository.save(book);
            return ResponseEntity.ok("Book borrowed successfully.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing borrow request");
        }

    }

    @PostMapping(path = "/return")
    public ResponseEntity<String> returnBook(@RequestParam(required = false) String isbn, @RequestParam(required = false) String borrowerName) {

        try {
            if (StringUtils.isEmpty(isbn) || StringUtils.isEmpty(borrowerName)) {
                return ResponseEntity.badRequest().body("Please fill in all necessary information");
            }

            Borrower borrower = borrowerRepository.findByName(borrowerName);
            if (borrower == null) {
                return ResponseEntity.badRequest().body("Borrower is not registered in this library.");
            }

            List<Book> bookList = bookRepository.findByIsbn(isbn);
            if (CollectionUtils.isEmpty(bookList)) {
                return ResponseEntity.badRequest().body("Book not found.");
            }

            Book book = null;
            for (Book eachBook : bookList) {
                if (eachBook.getBorrowed().equals(Boolean.TRUE)) {
                    book = eachBook;
                    break;
                }
            }
            if (book == null) {
                return ResponseEntity.badRequest().body("Unable to return book that is not borrowed.");
            }

            book.setBorrowed(Boolean.FALSE);
            book.setBorrower(null);
            bookRepository.save(book);
            return ResponseEntity.ok("Book returned successfully.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing return request");
        }
    }
}
