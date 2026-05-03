import HeroSection from '@/components/home/HeroSection';
import TopMatchesSection from '@/components/home/TopMatchesSection';
import AccuracySection from '@/components/home/AccuracySection';
import ConfederationSection from '@/components/home/ConfederationSection';
import StatsSection from '@/components/home/StatsSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TopMatchesSection />
      <AccuracySection />
      <StatsSection />
      <ConfederationSection />
    </div>
  );
}
