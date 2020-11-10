# Atomex SDK

Please read the following documents prior to start building on this SDK:
1. [Overview of the Atomex protocol and roles](docs/overview.md)
2. [Atomex protocol entities and API guide](docs/api.md)
3. [Atomex integration best practices](docs/integration.md)

In order to run the interactive tutorial:
1. Make sure all dependencies are installed `make install`
2. Run `make tutorial`

Check out the docs at [sdk.atomex.me](https://sdk.atomex.me)

## SDK components

The Atomex SDK has mainly 2 components:

- Atomex REST API wrapper `Atomex`
- Various helpers for each supported currency/token (derived from `Helpers` class)

Currently SDK supports the following currencies/tokens:
- `XTZ` (tez) — `TezosHelpers`
- `ETH` (ether) — `EthereumHelpers`

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