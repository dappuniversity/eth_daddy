const { expect } = require("chai")
const { ethers } = require("hardhat")

// a function to convert ETH to WEI
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHDaddy", () => {
  let eTHDaddy // cannot name it to const as we need to declare the value while declaring const variables
let NAME = "ETHDaddy"
let SYMBOL = "ETHD"

  beforeEach(async function(){
    // let deployer, owner1;
    [deployer, NFTowner1] = await ethers.getSigners() // contains an array of 20 objects for 20 different accounts
    
    const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
    eTHDaddy = await ETHDaddy.deploy(NAME, SYMBOL);
    await eTHDaddy.deployed(); 
    const transaction = await eTHDaddy.connect(deployer).listDomain("uday.eth", tokens(10))
    // here deployer will be the owner of the smart contract
    await transaction.wait()
  })
  describe("Deployment", async function(){
    it('it has a name', async function(){
      expect(await eTHDaddy.name()).to.equal(NAME)
    })
  
    it("it has a symbol", async function(){
      expect(await eTHDaddy.symbol()).to.equal(SYMBOL)
  
    })

    it("checks the owner", async function(){
      expect(await eTHDaddy.owner()).to.equal(deployer.address)
    })

    it("checking max supply after deploying the contract", async function(){
      expect(await eTHDaddy.maxSupply()).to.equal(1)
      // 1 because we have made a transaction to this function in beforeEach hook
    })

    it("checking total supply after deploying the contract", async function(){
      expect(await eTHDaddy.totalSupply()).to.equal(0)
      // 0 because we have not minted any NFT yet
    })

  })

  describe("Domain", async function(){
    it("returns domains attributes", async function(){
      let domain = await eTHDaddy.getDomain(0) // this case does not work without using "domain" variable
      expect(await domain.name).to.equal("uday.eth") // this works with "to.be" also
      expect(await domain.cost).to.equal(tokens(10))
      // actually this is passed in as "10000000000000000000" WEI and not 10000000000000000000 WEI
      expect(await domain.isOwned).to.equal(false)
    })
  })

  describe("Minting", async function(){
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits('10', 'ether')
    beforeEach(async function(){
      const txn = await eTHDaddy.connect(NFTowner1).mint(ID, {value: AMOUNT})
      await txn.wait()
    })
    it("updates the owner", async function(){
      // ID = 1, because we are buying the first domain name we listed using "await eTHDaddy.connect(deployer).listDomain("uday.eth", tokens(10))"
      expect(NFTowner1.address).to.equal(await eTHDaddy.ownerOf(ID))
      // ownerOf(ID) is a function of ERC721 contract which returns the address of account who called that safeMint function for that ID.
    })

    it("updates domain status", async function() {
      const domain = await eTHDaddy.getDomain(ID) 
      expect(domain.isOwned).to.equal(true)
    })

    it("updates contract balance", async function() {
        expect(await eTHDaddy.getBalance()).to.equal(AMOUNT)
    })

    it("updating total supply after minting the NFT", async function(){
      expect(await eTHDaddy.totalSupply()).to.equal(1)
      // 1 because we have minted 1 NFT now
    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    console.log("AMOUNT", AMOUNT)
    let balanceBefore

    beforeEach(async () => {
    balanceBefore = await ethers.provider.getBalance(deployer.address) // balance of smart contract's owner before withdrawal

    // minting token ID 1 by NFTowner1
    let transaction = await eTHDaddy.connect(NFTowner1).mint(ID, { value: AMOUNT })
    await transaction.wait()

    transaction = await eTHDaddy.connect(deployer).withdraw()
    await transaction.wait()
    })

    it('updates the owner balance', async () => {
    const balanceAfter = await ethers.provider.getBalance(deployer.address)
    console.log("Balance Before: ",balanceBefore)
    console.log("Balance After: ",balanceAfter)
    expect(balanceAfter).to.greaterThan(balanceBefore)
    })

    it('updates the contract balance', async () => {
    const result = await eTHDaddy.getBalance()
    expect(result).to.equal(0)
    })
    })
})
