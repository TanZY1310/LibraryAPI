package com.example.LibraryAPI.service;

import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LibraryService implements ILibraryService {

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
