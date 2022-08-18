import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";

dotenv.config();

const { PRIVATE_KEY, BSC_URL, PRIVATE_KEY_2 } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    bsctestnet: {
      url: BSC_URL ? BSC_URL : "",
      chainId: 97,
      accounts:
        PRIVATE_KEY && PRIVATE_KEY_2 !== undefined
          ? [PRIVATE_KEY, PRIVATE_KEY_2]
          : [],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.ETHERSCAN_API_KEY
        ? process.env.ETHERSCAN_API_KEY
        : "",
    },
  },
};

export default config;
