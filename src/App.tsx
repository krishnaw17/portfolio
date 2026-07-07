import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/layouts/Layout';
import { Loader } from '@/components/ui/Loader';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Education } from '@/components/sections/Education';
// import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { useUI } from '@/store/ui';

// Admin
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProjectsAdmin } from '@/components/admin/sections/ProjectsAdmin';
import { ExperienceAdmin } from '@/components/admin/sections/ExperienceAdmin';
import { EducationAdmin } from '@/components/admin/sections/EducationAdmin';
import { SkillsAdmin } from '@/components/admin/sections/SkillsAdmin';
import { SettingsAdmin } from '@/components/admin/sections/SettingsAdmin';

function Portfolio() {
  const [showLoader, setShowLoader] = useState(true);
  const { setLoaded } = useUI();

  return (
    <>
      {showLoader && <Loader onDone={() => { setShowLoader(false); setLoaded(true); }} />}
      <Layout>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        {/* <Testimonials /> */}
        <Contact />
      </Layout>
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Public portfolio */}
      <Route path="/" element={<Portfolio />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="experience" element={<ExperienceAdmin />} />
        <Route path="education" element={<EducationAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;
