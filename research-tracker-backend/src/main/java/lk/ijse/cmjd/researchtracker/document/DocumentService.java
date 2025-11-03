package lk.ijse.cmjd.researchtracker.document;

import lk.ijse.cmjd.researchtracker.project.Project;
import lk.ijse.cmjd.researchtracker.project.ProjectRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ProjectRepository projectRepository;

    public DocumentService(DocumentRepository documentRepository, ProjectRepository projectRepository) {
        this.documentRepository = documentRepository;
        this.projectRepository = projectRepository;
    }

    public List<Document> getDocumentsByProject(String projectId) {
        return documentRepository.findByProjectId(projectId);
    }

    public Optional<Document> getDocumentById(String id) {
        return documentRepository.findById(id);
    }

    public Document uploadDocument(String projectId, MultipartFile file, String title, String description) throws IOException {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new RuntimeException("Project not found");
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.isEmpty()) {
            contentType = "application/octet-stream";
        }

        Document document = Document.builder()
                .project(project.get())
                .title(title)
                .description(description)
                .fileName(file.getOriginalFilename())
                .contentType(contentType)
                .content(file.getBytes())
                .uploadedBy((lk.ijse.cmjd.researchtracker.user.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .build();

        return documentRepository.save(document);
    }

    public void deleteDocument(String id) {
        documentRepository.deleteById(id);
    }
}