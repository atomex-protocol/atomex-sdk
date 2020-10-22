# Integration guide

These are best practices and typical scenarios when integrating Atomex protocol in your wallet/dapp.  


### Don't trust the server

We will mostly rely on Atomex API in the examples and although it might seem as a possible attack vector or a single point of failure it will be shown that with additional checks we can achieve a system with minimal trust.  

In order not to lose funds the Client must:
1. Lock funds (send the `ack` "initiate" transaction) ONLY AFTER the initiate transaction from the Market Maker has enough confirmations (depends on the network);
2. Remeed funds UNTIL the expiration time OR delegate that to a third party (see Watch Tower section).

Since #2 is effectively resolved by a competitive pool of Watch Towers, the only thing that we have to double check is that MM's "initiate" is on-chain. Atomex API provides both transaction and block ID so it is possible to verify the correctness using just plain RPC of an according node.

## One-way bridge


## Available pairs


## Available liquidity


## Sending an order

Once we determine the amount and price we are ready to send an order (side and symbol are fixed in our case: _Buy XTZ/ETH_). Note, that you have to attach two additional structures:
1. Proof that Client owns sufficient funds — we can reuse the signature we obtained during the authentication;
2. Swap parameters — Client's receiving address, reward for redeem (can vary depending on the currency and network fees), and swap lifetime.

Check lock time! (initiator's lock time must be > acceptor's)

## Waiting for initiate tx

In networks with probabilistic finality, as a rule, there are historically verified and commonly used numbers of confirmations that reduce the risk of rollback to negligible. However, it is sometimes possible to reduce this time slot without sacrificing security. E.g. in Tezos we can say that if the block includes 32 endorsements it's highly unlikely it will be reverted.  

Another compromise between UX responsiveness and rate limiting is the way you query the RPC node for validating the transaction. The recommended approach is to estimate the time till the next block, sleep for this period, and only after that start polling at a higher rate to catch the change of the head.  

## Sending ack initiate tx


## Waiting for completion


## Recovering the state

In our case, the state is the current status of orders and swaps. It can be gathered by a single request but we need to authenticate first. Since we are dealing with a one-way conversion, Client's "initiate" transaction will be on Ethereum network thus we will use the Metamask account for signing an authentication message. **This is the first interaction with the user**.  

> We know that the authorization token is valid for several hours (we should check the expiration timestamp), thus it makes sense to store it (e.g. in browser localstorage) for further reuse.

## Handling errors
