import type { Locale } from '../i18n/copy';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import {
  GallerySection,
  JourneySection,
  KeywordRail,
  PhilosophySection,
  PrivacySection,
  TherapySection,
} from '../components/HomeSections';
import Navbar from '../components/Navbar';

type HomePageProps = {
  isAuthenticated: boolean;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export default function HomePage({ isAuthenticated, locale, onLocaleChange }: HomePageProps) {
  return (
    <div className="home-page">
      <Navbar isAuthenticated={isAuthenticated} locale={locale} onLocaleChange={onLocaleChange} />
      <main>
        <Hero locale={locale} />
        <KeywordRail locale={locale} />
        <PhilosophySection locale={locale} />
        <JourneySection locale={locale} />
        <TherapySection locale={locale} />
        <GallerySection locale={locale} />
        <PrivacySection locale={locale} />
      </main>
      <Footer locale={locale} onLocaleChange={onLocaleChange} />
    </div>
  );
}
