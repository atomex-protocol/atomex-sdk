# Atomex SDK

## SDK components

The Atomex SDK has mainly 2 components:

- API
- Util

### API

The API module in the sdk provides a wrapper for all the atomex api endpoints. To start using the atomex api wrappers follow these steps:

1. Import API module

```js
const { API } = require("atomex-sdk");
//or
import { API } from "atomex-sdk";
```

2. Connect to supported network [mainnet/testnet]

```js
API.connect("mainnet");
//or
API.connect("testnet");
```

3. Use different API wrappers as required eg.

```js
// follow documentation for actual function signature
API.getAuthToken("...");
API.getOrders("...", "...");
```

### Util

The Util module contains the different utility functions and blockchain helper functions for the supported blockchains (Ethereum & Tezos)

To use the Util module follow these steps:

1. Import Util module

```js
const { Util } = require("atomex-sdk");
//or
import { Util } from "atomex-sdk";
```

2. Connect to supported network [mainnet/testnet]

- Singleton Approach :

```js
Util.Ethereum.connect("mainnet", "optional rpc link");
//or
Util.Ethereum.connect("testnet", "optional rpc link");
//or
Util.Tezos.connect("mainnet", "optional rpc link");
//or
Util.Tezos.connect("testnet", "optional rpc link");
```

- `new` Object Approach

```js
const ethereum = new Util.EthereumUtil();
ethereum.connect("mainnet", "optional rpc link");
//or
const tezos = new Util.TezosUtil();
tezos.connect("mainnet", "optional rpc link");
```

3. Use the blockchain helpers as required

```js
// follow documentation for actual function signature
Util.Ethereum.initiate({ data });
//or
Util.Tezos.initiate({ data });
// or using created object
ethereum.initiate({ data });
```

4. Other util functions can be directly accessed using the `Util` module:

```js
// follow documentation for actual function signature
const msg = Util.getAuthMessage("...");
```
