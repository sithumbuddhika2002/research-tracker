import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, FileText, Upload, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { Document, Project } from '@/lib/types';
import { format } from 'date-fns';
import { UserRole } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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

  // Fetch documents for selected project
  const fetchDocuments = async () => {
    if (!selectedProjectId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get<Document[]>(`/projects/${selectedProjectId}/documents`);
      setDocuments(response.data);
    } catch (error: any) {
      console.error('Failed to fetch documents:', error);
      setDocuments([]);
      // Don't show error toast if endpoint doesn't exist - just show empty state
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch documents');
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch documents when project changes
  useEffect(() => {
    fetchDocuments();
  }, [selectedProjectId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadFile || !formData.title || !selectedProjectId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', uploadFile);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      await api.post(`/projects/${selectedProjectId}/documents`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Document uploaded successfully');
      setDialogOpen(false);
      setUploadFile(null);
      setFormData({ title: '', description: '' });
      fetchDocuments();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await api.delete(`/documents/${id}`);
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    }
  };

const handleDownload = async (id: string, title: string) => {
  try {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const blob = new Blob([response.data], { type: contentType });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', title);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('Download error:', error);
    toast.error(error.response?.data?.message || 'Failed to download document');
  }
};

  const filteredDocuments = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Documents</h1>
                <p className="text-muted-foreground">Manage your research documents and files</p>
              </div>
              {hasRole([UserRole.ADMIN, UserRole.PI, UserRole.MEMBER]) && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus size={20} />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Document</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4">
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
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Input
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">File</label>
                        <Input
                          type="file"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      <Button type="submit" className="w-full gap-2">
                        <Upload size={16} />
                        Upload
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

          {/* Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Documents Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="mx-auto text-muted-foreground mb-2" size={48} />
              <p className="text-muted-foreground text-lg">No documents found</p>
              {hasRole([UserRole.ADMIN, UserRole.PI]) && (
                <p className="text-muted-foreground text-sm mt-2">Upload your first document to get started</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      <FileText className="text-primary flex-shrink-0 mt-1" size={24} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{doc.description}</p>
                      </div>
                    </div>

                    {doc.uploadedAt && (
                      <p className="text-xs text-muted-foreground mb-4">
                        Uploaded: {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                      </p>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.id, doc.title)}
                        className="flex-1"
                      >
                        <Download size={16} />
                        Download
                      </Button>
                      {hasRole([UserRole.ADMIN, UserRole.PI]) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}