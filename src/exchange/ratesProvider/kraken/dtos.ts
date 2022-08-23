export interface KrakenRatesDto {
  error: string[];
  result: Record<string, KrakenTickerInfo>;
}

export interface KrakenTickerInfo {
  /**
   * Ask 
   */
  a: [price: string, wholeLotVolume: string, lotVolume: string];

  /**
   * Bid 
   */
  b: [price: string, wholeLotVolume: string, lotVolume: string];

  /**
   * Last trade closed
   */
  c: [price: string, lotVolume: string];

  /**
   * Volume
   */
  v: [today: string, last24Hours: string];

  /**
   * Volume weighted average price
   */
  p: [today: string, last24Hours: string];

  /**
   * Number of trades
   */
  t: [today: number, last24Hours: number];

  /**
   * Low
   */
  l: [today: string, last24Hours: string];

  /**
   * High 
   */
  h: [today: string, last24Hours: string];

  /**
   * Today's opening price
   */
  o: string;
}
