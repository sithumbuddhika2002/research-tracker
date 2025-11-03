package lk.ijse.cmjd.researchtracker.document;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

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

    @GetMapping("/api/documents/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable String id) {
        Optional<Document> docOpt = service.getDocumentById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Document doc = docOpt.get();
        if (doc.getContent() == null || doc.getContent().length == 0) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(doc.getContentType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .body(doc.getContent());
    }

    @DeleteMapping("/api/documents/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI')")
    public ResponseEntity<Void> deleteDocument(@PathVariable String id) {
        service.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}