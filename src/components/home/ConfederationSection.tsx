'use client';

import { useState } from 'react';
// Icons replaced with emojis for compatibility
import { Confederation } from '@/types';

const confederations: Confederation[] = [
  {
    name: 'UEFA',
    code: 'UEFA',
    description: 'European football represents the pinnacle of club and international competition, featuring the world\'s most prestigious leagues and tournaments. Our AI model excels at predicting outcomes in European competitions due to the comprehensive data available and consistent playing styles.',
    topTeams: ['Manchester City', 'Real Madrid', 'Bayern Munich', 'Paris Saint-Germain', 'Liverpool'],
    leagues: ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Champions League', 'Europa League']
  },
  {
    name: 'CONMEBOL',
    code: 'CONMEBOL',
    description: 'South American football is characterized by technical skill, passionate play, and unpredictable outcomes. Our predictions account for the unique playing conditions, altitude factors, and the intense rivalry culture that defines South American football.',
    topTeams: ['Flamengo', 'Palmeiras', 'Boca Juniors', 'River Plate', 'Santos'],
    leagues: ['Copa Libertadores', 'Copa Sudamericana', 'Brasileirão', 'Argentine Primera', 'Chilean Primera']
  },
  {
    name: 'CONCACAF',
    code: 'CONCACAF',
    description: 'North and Central American football has grown significantly in quality and competitiveness. Our AI model adapts to the diverse playing styles across MLS, Liga MX, and other regional competitions, considering travel distances and climate variations.',
    topTeams: ['LAFC', 'Club América', 'Seattle Sounders', 'Cruz Azul', 'Monterrey'],
    leagues: ['MLS', 'Liga MX', 'Champions Cup', 'Nations League', 'Gold Cup']
  },
  {
    name: 'AFC',
    code: 'AFC',
    description: 'Asian football encompasses diverse playing styles and rapidly improving leagues. Our predictions consider the unique characteristics of each sub-region, from the technical J-League to the physical K-League and the growing Chinese Super League.',
    topTeams: ['Al Hilal', 'Urawa Red Diamonds', 'Jeonbuk Motors', 'Shanghai SIPG', 'Persepolis'],
    leagues: ['J1 League', 'K League 1', 'Chinese Super League', 'Saudi Pro League', 'AFC Champions League']
  },
  {
    name: 'CAF',
    code: 'CAF',
    description: 'African football is known for its athleticism, pace, and passionate support. Our AI model accounts for the unique challenges of African football, including travel logistics, varying pitch conditions, and the impact of player availability due to European club commitments.',
    topTeams: ['Al Ahly', 'Wydad Casablanca', 'Kaizer Chiefs', 'TP Mazembe', 'Raja Casablanca'],
    leagues: ['CAF Champions League', 'Egyptian Premier League', 'South African Premier Division', 'Moroccan Botola', 'Tunisian Ligue 1']
  },
  {
    name: 'OFC',
    code: 'OFC',
    description: 'Oceanian football may be smaller in scale but offers unique insights into island football dynamics. Our predictions consider the travel challenges, limited professional infrastructure, and the dominance of Australian and New Zealand clubs in regional competitions.',
    topTeams: ['Auckland City', 'Team Wellington', 'Sydney FC', 'Melbourne Victory', 'Western Sydney'],
    leagues: ['A-League', 'New Zealand Football Championship', 'OFC Champions League', 'National Soccer League']
  }
];

const ConfederationSection = () => {
  const [selectedConfederation, setSelectedConfederation] = useState<Confederation>(confederations[0]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <span className="mr-2">🌍</span>
              Global Coverage
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Worldwide Football Analysis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered prediction system covers all major football confederations worldwide, 
              adapting to regional playing styles, cultural factors, and competitive dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Confederation Selector */}
            <div className="lg:col-span-1">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">Confederations</h3>
              <div className="space-y-2">
                {confederations.map((confederation) => (
                  <button
                    key={confederation.code}
                    onClick={() => setSelectedConfederation(confederation)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedConfederation.code === confederation.code
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-card hover:border-primary/50 text-foreground hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{confederation.name}</div>
                        <div className={`text-sm ${
                          selectedConfederation.code === confederation.code 
                            ? 'text-primary/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {confederation.code}
                        </div>
                      </div>
                      <span className={`transition-transform ${
                        selectedConfederation.code === confederation.code ? 'rotate-90' : ''
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
                      {selectedConfederation.name}
                    </h3>
                    <p className="text-muted-foreground">{selectedConfederation.code}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {selectedConfederation.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Top Teams */}
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">🏆</span>
                      <h4 className="font-semibold text-foreground">Top Teams</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedConfederation.topTeams.map((team, index) => (
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
                      <h4 className="font-semibold text-foreground">Major Competitions</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedConfederation.leagues.map((league) => (
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
                Why Choose Goal Genius for Football Predictions?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Advanced AI Technology</h4>
                  <p className="mb-4">
                    Our state-of-the-art machine learning algorithms analyze thousands of data points 
                    including team performance, player statistics, historical matchups, and current form 
                    to generate highly accurate predictions.
                  </p>
                  
                  <h4 className="font-semibold text-foreground mb-3">Global Coverage</h4>
                  <p>
                    From the Premier League to Copa Libertadores, we cover over 50 major leagues 
                    and tournaments across all six FIFA confederations, ensuring comprehensive 
                    football coverage worldwide.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Proven Track Record</h4>
                  <p className="mb-4">
                    With consistently high accuracy rates across different leagues and competitions, 
                    our predictions have helped thousands of football enthusiasts make informed decisions.
                  </p>
                  
                  <h4 className="font-semibold text-foreground mb-3">Weekly Updates</h4>
                  <p>
                    Our model runs fresh predictions every week, incorporating the latest team form,
                    historical matchups, and league data so you always have up-to-date insights before each match day.
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