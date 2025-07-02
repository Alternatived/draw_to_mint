window.addEventListener('load', () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mint");
  const status = document.getElementById("status");

  let wallet;
  let userAddress = null;

  async function connectWallet() {
    try {
      if (!wallet) {
        wallet = new window.beacon.BeaconWallet({
          name: "Draw to Mint",
          preferredNetwork: "ghostnet",
        });
      }
      await wallet.requestPermissions({ network: { type: "ghostnet" } });
      userAddress = await wallet.getPKH();
      status.innerText = "Wallet: " + shortenAddress(userAddress);
      return true;
    } catch (err) {
      console.error("Wallet connect failed:", err);
      status.innerText = "❌ Wallet connection failed";
      return false;
    }
  }

  connectBtn.addEventListener("click", async () => {
    await connectWallet();
  });

  mintBtn.addEventListener("click", async () => {
    if (!userAddress) {
      const connected = await connectWallet();
      if (!connected) return;
    }
    alert(`Minting not implemented yet.\nConnected wallet: ${userAddress}`);
  });

  function shortenAddress(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }
});
