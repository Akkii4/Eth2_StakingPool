const { expect } = require("chai");

describe("StakingPoolFund", function () {
  let stakingPoolFund;
  let owner;
  let investor1;
  let investor2;

  beforeEach(async () => {
    [owner, investor1, investor2] = await ethers.getSigners();

    const StakingPoolFund = await ethers.getContractFactory("StakingPoolFund");
    stakingPoolFund = await StakingPoolFund.deploy();
    await stakingPoolFund.deployed();
  });

  it("should deploy the contract", async function () {
    expect(stakingPoolFund.address).to.not.be.null;
  });

  it("should allow investors to invest during investment period", async function () {
    await stakingPoolFund
      .connect(investor1)
      .invest({ value: ethers.utils.parseEther("1") });

    const balance = await stakingPoolFund.accountBalances(investor1.address);
    expect(balance).to.equal(ethers.utils.parseEther("1"));
  });

  it("should not allow investors to invest after investment period", async function () {
    await network.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]); // Move 8 days in the future
    await network.provider.send("evm_mine"); // Mine a new block to update the current block timestamp

    await expect(
      stakingPoolFund
        .connect(investor1)
        .invest({ value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("Sorry, the deadline has passed");
  });

  it("should not allow non-investors to claim change", async function () {
    await stakingPoolFund.finalize();

    await expect(
      stakingPoolFund.connect(owner).claimChange()
    ).to.be.revertedWith("Not an investor");
  });

  it("should allow investors to claim change after finalization", async function () {
    await stakingPoolFund
      .connect(investor1)
      .invest({ value: ethers.utils.parseEther("1") });
    await stakingPoolFund.finalize();

    const balanceBefore = await ethers.provider.getBalance(investor1.address);
    await stakingPoolFund.connect(investor1).claimChange();
    const balanceAfter = await ethers.provider.getBalance(investor1.address);

    expect(balanceAfter.sub(balanceBefore)).to.equal(
      ethers.utils.parseEther("0.03125")
    );
  });

  it("should not allow owner to deposit before finalization", async function () {
    await expect(
      stakingPoolFund
        .connect(owner)
        .deposit(
          "0x1234567890123456789012345678901234567890123456789012345678901234",
          "passphrase",
          "authorization",
          "0x1234567890123456789012345678901234567890123456789012345678901234"
        )
    ).to.be.revertedWith("Too early");
  });

  it("should allow owner to deposit after finalization", async function () {
    await stakingPoolFund
      .connect(investor1)
      .invest({ value: ethers.utils.parseEther("32") });
    await stakingPoolFund.finalize();

    await stakingPoolFund
      .connect(owner)
      .deposit(
        "0x1234567890123456789012345678901234567890123456789012345678901234",
        "passphrase",
        "authorization",
        "0x1234567890123456789012345678901234567890123456789012345678901234"
      );

    const usedPublicKey = await stakingPoolFund.usedPublicKeys(
      "0x1234567890123456789012345678901234567890123456789012345678901234"
    );
    expect(usedPublicKey).to.be.true;
  });
});
