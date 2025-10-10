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

        //Check for duplicate email or name
        Borrower borrowerByEmail = borrowerRepository.findByEmail(email);
        if (borrowerByEmail != null) {
            return ResponseEntity.badRequest().body("Email has been registered");
        }

        Borrower borrowerByName = borrowerRepository.findByName(name);
        if (borrowerByName != null) {
            return ResponseEntity.badRequest().body("Name has been registered");
        }

        Borrower borrower = new Borrower();
        borrower.setName(name);
        borrower.setEmail(email);
        borrowerRepository.save(borrower);
        return ResponseEntity.ok().body("New Borrower registered");
    }

    @GetMapping(path="/borrower/get")
    public ResponseEntity<?> getBorrower(@RequestParam(required = false) String name) {
        try {
            Borrower borrower = borrowerRepository.findByName(name);
            if (borrower == null) {
                return ResponseEntity.badRequest().body("Borrower not found");
            }
            return ResponseEntity.ok().body(borrower);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing get request");
        }
    }

    @PostMapping(path="/updateBorrower")
    public ResponseEntity<String> updateBorrower(@RequestParam(required = false) String originalName, @RequestParam(required = false) String originalEmail,
                                                 @RequestParam(required = false) String newName, @RequestParam(required = false) String newEmail) {
        try {
            Borrower borrower = borrowerRepository.findByName(originalName);
            if (borrower == null) {
                return ResponseEntity.badRequest().body("Borrower not found");
            }

            //If newName or newEmail is empty, do not update that field
            if (StringUtils.isEmpty(newName) && StringUtils.isEmpty(newEmail)) {
                return ResponseEntity.badRequest().body("No new information provided for update");
            }

            if (!StringUtils.isEmpty(newName) && newName.equals(originalName) && !StringUtils.isEmpty(newEmail) && newEmail.equals(originalEmail)) {
                return ResponseEntity.badRequest().body("No changes detected");
            }

            //New name or email is found in the system and is not the same borrower
            if (!StringUtils.isEmpty(newName)) {
                Borrower borrowerByName = borrowerRepository.findByName(newName);
                if (borrowerByName != null && !borrowerByName.getEmail().equals(originalEmail)) {
                    return ResponseEntity.badRequest().body("Name has been used");
                }
                borrower.setName(newName);
            } else if (!StringUtils.isEmpty(newEmail)) {
                //Email validation
                Boolean isEmailValid = libraryService.isEmailValid(newEmail);
                if (!isEmailValid) {
                    return ResponseEntity.badRequest().body("Email invalid");
                }

                Borrower borrowerByEmail = borrowerRepository.findByEmail(newEmail);
                if (borrowerByEmail != null && !borrowerByEmail.getName().equals(originalName)) {
                    return ResponseEntity.badRequest().body("Email has been used");
                }
                borrower.setEmail(newEmail);
            } else if (!StringUtils.isEmpty(newName) && !StringUtils.isEmpty(newEmail)) {
                //Email validation
                Boolean isEmailValid = libraryService.isEmailValid(newEmail);
                if (!isEmailValid) {
                    return ResponseEntity.badRequest().body("Email invalid");
                }

                Borrower borrowerByName = borrowerRepository.findByName(newName);
                if (borrowerByName != null && !borrowerByName.getEmail().equals(originalEmail)) {
                    return ResponseEntity.badRequest().body("Name has been used");
                }

                Borrower borrowerByEmail = borrowerRepository.findByEmail(newEmail);
                if (borrowerByEmail != null && !borrowerByEmail.getName().equals(originalName)) {
                    return ResponseEntity.badRequest().body("Email has been used");
                }
                borrower.setName(newName);
                borrower.setEmail(newEmail);
            }

            borrowerRepository.save(borrower);
            return ResponseEntity.ok().body("Borrower updated");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing update request");
        }
    }

    @PostMapping(path="/deleteBorrower")
    public ResponseEntity<String> deleteBorrower(@RequestParam(required = false) String name) {
        try {
            Borrower borrower = borrowerRepository.findByName(name);
            if (borrower == null) {
                return ResponseEntity.badRequest().body("Borrower not found");
            }

            List<Book> borrowedBooks = bookRepository.findByBorrower(borrower);
            if (!CollectionUtils.isEmpty(borrowedBooks)) {
                return ResponseEntity.badRequest().body("Cannot delete borrower with borrowed books");
            }
            borrowerRepository.delete(borrower);

            return ResponseEntity.ok().body("Borrower deleted");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing delete request");
        }
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

        Book bookByIsbn = bookRepository.findByIsbn(isbn);
        if (bookByIsbn != null) {
            return ResponseEntity.badRequest().body("Same ISBN already registered");
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

    @PostMapping(path="/deleteBook")
    public ResponseEntity<String> deleteBook(@RequestParam(required = false) String isbn) {
        try {
            Book bookByIsbn = bookRepository.findByIsbn(isbn);
            if (bookByIsbn == null) {
                return ResponseEntity.badRequest().body("Book not found");
            }
            if (bookByIsbn.getBorrowed().equals(Boolean.TRUE)) {
                return ResponseEntity.badRequest().body("Cannot delete a borrowed book");
            }
            bookRepository.delete(bookByIsbn);
            return ResponseEntity.ok().body("Book deleted");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing delete request");
        }
    }


    //Get a list of all the books in the library
    @GetMapping(path = "/book/all")
    public @ResponseBody Iterable<Book> displayAllBooks() {
        return bookRepository.findAll();
    }

    @PostMapping(path = "/borrow")
    public ResponseEntity<String> borrowBook(@RequestParam(required = false) String isbn, @RequestParam(required = false) String borrowerName) {

        try{
            if (StringUtils.isEmpty(isbn) || StringUtils.isEmpty(borrowerName)) {
                return ResponseEntity.badRequest().body("Please fill in all necessary information");
            }

            Borrower borrower = borrowerRepository.findByName(borrowerName);
            if (borrower == null) {
                return ResponseEntity.badRequest().body("Borrower is not registered in this library.");
            }

            Book bookByIsbn = bookRepository.findByIsbn(isbn);
            if (bookByIsbn == null) {
                return ResponseEntity.badRequest().body("Book not found.");
            }

            if (bookByIsbn.getBorrowed().equals(Boolean.TRUE)) {
                return ResponseEntity.badRequest().body("Book has been borrowed");
            }

            bookByIsbn.setBorrowed(Boolean.TRUE);
            bookByIsbn.setBorrower(borrower);
            bookRepository.save(bookByIsbn);
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

            Book bookByIsbn = bookRepository.findByIsbn(isbn);
            if (bookByIsbn == null) {
                return ResponseEntity.badRequest().body("Book not found.");
            }

            if (bookByIsbn.getBorrowed().equals(Boolean.FALSE)) {
                return ResponseEntity.badRequest().body("Book is not currently borrowed.");
            }

            bookByIsbn.setBorrowed(Boolean.FALSE);
            bookByIsbn.setBorrower(null);
            bookRepository.save(bookByIsbn);
            return ResponseEntity.ok("Book returned successfully.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing return request");
        }
    }
}
