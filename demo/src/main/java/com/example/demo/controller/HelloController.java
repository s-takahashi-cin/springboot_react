package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Contents;
import com.example.demo.entity.Title;
import com.example.demo.repository.TitleRepository;
import com.example.demo.service.DataService;

@RestController
@CrossOrigin(origins = "*") 
public class HelloController {

    @Autowired
    private TitleRepository titleRepository;

    @Autowired
    private DataService dataService;

    
    @GetMapping("/api")
    @ResponseBody
    public List<Title> getTitles() {
        List<Title> titles = dataService.getAllTitles();
        System.out.println("バックエンドデータ取得: " + titles);
        return dataService.getAllTitles();
    }
    
    @GetMapping("/api/list")
    @ResponseBody
    public List<Contents> getContents(@RequestParam("title_id") int titleId) {
        return dataService.getContentsByTitleId(titleId);
    }

    @PostMapping("/titles")
    public Title saveTitle(@RequestBody Title title) {
        return titleRepository.save(title);
    }
}
