"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Atomex: () => Atomex,
  AtomexBuilder: () => AtomexBuilder,
  AuthTokenSource: () => AuthTokenSource,
  AuthorizationManager: () => AuthorizationManager,
  DataSource: () => DataSource,
  DefaultSerializedAuthTokenMapper: () => DefaultSerializedAuthTokenMapper,
  ERC20EthereumWeb3AtomexProtocolV1: () => ERC20EthereumWeb3AtomexProtocolV1,
  EthereumWeb3AtomexProtocolV1: () => EthereumWeb3AtomexProtocolV1,
  ExchangeManager: () => ExchangeManager,
  FA12TezosTaquitoAtomexProtocolV1: () => FA12TezosTaquitoAtomexProtocolV1,
  FA2TezosTaquitoAtomexProtocolV1: () => FA2TezosTaquitoAtomexProtocolV1,
  ImportantDataReceivingMode: () => ImportantDataReceivingMode,
  InMemoryAuthorizationManagerStore: () => InMemoryAuthorizationManagerStore,
  InMemoryExchangeSymbolsProvider: () => InMemoryExchangeSymbolsProvider,
  LocalStorageAuthorizationManagerStore: () => LocalStorageAuthorizationManagerStore,
  MixedApiAtomexClient: () => MixedApiAtomexClient,
  RestAtomexClient: () => RestAtomexClient,
  TaquitoBlockchainWallet: () => TaquitoBlockchainWallet,
  TezosTaquitoAtomexProtocolV1: () => TezosTaquitoAtomexProtocolV1,
  WalletsManager: () => WalletsManager,
  Web3BlockchainWallet: () => Web3BlockchainWallet,
  WebSocketAtomexClient: () => WebSocketAtomexClient,
  atomexUtils: () => atomexUtils_exports,
  converters: () => converters_exports,
  createDefaultMainnetAtomex: () => createDefaultMainnetAtomex,
  createDefaultTestnetAtomex: () => createDefaultTestnetAtomex,
  guards: () => guards_exports,
  legacy: () => legacy_exports,
  prepareTimeoutDuration: () => prepareTimeoutDuration,
  textUtils: () => text_exports,
  wait: () => wait
});
module.exports = __toCommonJS(src_exports);

// src/atomex/atomex.ts
var Atomex = class {
  constructor(options) {
    this.options = options;
    this.atomexContext = options.atomexContext;
    this.wallets = options.managers.walletsManager;
    this.authorization = options.managers.authorizationManager;
    this.exchangeManager = options.managers.exchangeManager;
    this.swapManager = options.managers.swapManager;
    if (options.blockchains)
      for (const blockchainName of Object.keys(options.blockchains))
        this.addBlockchain((_context) => [blockchainName, options.blockchains[blockchainName]]);
  }
  authorization;
  exchangeManager;
  swapManager;
  wallets;
  atomexContext;
  _isStarted = false;
  get atomexNetwork() {
    return this.atomexContext.atomexNetwork;
  }
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    await this.authorization.start();
    await this.exchangeManager.start();
    await this.swapManager.start();
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this.authorization.stop();
    this.exchangeManager.stop();
    this.swapManager.stop();
    this._isStarted = false;
  }
  addBlockchain(factoryMethod) {
    const [blockchain, blockchainOptions] = factoryMethod(this.atomexContext);
    const networkOptions = this.atomexNetwork == "mainnet" ? blockchainOptions.mainnet : blockchainOptions.testnet;
    if (networkOptions)
      this.atomexContext.providers.blockchainProvider.addBlockchain(blockchain, networkOptions);
  }
  getCurrency(currencyId) {
    return this.atomexContext.providers.currenciesProvider.getCurrency(currencyId);
  }
  async swap(newSwapRequestOrSwapId, _completeStage = 15 /* All */) {
    if (typeof newSwapRequestOrSwapId === "number")
      throw new Error("Swap tracking is not implemented yet");
    const orderId = await this.exchangeManager.addOrder(newSwapRequestOrSwapId.accountAddress, newSwapRequestOrSwapId);
    const order = await this.exchangeManager.getOrder(newSwapRequestOrSwapId.accountAddress, orderId);
    if (!order)
      throw new Error(`The ${orderId} order not found`);
    if (order.status !== "Filled")
      throw new Error(`The ${orderId} order is not filled`);
    const swaps = await Promise.all(order.swapIds.map((swapId) => this.swapManager.getSwap(swapId, newSwapRequestOrSwapId.accountAddress)));
    if (!swaps.length)
      throw new Error("Swaps not found");
    if (swaps.some((swap) => !swap))
      throw new Error("Swap not found");
    return swaps.length === 1 ? swaps[0] : swaps;
  }
};

// src/atomex/atomexContext.ts
var _AtomexContext = class {
  constructor(atomexNetwork) {
    this.atomexNetwork = atomexNetwork;
    this.id = _AtomexContext.idCounter++;
    this.managers = new AtomexContextManagersSection(this);
    this.services = new AtomexContextServicesSection(this);
    this.providers = new AtomexContextProvidersSection(this);
  }
  id;
  managers;
  services;
  providers;
};
var AtomexContext = _AtomexContext;
__publicField(AtomexContext, "idCounter", 0);
var AtomexContextManagersSection = class {
  constructor(context) {
    this.context = context;
  }
  _walletsManager;
  _authorizationManager;
  _exchangeManager;
  _swapManager;
  get walletsManager() {
    if (!this._walletsManager)
      throw new AtomexComponentNotResolvedError("managers.walletsManager");
    return this._walletsManager;
  }
  set walletsManager(walletsManager) {
    this._walletsManager = walletsManager;
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
  }
  _exchangeService;
  _swapService;
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
  }
  _blockchainProvider;
  _currenciesProvider;
  _exchangeSymbolsProvider;
  _orderBookProvider;
  get blockchainProvider() {
    if (!this._blockchainProvider)
      throw new AtomexComponentNotResolvedError("providers.blockchainProvider");
    return this._blockchainProvider;
  }
  set blockchainProvider(blockchainProvider) {
    this._blockchainProvider = blockchainProvider;
  }
  get currenciesProvider() {
    if (!this._currenciesProvider)
      throw new AtomexComponentNotResolvedError("providers.currenciesProvider");
    return this._currenciesProvider;
  }
  set currenciesProvider(currenciesProvider) {
    this._currenciesProvider = currenciesProvider;
  }
  get exchangeSymbolsProvider() {
    if (!this._exchangeSymbolsProvider)
      throw new AtomexComponentNotResolvedError("providers.exchangeSymbolsProvider");
    return this._exchangeSymbolsProvider;
  }
  set exchangeSymbolsProvider(exchangeSymbolsProvider) {
    this._exchangeSymbolsProvider = exchangeSymbolsProvider;
  }
  get orderBookProvider() {
    if (!this._orderBookProvider)
      throw new AtomexComponentNotResolvedError("providers.orderBookProvider");
    return this._orderBookProvider;
  }
  set orderBookProvider(orderBookProvider) {
    this._orderBookProvider = orderBookProvider;
  }
};
var AtomexComponentNotResolvedError = class extends Error {
  name;
  componentName;
  constructor(componentName) {
    super(AtomexComponentNotResolvedError.getMessage(componentName));
    this.componentName = componentName;
    this.name = this.constructor.name;
  }
  static getMessage(componentName) {
    return `Atomex "${componentName}" component has not resolved yet`;
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
  toFixedBigNumber: () => toFixedBigNumber,
  tokensAmountToNat: () => tokensAmountToNat,
  uint8ArrayToHexString: () => uint8ArrayToHexString
});
var import_bignumber = __toESM(require("bignumber.js"));

// src/native/index.node.ts
var import_node_buffer = require("node:buffer");

// src/utils/converters.ts
var hexStringToUint8Array = (hex) => {
  var _a;
  const integers = (_a = hex.match(/[\da-f]{2}/gi)) == null ? void 0 : _a.map((val) => parseInt(val, 16));
  return new Uint8Array(integers);
};
var uint8ArrayToHexString = (value) => import_node_buffer.Buffer.from(value).toString("hex");
var stringToHexString = (value) => import_node_buffer.Buffer.from(value, "utf8").toString("hex");
var hexStringToString = (value) => import_node_buffer.Buffer.from(hexStringToUint8Array(value)).toString("utf8");
var objectToHexString = (value) => stringToHexString(JSON.stringify(value));
var hexStringToObject = (value) => {
  try {
    return JSON.parse(hexStringToString(value));
  } catch {
    return null;
  }
};
var tokensAmountToNat = (tokensAmount, decimals) => {
  return new import_bignumber.default(tokensAmount).multipliedBy(10 ** decimals).integerValue();
};
var numberToTokensAmount = (value, decimals) => {
  return new import_bignumber.default(value).integerValue().div(10 ** decimals);
};
var toFixedBigNumber = (value, decimalPlaces, roundingMode) => {
  value = import_bignumber.default.isBigNumber(value) ? value : new import_bignumber.default(value);
  return new import_bignumber.default(value.toFixed(decimalPlaces, roundingMode));
};

// src/utils/guards.ts
var guards_exports = {};
__export(guards_exports, {
  isArray: () => isArray,
  isPlainObject: () => isPlainObject,
  isReadonlyArray: () => isReadonlyArray
});
var import_lodash = __toESM(require("lodash.isplainobject"));
var isArray = (arg) => {
  return Array.isArray(arg);
};
var isReadonlyArray = (arg) => {
  return Array.isArray(arg);
};
var isPlainObject = (value) => {
  return (0, import_lodash.default)(value);
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

// src/blockchain/walletsManager.ts
var WalletsManager = class {
  constructor(atomexNetwork) {
    this.atomexNetwork = atomexNetwork;
  }
  wallets = /* @__PURE__ */ new Set();
  addWallet(wallet) {
    atomexUtils_exports.ensureNetworksAreSame(this, wallet);
    this.wallets.add(wallet);
    return Promise.resolve(wallet);
  }
  async removeWallet(wallet) {
    const result = this.wallets.delete(wallet);
    return Promise.resolve(result);
  }
  async getWallet(address, blockchain, toolkit) {
    if (!this.wallets.size || !address && !blockchain && !toolkit)
      return void 0;
    const walletPromises = [];
    for (const wallet of this.wallets) {
      if (toolkit && wallet.id !== toolkit)
        continue;
      const addressOrPromise = address ? wallet.getAddress() : void 0;
      const blockchainOrPromise = blockchain ? wallet.getBlockchain() : void 0;
      if ((!address || address === addressOrPromise) && (!blockchain || blockchain == blockchainOrPromise))
        return wallet;
      walletPromises.push(Promise.all([addressOrPromise, blockchainOrPromise]).then(([address2, blockchain2]) => [wallet, address2, blockchain2]));
    }
    const walletResults = await Promise.allSettled(walletPromises);
    for (const walletResult of walletResults) {
      if (walletResult.status !== "fulfilled") {
        continue;
      }
      const [wallet, walletAddress, walletBlockchain] = walletResult.value;
      if ((!address || address === walletAddress) && (!blockchain || blockchain == walletBlockchain))
        return wallet;
    }
    return void 0;
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
  currencyInfoMap = /* @__PURE__ */ new Map();
  networkOptionsMap = /* @__PURE__ */ new Map();
  blockchainToolkitProviders = /* @__PURE__ */ new Set();
  addBlockchain(blockchain, networkOptions) {
    if (this.networkOptionsMap.has(blockchain))
      throw new Error("There is already blockchain added with the same key");
    this.networkOptionsMap.set(blockchain, networkOptions);
    this.blockchainToolkitProviders.add(networkOptions.blockchainToolkitProvider);
    for (const currency of networkOptions.currencies) {
      if (this.currencyInfoMap.has(currency.id))
        throw new Error("There is already currency added with the same key");
      const currencyOptions = networkOptions.currencyOptions[currency.id];
      const options = {
        currency,
        atomexProtocol: currencyOptions == null ? void 0 : currencyOptions.atomexProtocol,
        blockchainToolkitProvider: networkOptions.blockchainToolkitProvider,
        balanceProvider: (currencyOptions == null ? void 0 : currencyOptions.currencyBalanceProvider) ?? this.createControlledBalancesProvider(currency, networkOptions.balancesProvider),
        swapTransactionsProvider: (currencyOptions == null ? void 0 : currencyOptions.swapTransactionsProvider) ?? networkOptions.swapTransactionsProvider
      };
      this.currencyInfoMap.set(currency.id, options);
    }
  }
  getNetworkOptions(blockchain) {
    return this.networkOptionsMap.get(blockchain);
  }
  getCurrency(currencyId) {
    var _a;
    return (_a = this.getCurrencyInfo(currencyId)) == null ? void 0 : _a.currency;
  }
  async getReadonlyToolkit(toolkitId, blockchain) {
    const providerToolkitPromises = [];
    for (const provider of this.blockchainToolkitProviders) {
      if (provider.toolkitId === toolkitId)
        providerToolkitPromises.push(provider.getReadonlyToolkit(blockchain));
    }
    const providerToolkitResults = await Promise.all(providerToolkitPromises);
    for (const providerResult of providerToolkitResults) {
      if (providerResult)
        return providerResult;
    }
    return Promise.resolve(void 0);
  }
  getCurrencyInfo(currencyId) {
    const options = this.currencyInfoMap.get(currencyId);
    return options;
  }
  createControlledBalancesProvider(currency, balancesProvider) {
    return new ControlledCurrencyBalancesProvider(currency, (address) => balancesProvider.getBalance(address, currency));
  }
};

// src/evm/atomexProtocol/web3AtomexProtocolV1.ts
var Web3AtomexProtocolV1 = class {
  constructor(blockchain, atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager) {
    this.blockchain = blockchain;
    this.atomexNetwork = atomexNetwork;
    this.atomexProtocolOptions = atomexProtocolOptions;
    this.atomexBlockchainProvider = atomexBlockchainProvider;
    this.walletsManager = walletsManager;
  }
  version = 1;
  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }
  async getReadonlyWeb3() {
    const toolkit = await this.atomexBlockchainProvider.getReadonlyToolkit("web3", this.blockchain);
    if (!toolkit)
      throw new Error("Web3 toolkit not found");
    return toolkit;
  }
  async getWallet(address) {
    const web3Wallet = await this.walletsManager.getWallet(address, this.blockchain, "web3");
    if (!web3Wallet)
      throw new Error(`${this.blockchain} Web3 wallet not found`);
    return web3Wallet;
  }
};

// src/evm/wallets/web3BlockchainWallet.ts
var import_web3 = __toESM(require("web3"));

// src/ethereum/utils/index.ts
var import_elliptic = require("elliptic");
var secp256k1Curve = null;
var getSecp256k1Curve = () => {
  if (!secp256k1Curve)
    secp256k1Curve = new import_elliptic.ec("secp256k1");
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
  const messageBuffer = import_node_buffer.Buffer.from(web3MessageHash.startsWith("0x") ? web3MessageHash.substring(2) : web3MessageHash, "hex");
  const ecPublicKey = getSecp256k1Curve().recoverPubKey(messageBuffer, { r: splittedSignature.r, s: splittedSignature.s }, splittedSignature.recoveryParameter);
  return "0x" + ecPublicKey.encode("hex", false);
};

// src/evm/wallets/web3BlockchainWallet.ts
var _Web3BlockchainWallet = class {
  constructor(atomexNetwork, provider) {
    this.atomexNetwork = atomexNetwork;
    this.provider = provider;
    this.toolkit = new import_web3.default(provider);
  }
  id = "web3";
  toolkit;
  async getBlockchain() {
    const chainId = await this.toolkit.eth.getChainId();
    switch (chainId) {
      case 1:
      case 5:
        return "ethereum";
      case 56:
      case 97:
        return "binance";
    }
    return "";
  }
  async getAddress() {
    const accounts = await this.toolkit.eth.getAccounts();
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
    const publicKeyBytes = recoverPublicKey(signatureBytes, this.toolkit.eth.accounts.hashMessage(message));
    return {
      address,
      publicKeyBytes: publicKeyBytes.startsWith("0x") ? publicKeyBytes.substring(2) : publicKeyBytes,
      signatureBytes: signatureBytes.substring(signatureBytes.startsWith("0x") ? 2 : 0, signatureBytes.length - 2),
      algorithm: _Web3BlockchainWallet.signingAlgorithm
    };
  }
  signInternal(message, address) {
    return new Promise((resolve, reject) => this.toolkit.eth.personal.sign(message, address, "", (error, signature) => {
      return signature ? resolve(signature) : reject(error);
    }));
  }
  static async bind(atomex, provider) {
    const wallet = new _Web3BlockchainWallet(atomex.atomexNetwork, provider);
    await atomex.wallets.addWallet(wallet);
    return wallet;
  }
};
var Web3BlockchainWallet = _Web3BlockchainWallet;
__publicField(Web3BlockchainWallet, "signingAlgorithm", "Keccak256WithEcdsa:Geth2940");

// src/evm/blockchainToolkitProviders/web3BlockchainToolkitProvider.ts
var import_web32 = __toESM(require("web3"));
var Web3BlockchainToolkitProvider = class {
  constructor(blockchain, rpcUrl) {
    this.blockchain = blockchain;
    this.rpcUrl = rpcUrl;
  }
  toolkitId = "web3";
  toolkit;
  getReadonlyToolkit(blockchain) {
    if (blockchain && blockchain !== this.blockchain)
      return Promise.resolve(void 0);
    if (!this.toolkit)
      this.toolkit = new import_web32.default(this.rpcUrl);
    return Promise.resolve(this.toolkit);
  }
};

// src/ethereum/atomexProtocol/ethereumWeb3AtomexProtocolV1.ts
var EthereumWeb3AtomexProtocolV1 = class extends Web3AtomexProtocolV1 {
  constructor(atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager) {
    super("ethereum", atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager);
    this.atomexProtocolOptions = atomexProtocolOptions;
  }
  initiate(_params) {
    throw new Error("Method not implemented.");
  }
  async getEstimatedInitiateFees(_params) {
    throw new Error("Method not implemented.");
  }
  redeem(_params) {
    throw new Error("Method not implemented.");
  }
  getRedeemReward(_nativeTokenPriceInUsd, _nativeTokenPriceInCurrency) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRedeemFees(_params) {
    throw new Error("Method not implemented.");
  }
  refund(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRefundFees(_params) {
    throw new Error("Method not implemented.");
  }
};

// src/ethereum/atomexProtocol/erc20EthereumWeb3AtomexProtocolV1.ts
var ERC20EthereumWeb3AtomexProtocolV1 = class extends Web3AtomexProtocolV1 {
  constructor(atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager) {
    super("ethereum", atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager);
    this.atomexProtocolOptions = atomexProtocolOptions;
  }
  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }
  initiate(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedInitiateFees(_params) {
    throw new Error("Method not implemented.");
  }
  redeem(_params) {
    throw new Error("Method not implemented.");
  }
  getRedeemReward(_nativeTokenPriceInUsd, _nativeTokenPriceInCurrency) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRedeemFees(_params) {
    throw new Error("Method not implemented.");
  }
  refund(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRefundFees(_params) {
    throw new Error("Method not implemented.");
  }
};

// src/ethereum/balancesProviders/ethereumBalancesProvider.ts
var EthereumBalancesProvider = class {
  getBalance(_address, _currency) {
    throw new Error("Method not implemented.");
  }
};

// src/ethereum/swapTransactionsProviders/ethereumSwapTransactionsProvider.ts
var EthereumSwapTransactionsProvider = class {
  _isStarted = false;
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this._isStarted = false;
  }
  getSwapTransactions(_swap) {
    throw new Error("Method not implemented.");
  }
};

// src/ethereum/config/currencies.ts
var nativeEthereumCurrency = {
  id: "ETH",
  name: "Ethereum",
  symbol: "ETH",
  blockchain: "ethereum",
  decimals: 18,
  type: "native"
};
var ethereumMainnetCurrencies = [
  nativeEthereumCurrency
];
var ethereumTestnetCurrencies = [
  nativeEthereumCurrency
];

// src/ethereum/config/atomexProtocol/base.ts
var ethereumWeb3AtomexProtocolV1ABI = [
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
];

// src/ethereum/config/atomexProtocol/mainnetV1Options.ts
var mainnetNativeEthereumWeb3AtomexProtocolV1Options = {
  atomexProtocolVersion: 1,
  currencyId: "ETH",
  swapContractAddress: "0xe9c251cbb4881f9e056e40135e7d3ea9a7d037df",
  swapContractBlockId: "8168569",
  initiateOperation: {
    gasLimit: {
      withoutReward: 2e5,
      withReward: 21e4
    }
  },
  redeemOperation: {
    gasLimit: 14e4
  },
  refundOperation: {
    gasLimit: 9e4
  },
  defaultGasPriceInGwei: 90,
  maxGasPriceInGwei: 650,
  abi: ethereumWeb3AtomexProtocolV1ABI
};
var mainnetEthereumWeb3AtomexProtocolV1Options = {
  ETH: mainnetNativeEthereumWeb3AtomexProtocolV1Options
};

// src/ethereum/config/atomexProtocol/testnetV1Options.ts
var testnetNativeEthereumWeb3AtomexProtocolV1Options = {
  ...mainnetEthereumWeb3AtomexProtocolV1Options.ETH,
  swapContractAddress: "0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b",
  swapContractBlockId: "6954501"
};
var testnetEthereumWeb3AtomexProtocolV1Options = {
  ETH: testnetNativeEthereumWeb3AtomexProtocolV1Options
};

// src/ethereum/config/defaultOptions.ts
var createAtomexProtocol = (atomexContext, currency, atomexProtocolOptions) => {
  switch (currency.type) {
    case "native":
      return new EthereumWeb3AtomexProtocolV1(atomexContext.atomexNetwork, atomexProtocolOptions, atomexContext.providers.blockchainProvider, atomexContext.managers.walletsManager);
    case "erc-20":
      return new ERC20EthereumWeb3AtomexProtocolV1(atomexContext.atomexNetwork, atomexProtocolOptions, atomexContext.providers.blockchainProvider, atomexContext.managers.walletsManager);
    default:
      throw new Error(`Unknown Ethereum currency: ${currency.id}`);
  }
};
var createCurrencyOptions = (atomexContext, currencies, atomexProtocolOptions) => {
  const result = {};
  const currenciesMap = currencies.reduce((obj, currency) => {
    obj[currency.id] = currency;
    return obj;
  }, {});
  for (const options of Object.values(atomexProtocolOptions)) {
    const currency = currenciesMap[options.currencyId];
    if (!currency)
      throw new Error(`The ${options.currencyId} currency not found`);
    result[currency.id] = {
      atomexProtocol: createAtomexProtocol(atomexContext, currency, options)
    };
  }
  return result;
};
var createDefaultEthereumBlockchainOptions = (atomexContext) => {
  const blockchain = "ethereum";
  const mainnetRpcUrl = "https://mainnet.infura.io/v3/df01d4ef450640a2a48d9af4c2078eaf/";
  const testNetRpcUrl = "https://goerli.infura.io/v3/df01d4ef450640a2a48d9af4c2078eaf/";
  const balancesProvider = new EthereumBalancesProvider();
  const swapTransactionsProvider = new EthereumSwapTransactionsProvider();
  const ethereumOptions = {
    mainnet: {
      rpcUrl: mainnetRpcUrl,
      currencies: ethereumMainnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, ethereumMainnetCurrencies, mainnetEthereumWeb3AtomexProtocolV1Options),
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider
    },
    testnet: {
      rpcUrl: testNetRpcUrl,
      currencies: ethereumTestnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, ethereumTestnetCurrencies, testnetEthereumWeb3AtomexProtocolV1Options),
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider
    }
  };
  return ethereumOptions;
};

// src/exchange/helpers/symbolsHelper.ts
var symbolsHelper_exports = {};
__export(symbolsHelper_exports, {
  convertSymbolToFromToCurrenciesPair: () => convertSymbolToFromToCurrenciesPair,
  findExchangeSymbolAndSide: () => findExchangeSymbolAndSide,
  getQuoteBaseCurrenciesBySymbol: () => getQuoteBaseCurrenciesBySymbol
});
var import_bignumber2 = __toESM(require("bignumber.js"));
var getQuoteBaseCurrenciesBySymbol = (symbol) => {
  const [quoteCurrency = "", baseCurrency = ""] = symbol.split("/");
  return [quoteCurrency, baseCurrency];
};
var convertSymbolToFromToCurrenciesPair = (symbol, side, currencyAmount, quoteCurrencyPrice, isQuoteCurrencyAmount = true) => {
  const preparedQuoteCurrencyPrice = converters_exports.toFixedBigNumber(quoteCurrencyPrice, symbol.decimals.price, import_bignumber2.default.ROUND_FLOOR);
  const [quoteCurrencyId, baseCurrencyId] = getQuoteBaseCurrenciesBySymbol(symbol.name);
  const isBuySide = side === "Buy";
  let preparedQuoteCurrencyAmount;
  let preparedBaseCurrencyAmount;
  if (isQuoteCurrencyAmount) {
    preparedQuoteCurrencyAmount = converters_exports.toFixedBigNumber(currencyAmount, symbol.decimals.quoteCurrency, import_bignumber2.default.ROUND_FLOOR);
    preparedBaseCurrencyAmount = converters_exports.toFixedBigNumber(preparedQuoteCurrencyPrice.multipliedBy(preparedQuoteCurrencyAmount), symbol.decimals.baseCurrency, isBuySide ? import_bignumber2.default.ROUND_CEIL : import_bignumber2.default.ROUND_FLOOR);
  } else {
    preparedBaseCurrencyAmount = converters_exports.toFixedBigNumber(currencyAmount, symbol.decimals.baseCurrency, import_bignumber2.default.ROUND_FLOOR);
    preparedQuoteCurrencyAmount = converters_exports.toFixedBigNumber(preparedBaseCurrencyAmount.div(preparedQuoteCurrencyPrice), symbol.decimals.quoteCurrency, isBuySide ? import_bignumber2.default.ROUND_FLOOR : import_bignumber2.default.ROUND_CEIL);
  }
  const preparedBaseCurrencyPrice = converters_exports.toFixedBigNumber(new import_bignumber2.default(1).div(preparedQuoteCurrencyPrice), symbol.decimals.price, import_bignumber2.default.ROUND_FLOOR);
  const quoteCurrency = {
    currencyId: quoteCurrencyId,
    amount: preparedQuoteCurrencyAmount,
    price: preparedQuoteCurrencyPrice
  };
  const baseCurrency = {
    currencyId: baseCurrencyId,
    amount: preparedBaseCurrencyAmount,
    price: preparedBaseCurrencyPrice
  };
  return isBuySide ? [baseCurrency, quoteCurrency] : [quoteCurrency, baseCurrency];
};
var findExchangeSymbolAndSide = (symbols, from, to) => {
  const sellSideSymbolName = `${from}/${to}`;
  const buySideSymbolName = `${to}/${from}`;
  let symbol;
  let side = "Sell";
  if (guards_exports.isReadonlyArray(symbols)) {
    for (const s of symbols) {
      if (s.name === sellSideSymbolName) {
        symbol = s;
        break;
      }
      if (s.name === buySideSymbolName) {
        symbol = s;
        side = "Buy";
        break;
      }
    }
  } else {
    symbol = symbols.get(sellSideSymbolName);
    if (!symbol) {
      side = "Buy";
      symbol = symbols.get(buySideSymbolName);
    }
  }
  if (!symbol)
    throw new Error(`Invalid pair: ${from}/${to}`);
  return [symbol, side];
};

// src/exchange/exchangeManager.ts
var import_nanoid = require("nanoid");

// src/common/models/dataSource.ts
var DataSource = /* @__PURE__ */ ((DataSource2) => {
  DataSource2[DataSource2["Local"] = 1] = "Local";
  DataSource2[DataSource2["Remote"] = 2] = "Remote";
  DataSource2[DataSource2["All"] = 3] = "All";
  return DataSource2;
})(DataSource || {});

// src/common/models/importantDataReceivingMode.ts
var ImportantDataReceivingMode = /* @__PURE__ */ ((ImportantDataReceivingMode2) => {
  ImportantDataReceivingMode2[ImportantDataReceivingMode2["Local"] = 0] = "Local";
  ImportantDataReceivingMode2[ImportantDataReceivingMode2["Remote"] = 1] = "Remote";
  ImportantDataReceivingMode2[ImportantDataReceivingMode2["SafeMerged"] = 2] = "SafeMerged";
  return ImportantDataReceivingMode2;
})(ImportantDataReceivingMode || {});

// src/core/eventEmitter.ts
var EventEmitter = class {
  listeners = /* @__PURE__ */ new Set();
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

// src/core/deferredEventEmitter.ts
var DeferredEventEmitter = class {
  constructor(latencyMs = 1e3) {
    this.latencyMs = latencyMs;
  }
  watcherIdsMap = /* @__PURE__ */ new Map();
  internalEmitter = new EventEmitter();
  addListener(listener) {
    this.internalEmitter.addListener(listener);
    return this;
  }
  removeListener(listener) {
    this.internalEmitter.removeListener(listener);
    return this;
  }
  removeAllListeners() {
    this.internalEmitter.removeAllListeners();
    return this;
  }
  emit(key, ...args) {
    const oldWatcherId = this.watcherIdsMap.get(key);
    if (oldWatcherId)
      clearTimeout(oldWatcherId);
    const watcherId = setTimeout(() => {
      this.watcherIdsMap.delete(key);
      this.internalEmitter.emit(...args);
    }, this.latencyMs);
    this.watcherIdsMap.set(key, watcherId);
  }
};

// src/exchange/exchangeManager.ts
var ExchangeManager = class {
  events = {
    orderUpdated: new EventEmitter(),
    orderBookSnapshot: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };
  exchangeService;
  symbolsProvider;
  orderBookProvider;
  _isStarted = false;
  constructor(options) {
    this.exchangeService = options.exchangeService;
    this.symbolsProvider = options.symbolsProvider;
    this.orderBookProvider = options.orderBookProvider;
  }
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this.attachEvents();
    await this.exchangeService.start();
    await this.getSymbols();
    this._isStarted = true;
  }
  stop() {
    if (!this._isStarted)
      return;
    this.detachEvents();
    this.exchangeService.stop();
    this._isStarted = false;
  }
  getOrder(accountAddress, orderId, _mode = 2 /* SafeMerged */) {
    return this.exchangeService.getOrder(accountAddress, orderId);
  }
  getOrders(accountAddress, selector, _mode = 2 /* SafeMerged */) {
    return this.exchangeService.getOrders(accountAddress, selector);
  }
  async getSymbol(name, dataSource = 3 /* All */) {
    if ((dataSource & 1 /* Local */) === 1 /* Local */) {
      const symbol = this.symbolsProvider.getSymbol(name);
      if (symbol)
        return symbol;
    }
    if ((dataSource & 2 /* Remote */) === 2 /* Remote */) {
      const symbols = await this.exchangeService.getSymbols();
      this.symbolsProvider.setSymbols(symbols);
      return this.symbolsProvider.getSymbol(name);
    }
    return void 0;
  }
  async getSymbols(dataSource = 3 /* All */) {
    if ((dataSource & 1 /* Local */) === 1 /* Local */) {
      const symbols = this.symbolsProvider.getSymbols();
      if (symbols.length > 0)
        return symbols;
    }
    if ((dataSource & 2 /* Remote */) === 2 /* Remote */) {
      const symbols = await this.exchangeService.getSymbols();
      this.symbolsProvider.setSymbols(symbols);
      return symbols;
    }
    return [];
  }
  getTopOfBook(symbolsOrDirections) {
    return this.exchangeService.getTopOfBook(symbolsOrDirections);
  }
  async getOrderBook(symbolOrDirection) {
    let symbol;
    if (typeof symbolOrDirection === "string")
      symbol = symbolOrDirection;
    else {
      const exchangeSymbols = this.symbolsProvider.getSymbolsMap();
      symbol = symbolsHelper_exports.findExchangeSymbolAndSide(exchangeSymbols, symbolOrDirection.from, symbolOrDirection.to)[0].name;
    }
    if (!symbol)
      throw new Error("Invalid Symbol");
    const orderBook = await this.exchangeService.getOrderBook(symbol);
    if (orderBook)
      this.orderBookProvider.setOrderBook(symbol, orderBook);
    return orderBook;
  }
  addOrder(accountAddress, newOrderRequest) {
    const clientOrderId = newOrderRequest.clientOrderId || (0, import_nanoid.nanoid)(17);
    return this.exchangeService.addOrder(accountAddress, { ...newOrderRequest, clientOrderId });
  }
  cancelOrder(accountAddress, cancelOrderRequest) {
    return this.exchangeService.cancelOrder(accountAddress, cancelOrderRequest);
  }
  cancelAllOrders(accountAddress, cancelAllOrdersRequest) {
    return this.exchangeService.cancelAllOrders(accountAddress, cancelAllOrdersRequest);
  }
  async getOrderPreview(orderPreviewParameters) {
    if (orderPreviewParameters.type !== "SolidFillOrKill")
      throw new Error('Only the "SolidFillOrKill" order type is supported at the current moment');
    const preparedOrderPreviewParameters = this.getPreparedOrderPreviewParameters(orderPreviewParameters);
    const orderBookEntry = await this.findOrderBookEntry(preparedOrderPreviewParameters.exchangeSymbol.name, preparedOrderPreviewParameters.side, orderPreviewParameters.type, preparedOrderPreviewParameters.amount, preparedOrderPreviewParameters.isQuoteCurrencyAmount);
    if (!orderBookEntry)
      return void 0;
    const [from, to] = symbolsHelper_exports.convertSymbolToFromToCurrenciesPair(preparedOrderPreviewParameters.exchangeSymbol, preparedOrderPreviewParameters.side, preparedOrderPreviewParameters.amount, orderBookEntry.price, preparedOrderPreviewParameters.isQuoteCurrencyAmount);
    return {
      type: orderPreviewParameters.type,
      from,
      to,
      side: preparedOrderPreviewParameters.side,
      symbol: preparedOrderPreviewParameters.exchangeSymbol.name
    };
  }
  getMaximumLiquidity(_direction) {
    throw new Error("Not implemented");
  }
  attachEvents() {
    this.exchangeService.events.orderUpdated.addListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.events.orderBookSnapshot.addListener(this.handleExchangeServiceOrderBookSnapshot);
    this.exchangeService.events.orderBookUpdated.addListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.events.topOfBookUpdated.addListener(this.handleExchangeServiceTopOfBookUpdated);
  }
  detachEvents() {
    this.exchangeService.events.orderUpdated.removeListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.events.orderBookSnapshot.removeListener(this.handleExchangeServiceOrderBookSnapshot);
    this.exchangeService.events.orderBookUpdated.removeListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.events.topOfBookUpdated.removeListener(this.handleExchangeServiceTopOfBookUpdated);
  }
  handleExchangeServiceOrderUpdated = (updatedOrder) => {
    this.events.orderUpdated.emit(updatedOrder);
  };
  handleExchangeServiceOrderBookSnapshot = async (orderBook) => {
    this.events.orderBookSnapshot.emit(orderBook);
  };
  handleExchangeServiceOrderBookUpdated = async (updatedOrderBook) => {
    this.events.orderBookUpdated.emit(updatedOrderBook);
  };
  handleExchangeServiceTopOfBookUpdated = (updatedQuotes) => {
    this.events.topOfBookUpdated.emit(updatedQuotes);
  };
  getPreparedOrderPreviewParameters(orderPreviewParameters) {
    const exchangeSymbols = this.symbolsProvider.getSymbolsMap();
    let symbol;
    let exchangeSymbol;
    let side;
    let isQuoteCurrencyAmount = true;
    if (orderPreviewParameters.symbol && orderPreviewParameters.side) {
      symbol = orderPreviewParameters.symbol;
      exchangeSymbol = exchangeSymbols.get(symbol);
      side = orderPreviewParameters.side;
      if (orderPreviewParameters.isQuoteCurrencyAmount !== void 0 && orderPreviewParameters.isQuoteCurrencyAmount !== null)
        isQuoteCurrencyAmount = orderPreviewParameters.isQuoteCurrencyAmount;
    } else if (orderPreviewParameters.from && orderPreviewParameters.to) {
      [exchangeSymbol, side] = symbolsHelper_exports.findExchangeSymbolAndSide(exchangeSymbols, orderPreviewParameters.from, orderPreviewParameters.to);
      symbol = exchangeSymbol.name;
      const isFromAmount = orderPreviewParameters.isFromAmount !== void 0 && orderPreviewParameters.isFromAmount !== null ? orderPreviewParameters.isFromAmount : true;
      if (exchangeSymbol)
        isQuoteCurrencyAmount = orderPreviewParameters.from === exchangeSymbol.quoteCurrency && isFromAmount || orderPreviewParameters.to === exchangeSymbol.quoteCurrency && !isFromAmount;
    } else
      throw new Error("Invalid orderPreviewParameters argument passed");
    if (!exchangeSymbol)
      throw new Error(`The ${symbol} Symbol not found`);
    return {
      type: orderPreviewParameters.type,
      amount: orderPreviewParameters.amount,
      exchangeSymbol,
      side,
      isQuoteCurrencyAmount
    };
  }
  async findOrderBookEntry(symbol, side, orderType, amount, isQuoteCurrencyAmount) {
    if (orderType !== "SolidFillOrKill")
      return void 0;
    const orderBook = await this.getCachedOrderBook(symbol);
    if (!orderBook)
      return void 0;
    for (const entry of orderBook.entries) {
      if (entry.side !== side && (isQuoteCurrencyAmount ? amount : amount.div(entry.price)).isLessThanOrEqualTo(Math.max(...entry.qtyProfile))) {
        return entry;
      }
    }
  }
  getCachedOrderBook(symbol) {
    const cachedOrderBook = this.orderBookProvider.getOrderBook(symbol);
    return cachedOrderBook ? Promise.resolve(cachedOrderBook) : this.getOrderBook(symbol);
  }
};

// src/exchange/exchangeSymbolsProvider/inMemoryExchangeSymbolsProvider.ts
var InMemoryExchangeSymbolsProvider = class {
  symbolsMap = /* @__PURE__ */ new Map();
  symbolsCollectionCache = [];
  getSymbol(name) {
    return this.symbolsMap.get(name);
  }
  getSymbols() {
    return this.symbolsCollectionCache;
  }
  getSymbolsMap() {
    return this.symbolsMap;
  }
  setSymbols(exchangeSymbols) {
    this.symbolsCollectionCache = exchangeSymbols;
    this.symbolsMap = this.mapSymbolsCollectionToMap(exchangeSymbols);
  }
  mapSymbolsCollectionToMap(symbolsCollection) {
    const symbolsMap = /* @__PURE__ */ new Map();
    for (const symbol of symbolsCollection)
      symbolsMap.set(symbol.name, symbol);
    return symbolsMap;
  }
};

// src/exchange/orderBookProvider/inMemoryOrderBookProvider.ts
var InMemoryOrderBookProvider = class {
  orderBookMap = /* @__PURE__ */ new Map();
  getOrderBook(symbol) {
    return this.orderBookMap.get(symbol);
  }
  setOrderBook(symbol, orderBook) {
    this.orderBookMap.set(symbol, orderBook);
  }
};

// src/swaps/swapManager.ts
var SwapManager = class {
  constructor(swapService) {
    this.swapService = swapService;
  }
  events = {
    swapUpdated: new EventEmitter()
  };
  _isStarted = false;
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this.attachEvents();
    await this.swapService.start();
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this.detachEvents();
    this.swapService.stop();
    this._isStarted = false;
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
  handleSwapServiceSwapUpdated = (updatedSwap) => {
    this.events.swapUpdated.emit(updatedSwap);
  };
};

// src/tezos/wallets/beaconWalletTezosWallet.ts
var import_beacon_sdk = require("@airgap/beacon-sdk");
var import_taquito = require("@taquito/taquito");

// src/tezos/utils/index.ts
var import_utils8 = require("@taquito/utils");

// src/tezos/utils/signing.ts
var signing_exports = {};
__export(signing_exports, {
  decodeSignature: () => decodeSignature,
  getRawMichelineSigningData: () => getRawMichelineSigningData,
  getRawSigningData: () => getRawSigningData,
  getTezosSigningAlgorithm: () => getTezosSigningAlgorithm,
  getWalletMichelineSigningData: () => getWalletMichelineSigningData
});
var import_utils6 = require("@taquito/utils");
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
    case import_utils6.Prefix.TZ1:
    case import_utils6.Prefix.EDPK:
      return "Ed25519:Blake2b";
    case import_utils6.Prefix.TZ2:
    case import_utils6.Prefix.SPPK:
      return "Blake2bWithEcdsa:Secp256k1";
    case import_utils6.Prefix.TZ3:
    case import_utils6.Prefix.P2PK:
      return "Blake2bWithEcdsa:Secp256r1";
    default:
      throw new Error(`Unexpected address/public key prefix: ${prefix4} (${addressOrPublicKey})`);
  }
};
var decodeSignature = (signature) => {
  const signaturePrefix = signature.startsWith("sig") ? signature.substring(0, 3) : signature.substring(0, 5);
  const decodedKeyBytes = (0, import_utils6.b58cdecode)(signature, import_utils6.prefix[signaturePrefix]);
  return Buffer.from(decodedKeyBytes).toString("hex");
};

// src/tezos/utils/index.ts
var decodePublicKey = (publicKey) => {
  const keyPrefix = (0, import_utils8.validatePkAndExtractPrefix)(publicKey);
  const decodedKeyBytes = (0, import_utils8.b58cdecode)(publicKey, import_utils8.prefix[keyPrefix]);
  return import_node_buffer.Buffer.from(decodedKeyBytes).toString("hex");
};

// src/tezos/wallets/beaconWalletTezosWallet.ts
var BeaconWalletTezosWallet = class {
  constructor(atomexNetwork, beaconWallet, rpcUrl) {
    this.atomexNetwork = atomexNetwork;
    this.beaconWallet = beaconWallet;
    this.toolkit = new import_taquito.TezosToolkit(rpcUrl);
    this.toolkit.setWalletProvider(beaconWallet);
  }
  id = "taquito";
  toolkit;
  getBlockchain() {
    return "tezos";
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
        signingType: import_beacon_sdk.SigningType.MICHELINE
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

// src/tezos/wallets/inMemoryTezosWallet.ts
var import_signer = require("@taquito/signer");
var import_taquito2 = require("@taquito/taquito");
var InMemoryTezosWallet = class {
  constructor(atomexNetwork, secretKey, rpcUrl) {
    this.atomexNetwork = atomexNetwork;
    this.internalInMemorySigner = new import_signer.InMemorySigner(secretKey);
    this.toolkit = new import_taquito2.TezosToolkit(rpcUrl);
    this.toolkit.setSignerProvider(this.internalInMemorySigner);
  }
  id = "taquito";
  toolkit;
  internalInMemorySigner;
  getBlockchain() {
    return "tezos";
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

// src/tezos/wallets/templeWalletTezosWallet.ts
var import_taquito3 = require("@taquito/taquito");
var TempleWalletTezosWallet = class {
  constructor(atomexNetwork, templeWallet, rpcUrl) {
    this.atomexNetwork = atomexNetwork;
    this.templeWallet = templeWallet;
    this.toolkit = new import_taquito3.TezosToolkit(rpcUrl);
    this.toolkit.setWalletProvider(templeWallet);
  }
  id = "taquito";
  blockchain = "tezos";
  toolkit;
  getBlockchain() {
    return "tezos";
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

// src/tezos/wallets/taquitoBlockchainWallet.ts
var TaquitoBlockchainWallet = class {
  constructor(atomexNetwork, walletOrSecretKey, rpcUrl) {
    this.atomexNetwork = atomexNetwork;
    this.walletOrSecretKey = walletOrSecretKey;
    this.rpcUrl = rpcUrl;
    this.internalWallet = this.createInternalWallet(walletOrSecretKey);
  }
  internalWallet;
  get id() {
    return this.internalWallet.id;
  }
  get toolkit() {
    return this.internalWallet.toolkit;
  }
  getAddress() {
    return this.internalWallet.getAddress();
  }
  getPublicKey() {
    return this.internalWallet.getPublicKey();
  }
  getBlockchain() {
    return this.internalWallet.getBlockchain();
  }
  sign(message) {
    return this.internalWallet.sign(message);
  }
  createInternalWallet(walletOrSecretKey) {
    var _a;
    if (typeof walletOrSecretKey === "string")
      return new InMemoryTezosWallet(this.atomexNetwork, walletOrSecretKey, this.rpcUrl);
    else if (((_a = walletOrSecretKey.client) == null ? void 0 : _a.name) !== void 0)
      return new BeaconWalletTezosWallet(this.atomexNetwork, walletOrSecretKey, this.rpcUrl);
    else if (walletOrSecretKey.permission !== void 0 && walletOrSecretKey.connected !== void 0)
      return new TempleWalletTezosWallet(this.atomexNetwork, walletOrSecretKey, this.rpcUrl);
    else
      throw new Error("Unknown Tezos wallet");
  }
  static async bind(atomex, walletOrSecretKey) {
    var _a;
    const blockchain = "tezos";
    const rpcUrl = (_a = atomex.atomexContext.providers.blockchainProvider.getNetworkOptions(blockchain)) == null ? void 0 : _a.rpcUrl;
    if (!rpcUrl)
      throw new Error(`There is not rpc url for ${blockchain} network`);
    const wallet = new TaquitoBlockchainWallet(atomex.atomexNetwork, walletOrSecretKey, rpcUrl);
    await atomex.wallets.addWallet(wallet);
    return wallet;
  }
};

// src/tezos/atomexProtocol/taquitoAtomexProtocolV1.ts
var TaquitoAtomexProtocolV1 = class {
  constructor(blockchain, atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager) {
    this.blockchain = blockchain;
    this.atomexNetwork = atomexNetwork;
    this.atomexProtocolOptions = atomexProtocolOptions;
    this.atomexBlockchainProvider = atomexBlockchainProvider;
    this.walletsManager = walletsManager;
  }
  version = 1;
  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }
  async getReadonlyTezosToolkit() {
    const toolkit = await this.atomexBlockchainProvider.getReadonlyToolkit("taquito", this.blockchain);
    if (!toolkit)
      throw new Error("Tezos toolkit not found");
    return toolkit;
  }
  async getWallet(address) {
    const taquitoWallet = await this.walletsManager.getWallet(address, this.blockchain, "taquito");
    if (!taquitoWallet)
      throw new Error(`${this.blockchain} Taqutio wallet not found`);
    return taquitoWallet;
  }
};

// src/tezos/atomexProtocol/tezosTaquitoAtomexProtocolV1.ts
var TezosTaquitoAtomexProtocolV1 = class extends TaquitoAtomexProtocolV1 {
  constructor(atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager) {
    super("tezos", atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager);
    this.atomexProtocolOptions = atomexProtocolOptions;
  }
  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }
  initiate(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedInitiateFees(_params) {
    throw new Error("Method not implemented.");
  }
  redeem(_params) {
    throw new Error("Method not implemented.");
  }
  getRedeemReward(_nativeTokenPriceInUsd, _nativeTokenPriceInCurrency) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRedeemFees(_params) {
    throw new Error("Method not implemented.");
  }
  refund(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRefundFees(_params) {
    throw new Error("Method not implemented.");
  }
};

// src/tezos/atomexProtocol/fa12TezosTaquitoAtomexProtocolV1.ts
var FA12TezosTaquitoAtomexProtocolV1 = class extends TaquitoAtomexProtocolV1 {
  constructor(atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager) {
    super("tezos", atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager);
    this.atomexProtocolOptions = atomexProtocolOptions;
  }
  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }
  initiate(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedInitiateFees(_params) {
    throw new Error("Method not implemented.");
  }
  redeem(_params) {
    throw new Error("Method not implemented.");
  }
  getRedeemReward(_nativeTokenPriceInUsd, _nativeTokenPriceInCurrency) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRedeemFees(_params) {
    throw new Error("Method not implemented.");
  }
  refund(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRefundFees(_params) {
    throw new Error("Method not implemented.");
  }
};

// src/tezos/atomexProtocol/fa2TezosTaquitoAtomexProtocolV1.ts
var FA2TezosTaquitoAtomexProtocolV1 = class extends TaquitoAtomexProtocolV1 {
  constructor(atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager) {
    super("tezos", atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager);
    this.atomexProtocolOptions = atomexProtocolOptions;
  }
  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }
  initiate(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedInitiateFees(_params) {
    throw new Error("Method not implemented.");
  }
  redeem(_params) {
    throw new Error("Method not implemented.");
  }
  getRedeemReward(_nativeTokenPriceInUsd, _nativeTokenPriceInCurrency) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRedeemFees(_params) {
    throw new Error("Method not implemented.");
  }
  refund(_params) {
    throw new Error("Method not implemented.");
  }
  getEstimatedRefundFees(_params) {
    throw new Error("Method not implemented.");
  }
};

// src/tezos/balancesProviders/tezosBalancesProvider.ts
var TezosBalancesProvider = class {
  getBalance(_address, _currency) {
    throw new Error("Method not implemented.");
  }
};

// src/tezos/swapTransactionsProviders/tezosSwapTransactionsProvider.ts
var TezosSwapTransactionsProvider = class {
  _isStarted = false;
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this._isStarted = false;
  }
  getSwapTransactions(_swap) {
    throw new Error("Method not implemented.");
  }
};

// src/tezos/blockchainToolkitProviders/taquitoBlockchainToolkitProvider.ts
var import_taquito4 = require("@taquito/taquito");
var _TaquitoBlockchainToolkitProvider = class {
  constructor(rpcUrl) {
    this.rpcUrl = rpcUrl;
  }
  toolkitId = "taquito";
  toolkit;
  getReadonlyToolkit(blockchain) {
    if (blockchain && blockchain !== _TaquitoBlockchainToolkitProvider.BLOCKCHAIN)
      return Promise.resolve(void 0);
    if (!this.toolkit)
      this.toolkit = new import_taquito4.TezosToolkit(this.rpcUrl);
    return Promise.resolve(this.toolkit);
  }
};
var TaquitoBlockchainToolkitProvider = _TaquitoBlockchainToolkitProvider;
__publicField(TaquitoBlockchainToolkitProvider, "BLOCKCHAIN", "tezos");

// src/tezos/config/currencies.ts
var nativeTezosCurrency = {
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
  type: "fa1.2",
  contractAddress: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
  decimals: 8
};
var kusdCurrency = {
  id: "KUSD",
  name: "Kolibri USD",
  symbol: "kUSD",
  blockchain: "tezos",
  type: "fa1.2",
  contractAddress: "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
  decimals: 18
};
var usdtCurrency = {
  id: "USDT_XTZ",
  name: "Tether USD",
  symbol: "USDt",
  blockchain: "tezos",
  type: "fa2",
  tokenId: 0,
  contractAddress: "KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o",
  decimals: 6
};
var tezosMainnetCurrencies = [
  nativeTezosCurrency,
  tzBtcCurrency,
  kusdCurrency,
  usdtCurrency
];
var tezosTestnetCurrencies = [
  nativeTezosCurrency,
  { ...tzBtcCurrency, contractAddress: "KT1DM4k79uSx5diQnwqDiF4XeA86aCBxBD35" },
  { ...usdtCurrency, contractAddress: "KT1BWvRQnVVowZZLGkct9A7sdj5YEe8CdUhR" }
];

// src/tezos/config/atomexProtocol/base.ts
var mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase = {
  atomexProtocolVersion: 1,
  initiateOperation: {
    fee: 11e3,
    gasLimit: 11e4,
    storageLimit: 350
  },
  redeemOperation: {
    fee: 11e3,
    gasLimit: 15e3,
    storageLimit: 257
  },
  refundOperation: {
    fee: 11e3,
    gasLimit: 11e4,
    storageLimit: 257
  }
};
var mainnetFA2TezosTaquitoAtomexProtocolV1OptionsBase = {
  atomexProtocolVersion: 1,
  initiateOperation: {
    fee: 35e4,
    gasLimit: 4e5,
    storageLimit: 250
  },
  redeemOperation: {
    fee: 12e4,
    gasLimit: 4e5,
    storageLimit: 257
  },
  refundOperation: {
    fee: 12e4,
    gasLimit: 4e5,
    storageLimit: 257
  }
};
var testnetFA2TezosTaquitoAtomexProtocolV1OptionsBase = {
  atomexProtocolVersion: 1,
  initiateOperation: {
    fee: 35e4,
    gasLimit: 4e5,
    storageLimit: 250
  },
  redeemOperation: {
    fee: 12e4,
    gasLimit: 4e5,
    storageLimit: 257
  },
  refundOperation: {
    fee: 12e4,
    gasLimit: 4e5,
    storageLimit: 257
  }
};

// src/tezos/config/atomexProtocol/mainnetV1Options.ts
var mainnetNativeTezosTaquitoAtomexProtocolV1Options = {
  atomexProtocolVersion: 1,
  currencyId: "XTZ",
  swapContractAddress: "KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL",
  swapContractBlockId: "513046",
  initiateOperation: {
    fee: 2e3,
    gasLimit: 11e3,
    storageLimit: 257
  },
  redeemOperation: {
    fee: 2e3,
    gasLimit: 15e3,
    storageLimit: 257
  },
  refundOperation: {
    fee: 1600,
    gasLimit: 13e3,
    storageLimit: 257
  }
};
var mainnetTZBTCTezosTaquitoAtomexProtocolV1Options = {
  ...mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase,
  currencyId: "TZBTC",
  swapContractAddress: "KT1Ap287P1NzsnToSJdA4aqSNjPomRaHBZSr",
  swapContractBlockId: "900350",
  redeemOperation: {
    ...mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase.redeemOperation,
    gasLimit: 18e4
  }
};
var mainnetKUSDTezosTaquitoAtomexProtocolV1Options = {
  ...mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase,
  currencyId: "KUSD",
  swapContractAddress: "KT1EpQVwqLGSH7vMCWKJnq6Uxi851sEDbhWL",
  swapContractBlockId: "1358868",
  redeemOperation: {
    ...mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase.redeemOperation,
    gasLimit: 11e4
  }
};
var mainnetUSDtTezosTaquitoAtomexProtocolV1Options = {
  ...mainnetFA2TezosTaquitoAtomexProtocolV1OptionsBase,
  currencyId: "USDT_XTZ",
  swapContractAddress: "KT1Ays1Chwx3ArnHGoQXchUgDsvKe9JboUjj",
  swapContractBlockId: "2496680"
};
var mainnetTezosTaquitoAtomexProtocolV1Options = {
  XTZ: mainnetNativeTezosTaquitoAtomexProtocolV1Options,
  TZBTC: mainnetTZBTCTezosTaquitoAtomexProtocolV1Options,
  KUSD: mainnetKUSDTezosTaquitoAtomexProtocolV1Options,
  USDT_XTZ: mainnetUSDtTezosTaquitoAtomexProtocolV1Options
};

// src/tezos/config/atomexProtocol/testnetV1Options.ts
var testnetNativeTezosTaquitoAtomexProtocolV1Options = {
  atomexProtocolVersion: 1,
  currencyId: "XTZ",
  swapContractAddress: "KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL",
  swapContractBlockId: "513046",
  initiateOperation: {
    fee: 2e3,
    gasLimit: 11e3,
    storageLimit: 257
  },
  redeemOperation: {
    fee: 2e3,
    gasLimit: 15e3,
    storageLimit: 257
  },
  refundOperation: {
    fee: 1600,
    gasLimit: 13e3,
    storageLimit: 257
  }
};
var testnetUSDtTezosTaquitoAtomexProtocolV1Options = {
  ...testnetFA2TezosTaquitoAtomexProtocolV1OptionsBase,
  currencyId: "USDT_XTZ",
  swapContractAddress: "KT1BWvRQnVVowZZLGkct9A7sdj5YEe8CdUhR",
  swapContractBlockId: "665321"
};
var testnetTezosTaquitoAtomexProtocolV1Options = {
  XTZ: testnetNativeTezosTaquitoAtomexProtocolV1Options,
  USDT_XTZ: testnetUSDtTezosTaquitoAtomexProtocolV1Options
};

// src/tezos/config/defaultOptions.ts
var createAtomexProtocol2 = (atomexContext, currency, atomexProtocolOptions) => {
  switch (currency.type) {
    case "native":
      return new TezosTaquitoAtomexProtocolV1(atomexContext.atomexNetwork, atomexProtocolOptions, atomexContext.providers.blockchainProvider, atomexContext.managers.walletsManager);
    case "fa1.2":
      return new FA12TezosTaquitoAtomexProtocolV1(atomexContext.atomexNetwork, atomexProtocolOptions, atomexContext.providers.blockchainProvider, atomexContext.managers.walletsManager);
    case "fa2":
      return new FA2TezosTaquitoAtomexProtocolV1(atomexContext.atomexNetwork, atomexProtocolOptions, atomexContext.providers.blockchainProvider, atomexContext.managers.walletsManager);
    default:
      throw new Error(`Unknown Tezos currency: ${currency.id}`);
  }
};
var createCurrencyOptions2 = (atomexContext, currencies, atomexProtocolOptions) => {
  const result = {};
  const currenciesMap = currencies.reduce((obj, currency) => {
    obj[currency.id] = currency;
    return obj;
  }, {});
  for (const options of Object.values(atomexProtocolOptions)) {
    const currency = currenciesMap[options.currencyId];
    if (!currency)
      throw new Error(`The ${options.currencyId} currency not found`);
    result[currency.id] = {
      atomexProtocol: createAtomexProtocol2(atomexContext, currency, options)
    };
  }
  return result;
};
var createDefaultTezosBlockchainOptions = (atomexContext) => {
  const mainnetRpcUrl = "https://rpc.tzkt.io/mainnet/";
  const testNetRpcUrl = "https://rpc.tzkt.io/ithacanet/";
  const balancesProvider = new TezosBalancesProvider();
  const swapTransactionsProvider = new TezosSwapTransactionsProvider();
  const tezosOptions = {
    mainnet: {
      rpcUrl: mainnetRpcUrl,
      currencies: tezosMainnetCurrencies,
      currencyOptions: createCurrencyOptions2(atomexContext, tezosMainnetCurrencies, mainnetTezosTaquitoAtomexProtocolV1Options),
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider
    },
    testnet: {
      rpcUrl: testNetRpcUrl,
      currencies: tezosTestnetCurrencies,
      currencyOptions: createCurrencyOptions2(atomexContext, tezosTestnetCurrencies, testnetTezosTaquitoAtomexProtocolV1Options),
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider
    }
  };
  return tezosOptions;
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
var import_bignumber3 = __toESM(require("bignumber.js"));
var isOrderPreview = (orderBody) => {
  return typeof orderBody.symbol === "string" && typeof orderBody.side === "string" && !!orderBody.from && !!orderBody.to;
};
var mapQuoteDtosToQuotes = (quoteDtos) => {
  const quotes = quoteDtos.map((quoteDto) => mapQuoteDtoToQuote(quoteDto));
  return quotes;
};
var mapQuoteDtoToQuote = (quoteDto) => {
  const [quoteCurrency, baseCurrency] = symbolsHelper_exports.getQuoteBaseCurrenciesBySymbol(quoteDto.symbol);
  const quote = {
    ask: new import_bignumber3.default(quoteDto.ask),
    bid: new import_bignumber3.default(quoteDto.bid),
    symbol: quoteDto.symbol,
    timeStamp: new Date(quoteDto.timeStamp),
    quoteCurrency,
    baseCurrency
  };
  return quote;
};
var mapSymbolDtoToSymbol = (symbolDto, currenciesProvider, defaultDecimals = 9) => {
  var _a, _b;
  const [quoteCurrency, baseCurrency] = symbolsHelper_exports.getQuoteBaseCurrenciesBySymbol(symbolDto.name);
  const baseCurrencyDecimals = (_a = currenciesProvider.getCurrency(baseCurrency)) == null ? void 0 : _a.decimals;
  const quoteCurrencyDecimals = (_b = currenciesProvider.getCurrency(quoteCurrency)) == null ? void 0 : _b.decimals;
  const preparedBaseCurrencyDecimals = baseCurrencyDecimals ? Math.min(baseCurrencyDecimals, defaultDecimals) : defaultDecimals;
  const preparedQuoteCurrencyDecimals = quoteCurrencyDecimals ? Math.min(quoteCurrencyDecimals, defaultDecimals) : defaultDecimals;
  return {
    name: symbolDto.name,
    baseCurrency,
    quoteCurrency,
    minimumQty: new import_bignumber3.default(symbolDto.minimumQty),
    decimals: {
      baseCurrency: preparedBaseCurrencyDecimals,
      quoteCurrency: preparedQuoteCurrencyDecimals,
      price: defaultDecimals
    }
  };
};
var mapSymbolDtosToSymbols = (symbolDtos, currenciesProvider, defaultDecimals) => {
  return symbolDtos.map((symbolDto) => mapSymbolDtoToSymbol(symbolDto, currenciesProvider, defaultDecimals));
};
var mapOrderBookDtoToOrderBook = (orderBookDto) => {
  const [quoteCurrency, baseCurrency] = symbolsHelper_exports.getQuoteBaseCurrenciesBySymbol(orderBookDto.symbol);
  const orderBook = {
    updateId: orderBookDto.updateId,
    symbol: orderBookDto.symbol,
    quoteCurrency,
    baseCurrency,
    entries: orderBookDto.entries.map((orderBookEntryDto) => mapOrderBookEntryDtoToOrderBookEntry(orderBookEntryDto))
  };
  return orderBook;
};
var mapOrderBookEntryDtoToOrderBookEntry = (entryDto) => {
  const entry = {
    side: entryDto.side,
    price: new import_bignumber3.default(entryDto.price),
    qtyProfile: entryDto.qtyProfile
  };
  return entry;
};
var mapWebSocketOrderBookEntryDtoToOrderBooks = (orderBookEntryDtos, orderBookProvider) => {
  const updatedOrderBooks = /* @__PURE__ */ new Map();
  for (const entryDto of orderBookEntryDtos) {
    const orderBook = updatedOrderBooks.get(entryDto.symbol) || orderBookProvider.getOrderBook(entryDto.symbol);
    if (!orderBook)
      continue;
    const entry = mapOrderBookEntryDtoToOrderBookEntry(entryDto);
    const storedEntry = orderBook.entries.find((e) => e.side === entry.side && e.price.isEqualTo(entry.price));
    const updatedEntries = entryDto.qtyProfile.length ? storedEntry ? orderBook.entries.map((e) => e === storedEntry ? { ...e, qtyProfile: entry.qtyProfile } : e) : [...orderBook.entries, entry] : orderBook.entries.filter((e) => e !== storedEntry);
    const updatedOrderBook = {
      ...orderBook,
      updateId: entryDto.updateId,
      entries: updatedEntries
    };
    updatedOrderBooks.set(updatedOrderBook.symbol, updatedOrderBook);
  }
  return Array.from(updatedOrderBooks.values());
};
var mapOrderDtoToOrder = (orderDto, exchangeSymbolsProvider) => {
  var _a;
  const exchangeSymbol = exchangeSymbolsProvider.getSymbol(orderDto.symbol);
  if (!exchangeSymbol)
    throw new Error(`"${orderDto.symbol}" symbol not found`);
  const [from, to] = symbolsHelper_exports.convertSymbolToFromToCurrenciesPair(exchangeSymbol, orderDto.side, orderDto.qty, orderDto.price);
  return {
    id: orderDto.id,
    from,
    to,
    clientOrderId: orderDto.clientOrderId,
    side: orderDto.side,
    symbol: orderDto.symbol,
    leaveQty: new import_bignumber3.default(orderDto.leaveQty),
    timeStamp: new Date(orderDto.timeStamp),
    type: orderDto.type,
    status: orderDto.status,
    swapIds: ((_a = orderDto.swaps) == null ? void 0 : _a.map((swap) => swap.id)) || []
  };
};
var mapOrderDtosToOrders = (orderDtos, exchangeSymbolsProvider) => {
  return orderDtos.map((orderDto) => mapOrderDtoToOrder(orderDto, exchangeSymbolsProvider));
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
var mapSwapDtoToSwap = (swapDto, exchangeSymbolsProvider) => {
  const exchangeSymbol = exchangeSymbolsProvider.getSymbol(swapDto.symbol);
  if (!exchangeSymbol)
    throw new Error(`"${swapDto.symbol}" symbol not found`);
  const [from, to] = symbolsHelper_exports.convertSymbolToFromToCurrenciesPair(exchangeSymbol, swapDto.side, swapDto.qty, swapDto.price);
  const swap = {
    isInitiator: swapDto.isInitiator,
    secret: swapDto.secret,
    secretHash: swapDto.secretHash,
    id: Number(swapDto.id),
    from,
    to,
    trade: {
      qty: new import_bignumber3.default(swapDto.qty),
      price: new import_bignumber3.default(swapDto.price),
      side: swapDto.side,
      symbol: swapDto.symbol
    },
    timeStamp: new Date(swapDto.timeStamp),
    counterParty: {
      status: swapDto.counterParty.status,
      transactions: mapTransactionDtosToTransactions(swapDto.counterParty.transactions),
      requisites: {
        ...swapDto.counterParty.requisites,
        rewardForRedeem: new import_bignumber3.default(swapDto.counterParty.requisites.rewardForRedeem)
      },
      trades: mapTradeDtosToTrades(swapDto.counterParty.trades)
    },
    user: {
      status: swapDto.user.status,
      transactions: mapTransactionDtosToTransactions(swapDto.user.transactions),
      requisites: {
        ...swapDto.user.requisites,
        rewardForRedeem: new import_bignumber3.default(swapDto.user.requisites.rewardForRedeem)
      },
      trades: mapTradeDtosToTrades(swapDto.user.trades)
    }
  };
  return swap;
};
var mapTradeDtosToTrades = (tradeDtos) => {
  const trades = tradeDtos.map((tradeDto) => ({
    orderId: tradeDto.orderId,
    price: new import_bignumber3.default(tradeDto.price),
    qty: new import_bignumber3.default(tradeDto.qty)
  }));
  return trades;
};
var mapSwapDtosToSwaps = (swapDtos, exchangeSymbolsProvider) => {
  return swapDtos.map((swapDto) => mapSwapDtoToSwap(swapDto, exchangeSymbolsProvider));
};
var mapWebSocketOrderDtoToOrder = (orderDto, exchangeSymbolsProvider) => {
  const exchangeSymbol = exchangeSymbolsProvider.getSymbol(orderDto.symbol);
  if (!exchangeSymbol)
    throw new Error(`"${orderDto.symbol}" symbol not found`);
  const [from, to] = symbolsHelper_exports.convertSymbolToFromToCurrenciesPair(exchangeSymbol, orderDto.side, orderDto.qty, orderDto.price);
  const order = {
    id: orderDto.id,
    clientOrderId: orderDto.clientOrderId,
    side: orderDto.side,
    status: orderDto.status,
    leaveQty: new import_bignumber3.default(orderDto.leaveQty),
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
  atomexNetwork;
  events = {
    swapUpdated: new EventEmitter(),
    orderUpdated: new EventEmitter(),
    orderBookSnapshot: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };
  authorizationManager;
  currenciesProvider;
  exchangeSymbolsProvider;
  apiBaseUrl;
  httpClient;
  _isStarted = false;
  constructor(options) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.currenciesProvider = options.currenciesProvider;
    this.exchangeSymbolsProvider = options.exchangeSymbolsProvider;
    this.apiBaseUrl = options.apiBaseUrl;
    this.httpClient = new HttpClient(this.apiBaseUrl);
  }
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this._isStarted = false;
  }
  async getOrder(accountAddress, orderId) {
    const urlPath = `/v1/Orders/${orderId}`;
    const authToken = this.getRequiredAuthToken(accountAddress);
    const orderDto = await this.httpClient.request({ urlPath, authToken });
    return orderDto ? mapOrderDtoToOrder(orderDto, this.exchangeSymbolsProvider) : void 0;
  }
  async getOrders(accountAddress, selector) {
    const urlPath = "/v1/Orders";
    const authToken = this.getRequiredAuthToken(accountAddress);
    const params = {
      ...selector,
      sortAsc: void 0,
      sort: (selector == null ? void 0 : selector.sortAsc) !== void 0 ? selector.sortAsc ? "Asc" : "Desc" : void 0
    };
    const orderDtos = await this.httpClient.request({ urlPath, authToken, params });
    return orderDtos ? mapOrderDtosToOrders(orderDtos, this.exchangeSymbolsProvider) : [];
  }
  async getSymbols() {
    const urlPath = "/v1/Symbols";
    const symbolDtos = await this.httpClient.request({ urlPath });
    return symbolDtos ? mapSymbolDtosToSymbols(symbolDtos, this.currenciesProvider) : [];
  }
  async getTopOfBook(symbolsOrDirections) {
    const urlPath = "/v1/MarketData/quotes";
    let symbols = void 0;
    if (symbolsOrDirections == null ? void 0 : symbolsOrDirections.length) {
      if (typeof symbolsOrDirections[0] === "string")
        symbols = symbolsOrDirections;
      else {
        const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
        symbols = symbolsOrDirections.map((d) => symbolsHelper_exports.findExchangeSymbolAndSide(exchangeSymbols, d.from, d.to)[0].name);
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
      const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
      symbol = symbolsHelper_exports.findExchangeSymbolAndSide(exchangeSymbols, symbolOrDirection.from, symbolOrDirection.to)[0].name;
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
    let amountBigNumber;
    let priceBigNumber;
    if (isOrderPreview(newOrderRequest.orderBody)) {
      const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
      const exchangeSymbolAndSide = symbolsHelper_exports.findExchangeSymbolAndSide(exchangeSymbols, newOrderRequest.orderBody.from.currencyId, newOrderRequest.orderBody.to.currencyId);
      const exchangeSymbol = exchangeSymbolAndSide[0];
      symbol = exchangeSymbol.name;
      side = exchangeSymbolAndSide[1];
      const directionName = exchangeSymbol.quoteCurrency === newOrderRequest.orderBody.from.currencyId ? "from" : "to";
      amountBigNumber = newOrderRequest.orderBody[directionName].amount;
      priceBigNumber = newOrderRequest.orderBody[directionName].price;
    } else {
      [symbol, side] = [newOrderRequest.orderBody.symbol, newOrderRequest.orderBody.side];
      amountBigNumber = newOrderRequest.orderBody.amount;
      priceBigNumber = newOrderRequest.orderBody.price;
    }
    const payload = {
      clientOrderId: newOrderRequest.clientOrderId,
      symbol,
      side,
      type: newOrderRequest.orderBody.type,
      requisites: newOrderRequest.requisites ? {
        secretHash: newOrderRequest.requisites.secretHash,
        receivingAddress: newOrderRequest.requisites.receivingAddress,
        refundAddress: newOrderRequest.requisites.refundAddress,
        rewardForRedeem: newOrderRequest.requisites.rewardForRedeem.toNumber(),
        lockTime: newOrderRequest.requisites.lockTime,
        baseCurrencyContract: newOrderRequest.requisites.baseCurrencyContract,
        quoteCurrencyContract: newOrderRequest.requisites.quoteCurrencyContract
      } : void 0,
      proofsOfFunds: newOrderRequest.proofsOfFunds,
      qty: amountBigNumber.toNumber(),
      price: priceBigNumber.toNumber()
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
      const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
      const exchangeSymbolAndSide = symbolsHelper_exports.findExchangeSymbolAndSide(exchangeSymbols, cancelOrderRequest.from, cancelOrderRequest.to);
      symbol = exchangeSymbolAndSide[0].name;
      side = exchangeSymbolAndSide[1];
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
      const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
      const exchangeSymbolAndSide = symbolsHelper_exports.findExchangeSymbolAndSide(exchangeSymbols, cancelAllOrdersRequest.from, cancelAllOrdersRequest.to);
      symbol = exchangeSymbolAndSide[0].name;
      side = exchangeSymbolAndSide[1];
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
    return swapDto ? mapSwapDtoToSwap(swapDto, this.exchangeSymbolsProvider) : void 0;
  }
  async getSwaps(addressOrAddresses, selector) {
    const urlPath = "/v1/Swaps";
    const userIds = this.getUserIds(addressOrAddresses);
    const params = {
      ...selector,
      sortAsc: void 0,
      sort: (selector == null ? void 0 : selector.sortAsc) !== void 0 ? selector.sortAsc ? "Asc" : "Desc" : void 0,
      userIds: userIds.join(",")
    };
    const swapDtos = await this.httpClient.request({
      urlPath,
      params
    });
    return swapDtos ? mapSwapDtosToSwaps(swapDtos, this.exchangeSymbolsProvider) : [];
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
    if (!authToken)
      throw new Error(`Cannot find auth token for address: ${accountAddress}`);
    return authToken;
  }
};

// src/clients/webSocket/webSocketClient.ts
var WebSocketClient = class {
  constructor(url, authToken) {
    this.url = url;
    this.authToken = authToken;
  }
  events = {
    messageReceived: new EventEmitter(),
    closed: new EventEmitter()
  };
  _socket;
  get socket() {
    if (!this._socket)
      throw new Error("Internal websocket is not created. Use the connect method first");
    return this._socket;
  }
  async connect() {
    this.disconnect();
    return new Promise((resolve) => {
      const protocols = this.authToken ? ["access_token", this.authToken] : void 0;
      this._socket = new WebSocket(this.url, protocols);
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
  onMessageReceived = (event) => {
    this.events.messageReceived.emit(JSON.parse(event.data));
  };
  onError(event) {
    throw new Error(`Websocket received error: ${JSON.stringify(event)}`);
  }
  onClosed = (event) => {
    this.events.closed.emit(this, event);
  };
};

// src/clients/webSocket/exchangeWebSocketClient.ts
var _ExchangeWebSocketClient = class {
  constructor(webSocketApiBaseUrl, authorizationManager) {
    this.webSocketApiBaseUrl = webSocketApiBaseUrl;
    this.authorizationManager = authorizationManager;
  }
  events = {
    messageReceived: new EventEmitter()
  };
  sockets = /* @__PURE__ */ new Map();
  _isStarted = false;
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this.subscribeOnAuthEvents();
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this.sockets.forEach((_, userId) => {
      this.removeSocket(userId);
    });
    this._isStarted = false;
  }
  subscribeOnAuthEvents() {
    this.authorizationManager.events.authorized.addListener(this.onAuthorized);
    this.authorizationManager.events.unauthorized.addListener(this.onUnauthorized);
  }
  onAuthorized = async (authToken) => {
    this.removeSocket(authToken.userId);
    const socket = new WebSocketClient(new URL(_ExchangeWebSocketClient.EXCHANGE_URL_PATH, this.webSocketApiBaseUrl), authToken.value);
    socket.events.messageReceived.addListener(this.onSocketMessageReceived);
    socket.events.closed.addListener(this.onClosed);
    this.sockets.set(authToken.userId, socket);
    await socket.connect();
  };
  onUnauthorized = (authToken) => {
    this.removeSocket(authToken.userId);
  };
  removeSocket(userId) {
    const socket = this.sockets.get(userId);
    if (socket) {
      socket.events.messageReceived.removeListener(this.onSocketMessageReceived);
      socket.events.closed.removeListener(this.onClosed);
      this.sockets.delete(userId);
      socket.disconnect();
    }
  }
  onSocketMessageReceived = (message) => {
    this.events.messageReceived.emit(message);
  };
  onClosed = (socket, _event) => {
    setTimeout(() => {
      socket.connect();
    }, 1e3);
  };
};
var ExchangeWebSocketClient = _ExchangeWebSocketClient;
__publicField(ExchangeWebSocketClient, "EXCHANGE_URL_PATH", "/ws/exchange");

// src/clients/webSocket/marketDataWebSocketClient.ts
var _MarketDataWebSocketClient = class {
  constructor(webSocketApiBaseUrl) {
    this.webSocketApiBaseUrl = webSocketApiBaseUrl;
    this.socket = new WebSocketClient(new URL(_MarketDataWebSocketClient.MARKET_DATA_URL_PATH, this.webSocketApiBaseUrl));
  }
  events = {
    messageReceived: new EventEmitter()
  };
  socket;
  _isStarted = false;
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this.socket.events.messageReceived.addListener(this.onSocketMessageReceived);
    this.socket.events.closed.addListener(this.onSocketClosed);
    await this.socket.connect();
    this.subscribeOnStreams(this.socket);
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this.socket.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.socket.events.closed.removeListener(this.onSocketClosed);
    this.socket.disconnect();
    this._isStarted = false;
  }
  subscribeOnStreams(socket) {
    socket.subscribe(_MarketDataWebSocketClient.TOP_OF_BOOK_STREAM);
    socket.subscribe(_MarketDataWebSocketClient.ORDER_BOOK_STREAM);
  }
  onSocketClosed = (socket, _event) => {
    setTimeout(async () => {
      await socket.connect();
      this.subscribeOnStreams(socket);
    }, 1e3);
  };
  onSocketMessageReceived = (message) => {
    this.events.messageReceived.emit(message);
  };
};
var MarketDataWebSocketClient = _MarketDataWebSocketClient;
__publicField(MarketDataWebSocketClient, "MARKET_DATA_URL_PATH", "/ws/marketdata");
__publicField(MarketDataWebSocketClient, "TOP_OF_BOOK_STREAM", "topOfBook");
__publicField(MarketDataWebSocketClient, "ORDER_BOOK_STREAM", "orderBook");

// src/clients/webSocket/webSocketAtomexClient.ts
var WebSocketAtomexClient = class {
  atomexNetwork;
  events = {
    swapUpdated: new EventEmitter(),
    orderUpdated: new EventEmitter(),
    orderBookSnapshot: new EventEmitter(),
    orderBookUpdated: new DeferredEventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };
  authorizationManager;
  exchangeSymbolsProvider;
  currenciesProvider;
  webSocketApiBaseUrl;
  marketDataWebSocketClient;
  exchangeWebSocketClient;
  orderBookProvider;
  _isStarted = false;
  constructor(options) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.currenciesProvider = options.currenciesProvider;
    this.exchangeSymbolsProvider = options.exchangeSymbolsProvider;
    this.orderBookProvider = options.orderBookProvider;
    this.webSocketApiBaseUrl = options.webSocketApiBaseUrl;
    this.exchangeWebSocketClient = new ExchangeWebSocketClient(this.webSocketApiBaseUrl, this.authorizationManager);
    this.marketDataWebSocketClient = new MarketDataWebSocketClient(this.webSocketApiBaseUrl);
  }
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this.exchangeWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    this.marketDataWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    await Promise.all([
      this.exchangeWebSocketClient.start(),
      this.marketDataWebSocketClient.start()
    ]);
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this.exchangeWebSocketClient.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.marketDataWebSocketClient.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.exchangeWebSocketClient.stop();
    this.marketDataWebSocketClient.stop();
    this._isStarted = false;
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
  onSocketMessageReceived = (message) => {
    switch (message.event) {
      case "order":
        this.events.orderUpdated.emit(mapWebSocketOrderDtoToOrder(message.data, this.exchangeSymbolsProvider));
        break;
      case "swap":
        this.events.swapUpdated.emit(mapSwapDtoToSwap(message.data, this.exchangeSymbolsProvider));
        break;
      case "topOfBook":
        this.events.topOfBookUpdated.emit(mapQuoteDtosToQuotes(message.data));
        break;
      case "snapshot":
        this.onOrderBookSnapshotReceived(message.data);
        break;
      case "entries":
        this.onOrderBookEntriesReceived(message.data);
        break;
    }
  };
  onOrderBookSnapshotReceived(orderBookDto) {
    const orderBook = mapOrderBookDtoToOrderBook(orderBookDto);
    this.orderBookProvider.setOrderBook(orderBook.symbol, orderBook);
    this.events.orderBookSnapshot.emit(orderBook);
  }
  onOrderBookEntriesReceived(entryDtos) {
    const updatedOrderBooks = mapWebSocketOrderBookEntryDtoToOrderBooks(entryDtos, this.orderBookProvider);
    for (const updatedOrderBook of updatedOrderBooks) {
      this.orderBookProvider.setOrderBook(updatedOrderBook.symbol, updatedOrderBook);
      this.events.orderBookUpdated.emit(updatedOrderBook.symbol, updatedOrderBook);
    }
  }
};

// src/clients/mixedAtomexClient.ts
var MixedApiAtomexClient = class {
  constructor(atomexNetwork, restAtomexClient, webSocketAtomexClient) {
    this.atomexNetwork = atomexNetwork;
    this.restAtomexClient = restAtomexClient;
    this.webSocketAtomexClient = webSocketAtomexClient;
    atomexUtils_exports.ensureNetworksAreSame(this, restAtomexClient);
    atomexUtils_exports.ensureNetworksAreSame(this, webSocketAtomexClient);
    this.events = {
      swapUpdated: this.webSocketAtomexClient.events.swapUpdated,
      orderBookSnapshot: this.webSocketAtomexClient.events.orderBookSnapshot,
      orderBookUpdated: this.webSocketAtomexClient.events.orderBookUpdated,
      orderUpdated: this.webSocketAtomexClient.events.orderUpdated,
      topOfBookUpdated: this.webSocketAtomexClient.events.topOfBookUpdated
    };
  }
  events;
  _isStarted = false;
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    await Promise.all([
      this.webSocketAtomexClient.start(),
      this.restAtomexClient.start()
    ]);
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    this.webSocketAtomexClient.stop();
    this.restAtomexClient.stop();
    this._isStarted = false;
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
};

// src/atomexBuilder/atomexComponents/exchangeService.ts
var createDefaultExchangeService = (atomexContext, options) => {
  return new MixedApiAtomexClient(atomexContext.atomexNetwork, new RestAtomexClient({
    atomexNetwork: atomexContext.atomexNetwork,
    authorizationManager: atomexContext.managers.authorizationManager,
    currenciesProvider: atomexContext.providers.currenciesProvider,
    exchangeSymbolsProvider: atomexContext.providers.exchangeSymbolsProvider,
    apiBaseUrl: options.apiBaseUrl
  }), new WebSocketAtomexClient({
    atomexNetwork: atomexContext.atomexNetwork,
    authorizationManager: atomexContext.managers.authorizationManager,
    currenciesProvider: atomexContext.providers.currenciesProvider,
    exchangeSymbolsProvider: atomexContext.providers.exchangeSymbolsProvider,
    orderBookProvider: atomexContext.providers.orderBookProvider,
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
  events = {
    authorized: new EventEmitter(),
    unauthorized: new EventEmitter(),
    authTokenExpiring: new EventEmitter(),
    authTokenExpired: new EventEmitter()
  };
  atomexNetwork;
  walletsManager;
  store;
  authorizationUrl;
  expiringNotificationTimeInSeconds;
  _authTokenData = /* @__PURE__ */ new Map();
  _isStarted = false;
  constructor(options) {
    this.atomexNetwork = options.atomexNetwork;
    this.store = options.store;
    this.walletsManager = options.walletsManager;
    atomexUtils_exports.ensureNetworksAreSame(this, this.walletsManager);
    this.authorizationUrl = new URL(_AuthorizationManager.DEFAULT_GET_AUTH_TOKEN_URI, options.authorizationBaseUrl);
    this.expiringNotificationTimeInSeconds = options.expiringNotificationTimeInSeconds || _AuthorizationManager.DEFAULT_EXPIRING_NOTIFICATION_TIME_IN_SECONDS;
  }
  get isStarted() {
    return this._isStarted;
  }
  async start() {
    if (this.isStarted)
      return;
    this._isStarted = true;
  }
  stop() {
    if (!this.isStarted)
      return;
    for (const authTokenDataTuple of this.authTokenData)
      this.untrackAuthToken(authTokenDataTuple[1].watcherId);
    this._isStarted = false;
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
    const wallet = await this.walletsManager.getWallet(address, blockchain);
    if (!wallet)
      throw new Error(`Not found: the corresponding wallet by the ${address} address`);
    const timeStamp = this.getAuthorizationTimeStamp(authMessage);
    const atomexSignature = await wallet.sign(authMessage + timeStamp);
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
  authTokenExpiringTimeoutCallback = (authToken) => {
    const authTokenData = this._authTokenData.get(authToken.address);
    if (!authTokenData)
      return;
    clearTimeout(authTokenData.watcherId);
    const duration = authToken.expired.getTime() - Date.now();
    const newWatcherId = setTimeout(this.authTokenExpiredTimeoutCallback, prepareTimeoutDuration(duration), authToken);
    this._authTokenData.set(authToken.address, {
      ...authTokenData,
      watcherId: newWatcherId
    });
    this.events.authTokenExpiring.emit(authToken);
  };
  authTokenExpiredTimeoutCallback = (authToken) => {
    this.unregisterAuthToken(authToken);
    this.events.authTokenExpired.emit(authToken);
  };
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
  storeStrategy;
  constructor(storeStrategy = "single-key", serializedAuthTokenMapper = new DefaultSerializedAuthTokenMapper()) {
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
  authTokensMap = /* @__PURE__ */ new Map();
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
    walletsManager: atomexContext.managers.walletsManager,
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
  }
  customAuthorizationManagerFactory;
  customWalletsManagerFactory;
  customExchangeManagerFactory;
  get controlledAtomexContext() {
    return this.atomexContext;
  }
  useAuthorizationManager(customAuthorizationManagerFactory) {
    this.customAuthorizationManagerFactory = customAuthorizationManagerFactory;
    return this;
  }
  useWalletsManager(customWalletsManagerFactory) {
    this.customWalletsManagerFactory = customWalletsManagerFactory;
    return this;
  }
  useExchangeManager(customExchangeManagerFactory) {
    this.customExchangeManagerFactory = customExchangeManagerFactory;
    return this;
  }
  build() {
    const blockchainProvider = new AtomexBlockchainProvider();
    this.controlledAtomexContext.providers.blockchainProvider = blockchainProvider;
    this.controlledAtomexContext.providers.currenciesProvider = blockchainProvider;
    this.controlledAtomexContext.providers.exchangeSymbolsProvider = this.createExchangeSymbolsProvider();
    this.controlledAtomexContext.providers.orderBookProvider = this.createOrderBookProvider();
    this.controlledAtomexContext.managers.walletsManager = this.createWalletsManager();
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
        walletsManager: this.atomexContext.managers.walletsManager,
        authorizationManager: this.atomexContext.managers.authorizationManager,
        exchangeManager: this.atomexContext.managers.exchangeManager,
        swapManager: this.atomexContext.managers.swapManager
      },
      blockchains
    });
  }
  createExchangeSymbolsProvider() {
    return new InMemoryExchangeSymbolsProvider();
  }
  createOrderBookProvider() {
    return new InMemoryOrderBookProvider();
  }
  createAuthorizationManager() {
    const defaultAuthorizationManagerOptions = config[this.atomexContext.atomexNetwork].authorization;
    return this.customAuthorizationManagerFactory ? this.customAuthorizationManagerFactory(this.atomexContext, defaultAuthorizationManagerOptions, this.options) : createDefaultAuthorizationManager(this.atomexContext, defaultAuthorizationManagerOptions, this.options);
  }
  createWalletsManager() {
    return this.customWalletsManagerFactory ? this.customWalletsManagerFactory(this.atomexContext, this.options) : new WalletsManager(this.atomexContext.atomexNetwork);
  }
  createDefaultExchangeService() {
    const defaultExchangeManagerOptions = config[this.atomexContext.atomexNetwork].exchange;
    return createDefaultExchangeService(this.atomexContext, defaultExchangeManagerOptions);
  }
  createExchangeManager() {
    return this.customExchangeManagerFactory ? this.customExchangeManagerFactory(this.atomexContext, this.options) : new ExchangeManager({
      exchangeService: this.atomexContext.services.exchangeService,
      symbolsProvider: this.atomexContext.providers.exchangeSymbolsProvider,
      orderBookProvider: this.atomexContext.providers.orderBookProvider
    });
  }
  createSwapManager() {
    return new SwapManager(this.atomexContext.services.swapService);
  }
  createDefaultBlockchainOptions() {
    return {
      tezos: createDefaultTezosBlockchainOptions(this.atomexContext),
      ethereum: createDefaultEthereumBlockchainOptions(this.atomexContext)
    };
  }
};

// src/atomexBuilder/createDefaultAtomex.ts
var createDefaultMainnetAtomex = (options) => {
  const builder = new AtomexBuilder({ ...options, atomexNetwork: "mainnet" });
  return builder.build();
};
var createDefaultTestnetAtomex = (options) => {
  const builder = new AtomexBuilder({ ...options, atomexNetwork: "testnet" });
  return builder.build();
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

// src/legacy/config.ts
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
  _network;
  _baseUrl;
  _authToken;
  _authorizationManager;
  constructor(network, baseUrl, authToken) {
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
    query.requisites = {
      baseCurrencyContract: baseConfig.contractAddress,
      quoteCurrencyContract: quoteConfig.contractAddress,
      ...query.requisites
    };
    return this.makeRequest("post", "/v1/Orders", ((_a = addOrderRequest.requisites) == null ? void 0 : _a.receivingAddress) || true, {}, query).then((res) => res["orderId"]);
  }
  async getOrders(address, getOrdersRequest) {
    return this.makeRequest("get", "/v1/Orders", address || true, { ...getOrdersRequest });
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
    return this.makeRequest("get", "/v1/Swaps", address || true, { ...getSwapsRequest });
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
var import_bignumber4 = __toESM(require("bignumber.js"));
var import_elliptic2 = __toESM(require("elliptic"));
var import_web33 = __toESM(require("web3"));

// src/legacy/helpers.ts
var Helpers = class {
  constructor(atomex) {
    this.atomex = atomex;
  }
  validateInitiateTransactionBySwap(swap) {
    const initiateTransaction = swap.counterParty.transactions.find((transaction) => transaction.type === "Lock");
    if (!initiateTransaction)
      return Promise.resolve({
        status: "NotFound",
        confirmations: 0,
        nextBlockETA: 0
      });
    const toCurrency = this.atomex.getCurrency(swap.to.currencyId);
    if (!toCurrency)
      throw new Error(`Config of the "${swap.to.currencyId}" not found`);
    return this.validateInitiateTransaction(initiateTransaction.blockId, initiateTransaction.id, swap.secretHash, swap.user.requisites.receivingAddress, converters_exports.tokensAmountToNat(swap.to.amount, toCurrency.decimals), converters_exports.tokensAmountToNat(swap.user.requisites.rewardForRedeem, toCurrency.decimals), 0, 2);
  }
};
var dt2ts = (isoTime) => Math.round(new Date(isoTime).getTime() / 1e3);
var now = () => Math.round(Date.now() / 1e3);

// src/legacy/ethereum.ts
var EthereumHelpers = class extends Helpers {
  _web3;
  _contract;
  _timeBetweenBlocks;
  _functions;
  _gasLimit;
  constructor(atomex, web3, jsonInterface, contractAddress, timeBetweenBlocks, gasLimit) {
    super(atomex);
    this._web3 = web3;
    this._contract = this.createContract(jsonInterface, contractAddress);
    this._timeBetweenBlocks = timeBetweenBlocks;
    this._gasLimit = gasLimit;
    this._functions = /* @__PURE__ */ new Map();
    this.initializeFunctions(jsonInterface);
  }
  initializeFunctions(jsonInterface) {
    jsonInterface.forEach((item) => {
      if (item.type === "function") {
        this._functions.set(item.name, {
          types: item.inputs,
          signature: this._web3.eth.abi.encodeFunctionSignature(item)
        });
      }
    });
  }
  static async create(newAtomex, network, rpcUri) {
    const networkSettings = config_default.blockchains.ethereum.rpc[network];
    if (rpcUri !== void 0) {
      networkSettings.rpc = rpcUri;
    }
    const web3 = new import_web33.default(networkSettings.rpc);
    const chainID = await web3.eth.getChainId();
    if (networkSettings.chainID !== chainID) {
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);
    }
    return new EthereumHelpers(newAtomex, web3, config_default.currencies.ETH.contracts.abi, config_default.currencies.ETH.contracts[network].address, networkSettings.blockTime, config_default.currencies.ETH.contracts[network].gasLimit);
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
    const data = this._contract.methods.initiate("0x" + initiateParameters.secretHash, initiateParameters.receivingAddress, initiateParameters.refundTimestamp, initiateParameters.rewardForRedeem.toString(10)).encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
      amount: initiateParameters.netAmount.plus(initiateParameters.rewardForRedeem)
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
      rewardForRedeem: new import_bignumber4.default(this._web3.utils.toBN(params["_payoff"]).toString()),
      netAmount: new import_bignumber4.default(this._web3.utils.toBN(transaction.value).sub(this._web3.utils.toBN(params["_payoff"])).toString())
    };
  }
  async validateInitiateTransaction(_blockHeight, txId, secretHash, receivingAddress, amount, payoff, minRefundTimestamp, minConfirmations = 2) {
    var _a;
    amount = new import_bignumber4.default(amount);
    payoff = new import_bignumber4.default(payoff);
    const netAmount = amount.minus(payoff);
    const transaction = await this.getTransaction(txId);
    try {
      if (!transaction)
        throw new Error(`Failed to retrieve transaction: ${txId}`);
      const errors = [];
      if (((_a = transaction.to) == null ? void 0 : _a.toLowerCase()) !== this._contract.options.address.toLowerCase())
        errors.push(`Wrong contract address: expect ${this._contract.options.address}, actual ${transaction.to}`);
      const initiateParameters = this.parseInitiateParameters(transaction);
      if (initiateParameters.secretHash !== secretHash)
        errors.push(`Secret hash: expect ${secretHash}, actual ${initiateParameters.secretHash}`);
      if (initiateParameters.receivingAddress.toLowerCase() !== receivingAddress.toLowerCase())
        errors.push(`Receiving address: expect ${receivingAddress}, actual ${initiateParameters.receivingAddress}`);
      if (!initiateParameters.netAmount.isEqualTo(netAmount))
        errors.push(`Net amount: expect ${netAmount.toString(10)}, actual ${initiateParameters.netAmount.toString(10)}`);
      if (initiateParameters.refundTimestamp < minRefundTimestamp)
        errors.push(`Refund timestamp: minimum ${minRefundTimestamp}, actual ${initiateParameters.refundTimestamp}`);
      if (errors.length) {
        const errorMessage = errors.reduce((result, error, index) => `${result}
	${index + 1}. ${error};`, `Initiate transaction that satisfies the expected criteria is not found in ${txId} contents:`);
        throw new Error(errorMessage);
      }
    } catch (e) {
      return {
        status: "Invalid",
        message: e.message,
        confirmations: 0,
        nextBlockETA: 0
      };
    }
    const latestBlock = await this.getBlock("latest");
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
    const secp256k1 = new import_elliptic2.default.ec("secp256k1");
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
    var _a;
    const dummyTx = {
      receivingAddress: "0x0000000000000000000000000000000000000000",
      secretHash: "0000000000000000000000000000000000000000000000000000000000000000",
      refundTimestamp: 2147483647,
      rewardForRedeem: new import_bignumber4.default(0),
      netAmount: new import_bignumber4.default(0)
    };
    const txData = this.buildInitiateTransaction(dummyTx);
    const gasPrice = await this._web3.eth.getGasPrice();
    const gasEstimate = await this._web3.eth.estimateGas({
      from: source,
      to: txData.contractAddr,
      data: txData.data,
      value: (_a = txData.amount) == null ? void 0 : _a.toString(10)
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
  getTransaction(txId) {
    return this._web3.eth.getTransaction(txId);
  }
  getBlock(blockId) {
    return this._web3.eth.getBlock(blockId);
  }
  createContract(jsonInterface, contractAddress) {
    return new this._web3.eth.Contract(jsonInterface, contractAddress);
  }
};

// src/legacy/tezos.ts
var import_michelson_encoder = require("@taquito/michelson-encoder");
var import_rpc = require("@taquito/rpc");
var import_taquito5 = require("@taquito/taquito");
var import_utils15 = require("@taquito/utils");
var import_bignumber5 = __toESM(require("bignumber.js"));
var formatTimestamp = (timestamp) => {
  return new Date(timestamp * 1e3).toISOString().slice(0, -5) + "Z";
};
var TezosHelpers = class extends Helpers {
  _tezos;
  _contractAddress;
  _timeBetweenBlocks;
  _entrypoints;
  _gasLimit;
  _minimalFees;
  _minimalNanotezPerGasUnit;
  _minimalNanotezPerByte;
  _costPerByte;
  _redeemTxSize;
  _initiateTxSize;
  constructor(atomex, tezos, entrypoints, contractAddress, timeBetweenBlocks, gasLimit, minimalFees, minimalNanotezPerGasUnit, minimalNanotezPerByte, costPerByte, redeemTxSize, initiateTxSize) {
    super(atomex);
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
      return [name, new import_michelson_encoder.ParameterSchema(typeExpr)];
    }));
  }
  static async create(newAtomex, network, currency = "XTZ", rpcUri) {
    const networkSettings = config_default.blockchains.tezos.rpc[network];
    if (rpcUri !== void 0) {
      networkSettings.rpc = rpcUri;
    }
    const tezos = new import_taquito5.TezosToolkit(networkSettings.rpc);
    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString()) {
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);
    }
    return new TezosHelpers(newAtomex, tezos, config_default.currencies[currency].contracts.entrypoints, config_default.currencies[currency].contracts[network].address, config_default.blockchains.tezos.rpc[network].blockTime, config_default.currencies[currency].contracts[network].gasLimit, config_default.blockchains.tezos.rpc[network].minimalFees, config_default.blockchains.tezos.rpc[network].minimalNanotezPerGasUnit, config_default.blockchains.tezos.rpc[network].minimalNanotezPerByte, config_default.blockchains.tezos.rpc[network].costPerByte, config_default.currencies[currency].contracts[network].redeemTxSize, config_default.currencies[currency].contracts[network].initiateTxSize);
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
      amount: initiateParameters.netAmount.plus(initiateParameters.rewardForRedeem)
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
      netAmount: new import_bignumber5.default(content.amount).minus(initiateParams["settings"]["payoff"]),
      rewardForRedeem: new import_bignumber5.default(initiateParams["settings"]["payoff"])
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
    amount = new import_bignumber5.default(amount);
    payoff = new import_bignumber5.default(payoff);
    const netAmount = amount.minus(payoff);
    const block = await this.getBlock(blockHeight);
    try {
      let errors = [];
      const tx = this.findContractCall(block, txID).find((content) => {
        errors = [];
        const initiateParameters = this.parseInitiateParameters(content);
        if (initiateParameters.secretHash !== secretHash)
          errors.push(`Secret hash: expect ${secretHash}, actual ${initiateParameters.secretHash}. Counter = ${content.counter}`);
        if (initiateParameters.receivingAddress.toLowerCase() !== receivingAddress.toLowerCase())
          errors.push(`Receiving address: expect ${receivingAddress}, actual ${initiateParameters.receivingAddress}. Counter = ${content.counter}`);
        if (!initiateParameters.netAmount.isEqualTo(netAmount))
          errors.push(`Net amount: expect ${netAmount.toString(10)}, actual ${initiateParameters.netAmount.toString(10)}. Counter = ${content.counter}`);
        if (initiateParameters.refundTimestamp < minRefundTimestamp)
          errors.push(`Refund timestamp: minimum ${minRefundTimestamp}, actual ${initiateParameters.refundTimestamp}. Counter = ${content.counter}`);
        return !errors.length;
      }, this);
      if (!tx) {
        const errorMessage = errors.reduce((result, error, index) => `${result}
	${index + 1}. ${error};`, `Initiate transaction that satisfies the expected criteria is not found in ${txID} contents:`);
        throw new Error(errorMessage);
      }
    } catch (e) {
      return {
        status: "Invalid",
        message: e.message,
        confirmations: 0,
        nextBlockETA: 0
      };
    }
    const headDetails = this.getBlockDetails(await this.getBlock("head"));
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
        return Buffer.from((0, import_utils15.b58cdecode)(pubKey, import_utils15.prefix["edpk"])).toString("hex");
      case "p2":
        return Buffer.from((0, import_utils15.b58cdecode)(pubKey, import_utils15.prefix["p2pk"])).toString("hex");
      case "sp":
        return Buffer.from((0, import_utils15.b58cdecode)(pubKey, import_utils15.prefix["sppk"])).toString("hex");
      default:
        throw new Error("Unsupported Public Key Type");
    }
  }
  encodeSignature(signature) {
    var _a;
    const pref = signature.startsWith("sig") ? signature.substring(0, 3) : signature.substring(0, 5);
    if (Object.prototype.hasOwnProperty.call(import_utils15.prefix, pref)) {
      return Buffer.from((0, import_utils15.b58cdecode)(signature, (_a = Object.getOwnPropertyDescriptor(import_utils15.prefix, pref)) == null ? void 0 : _a.value)).toString("hex");
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
      rewardForRedeem: new import_bignumber5.default(0),
      netAmount: new import_bignumber5.default(100)
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
            kind: import_rpc.OpKind.TRANSACTION,
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
    return (0, import_utils15.validateAddress)(address) == import_utils15.ValidationResult.VALID;
  }
  getBlock(blockId) {
    return this._tezos.rpc.getBlock({ block: blockId.toString() });
  }
};

// src/legacy/fa12.ts
var import_taquito6 = require("@taquito/taquito");
var import_bignumber6 = __toESM(require("bignumber.js"));
var FA12Helpers = class extends TezosHelpers {
  static async create(newAtomex, network, currency, rpcUri) {
    const networkSettings = config_default.blockchains.tezos.rpc[network];
    if (rpcUri !== void 0) {
      networkSettings.rpc = rpcUri;
    }
    const tezos = new import_taquito6.TezosToolkit(networkSettings.rpc);
    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString()) {
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);
    }
    return new FA12Helpers(newAtomex, tezos, config_default.currencies[currency].contracts.entrypoints, config_default.currencies[currency].contracts[network].address, config_default.blockchains.tezos.rpc[network].blockTime, config_default.currencies[currency].contracts[network].gasLimit, config_default.blockchains.tezos.rpc[network].minimalFees, config_default.blockchains.tezos.rpc[network].minimalNanotezPerGasUnit, config_default.blockchains.tezos.rpc[network].minimalNanotezPerByte, config_default.blockchains.tezos.rpc[network].costPerByte, config_default.currencies[currency].contracts[network].redeemTxSize, config_default.currencies[currency].contracts[network].initiateTxSize);
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
      netAmount: new import_bignumber6.default(initiateParams["totalAmount"]).minus(initiateParams["payoffAmount"]),
      rewardForRedeem: new import_bignumber6.default(initiateParams["payoffAmount"])
    };
  }
};

// src/legacy/fa2.ts
var import_taquito7 = require("@taquito/taquito");
var import_bignumber7 = __toESM(require("bignumber.js"));
var FA2Helpers = class extends TezosHelpers {
  static async create(newAtomex, network, currency, rpcUri) {
    const networkSettings = config_default.blockchains.tezos.rpc[network];
    if (rpcUri !== void 0) {
      networkSettings.rpc = rpcUri;
    }
    const tezos = new import_taquito7.TezosToolkit(networkSettings.rpc);
    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString()) {
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);
    }
    return new FA2Helpers(newAtomex, tezos, config_default.currencies[currency].contracts.entrypoints, config_default.currencies[currency].contracts[network].address, config_default.blockchains.tezos.rpc[network].blockTime, config_default.currencies[currency].contracts[network].gasLimit, config_default.blockchains.tezos.rpc[network].minimalFees, config_default.blockchains.tezos.rpc[network].minimalNanotezPerGasUnit, config_default.blockchains.tezos.rpc[network].minimalNanotezPerByte, config_default.blockchains.tezos.rpc[network].costPerByte, config_default.currencies[currency].contracts[network].redeemTxSize, config_default.currencies[currency].contracts[network].initiateTxSize);
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
      netAmount: new import_bignumber7.default(initiateParams["totalAmount"]).minus(initiateParams["payoffAmount"]),
      rewardForRedeem: new import_bignumber7.default(initiateParams["payoffAmount"])
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Atomex,
  AtomexBuilder,
  AuthTokenSource,
  AuthorizationManager,
  DataSource,
  DefaultSerializedAuthTokenMapper,
  ERC20EthereumWeb3AtomexProtocolV1,
  EthereumWeb3AtomexProtocolV1,
  ExchangeManager,
  FA12TezosTaquitoAtomexProtocolV1,
  FA2TezosTaquitoAtomexProtocolV1,
  ImportantDataReceivingMode,
  InMemoryAuthorizationManagerStore,
  InMemoryExchangeSymbolsProvider,
  LocalStorageAuthorizationManagerStore,
  MixedApiAtomexClient,
  RestAtomexClient,
  TaquitoBlockchainWallet,
  TezosTaquitoAtomexProtocolV1,
  WalletsManager,
  Web3BlockchainWallet,
  WebSocketAtomexClient,
  atomexUtils,
  converters,
  createDefaultMainnetAtomex,
  createDefaultTestnetAtomex,
  guards,
  legacy,
  prepareTimeoutDuration,
  textUtils,
  wait
});
//# sourceMappingURL=index.cjs.map
