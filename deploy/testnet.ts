import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  const diamond = await deploy("Diamond", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 6,
  });
};

export default func;
func.tags = ["all"];
