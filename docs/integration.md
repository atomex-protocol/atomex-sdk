# Integration guide

These are best practices and typical scenarios when integrating Atomex protocol in your wallet/dapp.


### Don't trust the server

We will mostly rely on Atomex API in the tutorial and although it might seem as a possible attack vector or a single point of failure it will be shown that with additional checks we can achieve a system with minimal trust.

In order not to lose funds the Client MUST:

* Lock funds (send the ack "initiate" transaction) ONLY AFTER the initiate transaction from the Market Maker has enough confirmations (depends on the network);
* Redeem funds UNTIL the expiration time OR delegate that to a third party (see Watch Tower section).

Since #2 is effectively resolved by a competitive pool of Watch Towers, the only thing that we have to double check is that MM's "initiate" is on-chain. Atomex API provides both transaction and block ID so it is possible to verify the correctness using just plain RPC of an according node.


## Choosing sides

Due to how Atomex authentication works (see the corresponding section in the API doc) and in order to simplify the UX, it is recommended to split the process of selecting swap legs (exchanging assets) into two steps:

1. Let the user choose the networks (base currencies) and the direction, e.g. Ethereum -> Tezos (including ERC tokens to FA tokens);
2. Based on the current balances (retrieved from the wallet) and pairs supported by Atomex, construct a list of options available for the user.


## Available liquidity and prices

The order size has both upper and lower bounds:

*   There is a minimum allowed amount per each traded pair (returned by the symbols API endpoint);
*   Order size is obviously limited by the account balance;
*   One cannot buy/sell more than available in the order book.

Keep in mind that you have to consider the redeem reward when calculating the resulting amount that will be received. Also note transaction fees when validating the order size, always keep a reserve.  
It's a good practice to allow users to edit both sending and receiving amounts.


### 1 to 1 matching `SolidFillOrKill`

In case you are using the 1-1 order matching scheme you have to take the order granularity into account as well: order size is limited by the maximum counter order amount available in the order book.  
Note that the resulting price might not be the best, as the best order size could be smaller than yours.


## Sending an order

Once we determine the amount and price we are ready to send an order (side and symbol are implied by the chosen direction and swap legs). Note, that you have to attach two additional structures:

* Proof that Client owns sufficient funds — we can reuse the signature we obtained during the authentication;  
* Swap requisites — Client's receiving address and swap lifetime. The counterparty MUST use these parameters when initiating the swap and Client has to validate them before sending an `ack` initiate transaction.

It's important to show the breakdown of the resulting costs to the user:

*   Amount that will be received
*   Amount to be sent: body + redeem reward
*   Estimated tx fees


## tracking and validating the initiate tx

In networks with probabilistic finality, as a rule, there are historically verified and commonly used numbers of confirmations that reduce the risk of rollback to negligible. However, it is sometimes possible to reduce this time slot without sacrificing security. E.g. in Tezos we can say that if the block includes 32 endorsements it's highly unlikely it will be reverted.

Another compromise between UX responsiveness and rate limiting is the way you query the RPC node for validating the transaction. The recommended approach is to estimate the time till the next block, sleep for this period, and only after that start polling at a higher rate to catch the change of the head.

Client has to check the transaction parameters against the requisites he specified in the order. Additionally one MUST check that the secret hash in tx parameters matches the one specified in the counterparty's requisites.

In order to improve UX it's recommended to update the transaction status as soon as it changes following all the phases: from the moment tx is seen on the network (in mempool), then 1 confirmation, 2 confirmations, etc.

## Sending `ack` initiate tx

Once the initiator's transaction is confirmed and validated you can construct the ack initiate:

*   Ensure your parameters match the requisites specified by your counterparty
*   Ensure initiator's lock time is greater than yours, it's IMPORTANT

If you are making a token transfer, you will need to send an approval in advance.


## Waiting for completion

The consequent swap status updates can be tracked using the API. Note that the swap can end both with success and failure, but anyways your funds will be either redeemed or refunded by the watch tower.


## Recovering the state

Atomex allows to query all the swaps and orders for a particular account. This should be done right after the authentication and then periodically updated (only active items, there's no need to update completed swaps). 

You may note that this is only possible when the user has already chosen the networks/direction, so ideally you should also store active items (orders and swaps) somewhere. That way you will be able to signal that there are items requiring some action at the very beginning of interaction with the user.


## Manual redeem/refund

Although the system of watchtowers is pretty reliable, it might be a good thing to have an emergency button just in case. Also, you can lower the costs (eliminating the redeem reward) while sacrificing the UX (additional interaction, need to wait longer, need to have enough funds to make a tx).


### Troubleshooting

TBD