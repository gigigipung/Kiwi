package com.kh.kiwi.documents.controller;

import com.kh.kiwi.documents.dto.DocDto;
import com.kh.kiwi.documents.service.DocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/docs")
public class DocController {
    @Autowired
    private final DocService docService;

    public DocController(DocService docService) {
        this.docService = docService;
    }

    @GetMapping
    public List<DocDto> getAllDocs() {
        return docService.getAllDocs();
    }

    @GetMapping("/{id}")
    public DocDto getDocById(@PathVariable Long id) {
        return docService.getDocById(id);
    }

    @PostMapping
    public void addDoc(@RequestBody DocDto docDTO) {
        docService.addDoc(docDTO);
    }

    @PutMapping("/{id}")
    public void updateDoc(@PathVariable Long id, @RequestBody DocDto updatedDocDTO) {
        docService.updateDoc(id, updatedDocDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteDoc(@PathVariable Long id) {
        docService.deleteDoc(id);
    }
}
