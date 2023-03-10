const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("BankAccount", function () {
  async function deployBankAccount() {
    const [addr0, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const BankAccount = await ethers.getContractFactory("BankAccount");
    const bankAccount = await BankAccount.deploy();

    return { bankAccount, addr0, addr1, addr2, addr3, addr4 };
  }

  describe("Deployment", () => {
    it("SHOULD DEPLOY WITHOUT ERROR", async () => {
      await loadFixture(deployBankAccount);
    });
  });

  describe("Creating an account", () => {
    it("should allow creating a single user account", async () => {
      const { bankAccount, addr0 } = await loadFixture(deployBankAccount);
      await bankAccount.connect(addr0).createAccount([]);
      const accounts = await bankAccount.connect(addr0).getAccounts();
      expect(accounts.length).to.equal(1);
    });
  });

  it("should allow creating a double user account", async () => {
    const { bankAccount, addr0, addr1 } = await loadFixture(deployBankAccount);
    await bankAccount.connect(addr0).createAccount([addr1.address]);

    const accounts1 = await bankAccount.connect(addr0).getAccounts();
    expect(accounts1.length).to.equal(1);

    const accounts2 = await bankAccount.connect(addr1).getAccounts();
    expect(accounts2.length).to.equal(1);
  });

  it("should allow creating a triple user account", async () => {
    const { bankAccount, addr0, addr1, addr2 } = await loadFixture(
      deployBankAccount
    );
    await bankAccount
      .connect(addr0)
      .createAccount([addr1.address, addr2.address]);

    const accounts1 = await bankAccount.connect(addr0).getAccounts();

    expect(accounts1.length).to.equal(1);

    const accounts2 = await bankAccount.connect(addr1).getAccounts();
    expect(accounts2.length).to.equal(1);

    const accounts3 = await bankAccount.connect(addr2).getAccounts();
    expect(accounts3.length).to.equal(1);
  });

  it(" not should allow creating a duplicate user account", async () => {
    const { bankAccount, addr0 } = await loadFixture(deployBankAccount);
    await bankAccount.connect(addr0).createAccount([addr0.address]);
    await expect(bankAccount.connect(addr0).createAccount([addr0.address])).to
      .be.reverted;
  });

  // it("should allow creating a quad user account", async () => {
  //   const { bankAccount, addr0, addr1, addr2, addr3 } = await loadFixture(
  //     deployBankAccount
  //   );
  //   await bankAccount
  //     .connect(addr0)
  //     .createAccount([addr1.address, addr2.address, addr3.address]);

  //   const accounts1 = await bankAccount.connect(addr0).getAccounts();

  //   expect(accounts1.length).to.equal(1);

  //   const accounts2 = await bankAccount.connect(addr1).getAccounts();
  //   expect(accounts2.length).to.equal(1);

  //   const accounts3 = await bankAccount.connect(addr2).getAccounts();
  //   expect(accounts3.length).to.equal(1);

  //   const accounts4 = await bankAccount.connect(addr3).getAccounts();
  //   expect(accounts4.length).to.equal(1);
  // });
});
