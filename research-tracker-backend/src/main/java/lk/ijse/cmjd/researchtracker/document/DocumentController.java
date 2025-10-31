package lk.ijse.cmjd.researchtracker.document;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class DocumentController {

    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    @GetMapping("/api/projects/{id}/documents")
    public List<Document> getDocumentsByProject(@PathVariable String id) {
        return service.getDocumentsByProject(id);
    }

    @PostMapping("/api/projects/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI', 'MEMBER')")
    public Document uploadDocument(@PathVariable String id, @RequestParam("file") MultipartFile file, @RequestParam("title") String title, @RequestParam("description") String description) throws IOException {
        return service.uploadDocument(id, file, title, description);
    }

    @DeleteMapping("/api/documents/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI')")
    public ResponseEntity<Void> deleteDocument(@PathVariable String id) {
        service.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}