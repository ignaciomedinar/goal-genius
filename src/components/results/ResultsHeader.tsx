import { getTranslations } from 'next-intl/server';

const ResultsHeader = async () => {
  const t = await getTranslations('resultsHeader');

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
          <span className="mr-2">📊</span>
          {t('badge')}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t('title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-card border border-border rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">🔍</span>
            {t('filterHint')}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">⬇️</span>
            {t('exportHint')}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {t('clickHint')}
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;
