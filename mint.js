import { DAppClient } from 'https://cdn.jsdelivr.net/npm/@airgap/beacon-sdk@4.6.0/dist/esm/browser/beacon.min.js';

const client = new DAppClient({ name: "Draw to Mint" });

let userAddress = null;

window.addEventListener('load', () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mint");
  const status = document.getElementById("status");

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

  async function connectWallet() {
    try {
      const permissions = await client.requestPermissions({
        network: { type: 'ghostnet' }
      });
      userAddress = permissions.address;
      status.textContent = `Wallet: ${shortenAddress(userAddress)}`;
      return true;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      status.textContent = "❌ Wallet connection failed";
      return false;
    }
  }

  function shortenAddress(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }
});
