import { NaiveBayesClassifier } from "./naiveBayes";
import { TRAINING_DATA } from "../data/dataset";
import { AnalysisResult, ToxicityCategories } from "../types";

const classifier = new NaiveBayesClassifier();
let isTrained = false;

export const initializeModel = async () => {
  if (!isTrained) {
    await new Promise(resolve => setTimeout(resolve, 800));
    classifier.train(TRAINING_DATA);
    isTrained = true;
  }
};

const detectCategories = (text: string, isToxic: boolean): ToxicityCategories => {
  const t = text.toLowerCase();
  
  const hateKeywords = ['hate', 'benci', 'racist', 'die', 'mati', 'kill', 'bunuh', 'bangsat'];
  const harassKeywords = ['stupid', 'bodoh', 'idiot', 'goblok', 'ugly', 'jelek', 'loser', 'bacot'];
  
  const sexualKeywords = [
    'sex', 'porno', 'naked', 'telanjang', 
    'ngentod', 'memek', 'kontol', 'peju', 
    'mencium bibir', 'sange', 'bokep', 
    'colmek', 'coli', 'jembut', 'itil', 'nenen'
  ];
  
  const dangerKeywords = ['kill', 'bunuh', 'bomb', 'bom', 'attack', 'serang', 'perkosa'];
  const insultKeywords = ['stupid', 'idiot', 'goblok', 'tolol', 'bego', 'anjing', 'babi', 'kntl', 'ajg'];

  if (!isToxic) {
    return { hateSpeech: false, harassment: false, sexualContent: false, dangerousContent: false, insult: false };
  }

  return {
    hateSpeech: hateKeywords.some(w => t.includes(w)),
    harassment: harassKeywords.some(w => t.includes(w)),
    sexualContent: sexualKeywords.some(w => t.includes(w)),
    dangerousContent: dangerKeywords.some(w => t.includes(w)),
    insult: insultKeywords.some(w => t.includes(w)),
  };
};

export const analyzeTextToxicity = async (text: string): Promise<AnalysisResult> => {
  if (!isTrained) {
    await initializeModel();
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const toxicityScore = classifier.predict(text);
  const isToxic = toxicityScore > 60;
  
  const isIndonesian = text.toLowerCase().match(/(kamu|aku|tidak|bisa|yang|dan|di|ke|ng|memek|kontol)/);
  const detectedLanguage = isIndonesian ? "Indonesian" : "English";

  const categories = detectCategories(text, isToxic);

  if (isToxic && !Object.values(categories).some(Boolean)) {
    categories.insult = true;
  }

  return {
    toxicityScore,
    isToxic,
    detectedLanguage,
    categories,
    explanation: "",
    politeVersion: ""
  };
};