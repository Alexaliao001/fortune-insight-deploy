/**
 * T07: keyword chips — re-exports deck DB lookup for client.
 * Source of truth: server/tarot-database.ts (keywords / keywordsChinese).
 */
export { keywordsForCardName, getCardByName } from "../../../server/tarot-database";
