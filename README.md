# Draw to Mint

Simple 8x8 pixel art editor with on-chain minting on Tezos.

---

## How to use

- Open `index.html` in a modern browser.
- Draw pixel art using the palette.
- Undo/Redo and Clear buttons available.
- Connects automatically to your Tezos wallet (Beacon compatible).
- Click **Mint This Frame** to mint your current pixel art on-chain.

---

## Setup & Deployment

1. **Create a GitHub Repository**

- Go to [GitHub](https://github.com) and create a new repository.
- Name it e.g. `draw-to-mint`.
- Choose **Public** or **Private** (public is recommended for GitHub Pages).

2. **Upload the project files**

- Upload `index.html`, `style.css`, `sketch.js`, `mint.js`, `README.md`.
- Commit changes.

3. **Enable GitHub Pages**

- Go to your repository **Settings > Pages**.
- Under **Source**, select `main` branch and `/root` folder.
- Save.

4. **Access your site**

- Visit `https://<your-username>.github.io/draw-to-mint/`

---

## Notes

- Replace the contract address in `mint.js` with your FA2 contract address.
- Your smart contract must support minting with the `mint` entrypoint.
- Minted art metadata is stored on-chain as base64 PNG data URI.
- This is a minimal example to build upon and improve.

---

## License

MIT License. Free to use and modify.

---

## Credits

Built by Natived Laboratory & ChatGPT.
