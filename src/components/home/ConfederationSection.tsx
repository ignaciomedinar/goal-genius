'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Confederation } from '@/types';

const confederationData = [
  {
    name: 'UEFA',
    code: 'UEFA',
    topTeams: ['Manchester City', 'Real Madrid', 'Bayern Munich', 'Paris Saint-Germain', 'Liverpool'],
    leagues: ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Champions League', 'Europa League']
  },
  {
    name: 'CONMEBOL',
    code: 'CONMEBOL',
    topTeams: ['Flamengo', 'Palmeiras', 'Boca Juniors', 'River Plate', 'Santos'],
    leagues: ['Copa Libertadores', 'Copa Sudamericana', 'Brasileirão', 'Argentine Primera', 'Chilean Primera']
  },
  {
    name: 'CONCACAF',
    code: 'CONCACAF',
    topTeams: ['LAFC', 'Club América', 'Seattle Sounders', 'Cruz Azul', 'Monterrey'],
    leagues: ['MLS', 'Liga MX', 'Champions Cup', 'Nations League', 'Gold Cup']
  },
  {
    name: 'AFC',
    code: 'AFC',
    topTeams: ['Al Hilal', 'Urawa Red Diamonds', 'Jeonbuk Motors', 'Shanghai SIPG', 'Persepolis'],
    leagues: ['J1 League', 'K League 1', 'Chinese Super League', 'Saudi Pro League', 'AFC Champions League']
  },
  {
    name: 'CAF',
    code: 'CAF',
    topTeams: ['Al Ahly', 'Wydad Casablanca', 'Kaizer Chiefs', 'TP Mazembe', 'Raja Casablanca'],
    leagues: ['CAF Champions League', 'Egyptian Premier League', 'South African Premier Division', 'Moroccan Botola', 'Tunisian Ligue 1']
  },
  {
    name: 'OFC',
    code: 'OFC',
    topTeams: ['Auckland City', 'Team Wellington', 'Sydney FC', 'Melbourne Victory', 'Western Sydney'],
    leagues: ['A-League', 'New Zealand Football Championship', 'OFC Champions League', 'National Soccer League']
  }
];

const ConfederationSection = () => {
  const [selectedCode, setSelectedCode] = useState('UEFA');
  const t = useTranslations('confederation');

  const selected = confederationData.find(c => c.code === selectedCode)!;
  const descriptions = t.raw('confederationDescriptions') as Record<string, string>;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <span className="mr-2">🌍</span>
              {t('badge')}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Confederation Selector */}
            <div className="lg:col-span-1">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">{t('confederations')}</h3>
              <div className="space-y-2">
                {confederationData.map((confederation) => (
                  <button
                    key={confederation.code}
                    onClick={() => setSelectedCode(confederation.code)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedCode === confederation.code
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-card hover:border-primary/50 text-foreground hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{confederation.name}</div>
                        <div className={`text-sm ${
                          selectedCode === confederation.code
                            ? 'text-primary/70'
                            : 'text-muted-foreground'
                        }`}>
                          {confederation.code}
                        </div>
                      </div>
                      <span className={`transition-transform ${
                        selectedCode === confederation.code ? 'rotate-90' : ''
                      }`}>›</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Confederation Details */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {selected.name}
                    </h3>
                    <p className="text-muted-foreground">{selected.code}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {descriptions[selected.code]}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Top Teams */}
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">🏆</span>
                      <h4 className="font-semibold text-foreground">{t('topTeams')}</h4>
                    </div>
                    <div className="space-y-2">
                      {selected.topTeams.map((team, index) => (
                        <div
                          key={team}
                          className="flex items-center p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{team}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Major Leagues */}
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">👥</span>
                      <h4 className="font-semibold text-foreground">{t('majorCompetitions')}</h4>
                    </div>
                    <div className="space-y-2">
                      {selected.leagues.map((league) => (
                        <div
                          key={league}
                          className="p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="font-medium text-foreground">{league}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                {t('whyChoose.title')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">{t('whyChoose.aiTech.title')}</h4>
                  <p className="mb-4">
                    {t('whyChoose.aiTech.description')}
                  </p>

                  <h4 className="font-semibold text-foreground mb-3">{t('whyChoose.globalCoverage.title')}</h4>
                  <p>
                    {t('whyChoose.globalCoverage.description')}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">{t('whyChoose.trackRecord.title')}</h4>
                  <p className="mb-4">
                    {t('whyChoose.trackRecord.description')}
                  </p>

                  <h4 className="font-semibold text-foreground mb-3">{t('whyChoose.weeklyUpdates.title')}</h4>
                  <p>
                    {t('whyChoose.weeklyUpdates.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfederationSection;
