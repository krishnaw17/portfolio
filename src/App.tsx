import { useState } from 'react';
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

function App() {
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

export default App;
