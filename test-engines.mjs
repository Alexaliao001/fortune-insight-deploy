import { ALL_CARDS, SPREADS, drawCards, formatDrawnCardsForPrompt, getSpreadById } from './server/tarot-database.ts';
import { calculateBazi, formatBaziForPrompt } from './server/bazi-engine.ts';
import { findSymbolsByText, identifyTheme, formatSymbolsForPrompt } from './server/dream-symbols.ts';

console.log('=== TAROT DATABASE ===');
console.log('Total cards:', ALL_CARDS.length);
console.log('Spreads:', SPREADS.map(s => s.id));
const drawn = drawCards('three-card');
console.log('Drawn cards:', drawn.map(d => d.card.name + (d.isReversed ? ' (R)' : '')));
const spread = getSpreadById('three-card');
const prompt = formatDrawnCardsForPrompt(drawn, spread, 'Will I find love?', 'en');
console.log('Prompt length:', prompt.length);
console.log(prompt.slice(0, 800));

console.log('\n=== BAZI ENGINE ===');
const chart = calculateBazi(1990, 6, 15, 14, 30, 'male');
console.log('Day Master:', chart.dayMaster);
console.log('Five Elements:', chart.fiveElements);
console.log('Dominant:', chart.dominantElement, 'Weakest:', chart.weakestElement);
const baziPrompt = formatBaziForPrompt(chart, 'en');
console.log('BaZi Prompt length:', baziPrompt.length);
console.log(baziPrompt.slice(0, 800));

console.log('\n=== DREAM SYMBOLS ===');
const dreamText = 'I was flying over an ocean and saw a snake in the water';
const symbols = findSymbolsByText(dreamText, 'en');
console.log('Found symbols:', symbols.map(s => s.name));
const theme = identifyTheme(symbols.map(s => s.id));
console.log('Theme:', theme?.name);
const dreamPrompt = formatSymbolsForPrompt(symbols, dreamText, theme, 'en');
console.log('Dream Prompt length:', dreamPrompt.length);
console.log(dreamPrompt.slice(0, 500));
