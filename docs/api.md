# Atomex API

Open API specification is available at [api.test.atomex.me/v1/docs](https://api.test.atomex.me/v1/docs)

## Authentication

The Client is identified by a public key. In order to prove that he owns the corresponding private key, Client has to sign a message that must include current time and some optional message:
* Message should explain to users what they are signing (e.g. sign in);
* Timestamp is used for 1) syncing client time with the server 2) preventing replay attacks (each subsequent auth request must use a greater value);
* The format is `<message (optional)><unix timestamp (UTC, milliseconds)>`, e.g. `Signing in 1601407718000`  

Roughly speaking, the first time server sees your public key is a "sign up". Each consequent auth request is essentially a "sign in".  

If the signature is correct, Atomex returns a JWT token that must be attached to every subsequent request via "Authorization" header: `Authorization: Bearer <token>`. This token is valid for a specified time period. You can track the token expiration yourself (Atomex attaches expiration time when issues a token) or just handle the next `401` error code.  
Authentication is required only for managing orders and swaps (both requesting and updating data).  

For Atomex to understand how you generated the signature, you must also specify the algorithm used when sending the order. Сurrently the following schemes are supported:
* `Ed25519` — the EdDSA signature scheme using SHA-512 (SHA-2) and Curve25519;
* `Ed25519:Blake2b` — same, but the data is hashed (Blake2b) beforehand (Tezos-specific);
* `Sha256WithEcdsa:Secp256k1` — the EcDSA scheme using SHA256 and Secp256k1 curve.

In case you integrate Atomex into a multicurrency HD wallet it would make sense to have a dedicated key pair for authentication purposes only. That way you will always able to recover it from the seed.  
However if you integrate Atomex into a web dapp that doesn't handle any keys and just sends signing requests it might become a problem: which account should be used for authentication? How to properly recover after a page reload?  
In general case you'd probably have to let the user choose which wallet to use for sign in and save that choice somewhere. If you are building a one-direction gateway, things are much simpler: the wallet used to sign the initiate transaction is also used for signing the authentication request.  


## Market data

Atomex exchange provides indicative quotes (best bid and ask) per each traded pair, however for placing an order it's better to rely on the entire orderbook data.  

Unlike the aggregated list of orders usually provided by exchanges, Atomex also shows the structure of orders at each price level. This is important because Atomex allows partial execution and each order match will result in a swap.

```
buy qty | px  | sell qty 
        | 400 | 50
        | 300 | 25 100
------------------------- asks/bids, 300-200=100 is the price spread
    100 | 200 | <-- somebody wants to buy 100 items at price 200
  10 30 | 100 | <-- two orders at a single price level   
```

Typically there are two relatively large limit orders on both sides maintained by a Market Maker, so granularity is a rare thing.  

Order books are updated right after an order is sent or filled. When you request an order book you receive an actual state at this point of time.  

### Symbols

Atomex provides a separate endpoint with all symbols (trading pairs) listed on the exchange. Additionally there is information about minimum order amount per each symbol.  

A symbol has the following format:
`{quoted_currency}/{base_currency}` where base currency always has larger market cap than the quoted one, i.e. ETH/BCD, XTZ/ETH, but not BTC/XTZ.  
Buying XTZ/ETH in atomic swap terms means that you send your Ether and receive Tez. Selling XTZ/ETH is sending Tez and receiving Ether in return.


## Orders

Atomex does not differentiate limit and market orders, but supports several execution types:
* `FillOrKill` — execute an order immediately and completely or not at all;
* `SolidFillOrKill` — execute an order immediately, completely, and in a single match (swap) or not at all;
* `Return` — aka GoodTillCancel, order is active until either being filled or cancelled (available for MM only atm)
* `ImmediateOrCancel` — execute all or part immediately and then cancels any unfilled portion of the order (available for MM only atm)

When you place an order it is required to prove that you have sufficient funds to perform a trade. In case you combine funds from multiple addresses you have to provide valid signatures for each of them. Note, that in some cases you can reuse message+timestamp from the authentication step.  

Finally you have to specify several swap parameters when sending an order. Client has to provide an address that will receive the redeemed tokens, time period before the expiration, and reward that will be paid to a Watch Tower.  
Although this data is not necessary at this step and can be specified later, it's recomended for Clients to do that in order to reduce the number of interactions.  

Placing an order can fail due to several reasons:
* `400` — order parameters are invalid;
* `403` — Client is not authorized to use this order type (e.g. only MM can currently place `Return` or `IOC` orders);
* `422` — an attempt of cross trade (your order is matched with another one which is also yours).

If everything is ok you will receive an internal `long` order ID in return, which then can be used to track the status of the order and all associated swaps and transactions. If you don't know the order ID you can query all orders (or only active ones) e.g. if you need to recover the state after a failure.  

An order can have one of the following statuses:
* `Pending` — order is received, but not yet placed;
* `Placed` — order is valid and placed into the order book (however for `IOC/FOK` orders you never see that state);
* `PartiallyFilled` — for `Return` orders (MM) only, means that the order is matched with a smaller one and the rest size remains in order book;
* `Filled` — applicable for all types, entire order size is executed and nothing left at the order book;
* `Canceled` — manually deleted `Return` order, or the unfilled part of the `IOC` order, or if an `FOK` order has no match;
* `Rejected` — currently not used.


## Swaps


Since Market Maker is the one who creates a swap, you will probably not use these endpoints. The only case when you need to update the swap is when you do an `ack` intiate transaction in Bitcoin (or other UTXO-based currency). Then you need to provide the transaction hash so that Exchange and Market Maker can track it.

### Party