window.addEventListener('load', () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mint");
  const status = document.getElementById("status");

  let wallet;
  let userAddress = null;

  async function connectWallet() {
    try {
      if (!wallet) {
        // Use the BeaconWallet from the loaded Beacon SDK
        wallet = new window.Beacon.BeaconWallet({
          name: "Draw to Mint",
          preferredNetwork: "ghostnet",
        });
      }

      // Request permissions (this triggers wallet popup)
      await wallet.requestPermissions({ network: { type: "ghostnet" } });

      // Get user address (PKH)
      userAddress = await wallet.getPKH();
      status.textContent = "Wallet: " + shortenAddress(userAddress);

      return true;
    } catch (err) {
      console.error("Wallet connect failed:", err);
      status.textContent = "❌ Wallet connection failed: " + (err.message || err);
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
