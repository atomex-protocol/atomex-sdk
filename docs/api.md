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

Finally, you should specify swap requisites (you can also do it later) that MUST be used by your counterparty (MM) when he makes the first "initiate" transaction. Client has to provide an address that will receive the redeemed tokens, time period after which refund is permitted, and size of the reward that is to be paid to the Watch Tower.  
It is also allowed to set a separate refund address (for UTXO-based currencies mostly).  
Market makers are allowed to specify the secret hash at this point but usually it makes more sense to do that AFTER the order is matched, because there can be partial execution.  

Placing an order can fail due to several reasons:
* `400` — order parameters are invalid;
* `403` — Client is not authorized to use this order type (e.g. only MM can currently place `Return` or `IOC` orders);
* `422` — an attempt of cross trade (your order is matched with another one which is also yours).

If everything is ok you will receive an internal order ID in return, which then can be used to track the status of the order and all associated swaps and transactions. If you don't know the order ID you can query all orders (or only active ones) e.g. if you need to recover the state after a failure.  

An order can have one of the following statuses:
* `Pending` — order is received, but not yet placed;
* `Placed` — order is valid and placed into the order book (however for `IOC/FOK` orders you never see that state);
* `PartiallyFilled` — for `Return` orders (MM) only, means that the order is matched with a smaller one and the rest size remains in order book;
* `Filled` — applicable for all types, entire order size is executed and nothing left at the order book;
* `Canceled` — manually deleted `Return` order, or the unfilled part of the `IOC` order, or if an `FOK` order has no match;
* `Rejected` — currently not used.

An order is considered **active** if it is in `Placed` or `PartiallyFilled` state.  

For accounting one can use the list of trades assosiated with the order. A trade contains final price, quantity, and the counterparty order ID.


## Swaps

Whenever an order is filled (either fully or partially) Atomex creates a swap object with an internal ID (which is different from the secret hash although there is a bijection). Every swap has two parties — initiator and acceptor. When you query a swap object from the API it returns `isInitiator` flag indicating whether you have initiated this swap or not, and two structures `user` (you) and `counterParty`. 

> E.g. Market Maker will receive `isInitiator: true`, `user` will stand for MM, and `counterParty` for the Client. Client will receive `isInitiator: false`, `user` also stands for the Client, and `counterParty` for the Market Maker.

Swap object inherits some data from the order, as well as two important fields (that are uninitialized at start):
* `secretHash` — set by the initiator after the swap is created; 
* `secret` — extracted from the initiator's "redeem" transaction.

Each swap party has several fields that are changing during the process. For convenience there is a top-level status describing the current state of a particular participant:
* `Created` — swap is created, but details and payments have not yet sent;
* `Involved` — requisites are fully specified;
* `PartiallyInitiated` — own funds are partially sent;
* `Initiated` — own funds are completely sent;
* `Redeemed` — counterparty's funds are redeemed;
* `Refunded` — own funds are refunded;
* `Lost` — own funds are lost (FATAL);
* `Jackpot` — own funds are refunded and counterparty's funds are redeemed (EXCEPTIONAL).

NOTE that the last two states are UNRECOVERABLE although very unlikely. Atomex encourages Market Makers to do refunds even in that edge cases and stimulates long-term commitments.

### Requisites

As was mentioned, swap requisites are the call parameters that your counterparty MUST specify in his "initiate" transaction. Swap requesites can be specified with the order send, or after an order match happened and Atomex internal swap object created. Naturally you are not able to set all the requisites (e.g. `secretHash`) prior to a trade because:
1. You don't know for sure if your order will be filled by a single party or it will be a multiswap execution;
2. If you are a Client, you cannot specify secret hash because it's Market Maker (your counterparty) who generates the secret.

Typically, a Client sets all fields except for _secretHash_ when sending an order, while MM specifies requisites after a swap object is created.  
Also NOTE that once you set any field you cannot override it afterwards.  
It is also crucial to prevent a reuse of secret: currently Atomex does not check that, but it's in the interests of the Market Maker to generate a truly random secret for each subsequent swap.

Requisites of two parties are independent except for the `lockTime`: it is required that initiator's lock time is GREATER than the acceptor's one. Otherwise initiator can both redeem the acceptor's funds and refund own. NOTE that requisites are just a way to communicate between parties, the Atomex server does only basic checks and Client / MM have to do the validation by themselves.

### Trades

As we recall, single order can spawn multiple swaps, but also single swap can be associated with multiple orders. Imagine if your hold two orders A and B at different price levels and someone has filled them both with C — it will end with two trades (A/C, B/C) and a single swap. In this case, the swap volume will be equal to the sum of trades, and the price will be equal to the weighted average price of trades.

### Transactions

Atomex tracks all the transactions/contract calls associated with a particular counterparty/swap and updates their statuses:
* `Pending` — seen on the network, not yet included in a block;
* `Confirmed` — included, has at least one confirmation;
* `Canceled` — failed due to an error.

Currently there can be only 4 types of transactions:
* `initiate` — participant locks his funds;
* `add` — participant locks more funds (e.g. from another address);
* `redeem` — participant redeems counterparty's funds (commit);
* `refund` — participant returns his locked funds back (rollback);

NOTE that all API clients HAVE to validate those transactions themselves, more specifically:
1. Transaction is included in the right chain and has enough confirmations;
2. Transaction parameters are valid and in accordance with the requisites.
