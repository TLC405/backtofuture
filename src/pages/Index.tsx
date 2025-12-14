
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { EraShowcase } from '../components/landing/EraShowcase';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>TLC Studios • REWIND | AI Time Travel Photography</title>
        <meta name="description" content="See yourself in any decade. Upload one photo and let our AI generate stunning, stylized portraits of you in the 1950s, 80s, 90s, and beyond." />
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <EraShowcase />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
