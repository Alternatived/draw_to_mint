// Beacon SDK setup for Tezos wallet connection
const { DAppClient } = window.beaconSdk;

const client = new DAppClient({ name: "Draw to Mint" });

let userAddress = null;

// Change this to your deployed FA2 contract address when ready
const contractAddress = "KT1YourContractAddressHere";

async function connectWallet() {
  try {
    const permissions = await client.requestPermissions();
    userAddress = permissions.address;
    updateWalletStatus(`Wallet: ${userAddress}`);
  } catch (err) {
    updateWalletStatus("Wallet: Connection failed");
    console.error(err);
  }
}

async function mintNFT() {
  if (!userAddress) {
    alert("Please connect your wallet first.");
    return;
  }

  // Get current canvas image as base64 PNG data URL
  const imageDataUrl = exportPNGDataURL();

  // Prepare on-chain metadata:
  // For on-chain art, we'll store the base64 PNG as a string in metadata
  // Real on-chain might use IPFS or direct storage in contract (if supported)
  const metadata = {
    name: "Draw to Mint Art",
    description: "A fully on-chain pixel art minted on Tezos.",
    artifactUri: imageDataUrl,
    creators: [userAddress],
  };

  // We assume your FA2 contract has an entrypoint "mint" that accepts:
  // - to_: address (recipient)
  // - metadata: map string bytes (token metadata)
  // Adjust the parameters below as per your contract!

  const mintParams = {
    to_: userAddress,
    metadata: metadataToMichelson(metadata),
  };

  try {
    updateWalletStatus("Minting in progress...");
    const op = await client.requestOperation({
      operationDetails: [
        {
          kind: "transaction",
          destination: contractAddress,
          amount: 0,
          parameters: {
            entrypoint: "mint",
            value: mintParams,
          },
        },
      ],
    });
    await op.confirmation();
    updateWalletStatus("Mint successful! 🎉");
  } catch (err) {
    updateWalletStatus("Mint failed.");
    console.error(err);
  }
}

function updateWalletStatus(text) {
  const status = document.getElementById("wallet-status");
  status.textContent = text;
}

function metadataToMichelson(metadata) {
  // Convert JS object to Michelson map of string to bytes for contract call
  // This is simplified for demo — real contracts may expect packed data
  // We encode strings as hex bytes

  const michelsonMap = [];

  for (const key in metadata) {
    let value = metadata[key];
    if (typeof value === "string") {
      // Convert string to hex bytes (without 0x)
      const hex = Buffer.from(value).toString("hex");
      michelsonMap.push({
        prim: "Elt",
        args: [
          { string: key },
          { bytes: hex },
        ],
      });
    } else if (Array.isArray(value)) {
      // For creators array, join as comma separated string
      const joined = value.join(",");
      const hex = Buffer.from(joined).toString("hex");
      michelsonMap.push({
        prim: "Elt",
        args: [
          { string: key },
          { bytes: hex },
        ],
      });
    }
  }
  return { prim: "Map", args: [michelsonMap] };
}

// Setup event listeners
document.getElementById("mint").addEventListener("click", mintNFT);

// Connect wallet on page load
connectWallet();
