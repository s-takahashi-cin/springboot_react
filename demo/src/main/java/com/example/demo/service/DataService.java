package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Contents;
import com.example.demo.entity.Title;
import com.example.demo.repository.ContentRepository;
import com.example.demo.repository.TitleRepository;

@Service
public class DataService {

    @Autowired
    private TitleRepository titleRepository;

    @Autowired
    private ContentRepository contentRepository;

    public List<Title> getAllTitles() {
        return titleRepository.findAll();
    }

    public List<Contents> getContentsByTitleId(int titleId) {
        return contentRepository.findAll().stream()
            .filter(content -> content.getTitle().getId() == titleId)
            .toList();
    }
}
