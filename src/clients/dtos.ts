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

export interface OrderBookDto {
  updateId: number;
  symbol: string;
  entries: OrderBookEntryDto[];
}

export interface OrderBookEntryDto {
  side: 'Buy' | 'Sell';
  price: number;
  qtyProfile: number[];
}
