import { Etherscan } from "@nomicfoundation/hardhat-verify/etherscan.js";
import fs from "fs/promises";

// Создание экземпляра Etherscan
const instance = new Etherscan(
    "2SR4266HTRN62E8WN58RWH8R1YH22R4ZM2", // Etherscan API key
    "https://api-testnet.bscscan.com/api", // Etherscan API URL
    "https://testnet.bscscan.com" // Etherscan browser URL
);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const verify = async () => {
    try {
        console.log('Reading contract data...');
        const data = await fs.readFile('./script/solinput721.json', 'utf8');
        console.log('Contract data read successfully.');

        console.log('Checking if contract is already verified...');
        const isVerified = await instance.isVerified("0x912b8F1D7c3F7A12bBc044b0Fa531FD89AB0267A");
        console.log(`Contract is verified: ${isVerified}`);
        if (!isVerified) {
            console.log('Verifying contract...');
            const { message: guid } = await instance.verify(
                "0x912b8F1D7c3F7A12bBc044b0Fa531FD89AB0267A", // Contract address
                data, // Contract source code
                "contracts/premint721.sol:Premint721", // Contract name
                "v0.8.20+commit.a1b79de6", // Compiler version
                //constrArgs in abi encoded format
                "000000000000000000000000b973bfdc9597f249fd34f695f397857ae0d2b04a00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000b973bfdc9597f249fd34f695f397857ae0d2b04a00000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000006436f6e73747200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003626f6c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004368747470733a2f2f697066732e696f2f697066732f516d587357353164796e74656b625539556242424a444277623851746750414d765743566b42346534504432666b0000000000000000000000000000000000000000000000000000000000" // Encoded constructor arguments
            );
            console.log(`Verification GUID: ${guid}`);
            console.log('Sleeping for a second to wait for verification...');
            await sleep(1000);
            console.log('Checking verification status...');
            const verificationStatus = await instance.getVerificationStatus(guid);
            console.log(`Verification status: ${verificationStatus}`);
            if (verificationStatus.isSuccess()) {
                const contractURL = instance.getContractUrl("0x912b8F1D7c3F7A12bBc044b0Fa531FD89AB0267A");
                console.log(`Successfully verified contract "MyContract" on Etherscan: ${contractURL}`);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

verify().then(() => {
    console.log('Verification process completed.');
}).catch(err => {
    console.error('Error in verification process:', err);
});
