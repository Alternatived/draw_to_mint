const { BeaconWallet } = beacon;

let wallet;
let userAddress = null;

async function connectWallet() {
  if (!wallet) {
    wallet = new BeaconWallet({ name: "Draw to Mint" });
  }

  try {
    await wallet.requestPermissions({ network: { type: "ghostnet" } });
    userAddress = await wallet.getPKH();
    document.getElementById("wallet-status").innerText = "Wallet: " + userAddress;
    return userAddress;
  } catch (err) {
    alert("Wallet connection failed.");
    console.error(err);
    return null;
  }
}

async function mint() {
  if (!userAddress) {
    await connectWallet();
    if (!userAddress) return;
  }

  // Placeholder logic
  alert("Minting not implemented yet.\nWallet: " + userAddress);

  // Later: implement mint transaction via smart contract
}
