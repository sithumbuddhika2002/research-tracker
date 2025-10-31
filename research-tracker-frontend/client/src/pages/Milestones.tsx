import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { api } from '@/lib/api';
import { Milestone, CreateMilestoneRequest, Project } from '@/lib/types';
import { format, isPast } from 'date-fns';
import { UserRole } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export default function Milestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMilestoneRequest>({
    title: '',
    description: '',
    dueDate: '',
  });
  const { hasRole } = useAuth();

  // Fetch projects first
  const fetchProjects = async () => {
    try {
      const response = await api.get<Project[]>('/projects');
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProjectId(response.data[0].id);
      }
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to fetch projects');
    }
  };

  // Fetch milestones for selected project
  const fetchMilestones = async () => {
    if (!selectedProjectId) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get<Milestone[]>(`/projects/${selectedProjectId}/milestones`);
      setMilestones(response.data);
    } catch (error: any) {
      console.error('Failed to fetch milestones:', error);
      setMilestones([]);
      // Don't show error toast if endpoint doesn't exist - just show empty state
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch milestones');
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch milestones when project changes
  useEffect(() => {
    fetchMilestones();
  }, [selectedProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate || !selectedProjectId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/projects/${selectedProjectId}/milestones/${editingId}`, formData);
        toast.success('Milestone updated successfully');
      } else {
        await api.post(`/projects/${selectedProjectId}/milestones`, formData);
        toast.success('Milestone created successfully');
      }
      setDialogOpen(false);
      setFormData({ title: '', description: '', dueDate: '' });
      setEditingId(null);
      fetchMilestones();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save milestone');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await api.delete(`/projects/${selectedProjectId}/milestones/${id}`);
      toast.success('Milestone deleted successfully');
      fetchMilestones();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete milestone');
    }
  };

  const handleToggleComplete = async (milestone: Milestone) => {
    try {
      await api.put(`/projects/${selectedProjectId}/milestones/${milestone.id}`, {
        isCompleted: !milestone.isCompleted,
      });
      toast.success('Milestone updated successfully');
      fetchMilestones();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update milestone');
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setFormData({
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate,
    });
    setEditingId(milestone.id);
    setDialogOpen(true);
  };

  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-8 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Milestones</h1>
                <p className="text-muted-foreground">Track project milestones and deliverables</p>
              </div>
              {hasRole([UserRole.ADMIN, UserRole.PI]) && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus size={20} />
                      New Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingId ? 'Edit Milestone' : 'Create New Milestone'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Project</label>
                        <select
                          value={selectedProjectId}
                          onChange={(e) => setSelectedProjectId(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          placeholder="Milestone title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Input
                          placeholder="Milestone description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Due Date</label>
                        <Input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {editingId ? 'Update' : 'Create'} Milestone
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </motion.div>

          {/* Project Selector */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium mb-2">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Timeline View */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : sortedMilestones.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="mx-auto text-muted-foreground mb-2" size={48} />
              <p className="text-muted-foreground text-lg">No milestones found</p>
              {hasRole([UserRole.ADMIN, UserRole.PI]) && (
                <p className="text-muted-foreground text-sm mt-2">Create your first milestone to get started</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {sortedMilestones.map((milestone, index) => {
                const isOverdue = isPast(new Date(milestone.dueDate)) && !milestone.isCompleted;
                const isUpcoming = !isPast(new Date(milestone.dueDate)) && !milestone.isCompleted;

                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`p-6 border-l-4 ${
                      milestone.isCompleted
                        ? 'border-l-green-500 bg-green-50/30'
                        : isOverdue
                        ? 'border-l-destructive bg-destructive/5'
                        : isUpcoming
                        ? 'border-l-primary bg-primary/5'
                        : 'border-l-muted'
                    }`}>
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggleComplete(milestone)}
                          className="mt-1 flex-shrink-0"
                        >
                          {milestone.isCompleted ? (
                            <CheckCircle2 className="text-green-500" size={24} />
                          ) : (
                            <Circle className="text-muted-foreground hover:text-primary transition-colors" size={24} />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-lg ${
                            milestone.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}>
                            {milestone.title}
                          </h3>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3 text-sm">
                            <Calendar size={16} className="text-muted-foreground" />
                            <span className={isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                              {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}
                              {isOverdue && ' (Overdue)'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          {hasRole([UserRole.ADMIN, UserRole.PI]) && !milestone.isCompleted && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(milestone)}
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(milestone.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
