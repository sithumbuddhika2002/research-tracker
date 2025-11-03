package lk.ijse.cmjd.researchtracker.milestone;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class MilestoneController {

    private final MilestoneService service;

    public MilestoneController(MilestoneService service) {
        this.service = service;
    }

    @GetMapping("/api/projects/{id}/milestones")
    public List<Milestone> getMilestonesByProject(@PathVariable String id) {
        return service.getMilestonesByProject(id);
    }

    @PostMapping("/api/projects/{id}/milestones")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI', 'MEMBER')")
    public Milestone addMilestone(@PathVariable String id, @RequestBody Milestone milestone) {
        return service.addMilestone(id, milestone);
    }

    @PutMapping("/api/milestones/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI', 'MEMBER')")
    public ResponseEntity<Milestone> updateMilestone(@PathVariable String id, @RequestBody UpdateMilestoneRequest request) {
        Optional<Milestone> updatedMilestone = service.updateMilestone(id, request);
        return updatedMilestone.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/milestones/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI', 'MEMBER')")
    public ResponseEntity<Void> deleteMilestone(@PathVariable String id) {
        service.deleteMilestone(id);
        return ResponseEntity.noContent().build();
    }
}