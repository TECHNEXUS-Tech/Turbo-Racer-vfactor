# 🔒 Security Policy — TURBO RACER (V-FACTOR STUDIOS)

## 10/10 Serverless Security Architecture (`VF.SecurityManager`)

**Turbo Racer** implements a multi-layered client and peer-to-peer security architecture engineered by **Vinay (`@_the_v_factor_`)**:

1. **WebCrypto Hardware Key Enclave (`window.crypto.subtle`):**
   * Generates non-exportable **ECDH (`P-256`)** and **ECDSA (`P-256`)** session keypairs on boot.
2. **Signed P2P Multiplayer Telemetry (`FNV-1a` + Nonce Window):**
   * Every packet transmitted over `BroadcastChannel` or `PeerJS WebRTC` is signed with room context, sender peer ID, timestamp, and a monotonically increasing nonce.
   * Replay attacks are rejected via a sliding 64-nonce window per peer.
3. **Peer Rate-Limiting & Physics Sanity Bounds:**
   * Enforces a maximum of `65 packets/sec` per peer and clamps all incoming `(x, y, z, tilt, hull)` telemetry coordinates to valid tunnel boundaries (`r <= 14.0m`), rejecting velocity teleportation anomalies.
4. **Immutable Fleet & Theme Vaults (`Object.freeze` + ES6 `Proxy`):**
   * All 32 spacecraft specifications (`VF.ROCKET_FLEET`) and 11 color-fusion themes (`VF.THEMES`) are deep-frozen and wrapped in anti-tamper `Proxy` traps connected to the in-game Settings diagnostic LED (`Working` / `Fault`).
5. **Strict Content-Security-Policy (CSP) & DOM Guard:**
   * Restricts script execution to trusted origins and actively monitors the DOM via `MutationObserver` to block unauthorized script/iframe injection.

## Reporting a Vulnerability
If you discover a security issue, please open an issue or contact **Vinay (`TECHNEXUS-Tech`)** directly via GitHub.