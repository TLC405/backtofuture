
import { Helmet } from 'react-helmet-async';
import { InspireNavbar } from '../components/inspire/InspireNavbar';
import { InspireHero } from '../components/inspire/InspireHero';
import { AppsShowcase } from '../components/inspire/AppsShowcase';
import { MissionSection } from '../components/inspire/MissionSection';
import { InspireFooter } from '../components/inspire/InspireFooter';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Inspire Oklahoma City | Innovation & Community Hub</title>
        <meta name="description" content="A digital ecosystem empowering creativity, innovation, and community connection. Explore cutting-edge apps, resources, and tools designed to elevate Oklahoma City." />
      </Helmet>
      <InspireNavbar />
      <main>
        <InspireHero />
        <AppsShowcase />
        <MissionSection />
      </main>
      <InspireFooter />
    </>
  );
}
