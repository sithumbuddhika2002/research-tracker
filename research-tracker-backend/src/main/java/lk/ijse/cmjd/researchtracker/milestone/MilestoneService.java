package lk.ijse.cmjd.researchtracker.milestone;

import lk.ijse.cmjd.researchtracker.project.Project;
import lk.ijse.cmjd.researchtracker.project.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;

    public MilestoneService(MilestoneRepository milestoneRepository, ProjectRepository projectRepository) {
        this.milestoneRepository = milestoneRepository;
        this.projectRepository = projectRepository;
    }

    public List<Milestone> getMilestonesByProject(String projectId) {
        return milestoneRepository.findByProjectId(projectId);
    }

    public Milestone addMilestone(String projectId, Milestone milestone) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
            milestone.setProject(project.get());
            return milestoneRepository.save(milestone);
        }
        throw new RuntimeException("Project not found");
    }

    public Optional<Milestone> updateMilestone(String id, Milestone milestoneDetails) {
        return milestoneRepository.findById(id).map(milestone -> {
            milestone.setTitle(milestoneDetails.getTitle());
            milestone.setDescription(milestoneDetails.getDescription());
            milestone.setDueDate(milestoneDetails.getDueDate());
            milestone.setCompleted(milestoneDetails.isCompleted());  // Now works!
            return milestoneRepository.save(milestone);
        });
    }

    public void deleteMilestone(String id) {
        milestoneRepository.deleteById(id);
    }
}