import { DataPoint } from "../data/dataset";

interface WordCounts {
  [word: string]: { toxic: number; safe: number };
}

export class NaiveBayesClassifier {
  private wordCounts: WordCounts = {};
  private classCounts = { toxic: 0, safe: 0 };
  private vocabSize = 0;

  constructor() {}

  private tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0);
  }

  public train(data: DataPoint[]) {
    this.wordCounts = {};
    this.classCounts = { toxic: 0, safe: 0 };
    this.vocabSize = 0;

    data.forEach(item => {
      this.classCounts[item.label]++;
      const tokens = this.tokenize(item.text);
      
      tokens.forEach(token => {
        if (!this.wordCounts[token]) {
          this.wordCounts[token] = { toxic: 0, safe: 0 };
          this.vocabSize++;
        }
        this.wordCounts[token][item.label]++;
      });
    });
  }

  public predict(text: string): number {
    const tokens = this.tokenize(text);
    
    let logProbToxic = 0;
    let logProbSafe = 0;

    const totalToxicWords = Object.values(this.wordCounts).reduce((sum, count) => sum + count.toxic, 0);
    const totalSafeWords = Object.values(this.wordCounts).reduce((sum, count) => sum + count.safe, 0);

    tokens.forEach(token => {
      const counts = this.wordCounts[token] || { toxic: 0, safe: 0 };
      
      logProbToxic += Math.log((counts.toxic + 1) / (totalToxicWords + this.vocabSize));
      
      logProbSafe += Math.log((counts.safe + 1) / (totalSafeWords + this.vocabSize));
    });

    const totalDocs = this.classCounts.toxic + this.classCounts.safe;
    logProbToxic += Math.log(this.classCounts.toxic / totalDocs);
    logProbSafe += Math.log(this.classCounts.safe / totalDocs);

    const toxicityProbability = 1 / (1 + Math.exp(logProbSafe - logProbToxic));
    return Math.floor(toxicityProbability * 100);
  }
}