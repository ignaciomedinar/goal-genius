import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Goal Genius',
  description: 'Learn about Goal Genius — who we are, our mission, and how we use AI to deliver accurate football match predictions.',
};

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Predictions',
    description:
      'Our machine learning model is trained on years of historical match data, team form, head-to-head records, and contextual league factors to generate high-confidence predictions.',
  },
  {
    icon: '📊',
    title: 'Full Transparency',
    description:
      'We publish our accuracy record publicly — every week, every match. No cherry-picking. You can verify our performance in real time on the Results page.',
  },
  {
    icon: '🔄',
    title: 'Weekly Updates',
    description:
      'Predictions are refreshed every week before match days. Results are automatically validated against real scores and fed back into our accuracy tracking.',
  },
  {
    icon: '🌍',
    title: 'Global Coverage',
    description:
      'We cover 50+ leagues across all major confederations — UEFA, CONMEBOL, CAF, AFC, CONCACAF, and OFC — so you never miss a match that matters.',
  },
  {
    icon: '🎯',
    title: 'Confidence Ratings',
    description:
      'Every prediction comes with a confidence score and a Liability rating (High, Mid, Low) so you can quickly identify the most reliable picks of the week.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Data',
    description:
      'Our database is backed by live data pipelines. Scores and results are synced automatically, keeping accuracy statistics always up to date.',
  },
];

const stats = [
  { value: '85%+', label: 'Average Accuracy' },
  { value: '500+', label: 'Matches per Week' },
  { value: '50+', label: 'Leagues Covered' },
  { value: '6', label: 'Confederations' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            <span className="mr-2">⚽</span>
            About Goal Genius
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Predictions You Can
            <span className="block text-primary">Actually Trust</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Goal Genius is an AI-driven football prediction platform built on one principle: full
            transparency. We show you our accuracy, match by match, week by week — no hiding, no
            spin.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary font-display mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              <span className="mr-2">📖</span>
              Our Story
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built by football fans, for football fans
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                Goal Genius was born from a simple frustration: most football prediction services
                are opaque, inconsistent, and impossible to verify. Bold claims, hidden track
                records, and no accountability. We wanted something different.
              </p>
              <p>
                We built an AI model trained on a comprehensive historical dataset of match results,
                team statistics, and contextual league factors. The model generates score
                predictions — not just win/lose — giving you the expected goals for both sides
                along with a probability score.
              </p>
              <p>
                Every prediction we publish is tracked. Every result is validated. Our accuracy
                record is public and updated automatically. If we have a bad week, you&apos;ll see it.
                If we have a great week, you&apos;ll see that too. That&apos;s the deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <span className="mr-2">🏆</span>
              What Makes Us Different
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Six things that set us apart
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're not another tipping service. Here's what actually makes Goal Genius worth your
              time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="font-semibold text-foreground mb-2">For Entertainment Purposes Only</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Goal Genius predictions are provided for informational and entertainment purposes
              only. They do not constitute financial or betting advice. Please gamble responsibly.
              If you or someone you know has a gambling problem, seek help at{' '}
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                BeGambleAware.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to see this week&apos;s predictions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Browse our current match predictions and check how our model has performed in recent
            weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/predictions"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              View Predictions <span className="ml-2">→</span>
            </Link>
            <Link
              href="/accuracy"
              className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Our Accuracy Record
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
