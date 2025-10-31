package lk.ijse.cmjd.researchtracker.document;

import lk.ijse.cmjd.researchtracker.project.Project;
import lk.ijse.cmjd.researchtracker.project.ProjectRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ProjectRepository projectRepository;
    private static final String UPLOAD_DIR = "uploads/";

    public DocumentService(DocumentRepository documentRepository, ProjectRepository projectRepository) {
        this.documentRepository = documentRepository;
        this.projectRepository = projectRepository;
        new File(UPLOAD_DIR).mkdirs();
    }

    public List<Document> getDocumentsByProject(String projectId) {
        return documentRepository.findByProjectId(projectId);
    }

    public Document uploadDocument(String projectId, MultipartFile file, String title, String description) throws IOException {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new RuntimeException("Project not found");
        }

        String filePath = UPLOAD_DIR + file.getOriginalFilename();
        file.transferTo(new File(filePath));

        Document document = Document.builder()
                .project(project.get())
                .title(title)
                .description(description)
                .urlOrPath(filePath)
                .uploadedBy((lk.ijse.cmjd.researchtracker.user.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .build();

        return documentRepository.save(document);
    }

    public void deleteDocument(String id) {
        Optional<Document> document = documentRepository.findById(id);
        document.ifPresent(doc -> {
            new File(doc.getUrlOrPath()).delete();
            documentRepository.deleteById(id);
        });
    }
}