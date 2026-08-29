import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, JournalEntry, StatItem, PortfolioConfig } from '../types';
import { INITIAL_CONFIG, INITIAL_PROJECTS, INITIAL_JOURNALS, INITIAL_STATS } from '../data/initialData';

interface PortfolioContextType {
  config: PortfolioConfig;
  projects: Project[];
  journals: JournalEntry[];
  stats: StatItem[];
  // Actions
  updateConfig: (config: Partial<PortfolioConfig>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addJournal: (journal: Omit<JournalEntry, 'id' | 'slug'>) => void;
  updateJournal: (id: string, journal: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  updateStat: (id: string, stat: Partial<StatItem>) => void;
  updateAllStats: (stats: StatItem[]) => void;
  updateResume: (fileData: { url: string; fileName: string }) => void;
  downloadResume: () => void;
  resetToDefaults: () => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG: 'jbn_portfolio_config_v4',
  PROJECTS: 'jbn_portfolio_projects_v4',
  JOURNALS: 'jbn_portfolio_journals_v4',
  STATS: 'jbn_portfolio_stats_v4',
  AUTH: 'jbn_portfolio_auth_v4',
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PortfolioConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      return saved ? JSON.parse(saved) : INITIAL_JOURNALS;
    } catch {
      return INITIAL_JOURNALS;
    }
  });

  const [stats, setStats] = useState<StatItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('LocalStorage config save error:', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage projects save error:', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    } catch (e) {
      console.warn('LocalStorage journals save error:', e);
    }
  }, [journals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('LocalStorage stats save error:', e);
    }
  }, [stats]);

  // Update Config
  const updateConfig = (newConfig: Partial<PortfolioConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Add Project
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const id = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const newProject: Project = { ...projectData, id };
    setProjects((prev) => [newProject, ...prev]);
  };

  // Update Project
  const updateProject = (id: string, updatedData: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
  };

  // Delete Project
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Add Journal
  const addJournal = (journalData: Omit<JournalEntry, 'id' | 'slug'>) => {
    const slug = journalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = String(Date.now());
    const newJournal: JournalEntry = {
      ...journalData,
      id,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
    };
    setJournals((prev) => [newJournal, ...prev]);
  };

  // Update Journal
  const updateJournal = (id: string, updatedData: Partial<JournalEntry>) => {
    setJournals((prev) => prev.map((j) => (j.id === id ? { ...j, ...updatedData } : j)));
  };

  // Delete Journal
  const deleteJournal = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  // Update Stat
  const updateStat = (id: string, updatedData: Partial<StatItem>) => {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
  };

  // Update All Stats
  const updateAllStats = (newStats: StatItem[]) => {
    setStats(newStats);
  };

  // Update Resume in Config
  const updateResume = (fileData: { url: string; fileName: string }) => {
    setConfig((prev) => ({
      ...prev,
      resumeUrl: fileData.url,
      resumeFileName: fileData.fileName,
    }));
  };

  const downloadResume = () => {
    const resumeUrl = config.resumeUrl || '';
    if (resumeUrl.startsWith('data:') || resumeUrl.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = config.resumeFileName || 'Jibin_Johny_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const printableContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${config.name} - Resume</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; max-width: 800px; margin: auto; }
    h1 { font-size: 28px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
    .subtitle { color: #555; font-size: 16px; margin-bottom: 20px; }
    .section-title { border-bottom: 2px solid #111; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; font-size: 18px; text-transform: uppercase; }
    .contact { font-size: 14px; color: #444; margin-bottom: 20px; }
    .item { margin-bottom: 16px; }
    .item-title { font-weight: bold; font-size: 16px; }
    .item-sub { color: #555; font-size: 14px; }
    ul { padding-left: 20px; margin-top: 6px; }
    li { margin-bottom: 4px; font-size: 14px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${config.name}</h1>
  <div class="subtitle">${config.roles.join(' • ')} — ${config.location}</div>
  <div class="contact">Email: ${config.email} | GitHub: ${config.socials.github} | LinkedIn: ${config.socials.linkedin}</div>
  
  <div class="section-title">Summary</div>
  <p>${config.bio}</p>

  <div class="section-title">Featured Engineering Projects</div>
  ${projects.slice(0, 4).map(p => `
    <div class="item">
      <div class="item-title">${p.title} <span style="font-weight:normal; color:#666;">(${p.year})</span></div>
      <div class="item-sub">${p.category} | Tech: ${p.tags.join(', ')}</div>
      <p style="font-size:14px; margin-top:4px;">${p.description}</p>
    </div>
  `).join('')}

  <div class="section-title">Core Skills</div>
  <p><strong>Languages & Frameworks:</strong> React, TypeScript, Python, Node.js, Next.js, Express, Tailwind CSS, PyTorch, OpenCV</p>
  <p><strong>Specializations:</strong> Full-Stack Systems, Machine Learning & Generative AI Pipelines, GSAP Interactive Motion, UI/UX Systems</p>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
      `;
      const blob = new Blob([printableContent], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (!win) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = config.resumeFileName || 'Jibin_Johny_Resume.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const resetToDefaults = () => {
    setConfig(INITIAL_CONFIG);
    setProjects(INITIAL_PROJECTS);
    setJournals(INITIAL_JOURNALS);
    setStats(INITIAL_STATS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.JOURNALS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
  };

  return (
    <PortfolioContext.Provider
      value={{
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
        updateAllStats,
        updateResume,
        downloadResume,
        resetToDefaults,
        isAdminAuthenticated,
        setIsAdminAuthenticated: (auth) => {
          setIsAdminAuthenticated(auth);
          sessionStorage.setItem(STORAGE_KEYS.AUTH, auth ? 'true' : 'false');
        },
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
