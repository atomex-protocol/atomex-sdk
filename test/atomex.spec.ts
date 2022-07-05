import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";
import { Atomex } from "../src/atomex";
import {
  AddOrderRequest,
  AuthTokenRequest,
  AuthTokenResponse,
  OrderBook,
  OrderPreview,
  SwapRequisites,
} from "../src/types";
import orderBook from "./data/order_book.json";
import spec from "./data/swagger.json";
const OpenAPISampler = require("openapi-sampler");

jest.mock("node-fetch", () => {
  return jest.fn();
});

beforeEach(() => {
  mocked(fetch).mockClear();
});

describe("Atomex test", () => {
  test("getAuthToken", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const req = <AuthTokenRequest>(
      OpenAPISampler.sample(
        spec.paths["/v1/Token"].post.requestBody.content["application/json"]
          .schema,
        {},
        spec,
      )
    );
    expect(typeof req.message).toBe("string");
    expect(typeof req.publicKey).toBe("string");
    expect(typeof req.signature).toBe("string");
    expect(typeof req.timeStamp).toBe("number");
    expect(typeof req.algorithm).toBe("string");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Token"].post.responses[200].content["application/json"]
        .schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );

    const resp = <AuthTokenResponse>await atomex.getAuthToken(req);
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe("http://localhost/v1/Token");
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("post");
    expect(mocked(fetch).mock.calls[0][1]?.headers).toHaveProperty(
      "Content-Type",
    );
    expect(mocked(fetch).mock.calls[0][1]?.body).toBeDefined();

    expect(typeof resp.expires).toBe("number");
    expect(typeof resp.id).toBe("string");
    expect(typeof resp.token).toBe("string");
  });

  test("getQuotes", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/MarketData/quotes"].get.responses[200].content[
        "application/json"
      ].schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );

    const resp = await atomex.getQuotes(["XTZ/ETH"]);
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe(
      "http://localhost/v1/MarketData/quotes?symbols=XTZ%2FETH",
    );
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("get");

    expect(resp.length).toBe(1);
    expect(typeof resp[0].symbol).toBe("string");
    expect(typeof resp[0].timeStamp).toBe("number");
    expect(typeof resp[0].bid).toBe("number");
    expect(typeof resp[0].ask).toBe("number");
  });

  test("getSymbols", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Symbols"].get.responses[200].content["application/json"]
        .schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );

    const resp = await atomex.getSymbols();
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe("http://localhost/v1/Symbols");
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("get");

    expect(resp.length).toBe(1);
    expect(typeof resp[0].minimumQty).toBe("number");
    expect(typeof resp[0].name).toBe("string");
  });

  test("getOderBook", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/MarketData/book"].get.responses[200].content[
        "application/json"
      ].schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );

    const resp = await atomex.getOrderBook("ETH/BTC");
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe(
      "http://localhost/v1/MarketData/book?symbol=ETH%2FBTC",
    );
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("get");

    expect(resp.entries.length).toBe(1);
    expect(typeof resp.entries[0].price).toBe("number");
    expect(resp.entries[0].qtyProfile.length).toBe(1);
    expect(typeof resp.entries[0].qtyProfile[0]).toBe("number");
    expect(typeof resp.entries[0].side).toBe("string");
    expect(typeof resp.symbol).toBe("string");
    expect(typeof resp.updateId).toBe("number");
  });

  test("getOrders", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Orders"].get.responses[200].content["application/json"]
        .schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );

    const resp = await atomex.getOrders();
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe("http://localhost/v1/Orders");
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("get");

    expect(resp.length).toBe(1);
    expect(typeof resp[0].clientOrderId).toBe("string");
    expect(typeof resp[0].id).toBe("number");
    expect(typeof resp[0].leaveQty).toBe("number");
    expect(typeof resp[0].price).toBe("number");
    expect(typeof resp[0].qty).toBe("number");
    expect(typeof resp[0].side).toBe("string");
    expect(typeof resp[0].status).toBe("string");
    expect(typeof resp[0].symbol).toBe("string");
    expect(typeof resp[0].timeStamp).toBe("string");
    expect(typeof resp[0].type).toBe("string");

    expect(resp[0].trades.length).toBe(1);
    expect(typeof resp[0].trades[0].orderId).toBe("number");
    expect(typeof resp[0].trades[0].price).toBe("number");
    expect(typeof resp[0].trades[0].qty).toBe("number");

    expect(resp[0].swaps.length).toBe(1);
    expect(typeof resp[0].swaps[0].counterParty.requisites.lockTime).toBe(
      "number",
    );
    expect(
      typeof resp[0].swaps[0].counterParty.requisites.receivingAddress,
    ).toBe("string");
    expect(typeof resp[0].swaps[0].counterParty.requisites.refundAddress).toBe(
      "string",
    );
    expect(
      typeof resp[0].swaps[0].counterParty.requisites.rewardForRedeem,
    ).toBe("number");
    expect(typeof resp[0].swaps[0].counterParty.requisites.secretHash).toBe(
      "string",
    );
    expect(typeof resp[0].swaps[0].counterParty.status).toBe("string");
    expect(typeof resp[0].swaps[0].counterParty.trades).toBe(
      typeof resp[0].trades,
    );
    expect(typeof resp[0].swaps[0].counterParty.status).toBe("string");
    expect(resp[0].swaps[0].counterParty.transactions.length).toBe(1);
    expect(
      typeof resp[0].swaps[0].counterParty.transactions[0].blockHeight,
    ).toBe("number");
    expect(
      typeof resp[0].swaps[0].counterParty.transactions[0].confirmations,
    ).toBe("number");
    expect(typeof resp[0].swaps[0].counterParty.transactions[0].currency).toBe(
      "string",
    );
    expect(typeof resp[0].swaps[0].counterParty.transactions[0].status).toBe(
      "string",
    );
    expect(typeof resp[0].swaps[0].counterParty.transactions[0].txId).toBe(
      "string",
    );
    expect(typeof resp[0].swaps[0].counterParty.transactions[0].type).toBe(
      "string",
    );
    expect(typeof resp[0].swaps[0].id).toBe("number");
    expect(typeof resp[0].swaps[0].isInitiator).toBe("boolean");
    expect(typeof resp[0].swaps[0].price).toBe("number");
    expect(typeof resp[0].swaps[0].qty).toBe("number");
    expect(typeof resp[0].swaps[0].secret).toBe("string");
    expect(typeof resp[0].swaps[0].secretHash).toBe("string");
    expect(typeof resp[0].swaps[0].side).toBe("string");
    expect(typeof resp[0].swaps[0].symbol).toBe("string");
    expect(typeof resp[0].swaps[0].timeStamp).toBe("string");
    expect(typeof resp[0].swaps[0].user).toBe(
      typeof resp[0].swaps[0].counterParty,
    );
  });

  test("getOder", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Orders/{id}"].get.responses[200].content[
        "application/json"
      ].schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );

    const resp = await atomex.getOrder("12");
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe(
      "http://localhost/v1/Orders/12",
    );
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("get");

    expect(typeof resp.clientOrderId).toBe("string");
    expect(typeof resp.id).toBe("number");
    expect(typeof resp.leaveQty).toBe("number");
    expect(typeof resp.price).toBe("number");
    expect(typeof resp.qty).toBe("number");
    expect(typeof resp.side).toBe("string");
    expect(typeof resp.status).toBe("string");
    expect(typeof resp.symbol).toBe("string");
    expect(typeof resp.timeStamp).toBe("string");
    expect(typeof resp.type).toBe("string");

    expect(resp.trades.length).toBe(1);
    expect(typeof resp.trades[0].orderId).toBe("number");
    expect(typeof resp.trades[0].price).toBe("number");
    expect(typeof resp.trades[0].qty).toBe("number");

    expect(resp.swaps.length).toBe(1);
    expect(typeof resp.swaps[0].counterParty.requisites.lockTime).toBe(
      "number",
    );
    expect(typeof resp.swaps[0].counterParty.requisites.receivingAddress).toBe(
      "string",
    );
    expect(typeof resp.swaps[0].counterParty.requisites.refundAddress).toBe(
      "string",
    );
    expect(typeof resp.swaps[0].counterParty.requisites.rewardForRedeem).toBe(
      "number",
    );
    expect(typeof resp.swaps[0].counterParty.requisites.secretHash).toBe(
      "string",
    );
    expect(typeof resp.swaps[0].counterParty.status).toBe("string");
    expect(typeof resp.swaps[0].counterParty.trades).toBe(typeof resp.trades);
    expect(typeof resp.swaps[0].counterParty.status).toBe("string");
    expect(resp.swaps[0].counterParty.transactions.length).toBe(1);
    expect(typeof resp.swaps[0].counterParty.transactions[0].blockHeight).toBe(
      "number",
    );
    expect(
      typeof resp.swaps[0].counterParty.transactions[0].confirmations,
    ).toBe("number");
    expect(typeof resp.swaps[0].counterParty.transactions[0].currency).toBe(
      "string",
    );
    expect(typeof resp.swaps[0].counterParty.transactions[0].status).toBe(
      "string",
    );
    expect(typeof resp.swaps[0].counterParty.transactions[0].txId).toBe(
      "string",
    );
    expect(typeof resp.swaps[0].counterParty.transactions[0].type).toBe(
      "string",
    );
    expect(typeof resp.swaps[0].id).toBe("number");
    expect(typeof resp.swaps[0].isInitiator).toBe("boolean");
    expect(typeof resp.swaps[0].price).toBe("number");
    expect(typeof resp.swaps[0].qty).toBe("number");
    expect(typeof resp.swaps[0].secret).toBe("string");
    expect(typeof resp.swaps[0].secretHash).toBe("string");
    expect(typeof resp.swaps[0].side).toBe("string");
    expect(typeof resp.swaps[0].symbol).toBe("string");
    expect(typeof resp.swaps[0].timeStamp).toBe("string");
    expect(typeof resp.swaps[0].user).toBe(typeof resp.swaps[0].counterParty);
  });

  test("addOrder", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Orders"].post.responses[200].content["application/json"]
        .schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );
    const data: AddOrderRequest = {
      clientOrderId: "1",
      price: 10,
      proofsOfFunds: [
        {
          address: "string",
          algorithm: "Ed25519",
          currency: "string",
          message: "string",
          publicKey: "string",
          signature: "string",
          timeStamp: 17045455,
        },
      ],
      qty: 100,
      side: "Buy",
      symbol: "XTZ/ETH",
      type: "FillOrKill",
    };
    const resp = await atomex.addOrder(data);
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe("http://localhost/v1/Orders");
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("post");
    
    const body = JSON.parse(mocked(fetch).mock.calls[0][1]?.body?.toString() || "{}");
    expect(body.requisites.baseCurrencyContract).toBe(atomex.getCurrencyConfig("XTZ").contractAddress);

    expect(typeof resp).toBe("number");
  });

  test("cancelOrder", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Orders/{id}"].delete.responses[200].content[
        "application/json"
      ].schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );
    const resp = await atomex.cancelOrder("1", "ETH/BTC", "Buy");
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe(
      "http://localhost/v1/Orders/1?symbol=ETH%2FBTC&side=Buy",
    );
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("delete");

    expect(typeof resp).toBe("boolean");
  });

  test("addSwapRequisites", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Swaps/{id}/requisites"].post.responses[200].content[
        "application/json"
      ].schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );
    const data: SwapRequisites = {
      lockTime: 1000,
      receivingAddress: "string",
      rewardForRedeem: 100,
      refundAddress: "string",
    };
    const resp = await atomex.addSwapRequisites("1", data);
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe(
      "http://localhost/v1/Swaps/1/requisites",
    );
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("post");

    expect(typeof resp).toBe("boolean");
  });
  test("getSwaps", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Swaps"].get.responses[200].content["application/json"]
        .schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );

    const resp = await atomex.getSwaps();
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe("http://localhost/v1/Swaps");
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("get");

    expect(resp.length).toBe(1);
    expect(typeof resp[0].counterParty.requisites.receivingAddress).toBe(
      "string",
    );
    expect(typeof resp[0].counterParty.requisites.refundAddress).toBe("string");
    expect(typeof resp[0].counterParty.requisites.rewardForRedeem).toBe(
      "number",
    );
    expect(typeof resp[0].counterParty.requisites.secretHash).toBe("string");
    expect(typeof resp[0].counterParty.status).toBe("string");

    expect(resp[0].counterParty.trades.length).toBe(1);
    expect(typeof resp[0].counterParty.trades[0].orderId).toBe("number");
    expect(typeof resp[0].counterParty.trades[0].price).toBe("number");
    expect(typeof resp[0].counterParty.trades[0].qty).toBe("number");

    expect(typeof resp[0].counterParty.status).toBe("string");
    expect(resp[0].counterParty.transactions.length).toBe(1);
    expect(typeof resp[0].counterParty.transactions[0].blockHeight).toBe(
      "number",
    );
    expect(typeof resp[0].counterParty.transactions[0].confirmations).toBe(
      "number",
    );
    expect(typeof resp[0].counterParty.transactions[0].currency).toBe("string");
    expect(typeof resp[0].counterParty.transactions[0].status).toBe("string");
    expect(typeof resp[0].counterParty.transactions[0].txId).toBe("string");
    expect(typeof resp[0].counterParty.transactions[0].type).toBe("string");
    expect(typeof resp[0].id).toBe("number");
    expect(typeof resp[0].isInitiator).toBe("boolean");
    expect(typeof resp[0].price).toBe("number");
    expect(typeof resp[0].qty).toBe("number");
    expect(typeof resp[0].secret).toBe("string");
    expect(typeof resp[0].secretHash).toBe("string");
    expect(typeof resp[0].side).toBe("string");
    expect(typeof resp[0].symbol).toBe("string");
    expect(typeof resp[0].timeStamp).toBe("string");
    expect(typeof resp[0].user).toBe(typeof resp[0].counterParty);
  });

  test("getSwap", async () => {
    const atomex = new Atomex("testnet", "http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/Swaps/{id}"].get.responses[200].content[
        "application/json"
      ].schema,
      {},
      spec,
    );
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(res);
          },
        });
      },
    );

    const resp = await atomex.getSwap("12");
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toBe("http://localhost/v1/Swaps/12");
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("get");

    expect(typeof resp.counterParty.requisites.receivingAddress).toBe("string");
    expect(typeof resp.counterParty.requisites.refundAddress).toBe("string");
    expect(typeof resp.counterParty.requisites.rewardForRedeem).toBe("number");
    expect(typeof resp.counterParty.requisites.secretHash).toBe("string");
    expect(typeof resp.counterParty.status).toBe("string");

    expect(resp.counterParty.trades.length).toBe(1);
    expect(typeof resp.counterParty.trades[0].orderId).toBe("number");
    expect(typeof resp.counterParty.trades[0].price).toBe("number");
    expect(typeof resp.counterParty.trades[0].qty).toBe("number");

    expect(typeof resp.counterParty.status).toBe("string");
    expect(resp.counterParty.transactions.length).toBe(1);
    expect(typeof resp.counterParty.transactions[0].blockHeight).toBe("number");
    expect(typeof resp.counterParty.transactions[0].confirmations).toBe(
      "number",
    );
    expect(typeof resp.counterParty.transactions[0].currency).toBe("string");
    expect(typeof resp.counterParty.transactions[0].status).toBe("string");
    expect(typeof resp.counterParty.transactions[0].txId).toBe("string");
    expect(typeof resp.counterParty.transactions[0].type).toBe("string");
    expect(typeof resp.id).toBe("number");
    expect(typeof resp.isInitiator).toBe("boolean");
    expect(typeof resp.price).toBe("number");
    expect(typeof resp.qty).toBe("number");
    expect(typeof resp.secret).toBe("string");
    expect(typeof resp.secretHash).toBe("string");
    expect(typeof resp.side).toBe("string");
    expect(typeof resp.symbol).toBe("string");
    expect(typeof resp.timeStamp).toBe("string");
    expect(typeof resp.user).toBe(typeof resp.counterParty);
  });

  test("getOrderPreview", () => {
    const atomex = new Atomex("testnet", "http://localhost");

    expect(() => atomex.getOrderPreview(orderBook as OrderBook, "Buy", 1000, "Send")).toThrow();
    expect(() => atomex.getOrderPreview(orderBook as OrderBook, "Sell", 1000, "Receive")).toThrow();
    expect(() => atomex.getOrderPreview(orderBook as OrderBook, "Buy", 2001, "Receive")).toThrow();
    expect(() => atomex.getOrderPreview(orderBook as OrderBook, "Sell", 2001, "Send")).toThrow();

    let expectedValue: OrderPreview = {
      amountReceived: 1000,
      amountSent: 357,
      price: 0.357,
    };
    expect(atomex.getOrderPreview(orderBook as OrderBook, "Buy", 1000, "Receive")).toStrictEqual(expectedValue);

    expectedValue = {
      amountReceived: 222,
      amountSent: 2000,
      price: 0.111,
    };
    expect(atomex.getOrderPreview(orderBook as OrderBook, "Sell", 2000, "Send")).toStrictEqual(expectedValue);
  });

  test("formatAmount", () => {
    const atomex = new Atomex("testnet", "http://localost/");

    /**
     * String. Ethereum, tezos
     */
    expect(typeof atomex.formatAmount("320.9433", "ETH")).toBe("number");
    expect(atomex.formatAmount("320.9430111", "ETH")).toBe(320.943);
    expect(atomex.formatAmount("320.9435111", "ETH")).toBe(320.9435);
    expect(atomex.formatAmount("320.9430111", "XTZ")).toBe(320.943);
    expect(atomex.formatAmount("320.9435111", "XTZ")).toBe(320.944);

    /**
     * Float. Ethereum, tezos
     */
    expect(typeof atomex.formatAmount(320.9433, "ETH")).toBe("number");
    expect(atomex.formatAmount(320.9430111, "ETH")).toBe(320.943);
    expect(atomex.formatAmount(320.9435111, "ETH")).toBe(320.9435);
    expect(atomex.formatAmount(320.9430111, "XTZ")).toBe(320.943);
    expect(atomex.formatAmount(320.9435111, "XTZ")).toBe(320.944);
  });

  test("splitSymbol", () => {
    const atomex = new Atomex("testnet", "http://localost/");

    expect(atomex.splitSymbol("XTZ/ETH")).toStrictEqual(["XTZ", "ETH"]);
  });

  test("getCurrencyConfig", () => {
    const atomex = new Atomex("testnet", "http://localost/");

    expect(atomex.getCurrencyConfig("ETH").blockchain).toBe("ethereum");
    expect(atomex.getCurrencyConfig("XTZ").blockchain).toBe("tezos");
  });

  test("getOrderSide", () => {
    const atomex = new Atomex("testnet", "http://localost/");

    expect(atomex.getOrderSide("XTZ/ETH", "ETH", "XTZ")).toBe("Buy");
    expect(atomex.getOrderSide("XTZ/ETH", "XTZ", "ETH")).toBe("Sell");
  });

  test("getMaxOrderSize", () => {
    const atomex = new Atomex("testnet", "http://localost/");

    expect(atomex.getMaxOrderSize(orderBook as OrderBook, "Buy")).toBe(2000);
    expect(atomex.getMaxOrderSize(orderBook as OrderBook, "Sell")).toBe(2000);
  });
});
