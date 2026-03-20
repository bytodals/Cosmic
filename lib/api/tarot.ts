import { TarotCard, TarotResponse } from "../types";

const BASE_URL = 'https://freehoroscopeapi.com/api/v1';

/**
 * Fetch `count` random tarot cards from the public API.
 * @param count number of cards to return (API param `n`)
 * @param includeMinor include minor arcana in the draw (API param `minor`)
 */
export async function fetchRandomTarot(count = 1, includeMinor = false): Promise<TarotCard[]> {
  const params = new URLSearchParams();
  params.set('n', String(count));
  if (includeMinor) params.set('minor', 'true');

  const url = `${BASE_URL}/tarot/cards/random?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Tarot API error ${res.status}: ${res.statusText}`);
  }

  const json: TarotResponse = await res.json();

  if (!json || !Array.isArray(json.cards)) {
    throw new Error('Invalid response from tarot API');
  }

  return json.cards;
}


//Fetch all tarot cards  
export async function fetchAllTarotCards(): Promise<TarotCard[]> {
  const url = `${BASE_URL}/tarot/cards`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tarot API error ${res.status}`);
  const json: TarotResponse = await res.json();
  if (!json || !Array.isArray(json.cards)) throw new Error('Invalid tarot list response');
  return json.cards;
}
