package com.example.LibraryAPI.Repository;

import com.example.LibraryAPI.model.Borrower;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BorrowerRepository extends CrudRepository<Borrower, Integer> {
    Borrower findByName(String name);
}
