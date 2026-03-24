package com.example.LibraryAPI.service;

public interface ILibraryService {

    Boolean isISBNValid(String isbn);

    Boolean isEmailValid(String email);
}
