import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Goal Genius',
  description:
    'Understand how Goal Genius generates AI-powered football predictions — from data collection to score forecasting and weekly accuracy tracking.',
};

const steps = [
  {
    number: '01',
    icon: '📡',
    title: 'Data Collection',
    description:
      'We pull structured match data from a comprehensive football database covering all major leagues and confederations worldwide. This includes historical results, team form, goals scored/conceded, home/away performance, and head-to-head records going back several seasons.',
    detail: 'Sources: ESPN API + proprietary historical dataset',
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI Model Analysis',
    description:
      'A machine learning model processes the input features for each upcoming match — team strength indices, recent form windows, venue advantage, league-specific patterns, and more. The model outputs a predicted scoreline along with an overall win/draw/loss probability.',
    detail: 'Model type: Supervised regression + classification ensemble',
  },
  {
    number: '03',
    icon: '🎯',
    title: 'Score Prediction',
    description:
      'For every match, the model predicts the expected number of goals for each side (PHG — Predicted Home Goals, PAG — Predicted Away Goals). These raw goal predictions determine the outcome type: home win, away win, or draw.',
    detail: 'Output: PHG, PAG, and max probability score (0–1)',
  },
  {
    number: '04',
    icon: '📊',
    title: 'Liability Rating',
    description:
      'Each prediction is assigned a Liability tier based on model confidence and historical league-level reliability. High-liability picks are the model\'s most confident calls. Mid-liability predictions carry moderate confidence. Low-liability picks are possible outcomes but with higher uncertainty.',
    detail: 'Tiers: High (green) · Mid (yellow) · Low (red)',
  },
  {
    number: '05',
    icon: '✅',
    title: 'Accuracy Tracking',
    description:
      'Once a match is played, the real scoreline is fetched automatically and compared against our prediction. The outcome — correct or wrong — is recorded in our results database. Accuracy is calculated in real time and displayed publicly on the Results and Accuracy pages.',
    detail: 'Updated: daily / as results come in',
  },
];

const faqs = [
  {
    question: 'What does the confidence score (max_prob) mean?',
    answer:
      'The confidence score represents the model\'s estimated probability that its predicted outcome (home win, draw, or away win) is correct. A score of 90% means the model assigns a 90% probability to that outcome. Higher confidence does not guarantee correctness — it reflects the model\'s certainty given available data.',
  },
  {
    question: 'What is the Liability rating?',
    answer:
      'Liability (High / Mid / Low) is our own classification layer on top of the raw confidence score. It combines the model\'s confidence with the historical accuracy of predictions in that league and risk profile. High = most reliable picks. Mid = decent confidence but more variance. Low = possible outcome but treat with caution.',
  },
  {
    question: 'How often are predictions updated?',
    answer:
      'Predictions for the current week are published at the start of each football week. The dataset is refreshed daily, so matches added mid-week will appear automatically. Results are validated as soon as final scores are available, typically within hours of a match ending.',
  },
  {
    question: 'Does Goal Genius predict exact scores?',
    answer:
      'Yes — the model outputs a predicted score (e.g. 2–1) rather than just a winner. The predicted outcome (home/away/draw) is derived from that score. Accuracy is measured on the outcome (win/draw/loss), not the exact scoreline.',
  },
  {
    question: 'Are these predictions financial or betting advice?',
    answer:
      'No. Goal Genius predictions are for informational and entertainment purposes only. They should not be treated as financial, betting, or investment advice. Always gamble responsibly and within your means.',
  },
];

export default function HowItWorksPage() {
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
            <span className="mr-2">🔍</span>
            How It Works
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            From Raw Data to
            <span className="block text-primary">Match Predictions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A transparent look at the pipeline behind every Goal Genius prediction — from data
            ingestion through AI modelling to real-time accuracy tracking.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className="flex gap-6 md:gap-10">
                  {/* Left: number + connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shrink-0">
                      {step.icon}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-3 min-h-[3rem]" />
                    )}
                  </div>
                  {/* Right: content */}
                  <div className="pb-12">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded font-mono">
                        STEP {step.number}
                      </span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                    <div className="inline-flex items-center text-xs text-primary bg-primary/10 rounded px-3 py-1.5 font-mono">
                      {step.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liability tiers explainer */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <span className="mr-2">📊</span>
              Liability Tiers Explained
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Reading the Liability Rating
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every prediction is tagged with a liability level. Here&apos;s how to interpret each one.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card border border-green-500/30 rounded-xl p-6 text-center">
              <div className="inline-flex px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-semibold mb-4">
                High
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                Most Confident Picks
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The model has high confidence and the league has a strong historical accuracy record.
                These are the picks most likely to land.
              </p>
            </div>
            <div className="bg-card border border-yellow-500/30 rounded-xl p-6 text-center">
              <div className="inline-flex px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded text-sm font-semibold mb-4">
                Mid
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                Moderate Confidence
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Reasonable confidence but with more variance. Worth watching, but not as reliable
                as High-liability picks.
              </p>
            </div>
            <div className="bg-card border border-red-500/30 rounded-xl p-6 text-center">
              <div className="inline-flex px-3 py-1 bg-red-500/10 text-red-500 rounded text-sm font-semibold mb-4">
                Low
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                Higher Uncertainty
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The model sees a plausible outcome but uncertainty is elevated. Treat these
                predictions with extra caution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
                <span className="mr-2">❓</span>
                Frequently Asked Questions
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">Common Questions</h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-display font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            See the model in action
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Browse this week&apos;s predictions or check our historical accuracy across all leagues.
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
