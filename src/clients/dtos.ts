export interface QuoteDto {
  symbol: string;
  timeStamp: number;
  bid: number;
  ask: number;
}

export interface SymbolDto {
  name: string;
  minimumQty: number;
}
