package lk.ijse.cmjd.researchtracker.project;

import lk.ijse.cmjd.researchtracker.user.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    public List<Project> getAllProjects() {
        return repository.findAll();
    }

    public Optional<Project> getProjectById(String id) {
        return repository.findById(id);
    }

    public Project createProject(Project project) {
        // Set current user as PI
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        project.setPi(currentUser);

        // Set default status if not provided
        if (project.getStatus() == null) {
            project.setStatus(Status.PLANNING);
        }

        return repository.save(project);
    }

    public Optional<Project> updateProject(String id, Project projectDetails) {
        return repository.findById(id).map(project -> {
            project.setTitle(projectDetails.getTitle());
            project.setSummary(projectDetails.getSummary());
            project.setStatus(projectDetails.getStatus() != null ? projectDetails.getStatus() : project.getStatus());  // Keep existing if not provided
            project.setPi(projectDetails.getPi() != null ? projectDetails.getPi() : project.getPi());  // Keep existing if not provided
            project.setTags(projectDetails.getTags());
            project.setStartDate(projectDetails.getStartDate());
            project.setEndDate(projectDetails.getEndDate());
            return repository.save(project);
        });
    }

    public Optional<Project> updateProjectStatus(String id, Status status) {
        return repository.findById(id).map(project -> {
            project.setStatus(status);
            return repository.save(project);
        });
    }

    public void deleteProject(String id) {
        repository.deleteById(id);
    }
}