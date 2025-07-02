const { BeaconWallet } = beacon;

let wallet;
let userAddress = null;

window.addEventListener('load', () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mint");
  const status = document.getElementById("status");

  connectBtn.addEventListener("click", connectWallet);
  mintBtn.addEventListener("click", mint);

  async function connectWallet() {
    if (!wallet) {
      wallet = new BeaconWallet({
        name: "Draw to Mint",
        preferredNetwork: "ghostnet" // or "mainnet" later
      });
    }

    try {
      await wallet.requestPermissions({ network: { type: "ghostnet" } });
      userAddress = await wallet.getPKH();
      status.innerText = "Wallet: " + shorten(userAddress);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      status.innerText = "❌ Wallet connection failed";
    }
  }

  async function mint() {
    if (!userAddress) {
      await connectWallet();
      if (!userAddress) return;
    }

    // 🚧 Placeholder: Add mint contract logic here
    alert("Minting not implemented yet.\nWallet: " + userAddress);
  }

  function shorten(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }
});
