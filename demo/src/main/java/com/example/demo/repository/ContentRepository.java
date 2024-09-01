package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Contents;

public interface ContentRepository extends JpaRepository<Contents, Integer> {
    List<Contents> findByTitleId(int titleId);
}
