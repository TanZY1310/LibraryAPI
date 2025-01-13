package com.example.LibraryAPI.service;

import com.example.LibraryAPI.model.Book;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LibraryService implements ILibraryService {

    @Override
    public Boolean validateTitleAuthor(Book bookFound, String title, String author) {

        if (bookFound.getTitle().equals(title) && bookFound.getAuthor().equals(author))  {
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }

    @Override
    public Boolean isISBNValid(String isbn) {

        isbn = isbn.replaceAll("-", "");

        // Check if it contains only digits and has a length of 10 or 13
        return isbn.matches("\\d{10}|\\d{13}");
    }

    @Override
    public Boolean isEmailValid(String email) {
        String regexPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(regexPattern);

        Matcher matcher = pattern.matcher(email);

        return matcher.matches();

    }
}
