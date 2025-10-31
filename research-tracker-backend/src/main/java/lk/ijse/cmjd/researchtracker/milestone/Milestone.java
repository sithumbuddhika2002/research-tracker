package lk.ijse.cmjd.researchtracker.milestone;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lk.ijse.cmjd.researchtracker.project.Project;
import lk.ijse.cmjd.researchtracker.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "milestones")
public class Milestone {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonIgnore  // Prevents infinite loop
    private Project project;

    private String title;

    private String description;

    private LocalDate dueDate;

    // FIXED: Renamed from isCompleted → completed
    private boolean completed;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    @JsonIgnore  // Prevents loop via User
    private User createdBy;

    @PrePersist
    public void prePersist() {
        id = java.util.UUID.randomUUID().toString();
    }
}