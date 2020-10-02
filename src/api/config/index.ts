import { Config } from "./type";

const config: Config = {
  basePath: "https://api.test.atomex.me/",
  version: "v1",
};

export const getBasePath = () => {
  return config.basePath + config.version;
};
