async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const StakingPoolFund = await ethers.getContractFactory("StakingPoolFund");
  const stakingPoolFund = await StakingPoolFund.deploy();

  console.log("StakingPoolFund address:", stakingPoolFund.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
