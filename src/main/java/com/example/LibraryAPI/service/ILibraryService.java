package com.example.LibraryAPI.service;

import com.example.LibraryAPI.model.Book;

import java.util.Optional;

public interface ILibraryService {

    Boolean validateTitleAuthor(Book bookFound, String title, String author);

    Boolean isISBNValid(String isbn);

    Boolean isEmailValid(String email);
}
