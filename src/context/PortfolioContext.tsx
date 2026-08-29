import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, JournalEntry, StatItem, PortfolioConfig } from '../types';
import { INITIAL_CONFIG, INITIAL_PROJECTS, INITIAL_JOURNALS, INITIAL_STATS } from '../data/initialData';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

interface PortfolioContextType {
  config: PortfolioConfig;
  projects: Project[];
  journals: JournalEntry[];
  stats: StatItem[];
  // Actions
  updateConfig: (config: Partial<PortfolioConfig>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addJournal: (journal: Omit<JournalEntry, 'id' | 'slug'>) => Promise<void>;
  updateJournal: (id: string, journal: Partial<JournalEntry>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  updateStat: (id: string, stat: Partial<StatItem>) => Promise<void>;
  updateAllStats: (stats: StatItem[]) => Promise<void>;
  updateResume: (fileData: { url: string; fileName: string }) => Promise<void>;
  downloadResume: () => void;
  resetToDefaults: () => Promise<void>;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  isCloudSynced: boolean;
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

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Real-time Firestore Listeners & Initial Seeding
  useEffect(() => {
    let unsubscribeConfig: (() => void) | undefined;
    let unsubscribeProjects: (() => void) | undefined;
    let unsubscribeJournals: (() => void) | undefined;
    let unsubscribeStats: (() => void) | undefined;

    const setupFirestoreSync = async () => {
      try {
        // 1. Config collection / main document
        const configDocRef = doc(db, 'config', 'main');
        unsubscribeConfig = onSnapshot(
          configDocRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as PortfolioConfig;
              setConfig(data);
              localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data));
            } else {
              // Seed initial config to firestore
              try {
                await setDoc(configDocRef, INITIAL_CONFIG);
              } catch (seedErr) {
                console.warn('Initial config seed error:', seedErr);
              }
            }
          },
          (err) => console.warn('Config snapshot error:', err)
        );

        // 2. Projects collection
        const projectsCollRef = collection(db, 'projects');
        unsubscribeProjects = onSnapshot(
          projectsCollRef,
          async (snapshot) => {
            if (!snapshot.empty) {
              const docs = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Project));
              setProjects(docs);
              localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(docs));
            } else {
              // Seed initial projects
              for (const p of INITIAL_PROJECTS) {
                try {
                  await setDoc(doc(db, 'projects', p.id), p);
                } catch (pErr) {
                  console.warn('Initial project seed error:', pErr);
                }
              }
            }
          },
          (err) => console.warn('Projects snapshot error:', err)
        );

        // 3. Journals collection
        const journalsCollRef = collection(db, 'journals');
        unsubscribeJournals = onSnapshot(
          journalsCollRef,
          async (snapshot) => {
            if (!snapshot.empty) {
              const docs = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as JournalEntry));
              setJournals(docs);
              localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(docs));
            } else {
              // Seed initial journals
              for (const j of INITIAL_JOURNALS) {
                try {
                  await setDoc(doc(db, 'journals', j.id), j);
                } catch (jErr) {
                  console.warn('Initial journal seed error:', jErr);
                }
              }
            }
          },
          (err) => console.warn('Journals snapshot error:', err)
        );

        // 4. Stats collection
        const statsCollRef = collection(db, 'stats');
        unsubscribeStats = onSnapshot(
          statsCollRef,
          async (snapshot) => {
            if (!snapshot.empty) {
              const docs = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as StatItem));
              setStats(docs);
              localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(docs));
            } else {
              // Seed initial stats
              for (const s of INITIAL_STATS) {
                try {
                  await setDoc(doc(db, 'stats', s.id), s);
                } catch (sErr) {
                  console.warn('Initial stat seed error:', sErr);
                }
              }
            }
            setIsCloudSynced(true);
          },
          (err) => console.warn('Stats snapshot error:', err)
        );
      } catch (err) {
        console.error('Error connecting to Firestore, using local fallback:', err);
      }
    };

    setupFirestoreSync();

    return () => {
      if (unsubscribeConfig) unsubscribeConfig();
      if (unsubscribeProjects) unsubscribeProjects();
      if (unsubscribeJournals) unsubscribeJournals();
      if (unsubscribeStats) unsubscribeStats();
    };
  }, []);

  // Update Config
  const updateConfig = async (newConfig: Partial<PortfolioConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'main'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore updateConfig error:', e);
    }
  };

  // Add Project
  const addProject = async (projectData: Omit<Project, 'id'>) => {
    const id = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const newProject: Project = { ...projectData, id };
    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'projects', id), newProject);
    } catch (e) {
      console.warn('Firestore addProject error:', e);
    }
  };

  // Update Project
  const updateProject = async (id: string, updatedData: Partial<Project>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    setProjects(updated);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'projects', id), updatedData, { merge: true });
    } catch (e) {
      console.warn('Firestore updateProject error:', e);
    }
  };

  // Delete Project
  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (e) {
      console.warn('Firestore deleteProject error:', e);
    }
  };

  // Add Journal
  const addJournal = async (journalData: Omit<JournalEntry, 'id' | 'slug'>) => {
    const slug = journalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = String(Date.now());
    const newJournal: JournalEntry = {
      ...journalData,
      id,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newJournal, ...journals];
    setJournals(updated);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'journals', id), newJournal);
    } catch (e) {
      console.warn('Firestore addJournal error:', e);
    }
  };

  // Update Journal
  const updateJournal = async (id: string, updatedData: Partial<JournalEntry>) => {
    const updated = journals.map((j) => (j.id === id ? { ...j, ...updatedData } : j));
    setJournals(updated);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'journals', id), updatedData, { merge: true });
    } catch (e) {
      console.warn('Firestore updateJournal error:', e);
    }
  };

  // Delete Journal
  const deleteJournal = async (id: string) => {
    const updated = journals.filter((j) => j.id !== id);
    setJournals(updated);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'journals', id));
    } catch (e) {
      console.warn('Firestore deleteJournal error:', e);
    }
  };

  // Update Stat
  const updateStat = async (id: string, updatedData: Partial<StatItem>) => {
    const updated = stats.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
    setStats(updated);
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'stats', id), updatedData, { merge: true });
    } catch (e) {
      console.warn('Firestore updateStat error:', e);
    }
  };

  // Update All Stats
  const updateAllStats = async (newStats: StatItem[]) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
    try {
      for (const s of newStats) {
        await setDoc(doc(db, 'stats', s.id), s, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore updateAllStats error:', e);
    }
  };

  // Update Resume in Config
  const updateResume = async (fileData: { url: string; fileName: string }) => {
    const updated = {
      ...config,
      resumeUrl: fileData.url,
      resumeFileName: fileData.fileName,
    };
    setConfig(updated);
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'main'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore updateResume error:', e);
    }
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

  const resetToDefaults = async () => {
    setConfig(INITIAL_CONFIG);
    setProjects(INITIAL_PROJECTS);
    setJournals(INITIAL_JOURNALS);
    setStats(INITIAL_STATS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.JOURNALS);
    localStorage.removeItem(STORAGE_KEYS.STATS);

    try {
      // Overwrite Firestore records with initial data
      await setDoc(doc(db, 'config', 'main'), INITIAL_CONFIG);

      // Clean and reset projects
      const existingProjects = await getDocs(collection(db, 'projects'));
      for (const d of existingProjects.docs) {
        await deleteDoc(d.ref);
      }
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }

      // Clean and reset journals
      const existingJournals = await getDocs(collection(db, 'journals'));
      for (const d of existingJournals.docs) {
        await deleteDoc(d.ref);
      }
      for (const j of INITIAL_JOURNALS) {
        await setDoc(doc(db, 'journals', j.id), j);
      }

      // Clean and reset stats
      const existingStats = await getDocs(collection(db, 'stats'));
      for (const d of existingStats.docs) {
        await deleteDoc(d.ref);
      }
      for (const s of INITIAL_STATS) {
        await setDoc(doc(db, 'stats', s.id), s);
      }
    } catch (e) {
      console.warn('Firestore resetToDefaults error:', e);
    }
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
        isCloudSynced,
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

