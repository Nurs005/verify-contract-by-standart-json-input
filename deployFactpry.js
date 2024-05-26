const hre = require("hardhat");

async function main() {
    const factory = await hre.ethers.getContractFactory('NFT721Factory');
    const nft721Factory = await factory.deploy();
    console.log("NFT721Factory deployed to:", nft721Factory.target);
}

main();