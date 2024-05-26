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
        const data = await fs.readFile('./script/solinput.json', 'utf8');

        const isVerified = await instance.isVerified("0x0f9E3cd3cDDf2F0A8C5008cf2A92A71396620a7B");
        if (!isVerified) {
            const { message: guid } = await instance.verify(
                "0x0f9E3cd3cDDf2F0A8C5008cf2A92A71396620a7B", // Contract address
                data, // Contract source code
                "contracts/premult.sol:PremintMult", // Contract name
                "v0.8.20+commit.a1b79de6", // Compiler version
                "00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000b973bfdc9597f249fd34f695f397857ae0d2b04a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000b973bfdc9597f249fd34f695f397857ae0d2b04a00000000000000000000000000000000000000000000000000000000000000b568747470733a2f2f76696f6c65742d62726f61642d73776966742d3238352e6d7970696e6174612e636c6f75642f697066732f516d636665593536337264416b646a385a325871346a69595844664835714744667468665a484e326e6e654d78793f70696e61746147617465776179546f6b656e3d5a4c526b64695f354270744e7a413057506e384553445f6b51724b4658313365334c34744168684c75466551556e3033615f447a67464c7435513747776e4557000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000" // Encoded constructor arguments
            );

            await sleep(1000);
            const verificationStatus = await instance.getVerificationStatus(guid);

            if (verificationStatus.isSuccess()) {
                const contractURL = instance.getContractUrl("0x0f9E3cd3cDDf2F0A8C5008cf2A92A71396620a7B");
                console.log(`Successfully verified contract "MyContract" on Etherscan: ${contractURL}`);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

verify();
