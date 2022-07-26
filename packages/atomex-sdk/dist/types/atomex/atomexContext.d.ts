import type { AuthorizationManager } from '../authorization/index';
import type { SignersManager } from '../blockchain/index';
import type { ExchangeManager, ExchangeService } from '../exchange';
import type { AtomexNetwork } from '../index';
import { SwapManager, SwapService } from '../swaps/index';
export declare class AtomexContext {
    readonly atomexNetwork: AtomexNetwork;
    private static idCounter;
    readonly id: number;
    readonly managers: AtomexContextManagersSection;
    readonly services: AtomexContextServicesSection;
    constructor(atomexNetwork: AtomexNetwork);
}
declare class AtomexContextManagersSection {
    readonly context: AtomexContext;
    private _signersManager;
    private _authorizationManager;
    private _exchangeManager;
    private _swapManager;
    constructor(context: AtomexContext);
    get signersManager(): SignersManager;
    private set signersManager(value);
    get authorizationManager(): AuthorizationManager;
    private set authorizationManager(value);
    get exchangeManager(): ExchangeManager;
    private set exchangeManager(value);
    get swapManager(): SwapManager;
    private set swapManager(value);
}
declare class AtomexContextServicesSection {
    readonly context: AtomexContext;
    private _exchangeService;
    private _swapService;
    constructor(context: AtomexContext);
    get exchangeService(): ExchangeService;
    private set exchangeService(value);
    get swapService(): SwapService;
    private set swapService(value);
}
export declare class AtomexComponentNotResolvedError extends Error {
    readonly name: string;
    readonly componentName: string;
    constructor(componentName: string);
    private static getMessage;
}
export {};
