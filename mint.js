// mint.js
import { DAppClient } from 'https://cdn.jsdelivr.net/npm/@airgap/beacon-sdk@4.5.1/dist/esm/beacon-sdk.browser.js';

const client = new DAppClient({ name: "Draw to Mint" });
let userAddress = null;

window.addEventListener('load', () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mint");
  const status = document.getElementById("status");

  connectBtn.addEventListener("click", connectWallet);
  mintBtn.addEventListener("click", async () => {
    if (!userAddress) {
      const ok = await connectWallet();
      if (!ok) return;
    }
    alert(`Minting not implemented yet.\nConnected wallet: ${userAddress}`);
  });

  async function connectWallet() {
    try {
      const permissions = await client.requestPermissions({ network: { type: 'ghostnet' } });
      userAddress = permissions.address;
      status.textContent = "Wallet: " + shorten(userAddress);
      return true;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      status.textContent = "❌ Wallet connection failed";
      return false;
    }
  }

  function shorten(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }
});
