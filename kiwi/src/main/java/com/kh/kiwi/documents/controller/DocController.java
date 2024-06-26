package com.kh.kiwi.documents.controller;

import com.kh.kiwi.documents.entity.Doc;
import com.kh.kiwi.documents.service.DocService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/docs")
public class DocController {

    private final DocService docService;

    public DocController(DocService docService) {
        this.docService = docService;
    }

    @GetMapping
    public List<Doc> selectAllList() {
        return docService.selectAllList();
    }

    @GetMapping("/{id}")
    public Doc getDocById(@PathVariable Long id) {
        return docService.getDocById(id);
    }

    @PostMapping
    public void addDoc(@RequestBody Doc doc) {
        docService.addDoc(doc);
    }

    @PutMapping("/{id}")
    public void updateDoc(@PathVariable Long id, @RequestBody Doc updatedDoc) {
        docService.updateDoc(id, updatedDoc);
    }

    @DeleteMapping("/{id}")
    public void deleteDoc(@PathVariable Long id) {
        docService.deleteDoc(id);
    }
}

