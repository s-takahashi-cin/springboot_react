package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Title;

public interface TitleRepository extends JpaRepository<Title, Integer> {
    List<Title> findByIsDeleted(boolean isDeleted);
}
