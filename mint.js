// mint.js
window.addEventListener('load', () => {
  // Grab buttons and status element
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mint");
  const status = document.getElementById("status");

  // BeaconWallet instance and user address
  let wallet;
  let userAddress = null;

  // Connect wallet on click
  connectBtn.addEventListener("click", async () => {
    try {
      if (!wallet) {
        wallet = new window.beacon.BeaconWallet({
          name: "Draw to Mint",
          preferredNetwork: "ghostnet", // Use 'mainnet' when ready for production
        });
      }
      // Request permissions — must be called inside click event for popup
      await wallet.requestPermissions({ network: { type: "ghostnet" } });
      userAddress = await wallet.getPKH();
      status.innerText = "Wallet: " + shortenAddress(userAddress);
    } catch (err) {
      console.error("Wallet connect failed:", err);
      status.innerText = "❌ Wallet connection failed";
    }
  });

  // Mint button click handler (placeholder)
  mintBtn.addEventListener("click", async () => {
    if (!userAddress) {
      // Try to connect wallet first
      await connectBtn.click();
      if (!userAddress) return;
    }
    alert(`Minting not implemented yet.\nConnected wallet: ${userAddress}`);
  });

  // Helper to shorten the address for UI
  function shortenAddress(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }
});
