# Integration guide

This is a step by step explanation of how to perform an atomic swap using Atomex API and plain RPC for corresponing chains.

### One-way swap DApp

What we have:
* Metamask with some ETH 
* Thanos with a fresh new account (not allocated)

What we want:
* Buy some XTZ with as least clicks as possible
* Wait as little as possible
* Not to lose our funds no matter what

#### Trust issues

We will mostly rely on Atomex API in this example and although it might seem as a possible attack vector or a single point of failure it will be shown that with additional checks we can achieve a system with minimal trust.  

In order not to lose funds the Client must:
1. Lock funds (send `ack` "initiate" transaction) ONLY AFTER the initiate transaction from the Market Maker has enough confirmations (depends on the network);
2. Remeed funds UNTIL the expiration time OR delegate that to a third party (see Watch Tower section).

Since #2 is effectively resolved by a competitive pool of Watch Towers, the only thing that we have to double check is that MM's "initiate" is on-chain. Atomex API provides both transaction and block ID so it is possible to verify the correctness using just plain RPC of an according node.  

##### Finality vs UX

In networks with probabilistic finality, as a rule, there are historically verified and commonly used numbers of confirmations that reduce the risk of rollback to negligible. However, it is sometimes possible to reduce this time slot without sacrificing security.  
*TODO(Tezos): endorsements*

#### Recover the state

In our case, the state is the current status of orders and swaps. It can be gathered by a single request but we need to authenticate first. Since we are dealing with a one-way conversion, Client's "initiate" transaction will be on Ethereum network thus we will use the Metamask account for signing an authentication message. **This is the first interaction with the user**.  

> We know that the authorization token is valid for several hours (we should check the expiration timestamp), thus it makes sense to store it (e.g. in browser localstorage) for further reuse.

#### Fetch market data

As was mentioned Market Makers maintain the price spread in a way that smoothes the fluctuations, so we don't need to update order book too oftenly. In our case (minimize interactions & costs) we are mostly interested in whether it's possible to fill an order with a single trade/swap (i.e. there is a limit order of size greater than ours at some price level).  
In general case such order can be at any price level (not necessary the best) so we should show the resulting price depending on the order amount entered.

#### Send order

Once we determine the amount and price we are ready to send an order (side and symbol are fixed in our case: _Buy XTZ/ETH_). Note, that you have to attach two additional structures:
1. Proof that Client owns sufficient funds — we can reuse the signature we obtained during the authentication;
2. Swap parameters — Client's receiving address, reward for redeem (can vary depending on the currency and network fees), and swap lifetime.

We use `SolidFillOrKill` order type so that there will be only single request for transaction signature.  


* `200`
* `400`
* `403`
* `422`

#### Track orders and swaps

Using order ID from the previous step we can check the status of the order:
* `Pending` 
* `Placed`
* `PartiallyFilled`
* `Filled`
* `Canceled`
* `Rejected`



#### Send "initiate" transaction




#### Emergency redeem/refund