# Atomex overview

"Atomex" is a common name for a set of services providing a trustless way to send cross-chain transactions. It includes:
- Smart contracts/bitcoin scripts for each supported chain that implement a modified atomic swap protocol;
- A backend service reponsible for order matching and monitoring transactions [exchange];
- Desktop/web/mobile wallets with a builtin support for Atomex protocol and exchange API.

In the result we get a system combining the advantages of centralized and decentralized exchanges.  

In addition to the components listed, Atomex provides market making software, and a special service (watch tower) that is responsible for finalizing swaps in case of emergency (will be covered in the next section).


## Protocol

Atomex protocol is a modified cross-chain atomic swap scheme adapted for use as an exchange backend. There are several differences from the classic implementation:
1. There are two types of users: regular Clients and Market Makers. MM places limit orders and always acts as a swap initiator, clients can only (currently) send in-price orders i.e. they are market takers.
2. Client redeem/refund txs can be made by a third-party (watch tower) for a specified reward. As a result, it reduces interactivity plus clients no longer required to have funds for invoking smart contracts.
3. It is possible to lock funds from multiple accounts during initiate phase, this is especially useful for UTXO-based currencies.

The sequence of actions of the parties looks like this:
> 1. Market Maker places a limit order (provides liquidity)
> 2. Client places an in-price order (takes liquidity)
> 3. Exchange matches orders and registers a deal
> 4. Market Maker initiates a swap (sends "initiate" transaction in chain `A` )
> 5. Client accepts the swap (sends `ack` "initiate" transaction in chain `B`)
> 6. Market Maker redeems funds locked by the Client and reveals the secret (sends "redeem" in chain `B`)
> 7. Watch Tower redeems funds locked by the MM in favor of the Client (sends "redeem" in chain `A`)

Until Step 4 no funds are locked and there are no risks both for Client and Market Maker. In case MM initiates a swap and the Client does not respond:
> 5. Market Maker makes a refund (sends "refund" in chain `A`)

In case Market Maker does not reveal the secret:
> 6. Watch Tower makes a refund in favor of the Client (sends "refund" in chain `B`)

You may noticed that Client sends only a single transaction in a single chain using an existing non-empty account.


## Roles

A system won't work until all participants are interested in its successful operation. Here is a short overview of the risk, economic incentives and discentives for various Atomex exchange roles.

### Exchange backend

This is a centralized service run by Atomex team that is responsible for order matching, swap tracking, authentication, and market data feeds. Atomex client software is built in a way it does not trust the server and re-checks all data on-chain. Server has no access to client funds and the worst thing it can do is to shut down, but even then client funds remain secure.  
The Exchange monitors and prevents violations by both market makers and users including denial-of-service attacks, price manipulations, and also breach of duty (MM).
Atomex Exchange takes a certain percentage of profit from market makers.

### Market Maker

Market Maker has to stay online at least 90% of time and hold limit orders on both sides (buy and sell). Technically it's a standalone service that consumes price feed from a third-party source (usually a centralized exchange) and moves limit orders towards the market price adjusting spread size depending on the volatility. MM's spread is usually larger than the one on a CEX. There are two reasons:
1. Atomic swap takes time and MM has to deal with price risks. Larger spread stabilizes the price and prevents requotes (situation when the order sent by user is rejected due to changed price).
2. MM includes his fee in the spread.

It should be noted that MM initiates swap (i.e. makes first initiate transaction) as soon as user places an order, meaning that he takes risks of abandoned-swap attack. The damage of this attack is summary fee for two transactions (initiate and refund) plus lost profit due to liquidity lock.  
Atomex exchange takes actions to minimize that risk (will be explained later).  

For 1:1 pairs (e.g. BTC/tzBTC) there are no price risks for MM and all he has to do is to provide liquidity. The ratio is actually `1:(1-fee)` where fee includes costs for minting/redeeming tokens + MM operational costs.

### Watch Tower

As was previously mentioned, a client has to make two transactions during the swap, but they are time stretched and require user to be online for up to few minutes AND have some funds to perform contract calls. In order to mitigate that Atomex enables third party to send the second transaction for the user.  
It is specified in the swap parameters what is the reward size and also who is the priority redeemer (will be added soon). Thus, we achieve the following:
- A wallet that integrates Atomex can set up a watch tower and specify the according reward and address when building swap parameters. By doing this he kills two birds: provides a smooth service to his clients and also has side profits.
- The right of priority redeem is valid only for a few minutes, after which it begins to be open to all comers. Thus, the redundancy of the protocol is increased with an additional economic incentive.

### Client

Client funds are safe during the whole swap process as long as he make all actions required in time (or somebody makes that for him). A special reward for anyone that makes refund or redeem for the Client essentially creates a profit opportunity and competitive environment. It reduces the probability of loss of funds due to the swap expiration.  

We have mentioned the "abandoned swap" attack and that the Exchange takes measures to avoid it. Usually it's required to make a small deposit in order to make sure the Client will not act maliciously. However in Atomex case it is crucial to have as less interactions as possible, thus an off-chain risk-assesment strategy is used instead.  

A Client is identified by his public key, and the authentication process is verification of a signature made with the corresponding private key. An integer Rating is assigned to every Client which is zero at the begining and can be increased or decreased depending on the number of successful or failed swaps. New users (0 rating) are allowed to trade if they have enough funds, that are stored on that particular account for at least several hours, plus the max order size is rather small. This is intended to minimize the potential loss of the MM and to prevent a massive DoS.
