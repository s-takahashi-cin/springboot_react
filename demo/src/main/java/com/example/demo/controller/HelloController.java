package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Contents;
import com.example.demo.entity.Title;
import com.example.demo.repository.ContentRepository;
import com.example.demo.repository.TitleRepository;
import com.example.demo.service.DataService;
import com.example.demo.service.TitleService;

@RestController
@CrossOrigin(origins = "*") 
public class HelloController {

    @Autowired
    private TitleRepository titleRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private DataService dataService;

    @Autowired
    private TitleService titleService;


    
    @GetMapping("/api")
    @ResponseBody
    public List<Title> getTitles(@RequestParam(required = false) Boolean deleted) {
        if (deleted != null && deleted) {
            // ゴミ箱のタイトルを返す
            return titleRepository.findByIsDeleted(true);
        } else {
            // 通常のタイトルを返す
            return titleRepository.findByIsDeleted(false);
        }
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

    @PutMapping("/titles/{id}")
    public ResponseEntity<Title> updateTitle(@PathVariable int id, @RequestBody Title title) {
        Title existingTitle = titleRepository.findById(id)

        .orElseThrow(() -> new IllegalArgumentException("Invalid title ID"));
        existingTitle.setTitle(title.getTitle()); // 新しいタイトルで更新
        titleRepository.save(existingTitle); // 更新を保存
        return ResponseEntity.ok(existingTitle);
    }


    @PostMapping("/contents")
    public Contents saveContents(@RequestBody Contents content ) {
        Title title = titleRepository.findById(content.getTitle().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid title ID"));
        content.setTitle(title);
        return contentRepository.save(content);
    }

    @DeleteMapping("/contents/{id}")
    public void deleteContent(@PathVariable int id) {
        contentRepository.deleteById(id);
    }

    @PutMapping("/contents/{id}/check")
    public ResponseEntity<Void> updateCheckState(@PathVariable int id, @RequestBody Map<String, Boolean> requestBody) {
        boolean isChecked = requestBody.get("checked");
        // コンテンツを取得
        Contents content = contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid content ID"));
    
        // チェック状態を更新
        content.setChecked(isChecked);
        contentRepository.save(content); // 更新された内容を保存
    
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/titles/{id}")
    public ResponseEntity<Void> deleteTitle(@PathVariable int id) {
        if (!titleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        titleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/titles/{id}/trash")
public ResponseEntity<Void> moveToTrash(@PathVariable int id) {
    Optional<Title> titleOpt = titleRepository.findById(id);
    if (!titleOpt.isPresent()) {
        return ResponseEntity.notFound().build();
    }
    Title title = titleOpt.get();
    title.setIsDeleted(true); // isDeleted フィールドをtrueにする
    titleRepository.save(title);
    return ResponseEntity.ok().build();
}
@PatchMapping("/titles/{id}/restore")
public ResponseEntity<Void> restoreTitle(@PathVariable int id) {
    Optional<Title> titleOpt = titleRepository.findById(id);
    if (!titleOpt.isPresent()) {
        return ResponseEntity.notFound().build();
    }
    Title title = titleOpt.get();
    title.setIsDeleted(false); // ← 復元する
    titleRepository.save(title);
    return ResponseEntity.ok().build();
}

}
