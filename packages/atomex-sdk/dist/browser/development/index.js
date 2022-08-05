var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/atomex/atomex.ts
var Atomex = class {
  constructor(options) {
    this.options = options;
    __publicField(this, "authorization");
    __publicField(this, "exchangeManager");
    __publicField(this, "swapManager");
    __publicField(this, "signers");
    __publicField(this, "atomexContext");
    this.atomexContext = options.atomexContext;
    this.signers = options.managers.signersManager;
    this.authorization = options.managers.authorizationManager;
    this.exchangeManager = options.managers.exchangeManager;
    this.swapManager = options.managers.swapManager;
    if (options.blockchains)
      for (const blockchainName of Object.keys(options.blockchains))
        this.addBlockchain((_context) => options.blockchains[blockchainName]);
  }
  get atomexNetwork() {
    return this.atomexContext.atomexNetwork;
  }
  async addSigner(signer) {
    var _a, _b, _c;
    await this.signers.addSigner(signer);
    await ((_c = (_b = (_a = this.options.blockchains) == null ? void 0 : _a[signer.blockchain]) == null ? void 0 : _b.mainnet.blockchainToolkitProvider) == null ? void 0 : _c.addSigner(signer));
  }
  addBlockchain(factoryMethod) {
    const blockchainOptions = factoryMethod(this.atomexContext);
    const networkOptions = this.atomexNetwork == "mainnet" ? blockchainOptions.mainnet : blockchainOptions.testnet;
    if (networkOptions)
      this.atomexContext.providers.blockchainProvider.addBlockchain(networkOptions);
  }
  async swap(_newSwapRequestOrSwapId, _completeStage) {
    throw new Error("Not implemented");
  }
  dispose() {
    this.authorization.dispose();
    this.atomexContext.managers.exchangeManager.dispose();
    this.atomexContext.managers.swapManager.dispose();
    this.atomexContext.services.exchangeService.dispose();
    this.atomexContext.services.swapService.dispose();
  }
};

// src/atomex/atomexContext.ts
var _AtomexContext = class {
  constructor(atomexNetwork) {
    this.atomexNetwork = atomexNetwork;
    __publicField(this, "id");
    __publicField(this, "managers");
    __publicField(this, "services");
    __publicField(this, "providers");
    this.id = _AtomexContext.idCounter++;
    this.managers = new AtomexContextManagersSection(this);
    this.services = new AtomexContextServicesSection(this);
    this.providers = new AtomexContextProvidersSection(this);
  }
};
var AtomexContext = _AtomexContext;
__publicField(AtomexContext, "idCounter", 0);
var AtomexContextManagersSection = class {
  constructor(context) {
    this.context = context;
    __publicField(this, "_signersManager");
    __publicField(this, "_authorizationManager");
    __publicField(this, "_exchangeManager");
    __publicField(this, "_swapManager");
  }
  get signersManager() {
    if (!this._signersManager)
      throw new AtomexComponentNotResolvedError("managers.signersManager");
    return this._signersManager;
  }
  set signersManager(signersManager) {
    this._signersManager = signersManager;
  }
  get authorizationManager() {
    if (!this._authorizationManager)
      throw new AtomexComponentNotResolvedError("managers.authorizationManager");
    return this._authorizationManager;
  }
  set authorizationManager(authorizationManager) {
    this._authorizationManager = authorizationManager;
  }
  get exchangeManager() {
    if (!this._exchangeManager)
      throw new AtomexComponentNotResolvedError("managers.exchangeManager");
    return this._exchangeManager;
  }
  set exchangeManager(exchangeManager) {
    this._exchangeManager = exchangeManager;
  }
  get swapManager() {
    if (!this._swapManager)
      throw new AtomexComponentNotResolvedError("managers.swapManager");
    return this._swapManager;
  }
  set swapManager(swapManager) {
    this._swapManager = swapManager;
  }
};
var AtomexContextServicesSection = class {
  constructor(context) {
    this.context = context;
    __publicField(this, "_exchangeService");
    __publicField(this, "_swapService");
  }
  get exchangeService() {
    if (!this._exchangeService)
      throw new AtomexComponentNotResolvedError("services.exchangeService");
    return this._exchangeService;
  }
  set exchangeService(exchangeService) {
    this._exchangeService = exchangeService;
  }
  get swapService() {
    if (!this._swapService)
      throw new AtomexComponentNotResolvedError("services.swapService");
    return this._swapService;
  }
  set swapService(swapService) {
    this._swapService = swapService;
  }
};
var AtomexContextProvidersSection = class {
  constructor(context) {
    this.context = context;
    __publicField(this, "_blockchainProvider");
  }
  get blockchainProvider() {
    if (!this._blockchainProvider)
      throw new AtomexComponentNotResolvedError("providers.blockchainProvider");
    return this._blockchainProvider;
  }
  set blockchainProvider(blockchainProvider) {
    this._blockchainProvider = blockchainProvider;
  }
};
var AtomexComponentNotResolvedError = class extends Error {
  constructor(componentName) {
    super(AtomexComponentNotResolvedError.getMessage(componentName));
    __publicField(this, "name");
    __publicField(this, "componentName");
    this.componentName = componentName;
    this.name = this.constructor.name;
  }
  static getMessage(componentName) {
    return `Atomex "${componentName}" component has not resolved yet`;
  }
};

// src/blockchain/controlledCurrencyBalancesProvider.ts
var ControlledCurrencyBalancesProvider = class {
  constructor(currency, getBalanceImplementation) {
    this.currency = currency;
    this.getBalanceImplementation = getBalanceImplementation;
  }
  getBalance(address) {
    return this.getBalanceImplementation(address);
  }
};

// src/blockchain/atomexBlockchainProvider.ts
var AtomexBlockchainProvider = class {
  constructor() {
    __publicField(this, "currencyInfoMap", /* @__PURE__ */ new Map());
  }
  addBlockchain(networkOptions) {
    var _a, _b;
    for (const currency of networkOptions.currencies) {
      if (this.currencyInfoMap.has(currency.id))
        throw new Error("There is already currency added with the same key");
      const currencyOptions = networkOptions.currencyOptions[currency.id];
      const options = {
        currency,
        atomexProtocol: currencyOptions == null ? void 0 : currencyOptions.atomexProtocol,
        blockchainToolkitProvider: networkOptions.blockchainToolkitProvider,
        balanceProvider: (_a = currencyOptions == null ? void 0 : currencyOptions.currencyBalanceProvider) != null ? _a : this.createControlledBalancesProvider(currency, networkOptions.balancesProvider),
        swapTransactionsProvider: (_b = currencyOptions == null ? void 0 : currencyOptions.swapTransactionsProvider) != null ? _b : networkOptions.swapTransactionsProvider
      };
      this.currencyInfoMap.set(currency.id, options);
    }
  }
  getCurrencyInfo(currencyId) {
    const options = this.currencyInfoMap.get(currencyId);
    return options;
  }
  createControlledBalancesProvider(currency, balancesProvider) {
    return new ControlledCurrencyBalancesProvider(currency, (address) => balancesProvider.getBalance(address, currency));
  }
};

// src/utils/converters.ts
var converters_exports = {};
__export(converters_exports, {
  hexStringToObject: () => hexStringToObject,
  hexStringToString: () => hexStringToString,
  hexStringToUint8Array: () => hexStringToUint8Array,
  numberToTokensAmount: () => numberToTokensAmount,
  objectToHexString: () => objectToHexString,
  stringToHexString: () => stringToHexString,
  tokensAmountToNat: () => tokensAmountToNat,
  uint8ArrayToHexString: () => uint8ArrayToHexString
});
import BigNumber from "bignumber.js";

// src/native/index.browser.ts
import { Buffer as Buffer2 } from "buffer";

// src/utils/converters.ts
var hexStringToUint8Array = (hex) => {
  var _a;
  const integers = (_a = hex.match(/[\da-f]{2}/gi)) == null ? void 0 : _a.map((val) => parseInt(val, 16));
  return new Uint8Array(integers);
};
var uint8ArrayToHexString = (value) => Buffer2.from(value).toString("hex");
var stringToHexString = (value) => Buffer2.from(value, "utf8").toString("hex");
var hexStringToString = (value) => Buffer2.from(hexStringToUint8Array(value)).toString("utf8");
var objectToHexString = (value) => stringToHexString(JSON.stringify(value));
var hexStringToObject = (value) => {
  try {
    return JSON.parse(hexStringToString(value));
  } catch (e) {
    return null;
  }
};
var tokensAmountToNat = (tokensAmount, decimals) => {
  return new BigNumber(tokensAmount).multipliedBy(10 ** decimals).integerValue();
};
var numberToTokensAmount = (value, decimals) => {
  return new BigNumber(value).integerValue().div(10 ** decimals);
};

// src/utils/atomexUtils.ts
var atomexUtils_exports = {};
__export(atomexUtils_exports, {
  ensureNetworksAreSame: () => ensureNetworksAreSame
});
var ensureNetworksAreSame = (value1, value2) => {
  if ((typeof value1 === "string" ? value1 : value1.atomexNetwork) === (typeof value2 === "string" ? value2 : value2.atomexNetwork))
    return;
  throw new Error("Networks are different");
};

// src/utils/text.ts
var text_exports = {};
__export(text_exports, {
  capitalize: () => capitalize,
  padEnd: () => padEnd,
  padStart: () => padStart
});
var capitalize = (value) => {
  var _a;
  return value && ((_a = value[0]) == null ? void 0 : _a.toLocaleUpperCase()) + value.slice(1);
};
var stringPad = (string, isStart, maxLength, fillString = " ") => {
  if (String.prototype.padStart !== void 0)
    return string.padStart(maxLength, fillString);
  const stringLength = string.length;
  if (maxLength <= stringLength || fillString == "")
    return string;
  const fillLength = maxLength - stringLength;
  let filler = fillString.repeat(Math.ceil(fillLength / fillString.length));
  if (filler.length > fillLength)
    filler = filler.slice(0, fillLength);
  return isStart ? filler + string : string + filler;
};
var padStart = (string, maxLength, fillString = " ") => String.prototype.padStart !== void 0 ? string.padStart(maxLength, fillString) : stringPad(string, true, maxLength, fillString);
var padEnd = (string, maxLength, fillString = " ") => String.prototype.padEnd !== void 0 ? string.padEnd(maxLength, fillString) : stringPad(string, false, maxLength, fillString);

// src/utils/index.ts
var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var prepareTimeoutDuration = (durationMs) => Math.min(durationMs, 2147483647);

// src/blockchain/signersManager.ts
var SignersManager = class {
  constructor(atomexNetwork) {
    this.atomexNetwork = atomexNetwork;
    __publicField(this, "_signers", /* @__PURE__ */ new Set());
  }
  get signers() {
    return this._signers;
  }
  addSigner(signer) {
    atomexUtils_exports.ensureNetworksAreSame(this, signer);
    this._signers.add(signer);
    return Promise.resolve(signer);
  }
  async removeSigner(signerOrAddress, blockchain) {
    const signer = typeof signerOrAddress === "string" ? await this.findSigner(signerOrAddress, blockchain) : signerOrAddress;
    return signer ? this._signers.delete(signer) : false;
  }
  async findSigner(address, blockchain) {
    if (!this.signers.size)
      return void 0;
    const signerAndAddressPromises = [];
    for (const signer of this.signers) {
      if (blockchain && signer.blockchain !== blockchain)
        continue;
      const addressOrPromise = signer.getAddress();
      if (typeof addressOrPromise === "string") {
        if (addressOrPromise === address)
          return signer;
        else
          continue;
      }
      signerAndAddressPromises.push(addressOrPromise.then((address2) => [signer, address2]));
    }
    const signerAndAddressResults = await Promise.allSettled(signerAndAddressPromises);
    for (const signerAndAddressResult of signerAndAddressResults) {
      if (signerAndAddressResult.status !== "fulfilled") {
        continue;
      }
      if (signerAndAddressResult.value[1] === address)
        return signerAndAddressResult.value[0];
    }
    return void 0;
  }
};

// src/ethereum/utils/index.ts
import { ec as EC } from "elliptic";
var secp256k1Curve = null;
var getSecp256k1Curve = () => {
  if (!secp256k1Curve)
    secp256k1Curve = new EC("secp256k1");
  return secp256k1Curve;
};
var splitSignature = (hexSignature) => {
  const signatureBytes = converters_exports.hexStringToUint8Array(hexSignature);
  if (signatureBytes.length !== 64 && signatureBytes.length !== 65)
    throw new Error(`Invalid signature: ${hexSignature}`);
  let v = signatureBytes.length === 64 ? 27 + (signatureBytes[32] >> 7) : signatureBytes[64];
  if (v === 0 || v === 1)
    v += 27;
  const result = {
    r: uint8ArrayToHexString(signatureBytes.slice(0, 32)),
    s: uint8ArrayToHexString(signatureBytes.slice(32, 64)),
    v,
    recoveryParameter: 1 - v % 2
  };
  return result;
};
var recoverPublicKey = (hexSignature, web3MessageHash) => {
  const splittedSignature = splitSignature(hexSignature);
  const messageBuffer = Buffer2.from(web3MessageHash.startsWith("0x") ? web3MessageHash.substring(2) : web3MessageHash, "hex");
  const ecPublicKey = getSecp256k1Curve().recoverPubKey(messageBuffer, { r: splittedSignature.r, s: splittedSignature.s }, splittedSignature.recoveryParameter);
  return "0x" + ecPublicKey.encode("hex", false);
};

// src/ethereum/signers/web3EthereumSigner.ts
var _Web3EthereumSigner = class {
  constructor(atomexNetwork, web3) {
    this.atomexNetwork = atomexNetwork;
    this.web3 = web3;
    __publicField(this, "blockchain", "ethereum");
  }
  async getAddress() {
    const accounts = await this.web3.eth.getAccounts();
    const address = accounts[0];
    if (!address)
      throw new Error("Address is unavailable");
    return address;
  }
  getPublicKey() {
    return void 0;
  }
  async sign(message) {
    const address = await this.getAddress();
    const signatureBytes = await this.signInternal(message, address);
    const publicKeyBytes = recoverPublicKey(signatureBytes, this.web3.eth.accounts.hashMessage(message));
    return {
      address,
      publicKeyBytes: publicKeyBytes.startsWith("0x") ? publicKeyBytes.substring(2) : publicKeyBytes,
      signatureBytes: signatureBytes.substring(signatureBytes.startsWith("0x") ? 2 : 0, signatureBytes.length - 2),
      algorithm: _Web3EthereumSigner.signingAlgorithm
    };
  }
  signInternal(message, address) {
    return new Promise((resolve, reject) => this.web3.eth.personal.sign(message, address, "", (error, signature) => {
      return signature ? resolve(signature) : reject(error);
    }));
  }
};
var Web3EthereumSigner = _Web3EthereumSigner;
__publicField(Web3EthereumSigner, "signingAlgorithm", "Keccak256WithEcdsa:Geth2940");

// src/ethereum/currencies.ts
var ethereumNativeCurrency = {
  id: "ETH",
  name: "Ethereum",
  symbol: "ETH",
  blockchain: "ethereum",
  decimals: 18,
  type: "native"
};
var ethereumMainnetCurrencies = [
  ethereumNativeCurrency
];
var ethereumTestnetCurrencies = [
  ethereumNativeCurrency
];

// src/ethereum/balancesProviders/ethereumBalancesProvider.ts
var EthereumBalancesProvider = class {
  getBalance(_address, _currency) {
    throw new Error("Method not implemented.");
  }
};

// src/ethereum/swapTransactionsProviders/ethereumSwapTransactionsProvider.ts
var EthereumSwapTransactionsProvider = class {
  getSwapTransactions(_swap) {
    throw new Error("Method not implemented.");
  }
};

// src/ethereum/blockchainToolkitProviders/ethereumBlockchainToolkitProvider.ts
var EthereumBlockchainToolkitProvider = class {
  getReadonlyToolkit(_blockchain, _toolkitId) {
    throw new Error("Method not implemented.");
  }
  getToolkit(_blockchain, _address, _toolkitId) {
    throw new Error("Method not implemented.");
  }
  addSigner(_signer) {
    throw new Error("Method not implemented.");
  }
  removeSigner(_signer) {
    throw new Error("Method not implemented.");
  }
};

// src/common/models/importantDataReceivingMode.ts
var ImportantDataReceivingMode = /* @__PURE__ */ ((ImportantDataReceivingMode2) => {
  ImportantDataReceivingMode2[ImportantDataReceivingMode2["Local"] = 0] = "Local";
  ImportantDataReceivingMode2[ImportantDataReceivingMode2["Remote"] = 1] = "Remote";
  ImportantDataReceivingMode2[ImportantDataReceivingMode2["SafeMerged"] = 2] = "SafeMerged";
  return ImportantDataReceivingMode2;
})(ImportantDataReceivingMode || {});

// src/common/inMemoryCurrenciesProvider.ts
var InMemoryCurrenciesProvider = class {
  constructor(currencies) {
    __publicField(this, "currencies");
    this.currencies = new Map(currencies instanceof Map ? currencies : Object.entries(currencies));
  }
  getCurrency(currencyId) {
    return Promise.resolve(this.currencies.get(currencyId));
  }
  addCurrency(currency) {
    this.currencies.set(currency.id, currency);
  }
  removeCurrency(currencyId) {
    return this.currencies.delete(currencyId);
  }
};

// src/core/eventEmitter.ts
var EventEmitter = class {
  constructor() {
    __publicField(this, "listeners", /* @__PURE__ */ new Set());
  }
  addListener(listener) {
    this.listeners.add(listener);
    return this;
  }
  removeListener(listener) {
    if (this.listeners.has(listener))
      this.listeners.delete(listener);
    return this;
  }
  removeAllListeners() {
    this.listeners = /* @__PURE__ */ new Set();
    return this;
  }
  emit(...args) {
    if (!this.listeners.size)
      return;
    if (this.listeners.size === 1) {
      this.listeners.values().next().value(...args);
    } else {
      [...this.listeners].forEach((listener) => listener(...args));
    }
  }
};

// src/exchange/exchangeManager.ts
var ExchangeManager = class {
  constructor(exchangeService) {
    this.exchangeService = exchangeService;
    __publicField(this, "events", {
      orderUpdated: new EventEmitter(),
      orderBookUpdated: new EventEmitter(),
      topOfBookUpdated: new EventEmitter()
    });
    __publicField(this, "handleExchangeServiceOrderUpdated", (updatedOrder) => {
      this.events.orderUpdated.emit(updatedOrder);
    });
    __publicField(this, "handleExchangeServiceOrderBookUpdated", (updatedOrderBook) => {
      this.events.orderBookUpdated.emit(updatedOrderBook);
    });
    __publicField(this, "handleExchangeServiceTopOfBookUpdated", (updatedQuotes) => {
      this.events.topOfBookUpdated.emit(updatedQuotes);
    });
    this.attachEvents();
  }
  getOrder(accountAddress, orderId, _mode = 2 /* SafeMerged */) {
    return this.exchangeService.getOrder(accountAddress, orderId);
  }
  getOrders(accountAddress, selector, _mode = 2 /* SafeMerged */) {
    return this.exchangeService.getOrders(accountAddress, selector);
  }
  getSymbols() {
    return this.exchangeService.getSymbols();
  }
  getTopOfBook(symbolsOrDirections) {
    return this.exchangeService.getTopOfBook(symbolsOrDirections);
  }
  async getOrderBook(symbolOrDirection) {
    return this.exchangeService.getOrderBook(symbolOrDirection);
  }
  addOrder(accountAddress, newOrderRequest) {
    return this.exchangeService.addOrder(accountAddress, newOrderRequest);
  }
  cancelOrder(accountAddress, cancelOrderRequest) {
    return this.exchangeService.cancelOrder(accountAddress, cancelOrderRequest);
  }
  cancelAllOrders(accountAddress, cancelAllOrdersRequest) {
    return this.exchangeService.cancelAllOrders(accountAddress, cancelAllOrdersRequest);
  }
  getRewardForRedeem(_nativeTokenUsdPrice, _nativeTokenCurrencyPrice) {
    throw new Error("Not implemented");
  }
  attachEvents() {
    this.exchangeService.events.orderUpdated.addListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.events.orderBookUpdated.addListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.events.topOfBookUpdated.addListener(this.handleExchangeServiceTopOfBookUpdated);
  }
  detachEvents() {
    this.exchangeService.events.orderUpdated.removeListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.events.orderBookUpdated.removeListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.events.topOfBookUpdated.removeListener(this.handleExchangeServiceTopOfBookUpdated);
  }
  dispose() {
    this.exchangeService.dispose();
  }
};

// src/swaps/swapManager.ts
var SwapManager = class {
  constructor(swapService) {
    this.swapService = swapService;
    __publicField(this, "events", {
      swapUpdated: new EventEmitter()
    });
    __publicField(this, "handleSwapServiceSwapUpdated", (updatedSwap) => {
      this.events.swapUpdated.emit(updatedSwap);
    });
    this.attachEvents();
  }
  getSwap(swapId, addressOrAddresses, _mode = 2 /* SafeMerged */) {
    return this.swapService.getSwap(swapId, addressOrAddresses);
  }
  getSwaps(addressOrAddresses, selector, _mode = 2 /* SafeMerged */) {
    return this.swapService.getSwaps(addressOrAddresses, selector);
  }
  attachEvents() {
    this.swapService.events.swapUpdated.addListener(this.handleSwapServiceSwapUpdated);
  }
  detachEvents() {
    this.swapService.events.swapUpdated.removeListener(this.handleSwapServiceSwapUpdated);
  }
  dispose() {
    this.swapService.dispose();
  }
};

// src/tezos/walletTezosSigner/beaconWalletTezosSigner.ts
import { SigningType } from "@airgap/beacon-sdk";

// src/tezos/utils/index.ts
import { b58cdecode as b58cdecode2, prefix as prefix2, validatePkAndExtractPrefix } from "@taquito/utils";

// src/tezos/utils/signing.ts
var signing_exports = {};
__export(signing_exports, {
  decodeSignature: () => decodeSignature,
  getRawMichelineSigningData: () => getRawMichelineSigningData,
  getRawSigningData: () => getRawSigningData,
  getTezosSigningAlgorithm: () => getTezosSigningAlgorithm,
  getWalletMichelineSigningData: () => getWalletMichelineSigningData
});
import { b58cdecode, prefix, Prefix } from "@taquito/utils";
var tezosSignedMessagePrefixBytes = "54657a6f73205369676e6564204d6573736167653a20";
var getMichelineSigningData = (message, prefixBytes) => {
  const messageBytes = converters_exports.stringToHexString(message);
  const signedMessageBytes = prefixBytes ? prefixBytes + messageBytes : messageBytes;
  const messageLength = text_exports.padStart((signedMessageBytes.length / 2).toString(16), 8, "0");
  return "0501" + messageLength + signedMessageBytes;
};
var getRawSigningData = (message) => converters_exports.stringToHexString(message);
var getRawMichelineSigningData = (message) => getMichelineSigningData(message);
var getWalletMichelineSigningData = (message) => getMichelineSigningData(message, tezosSignedMessagePrefixBytes);
var getTezosSigningAlgorithm = (addressOrPublicKey) => {
  const prefix4 = addressOrPublicKey.substring(0, addressOrPublicKey.startsWith("tz") ? 3 : 4);
  switch (prefix4) {
    case Prefix.TZ1:
    case Prefix.EDPK:
      return "Ed25519:Blake2b";
    case Prefix.TZ2:
    case Prefix.SPPK:
      return "Blake2bWithEcdsa:Secp256k1";
    case Prefix.TZ3:
    case Prefix.P2PK:
      return "Blake2bWithEcdsa:Secp256r1";
    default:
      throw new Error(`Unexpected address/public key prefix: ${prefix4} (${addressOrPublicKey})`);
  }
};
var decodeSignature = (signature) => {
  const signaturePrefix = signature.startsWith("sig") ? signature.substring(0, 3) : signature.substring(0, 5);
  const decodedKeyBytes = b58cdecode(signature, prefix[signaturePrefix]);
  return Buffer.from(decodedKeyBytes).toString("hex");
};

// src/tezos/utils/index.ts
var decodePublicKey = (publicKey) => {
  const keyPrefix = validatePkAndExtractPrefix(publicKey);
  const decodedKeyBytes = b58cdecode2(publicKey, prefix2[keyPrefix]);
  return Buffer2.from(decodedKeyBytes).toString("hex");
};

// src/tezos/walletTezosSigner/beaconWalletTezosSigner.ts
var BeaconWalletTezosSigner = class {
  constructor(atomexNetwork, beaconWallet) {
    this.atomexNetwork = atomexNetwork;
    this.beaconWallet = beaconWallet;
    __publicField(this, "blockchain", "tezos");
  }
  getAddress() {
    return this.beaconWallet.getPKH();
  }
  async getPublicKey() {
    var _a;
    return (_a = await this.beaconWallet.client.getActiveAccount()) == null ? void 0 : _a.publicKey;
  }
  async sign(message) {
    const [address, publicKey, signature] = await Promise.all([
      this.getAddress(),
      this.getPublicKey(),
      this.beaconWallet.client.requestSignPayload({
        payload: signing_exports.getWalletMichelineSigningData(message),
        signingType: SigningType.MICHELINE
      })
    ]);
    if (!publicKey)
      throw new Error("BeaconWallet: public key is unavailable");
    const algorithm = signing_exports.getTezosSigningAlgorithm(publicKey);
    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = decodeSignature(signature.signature);
    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes,
      signingDataType: "tezos/wallet-micheline" /* WalletMicheline */
    };
  }
};

// src/tezos/walletTezosSigner/templeWalletTezosSigner.ts
var TempleWalletTezosSigner = class {
  constructor(atomexNetwork, templeWallet) {
    this.atomexNetwork = atomexNetwork;
    this.templeWallet = templeWallet;
    __publicField(this, "blockchain", "tezos");
  }
  getAddress() {
    return this.templeWallet.getPKH();
  }
  getPublicKey() {
    var _a;
    return (_a = this.templeWallet.permission) == null ? void 0 : _a.publicKey;
  }
  async sign(message) {
    const [address, publicKey, signature] = await Promise.all([
      this.getAddress(),
      this.getPublicKey(),
      this.templeWallet.sign(signing_exports.getWalletMichelineSigningData(message))
    ]);
    if (!publicKey)
      throw new Error("TempleWallet: public key is unavailable");
    const algorithm = signing_exports.getTezosSigningAlgorithm(publicKey);
    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = decodeSignature(signature);
    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes,
      signingDataType: "tezos/wallet-micheline" /* WalletMicheline */
    };
  }
};

// src/tezos/walletTezosSigner/walletTezosSigner.ts
var WalletTezosSigner = class {
  constructor(atomexNetwork, wallet) {
    this.atomexNetwork = atomexNetwork;
    this.wallet = wallet;
    __publicField(this, "blockchain", "tezos");
    __publicField(this, "internalSigner");
    this.internalSigner = this.createInternalSigner();
  }
  getAddress() {
    return this.internalSigner.getAddress();
  }
  getPublicKey() {
    return this.internalSigner.getPublicKey();
  }
  sign(message) {
    return this.internalSigner.sign(message);
  }
  createInternalSigner() {
    var _a;
    if (((_a = this.wallet.client) == null ? void 0 : _a.name) !== void 0)
      return new BeaconWalletTezosSigner(this.atomexNetwork, this.wallet);
    else if (this.wallet.permission !== void 0 && this.wallet.connected !== void 0)
      return new TempleWalletTezosSigner(this.atomexNetwork, this.wallet);
    else
      throw new Error("Unknown Tezos wallet");
  }
};

// src/tezos/inMemoryTezosSigner.ts
import { InMemorySigner } from "@taquito/signer";
var InMemoryTezosSigner = class {
  constructor(atomexNetwork, secretKey) {
    this.atomexNetwork = atomexNetwork;
    __publicField(this, "blockchain", "tezos");
    __publicField(this, "internalInMemorySigner");
    this.internalInMemorySigner = new InMemorySigner(secretKey);
  }
  getAddress() {
    return this.internalInMemorySigner.publicKeyHash();
  }
  getPublicKey() {
    return this.internalInMemorySigner.publicKey();
  }
  async sign(message) {
    const messageBytes = signing_exports.getRawSigningData(message);
    const [address, publicKey, rawSignature] = await Promise.all([
      this.getAddress(),
      this.getPublicKey(),
      this.internalInMemorySigner.sign(messageBytes)
    ]);
    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = rawSignature.sbytes.substring(rawSignature.bytes.length);
    const algorithm = signing_exports.getTezosSigningAlgorithm(publicKey);
    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes
    };
  }
};

// src/tezos/currencies.ts
var tezosNativeCurrency = {
  id: "XTZ",
  name: "Tezos",
  symbol: "XTZ",
  blockchain: "tezos",
  decimals: 6,
  type: "native"
};
var tzBtcCurrency = {
  id: "TZBTC",
  name: "tzBTC",
  symbol: "tzBTC",
  blockchain: "tezos",
  decimals: 8,
  type: "fa1.2"
};
var usdtCurrency = {
  id: "USDT_XTZ",
  name: "Tether USD",
  symbol: "USDt",
  blockchain: "tezos",
  decimals: 6,
  tokenId: 0,
  type: "fa2"
};
var tezosMainnetCurrencies = [
  tezosNativeCurrency,
  tzBtcCurrency,
  usdtCurrency
];
var tezosTestnetCurrencies = [
  tezosNativeCurrency,
  tzBtcCurrency,
  usdtCurrency
];

// src/tezos/balancesProviders/tezosBalancesProvider.ts
var TezosBalancesProvider = class {
  getBalance(_address, _currency) {
    throw new Error("Method not implemented.");
  }
};

// src/tezos/swapTransactionsProviders/tezosSwapTransactionsProvider.ts
var TezosSwapTransactionsProvider = class {
  getSwapTransactions(_swap) {
    throw new Error("Method not implemented.");
  }
};

// src/tezos/blockchainToolkitProviders/tezosBlockchainToolkitProvider.ts
var TezosBlockchainToolkitProvider = class {
  getReadonlyToolkit(_blockchain, _toolkitId) {
    throw new Error("Method not implemented.");
  }
  getToolkit(_blockchain, _address, _toolkitId) {
    throw new Error("Method not implemented.");
  }
  addSigner(_signer) {
    throw new Error("Method not implemented.");
  }
  removeSigner(_signer) {
    throw new Error("Method not implemented.");
  }
};

// src/clients/rest/httpClient.ts
var HttpClient = class {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async request(options) {
    const url = new URL(options.urlPath, this.baseUrl);
    if (options.params)
      this.setSearchParams(url, options.params);
    const response = await fetch(url.toString(), {
      headers: this.createHeaders(options),
      method: options.method || "GET",
      body: options.payload ? JSON.stringify(options.payload) : void 0
    });
    if (response.status === 404)
      return void 0;
    if (!response.ok) {
      const errorBody = await response.text();
      throw Error(errorBody);
    }
    return await response.json();
  }
  setSearchParams(url, params) {
    for (const key in params) {
      const value = params[key];
      if (value !== null && value !== void 0)
        url.searchParams.set(key, String(value));
    }
  }
  createHeaders(options) {
    const headers = {};
    if (options.authToken)
      headers["Authorization"] = `Bearer ${options.authToken}`;
    if (options.method === "POST" && options.payload)
      headers["Content-Type"] = "application/json";
    return headers;
  }
};

// src/clients/helpers.ts
import BigNumber2 from "bignumber.js";
var getQuoteBaseCurrenciesBySymbol = (symbol) => {
  const [quoteCurrency = "", baseCurrency = ""] = symbol.split("/");
  return [quoteCurrency, baseCurrency];
};
var getFromToCurrencies = (symbol, qty, price, side) => {
  const [quoteCurrencyId, baseCurrencyId] = getQuoteBaseCurrenciesBySymbol(symbol);
  const quoteCurrencyAmount = new BigNumber2(qty);
  const quoteCurrencyPrice = new BigNumber2(price);
  const baseCurrencyAmount = quoteCurrencyPrice.multipliedBy(quoteCurrencyAmount);
  const baseCurrencyPrice = quoteCurrencyAmount.div(baseCurrencyAmount);
  const quoteCurrency = {
    currencyId: quoteCurrencyId,
    amount: quoteCurrencyAmount,
    price: quoteCurrencyPrice
  };
  const baseCurrency = {
    currencyId: baseCurrencyId,
    amount: baseCurrencyAmount,
    price: baseCurrencyPrice
  };
  return side === "Buy" ? [baseCurrency, quoteCurrency] : [quoteCurrency, baseCurrency];
};
var findSymbolAndSide = (symbols, from, to) => {
  let symbol = symbols.find((symbol2) => symbol2.name === `${from}/${to}`);
  let side = "Sell";
  if (!symbol) {
    symbol = symbols.find((symbol2) => symbol2.name === `${to}/${from}`);
    side = "Buy";
  }
  if (!symbol)
    throw new Error(`Invalid pair: ${from}/${to}`);
  return [symbol.name, side];
};
var mapQuoteDtosToQuotes = (quoteDtos) => {
  const quotes = quoteDtos.map((quoteDto) => mapQuoteDtoToQuote(quoteDto));
  return quotes;
};
var mapQuoteDtoToQuote = (quoteDto) => {
  const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(quoteDto.symbol);
  const quote = {
    ask: new BigNumber2(quoteDto.ask),
    bid: new BigNumber2(quoteDto.bid),
    symbol: quoteDto.symbol,
    timeStamp: new Date(quoteDto.timeStamp),
    quoteCurrency,
    baseCurrency
  };
  return quote;
};
var mapSymbolDtosToSymbols = (symbolDtos) => {
  const symbols = symbolDtos.map((symbolDto) => {
    const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(symbolDto.name);
    return {
      name: symbolDto.name,
      minimumQty: new BigNumber2(symbolDto.minimumQty),
      quoteCurrency,
      baseCurrency
    };
  });
  return symbols;
};
var mapOrderBookDtoToOrderBook = (orderBookDto) => {
  const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(orderBookDto.symbol);
  const orderBook = {
    updateId: orderBookDto.updateId,
    symbol: orderBookDto.symbol,
    quoteCurrency,
    baseCurrency,
    entries: orderBookDto.entries.map((orderBookEntryDto) => ({
      side: orderBookEntryDto.side,
      price: new BigNumber2(orderBookEntryDto.price),
      qtyProfile: orderBookEntryDto.qtyProfile
    }))
  };
  return orderBook;
};
var mapWebSocketOrderBookEntryDtoToOrderBook = (orderBookEntryDtos) => {
  const firstOrderBookEntry = orderBookEntryDtos[0];
  if (!firstOrderBookEntry)
    throw new Error("Unexpected dto");
  const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(firstOrderBookEntry.symbol);
  const orderBook = {
    updateId: firstOrderBookEntry.updateId,
    symbol: firstOrderBookEntry.symbol,
    quoteCurrency,
    baseCurrency,
    entries: orderBookEntryDtos.map((orderBookEntryDto) => ({
      side: orderBookEntryDto.side,
      price: new BigNumber2(orderBookEntryDto.price),
      qtyProfile: orderBookEntryDto.qtyProfile
    }))
  };
  return orderBook;
};
var mapOrderDtoToOrder = (orderDto) => {
  var _a;
  const [from, to] = getFromToCurrencies(orderDto.symbol, orderDto.qty, orderDto.price, orderDto.side);
  return {
    id: orderDto.id,
    from,
    to,
    clientOrderId: orderDto.clientOrderId,
    side: orderDto.side,
    symbol: orderDto.symbol,
    leaveQty: new BigNumber2(orderDto.leaveQty),
    timeStamp: new Date(orderDto.timeStamp),
    type: orderDto.type,
    status: orderDto.status,
    swapIds: ((_a = orderDto.swaps) == null ? void 0 : _a.map((swap) => swap.id)) || []
  };
};
var mapOrderDtosToOrders = (orderDtos) => {
  const orders = orderDtos.map((orderDto) => mapOrderDtoToOrder(orderDto));
  return orders;
};
var mapTransactionDtosToTransactions = (transactionDtos) => {
  const transactions = transactionDtos.map((transactionDto) => ({
    id: transactionDto.txId,
    blockId: transactionDto.blockHeight,
    confirmations: transactionDto.confirmations,
    currencyId: transactionDto.currency,
    status: transactionDto.status,
    type: transactionDto.type
  }));
  return transactions;
};
var mapSwapDtoToSwap = (swapDto) => {
  const [from, to] = getFromToCurrencies(swapDto.symbol, swapDto.qty, swapDto.price, swapDto.side);
  const swap = {
    isInitiator: swapDto.isInitiator,
    secret: swapDto.secret,
    secretHash: swapDto.secretHash,
    id: Number(swapDto.id),
    from,
    to,
    trade: {
      qty: new BigNumber2(swapDto.qty),
      price: new BigNumber2(swapDto.price),
      side: swapDto.side,
      symbol: swapDto.symbol
    },
    timeStamp: new Date(swapDto.timeStamp),
    counterParty: {
      status: swapDto.counterParty.status,
      transactions: mapTransactionDtosToTransactions(swapDto.counterParty.transactions),
      requisites: __spreadProps(__spreadValues({}, swapDto.counterParty.requisites), {
        rewardForRedeem: new BigNumber2(swapDto.counterParty.requisites.rewardForRedeem)
      }),
      trades: mapTradeDtosToTrades(swapDto.counterParty.trades)
    },
    user: {
      status: swapDto.user.status,
      transactions: mapTransactionDtosToTransactions(swapDto.user.transactions),
      requisites: __spreadProps(__spreadValues({}, swapDto.user.requisites), {
        rewardForRedeem: new BigNumber2(swapDto.user.requisites.rewardForRedeem)
      }),
      trades: mapTradeDtosToTrades(swapDto.user.trades)
    }
  };
  return swap;
};
var mapTradeDtosToTrades = (tradeDtos) => {
  const trades = tradeDtos.map((tradeDto) => ({
    orderId: tradeDto.orderId,
    price: new BigNumber2(tradeDto.price),
    qty: new BigNumber2(tradeDto.qty)
  }));
  return trades;
};
var mapSwapDtosToSwaps = (swapDtos) => {
  const swaps = swapDtos.map((swapDto) => mapSwapDtoToSwap(swapDto));
  return swaps;
};
var mapWebSocketOrderDtoToOrder = (orderDto) => {
  const [from, to] = getFromToCurrencies(orderDto.symbol, orderDto.qty, orderDto.price, orderDto.side);
  const order = {
    id: orderDto.id,
    clientOrderId: orderDto.clientOrderId,
    side: orderDto.side,
    status: orderDto.status,
    leaveQty: new BigNumber2(orderDto.leaveQty),
    swapIds: orderDto.swaps,
    symbol: orderDto.symbol,
    type: orderDto.type,
    timeStamp: new Date(orderDto.timeStamp),
    from,
    to
  };
  return order;
};

// src/clients/rest/restAtomexClient.ts
var RestAtomexClient = class {
  constructor(options) {
    __publicField(this, "atomexNetwork");
    __publicField(this, "events", {
      swapUpdated: new EventEmitter(),
      orderUpdated: new EventEmitter(),
      orderBookUpdated: new EventEmitter(),
      topOfBookUpdated: new EventEmitter()
    });
    __publicField(this, "authorizationManager");
    __publicField(this, "apiBaseUrl");
    __publicField(this, "httpClient");
    __publicField(this, "_symbolsCache");
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.apiBaseUrl = options.apiBaseUrl;
    this.httpClient = new HttpClient(this.apiBaseUrl);
  }
  async getOrder(accountAddress, orderId) {
    const urlPath = `/v1/Orders/${orderId}`;
    const authToken = this.getRequiredAuthToken(accountAddress);
    const orderDto = await this.httpClient.request({ urlPath, authToken });
    return orderDto ? mapOrderDtoToOrder(orderDto) : void 0;
  }
  async getOrders(accountAddress, selector) {
    const urlPath = "/v1/Orders";
    const authToken = this.getRequiredAuthToken(accountAddress);
    const params = __spreadProps(__spreadValues({}, selector), {
      sortAsc: void 0,
      sort: (selector == null ? void 0 : selector.sortAsc) !== void 0 ? selector.sortAsc ? "Asc" : "Desc" : void 0
    });
    const orderDtos = await this.httpClient.request({ urlPath, authToken, params });
    return orderDtos ? mapOrderDtosToOrders(orderDtos) : [];
  }
  async getSymbols() {
    const urlPath = "/v1/Symbols";
    const symbolDtos = await this.httpClient.request({ urlPath });
    const symbols = symbolDtos ? mapSymbolDtosToSymbols(symbolDtos) : [];
    if (symbolDtos)
      this._symbolsCache = symbols;
    return symbols;
  }
  async getTopOfBook(symbolsOrDirections) {
    const urlPath = "/v1/MarketData/quotes";
    let symbols = void 0;
    if (symbolsOrDirections == null ? void 0 : symbolsOrDirections.length) {
      if (typeof symbolsOrDirections[0] === "string")
        symbols = symbolsOrDirections;
      else {
        const cachedSymbols = await this.getCachedSymbols();
        symbols = symbolsOrDirections.map((d) => findSymbolAndSide(cachedSymbols, d.from, d.to)[0]);
      }
    }
    const params = { symbols: symbols == null ? void 0 : symbols.join(",") };
    const quoteDtos = await this.httpClient.request({ urlPath, params });
    return quoteDtos ? mapQuoteDtosToQuotes(quoteDtos) : [];
  }
  async getOrderBook(symbolOrDirection) {
    const urlPath = "/v1/MarketData/book";
    let symbol;
    if (typeof symbolOrDirection === "string")
      symbol = symbolOrDirection;
    else {
      const cachedSymbols = await this.getCachedSymbols();
      [symbol] = findSymbolAndSide(cachedSymbols, symbolOrDirection.from, symbolOrDirection.to);
    }
    const params = { symbol };
    const orderBookDto = await this.httpClient.request({ urlPath, params });
    return orderBookDto ? mapOrderBookDtoToOrderBook(orderBookDto) : void 0;
  }
  async addOrder(accountAddress, newOrderRequest) {
    const urlPath = "/v1/Orders";
    const authToken = this.getRequiredAuthToken(accountAddress);
    let symbol = void 0;
    let side = void 0;
    if (newOrderRequest.symbol && newOrderRequest.side)
      [symbol, side] = [newOrderRequest.symbol, newOrderRequest.side];
    else if (newOrderRequest.from && newOrderRequest.to) {
      const cachedSymbols = await this.getCachedSymbols();
      [symbol, side] = findSymbolAndSide(cachedSymbols, newOrderRequest.from, newOrderRequest.to);
    } else
      throw new Error("Invalid newOrderRequest argument passed");
    const payload = {
      symbol,
      side,
      clientOrderId: newOrderRequest.clientOrderId,
      type: newOrderRequest.type,
      proofsOfFunds: newOrderRequest.proofsOfFunds,
      requisites: newOrderRequest.requisites,
      amount: newOrderRequest.amount.toNumber(),
      price: newOrderRequest.price.toNumber()
    };
    const newOrderDto = await this.httpClient.request({
      urlPath,
      authToken,
      method: "POST",
      payload
    });
    if (newOrderDto === void 0)
      throw new Error("Unexpected response dto");
    return newOrderDto.orderId;
  }
  async cancelOrder(accountAddress, cancelOrderRequest) {
    const urlPath = `/v1/Orders/${cancelOrderRequest.orderId}`;
    const authToken = this.getRequiredAuthToken(accountAddress);
    let symbol = void 0;
    let side = void 0;
    if (cancelOrderRequest.symbol && cancelOrderRequest.side)
      [symbol, side] = [cancelOrderRequest.symbol, cancelOrderRequest.side];
    else if (cancelOrderRequest.from && cancelOrderRequest.to) {
      const cachedSymbols = await this.getCachedSymbols();
      [symbol, side] = findSymbolAndSide(cachedSymbols, cancelOrderRequest.from, cancelOrderRequest.to);
    } else
      throw new Error("Invalid cancelOrderRequest argument passed");
    const params = { symbol, side };
    const isSuccess = await this.httpClient.request({
      urlPath,
      authToken,
      params,
      method: "DELETE"
    });
    if (isSuccess === void 0)
      throw new Error("Unexpected response dto");
    return isSuccess;
  }
  async cancelAllOrders(accountAddress, cancelAllOrdersRequest) {
    const urlPath = "/v1/Orders";
    const authToken = this.getRequiredAuthToken(accountAddress);
    let symbol = void 0;
    let side = void 0;
    if (cancelAllOrdersRequest.symbol && cancelAllOrdersRequest.side)
      [symbol, side] = [cancelAllOrdersRequest.symbol, cancelAllOrdersRequest.side];
    else if (cancelAllOrdersRequest.from && cancelAllOrdersRequest.to) {
      const cachedSymbols = await this.getCachedSymbols();
      [symbol, side] = findSymbolAndSide(cachedSymbols, cancelAllOrdersRequest.from, cancelAllOrdersRequest.to);
      if (cancelAllOrdersRequest.cancelAllDirections)
        side = "All";
    } else
      throw new Error("Invalid cancelAllOrdersRequest argument passed");
    const canceledOrdersCount = await this.httpClient.request({
      urlPath,
      authToken,
      params: {
        symbol,
        side,
        forAllConnections: cancelAllOrdersRequest.forAllConnections
      },
      method: "DELETE"
    });
    if (canceledOrdersCount === void 0)
      throw new Error("Unexpected response dto");
    return canceledOrdersCount;
  }
  getSwapTransactions(_swap) {
    throw new Error("Method not implemented.");
  }
  async getSwap(swapId, addressOrAddresses) {
    const urlPath = `/v1/Swaps/${swapId}`;
    const userIds = this.getUserIds(addressOrAddresses);
    const params = {
      userIds: userIds.join(",")
    };
    const swapDto = await this.httpClient.request({
      urlPath,
      params
    });
    return swapDto ? mapSwapDtoToSwap(swapDto) : void 0;
  }
  async getSwaps(addressOrAddresses, selector) {
    const urlPath = "/v1/Swaps";
    const userIds = this.getUserIds(addressOrAddresses);
    const params = __spreadProps(__spreadValues({}, selector), {
      sortAsc: void 0,
      sort: (selector == null ? void 0 : selector.sortAsc) !== void 0 ? selector.sortAsc ? "Asc" : "Desc" : void 0,
      userIds: userIds.join(",")
    });
    const swapDtos = await this.httpClient.request({
      urlPath,
      params
    });
    return swapDtos ? mapSwapDtosToSwaps(swapDtos) : [];
  }
  dispose() {
  }
  getUserIds(addressOrAddresses) {
    const accountAddresses = Array.isArray(addressOrAddresses) ? addressOrAddresses : [addressOrAddresses];
    const userIds = accountAddresses.map((address) => {
      var _a;
      return (_a = this.authorizationManager.getAuthToken(address)) == null ? void 0 : _a.userId;
    }).filter((userId) => userId);
    if (!userIds.length)
      throw new Error("Incorrect accountAddresses");
    return userIds;
  }
  getRequiredAuthToken(accountAddress) {
    var _a;
    const authToken = (_a = this.authorizationManager.getAuthToken(accountAddress)) == null ? void 0 : _a.value;
    if (!authToken) {
      throw new Error(`Cannot find auth token for address: ${accountAddress}`);
    }
    return authToken;
  }
  async getCachedSymbols() {
    if (!this._symbolsCache)
      this._symbolsCache = await this.getSymbols();
    return this._symbolsCache;
  }
};

// src/clients/webSocket/webSocketClient.ts
var WebSocketClient = class {
  constructor(url, authToken) {
    this.url = url;
    this.authToken = authToken;
    __publicField(this, "events", {
      messageReceived: new EventEmitter(),
      closed: new EventEmitter()
    });
    __publicField(this, "_socket");
    __publicField(this, "onMessageReceived", (event) => {
      this.events.messageReceived.emit(JSON.parse(event.data));
    });
    __publicField(this, "onClosed", (event) => {
      this.events.closed.emit(this, event);
    });
  }
  get socket() {
    if (!this._socket)
      throw new Error("Internal websocket is not created. Use the connect method first");
    return this._socket;
  }
  set socket(value) {
    this._socket = value;
  }
  async connect() {
    this.disconnect();
    return new Promise((resolve) => {
      const protocols = this.authToken ? ["access_token", this.authToken] : void 0;
      this.socket = new WebSocket(this.url, protocols);
      this.socket.addEventListener("message", this.onMessageReceived);
      this.socket.addEventListener("error", this.onError);
      this.socket.addEventListener("close", this.onClosed);
      this.socket.addEventListener("open", () => resolve());
    });
  }
  disconnect() {
    if (this._socket) {
      this.socket.removeEventListener("message", this.onMessageReceived);
      this.socket.removeEventListener("error", this.onError);
      this.socket.removeEventListener("close", this.onClosed);
      this.socket.close();
    }
  }
  subscribe(stream) {
    const message = {
      method: "subscribe",
      data: stream,
      requestId: Date.now()
    };
    this.socket.send(JSON.stringify(message));
  }
  unsubscribe(stream) {
    const message = {
      method: "unsubscribe",
      data: stream,
      requestId: Date.now()
    };
    this.socket.send(JSON.stringify(message));
  }
  onError(event) {
    throw new Error(`Websocket received error: ${JSON.stringify(event)}`);
  }
};

// src/clients/webSocket/exchangeWebSocketClient.ts
var _ExchangeWebSocketClient = class {
  constructor(webSocketApiBaseUrl, authorizationManager) {
    this.webSocketApiBaseUrl = webSocketApiBaseUrl;
    this.authorizationManager = authorizationManager;
    __publicField(this, "events", {
      messageReceived: new EventEmitter()
    });
    __publicField(this, "sockets", /* @__PURE__ */ new Map());
    __publicField(this, "onAuthorized", async (authToken) => {
      this.removeSocket(authToken.userId);
      const socket = new WebSocketClient(new URL(_ExchangeWebSocketClient.EXCHANGE_URL_PATH, this.webSocketApiBaseUrl), authToken.value);
      socket.events.messageReceived.addListener(this.onSocketMessageReceived);
      socket.events.closed.addListener(this.onClosed);
      this.sockets.set(authToken.userId, socket);
      await socket.connect();
    });
    __publicField(this, "onUnauthorized", (authToken) => {
      this.removeSocket(authToken.userId);
    });
    __publicField(this, "onSocketMessageReceived", (message) => {
      this.events.messageReceived.emit(message);
    });
    __publicField(this, "onClosed", (socket, _event) => {
      setTimeout(() => {
        socket.connect();
      }, 1e3);
    });
    this.subscribeOnAuthEvents();
  }
  dispose() {
    this.sockets.forEach((_, userId) => {
      this.removeSocket(userId);
    });
  }
  subscribeOnAuthEvents() {
    this.authorizationManager.events.authorized.addListener(this.onAuthorized);
    this.authorizationManager.events.unauthorized.addListener(this.onUnauthorized);
  }
  removeSocket(userId) {
    const socket = this.sockets.get(userId);
    if (socket) {
      socket.events.messageReceived.removeListener(this.onSocketMessageReceived);
      socket.events.closed.removeListener(this.onClosed);
      this.sockets.delete(userId);
      socket.disconnect();
    }
  }
};
var ExchangeWebSocketClient = _ExchangeWebSocketClient;
__publicField(ExchangeWebSocketClient, "EXCHANGE_URL_PATH", "/ws/exchange");

// src/clients/webSocket/marketDataWebSocketClient.ts
var _MarketDataWebSocketClient = class {
  constructor(webSocketApiBaseUrl) {
    this.webSocketApiBaseUrl = webSocketApiBaseUrl;
    __publicField(this, "events", {
      messageReceived: new EventEmitter()
    });
    __publicField(this, "socket");
    __publicField(this, "onSocketClosed", (socket, _event) => {
      setTimeout(async () => {
        await socket.connect();
        this.subscribeOnStreams(socket);
      }, 1e3);
    });
    __publicField(this, "onSocketMessageReceived", (message) => {
      this.events.messageReceived.emit(message);
    });
    this.socket = new WebSocketClient(new URL(_MarketDataWebSocketClient.MARKET_DATA_URL_PATH, this.webSocketApiBaseUrl));
  }
  async connect() {
    this.socket.events.messageReceived.addListener(this.onSocketMessageReceived);
    this.socket.events.closed.addListener(this.onSocketClosed);
    await this.socket.connect();
    this.subscribeOnStreams(this.socket);
  }
  dispose() {
    this.socket.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.socket.events.closed.removeListener(this.onSocketClosed);
    this.socket.disconnect();
  }
  subscribeOnStreams(socket) {
    socket.subscribe(_MarketDataWebSocketClient.TOP_OF_BOOK_STREAM);
    socket.subscribe(_MarketDataWebSocketClient.ORDER_BOOK_STREAM);
  }
};
var MarketDataWebSocketClient = _MarketDataWebSocketClient;
__publicField(MarketDataWebSocketClient, "MARKET_DATA_URL_PATH", "/ws/marketdata");
__publicField(MarketDataWebSocketClient, "TOP_OF_BOOK_STREAM", "topOfBook");
__publicField(MarketDataWebSocketClient, "ORDER_BOOK_STREAM", "orderBook");

// src/clients/webSocket/webSocketAtomexClient.ts
var WebSocketAtomexClient = class {
  constructor(options) {
    __publicField(this, "atomexNetwork");
    __publicField(this, "events", {
      swapUpdated: new EventEmitter(),
      orderUpdated: new EventEmitter(),
      orderBookUpdated: new EventEmitter(),
      topOfBookUpdated: new EventEmitter()
    });
    __publicField(this, "authorizationManager");
    __publicField(this, "webSocketApiBaseUrl");
    __publicField(this, "marketDataWebSocketClient");
    __publicField(this, "exchangeWebSocketClient");
    __publicField(this, "onSocketMessageReceived", (message) => {
      switch (message.event) {
        case "order":
          this.events.orderUpdated.emit(mapWebSocketOrderDtoToOrder(message.data));
          break;
        case "swap":
          this.events.swapUpdated.emit(mapSwapDtoToSwap(message.data));
          break;
        case "topOfBook":
          this.events.topOfBookUpdated.emit(mapQuoteDtosToQuotes(message.data));
          break;
        case "entries":
          this.events.orderBookUpdated.emit(mapWebSocketOrderBookEntryDtoToOrderBook(message.data));
          break;
      }
    });
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.webSocketApiBaseUrl = options.webSocketApiBaseUrl;
    this.exchangeWebSocketClient = new ExchangeWebSocketClient(this.webSocketApiBaseUrl, this.authorizationManager);
    this.exchangeWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    this.marketDataWebSocketClient = new MarketDataWebSocketClient(this.webSocketApiBaseUrl);
    this.marketDataWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    this.marketDataWebSocketClient.connect();
  }
  getOrder(_accountAddress, _orderId) {
    throw new Error("Method not implemented.");
  }
  getOrders(_accountAddress, _selector) {
    throw new Error("Method not implemented.");
  }
  getSymbols() {
    throw new Error("Method not implemented.");
  }
  getTopOfBook(_symbolsOrDirections) {
    throw new Error("Method not implemented.");
  }
  async getOrderBook(_symbolOrDirection) {
    throw new Error("Method not implemented.");
  }
  addOrder(_accountAddress, _newOrderRequest) {
    throw new Error("Method not implemented.");
  }
  cancelOrder(_accountAddress, _cancelOrderRequest) {
    throw new Error("Method not implemented.");
  }
  cancelAllOrders(_accountAddress, _cancelAllOrdersRequest) {
    throw new Error("Method not implemented.");
  }
  getSwapTransactions(_swap) {
    throw new Error("Method not implemented.");
  }
  getSwap(_swapId, _addressOrAddresses) {
    throw new Error("Method not implemented.");
  }
  getSwaps(_addressOrAddresses, _selector) {
    throw new Error("Method not implemented.");
  }
  dispose() {
    this.exchangeWebSocketClient.dispose();
    this.marketDataWebSocketClient.dispose();
  }
};

// src/clients/mixedAtomexClient.ts
var MixedApiAtomexClient = class {
  constructor(atomexNetwork, restAtomexClient, webSocketAtomexClient) {
    this.atomexNetwork = atomexNetwork;
    this.restAtomexClient = restAtomexClient;
    this.webSocketAtomexClient = webSocketAtomexClient;
    __publicField(this, "events");
    atomexUtils_exports.ensureNetworksAreSame(this, restAtomexClient);
    atomexUtils_exports.ensureNetworksAreSame(this, webSocketAtomexClient);
    this.events = {
      swapUpdated: this.webSocketAtomexClient.events.swapUpdated,
      orderBookUpdated: this.webSocketAtomexClient.events.orderBookUpdated,
      orderUpdated: this.webSocketAtomexClient.events.orderUpdated,
      topOfBookUpdated: this.webSocketAtomexClient.events.topOfBookUpdated
    };
  }
  getOrder(accountAddress, orderId) {
    return this.restAtomexClient.getOrder(accountAddress, orderId);
  }
  getOrders(accountAddress, selector) {
    return this.restAtomexClient.getOrders(accountAddress, selector);
  }
  getSymbols() {
    return this.restAtomexClient.getSymbols();
  }
  getTopOfBook(symbolsOrDirections) {
    return this.restAtomexClient.getTopOfBook(symbolsOrDirections);
  }
  async getOrderBook(symbolOrDirection) {
    return this.restAtomexClient.getOrderBook(symbolOrDirection);
  }
  addOrder(accountAddress, newOrderRequest) {
    return this.restAtomexClient.addOrder(accountAddress, newOrderRequest);
  }
  cancelOrder(accountAddress, cancelOrderRequest) {
    return this.restAtomexClient.cancelOrder(accountAddress, cancelOrderRequest);
  }
  cancelAllOrders(accountAddress, cancelAllOrdersRequest) {
    return this.restAtomexClient.cancelAllOrders(accountAddress, cancelAllOrdersRequest);
  }
  getSwapTransactions(swap) {
    return this.restAtomexClient.getSwapTransactions(swap);
  }
  getSwap(swapId, addressOrAddresses) {
    return this.restAtomexClient.getSwap(swapId, addressOrAddresses);
  }
  getSwaps(addressOrAddresses, selector) {
    return this.restAtomexClient.getSwaps(addressOrAddresses, selector);
  }
  dispose() {
    this.webSocketAtomexClient.dispose();
    this.restAtomexClient.dispose();
  }
};

// src/atomexBuilder/atomexComponents/exchangeService.ts
var createDefaultExchangeService = (atomexContext, options) => {
  return new MixedApiAtomexClient(atomexContext.atomexNetwork, new RestAtomexClient({
    atomexNetwork: atomexContext.atomexNetwork,
    authorizationManager: atomexContext.managers.authorizationManager,
    apiBaseUrl: options.apiBaseUrl
  }), new WebSocketAtomexClient({
    atomexNetwork: atomexContext.atomexNetwork,
    authorizationManager: atomexContext.managers.authorizationManager,
    webSocketApiBaseUrl: options.webSocketApiBaseUrl
  }));
};

// src/authorization/models/authTokenSource.ts
var AuthTokenSource = /* @__PURE__ */ ((AuthTokenSource2) => {
  AuthTokenSource2[AuthTokenSource2["Local"] = 1] = "Local";
  AuthTokenSource2[AuthTokenSource2["Remote"] = 2] = "Remote";
  AuthTokenSource2[AuthTokenSource2["All"] = 3] = "All";
  return AuthTokenSource2;
})(AuthTokenSource || {});

// src/authorization/authorizationManager.ts
var _AuthorizationManager = class {
  constructor(options) {
    __publicField(this, "events", {
      authorized: new EventEmitter(),
      unauthorized: new EventEmitter(),
      authTokenExpiring: new EventEmitter(),
      authTokenExpired: new EventEmitter()
    });
    __publicField(this, "atomexNetwork");
    __publicField(this, "signersManager");
    __publicField(this, "store");
    __publicField(this, "authorizationUrl");
    __publicField(this, "expiringNotificationTimeInSeconds");
    __publicField(this, "_authTokenData", /* @__PURE__ */ new Map());
    __publicField(this, "authTokenExpiringTimeoutCallback", (authToken) => {
      const authTokenData = this._authTokenData.get(authToken.address);
      if (!authTokenData)
        return;
      clearTimeout(authTokenData.watcherId);
      const duration = authToken.expired.getTime() - Date.now();
      const newWatcherId = setTimeout(this.authTokenExpiredTimeoutCallback, prepareTimeoutDuration(duration), authToken);
      this._authTokenData.set(authToken.address, __spreadProps(__spreadValues({}, authTokenData), {
        watcherId: newWatcherId
      }));
      this.events.authTokenExpiring.emit(authToken);
    });
    __publicField(this, "authTokenExpiredTimeoutCallback", (authToken) => {
      this.unregisterAuthToken(authToken);
      this.events.authTokenExpired.emit(authToken);
    });
    this.atomexNetwork = options.atomexNetwork;
    this.store = options.store;
    this.signersManager = options.signersManager;
    atomexUtils_exports.ensureNetworksAreSame(this, this.signersManager);
    this.authorizationUrl = new URL(_AuthorizationManager.DEFAULT_GET_AUTH_TOKEN_URI, options.authorizationBaseUrl);
    this.expiringNotificationTimeInSeconds = options.expiringNotificationTimeInSeconds || _AuthorizationManager.DEFAULT_EXPIRING_NOTIFICATION_TIME_IN_SECONDS;
  }
  get authTokenData() {
    return this._authTokenData;
  }
  getAuthToken(address) {
    var _a;
    return (_a = this.authTokenData.get(address)) == null ? void 0 : _a.authToken;
  }
  async authorize({
    address,
    authTokenSource = 3 /* All */,
    blockchain,
    authMessage = _AuthorizationManager.DEFAULT_AUTH_MESSAGE
  }) {
    if ((authTokenSource & 1 /* Local */) === 1 /* Local */) {
      const authToken2 = this.getAuthToken(address) || await this.loadAuthTokenFromStore(address);
      if (authToken2 && !this.isTokenExpiring(authToken2))
        return authToken2;
    }
    if ((authTokenSource & 2 /* Remote */) !== 2 /* Remote */)
      return void 0;
    const signer = await this.signersManager.findSigner(address, blockchain);
    if (!signer)
      throw new Error(`Not found: the corresponding signer by the ${address} address`);
    const timeStamp = this.getAuthorizationTimeStamp(authMessage);
    const atomexSignature = await signer.sign(authMessage + timeStamp);
    if (atomexSignature.address !== address)
      throw new Error("Invalid address in the signed data");
    const authenticationResponseData = await this.requestAuthToken({
      message: authMessage,
      publicKey: atomexSignature.publicKeyBytes,
      algorithm: atomexSignature.algorithm,
      signingDataType: atomexSignature.signingDataType,
      signature: atomexSignature.signatureBytes,
      timeStamp
    });
    const authToken = {
      value: authenticationResponseData.token,
      userId: authenticationResponseData.id,
      address,
      expired: new Date(authenticationResponseData.expires)
    };
    await this.registerAuthToken(authToken, true);
    return authToken;
  }
  async unauthorize(address) {
    const authToken = this.getAuthToken(address);
    return authToken ? this.unregisterAuthToken(authToken) : false;
  }
  dispose() {
    for (const authTokenDataTuple of this.authTokenData)
      this.untrackAuthToken(authTokenDataTuple[1].watcherId);
  }
  async loadAuthTokenFromStore(address) {
    const authToken = await this.store.getAuthToken(address);
    if (!authToken)
      return void 0;
    return await this.registerAuthToken(authToken, false);
  }
  async registerAuthToken(authToken, isNeedSave) {
    const watcherId = this.trackAuthToken(authToken);
    if (!watcherId)
      return;
    const authTokenData = {
      authToken,
      watcherId
    };
    this._authTokenData.set(authToken.address, authTokenData);
    if (isNeedSave)
      authToken = await this.store.upsertAuthToken(authToken.address, authToken);
    this.events.authorized.emit(authToken);
    return authToken;
  }
  async unregisterAuthToken(authToken) {
    const authTokenData = this._authTokenData.get(authToken.address);
    if (!authTokenData)
      return false;
    this.untrackAuthToken(authTokenData.watcherId);
    const result = await this.store.removeAuthToken(authToken) && this._authTokenData.delete(authToken.address);
    if (result)
      this.events.unauthorized.emit(authToken);
    return result;
  }
  trackAuthToken(authToken) {
    const tokenDuration = authToken.expired.getTime() - Date.now();
    if (tokenDuration <= 0) {
      this.store.removeAuthToken(authToken);
      this.events.authTokenExpired.emit(authToken);
      return;
    }
    const expiringTokenDuration = tokenDuration - this.expiringNotificationTimeInSeconds * 1e3;
    const watcherId = setTimeout(this.authTokenExpiringTimeoutCallback, prepareTimeoutDuration(expiringTokenDuration), authToken);
    return watcherId;
  }
  untrackAuthToken(authTokenWatcherId) {
    clearTimeout(authTokenWatcherId);
  }
  getAuthorizationTimeStamp(_authMessage) {
    return Date.now();
  }
  async requestAuthToken(requestData) {
    const response = await fetch(this.authorizationUrl.href, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });
    if (!response.ok)
      throw new Error(await response.text());
    return response.json();
  }
  isTokenExpiring(authToken) {
    return authToken.expired.getTime() - Date.now() <= this.expiringNotificationTimeInSeconds * 1e3;
  }
};
var AuthorizationManager = _AuthorizationManager;
__publicField(AuthorizationManager, "DEFAULT_AUTH_MESSAGE", "Signing in ");
__publicField(AuthorizationManager, "DEFAULT_GET_AUTH_TOKEN_URI", "/v1/token");
__publicField(AuthorizationManager, "DEFAULT_EXPIRING_NOTIFICATION_TIME_IN_SECONDS", 60);

// src/browser/localStorageAuthorizationManagerStore/defaultSerializedAuthTokenMapper.ts
var DefaultSerializedAuthTokenMapper = class {
  mapAuthTokenToSerializedAuthToken(authToken) {
    return {
      a: authToken.address,
      u: authToken.userId,
      e: authToken.expired.getTime(),
      v: authToken.value
    };
  }
  mapSerializedAuthTokenToAuthToken(serializedAuthToken) {
    return {
      address: serializedAuthToken.a,
      userId: serializedAuthToken.u,
      expired: new Date(serializedAuthToken.e),
      value: serializedAuthToken.v
    };
  }
};

// src/browser/localStorageAuthorizationManagerStore/multipleKeysStoreStrategy.ts
var _MultipleKeysStoreStrategy = class {
  constructor(localStorage2, serializedAuthTokenMapper, keyPrefix = _MultipleKeysStoreStrategy.DefaultKeyPrefix) {
    this.localStorage = localStorage2;
    this.serializedAuthTokenMapper = serializedAuthTokenMapper;
    this.keyPrefix = keyPrefix;
  }
  getAuthToken(address) {
    const rawAuthToken = localStorage.getItem(this.getKey(address));
    return rawAuthToken && this.serializedAuthTokenMapper.mapSerializedAuthTokenToAuthToken(JSON.parse(rawAuthToken)) || void 0;
  }
  getAuthTokens(addresses) {
    return addresses.map((address) => this.getAuthToken(address)).filter(Boolean);
  }
  upsertAuthToken(address, authToken) {
    const serializedAuthToken = this.serializedAuthTokenMapper.mapAuthTokenToSerializedAuthToken(authToken);
    if (!serializedAuthToken)
      throw new Error(`The authToken of the ${address} address can't be stored: serialization is failed`);
    localStorage.setItem(this.getKey(address), JSON.stringify(serializedAuthToken));
    return authToken;
  }
  removeAuthToken(address) {
    localStorage.removeItem(this.getKey(address));
    return true;
  }
  getKey(address) {
    return this.keyPrefix + address;
  }
};
var MultipleKeysStoreStrategy = _MultipleKeysStoreStrategy;
__publicField(MultipleKeysStoreStrategy, "DefaultKeyPrefix", "authToken:");

// src/browser/localStorageAuthorizationManagerStore/singleKeyStoreStrategy.ts
var _SingleKeyStoreStrategy = class {
  constructor(localStorage2, serializedAuthTokenMapper, keyPrefix = _SingleKeyStoreStrategy.DefaultKeyPrefix) {
    this.localStorage = localStorage2;
    this.serializedAuthTokenMapper = serializedAuthTokenMapper;
    this.keyPrefix = keyPrefix;
  }
  get key() {
    return this.keyPrefix;
  }
  getAuthToken(address) {
    const serializedAuthTokensStoreObject = this.getSerializedAuthTokensStoreObject();
    return serializedAuthTokensStoreObject[address] && (this.serializedAuthTokenMapper.mapSerializedAuthTokenToAuthToken(serializedAuthTokensStoreObject[address]) || void 0);
  }
  getAuthTokens(addresses) {
    const serializedAuthTokensStoreObject = this.getSerializedAuthTokensStoreObject();
    return Object.values(serializedAuthTokensStoreObject).map((serializedAuthToken) => this.serializedAuthTokenMapper.mapSerializedAuthTokenToAuthToken(serializedAuthToken)).filter((authToken) => !!authToken && addresses.indexOf(authToken.address) > -1);
  }
  upsertAuthToken(address, authToken) {
    const serializedAuthTokensStoreObject = this.getSerializedAuthTokensStoreObject();
    const serializedAuthToken = this.serializedAuthTokenMapper.mapAuthTokenToSerializedAuthToken(authToken);
    if (!serializedAuthToken)
      throw new Error(`The authToken of the ${address} address can't be stored: serialization is failed`);
    serializedAuthTokensStoreObject[address] = serializedAuthToken;
    this.localStorage.setItem(this.key, JSON.stringify(serializedAuthTokensStoreObject));
    return authToken;
  }
  removeAuthToken(address) {
    const serializedAuthTokensStoreObject = this.getSerializedAuthTokensStoreObject();
    if (!serializedAuthTokensStoreObject[address])
      return false;
    delete serializedAuthTokensStoreObject[address];
    if (Object.keys(serializedAuthTokensStoreObject).length)
      this.localStorage.setItem(this.key, JSON.stringify(serializedAuthTokensStoreObject));
    else
      this.localStorage.removeItem(this.key);
    return true;
  }
  getSerializedAuthTokensStoreObject() {
    const rawAuthTokens = this.localStorage.getItem(this.key);
    if (!rawAuthTokens)
      return {};
    return JSON.parse(rawAuthTokens);
  }
};
var SingleKeyStoreStrategy = _SingleKeyStoreStrategy;
__publicField(SingleKeyStoreStrategy, "DefaultKeyPrefix", "authTokens");

// src/browser/localStorageAuthorizationManagerStore/localStorageAuthorizationManagerStore.ts
var LocalStorageAuthorizationManagerStore = class {
  constructor(storeStrategy = "single-key", serializedAuthTokenMapper = new DefaultSerializedAuthTokenMapper()) {
    __publicField(this, "storeStrategy");
    this.storeStrategy = typeof storeStrategy === "string" ? this.createPreDefinedStoreStrategy(storeStrategy, serializedAuthTokenMapper) : storeStrategy;
  }
  getAuthToken(address) {
    return Promise.resolve(this.storeStrategy.getAuthToken(address));
  }
  getAuthTokens(...addresses) {
    return Promise.resolve(this.storeStrategy.getAuthTokens(addresses));
  }
  upsertAuthToken(address, authToken) {
    return Promise.resolve(this.storeStrategy.upsertAuthToken(address, authToken));
  }
  removeAuthToken(addressOrAuthToken) {
    const address = typeof addressOrAuthToken === "string" ? addressOrAuthToken : addressOrAuthToken.address;
    return Promise.resolve(this.storeStrategy.removeAuthToken(address));
  }
  createPreDefinedStoreStrategy(strategyName, serializedAuthTokenMapper) {
    switch (strategyName) {
      case "single-key":
        return new SingleKeyStoreStrategy(globalThis.localStorage, serializedAuthTokenMapper);
      case "multiple-keys":
        return new MultipleKeysStoreStrategy(globalThis.localStorage, serializedAuthTokenMapper);
      default:
        throw new Error(`Unknown the store strategy name: ${strategyName}`);
    }
  }
};

// src/stores/inMemoryAuthorizationManagerStore.ts
var InMemoryAuthorizationManagerStore = class {
  constructor() {
    __publicField(this, "authTokensMap", /* @__PURE__ */ new Map());
  }
  getAuthToken(address) {
    return Promise.resolve(this.authTokensMap.get(address));
  }
  getAuthTokens(...addresses) {
    return Promise.resolve(addresses.reduce((result, address) => {
      const authToken = this.authTokensMap.get(address);
      if (authToken)
        result.push(authToken);
      return result;
    }, []));
  }
  upsertAuthToken(address, authToken) {
    this.authTokensMap.set(address, authToken);
    return Promise.resolve(authToken);
  }
  removeAuthToken(addressOrAuthToken) {
    const address = typeof addressOrAuthToken === "string" ? addressOrAuthToken : addressOrAuthToken.address;
    return Promise.resolve(this.authTokensMap.delete(address));
  }
};

// src/atomexBuilder/atomexComponents/authorizationManager.ts
var createDefaultAuthorizationManager = (atomexContext, options, _builderOptions) => {
  const environment = globalThis.window ? "browser" : "node";
  return new AuthorizationManager({
    atomexNetwork: atomexContext.atomexNetwork,
    signersManager: atomexContext.managers.signersManager,
    authorizationBaseUrl: options.authorizationBaseUrl,
    store: environment === "browser" ? new LocalStorageAuthorizationManagerStore(options.store.browser.storeStrategy) : new InMemoryAuthorizationManagerStore()
  });
};

// src/atomexBuilder/atomexConfig.ts
var atomexApiBaseUrl = "https://api.atomex.me";
var atomexMainnetConfig = {
  authorization: {
    authorizationBaseUrl: atomexApiBaseUrl,
    store: {
      node: {},
      browser: {
        storeStrategy: "single-key"
      }
    }
  },
  exchange: {
    apiBaseUrl: atomexApiBaseUrl,
    webSocketApiBaseUrl: "wss://ws.api.atomex.me"
  }
};
var atomexTestApiBaseUrl = "https://api.test.atomex.me";
var atomexTestnetConfig = {
  authorization: {
    authorizationBaseUrl: atomexTestApiBaseUrl,
    store: {
      node: {},
      browser: {
        storeStrategy: "single-key"
      }
    }
  },
  exchange: {
    apiBaseUrl: atomexTestApiBaseUrl,
    webSocketApiBaseUrl: "wss://ws.api.test.atomex.me"
  }
};
var config = {
  mainnet: atomexMainnetConfig,
  testnet: atomexTestnetConfig
};

// src/atomexBuilder/atomexBuilder.ts
var AtomexBuilder = class {
  constructor(options, atomexContext = new AtomexContext(options.atomexNetwork)) {
    this.options = options;
    this.atomexContext = atomexContext;
    __publicField(this, "customAuthorizationManagerFactory");
    __publicField(this, "customSignersManagerFactory");
    __publicField(this, "customExchangeManagerFactory");
  }
  get controlledAtomexContext() {
    return this.atomexContext;
  }
  useAuthorizationManager(customAuthorizationManagerFactory) {
    this.customAuthorizationManagerFactory = customAuthorizationManagerFactory;
    return this;
  }
  useSignersManager(customSignersManagerFactory) {
    this.customSignersManagerFactory = customSignersManagerFactory;
    return this;
  }
  useExchangeManager(customExchangeManagerFactory) {
    this.customExchangeManagerFactory = customExchangeManagerFactory;
    return this;
  }
  build() {
    this.controlledAtomexContext.providers.blockchainProvider = new AtomexBlockchainProvider();
    this.controlledAtomexContext.managers.signersManager = this.createSignersManager();
    this.controlledAtomexContext.managers.authorizationManager = this.createAuthorizationManager();
    const atomexClient = this.createDefaultExchangeService();
    this.controlledAtomexContext.services.exchangeService = atomexClient;
    this.controlledAtomexContext.services.swapService = atomexClient;
    this.controlledAtomexContext.managers.exchangeManager = this.createExchangeManager();
    this.controlledAtomexContext.managers.swapManager = this.createSwapManager();
    const blockchains = this.createDefaultBlockchainOptions();
    return new Atomex({
      atomexContext: this.atomexContext,
      managers: {
        signersManager: this.atomexContext.managers.signersManager,
        authorizationManager: this.atomexContext.managers.authorizationManager,
        exchangeManager: this.atomexContext.managers.exchangeManager,
        swapManager: this.atomexContext.managers.swapManager
      },
      blockchains
    });
  }
  createAuthorizationManager() {
    const defaultAuthorizationManagerOptions = config[this.atomexContext.atomexNetwork].authorization;
    return this.customAuthorizationManagerFactory ? this.customAuthorizationManagerFactory(this.atomexContext, defaultAuthorizationManagerOptions, this.options) : createDefaultAuthorizationManager(this.atomexContext, defaultAuthorizationManagerOptions, this.options);
  }
  createSignersManager() {
    return this.customSignersManagerFactory ? this.customSignersManagerFactory(this.atomexContext, this.options) : new SignersManager(this.atomexContext.atomexNetwork);
  }
  createDefaultExchangeService() {
    const defaultExchangeManagerOptions = config[this.atomexContext.atomexNetwork].exchange;
    return createDefaultExchangeService(this.atomexContext, defaultExchangeManagerOptions);
  }
  createExchangeManager() {
    return this.customExchangeManagerFactory ? this.customExchangeManagerFactory(this.atomexContext, this.options) : new ExchangeManager(this.atomexContext.services.exchangeService);
  }
  createSwapManager() {
    return new SwapManager(this.atomexContext.services.swapService);
  }
  createDefaultBlockchainOptions() {
    return {
      tezos: this.createDefaultTezosBlockchainOptions(),
      ethereum: this.createDefaultEthereumBlockchainOptions()
    };
  }
  createDefaultTezosBlockchainOptions() {
    const balancesProvider = new TezosBalancesProvider();
    const swapTransactionsProvider = new TezosSwapTransactionsProvider();
    const blockchainToolkitProvider = new TezosBlockchainToolkitProvider();
    const tezosOptions = {
      mainnet: {
        currencies: tezosMainnetCurrencies,
        balancesProvider,
        swapTransactionsProvider,
        blockchainToolkitProvider,
        currencyOptions: {}
      },
      testnet: {
        currencies: tezosTestnetCurrencies,
        balancesProvider,
        swapTransactionsProvider,
        blockchainToolkitProvider,
        currencyOptions: {}
      }
    };
    return tezosOptions;
  }
  createDefaultEthereumBlockchainOptions() {
    const balancesProvider = new EthereumBalancesProvider();
    const swapTransactionsProvider = new EthereumSwapTransactionsProvider();
    const blockchainToolkitProvider = new EthereumBlockchainToolkitProvider();
    const ethereumOptions = {
      mainnet: {
        currencies: ethereumMainnetCurrencies,
        balancesProvider,
        swapTransactionsProvider,
        blockchainToolkitProvider,
        currencyOptions: {}
      },
      testnet: {
        currencies: ethereumTestnetCurrencies,
        balancesProvider,
        swapTransactionsProvider,
        blockchainToolkitProvider,
        currencyOptions: {}
      }
    };
    return ethereumOptions;
  }
};

// src/legacy/index.ts
var legacy_exports = {};
__export(legacy_exports, {
  Atomex: () => Atomex2,
  EthereumHelpers: () => EthereumHelpers,
  FA12Helpers: () => FA12Helpers,
  FA2Helpers: () => FA2Helpers,
  Helpers: () => Helpers,
  TezosHelpers: () => TezosHelpers,
  dt2ts: () => dt2ts,
  now: () => now
});

// src/legacy/config.json
var config_default = {
  api: {
    mainnet: {
      baseUrl: "https://api.atomex.me"
    },
    testnet: {
      baseUrl: "https://api.test.atomex.me"
    },
    localhost: {
      baseUrl: "http://127.0.0.1:5000"
    }
  },
  blockchains: {
    ethereum: {
      rpc: {
        mainnet: {
          chainID: 1,
          rpc: "https://mainnet.infura.io/v3/7cd728d2d3384719a630d836f1693c5c",
          blockTime: 10
        },
        testnet: {
          chainID: 5,
          rpc: "https://goerli.infura.io/v3/7cd728d2d3384719a630d836f1693c5c",
          blockTime: 10
        }
      }
    },
    tezos: {
      rpc: {
        mainnet: {
          chainID: "NetXdQprcVkpaWU",
          rpc: "https://rpc.tzkt.io/mainnet/",
          blockTime: 30,
          minimalFees: 100,
          minimalNanotezPerGasUnit: 0.1,
          minimalNanotezPerByte: 1,
          costPerByte: 250
        },
        testnet: {
          chainID: "NetXnHfVqm9iesp",
          rpc: "https://rpc.tzkt.io/ithacanet/",
          blockTime: 15,
          minimalFees: 100,
          minimalNanotezPerGasUnit: 0.1,
          minimalNanotezPerByte: 1,
          costPerByte: 250
        }
      }
    }
  },
  currencies: {
    ETH: {
      contracts: {
        mainnet: {
          address: "0xe9c251cbb4881f9e056e40135e7d3ea9a7d037df",
          gasLimit: 2e5
        },
        testnet: {
          address: "0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b",
          gasLimit: 17e4
        },
        abi: [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              }
            ],
            name: "Activated",
            type: "event"
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              },
              {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address"
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_value",
                type: "uint256"
              }
            ],
            name: "Added",
            type: "event"
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              },
              {
                indexed: true,
                internalType: "address",
                name: "_participant",
                type: "address"
              },
              {
                indexed: false,
                internalType: "address",
                name: "_initiator",
                type: "address"
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_refundTimestamp",
                type: "uint256"
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_countdown",
                type: "uint256"
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_value",
                type: "uint256"
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_payoff",
                type: "uint256"
              },
              {
                indexed: false,
                internalType: "bool",
                name: "_active",
                type: "bool"
              }
            ],
            name: "Initiated",
            type: "event"
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              },
              {
                indexed: false,
                internalType: "bytes32",
                name: "_secret",
                type: "bytes32"
              }
            ],
            name: "Redeemed",
            type: "event"
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              }
            ],
            name: "Refunded",
            type: "event"
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32"
              }
            ],
            name: "swaps",
            outputs: [
              {
                internalType: "bytes32",
                name: "hashedSecret",
                type: "bytes32"
              },
              {
                internalType: "address payable",
                name: "initiator",
                type: "address"
              },
              {
                internalType: "address payable",
                name: "participant",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "refundTimestamp",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "countdown",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "payoff",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool"
              },
              {
                internalType: "enum Atomex.State",
                name: "state",
                type: "uint8"
              }
            ],
            payable: false,
            stateMutability: "view",
            type: "function"
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              },
              {
                internalType: "address payable",
                name: "_participant",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "_refundTimestamp",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "_payoff",
                type: "uint256"
              }
            ],
            name: "initiate",
            outputs: [],
            payable: true,
            stateMutability: "payable",
            type: "function"
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              }
            ],
            name: "add",
            outputs: [],
            payable: true,
            stateMutability: "payable",
            type: "function"
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              }
            ],
            name: "activate",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function"
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              },
              {
                internalType: "bytes32",
                name: "_secret",
                type: "bytes32"
              }
            ],
            name: "redeem",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function"
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "bytes32",
                name: "_hashedSecret",
                type: "bytes32"
              }
            ],
            name: "refund",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function"
          }
        ]
      },
      decimals: {
        original: 18,
        displayed: 4
      },
      blockchain: "ethereum"
    },
    XTZ: {
      contracts: {
        mainnet: {
          address: "KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL",
          redeemTxSize: 133,
          initiateTxSize: 200,
          gasLimit: 15e3
        },
        testnet: {
          address: "KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3",
          redeemTxSize: 133,
          initiateTxSize: 200,
          gasLimit: 85e3
        },
        entrypoints: {
          default: {
            prim: "or",
            args: [
              {
                prim: "or",
                args: [
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "address",
                        annots: [
                          "%participant"
                        ]
                      },
                      {
                        prim: "pair",
                        args: [
                          {
                            prim: "pair",
                            args: [
                              {
                                prim: "bytes",
                                annots: [
                                  "%hashed_secret"
                                ]
                              },
                              {
                                prim: "timestamp",
                                annots: [
                                  "%refund_time"
                                ]
                              }
                            ]
                          },
                          {
                            prim: "mutez",
                            annots: [
                              "%payoff"
                            ]
                          }
                        ],
                        annots: [
                          "%settings"
                        ]
                      }
                    ],
                    annots: [
                      ":initiate",
                      "%initiate"
                    ]
                  },
                  {
                    prim: "bytes",
                    annots: [
                      ":hashed_secret",
                      "%add"
                    ]
                  }
                ],
                annots: [
                  "%fund"
                ]
              },
              {
                prim: "or",
                args: [
                  {
                    prim: "bytes",
                    annots: [
                      ":secret",
                      "%redeem"
                    ]
                  },
                  {
                    prim: "bytes",
                    annots: [
                      ":hashed_secret",
                      "%refund"
                    ]
                  }
                ],
                annots: [
                  "%withdraw"
                ]
              }
            ]
          },
          withdraw: {
            prim: "or",
            args: [
              {
                prim: "bytes",
                annots: [
                  ":secret",
                  "%redeem"
                ]
              },
              {
                prim: "bytes",
                annots: [
                  ":hashed_secret",
                  "%refund"
                ]
              }
            ]
          },
          refund: {
            prim: "bytes",
            annots: [
              ":hashed_secret"
            ]
          },
          redeem: {
            prim: "bytes",
            annots: [
              ":secret"
            ]
          },
          initiate: {
            prim: "pair",
            args: [
              {
                prim: "address",
                annots: [
                  "%participant"
                ]
              },
              {
                prim: "pair",
                args: [
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "bytes",
                        annots: [
                          "%hashed_secret"
                        ]
                      },
                      {
                        prim: "timestamp",
                        annots: [
                          "%refund_time"
                        ]
                      }
                    ]
                  },
                  {
                    prim: "mutez",
                    annots: [
                      "%payoff"
                    ]
                  }
                ],
                annots: [
                  "%settings"
                ]
              }
            ],
            annots: [
              ":initiate"
            ]
          },
          fund: {
            prim: "or",
            args: [
              {
                prim: "pair",
                args: [
                  {
                    prim: "address",
                    annots: [
                      "%participant"
                    ]
                  },
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "pair",
                        args: [
                          {
                            prim: "bytes",
                            annots: [
                              "%hashed_secret"
                            ]
                          },
                          {
                            prim: "timestamp",
                            annots: [
                              "%refund_time"
                            ]
                          }
                        ]
                      },
                      {
                        prim: "mutez",
                        annots: [
                          "%payoff"
                        ]
                      }
                    ],
                    annots: [
                      "%settings"
                    ]
                  }
                ],
                annots: [
                  ":initiate",
                  "%initiate"
                ]
              },
              {
                prim: "bytes",
                annots: [
                  ":hashed_secret",
                  "%add"
                ]
              }
            ]
          },
          add: {
            prim: "bytes",
            annots: [
              ":hashed_secret"
            ]
          }
        }
      },
      decimals: {
        original: 6,
        displayed: 3
      },
      blockchain: "tezos"
    },
    TZBTC: {
      contracts: {
        mainnet: {
          address: "KT1Ap287P1NzsnToSJdA4aqSNjPomRaHBZSr",
          tokenAddress: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
          redeemTxSize: 133,
          initiateTxSize: 250,
          gasLimit: 1e5
        },
        testnet: {
          address: "KT1Jj1jzDQbDRHt4u7M73DUrBDV1napRbNFr",
          tokenAddress: "",
          redeemTxSize: 133,
          initiateTxSize: 250,
          gasLimit: 1e5
        },
        entrypoints: {
          default: {
            prim: "or",
            args: [
              {
                prim: "or",
                args: [
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "pair",
                        args: [
                          {
                            prim: "pair",
                            args: [
                              {
                                prim: "bytes",
                                annots: [
                                  "%hashedSecret"
                                ]
                              },
                              {
                                prim: "address",
                                annots: [
                                  "%participant"
                                ]
                              }
                            ]
                          },
                          {
                            prim: "pair",
                            args: [
                              {
                                prim: "nat",
                                annots: [
                                  "%payoffAmount"
                                ]
                              },
                              {
                                prim: "timestamp",
                                annots: [
                                  "%refundTime"
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        prim: "pair",
                        args: [
                          {
                            prim: "address",
                            annots: [
                              "%tokenAddress"
                            ]
                          },
                          {
                            prim: "nat",
                            annots: [
                              "%totalAmount"
                            ]
                          }
                        ]
                      }
                    ],
                    annots: [
                      "%initiate"
                    ]
                  },
                  {
                    prim: "bytes",
                    annots: [
                      "%redeem"
                    ]
                  }
                ]
              },
              {
                prim: "bytes",
                annots: [
                  "%refund"
                ]
              }
            ]
          },
          refund: {
            prim: "bytes"
          },
          redeem: {
            prim: "bytes"
          },
          initiate: {
            prim: "pair",
            args: [
              {
                prim: "pair",
                args: [
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "bytes",
                        annots: [
                          "%hashedSecret"
                        ]
                      },
                      {
                        prim: "address",
                        annots: [
                          "%participant"
                        ]
                      }
                    ]
                  },
                  {
                    prim: "nat",
                    annots: [
                      "%payoffAmount"
                    ]
                  },
                  {
                    prim: "timestamp",
                    annots: [
                      "%refundTime"
                    ]
                  }
                ]
              },
              {
                prim: "address",
                annots: [
                  "%tokenAddress"
                ]
              },
              {
                prim: "nat",
                annots: [
                  "%totalAmount"
                ]
              }
            ]
          }
        }
      },
      decimals: {
        original: 8,
        displayed: 4
      },
      blockchain: "tezos"
    },
    USDT_XTZ: {
      contracts: {
        mainnet: {
          address: "KT1Ays1Chwx3ArnHGoQXchUgDsvKe9JboUjj",
          tokenAddress: "KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o",
          redeemTxSize: 2e4,
          initiateTxSize: 2e4,
          gasLimit: 4e5
        },
        testnet: {
          address: "KT1HHjNxi3okxxGJT1SPPhpcs3gMQt8hqixY",
          tokenAddress: "KT1BWvRQnVVowZZLGkct9A7sdj5YEe8CdUhR",
          redeemTxSize: 2e4,
          initiateTxSize: 2e4,
          gasLimit: 4e5
        },
        entrypoints: {
          default: {
            prim: "or",
            args: [
              {
                prim: "or",
                args: [
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "pair",
                        args: [
                          {
                            prim: "pair",
                            args: [
                              {
                                prim: "bytes",
                                annots: [
                                  "%hashedSecret"
                                ]
                              },
                              {
                                prim: "address",
                                annots: [
                                  "%participant"
                                ]
                              }
                            ]
                          },
                          {
                            prim: "pair",
                            args: [
                              {
                                prim: "nat",
                                annots: [
                                  "%payoffAmount"
                                ]
                              },
                              {
                                prim: "timestamp",
                                annots: [
                                  "%refundTime"
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        prim: "pair",
                        args: [
                          {
                            prim: "pair",
                            args: [
                              {
                                prim: "address",
                                annots: [
                                  "%tokenAddress"
                                ]
                              },
                              {
                                prim: "nat",
                                annots: [
                                  "%tokenId"
                                ]
                              }
                            ]
                          },
                          {
                            prim: "nat",
                            annots: [
                              "%totalAmount"
                            ]
                          }
                        ]
                      }
                    ],
                    annots: [
                      "%initiate"
                    ]
                  },
                  {
                    prim: "bytes",
                    annots: [
                      "%redeem"
                    ]
                  }
                ]
              },
              {
                prim: "bytes",
                annots: [
                  "%refund"
                ]
              }
            ]
          },
          refund: {
            prim: "bytes"
          },
          redeem: {
            prim: "bytes"
          },
          initiate: {
            prim: "pair",
            args: [
              {
                prim: "pair",
                args: [
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "bytes",
                        annots: [
                          "%hashedSecret"
                        ]
                      },
                      {
                        prim: "address",
                        annots: [
                          "%participant"
                        ]
                      }
                    ]
                  },
                  {
                    prim: "nat",
                    annots: [
                      "%payoffAmount"
                    ]
                  },
                  {
                    prim: "timestamp",
                    annots: [
                      "%refundTime"
                    ]
                  }
                ]
              },
              {
                prim: "pair",
                args: [
                  {
                    prim: "address",
                    annots: [
                      "%tokenAddress"
                    ]
                  },
                  {
                    prim: "nat",
                    annots: [
                      "%tokenId"
                    ]
                  }
                ]
              },
              {
                prim: "nat",
                annots: [
                  "%totalAmount"
                ]
              }
            ]
          }
        }
      },
      decimals: {
        original: 6,
        displayed: 4
      },
      blockchain: "tezos"
    }
  }
};

// src/legacy/atomex.ts
var Atomex2 = class {
  constructor(network, baseUrl, authToken) {
    __publicField(this, "_network");
    __publicField(this, "_baseUrl");
    __publicField(this, "_authToken");
    __publicField(this, "_authorizationManager");
    this._network = network;
    this._baseUrl = baseUrl;
    this._authToken = authToken;
  }
  static create(network) {
    return new Atomex2(network == "mainnet" ? "mainnet" : "testnet", config_default.api[network].baseUrl);
  }
  setAuthorizationManager(authorizationManager) {
    this._authorizationManager = authorizationManager;
  }
  getLocalAuthToken(address) {
    var _a;
    const authToken = (_a = this._authorizationManager) == null ? void 0 : _a.getAuthToken(address);
    return authToken == null ? void 0 : authToken.value;
  }
  setAuthToken(authToken) {
    this._authToken = authToken;
  }
  async makeRequest(method, path, auth = false, params, payload) {
    const url = new URL(path, this._baseUrl);
    if (params !== void 0) {
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    }
    const headers = {};
    if (auth) {
      const authToken = typeof auth === "string" ? this.getLocalAuthToken(auth) : this._authToken;
      if (!authToken)
        throw new Error("Auth token is undefined");
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    let body = void 0;
    if (method === "post" && payload !== void 0) {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }
    const response = await fetch(url.toString(), {
      method,
      headers,
      body
    });
    if (response.ok) {
      return response.json();
    } else {
      const errBody = await response.text();
      throw Error(errBody);
    }
  }
  async getAuthToken(authRequest) {
    return this.makeRequest("post", "/v1/Token", false, {}, authRequest);
  }
  async getSymbols() {
    return this.makeRequest("get", "/v1/Symbols", false);
  }
  async getQuotes(symbolList) {
    const symbols = symbolList !== void 0 && symbolList.length > 0 ? symbolList.join(",") : "All";
    return this.makeRequest("get", "/v1/MarketData/quotes", false, { symbols });
  }
  async getOrderBook(symbol) {
    return this.makeRequest("get", "/v1/MarketData/book", false, { symbol });
  }
  async addOrder(addOrderRequest) {
    var _a;
    const [baseConfig, quoteConfig] = this.splitSymbol(addOrderRequest.symbol).map((x) => this.getCurrencyConfig(x));
    const query = addOrderRequest;
    query.requisites = __spreadValues({
      baseCurrencyContract: baseConfig.contractAddress,
      quoteCurrencyContract: quoteConfig.contractAddress
    }, query.requisites);
    return this.makeRequest("post", "/v1/Orders", ((_a = addOrderRequest.requisites) == null ? void 0 : _a.receivingAddress) || true, {}, query).then((res) => res["orderId"]);
  }
  async getOrders(address, getOrdersRequest) {
    return this.makeRequest("get", "/v1/Orders", address || true, __spreadValues({}, getOrdersRequest));
  }
  async getOrder(orderID, address) {
    return this.makeRequest("get", `/v1/Orders/${orderID}`, address || true);
  }
  async cancelOrder(orderID, symbol, side, address) {
    return this.makeRequest("delete", `/v1/Orders/${orderID}`, address || true, { symbol, side }).then((res) => res["result"]);
  }
  async addSwapRequisites(swapID, swapRequisites) {
    return this.makeRequest("post", `/v1/Swaps/${swapID}/requisites`, (swapRequisites == null ? void 0 : swapRequisites.receivingAddress) || true, {}, swapRequisites).then((res) => res["result"]);
  }
  async getSwaps(address, getSwapsRequest) {
    return this.makeRequest("get", "/v1/Swaps", address || true, __spreadValues({}, getSwapsRequest));
  }
  async getSwap(swapID, address) {
    return this.makeRequest("get", `/v1/Swaps/${swapID}`, address || true);
  }
  getOrderPreview(orderBook, side, amount, direction) {
    const availablePrices = orderBook.entries.filter((entry) => {
      if (entry.side == side) {
        return false;
      }
      const getOrderSize = () => {
        switch (side + direction) {
          case "BuySend":
          case "SellReceive":
            return amount / entry.price;
          default:
            return amount;
        }
      };
      return getOrderSize() <= Math.max(...entry.qtyProfile);
    }).map((entry) => entry.price);
    if (availablePrices.length == 0) {
      throw new Error(`No matching order found (${direction} ${amount} / ${side})`);
    }
    const bestPrice = side == "Buy" ? Math.min(...availablePrices) : Math.max(...availablePrices);
    const getExpectedAmount = () => {
      switch (side + direction) {
        case "BuySend":
        case "SellReceive":
          return amount / bestPrice;
        default:
          return amount * bestPrice;
      }
    };
    return {
      price: bestPrice,
      amountSent: direction == "Send" ? amount : getExpectedAmount(),
      amountReceived: direction == "Receive" ? amount : getExpectedAmount()
    };
  }
  splitSymbol(symbol) {
    const [baseCurrency, quoteCurrency] = symbol.split("/", 2);
    if (!baseCurrency || !quoteCurrency)
      throw new Error("Symbol is invalid");
    return [baseCurrency, quoteCurrency];
  }
  getCurrencyConfig(currency) {
    const currencyEntry = Object.entries(config_default.currencies).find(([k, _v]) => k == currency);
    if (currencyEntry == void 0) {
      throw new Error(`No matching config section for ${currency}`);
    }
    return {
      blockchain: currencyEntry[1].blockchain,
      decimals: currencyEntry[1].decimals.original,
      displayDecimals: currencyEntry[1].decimals.displayed,
      contractAddress: currencyEntry[1].contracts[this._network].address,
      tokenAddress: currencyEntry[1].contracts[this._network].tokenAddress
    };
  }
  formatAmount(amount, currency) {
    const cfg = this.getCurrencyConfig(currency);
    return typeof amount === "string" ? parseFloat(parseFloat(amount).toFixed(cfg.displayDecimals)) : parseFloat(amount.toFixed(cfg.displayDecimals));
  }
  getOrderSide(symbol, fromCurrency, toCurrency) {
    const [baseCurrency, quoteCurrency] = this.splitSymbol(symbol);
    if (baseCurrency === fromCurrency && quoteCurrency === toCurrency)
      return "Sell";
    if (quoteCurrency === fromCurrency && baseCurrency === toCurrency)
      return "Buy";
    throw new Error(`Mismatch ${fromCurrency} => ${toCurrency} (${symbol})`);
  }
  getMaxOrderSize(orderBook, side) {
    return Math.max(...orderBook.entries.filter((entry) => entry.side != side).map((entry) => Math.max(...entry.qtyProfile)));
  }
};

// src/legacy/ethereum.ts
import elliptic from "elliptic";
import Web3 from "web3";

// src/legacy/helpers.ts
var Helpers = class {
};
var dt2ts = (isoTime) => Math.round(new Date(isoTime).getTime() / 1e3);
var now = () => Math.round(Date.now() / 1e3);

// src/legacy/ethereum.ts
var EthereumHelpers = class extends Helpers {
  constructor(web3, jsonInterface, contractAddress, timeBetweenBlocks, gasLimit) {
    super();
    __publicField(this, "_web3");
    __publicField(this, "_contract");
    __publicField(this, "_timeBetweenBlocks");
    __publicField(this, "_functions");
    __publicField(this, "_gasLimit");
    this._web3 = web3;
    this._contract = new web3.eth.Contract(jsonInterface, contractAddress);
    this._timeBetweenBlocks = timeBetweenBlocks;
    this._gasLimit = gasLimit;
    this._functions = /* @__PURE__ */ new Map();
    jsonInterface.forEach((item) => {
      if (item.type === "function") {
        this._functions.set(item.name, {
          types: item.inputs,
          signature: web3.eth.abi.encodeFunctionSignature(item)
        });
      }
    });
  }
  static async create(network, rpcUri) {
    const networkSettings = config_default.blockchains.ethereum.rpc[network];
    if (rpcUri !== void 0) {
      networkSettings.rpc = rpcUri;
    }
    const web3 = new Web3(networkSettings.rpc);
    const chainID = await web3.eth.getChainId();
    if (networkSettings.chainID !== chainID) {
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);
    }
    return new EthereumHelpers(web3, config_default.currencies.ETH.contracts.abi, config_default.currencies.ETH.contracts[network].address, networkSettings.blockTime, config_default.currencies.ETH.contracts[network].gasLimit);
  }
  getAuthMessage(message, _address) {
    const nowMillis = Date.now();
    return {
      message,
      timestamp: nowMillis,
      msgToSign: message + nowMillis.toString(),
      algorithm: "Keccak256WithEcdsa:Geth2940"
    };
  }
  buildInitiateTransaction(initiateParameters) {
    if (initiateParameters.refundTimestamp < now()) {
      throw new Error(`Swap timestamp is in the past: ${initiateParameters.refundTimestamp}`);
    }
    const data = this._contract.methods.initiate("0x" + initiateParameters.secretHash, initiateParameters.receivingAddress, initiateParameters.refundTimestamp, initiateParameters.rewardForRedeem).encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
      amount: initiateParameters.netAmount + initiateParameters.rewardForRedeem
    };
  }
  buildRedeemTransaction(secret, hashedSecret) {
    const data = this._contract.methods.redeem(hashedSecret, secret).encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address
    };
  }
  buildRefundTransaction(secretHash) {
    const data = this._contract.methods.refund(secretHash).encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address
    };
  }
  buildAddTransaction(secretHash, amount) {
    const data = this._contract.methods.add(secretHash).encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
      amount
    };
  }
  buildActivateTransaction(secretHash) {
    const data = this._contract.methods.activate(secretHash).encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address
    };
  }
  parseInitiateParameters(transaction) {
    const initiateMethod = this._functions.get("initiate");
    if (!transaction.input.startsWith(initiateMethod.signature)) {
      throw new Error(`Unexpected method signature: ${transaction.input}`);
    }
    const params = this._web3.eth.abi.decodeParameters(initiateMethod.types, transaction.input.slice(initiateMethod.signature.length));
    return {
      secretHash: params["_hashedSecret"].slice(2),
      receivingAddress: params["_participant"],
      refundTimestamp: parseInt(params["_refundTimestamp"]),
      rewardForRedeem: parseInt(this._web3.utils.toBN(params["_payoff"]).toString()),
      netAmount: parseInt(this._web3.utils.toBN(transaction.value).sub(this._web3.utils.toBN(params["_payoff"])).toString())
    };
  }
  async validateInitiateTransaction(_blockHeight, txID, secretHash, receivingAddress, amount, payoff, minRefundTimestamp, minConfirmations = 2) {
    const netAmount = amount - payoff;
    const transaction = await this._web3.eth.getTransaction(txID);
    try {
      if (transaction === void 0) {
        throw new Error(`Failed to retrieve transaction: ${txID}`);
      }
      if (transaction.to !== this._contract.options.address) {
        throw new Error(`Wrong contract address: ${transaction.to}`);
      }
      const initiateParameters = this.parseInitiateParameters(transaction);
      if (initiateParameters.secretHash !== secretHash) {
        throw new Error(`Secret hash: expect ${secretHash}, actual ${initiateParameters.secretHash}`);
      }
      if (initiateParameters.receivingAddress.toLowerCase() !== receivingAddress.toLowerCase()) {
        throw new Error(`Receiving address: expect ${receivingAddress}, actual ${initiateParameters.receivingAddress}`);
      }
      if (initiateParameters.netAmount !== netAmount) {
        throw new Error(`Net amount: expect ${netAmount}, actual ${initiateParameters.netAmount}`);
      }
      if (initiateParameters.refundTimestamp < minRefundTimestamp) {
        throw new Error(`Refund timestamp: minimum ${minRefundTimestamp}, actual ${initiateParameters.refundTimestamp}`);
      }
    } catch (e) {
      return {
        status: "Invalid",
        message: e.message,
        confirmations: 0,
        nextBlockETA: 0
      };
    }
    const latestBlock = await this._web3.eth.getBlock("latest");
    const confirmations = latestBlock.number - (transaction.blockNumber || latestBlock.number);
    const res = {
      status: transaction.blockNumber !== void 0 ? "Included" : "Pending",
      confirmations,
      nextBlockETA: parseInt(latestBlock.timestamp.toString()) + this._timeBetweenBlocks
    };
    if (confirmations >= minConfirmations) {
      res.status = "Confirmed";
    }
    return res;
  }
  hexSlice(i, j, bs) {
    return "0x" + bs.slice(i * 2 + 2, j * 2 + 2);
  }
  getVRS(signature) {
    const vals = [
      this.hexSlice(64, (signature.length - 2) / 2, signature),
      this.hexSlice(0, 32, signature),
      this.hexSlice(32, 64, signature)
    ];
    return {
      v: parseInt(vals[0].slice(2), 16),
      r: vals[1].slice(2),
      s: vals[2].slice(2)
    };
  }
  recoverPublicKey(msg, signature) {
    const hash = this._web3.eth.accounts.hashMessage(msg);
    const vrs = this.getVRS(signature);
    const secp256k1 = new elliptic.ec("secp256k1");
    const ecPublicKey = secp256k1.recoverPubKey(Buffer.from(hash.slice(2), "hex"), vrs, vrs.v < 2 ? vrs.v : 1 - vrs.v % 2);
    return "0x" + ecPublicKey.encode("hex", false);
  }
  encodePublicKey(pubKey) {
    if (pubKey.startsWith("0x")) {
      return pubKey.slice(2);
    }
    return pubKey;
  }
  encodeSignature(signature) {
    const vrs = this.getVRS(signature);
    return vrs.r.padStart(64, "0") + vrs.s.padStart(64, "0");
  }
  async estimateInitiateFees(source) {
    const dummyTx = {
      receivingAddress: "0x0000000000000000000000000000000000000000",
      secretHash: "0000000000000000000000000000000000000000000000000000000000000000",
      refundTimestamp: 2147483647,
      rewardForRedeem: 0,
      netAmount: 0
    };
    const txData = this.buildInitiateTransaction(dummyTx);
    const gasPrice = await this._web3.eth.getGasPrice();
    const gasEstimate = await this._web3.eth.estimateGas({
      from: source,
      to: txData.contractAddr,
      data: txData.data,
      value: txData.amount
    });
    const fee = parseInt(gasPrice) * gasEstimate;
    return fee;
  }
  async estimateRedeemFees(_recipient) {
    const gasPrice = await this._web3.eth.getGasPrice();
    const fee = parseInt(gasPrice) * this._gasLimit;
    return {
      totalCost: fee,
      rewardForRedeem: 2 * fee
    };
  }
  isValidAddress(address) {
    return this._web3.utils.isAddress(address);
  }
};

// src/legacy/tezos.ts
import { ParameterSchema } from "@taquito/michelson-encoder";
import {
  OpKind
} from "@taquito/rpc";
import { TezosToolkit } from "@taquito/taquito";
import {
  b58cdecode as b58cdecode3,
  prefix as prefix3,
  validateAddress,
  ValidationResult
} from "@taquito/utils";
var formatTimestamp = (timestamp) => {
  return new Date(timestamp * 1e3).toISOString().slice(0, -5) + "Z";
};
var TezosHelpers = class extends Helpers {
  constructor(tezos, entrypoints, contractAddress, timeBetweenBlocks, gasLimit, minimalFees, minimalNanotezPerGasUnit, minimalNanotezPerByte, costPerByte, redeemTxSize, initiateTxSize) {
    super();
    __publicField(this, "_tezos");
    __publicField(this, "_contractAddress");
    __publicField(this, "_timeBetweenBlocks");
    __publicField(this, "_entrypoints");
    __publicField(this, "_gasLimit");
    __publicField(this, "_minimalFees");
    __publicField(this, "_minimalNanotezPerGasUnit");
    __publicField(this, "_minimalNanotezPerByte");
    __publicField(this, "_costPerByte");
    __publicField(this, "_redeemTxSize");
    __publicField(this, "_initiateTxSize");
    this._tezos = tezos;
    this._contractAddress = contractAddress;
    this._timeBetweenBlocks = timeBetweenBlocks;
    this._gasLimit = gasLimit;
    this._minimalFees = minimalFees;
    this._minimalNanotezPerGasUnit = minimalNanotezPerGasUnit;
    this._minimalNanotezPerByte = minimalNanotezPerByte;
    this._costPerByte = costPerByte;
    this._redeemTxSize = redeemTxSize;
    this._initiateTxSize = initiateTxSize;
    this._entrypoints = new Map(Object.entries(entrypoints).map(([name, typeExpr]) => {
      return [name, new ParameterSchema(typeExpr)];
    }));
  }
  static async create(network, currency = "XTZ", rpcUri) {
    const networkSettings = config_default.blockchains.tezos.rpc[network];
    if (rpcUri !== void 0) {
      networkSettings.rpc = rpcUri;
    }
    const tezos = new TezosToolkit(networkSettings.rpc);
    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString()) {
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);
    }
    return new TezosHelpers(tezos, config_default.currencies[currency].contracts.entrypoints, config_default.currencies[currency].contracts[network].address, config_default.blockchains.tezos.rpc[network].blockTime, config_default.currencies[currency].contracts[network].gasLimit, config_default.blockchains.tezos.rpc[network].minimalFees, config_default.blockchains.tezos.rpc[network].minimalNanotezPerGasUnit, config_default.blockchains.tezos.rpc[network].minimalNanotezPerByte, config_default.blockchains.tezos.rpc[network].costPerByte, config_default.currencies[currency].contracts[network].redeemTxSize, config_default.currencies[currency].contracts[network].initiateTxSize);
  }
  getTezosAlgorithm(prefix4) {
    switch (prefix4) {
      case "tz1":
        return "Ed25519:Blake2b";
      case "tz2":
        return "Blake2bWithEcdsa:Secp256k1";
      case "tz3":
        return "Blake2bWithEcdsa:Secp256r1";
      default:
        throw new Error(`Unexpected address prefix: ${prefix4}`);
    }
  }
  getAuthMessage(message, address) {
    const nowMillis = Date.now();
    return {
      message,
      timestamp: nowMillis,
      msgToSign: message + nowMillis.toString(),
      algorithm: this.getTezosAlgorithm(address.slice(0, 3))
    };
  }
  buildInitiateTransaction(initiateParameters) {
    var _a;
    if (initiateParameters.refundTimestamp < now()) {
      throw new Error(`Swap timestamp is in the past: ${initiateParameters.refundTimestamp}`);
    }
    const parameter = (_a = this._entrypoints.get("initiate")) == null ? void 0 : _a.Encode(initiateParameters.receivingAddress, initiateParameters.secretHash, formatTimestamp(initiateParameters.refundTimestamp), initiateParameters.rewardForRedeem);
    return {
      data: {
        entrypoint: "initiate",
        value: parameter
      },
      contractAddr: this._contractAddress,
      amount: initiateParameters.netAmount + initiateParameters.rewardForRedeem
    };
  }
  buildRedeemTransaction(secret, _hashedSecret = "") {
    var _a;
    return {
      data: {
        entrypoint: "redeem",
        value: (_a = this._entrypoints.get("redeem")) == null ? void 0 : _a.Encode(secret)
      },
      contractAddr: this._contractAddress
    };
  }
  buildRefundTransaction(secretHash) {
    var _a;
    return {
      data: {
        entrypoint: "refund",
        value: (_a = this._entrypoints.get("refund")) == null ? void 0 : _a.Encode(secretHash)
      },
      contractAddr: this._contractAddress
    };
  }
  buildAddTransaction(secretHash, amount) {
    var _a;
    return {
      amount,
      data: {
        entrypoint: "add",
        value: (_a = this._entrypoints.get("add")) == null ? void 0 : _a.Encode(secretHash)
      },
      contractAddr: this._contractAddress
    };
  }
  getBlockDetails(block) {
    return {
      level: block.metadata.level_info.level,
      timestamp: dt2ts(block.header.timestamp)
    };
  }
  parseInitiateParameters(content) {
    var _a;
    if (content.parameters === void 0) {
      throw new Error("Parameters are undefined");
    }
    const params = (_a = this._entrypoints.get(content.parameters.entrypoint)) == null ? void 0 : _a.Execute(content.parameters.value);
    if (params === void 0) {
      throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);
    }
    const initiateParams = (() => {
      switch (content.parameters.entrypoint) {
        case "initiate":
          return params;
        case "fund":
        case "default":
          return params["initiate"];
        default:
          throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);
      }
    })();
    return {
      secretHash: initiateParams["settings"]["hashed_secret"],
      receivingAddress: initiateParams["participant"],
      refundTimestamp: dt2ts(initiateParams["settings"]["refund_time"]),
      netAmount: parseInt(content.amount) - parseInt(initiateParams["settings"]["payoff"]),
      rewardForRedeem: parseInt(initiateParams["settings"]["payoff"])
    };
  }
  findContractCall(block, txID) {
    var _a;
    const opg = (_a = block.operations[3]) == null ? void 0 : _a.find((opg2) => opg2.hash == txID);
    if (opg === void 0) {
      throw new Error(`Operation not found: ${txID} @ ${block.hash}`);
    }
    const contents = opg.contents.filter((c) => c.kind == "transaction" && c.destination == this._contractAddress);
    if (contents.length === 0) {
      throw new Error("Unsupported contract version is used");
    }
    return contents;
  }
  async validateInitiateTransaction(blockHeight, txID, secretHash, receivingAddress, amount, payoff, minRefundTimestamp, minConfirmations = 2) {
    const netAmount = amount - payoff;
    const block = await this._tezos.rpc.getBlock({
      block: blockHeight.toString()
    });
    try {
      const tx = this.findContractCall(block, txID).find((content) => {
        const initiateParameters = this.parseInitiateParameters(content);
        if (initiateParameters.secretHash !== secretHash) {
          console.log(`[${content.counter}] Secret hash: expect ${secretHash}, actual ${initiateParameters.secretHash}`);
          return false;
        }
        if (initiateParameters.receivingAddress.toLowerCase() !== receivingAddress.toLowerCase()) {
          console.log(`[${content.counter}] Receiving address: expect ${receivingAddress}, actual ${initiateParameters.receivingAddress}`);
          return false;
        }
        if (initiateParameters.netAmount !== netAmount) {
          console.log(`[${content.counter}] Net amount: expect ${netAmount}, actual ${initiateParameters.netAmount}`);
          return false;
        }
        if (initiateParameters.refundTimestamp < minRefundTimestamp) {
          console.log(`[${content.counter}] Refund timestamp: minimum ${minRefundTimestamp}, actual ${initiateParameters.refundTimestamp}`);
          return false;
        }
        return true;
      }, this);
      if (tx === void 0) {
        throw new Error(`Initiate transaction that satisfies the expected criteria is not found in ${txID} contents`);
      }
    } catch (e) {
      return {
        status: "Invalid",
        message: e.message,
        confirmations: 0,
        nextBlockETA: 0
      };
    }
    const headDetails = this.getBlockDetails(await this._tezos.rpc.getBlock({ block: "head" }));
    const txBlockDetails = this.getBlockDetails(block);
    const confirmations = headDetails.level - txBlockDetails.level;
    const res = {
      status: "Included",
      confirmations,
      nextBlockETA: headDetails.timestamp + this._timeBetweenBlocks
    };
    if (confirmations >= minConfirmations) {
      res.status = "Confirmed";
    }
    return res;
  }
  encodePublicKey(pubKey) {
    const curve = pubKey.substring(0, 2);
    switch (curve) {
      case "ed":
        return Buffer.from(b58cdecode3(pubKey, prefix3["edpk"])).toString("hex");
      case "p2":
        return Buffer.from(b58cdecode3(pubKey, prefix3["p2pk"])).toString("hex");
      case "sp":
        return Buffer.from(b58cdecode3(pubKey, prefix3["sppk"])).toString("hex");
      default:
        throw new Error("Unsupported Public Key Type");
    }
  }
  encodeSignature(signature) {
    var _a;
    const pref = signature.startsWith("sig") ? signature.substring(0, 3) : signature.substring(0, 5);
    if (Object.prototype.hasOwnProperty.call(prefix3, pref)) {
      return Buffer.from(b58cdecode3(signature, (_a = Object.getOwnPropertyDescriptor(prefix3, pref)) == null ? void 0 : _a.value)).toString("hex");
    }
    throw new Error("Unsupported Signature Type");
  }
  calcFees(gas = 0, storageDiff = 0, txSize = 0) {
    return this._minimalFees + this._minimalNanotezPerGasUnit * gas + this._minimalNanotezPerByte * txSize + storageDiff * this._costPerByte;
  }
  async estimateInitiateFees(source) {
    const dummyTx = {
      receivingAddress: "tz1Q2prWCrDGFDuGTe7axdt4z9e3QkCqdhmD",
      secretHash: "169cbd29345af89a0983f28254e71bdd1367890b9876fc8a9ea117c32f6a521b",
      refundTimestamp: 2147483647,
      rewardForRedeem: 0,
      netAmount: 100
    };
    const tx = this.buildInitiateTransaction(dummyTx);
    const header = await this._tezos.rpc.getBlockHeader();
    const contract = await this._tezos.rpc.getContract(source);
    const op = await this._tezos.rpc.runOperation({
      chain_id: header.chain_id,
      operation: {
        branch: header.hash,
        signature: "sigUHx32f9wesZ1n2BWpixXz4AQaZggEtchaQNHYGRCoWNAXx45WGW2ua3apUUUAGMLPwAU41QoaFCzVSL61VaessLg4YbbP",
        contents: [
          {
            amount: "0",
            counter: (parseInt(contract.counter || "0") + 1).toString(),
            destination: this._contractAddress,
            fee: this.calcFees(104e4, 6e4, this._initiateTxSize).toString(),
            gas_limit: "1040000",
            kind: OpKind.TRANSACTION,
            source,
            storage_limit: "60000",
            parameters: tx.data
          }
        ]
      }
    });
    let paidStorageDiff = 0, consumedGas = 0;
    op.contents.forEach((tx2) => {
      if (tx2.metadata.operation_result.status !== "applied") {
        throw new Error("Some error was encountered while estimating fees");
      }
      consumedGas += parseInt(tx2.metadata.operation_result.consumed_gas || "0");
      paidStorageDiff += parseInt(tx2.metadata.operation_result.paid_storage_size_diff || "0");
    });
    return this.calcFees(consumedGas, paidStorageDiff, this._initiateTxSize);
  }
  async estimateRedeemFees(recipient) {
    let fees = this.calcFees(this._gasLimit, 0, this._redeemTxSize);
    const revealedKey = await this._tezos.rpc.getManagerKey(recipient);
    if (revealedKey === null) {
      fees += 257 * this._costPerByte;
    }
    return {
      totalCost: fees,
      rewardForRedeem: 2 * fees
    };
  }
  isValidAddress(address) {
    return validateAddress(address) == ValidationResult.VALID;
  }
};

// src/legacy/fa12.ts
import { TezosToolkit as TezosToolkit2 } from "@taquito/taquito";
var FA12Helpers = class extends TezosHelpers {
  static async create(network, currency, rpcUri) {
    const networkSettings = config_default.blockchains.tezos.rpc[network];
    if (rpcUri !== void 0) {
      networkSettings.rpc = rpcUri;
    }
    const tezos = new TezosToolkit2(networkSettings.rpc);
    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString()) {
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);
    }
    return new FA12Helpers(tezos, config_default.currencies[currency].contracts.entrypoints, config_default.currencies[currency].contracts[network].address, config_default.blockchains.tezos.rpc[network].blockTime, config_default.currencies[currency].contracts[network].gasLimit, config_default.blockchains.tezos.rpc[network].minimalFees, config_default.blockchains.tezos.rpc[network].minimalNanotezPerGasUnit, config_default.blockchains.tezos.rpc[network].minimalNanotezPerByte, config_default.blockchains.tezos.rpc[network].costPerByte, config_default.currencies[currency].contracts[network].redeemTxSize, config_default.currencies[currency].contracts[network].initiateTxSize);
  }
  parseInitiateParameters(content) {
    var _a;
    if (content.parameters === void 0) {
      throw new Error("Parameters are undefined");
    }
    const params = (_a = this._entrypoints.get(content.parameters.entrypoint)) == null ? void 0 : _a.Execute(content.parameters.value);
    if (params === void 0) {
      throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);
    }
    const initiateParams = (() => {
      switch (content.parameters.entrypoint) {
        case "initiate":
          return params;
        case "default":
          return params["initiate"];
        default:
          throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);
      }
    })();
    return {
      secretHash: initiateParams["hashedSecret"],
      receivingAddress: initiateParams["participant"],
      refundTimestamp: dt2ts(initiateParams["refundTime"]),
      netAmount: parseInt(initiateParams["totalAmount"]) - parseInt(initiateParams["payoffAmount"]),
      rewardForRedeem: parseInt(initiateParams["payoffAmount"])
    };
  }
};

// src/legacy/fa2.ts
import { TezosToolkit as TezosToolkit3 } from "@taquito/taquito";
var FA2Helpers = class extends TezosHelpers {
  static async create(network, currency, rpcUri) {
    const networkSettings = config_default.blockchains.tezos.rpc[network];
    if (rpcUri !== void 0) {
      networkSettings.rpc = rpcUri;
    }
    const tezos = new TezosToolkit3(networkSettings.rpc);
    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString()) {
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);
    }
    return new FA2Helpers(tezos, config_default.currencies[currency].contracts.entrypoints, config_default.currencies[currency].contracts[network].address, config_default.blockchains.tezos.rpc[network].blockTime, config_default.currencies[currency].contracts[network].gasLimit, config_default.blockchains.tezos.rpc[network].minimalFees, config_default.blockchains.tezos.rpc[network].minimalNanotezPerGasUnit, config_default.blockchains.tezos.rpc[network].minimalNanotezPerByte, config_default.blockchains.tezos.rpc[network].costPerByte, config_default.currencies[currency].contracts[network].redeemTxSize, config_default.currencies[currency].contracts[network].initiateTxSize);
  }
  parseInitiateParameters(content) {
    var _a;
    if (!content.parameters) {
      throw new Error("Parameters are undefined");
    }
    const params = (_a = this._entrypoints.get(content.parameters.entrypoint)) == null ? void 0 : _a.Execute(content.parameters.value);
    if (!params) {
      throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);
    }
    const initiateParams = this.getInitiateParams(content.parameters.entrypoint, params);
    return {
      secretHash: initiateParams["hashedSecret"],
      receivingAddress: initiateParams["participant"],
      refundTimestamp: dt2ts(initiateParams["refundTime"]),
      netAmount: parseInt(initiateParams["totalAmount"]) - parseInt(initiateParams["payoffAmount"]),
      rewardForRedeem: parseInt(initiateParams["payoffAmount"])
    };
  }
  getInitiateParams(entrypoint, params) {
    switch (entrypoint) {
      case "initiate":
        return params;
      case "default":
        return params["initiate"];
      default:
        throw new Error(`Unexpected entrypoint: ${entrypoint}`);
    }
  }
};
export {
  Atomex,
  AtomexBuilder,
  AuthTokenSource,
  AuthorizationManager,
  DefaultSerializedAuthTokenMapper,
  ImportantDataReceivingMode,
  InMemoryAuthorizationManagerStore,
  InMemoryCurrenciesProvider,
  InMemoryTezosSigner,
  LocalStorageAuthorizationManagerStore,
  MixedApiAtomexClient,
  RestAtomexClient,
  SignersManager,
  WalletTezosSigner,
  Web3EthereumSigner,
  WebSocketAtomexClient,
  atomexUtils_exports as atomexUtils,
  converters_exports as converters,
  legacy_exports as legacy,
  prepareTimeoutDuration,
  text_exports as textUtils,
  wait
};
//# sourceMappingURL=index.js.map
