# Atomex SDK

[![npm version](https://badge.fury.io/js/atomex-sdk.svg)](https://badge.fury.io/js/atomex-sdk)
[![Tests](https://github.com/atomex-me/atomex-sdk-ts/workflows/Tests/badge.svg?)](https://github.com/atomex-me/atomex-sdk-ts/actions?query=workflow%3ATests)
[![License: MIT](https://img.shields.io/badge/License-GPLv3-yellow.svg)](https://opensource.org/licenses/GPLv3)

Please read the following documents prior to start building on this SDK:
1. [Overview of the Atomex protocol and roles](docs/overview.md)
2. [Atomex protocol entities and API guide](docs/api.md)
3. [Atomex integration tutorial](docs/integration.md)

In order to run the interactive tutorial:
1. Make sure all dependencies are installed `make install`
2. Run `make tutorial`

Check out the typedoc reference at [sdk.atomex.me](https://sdk.atomex.me)

## SDK components

The Atomex SDK has mainly 2 components:

- Atomex REST API wrapper `Atomex`
- Various helpers for each supported currency/token (derived from `Helpers` class)

Currently SDK supports the following currencies/tokens:
- `XTZ` (tez) — `TezosHelpers`
- `ETH` (ether) — `EthereumHelpers`

## Usage

### Atomex API

Start working with Atomex API by creating an instance of the wrapper class. 
```js
const atomex = Atomex.create("testnet")
```

There are several predefined configs:
* `mainnet` — for production use
* `testnet` — for testing purposes, on-chain operations tracked in:
   - Ethereum: *Ropsten*
   - Tezos: *Carthagenet*
* `localhost` — for Atomex developers only (debugging purposes)

#### Public methods

Market data can be queried without authentication.

* [`Atomex.getSymbols`](https://sdk.atomex.me/classes/atomex.html#getsymbols)
* [`Atomex.getQuotes`](https://sdk.atomex.me/classes/atomex.html#getquotes)
* [`Atomex.getOrderBook`](https://sdk.atomex.me/classes/atomex.html#getorderbook)

There is also a helper for estimating order price:

* [`Atomex.getOrderPreview`](https://sdk.atomex.me/classes/atomex.html#getorderpreview)

#### Authentication

Atomex uses simple JWT scheme (without refresh tokens). Client is responsible for tracking the expiration and requesting new tokens.  
Read more about the authentication process in the [overview](docs/overview.md#Client).

```js
await atomex.getAuthToken({ 
    timeStamp: 1606227074301,
    message: 'Signing in ',
    publicKey:
   '419491b1796b13d756d394ed925c10727bca06e97353c5ca09402a9b6b07abcc',
    signature:
   'd937f12e7509f9266376a4cc6b51af91ad9f2e2c55ce9b3dfd870fc2e9d604b390a0f15d7ea277f8b6b9dfc1bb2ef2218d5ec4f87ba0399e6f6fb6d31ed09e03',
    algorithm: 'Ed25519:Blake2b'
})
```

The following structure is returned if everything is ok:
```json
{ "id":
   "dd03c7c3bc9daf23727d0c5759c72855eb1f36c9376f8a67b17fcd3dc07bfba1",
  "token":
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImRkMDNjN2MzYmM5ZGFmMjM3MjdkMGM1NzU5YzcyODU1ZWIxZjM2YzkzNzZmOGE2N2IxN2ZjZDNkYzA3YmZiYTEiLCJuYmYiOjE2MDYyMzk5OTQsImV4cCI6MTYwNjMyNjM5NCwiaWF0IjoxNjA2MjM5OTk0fQ.ljwKxcQk5mPbRRzZ9qaZioe7U1_3I7riklGCEj2xXPA",
  "expires": 1606326394064 
}
```

Assign the token to the Atomex instance:
```js
atomex.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImRkMDNjN2MzYmM5ZGFmMjM3MjdkMGM1NzU5YzcyODU1ZWIxZjM2YzkzNzZmOGE2N2IxN2ZjZDNkYzA3YmZiYTEiLCJuYmYiOjE2MDYyMzk5OTQsImV4cCI6MTYwNjMyNjM5NCwiaWF0IjoxNjA2MjM5OTk0fQ.ljwKxcQk5mPbRRzZ9qaZioe7U1_3I7riklGCEj2xXPA")
```

#### Private methods

With auth token assigned we can work with [orders](docs/api.md#Orders):
* [`Atomex.addOrder`](https://sdk.atomex.me/classes/atomex.html#addorder)
* [`Atomex.cancelOrder`](https://sdk.atomex.me/classes/atomex.html#cancelorder)
* [`Atomex.getOrder`](https://sdk.atomex.me/classes/atomex.html#getorder)
* [`Atomex.getOrders`](https://sdk.atomex.me/classes/atomex.html#getorders)

And [swaps](docs/api.md#Swaps):
* [`Atomex.addSwapRequisites`](https://sdk.atomex.me/classes/atomex.html#addswaprequisites)
* [`Atomex.getSwap`](https://sdk.atomex.me/classes/atomex.html#getswap)
* [`Atomex.getSwaps`](https://sdk.atomex.me/classes/atomex.html#getswaps)

### Helpers

For each currency create an according helper class instance:
```js
const tez = await TezosHelpers.create("testnet");
```

You can also specify custom RPC endpoint:
```js
cosnt eth = await EthereumHelpers.create("testnet", "https://ropsten.infura.io/v3/12345");
```

Helpers classes implement a single interface providing methods for interacting with Atomex contracts:
* [`Helpers.buildInitiateTransaction`](https://sdk.atomex.me/classes/helpers.html#buildinitiatetransaction)
* [`Helpers.buildAddTransaction`](https://sdk.atomex.me/classes/helpers.html#buildaddtransaction)
* [`Helpers.buildRedeemTransaction`](https://sdk.atomex.me/classes/helpers.html#buildredeemtransaction)
* [`Helpers.buildRefundTransaction`](https://sdk.atomex.me/classes/helpers.html#buildrefundtransaction)

Encoding/decoding crypto primitives:
* [`Helpers.encodePublicKey`](https://sdk.atomex.me/classes/helpers.html#encodepublickey)
* [`Helpers.encodeSignature`](https://sdk.atomex.me/classes/helpers.html#encodesignature)

Generating data for `Atomex.getAuthToken` request:
* [`Helpers.getAuthMessage`](https://sdk.atomex.me/classes/helpers.html#getauthmessage)

Estimating fees:
* [`Helpers.estimateInitiateFees`](https://sdk.atomex.me/classes/helpers.html#estimateinitiatefees)
* [`Helpers.estimateRedeemFees`](https://sdk.atomex.me/classes/helpers.html#estimateredeemfees)

Tracking transaction confirmations and validating parameters:
* [`Helpers.validateInitiateTransaction`](https://sdk.atomex.me/classes/helpers.html#validateinitiatetransaction)

#### Currency-specific helpers

* [`EthereumHelpers.recoverPublicKey`](https://sdk.atomex.me/classes/ethereumhelpers.html#recoverpublickey)


## Contributing

#### Install dependencies
```
make install
```

#### Run linter and compile the library
```
make
```

#### Run unit tests
```
make test
```

In order to update the OpenAPI specification:
```
make spec-update
```

#### Generate TypeDoc
```
make typedoc
```

#### Publish to NPM
Bump version in _package.json_, commit & push
```
make release
```