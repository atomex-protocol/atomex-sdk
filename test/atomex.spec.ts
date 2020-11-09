import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";
import spec from "./swagger.json";
const OpenAPISampler = require("openapi-sampler");
import { Atomex } from "../src/atomex";
import { AuthTokenRequest, AuthTokenResponse } from "../src/types";

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
        spec.paths["/v1/Token"].post.requestBody.content["application/json"].schema,
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
      spec.paths["/v1/Token"].post.responses[200].content["application/json"].schema,
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
    expect(mocked(fetch).mock.calls[0][1]?.headers).toHaveProperty("Content-Type");
    expect(mocked(fetch).mock.calls[0][1]?.body).toBeDefined();

    expect(typeof resp.expires).toBe("number");
    expect(typeof resp.id).toBe("string");
    expect(typeof resp.token).toBe("string");
  });

  test("getQuotes", async () => {
    const atomex = new Atomex("http://localhost", "");

    const res = OpenAPISampler.sample(
      spec.paths["/v1/MarketData/quotes"].get.responses[200].content["application/json"].schema,
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
    expect(mocked(fetch).mock.calls[0][0]).toBe("http://localhost/v1/MarketData/quotes?symbols=XTZ%2FETH");
    expect(mocked(fetch).mock.calls[0][1]?.method).toBe("get");
    
    expect(resp.length).toBe(1);
    expect(typeof resp[0].symbol).toBe("string");
    expect(typeof resp[0].timeStamp).toBe("number");
    expect(typeof resp[0].bid).toBe("number");
    expect(typeof resp[0].ask).toBe("number");
  });
});
