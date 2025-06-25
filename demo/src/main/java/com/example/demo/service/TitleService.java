package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Title;
import com.example.demo.repository.TitleEditRepository;

@Service
public class TitleService {

    private final TitleEditRepository titleEditRepository;

    // Constructor injection is the recommended way to inject dependencies in Spring
    @Autowired
    public TitleService(TitleEditRepository titleEditRepository) {
        // Initialize the final field in the constructor
        this.titleEditRepository = titleEditRepository;
    }

    public Title findTitleById(Integer id) {
        // OptionalからTitleを取得、見つからない場合はnullを返す
        return titleEditRepository.findById(id).orElse(null);
    }
}
