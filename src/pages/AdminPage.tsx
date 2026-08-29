import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, JournalEntry } from '../types';
import {
  Shield,
  Lock,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  FileText,
  FolderGit2,
  FileDown,
  Settings,
  ArrowLeft,
  Check,
  Upload,
  Eye,
  RefreshCw,
  ExternalLink,
  BarChart3,
  Cloud,
  CloudCheck,
} from 'lucide-react';

type Tab = 'projects' | 'journals' | 'metrics' | 'resume' | 'settings';

export const AdminPage: React.FC = () => {
  const {
    config,
    projects,
    journals,
    stats,
    updateConfig,
    addProject,
    updateProject,
    deleteProject,
    addJournal,
    updateJournal,
    deleteJournal,
    updateStat,
    updateResume,
    downloadResume,
    resetToDefaults,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isCloudSynced,
  } = usePortfolio();

  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [notification, setNotification] = useState<string | null>(null);

  // Project Modal Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    category: '',
    spanSize: 7 as 5 | 7 | 12,
    image: '',
    description: '',
    projectUrl: '',
    githubUrl: '',
    featured: true,
    tags: '',
    year: new Date().getFullYear().toString(),
  });

  // Journal Modal Form State
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [isJournalFormOpen, setIsJournalFormOpen] = useState(false);
  const [journalFormData, setJournalFormData] = useState({
    title: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    image: '',
    summary: '',
    content: '',
    tags: '',
  });

  // Resume State
  const [resumeUrlInput, setResumeUrlInput] = useState(config.resumeUrl);
  const [resumeFileNameInput, setResumeFileNameInput] = useState(config.resumeFileName);

  // Custom Deletion Confirmation State (Safe for iframe and mobile)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'project' | 'journal' | 'reset';
    id?: string;
    title: string;
  } | null>(null);

  // Profile Photo State
  const [profilePhotoInput, setProfilePhotoInput] = useState(config.profilePhoto || '');

  // Rotating Roles State
  const [rolesInput, setRolesInput] = useState(config.roles ? config.roles.join(', ') : '');
  const [newRoleTagInput, setNewRoleTagInput] = useState('');

  useEffect(() => {
    setRolesInput(config.roles ? config.roles.join(', ') : '');
  }, [config.roles]);

  const handleSaveRoles = (customString?: string) => {
    const stringToParse = customString !== undefined ? customString : rolesInput;
    const parsed = stringToParse
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);
    
    if (parsed.length > 0) {
      updateConfig({ roles: parsed });
      setRolesInput(parsed.join(', '));
      showNotification(`Saved ${parsed.length} rotating roles!`);
    } else {
      showNotification('Please provide at least one valid role.');
    }
  };

  const handleAddRoleTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newRoleTagInput.trim();
    if (!trimmed) return;
    const currentRoles = config.roles || [];
    if (currentRoles.includes(trimmed)) {
      showNotification('Role already exists');
      return;
    }
    const updated = [...currentRoles, trimmed];
    updateConfig({ roles: updated });
    setRolesInput(updated.join(', '));
    setNewRoleTagInput('');
    showNotification(`Added "${trimmed}" to rotating roles!`);
  };

  const handleRemoveRoleTag = (roleToRemove: string) => {
    const currentRoles = config.roles || [];
    const updated = currentRoles.filter((r) => r !== roleToRemove);
    if (updated.length === 0) {
      showNotification('Cannot remove all roles. At least one role is required.');
      return;
    }
    updateConfig({ roles: updated });
    setRolesInput(updated.join(', '));
    showNotification(`Removed "${roleToRemove}"`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConfirmDeleteAction = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'project' && deleteConfirm.id) {
      deleteProject(deleteConfirm.id);
      showNotification(`Deleted project "${deleteConfirm.title}"`);
    } else if (deleteConfirm.type === 'journal' && deleteConfirm.id) {
      deleteJournal(deleteConfirm.id);
      showNotification(`Deleted article "${deleteConfirm.title}"`);
    } else if (deleteConfirm.type === 'reset') {
      resetToDefaults();
      showNotification('Portfolio reset to initial dataset.');
    }
    setDeleteConfirm(null);
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateConfig({ profilePhoto: result });
        setProfilePhotoInput(result);
        showNotification('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === config.adminPasscode || passcode === 'admin123') {
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Default is "admin123"');
    }
  };

  // --- Projects Handlers ---
  const handleOpenProjectForm = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectFormData({
        title: project.title,
        category: project.category,
        spanSize: project.spanSize,
        image: project.image,
        description: project.description,
        projectUrl: project.projectUrl,
        githubUrl: project.githubUrl,
        featured: project.featured,
        tags: project.tags.join(', '),
        year: project.year,
      });
    } else {
      setEditingProject(null);
      setProjectFormData({
        title: '',
        category: 'Full-Stack',
        spanSize: 7,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        description: '',
        projectUrl: 'https://github.com/JBN0011',
        githubUrl: 'https://github.com/JBN0011',
        featured: true,
        tags: 'React, TypeScript, AI',
        year: new Date().getFullYear().toString(),
      });
    }
    setIsProjectFormOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = projectFormData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingProject) {
      updateProject(editingProject.id, {
        ...projectFormData,
        tags: tagsArray,
      });
      showNotification('Project updated successfully.');
    } else {
      addProject({
        ...projectFormData,
        tags: tagsArray,
      });
      showNotification('New project added successfully.');
    }
    setIsProjectFormOpen(false);
  };

  // --- Journals Handlers ---
  const handleOpenJournalForm = (journal?: JournalEntry) => {
    if (journal) {
      setEditingJournal(journal);
      setJournalFormData({
        title: journal.title,
        date: journal.date,
        readTime: journal.readTime,
        image: journal.image,
        summary: journal.summary,
        content: journal.content,
        tags: journal.tags ? journal.tags.join(', ') : '',
      });
    } else {
      setEditingJournal(null);
      setJournalFormData({
        title: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
        summary: '',
        content: '',
        tags: 'Engineering, Design',
      });
    }
    setIsJournalFormOpen(true);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = journalFormData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingJournal) {
      updateJournal(editingJournal.id, {
        ...journalFormData,
        tags: tagsArray,
      });
      showNotification('Journal entry updated.');
    } else {
      addJournal({
        ...journalFormData,
        tags: tagsArray,
      });
      showNotification('New journal entry published.');
    }
    setIsJournalFormOpen(false);
  };

  // --- Resume Upload Handler ---
  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateResume({ url: result, fileName: file.name });
        setResumeUrlInput(result);
        setResumeFileNameInput(file.name);
        showNotification(`Resume updated with ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveResumeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    updateResume({ url: resumeUrlInput, fileName: resumeFileNameInput });
    showNotification('Resume configuration saved.');
  };

  // If NOT authenticated, show simple black-and-white password protection screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 mx-auto mb-6">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-3xl font-display italic text-center text-white mb-2">
            Admin Access
          </h1>
          <p className="text-xs text-center text-[hsl(var(--muted))] font-mono mb-8">
            Enter authorized passcode to manage projects, writings, and resume.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                Passcode 
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white placeholder-white/20 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors text-sm"
              />
              {authError && (
                <p className="text-xs text-white/80 font-mono mt-2">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Authenticate Session</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[hsl(var(--stroke))] text-center">
            <Link
              to="/"
              className="text-xs font-mono text-[hsl(var(--muted))] hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--text))] pt-24 pb-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10">
        {/* Admin Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[hsl(var(--stroke))] mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-2xl font-display italic text-white leading-none">
                Content Management
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono text-[hsl(var(--muted))]">
                  Logged in as Admin • {config.name}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Firestore Cloud Live</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-full border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] text-white hover:bg-white hover:text-black transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>

            <button
              onClick={() => setIsAdminAuthenticated(false)}
              className="text-xs font-mono px-4 py-2 rounded-full border border-white/20 text-[hsl(var(--muted))] hover:text-white hover:border-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mb-6 p-4 rounded-xl bg-white text-black text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in">
            <Check className="w-4 h-4 text-black" />
            <span>{notification}</span>
          </div>
        )}

        {/* Admin Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tabs */}
          <div className="md:col-span-3 bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-2xl p-2 space-y-1">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider transition-all text-left ${
                activeTab === 'projects'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-[hsl(var(--muted))] hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('journals')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider transition-all text-left ${
                activeTab === 'journals'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-[hsl(var(--muted))] hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Writings ({journals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider transition-all text-left ${
                activeTab === 'metrics'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-[hsl(var(--muted))] hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Metrics & Impact ({stats.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider transition-all text-left ${
                activeTab === 'resume'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-[hsl(var(--muted))] hover:text-white hover:bg-white/5'
              }`}
            >
              <FileDown className="w-4 h-4" />
              <span>Resume Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider transition-all text-left ${
                activeTab === 'settings'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-[hsl(var(--muted))] hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Portfolio Settings</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-9 bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-3xl p-6 sm:p-8 shadow-xl">
            {/* --- TAB 1: PROJECTS --- */}
            {activeTab === 'projects' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[hsl(var(--stroke))]">
                  <div>
                    <h2 className="text-2xl font-display italic text-white">
                      Projects Database
                    </h2>
                    <p className="text-xs font-mono text-[hsl(var(--muted))]">
                      Manage featured bento cards and full gallery portfolio.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenProjectForm()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 transition-all hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[hsl(var(--stroke))] text-[hsl(var(--muted))] uppercase">
                        <th className="pb-3 pr-4">Project</th>
                        <th className="pb-3 pr-4">Category</th>
                        <th className="pb-3 pr-4">Span</th>
                        <th className="pb-3 pr-4">Year</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--stroke))]">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="py-4 pr-4 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-10 h-10 rounded-lg object-cover grayscale border border-white/10"
                            />
                            <div>
                              <span className="font-bold text-white text-sm block">
                                {p.title}
                              </span>
                              <span className="text-[10px] text-[hsl(var(--muted))] line-clamp-1 max-w-xs">
                                {p.description}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-white/80">{p.category}</td>
                          <td className="py-4 pr-4 text-white/80">{p.spanSize} cols</td>
                          <td className="py-4 pr-4 text-white/80">{p.year}</td>
                          <td className="py-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenProjectForm(p)}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: 'project',
                                  id: p.id,
                                  title: p.title,
                                })
                              }
                              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 text-white transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- TAB 2: JOURNALS --- */}
            {activeTab === 'journals' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[hsl(var(--stroke))]">
                  <div>
                    <h2 className="text-2xl font-display italic text-white">
                      Writings & Thoughts
                    </h2>
                    <p className="text-xs font-mono text-[hsl(var(--muted))]">
                      Publish and edit articles, design essays, and technical notes.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenJournalForm()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 transition-all hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Article</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[hsl(var(--stroke))] text-[hsl(var(--muted))] uppercase">
                        <th className="pb-3 pr-4">Article Title</th>
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Read Time</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--stroke))]">
                      {journals.map((j) => (
                        <tr key={j.id} className="hover:bg-white/[0.02]">
                          <td className="py-4 pr-4 flex items-center gap-3">
                            <img
                              src={j.image}
                              alt={j.title}
                              className="w-10 h-10 rounded-lg object-cover grayscale border border-white/10"
                            />
                            <div>
                              <span className="font-bold text-white text-sm block">
                                {j.title}
                              </span>
                              <span className="text-[10px] text-[hsl(var(--muted))] line-clamp-1 max-w-sm">
                                {j.summary}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-white/80">{j.date}</td>
                          <td className="py-4 pr-4 text-white/80">{j.readTime}</td>
                          <td className="py-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenJournalForm(j)}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: 'journal',
                                  id: j.id,
                                  title: j.title,
                                })
                              }
                              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 text-white transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- TAB 3: METRICS & IMPACT --- */}
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[hsl(var(--stroke))]">
                  <div>
                    <h2 className="text-2xl font-display italic text-white mb-1">
                      Metrics & Proof of Execution
                    </h2>
                    <p className="text-xs font-mono text-[hsl(var(--muted))]">
                      Configure the 3 animated proof counter cards displayed on the homepage.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.id}
                      className="p-6 rounded-2xl bg-black border border-[hsl(var(--stroke))] space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-white font-medium">
                          Metric Card #{index + 1}
                        </span>
                        <span className="text-xs font-mono text-[hsl(var(--muted))]">
                          ID: {stat.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                            Number Value
                          </label>
                          <input
                            type="number"
                            value={stat.number}
                            onChange={(e) => {
                              updateStat(stat.id, { number: Number(e.target.value) });
                              showNotification(`Updated ${stat.label} number to ${e.target.value}`);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] text-white text-sm font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                            Suffix (e.g. +, %)
                          </label>
                          <input
                            type="text"
                            value={stat.suffix}
                            onChange={(e) => {
                              updateStat(stat.id, { suffix: e.target.value });
                              showNotification(`Updated ${stat.label} suffix`);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] text-white text-sm font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                            Card Title / Label
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              updateStat(stat.id, { label: e.target.value });
                              showNotification(`Updated metric title`);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] text-white text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                          Description & Tool Stack
                        </label>
                        <textarea
                          rows={3}
                          value={stat.description}
                          onChange={(e) => {
                            updateStat(stat.id, { description: e.target.value });
                          }}
                          onBlur={() => showNotification(`Saved metric description`)}
                          placeholder="List of technologies or description..."
                          className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] text-white text-xs font-mono leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB 4: RESUME --- */}
            {activeTab === 'resume' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-display italic text-white mb-1">
                    Resume Dispatch Manager
                  </h2>
                  <p className="text-xs font-mono text-[hsl(var(--muted))]">
                    Configure the active resume document. Clicking &ldquo;Resume&rdquo; on the Navbar automatically downloads or opens this file.
                  </p>
                </div>

                {/* Upload Section */}
                <div className="p-6 rounded-2xl bg-black border border-[hsl(var(--stroke))] space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Local PDF File
                  </h3>
                  <p className="text-xs text-[hsl(var(--muted))]">
                    Select a local PDF file to store directly into application storage.
                  </p>
                  <label className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-medium text-xs cursor-pointer hover:bg-white/90 transition-all">
                    <span>Browse & Upload PDF</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs font-mono text-[hsl(var(--muted))] block">
                    Current active file: <strong className="text-white">{config.resumeFileName}</strong>
                  </span>
                </div>

                {/* Direct URL Form */}
                <form onSubmit={handleSaveResumeUrl} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                      External PDF URL
                    </label>
                    <input
                      type="text"
                      value={resumeUrlInput}
                      onChange={(e) => setResumeUrlInput(e.target.value)}
                      placeholder="https://example.com/resume.pdf"
                      className="w-full px-4 py-3 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                      Download File Name
                    </label>
                    <input
                      type="text"
                      value={resumeFileNameInput}
                      onChange={(e) => setResumeFileNameInput(e.target.value)}
                      placeholder="Jibin_Johny_Resume.pdf"
                      className="w-full px-4 py-3 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-full bg-white text-black font-medium text-xs hover:bg-white/90 transition-all"
                    >
                      Save Configuration
                    </button>

                    <button
                      type="button"
                      onClick={downloadResume}
                      className="px-6 py-3 rounded-full border border-white/20 text-white font-medium text-xs hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Test Download Action</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --- TAB 4: SETTINGS --- */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-display italic text-white mb-1">
                    Global Portfolio Settings
                  </h2>
                  <p className="text-xs font-mono text-[hsl(var(--muted))]">
                    Modify profile photo, bio, rotating roles, social handles, and security.
                  </p>
                </div>

                {/* Profile Photo Manager */}
                <div className="p-6 rounded-2xl bg-black border border-[hsl(var(--stroke))] space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Profile Picture
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-b from-white/40 via-white/10 to-transparent flex-shrink-0 shadow-lg">
                      <img
                        src={config.profilePhoto}
                        alt={config.name}
                        className="w-full h-full rounded-full object-cover grayscale contrast-110 border-2 border-[hsl(var(--stroke))]"
                      />
                    </div>

                    <div className="space-y-3 flex-grow w-full">
                      <div>
                        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-medium text-xs cursor-pointer hover:bg-white/90 transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={profilePhotoInput}
                          onChange={(e) => setProfilePhotoInput(e.target.value)}
                          placeholder="Or paste image URL (https://...)"
                          className="w-full px-4 py-2 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] text-white text-xs font-mono focus:border-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateConfig({ profilePhoto: profilePhotoInput });
                            showNotification('Profile photo URL updated!');
                          }}
                          className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white hover:text-black text-xs font-mono transition-colors whitespace-nowrap"
                        >
                          Save URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        value={config.name}
                        onChange={(e) => updateConfig({ name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={config.location}
                        onChange={(e) => updateConfig({ location: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-[hsl(var(--stroke))] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono uppercase tracking-wider text-white font-medium">
                        Rotating Roles (Hero Section Animation)
                      </label>
                      <span className="text-[11px] font-mono text-[hsl(var(--muted))]">
                        {(config.roles || []).length} active {config.roles?.length === 1 ? 'role' : 'roles'}
                      </span>
                    </div>

                    {/* Interactive Role Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(config.roles || []).map((role, idx) => (
                        <span
                          key={`${role}-${idx}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-xs font-mono group hover:border-white/30 transition-all"
                        >
                          <span>{role}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRoleTag(role)}
                            title={`Remove ${role}`}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors text-xs ml-0.5"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Comma-Separated Direct Input & Save */}
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-[11px] font-mono text-[hsl(var(--muted))]">
                        Edit as Comma-Separated List:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={rolesInput}
                          onChange={(e) => setRolesInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveRoles();
                            }
                          }}
                          onBlur={() => {
                            if (rolesInput.trim()) {
                              handleSaveRoles();
                            }
                          }}
                          placeholder="e.g. Programmer, Data Analyst, ML Engineer, Innovator"
                          className="w-full px-4 py-2 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] text-white text-xs font-mono focus:border-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRoles()}
                          className="px-4 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-mono font-medium transition-colors whitespace-nowrap"
                        >
                          Save Roles
                        </button>
                      </div>
                    </div>

                    {/* Quick Single Role Add Form */}
                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newRoleTagInput}
                          onChange={(e) => setNewRoleTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddRoleTag(e);
                            }
                          }}
                          placeholder="Or type a single role and press enter..."
                          className="w-full px-3.5 py-1.5 rounded-lg bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono focus:border-white focus:outline-none placeholder:text-white/25"
                        />
                        <button
                          type="button"
                          onClick={handleAddRoleTag}
                          className="px-3.5 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white hover:text-black text-xs font-mono transition-colors whitespace-nowrap"
                        >
                          + Add Role
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                      Bio / Summary
                    </label>
                    <textarea
                      rows={3}
                      value={config.bio}
                      onChange={(e) => updateConfig({ bio: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                      Contact Email (Where messages are delivered)
                    </label>
                    <input
                      type="email"
                      value={config.email}
                      onChange={(e) => updateConfig({ email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono"
                    />
                    <p className="text-[11px] text-[hsl(var(--muted))] mt-1 font-mono">
                      Form submissions will be transmitted directly to this inbox via FormSubmit.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                      Custom Form Action / Webhook URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={config.contactFormEndpoint || ''}
                      onChange={(e) => updateConfig({ contactFormEndpoint: e.target.value })}
                      placeholder="Leave empty to use automatic FormSubmit (https://formsubmit.co/ajax/...)"
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono placeholder:text-white/20"
                    />
                    <p className="text-[11px] text-[hsl(var(--muted))] mt-1 font-mono">
                      Optional: You can provide a custom Formspree URL or Web3Forms API endpoint if preferred.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                        GitHub Profile URL
                      </label>
                      <input
                        type="text"
                        value={config.socials.github}
                        onChange={(e) =>
                          updateConfig({
                            socials: { ...config.socials, github: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="text"
                        value={config.socials.linkedin}
                        onChange={(e) =>
                          updateConfig({
                            socials: { ...config.socials, linkedin: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                      Admin Passcode
                    </label>
                    <input
                      type="text"
                      value={config.adminPasscode}
                      onChange={(e) => updateConfig({ adminPasscode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono"
                    />
                  </div>

                  <div className="pt-6 border-t border-[hsl(var(--stroke))] flex items-center justify-between">
                    <span className="text-xs font-mono text-[hsl(var(--muted))]">
                      Reset database to initial seed template
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: 'reset',
                          title: 'All Portfolio Data & Customizations',
                        })
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-xs font-mono transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset to Defaults</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- ADD / EDIT PROJECT MODAL --- */}
      {isProjectFormOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
            <h3 className="text-2xl font-display italic text-white mb-1">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            <p className="text-xs font-mono text-[hsl(var(--muted))] mb-6">
              Configure project metadata, column span layout, and launch links.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[hsl(var(--muted))] uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  placeholder="Automotive Motion"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[hsl(var(--muted))] uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    placeholder="Telemetry & Visualization"
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--muted))] uppercase mb-1">Bento Span Size</label>
                  <select
                    value={projectFormData.spanSize}
                    onChange={(e) =>
                      setProjectFormData({
                        ...projectFormData,
                        spanSize: Number(e.target.value) as 5 | 7 | 12,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                  >
                    <option value={7}>7 Columns (Wide)</option>
                    <option value={5}>5 Columns (Compact)</option>
                    <option value={12}>12 Columns (Full Width)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[hsl(var(--muted))] uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={projectFormData.image}
                  onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                />
              </div>

              <div>
                <label className="block text-[hsl(var(--muted))] uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Comprehensive project overview..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[hsl(var(--muted))] uppercase mb-1">Project / Case Study Link</label>
                  <input
                    type="text"
                    value={projectFormData.projectUrl}
                    onChange={(e) => setProjectFormData({ ...projectFormData, projectUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--muted))] uppercase mb-1">GitHub Repo Link</label>
                  <input
                    type="text"
                    value={projectFormData.githubUrl}
                    onChange={(e) => setProjectFormData({ ...projectFormData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[hsl(var(--muted))] uppercase mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={projectFormData.tags}
                    onChange={(e) => setProjectFormData({ ...projectFormData, tags: e.target.value })}
                    placeholder="React, TypeScript, WebGL"
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--muted))] uppercase mb-1">Year</label>
                  <input
                    type="text"
                    value={projectFormData.year}
                    onChange={(e) => setProjectFormData({ ...projectFormData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[hsl(var(--stroke))]">
                <button
                  type="button"
                  onClick={() => setIsProjectFormOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT JOURNAL MODAL --- */}
      {isJournalFormOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
            <h3 className="text-2xl font-display italic text-white mb-1">
              {editingJournal ? 'Edit Article' : 'Compose New Article'}
            </h3>
            <p className="text-xs font-mono text-[hsl(var(--muted))] mb-6">
              Write and format your journal entry.
            </p>

            <form onSubmit={handleSaveJournal} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[hsl(var(--muted))] uppercase mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={journalFormData.title}
                  onChange={(e) => setJournalFormData({ ...journalFormData, title: e.target.value })}
                  placeholder="Designing with Intentional Monochrome"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[hsl(var(--muted))] uppercase mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={journalFormData.date}
                    onChange={(e) => setJournalFormData({ ...journalFormData, date: e.target.value })}
                    placeholder="Aug 27, 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--muted))] uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    required
                    value={journalFormData.readTime}
                    onChange={(e) => setJournalFormData({ ...journalFormData, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[hsl(var(--muted))] uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={journalFormData.image}
                  onChange={(e) => setJournalFormData({ ...journalFormData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                />
              </div>

              <div>
                <label className="block text-[hsl(var(--muted))] uppercase mb-1">Summary / Lead Paragraph</label>
                <textarea
                  required
                  rows={2}
                  value={journalFormData.summary}
                  onChange={(e) => setJournalFormData({ ...journalFormData, summary: e.target.value })}
                  placeholder="Short thesis statement..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-[hsl(var(--muted))] uppercase mb-1">Full Content (Supports Markdown ### headings)</label>
                <textarea
                  required
                  rows={6}
                  value={journalFormData.content}
                  onChange={(e) => setJournalFormData({ ...journalFormData, content: e.target.value })}
                  placeholder="Write your article thoughts here..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[hsl(var(--muted))] uppercase mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={journalFormData.tags}
                  onChange={(e) => setJournalFormData({ ...journalFormData, tags: e.target.value })}
                  placeholder="Design, Engineering, Monochrome"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-[hsl(var(--stroke))] text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[hsl(var(--stroke))]">
                <button
                  type="button"
                  onClick={() => setIsJournalFormOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- CUSTOM DELETION CONFIRMATION MODAL --- */}
      {deleteConfirm?.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[hsl(var(--surface))] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-display italic text-white mb-1">
                {deleteConfirm.type === 'reset' ? 'Reset All Data?' : 'Confirm Deletion'}
              </h3>
              <p className="text-xs font-mono text-[hsl(var(--muted))] leading-relaxed">
                {deleteConfirm.type === 'reset' ? (
                  <>
                    Are you sure you want to reset all projects, journal entries, and metrics back to the initial seed dataset? Any unsaved custom additions will be cleared.
                  </>
                ) : (
                  <>
                    Are you sure you want to permanently delete{' '}
                    <strong className="text-white">&ldquo;{deleteConfirm.title}&rdquo;</strong>? This action cannot be reversed.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[hsl(var(--stroke))]">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 text-xs font-mono transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAction}
                className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium text-xs font-mono transition-all shadow-lg shadow-red-500/20"
              >
                {deleteConfirm.type === 'reset' ? 'Yes, Reset Defaults' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
