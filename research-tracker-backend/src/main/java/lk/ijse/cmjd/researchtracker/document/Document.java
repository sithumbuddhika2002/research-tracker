package lk.ijse.cmjd.researchtracker.document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lk.ijse.cmjd.researchtracker.project.Project;
import lk.ijse.cmjd.researchtracker.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "documents")
public class Document {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonIgnore  // Prevents infinite loop
    private Project project;

    private String title;

    private String description;

    private String urlOrPath;

    @ManyToOne
    @JoinColumn(name = "uploaded_by_id")
    @JsonIgnore  // Prevents loop via User
    private User uploadedBy;

    private LocalDateTime uploadedAt;

    @PrePersist
    public void prePersist() {
        id = java.util.UUID.randomUUID().toString();
        uploadedAt = LocalDateTime.now();
    }
}