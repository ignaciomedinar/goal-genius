// Icons replaced with emojis for compatibility

const PredictionsHeader = () => {
  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
          <span className="mr-2">📅</span>
          Current Week Predictions
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Football Match Predictions
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse this week's football match predictions with advanced filtering options. 
          Export data, view detailed analysis, and access comprehensive match insights.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-card border border-border rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">🔍</span>
            Filter by league, date, or probability
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">⬇️</span>
            Export predictions to CSV
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Click any match for detailed analysis
        </div>
      </div>
    </div>
  );
};

export default PredictionsHeader;