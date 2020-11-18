import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";
import { OrderPreview } from "../lib/types";
import { Atomex } from "../src/atomex";
import { AuthTokenRequest, AuthTokenResponse, OrderBook } from "../src/types";
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
    const atomex = new Atomex("http://localhost", "");

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
    const atomex = new Atomex("http://localhost", "");

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

  test("getOrderSize", () => {
    const atomex = new Atomex("http://localhost");
    const amount = 1000,
      price = 0.01;
    let res = atomex.getOrderSize(1000, 0.01, "Buy", "Send");
    let expectedRes = {
      orderSize: amount / price,
      amountExpected: amount / price,
    };
    expect(res).toStrictEqual(expectedRes);
    res = atomex.getOrderSize(1000, 0.01, "Sell", "Receive");
    expect(res).toStrictEqual(expectedRes);

    res = atomex.getOrderSize(1000, 0.01, "Buy", "Receive");
    expectedRes = {
      orderSize: amount,
      amountExpected: amount * price,
    };
    expect(res).toStrictEqual(expectedRes);
    res = atomex.getOrderSize(1000, 0.01, "Sell", "Send");
    expect(res).toStrictEqual(expectedRes);
  });

  test("getOrderPreview", () => {
    const atomex = new Atomex("http://localhost");

    try {
      // should throw error as 1:1 match not found
      atomex.getOrderPreview(orderBook as OrderBook, "Buy", 1000, "Send");
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe("No matching entry found");
    }
    // finds least matching entry
    let orderPreview = atomex.getOrderPreview(
      orderBook as OrderBook,
      "Buy",
      1000,
      "Receive",
    );
    let expectedValue: OrderPreview = {
      amountReceived: 1000,
      amountSent: 1,
      price: 0.001,
    };
    expect(orderPreview).toStrictEqual(expectedValue);

    // finds max matching entry
    orderPreview = atomex.getOrderPreview(
      orderBook as OrderBook,
      "Sell",
      1500,
      "Send",
    );
    expectedValue = {
      amountReceived: 166.5,
      amountSent: 1500,
      price: 0.111,
    };
    expect(orderPreview).toStrictEqual(expectedValue);
  });
});
