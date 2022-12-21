// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  [deployer] = await ethers.getSigners()
  let NAME = "ETHDaddy"
let SYMBOL = "ETHD"

const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
   const eTHDaddy = await ETHDaddy.deploy(NAME, SYMBOL);
    await eTHDaddy.deployed(); 
    console.log("Deployed smart contract at address: ", eTHDaddy.address)


 // List 6 domains
 const names = ["jack.eth", "john.eth", "henry.eth", "cobalt.eth", "oxygen.eth", "carbon.eth"]
 const costs = [tokens(10), tokens(25), tokens(15), tokens(2.5), tokens(3), tokens(1)]

 for (var i = 0; i < 6; i++) {
   const transaction = await eTHDaddy.connect(deployer).listDomain(names[i], costs[i])
   await transaction.wait()

   console.log(`Listed Domain ${i + 1}: ${names[i]}`)
 }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
