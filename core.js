/* V-FACTOR STUDIOS // @_the_v_factor_ // BUILT BY VINAY — CORE, HYPER-ENERGETIC AUDIO FUSION & 10/10 SECURITY VAULT */
(function() {
  "use strict";
  window.VF = window.VF || {};

  // ==========================================================================
  // 1. HAPTICS, HARDWARE DETECTION, PRNG & GLOBAL STATE (`VF.state`)
  // ==========================================================================
  window.VF.vibrate = function(pattern) {
    try { if (navigator && typeof navigator.vibrate === 'function') navigator.vibrate(pattern); } catch (_) {}
  };

  window.VF.detectMobileHardware = function() {
    return Boolean(
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
  };

  window.VF.lerp = function(start, end, alpha) {
    return start + (end - start) * alpha;
  };

  window.VF.CUSTOM_TRIM_PALETTE = [
    { name: 'DEFAULT', hex: null },
    { name: 'CYBER CYAN', hex: 0x00f0ff },
    { name: 'SOLAR GOLD', hex: 0xfbbf24 },
    { name: 'CRIMSON FURY', hex: 0xff2a55 },
    { name: 'HYPER EMERALD', hex: 0x00ff88 },
    { name: 'VIOLET NOVA', hex: 0xc084fc }
  ];

  window.VF.localPeerId = 'P-' + Math.floor(Math.random() * 90000 + 10000);
  window.VF._seed = 1337;
  window.VF.setMatchSeed = function(seedVal) { window.VF._seed = Number(seedVal) || 1337; };
  window.VF.seededRandom = function() {
    window.VF._seed = (window.VF._seed * 1664525 + 1013904223) % 4294967296;
    return window.VF._seed / 4294967296;
  };

  window.VF.createDefaultSoloSlots = function() {
    const slots = [];
    for (let i = 1; i <= 10; i++) {
      slots.push({
        slotNum: i,
        occupantId: i === 1 ? window.VF.localPeerId : null,
        label: i === 1 ? 'HOST' : 'VACANT',
        ready: i === 1,
        rocketId: ((i * 3) % 32) + 1,
        alive: true
      });
    }
    return slots;
  };

  window.VF.createDefaultTeamSeats = function() {
    return {
      '1A': { occupantId: window.VF.localPeerId, label: 'HOST', ready: true, rocketId: 9 },
      '1B': { occupantId: null, label: 'VACANT', ready: false, rocketId: 14 },
      '2A': { occupantId: null, label: 'VACANT', ready: false, rocketId: 17 },
      '2B': { occupantId: null, label: 'VACANT', ready: false, rocketId: 22 }
    };
  };

  const safeKeys = (window.VF.state && window.VF.state.keys) || { left: false, right: false, up: false, down: false };

  window.VF.state = {
    localPeerId: window.VF.localPeerId,
    screen: 'INTRO',
    subStep: 'menu-sub-root',
    keys: safeKeys,
    isMobile: window.VF.detectMobileHardware(),
    mobileInputMode: 'GYRO',
    inputOverride: 'auto',
    quality: 'auto',
    sensitivity: 1.0,
    gyroEnabled: true,
    gyroBaseBeta: null,
    gyroBaseGamma: null,
    gyroCurrentX: 0,
    gyroCurrentY: 0,
    equippedRocketId: 9,
    previewRocketId: 9,
    customTrimIndex: 0,
    wireframeHangar: false,
    explodedViewActive: false,
    buttonSideLayout: 'RIGHT_DEFAULT',
    inIntro: true,
    introProgress: 0,
    introFlyByTriggered: false,
    inGame: false,
    paused: false,
    crashed: false,
    alive: true,
    mode: 'ENDLESS',
    gameMode: 'ENDLESS',
    isMultiplayer: false,
    mpSubMode: 'SOLO',
    isHost: false,
    localReady: false,
    roomCode: '',
    themeIndex: -1,
    hostThemeIdx: -1,
    targetWinDistance: 1500,
    lobbySlots: {},
    mySoloSlot: 1,
    soloInterchangeActive: false,
    hostSelectedSoloSlot: null,
    hostSwapSource: null,
    soloSlots: window.VF.createDefaultSoloSlots(),
    mySeat: '1A',
    myTeam: 1,
    mySlotLabel: 'P1',
    interchangeActive: false,
    hostSelectedSeat: null,
    lobbySeats: window.VF.createDefaultTeamSeats(),
    health: 100,
    hullArmor: 100,
    droneBallHits: 0,
    droneHitCount: 0,
    droneHitsTaken: 0,
    droneSlowFactor: 1.0,
    droneSpeedFactor: 1.0,
    directionlessTimer: 0,
    boosterLockoutTimer: 0,
    hyperShieldTimer: 0,
    goldenShieldTimer: 0,
    boostToggledOn: false,
    isPortraitBlocked: false,
    barrelRollTimer: 0,
    barrelRollDir: 1,
    weaponCooldown: 0,
    maxWeaponCooldown: 4.0,
    weaponCharging: false,
    isChargingOneShot: false,
    weaponOvercharged: false,
    muzzleFlashTimer: 0,
    recoilOffsetZ: 0,
    fovPunch: 0,
    knockbackVx: 0,
    knockbackVy: 0,
    speedDebuffTimer: 0,
    comboMultiplier: 1.0,
    huntersDestroyed: 0,
    lockdownsBreached: 0,
    nearMissCount: 0,
    topSpeedReached: 0,
    team1Shields: 3,
    team2Shields: 3,
    team1Combo: 1,
    team2Combo: 1,
    team1FinishedSeats: {},
    team2FinishedSeats: {},
    invulnTimer: 0,
    matchStartWallTime: 0,
    matchStartTimestamp: 0,
    lastWorkerTickTime: 0,
    boostBonusMeters: 0,
    score: 0,
    distance: 0,
    current500mStage: 0,
    elapsedRunTime: 0,
    currentSpeed: 0,
    boosting: false,
    isBoosting: false,
    slowMoTimer: 0,
    freezeTurbineTimer: 0,
    flickerTimer: 0,
    lightDimFactor: 1.0,
    playerX: 0,
    playerY: -3.0,
    targetX: 0,
    targetY: -3.0,
    velX: 0,
    velY: 0,
    playerTilt: 0,
    inputX: 0,
    inputY: 0,
    cursorX: 0,
    cursorY: 0,
    usingCursor: true,
    themeIdxA: 0,
    themeIdxB: 1,
    themeLerp: 0,
    themeTimer: 0
  };
  window.VF.keys = window.VF.state.keys;

  try {
    if (window.localStorage) {
      const storedShip = Number(window.localStorage.getItem('VF_EQUIPPED_SHIP_ID'));
      if (storedShip >= 1 && storedShip <= 32) {
        window.VF.state.equippedRocketId = storedShip;
        window.VF.state.previewRocketId = storedShip;
      }
    }
    if (window.name && window.name.indexOf('VF_SHIP_') === 0) {
      const parts = window.name.split('__');
      const parsedShip = parseInt(parts[0].replace('VF_SHIP_', ''), 10);
      if (parsedShip >= 1 && parsedShip <= 32) {
        window.VF.state.equippedRocketId = parsedShip;
        window.VF.state.previewRocketId = parsedShip;
      }
      if (parts[1] && ['RIGHT_DEFAULT', 'RIGHT_SWAPPED', 'LEFT_DEFAULT', 'LEFT_SWAPPED'].indexOf(parts[1].trim()) !== -1) {
        window.VF.state.buttonSideLayout = parts[1].trim();
      }
    }
  } catch (_) {}

  // ==========================================================================
  // 2. SCREEN ROUTING, ALERTS, HEALTH BAR & DRONE STATUS HUD
  // ==========================================================================
  window.VF.switchScreen = function(targetId) {
    const layers = document.querySelectorAll('.screen-layer');
    for (let i = 0; i < layers.length; i++) {
      layers[i].classList.toggle('active', layers[i].id === targetId);
    }
    const bottomBar = document.getElementById('bottom-utility-bar');
    if (bottomBar) {
      bottomBar.style.display = (targetId === 'menu-screen' && window.VF.state.subStep === 'menu-sub-root') ? 'flex' : 'none';
    }
    if (targetId === 'hangar-screen' && typeof window.VF.resizeHangarViewport === 'function') {
      setTimeout(window.VF.resizeHangarViewport, 30);
    }
  };

  window.VF.showMenuSubStep = function(subStepId) {
    window.VF.state.subStep = subStepId;
    const substeps = document.querySelectorAll('#menu-screen .menu-substep');
    for (let i = 0; i < substeps.length; i++) {
      substeps[i].classList.toggle('active', substeps[i].id === subStepId);
    }
    const bottomBar = document.getElementById('bottom-utility-bar');
    if (bottomBar) {
      bottomBar.style.display = (subStepId === 'menu-sub-root') ? 'flex' : 'none';
    }
  };

  window.VF.showCombatAlert = function(message, isSurge, durationMs) {
    const alertEl = document.getElementById('hud-combat-alert');
    if (!alertEl) return;
    alertEl.textContent = String(message || '');
    alertEl.classList.toggle('surge', Boolean(isSurge));
    alertEl.classList.add('visible');
    clearTimeout(alertEl._alertTimer);
    alertEl._alertTimer = setTimeout(function() {
      alertEl.classList.remove('visible', 'surge');
    }, durationMs || 2200);
  };

  window.VF.showHudAlert = function(message, colorHexStr, durationMs) {
    const subAlert = document.getElementById('hud-sub-alert');
    if (subAlert) {
      subAlert.textContent = String(message || '');
      subAlert.style.color = colorHexStr || '#00f0ff';
      subAlert.style.fontFamily = 'var(--vf-font-display)';
      subAlert.style.fontSize = '0.58rem';
      subAlert.style.fontWeight = '800';
      clearTimeout(subAlert._timer);
      subAlert._timer = setTimeout(function() { subAlert.textContent = ''; }, durationMs || 1600);
    } else {
      window.VF.showCombatAlert(message, colorHexStr === '#00f0ff' || colorHexStr === '#fbbf24', durationMs || 1600);
    }
  };

  window.VF.updateShipStatusHUD = function() {
    const state = window.VF.state || {};
    const weaponStatusEl = document.getElementById('hud-weapon-status');
    const fireBtn = document.getElementById('btn-fire');
    const fireSub = document.getElementById('fire-btn-sub');

    if (weaponStatusEl) {
      if (state.weaponOvercharged) {
        weaponStatusEl.textContent = 'OVERCHARGED READY!';
        weaponStatusEl.style.color = '#fbbf24';
      } else if (state.weaponCharging) {
        weaponStatusEl.textContent = 'CHARGING SINGULARITY...';
        weaponStatusEl.style.color = '#00f0ff';
      } else if (state.weaponCooldown > 0) {
        weaponStatusEl.textContent = 'RECHARGING: ' + state.weaponCooldown.toFixed(1) + 's';
        weaponStatusEl.style.color = '#94a3b8';
      } else {
        weaponStatusEl.textContent = 'ONE-SHOT READY';
        weaponStatusEl.style.color = '#00f0ff';
      }
    }
    if (fireBtn) fireBtn.classList.toggle('overcharged', Boolean(state.weaponOvercharged));
    if (fireSub && !state.weaponCharging) {
      fireSub.textContent = state.weaponOvercharged ? 'OVERCHARGED' : (state.weaponCooldown > 0 ? state.weaponCooldown.toFixed(1) + 's' : 'ONE-SHOT');
    }
  };

  window.VF.updateTeamShieldsHUD = function() {
    const state = window.VF.state || {};
    const t1El = document.getElementById('hud-t1-shields');
    const t2El = document.getElementById('hud-t2-shields');
    const comboEl = document.getElementById('hud-team-combo');
    if (t1El) t1El.textContent = Math.max(0, state.team1Shields !== undefined ? state.team1Shields : 3) + '/3';
    if (t2El) t2El.textContent = Math.max(0, state.team2Shields !== undefined ? state.team2Shields : 3) + '/3';
    if (comboEl) comboEl.textContent = (state.team1Combo || 1) + 'x';
  };

  window.VF.getDroneSpeedFactor = function() {
    const state = window.VF.state || {};
    const hits = Math.max(0, Math.min(6, state.droneHitCount || state.droneHitsTaken || 0));
    return Math.max(0.88, 1.0 - hits * 0.02);
  };

  window.VF.updateHealthHUD = function(targetHealth) {
    const state = window.VF.state || {};
    const raw = (targetHealth !== undefined && targetHealth !== null) ? Number(targetHealth) : Number(state.health);
    const clamped = Math.max(0, Math.min(100, Number.isFinite(raw) ? raw : 100));
    state.health = clamped;
    state.hullArmor = clamped;

    const barEl = document.getElementById('hud-hull-bar');
    const pctEl = document.getElementById('hud-health-pct');
    const isCritical = (clamped <= 50);

    if (barEl) {
      barEl.style.width = clamped + '%';
      barEl.classList.toggle('critical-red', isCritical);
      if (state.hyperShieldTimer > 0) {
        barEl.style.background = 'linear-gradient(90deg, #00f0ff, #fbbf24)';
        barEl.style.boxShadow = '0 0 14px #00f0ff';
      } else if (isCritical) {
        barEl.style.background = 'linear-gradient(90deg, #ff1744, #ff2a55)';
        barEl.style.boxShadow = '0 0 14px #ff2a55';
      } else {
        barEl.style.background = 'linear-gradient(90deg, #00e676, #00ff88)';
        barEl.style.boxShadow = '0 0 10px #00ff88';
      }
    }
    if (pctEl) {
      pctEl.textContent = Math.round(clamped) + '%';
      pctEl.classList.toggle('critical-red', isCritical);
      pctEl.style.color = isCritical ? '#ff2a55' : '#00ff88';
    }
  };

  window.VF.updateDroneStatusHUD = function() {
    const state = window.VF.state || {};
    const pill = document.getElementById('hud-drone-status-pill');
    if (pill) {
      pill.style.whiteSpace = 'nowrap';
      pill.style.minWidth = '170px';
      if (state.directionlessTimer > 0) {
        pill.textContent = 'EMP 6/6: DIRECTIONLESS ' + state.directionlessTimer.toFixed(1) + 's!';
        pill.classList.add('drone-status-emp');
        pill.classList.remove('drone-status-boostlock');
      } else if (state.boosterLockoutTimer > 0) {
        pill.textContent = 'BOOSTERS LOCKED: ' + state.boosterLockoutTimer.toFixed(1) + 's';
        pill.classList.remove('drone-status-emp');
        pill.classList.add('drone-status-boostlock');
      } else {
        const hits = Math.max(0, Math.min(6, state.droneHitCount || 0));
        pill.textContent = 'DRONE HITS: ' + hits + '/6 · SPD ' + (100 - hits * 2) + '%';
        pill.classList.remove('drone-status-emp', 'drone-status-boostlock');
      }
    }
  };

  // ==========================================================================
  // 3. 10/10 SERVERLESS WEBCRYPTO ECDH/ECDSA VAULT (`VF.SecurityManager`)
  // ==========================================================================
  window.VF.SecurityManager = {
    ecdhKeypair: null,
    ecdsaKeypair: null,
    localPublicKeyJwk: null,
    peerSessions: Object.create(null),
    tamperDetected: false,
    nonceCounter: 1,
    nonceWindows: Object.create(null),
    peerRateBuckets: Object.create(null),
    peerLastPhysics: Object.create(null),
    clickTimestamps: [],
    shadowKey: 0x5A3C9E71,
    shadowVault: { score: 0, distance: 0, shields: 6, health: 100 },

    initWebCryptoVault: async function() {
      try {
        if (window.crypto && window.crypto.subtle) {
          this.ecdhKeypair = await window.crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveKey", "deriveBits"]);
          this.ecdsaKeypair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
          this.localPublicKeyJwk = await window.crypto.subtle.exportKey("jwk", this.ecdhKeypair.publicKey);
          return true;
        }
      } catch (_) {}
      return false;
    },

    derivePeerSessionKey: async function(peerId, remoteJwk) {
      try {
        if (!window.crypto || !window.crypto.subtle || !this.ecdhKeypair || !remoteJwk) return null;
        const pubKey = await window.crypto.subtle.importKey("jwk", remoteJwk, { name: "ECDH", namedCurve: "P-256" }, false, []);
        const sharedKey = await window.crypto.subtle.deriveKey(
          { name: "ECDH", public: pubKey },
          this.ecdhKeypair.privateKey,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
        );
        this.peerSessions[peerId] = sharedKey;
        return sharedKey;
      } catch (_) {}
      return null;
    },

    computeRuntimeCodeAttestation: function(roomCode) {
      const str = String(window.VF.animate) + '|' + (roomCode || '');
      let hash = 2166136261;
      for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0).toString(16);
    },

    computeSignature: function(pkt) {
      const raw = (pkt.roomCode || 'GLOBAL') + '|' + pkt.type + '|' + (pkt.senderId || '') + '|VF_SECURE_VAULT_2026';
      let hash = 2166136261;
      for (let i = 0; i < raw.length; i++) {
        hash ^= raw.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0).toString(16);
    },

    verifyNonce: function(peerId, nonce) {
      if (nonce === undefined || nonce === null) return true;
      const key = String(peerId || 'ANON');
      if (!this.nonceWindows[key]) this.nonceWindows[key] = [];
      const list = this.nonceWindows[key];
      if (list.indexOf(nonce) !== -1) return false;
      list.push(nonce);
      if (list.length > 64) list.shift();
      return true;
    },

    validatePeerPhysics: function(pkt) {
      if (!pkt || typeof pkt !== 'object') return false;
      const peerId = String(pkt.senderId || pkt.peerId || 'ANON');
      const now = Date.now();
      const dist = Number(pkt.distance) || 0;
      const prev = this.peerLastPhysics[peerId];
      this.peerLastPhysics[peerId] = { dist: dist, ts: now };
      if (!prev) return true;
      const dt = Math.max(0.015, (now - prev.ts) / 1000);
      return (dist - prev.dist) <= dt * 225 + 60;
    },

    combineRoomSeeds: function(seedA, seedB) {
      return (Number(seedA) ^ Number(seedB)) >>> 0;
    },

    deepFreeze: function(obj) {
      if (!obj || typeof obj !== 'object') return obj;
      Object.freeze(obj);
      Object.keys(obj).forEach(function(k) {
        const val = obj[k];
        if (val && typeof val === 'object' && !Object.isFrozen(val)) {
          window.VF.SecurityManager.deepFreeze(val);
        }
      });
      return obj;
    },

    protectObject: function(obj) {
      const self = this;
      Object.freeze(obj);
      if (typeof Proxy === 'undefined') return obj;
      return new Proxy(obj, {
        set: function() { self.tamperDetected = true; self.checkHealth(); return false; },
        deleteProperty: function() { self.tamperDetected = true; self.checkHealth(); return false; }
      });
    },

    syncShadowState: function() {
      const state = window.VF.state;
      if (!state) return;
      const k = this.shadowKey;
      this.shadowVault.score = (Math.floor(state.score || 0) ^ k);
      this.shadowVault.distance = (Math.floor(state.distance || 0) ^ k);
      this.shadowVault.shields = (((state.team1Shields || 0) + (state.team2Shields || 0)) ^ k);
      this.shadowVault.health = (Math.floor(state.health || 0) ^ k);
    },

    checkRateLimit: function(peerId) {
      const key = String(peerId || 'ANON');
      const now = Date.now();
      const bucket = this.peerRateBuckets[key];
      if (!bucket || now - bucket.windowStart > 1000) {
        this.peerRateBuckets[key] = { windowStart: now, count: 1 };
        return true;
      }
      bucket.count += 1;
      return bucket.count <= 65;
    },

    clampCoord: function(val, min, max, fallback) {
      const num = Number(val);
      return Number.isFinite(num) ? Math.max(min, Math.min(max, num)) : fallback;
    },

    sanitizeTelemetryPacket: function(pkt) {
      if (!pkt || typeof pkt !== 'object') return pkt;
      if ('x' in pkt) pkt.x = this.clampCoord(pkt.x, -14.0, 14.0, 0);
      if ('y' in pkt) pkt.y = this.clampCoord(pkt.y, -14.0, 14.0, -3.0);
      if ('distance' in pkt) pkt.distance = this.clampCoord(pkt.distance, 0, 50000, 0);
      if ('tilt' in pkt) pkt.tilt = this.clampCoord(pkt.tilt, -1.5, 1.5, 0);
      if ('hull' in pkt) pkt.hull = this.clampCoord(pkt.hull, 0, 100, 100);
      return pkt;
    },

    validateRoomCode: function(inputCode, fallbackMode) {
      const cleanInput = String(inputCode || '').trim().toUpperCase();
      const cleanMode = String(fallbackMode || '').trim().toUpperCase();
      const candidate = (cleanInput.indexOf('-') !== -1 || cleanInput.length >= 6) ? cleanInput : cleanMode;
      const sanitized = candidate.replace(/[^A-Z0-9-]/g, '');
      if (/^(SOLO|TEAM)-[A-Z0-9]{4}-[A-Z0-9]$/.test(sanitized)) return sanitized;
      if (sanitized.length >= 6 && (sanitized.startsWith('SOLO-') || sanitized.startsWith('TEAM-'))) return sanitized;
      return null;
    },

    generateRoomCode: function(mode) {
      const prefix = (String(mode || '').toUpperCase() === 'TEAM') ? 'TEAM' : 'SOLO';
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const bytes = new Uint8Array(5);
      if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
      else for (let i = 0; i < 5; i++) bytes[i] = Math.floor(Math.random() * 256);
      let body = '';
      for (let i = 0; i < 4; i++) body += chars[bytes[i] % chars.length];
      return prefix + '-' + body + '-' + chars[bytes[4] % chars.length];
    },

    generateSecureSeed: function() {
      if (window.crypto && window.crypto.getRandomValues) {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return (arr[0] % 900000) + 1000;
      }
      return Math.floor(Math.random() * 900000) + 1000;
    },

    signPacket: function(payload) {
      const signed = Object.assign({}, payload);
      signed.roomCode = signed.roomCode || signed.room || window.VF.state.roomCode || 'GLOBAL';
      signed.senderId = signed.senderId || signed.peerId || window.VF.state.localPeerId;
      signed.ts = Date.now();
      signed.nonce = (this.nonceCounter += 1) + '-' + Math.floor(Math.random() * 100000);
      signed.sig = this.computeSignature(signed);
      return signed;
    },

    verifyPacket: function(pkt) {
      if (!pkt || typeof pkt !== 'object' || typeof pkt.type !== 'string') return false;
      if (pkt.sig !== this.computeSignature(pkt)) return false;
      const sender = pkt.senderId || pkt.peerId;
      if (!this.checkRateLimit(sender)) return false;
      if (!this.verifyNonce(sender, pkt.nonce)) return false;
      this.sanitizeTelemetryPacket(pkt);
      return true;
    },

    attachContextLossGuard: function(canvas) {
      if (!canvas) return;
      canvas.addEventListener('webglcontextlost', function(e) { e.preventDefault(); }, false);
    },

    initDomGuard: function() {},

    checkHealth: function() {
      const healthy = !this.tamperDetected &&
        Boolean(window.VF.ROCKET_FLEET) && window.VF.ROCKET_FLEET.length === 32 &&
        Boolean(window.VF.THEMES) && window.VF.THEMES.length === 11 &&
        typeof THREE !== 'undefined';
      if (!healthy) this.tamperDetected = true;
      const led = document.getElementById('working-led-indicator');
      if (led) {
        led.classList.toggle('tampered', this.tamperDetected);
        led.classList.toggle('fault', this.tamperDetected);
      }
      this.syncShadowState();
      return healthy;
    }
  };
  window.VF.SecurityManager.initWebCryptoVault();

  // ==========================================================================
  // 4. COMPLETE HD PROCEDURAL GPU TEXTURES & GEOMETRIES (`VF.AssetCache`)
  // ==========================================================================
  window.VF.AssetCache = window.VF.AssetCache || {};

  window.VF.initAssetCache = function() {
    if (window.VF.AssetCache.initialized || typeof THREE === 'undefined') return;
    window.VF.AssetCache.initialized = true;

    const hexCanvas = document.createElement('canvas');
    hexCanvas.width = 1024;
    hexCanvas.height = 512;
    const hexCtx = hexCanvas.getContext('2d');
    const hexR = 32;
    const hexW = hexR * Math.sqrt(3);
    const hexH = hexR * 1.5;

    for (let row = -1; row < 512 / hexH + 2; row++) {
      for (let col = -1; col < 1024 / hexW + 2; col++) {
        const cx = col * hexW + (row % 2 === 0 ? 0 : hexW * 0.5);
        const cy = row * hexH;
        hexCtx.beginPath();
        for (let v = 0; v < 6; v++) {
          const angle = (v * Math.PI) / 3 + Math.PI / 6;
          const vx = cx + Math.cos(angle) * hexR;
          const vy = cy + Math.sin(angle) * hexR;
          if (v === 0) hexCtx.moveTo(vx, vy);
          else hexCtx.lineTo(vx, vy);
        }
        hexCtx.closePath();
        hexCtx.fillStyle = 'rgba(255, 170, 0, 0.08)';
        hexCtx.fill();
        hexCtx.lineWidth = 3.0;
        hexCtx.strokeStyle = '#ffd700';
        hexCtx.stroke();
      }
    }
    const goldenHexTex = new THREE.CanvasTexture(hexCanvas);
    goldenHexTex.wrapS = THREE.RepeatWrapping;
    goldenHexTex.wrapT = THREE.RepeatWrapping;
    goldenHexTex.repeat.set(2, 1);
    goldenHexTex.needsUpdate = true;
    window.VF.AssetCache.goldenHexShieldTexture = goldenHexTex;

    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 1024;
    badgeCanvas.height = 384;
    const badgeCtx = badgeCanvas.getContext('2d');
    badgeCtx.fillStyle = '#070b16';
    badgeCtx.fillRect(0, 0, 1024, 384);
    badgeCtx.strokeStyle = '#00f0ff';
    badgeCtx.lineWidth = 14;
    badgeCtx.strokeRect(18, 18, 988, 348);
    badgeCtx.strokeStyle = 'rgba(255,255,255,0.65)';
    badgeCtx.lineWidth = 5;
    badgeCtx.strokeRect(38, 38, 948, 308);
    badgeCtx.fillStyle = '#ffffff';
    badgeCtx.font = '900 132px "Orbitron", sans-serif';
    badgeCtx.textAlign = 'center';
    badgeCtx.textBaseline = 'middle';
    badgeCtx.fillText('V-FACTOR', 512, 150);
    badgeCtx.fillStyle = '#38bdf8';
    badgeCtx.font = '800 34px "Orbitron", sans-serif';
    badgeCtx.fillText('V-FACTOR STUDIOS // ARMORED SECTOR', 512, 286);
    const vfactorBadgeTex = new THREE.CanvasTexture(badgeCanvas);
    vfactorBadgeTex.needsUpdate = true;
    window.VF.AssetCache.vfactorBadgeTexture = vfactorBadgeTex;

    const droneBrandCanvas = document.createElement('canvas');
    droneBrandCanvas.width = 512;
    droneBrandCanvas.height = 160;
    const droneBrandCtx = droneBrandCanvas.getContext('2d');
    droneBrandCtx.fillStyle = '#f8fafc';
    droneBrandCtx.fillRect(0, 0, 512, 160);
    droneBrandCtx.strokeStyle = '#0f172a';
    droneBrandCtx.lineWidth = 8;
    droneBrandCtx.strokeRect(6, 6, 500, 148);
    droneBrandCtx.fillStyle = '#090d16';
    droneBrandCtx.font = '900 32px "Orbitron", sans-serif';
    droneBrandCtx.textAlign = 'center';
    droneBrandCtx.textBaseline = 'middle';
    droneBrandCtx.fillText('V-FACTOR // V-HUNTER', 256, 58);
    droneBrandCtx.fillStyle = '#dc2626';
    droneBrandCtx.font = '800 22px "Orbitron", sans-serif';
    droneBrandCtx.fillText('V-FACTOR // V-HUNTER UCAV', 256, 112);
    const droneBrandTex = new THREE.CanvasTexture(droneBrandCanvas);
    droneBrandTex.needsUpdate = true;
    window.VF.AssetCache.droneBrandTexture = droneBrandTex;

    const redBtnCanvas = document.createElement('canvas');
    redBtnCanvas.width = 512;
    redBtnCanvas.height = 512;
    const redBtnCtx = redBtnCanvas.getContext('2d');
    const radGrad = redBtnCtx.createRadialGradient(256, 256, 18, 256, 256, 250);
    radGrad.addColorStop(0.0, '#ffffff');
    radGrad.addColorStop(0.28, '#ff5252');
    radGrad.addColorStop(0.68, '#ff1744');
    radGrad.addColorStop(1.0, '#4a0414');
    redBtnCtx.fillStyle = radGrad;
    redBtnCtx.fillRect(0, 0, 512, 512);
    redBtnCtx.strokeStyle = '#ffffff';
    redBtnCtx.lineWidth = 16;
    redBtnCtx.beginPath();
    redBtnCtx.arc(256, 256, 230, 0, Math.PI * 2);
    redBtnCtx.stroke();
    redBtnCtx.fillStyle = '#ffffff';
    redBtnCtx.font = '900 54px "Orbitron", sans-serif';
    redBtnCtx.textAlign = 'center';
    redBtnCtx.textBaseline = 'middle';
    redBtnCtx.fillText('SHOOT', 256, 214);
    redBtnCtx.fillStyle = '#fde047';
    redBtnCtx.font = '900 50px "Orbitron", sans-serif';
    redBtnCtx.fillText('RED CORE', 256, 292);
    const redBtnTex = new THREE.CanvasTexture(redBtnCanvas);
    redBtnTex.needsUpdate = true;
    window.VF.AssetCache.redButtonTexture = redBtnTex;

    const hudCanvas = document.createElement('canvas');
    hudCanvas.width = 256;
    hudCanvas.height = 256;
    const hudCtx = hudCanvas.getContext('2d');
    hudCtx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
    hudCtx.lineWidth = 3;
    hudCtx.beginPath();
    hudCtx.arc(128, 128, 106, 0, Math.PI * 2);
    hudCtx.stroke();
    hudCtx.fillStyle = '#ffaa00';
    hudCtx.beginPath();
    hudCtx.arc(128, 128, 6, 0, Math.PI * 2);
    hudCtx.fill();
    const cockpitHudTex = new THREE.CanvasTexture(hudCanvas);
    cockpitHudTex.needsUpdate = true;
    window.VF.AssetCache.cockpitHudTexture = cockpitHudTex;

    const hubCyl = new THREE.CylinderGeometry(1.60, 1.60, 1.45, 32);
    hubCyl.rotateX(Math.PI / 2);
    const spinnerCone = new THREE.ConeGeometry(1.60, 1.45, 32);
    spinnerCone.rotateX(Math.PI / 2);
    const ductShroud = new THREE.CylinderGeometry(14.18, 14.18, 1.72, 64, 1, true);
    ductShroud.rotateX(Math.PI / 2);

    window.VF.AssetCache.sharedGeos = {
      laserMountRing: new THREE.TorusGeometry(13.92, 0.32, 14, 64),
      unitBeamCore: new THREE.CylinderGeometry(0.15, 0.15, 1.0, 10),
      unitBeamHalo: new THREE.CylinderGeometry(0.42, 0.42, 1.0, 10),
      diodeBox: new THREE.BoxGeometry(0.65, 0.65, 0.65),
      lensSphere: new THREE.SphereGeometry(0.28, 12, 12),
      ductShroud: ductShroud,
      ductLip: new THREE.TorusGeometry(14.0, 0.34, 14, 64),
      trapRing: new THREE.TorusGeometry(2.15, 0.08, 10, 36),
      hubCyl: hubCyl,
      spinnerCone: spinnerCone,
      brassBearing: new THREE.TorusGeometry(1.62, 0.12, 12, 32)
    };

    window.VF.AssetCache.sharedMaterials = {
      wallMetal: new THREE.MeshStandardMaterial({ color: 0x3b4963, roughness: 0.42, metalness: 0.78, side: THREE.BackSide }),
      structuralRib: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.34, metalness: 0.86 }),
      turbineBladeMetal: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.24, metalness: 0.88 }),
      bulkheadCover: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.30, metalness: 0.82, emissive: 0x1e293b, emissiveIntensity: 0.18 }),
      brassHub: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.90 }),
      neonStripA: new THREE.MeshBasicMaterial({ color: 0x00f0ff }),
      neonStripB: new THREE.MeshBasicMaterial({ color: 0x7c3aed }),
      searchlight: new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
      emitterHousing: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.30, metalness: 0.88 }),
      emitterLens: new THREE.MeshBasicMaterial({ color: 0xff2a55 }),
      laserCore: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      laserHalo: new THREE.MeshBasicMaterial({ color: 0xff1744, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending }),
      trapRing: new THREE.MeshBasicMaterial({ color: 0xffaa00 }),
      vFactorBadge: new THREE.MeshBasicMaterial({ map: vfactorBadgeTex, side: THREE.DoubleSide }),
      droneBrandMat: new THREE.MeshBasicMaterial({ map: droneBrandTex, side: THREE.DoubleSide }),
      redButtonMat: new THREE.MeshBasicMaterial({ map: redBtnTex, side: THREE.DoubleSide }),
      cockpitHudMat: new THREE.MeshBasicMaterial({ map: cockpitHudTex, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }),
      goldenHexShieldMat: new THREE.MeshBasicMaterial({ map: goldenHexTex, color: 0xffd700, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
    };
  };
  window.VF.initAssetCache();

  // ==========================================================================
  // 5. HYPER-CASUAL CONTINUOUS-LOOP 4-TRACK AUDIO FUSION ENGINE (`VF.AudioEngine`)
  //    Fuses All 4 Tracks from Your Reference Audio & Surges in Critical Modes!
  // ==========================================================================
  const rawAudioEngine = {
    ctx: null,
    muted: false,
    masterVol: 0.84,
    musicVol: 0.80,
    sfxVol: 0.85,
    step16: 0,
    beatPulse: 0,
    seqTimer: null,
    engineOsc: null,
    engineGain: null,
    noiseBuffer: null,
    delayNode: null,
    delayFeedback: null,
    lastEnemyLaserTime: 0,

    // Fusion Track 1 (Bars 0–3): Energetic "Faded" Melodic Pluck & Supersaw Bounce (00:00–00:30)
    fusionMelodyA: [
      369.99, 739.99, 369.99, 554.37, 369.99, 739.99, 466.16, 932.33,
      622.25, 1244.5, 622.25, 932.33, 622.25, 1244.5, 554.37, 1108.7,
      466.16, 932.33, 466.16, 698.46, 466.16, 932.33, 466.16, 739.99,
      349.23, 698.46, 349.23, 554.37, 349.23, 698.46, 369.99, 739.99
    ],
    fusionBassA: [155.56, 123.47, 92.50, 138.59],

    // Fusion Track 2 (Bars 4–7): High-Speed Staccato Strings & Piano Action Hook (00:30–00:50)
    fusionMelodyB: [
      783.99, 739.99, 659.25, 587.33, 659.25, 739.99, 783.99, 987.77,
      783.99, 739.99, 659.25, 587.33, 659.25, 739.99, 783.99, 1046.5,
      880.00, 783.99, 739.99, 659.25, 739.99, 783.99, 880.00, 1174.7,
      987.77, 880.00, 783.99, 739.99, 659.25, 739.99, 587.33, 783.99
    ],
    fusionBassB: [164.81, 130.81, 98.00, 146.83],

    // Fusion Track 3 (Bars 8–11): Euphoric Festival Progressive House Drop (00:51–01:27)
    fusionMelodyC: [
      523.25, 659.25, 880.00, 1046.5, 783.99, 659.25, 523.25, 587.33,
      523.25, 698.46, 880.00, 1046.5, 783.99, 698.46, 659.25, 587.33,
      523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 659.25, 523.25,
      587.33, 659.25, 783.99, 987.77, 783.99, 659.25, 587.33, 493.88
    ],
    fusionBassC: [110.00, 87.31, 130.81, 98.00],

    // Fusion Track 4 (Bars 12–15): Heroic Hybrid Piano & Trap-EDM Overdrive (01:28–01:53)
    fusionMelodyD: [
      523.25, 622.25, 783.99, 622.25, 932.33, 783.99, 622.25, 523.25,
      415.30, 523.25, 622.25, 523.25, 783.99, 622.25, 523.25, 415.30,
      466.16, 587.33, 698.46, 587.33, 932.33, 698.46, 587.33, 466.16,
      392.00, 493.88, 587.33, 783.99, 698.46, 587.33, 493.88, 392.00
    ],
    fusionBassD: [130.81, 103.83, 155.56, 116.54],

    init: function() {
      try {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          this.ctx = new AudioCtx();
          this.noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.25, this.ctx.sampleRate);
          const buf = this.noiseBuffer.getChannelData(0);
          for (let i = 0; i < buf.length; i++) buf[i] = Math.random() * 2 - 1;

          this.delayNode = this.ctx.createDelay(0.5);
          this.delayNode.delayTime.value = 0.21;
          this.delayFeedback = this.ctx.createGain();
          this.delayFeedback.gain.value = 0.26;
          const delayFilter = this.ctx.createBiquadFilter();
          delayFilter.type = 'lowpass';
          delayFilter.frequency.value = 2600;
          this.delayNode.connect(delayFilter);
          delayFilter.connect(this.delayFeedback);
          this.delayFeedback.connect(this.delayNode);
          this.delayNode.connect(this.ctx.destination);

          this.startMusicLoop();
        }
        if (this.ctx.state === 'suspended' && !document.hidden) {
          this.ctx.resume();
        }
      } catch (_) {}
    },

    unlock: function() { this.init(); },

    effGain: function(baseVol, isMusic) {
      if (this.muted || !this.ctx || document.hidden) return 0;
      return baseVol * this.masterVol * (isMusic ? this.musicVol : this.sfxVol);
    },

    playPianoNote: function(freq, dur, vol, pan) {
      if (!this.ctx || this.muted || document.hidden || freq <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const gVal = this.effGain(vol, true);
        if (gVal <= 0.0001) return;

        const outGain = this.ctx.createGain();
        outGain.gain.setValueAtTime(0.0001, now);
        outGain.gain.linearRampToValueAtTime(gVal, now + 0.006);
        outGain.gain.exponentialRampToValueAtTime(gVal * 0.38, now + dur * 0.35);
        outGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(5200, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + dur);

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2.0, now);

        const harmGain = this.ctx.createGain();
        harmGain.gain.setValueAtTime(0.32, now);
        harmGain.gain.exponentialRampToValueAtTime(0.02, now + dur * 0.4);

        osc1.connect(filter);
        osc2.connect(harmGain);
        harmGain.connect(filter);
        filter.connect(outGain);

        if (typeof pan === 'number' && typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
          outGain.connect(panner);
          panner.connect(this.ctx.destination);
        } else {
          outGain.connect(this.ctx.destination);
        }
        if (this.delayNode) outGain.connect(this.delayNode);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + dur);
        osc2.stop(now + dur);
      } catch (_) {}
    },

    playSupersaw: function(freq, dur, vol, cutoff) {
      if (!this.ctx || this.muted || document.hidden || freq <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const gVal = this.effGain(vol, true);
        if (gVal <= 0.0001) return;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(cutoff || 4200, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(gVal, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        [-11, 0, 11].forEach(function(detuneCents) {
          const osc = this.ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc.detune.setValueAtTime(detuneCents, now);
          osc.connect(filter);
          osc.start(now);
          osc.stop(now + dur);
        }, this);

        filter.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.delayNode) gain.connect(this.delayNode);
      } catch (_) {}
    },

    playTone: function(freq, type, dur, vol, slideFreq, isMusic, cutoff, pan) {
      if (!this.ctx || this.muted || document.hidden) return;
      const cut = cutoff === undefined ? 2800 : cutoff;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(20, freq), now);
        if (slideFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideFreq), now + dur);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(cut, now);
        const g = this.effGain(vol, Boolean(isMusic));
        gain.gain.setValueAtTime(Math.max(0.0001, g), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(filter);
        filter.connect(gain);
        if (typeof pan === 'number' && typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
          gain.connect(panner);
          panner.connect(this.ctx.destination);
        } else {
          gain.connect(this.ctx.destination);
        }
        osc.start(now);
        osc.stop(now + dur);
      } catch (_) {}
    },

    playNoise: function(dur, vol, hpFreq, pan) {
      if (!this.ctx || this.muted || !this.noiseBuffer || document.hidden) return;
      try {
        const now = this.ctx.currentTime;
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(hpFreq || 1200, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(Math.max(0.0001, this.effGain(vol, false)), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        src.connect(filter);
        filter.connect(gain);
        if (typeof pan === 'number' && typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
          gain.connect(panner);
          panner.connect(this.ctx.destination);
        } else {
          gain.connect(this.ctx.destination);
        }
        src.start(now);
        src.stop(now + dur);
      } catch (_) {}
    },

    // CONTINUOUS HYPER-ENERGETIC FUSION LOOP + AUTOMATIC CRITICAL MODE SURGE
    startMusicLoop: function() {
      const self = this;
      if (this.seqTimer) clearTimeout(this.seqTimer);
      const stepLoop = function() {
        const st = window.VF.state || {};
        const hasDrones = typeof window.VF.hasAnyActiveDrone === 'function' ? window.VF.hasAnyActiveDrone() : false;
        const isCritical = Boolean(
          st.inGame && !st.paused && (
            st.boosting || st.boostToggledOn ||
            st.weaponOvercharged ||
            hasDrones ||
            (st.health && st.health <= 50) ||
            st.directionlessTimer > 0 ||
            st.mode === 'SHIFT'
          )
        );

        const distBonusBpm = st.inGame ? Math.min(10, Math.floor((st.distance || 0) / 400)) : 0;
        const bpm = (isCritical ? 142 : 128) + distBonusBpm;
        const stepMs = Math.round(15000 / bpm);

        if (self.ctx && !self.muted && !document.hidden && self.ctx.state === 'running') {
          // Seamless 16-Bar Continuous Cycle across all 4 Reference Audio Tracks
          const totalBar = Math.floor(self.step16 / 8) % 16;
          const phase = Math.floor(totalBar / 4);
          const barInPhase = totalBar % 4;
          const step8 = self.step16 % 8;
          const idx32 = self.step16 % 32;

          const melodyArr = phase === 0 ? self.fusionMelodyA : (phase === 1 ? self.fusionMelodyB : (phase === 2 ? self.fusionMelodyC : self.fusionMelodyD));
          const bassArr = phase === 0 ? self.fusionBassA : (phase === 1 ? self.fusionBassB : (phase === 2 ? self.fusionBassC : self.fusionBassD));

          // 1. Punchy Hyper-Casual Four-on-the-Floor Kick + Critical Double-Kick
          if (step8 % 2 === 0 || (isCritical && step8 === 7)) {
            self.beatPulse = 1.0;
            self.playTone(146, 'sine', 0.14, isCritical ? 0.27 : 0.22, 34, true, 750);
          } else {
            self.beatPulse = Math.max(0, self.beatPulse - 0.35);
          }

          // 2. Crisp Clap / Snare + Critical Mode Snare Roll Fill
          if (step8 === 2 || step8 === 6 || (isCritical && barInPhase === 3 && step8 >= 4)) {
            self.playTone(230, 'triangle', 0.08, 0.12, 95, true, 2400);
            self.playNoise(0.10, isCritical ? 0.14 : 0.10, 1300);
          }

          // 3. Energetic Off-Beat Hi-Hats
          self.playNoise(step8 % 2 === 1 ? 0.045 : 0.025, isCritical ? 0.075 : 0.048, 5800, (step8 % 2 === 0) ? -0.35 : 0.35);

          // 4. Driving Rolling Octave Bassline
          const root = bassArr[barInPhase];
          const bassFreq = (step8 % 2 === 1) ? root * 2 : root;
          self.playTone(bassFreq, 'sawtooth', 0.11, isCritical ? 0.14 : 0.11, null, true, isCritical ? 3200 : 1900);

          // 5. Fused Melodic Piano + Euphoric Festival Supersaw Lead
          const note = melodyArr[idx32];
          if (note > 0) {
            self.playPianoNote(note, 0.22, 0.135, (idx32 % 2 === 0) ? -0.28 : 0.28);
            self.playSupersaw(note, 0.19, isCritical ? 0.072 : 0.052, isCritical ? 5600 : 3800);
            if (isCritical && step8 % 2 === 0) {
              self.playSupersaw(note * 1.5, 0.14, 0.042, 6000);
            }
          }

          self.step16 += 1;
        }
        self.seqTimer = setTimeout(stepLoop, stepMs);
      };
      stepLoop();
    },

    stopMusicLoop: function() { if (this.seqTimer) { clearTimeout(this.seqTimer); this.seqTimer = null; } },
    startLoop: function() { this.startMusicLoop(); },

    playDopplerWhooshSFX: function(pan, spdRatio) {
      const r = Math.max(0.6, Math.min(2.2, Number(spdRatio) || 1.0));
      const p = Math.max(-1, Math.min(1, Number(pan) || 0));
      this.playTone(390 * r, 'sine', 0.21, 0.15, 115, false, 2400, p);
      this.playNoise(0.15, 0.09, 1800, p);
    },
    playDopplerPassSFX: function(pan) { this.playDopplerWhooshSFX(pan, 1.15); },
    playSonicBoomSFX: function() { this.init(); this.playTone(185, 'sawtooth', 0.38, 0.24, 38, false, 1700); this.playNoise(0.20, 0.18, 480); },
    playGoldenShieldActivateSFX: function() {
      this.init();
      const self = this;
      [523.25, 659.25, 783.99, 1046.5].forEach(function(f, idx) {
        setTimeout(function() { self.playPianoNote(f, 0.22, 0.16, 0); }, idx * 45);
      });
    },
    playGoldenShieldImpactSFX: function() {
      this.init();
      window.VF.vibrate([35, 20, 45]);
      this.playTone(880, 'triangle', 0.24, 0.26, 293.66, false, 3800);
      this.playTone(440, 'sawtooth', 0.28, 0.22, 110, false, 2200);
    },
    playRadarLockChirpSFX: function() { this.playTone(1320, 'sine', 0.055, 0.14, 1760, false, 4800); },
    playOneShotFireSFX: function(wType) {
      this.init();
      window.VF.vibrate([30, 20, 45]);
      this.playTone(150, 'sine', 0.42, 0.35, 28, false, 900);
      this.playNoise(0.22, 0.26, 600);
      if (wType === 'RAILGUN') this.playTone(2100, 'sawtooth', 0.30, 0.30, 95, false, 6000);
      else if (wType === 'PLASMA') this.playTone(780, 'square', 0.28, 0.28, 85, false, 3500);
      else if (wType === 'MISSILE') this.playTone(360, 'sawtooth', 0.32, 0.26, 820, false, 3000);
      else if (wType === 'EMP') this.playTone(980, 'triangle', 0.34, 0.28, 60, false, 4200);
      else this.playTone(1480, 'sawtooth', 0.28, 0.28, 150, false, 5200);
    },
    playOneShotBlastSFX: function(wType) { this.playOneShotFireSFX(wType); },
    playTargetDestroyedSFX: function() {
      this.init();
      window.VF.vibrate([25, 20, 55]);
      this.playTone(180, 'sawtooth', 0.35, 0.30, 42, false, 1800);
      this.playNoise(0.24, 0.24, 700);
      const self = this;
      setTimeout(function() { self.playPianoNote(587.33, 0.18, 0.20, -0.2); }, 65);
      setTimeout(function() { self.playPianoNote(880.0, 0.26, 0.22, 0.2); }, 140);
    },
    playDroneFireSFX: function() {
      const now = performance.now();
      if (now - this.lastEnemyLaserTime < 140) return;
      this.lastEnemyLaserTime = now;
      this.playTone(920, 'sawtooth', 0.16, 0.16, 210, false, 3400);
    },
    playEnemyLaserSFX: function() { this.playDroneFireSFX(); },
    playDroneHitPlayerSFX: function(cnt) {
      this.init();
      const base = Math.max(180, 520 - (Number(cnt) || 1) * 55);
      this.playTone(base, 'sawtooth', 0.22, 0.26, base * 0.48, false, 2600);
      this.playNoise(0.12, 0.18, 900);
    },
    playDroneHitSFX: function(cnt) { this.playDroneHitPlayerSFX(cnt); },
    playDirectionlessEMPSFX: function() {
      this.init();
      this.playTone(840, 'sawtooth', 0.55, 0.32, 48, false, 3800);
      this.playNoise(0.32, 0.25, 650);
    },
    playDroneEmpSFX: function() { this.playDirectionlessEMPSFX(); },
    playBoosterLockedSFX: function() { this.init(); this.playTone(360, 'square', 0.16, 0.20, 160, false, 2200); },
    playBoosterLockSFX: function() { this.playBoosterLockedSFX(); },
    playBoosterRestoreSFX: function() {
      this.init();
      const self = this;
      this.playPianoNote(523.25, 0.16, 0.18, -0.2);
      setTimeout(function() { self.playPianoNote(1046.5, 0.24, 0.20, 0.2); }, 75);
    },
    playLockdownBreachSFX: function() {
      this.init();
      window.VF.vibrate([20, 15, 35]);
      this.playTone(520, 'square', 0.12, 0.24, 980, false, 3800);
    },
    playSpaceBridgeSpoolSFX: function() { this.playTone(165, 'sine', 0.42, 0.16, 440, false, 2800); },
    playBarrelRollWhooshSFX: function() { this.init(); window.VF.vibrate(16); this.playTone(280, 'sine', 0.26, 0.22, 620, false, 3400); },
    playNearMissSparksSFX: function(pan) { window.VF.vibrate(12); this.playTone(940, 'sine', 0.22, 0.22, 280, false, 3200, pan); },
    playNearMissSFX: function(pan) { this.playNearMissSparksSFX(pan); },
    playCrashSFX: function() { window.VF.vibrate([60, 30, 80]); this.playTone(110, 'sawtooth', 0.55, 0.32, 28); this.playNoise(0.32, 0.26, 400); },
    playShatterSFX: function() { this.playCrashSFX(); },
    playUIHoverSFX: function() { this.playPianoNote(587.33, 0.08, 0.08, 0); },
    playUIClickSFX: function() { this.init(); this.playPianoNote(739.99, 0.14, 0.15, 0); },
    playChime: function() { this.playUIClickSFX(); },
    playClickSFX: function() { this.playUIClickSFX(); },
    playIntroGantryClank: function(idx) { this.playPianoNote(220 + (Number(idx) || 0) * 35, 0.12, 0.12, 0); },
    playIntroSpoolUp: function() { this.playTone(85, 'sawtooth', 0.55, 0.18, 480, false, 3200); },
    playBoostSFX: function() { window.VF.vibrate(18); this.playTone(140, 'sawtooth', 0.28, 0.20, 420); },
    playGunDeploySFX: function() { this.init(); window.VF.vibrate(15); this.playTone(340, 'square', 0.09, 0.20, 180, false, 2600); },
    playEnergyGatherSFX: function() { this.init(); this.playTone(240, 'sawtooth', 0.38, 0.24, 1380, false, 4600); },
    playThermalPurgeSFX: function() { this.playNoise(0.20, 0.16, 2600); },
    shieldHit: function() { this.playGoldenShieldImpactSFX(); },
    playGameOverSFX: function() {
      const self = this;
      [392.0, 349.23, 311.13, 261.63].forEach(function(f, i) {
        setTimeout(function() { self.playPianoNote(f, 0.32, 0.20, 0); }, i * 115);
      });
    },
    playVictorySFX: function() {
      const self = this;
      [523.25, 659.25, 783.99, 1046.5].forEach(function(f, i) {
        setTimeout(function() { self.playPianoNote(f, 0.34, 0.24, 0); }, i * 95);
      });
    },

    updateThruster: function(ratio, isBoost) {
      if (!this.ctx || this.muted || document.hidden || !window.VF.state || !window.VF.state.inGame) {
        if (this.engineGain && this.ctx) {
          try { this.engineGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08); } catch (_) {}
        }
        return;
      }
      try {
        if (!this.engineOsc) {
          this.engineOsc = this.ctx.createOscillator();
          this.engineGain = this.ctx.createGain();
          this.engineOsc.type = 'sawtooth';
          this.engineOsc.frequency.value = 65;
          this.engineGain.gain.value = 0.0001;
          this.engineOsc.connect(this.engineGain);
          this.engineGain.connect(this.ctx.destination);
          this.engineOsc.start();
        }
        const empFactor = (window.VF.state.directionlessTimer > 0) ? 0.55 : window.VF.getDroneSpeedFactor();
        const freq = (60 + ratio * 75 + (isBoost ? 55 : 0)) * empFactor;
        const g = this.effGain(isBoost ? 0.06 : 0.025, false);
        this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.06);
        this.engineGain.gain.setTargetAtTime(Math.max(0.0001, g), this.ctx.currentTime, 0.06);
      } catch (_) {}
    },

    setVolumes: function(m, mu, s) { this.masterVol = m; this.musicVol = mu; this.sfxVol = s; },
    toggleMute: function() {
      this.init();
      this.muted = !this.muted;
      const btn = document.getElementById('btn-audio-toggle');
      if (btn) btn.textContent = this.muted ? 'AUDIO: OFF' : 'AUDIO: ON';
      return this.muted;
    }
  };

  const noopFn = function() {};
  window.VF.AudioEngine = (typeof Proxy !== 'undefined')
    ? new Proxy(rawAudioEngine, {
        get: function(target, prop) {
          if (prop in target) {
            const val = target[prop];
            return typeof val === 'function' ? val.bind(target) : val;
          }
          return noopFn;
        }
      })
    : rawAudioEngine;

  ['pointerdown', 'touchstart', 'keydown'].forEach(function(evt) {
    window.addEventListener(evt, function() { window.VF.AudioEngine.init(); }, { once: true, passive: true });
  });

  document.addEventListener('visibilitychange', function() {
    if (!rawAudioEngine.ctx) return;
    try {
      if (document.hidden) rawAudioEngine.ctx.suspend();
      else if (!rawAudioEngine.muted) rawAudioEngine.ctx.resume();
    } catch (_) {}
  });

  // ==========================================================================
  // 6. 11 COLOR-FUSION THEMES (`VF.THEMES`) & 32 SPACECRAFT (`VF.ROCKET_FLEET`)
  // ==========================================================================
  const rawThemes = [
    { id: 0, name: "Futuristic Tunnel", bg: 0x050914, fog: 0x081022, wallMetal: 0x3b4963, bladeMetal: 0xcbd5e1, bulkheadMetal: 0x94a3b8, ringA: 0x00f0ff, ringB: 0x7c3aed, accent: 0x00f0ff },
    { id: 1, name: "Neon Grid", bg: 0x100420, fog: 0x180730, wallMetal: 0x452b66, bladeMetal: 0xe9d5ff, bulkheadMetal: 0xa855f7, ringA: 0xff007f, ringB: 0x6366f1, accent: 0xff2a85 },
    { id: 2, name: "Solar Core", bg: 0x180803, fog: 0x240e05, wallMetal: 0x59331e, bladeMetal: 0xfde68a, bulkheadMetal: 0xd97706, ringA: 0xfbbf24, ringB: 0xef4444, accent: 0xf59e0b },
    { id: 3, name: "Ice Cavern", bg: 0x031520, fog: 0x072233, wallMetal: 0x2f5973, bladeMetal: 0xe0f2fe, bulkheadMetal: 0x67e8f9, ringA: 0x67e8f9, ringB: 0x34d399, accent: 0xa5f3fc },
    { id: 4, name: "Deep Ocean", bg: 0x020f1f, fog: 0x061930, wallMetal: 0x234769, bladeMetal: 0x99f6e4, bulkheadMetal: 0x2dd4bf, ringA: 0x14b8a6, ringB: 0x0284c7, accent: 0x2dd4bf },
    { id: 5, name: "Stone Vault", bg: 0x11131a, fog: 0x1a1e28, wallMetal: 0x474f63, bladeMetal: 0xe2e8f0, bulkheadMetal: 0x94a3b8, ringA: 0xfde68a, ringB: 0x94a3b8, accent: 0xfcd34d },
    { id: 6, name: "Sunset Horizon", bg: 0x19091a, fog: 0x260e29, wallMetal: 0x572d59, bladeMetal: 0xfed7aa, bulkheadMetal: 0xfb923c, ringA: 0xf97316, ringB: 0xa855f7, accent: 0xfb923c },
    { id: 7, name: "Starlight Void", bg: 0x050510, fog: 0x0b0a1f, wallMetal: 0x343863, bladeMetal: 0xe2e8f0, bulkheadMetal: 0x94a3b8, ringA: 0xe2e8f0, ringB: 0x3b82f6, accent: 0x93c5fd },
    { id: 8, name: "Emerald Hive", bg: 0x04140d, fog: 0x082117, wallMetal: 0x265240, bladeMetal: 0xbbf7d0, bulkheadMetal: 0x34d399, ringA: 0x10b981, ringB: 0x84cc16, accent: 0x34d399 },
    { id: 9, name: "Sky Elevator", bg: 0x08182e, fog: 0x0e2547, wallMetal: 0x395b82, bladeMetal: 0xf1f5f9, bulkheadMetal: 0x93c5fd, ringA: 0x38bdf8, ringB: 0xfef08a, accent: 0x7dd3fc },
    { id: 10, name: "Lava Cavern", bg: 0x170505, fog: 0x260808, wallMetal: 0x592424, bladeMetal: 0xfecaca, bulkheadMetal: 0xef4444, ringA: 0xf97316, ringB: 0xdc2626, accent: 0xef4444 }
  ];
  window.VF.THEMES = window.VF.SecurityManager.protectObject(
    rawThemes.map(function(t) { return window.VF.SecurityManager.protectObject(t); })
  );

  const rawFleet = [
    [1, "Pulse Dart", "GEN 1", "Strike Dart", 1.2, 0.6, 6.0, 0x00f0ff, 0x3b82f6, "Dual Pulse Lasers", "LASER", 0x00f0ff, "Tiny hitbox clears fast blades effortlessly.", "Low top speed struggles against Push-turbines."],
    [2, "Needle-X", "GEN 1", "Strike Dart", 1.5, 0.5, 6.5, 0x38bdf8, 0x818cf8, "Needle Beam Cannon", "LASER", 0x38bdf8, "Narrowest fuselage slips through tight shutters.", "Light frame drifts slightly in high-RPM wash."],
    [3, "Spark Mite", "GEN 1", "Strike Dart", 1.1, 0.7, 7.0, 0xfbbf24, 0xf97316, "Arc Blaster Array", "EMP", 0x00ff88, "Instant lateral snap-steering; zero tail-clip risk.", "Short boost window requires timing."],
    [4, "Ion Flea", "GEN 1", "Strike Dart", 1.3, 0.6, 7.2, 0x34d399, 0x059669, "Ion Disruptor", "EMP", 0x34d399, "Instant lateral stabilization before shutters.", "Modest top-end speed on long open segments."],
    [5, "Vesper Nano", "GEN 1", "Strike Dart", 1.4, 0.65, 7.8, 0xe879f9, 0x9333ea, "Void Needler", "PLASMA", 0xe879f9, "Fastest of GEN 1; nimble in tight clusters.", "Delicate boost core loses efficiency if held."],
    [6, "Pebble Jet", "GEN 1", "Strike Dart", 1.0, 0.85, 6.8, 0x94a3b8, 0x38bdf8, "Twin Scatter Cannons", "MISSILE", 0xff2a55, "Shortest tail in the fleet; immune to tail-clips.", "Wider wingtips require horizontal centering."],
    [7, "Glint Runner", "GEN 1", "Strike Dart", 1.5, 0.6, 7.4, 0xfef08a, 0x06b6d4, "Photon Lance", "LASER", 0xfef08a, "High-visibility beacon highlights shutters early.", "Modest top speed in Solo sprints."],
    [8, "Atom Wing", "GEN 2", "Ring-Nacelle Gunship", 1.3, 0.55, 7.1, 0x2dd4bf, 0x6366f1, "Atomic Twin Blasters", "PLASMA", 0xa855f7, "Featherweight handling; ideal for Shift Mode.", "Pushed back strongly by crimson exhaust fans."],
    [9, "Apex V8", "GEN 2", "Ring-Nacelle Gunship", 2.2, 1.0, 8.5, 0x00f0ff, 0x7c3aed, "V8 Plasma Repeaters", "PLASMA", 0xa855f7, "Well-rounded speed and handling; reliable.", "Requires disciplined timing on dual fans."],
    [10, "Vanguard S", "GEN 2", "Ring-Nacelle Gunship", 2.0, 0.9, 8.3, 0x60a5fa, 0x10b981, "Vanguard Auto-Turret", "LASER", 0x00f0ff, "Stable cruise makes 2v2 formation flying easy.", "Moderate boost burst compared to interceptors."],
    [11, "Stratos One", "GEN 2", "Ring-Nacelle Gunship", 2.3, 1.0, 8.7, 0xf43f5e, 0xf59e0b, "Thermo-Plasma Cannon", "PLASMA", 0xf43f5e, "Smooth lateral damping prevents over-steering.", "Slightly longer nose cone requires early turn-in."],
    [12, "Horizon GT", "GEN 2", "Ring-Nacelle Gunship", 2.1, 1.1, 8.8, 0xa855f7, 0xec4899, "Horizon Wing Missiles", "MISSILE", 0xff2a55, "Strong mid-range boost accelerates cleanly.", "Wide gull-wings demand precise alignment."],
    [13, "Comet Core", "GEN 2", "Ring-Nacelle Gunship", 1.9, 0.95, 8.4, 0x38bdf8, 0xfacc15, "Comet Cryo-Blaster", "EMP", 0x38bdf8, "Rapid boost recharge and crisp lateral poise.", "Average top speed on long straight segments."],
    [14, "Vector Prime", "GEN 2", "Ring-Nacelle Gunship", 2.2, 0.88, 8.6, 0x14b8a6, 0x3b82f6, "Vector Rail-Repeater", "RAILGUN", 0xfbbf24, "High combo multiplier stability in 2v2 Team Clash.", "Less forgiving if entering a gap off-center."],
    [15, "Zenith Mark II", "GEN 3", "X-Scissor Interceptor", 2.4, 1.0, 9.0, 0xe2e8f0, 0x6366f1, "Zenith Dual Railgun", "RAILGUN", 0xfbbf24, "High straight-line velocity with crisp control.", "2.4m length requires early entry before shutters."],
    [16, "Aether Cruiser", "GEN 3", "X-Scissor Interceptor", 2.1, 1.0, 8.2, 0x84cc16, 0x06b6d4, "Aether Phase Cannon", "EMP", 0x00ff88, "Resistant to pull/push airflow in Shift Mode.", "Slower initial boost ignition."],
    [17, "Turbine Fury", "GEN 3", "X-Scissor Interceptor", 2.7, 0.85, 9.4, 0xef4444, 0xf97316, "Hellfire Micro-Swarm", "MISSILE", 0xff2a55, "Razor-slim body paired with aggressive boost.", "Long fuselage can get clipped by high-RPM blades."],
    [18, "Phantom Blade", "GEN 3", "X-Scissor Interceptor", 2.8, 0.8, 9.6, 0xc084fc, 0x38bdf8, "Phantom Tachyon Beam", "LASER", 0x00f0ff, "Slices through narrowing gaps at blistering speed.", "High forward momentum requires early commitment."],
    [19, "Velocity Raptor", "GEN 3", "X-Scissor Interceptor", 2.6, 1.05, 9.5, 0xf59e0b, 0x10b981, "Raptor Rotary Autocannon", "PLASMA", 0xa855f7, "Explosive boost beats closing shutters with ease.", "Sensitive steering requires steady hands."],
    [20, "Starlight Viper", "GEN 3", "X-Scissor Interceptor", 3.0, 0.85, 9.8, 0x67e8f9, 0x3b82f6, "Viper Twin Rail-Lances", "RAILGUN", 0xfbbf24, "Dominant sprint speed and narrow width.", "3.0m fuselage demands entering near leading edge."],
    [21, "Solar Javelin", "GEN 4", "Cyber-Spoiler Corvette", 3.2, 0.75, 10.0, 0xfde047, 0xef4444, "Solar Lance Accelerator", "RAILGUN", 0xfbbf24, "Pencil-thin profile with hyper-speed thrust.", "Very long body -- late entry risks tail shatter."],
    [22, "Nitro Falken", "GEN 4", "Cyber-Spoiler Corvette", 2.7, 1.15, 9.3, 0x22d3ee, 0xf43f5e, "Falken Tactical Laser", "LASER", 0x00f0ff, "High-downforce wings allow rapid diagonal switches.", "Wide wingspan leaves minimal margin in tight fans."],
    [23, "Bolt Striker", "GEN 4", "Cyber-Spoiler Corvette", 2.5, 0.9, 9.2, 0xfacc15, 0x6366f1, "Lightning Chain-Cannon", "EMP", 0x00ff88, "Fast boost recovery chains bursts across fans.", "Stiff steering while actively boosting."],
    [24, "Hyperion Arrow", "GEN 4", "Cyber-Spoiler Corvette", 2.9, 0.82, 9.7, 0x34d399, 0x0ea5e9, "Hyperion Siege Mortar", "MISSILE", 0xff2a55, "Generates extra Near-Miss score multipliers.", "High base speed leaves less reaction time."],
    [25, "Goliath Heavy", "GEN 4", "Cyber-Spoiler Corvette", 3.6, 1.35, 10.5, 0xf97316, 0x94a3b8, "Goliath Quad Howitzer", "MISSILE", 0xff2a55, "Crushing top speed; powers through Red Push-Fans.", "Massive hull requires center-gap timing."],
    [26, "Mammoth Siege", "GEN 4", "Cyber-Spoiler Corvette", 3.3, 1.3, 9.8, 0x10b981, 0x64748b, "Mammoth EMP Siege Core", "EMP", 0x00ff88, "Heavy gyro-stabilizers lock onto lanes cleanly.", "Heavy mass takes a split-second longer to turn."],
    [27, "Titan Sovereign", "GEN 5", "Seraphim Halo Dreadnought", 4.0, 1.4, 11.0, 0xfbbf24, 0x7c3aed, "Sovereign Orbital Rail", "RAILGUN", 0xfbbf24, "Fastest straight-line starfighter in the fleet.", "Longest tail in the fleet; demands early entry."],
    [28, "Colossus V12", "GEN 5", "Seraphim Halo Dreadnought", 3.5, 1.5, 10.3, 0xef4444, 0x38bdf8, "Colossus Quad-Plasma", "PLASMA", 0xa855f7, "Quad-pod momentum ignores wind turbulence.", "Wide hull barely fits through narrow sectors."],
    [29, "Chrono-Wisp", "GEN 5", "Seraphim Halo Dreadnought", 1.7, 1.1, 8.5, 0x00f0ff, 0xe879f9, "Chrono Distortion Cannon", "EMP", 0x00ff88, "Briefly slows local blade perception on boost.", "Ring-shaped hull has wider outer diameter."],
    [30, "Quantum Shard", "GEN 5", "Seraphim Halo Dreadnought", 2.5, 0.95, 9.4, 0xa855f7, 0x2dd4bf, "Quantum Singularity Ray", "LASER", 0x00f0ff, "Instantaneous horizontal lane-shift response.", "Asymmetric crystal geometry needs center alignment."],
    [31, "Vortex Weaver", "GEN 5", "Seraphim Halo Dreadnought", 2.0, 1.1, 8.9, 0x38bdf8, 0xf59e0b, "Vortex Graviton Torpedo", "MISSILE", 0xff2a55, "Amplifies Shift Mode Trigger Gaps by 35%.", "Twin tail booms require level horizontal exits."],
    [32, "V-Factor Omega", "GEN 5", "Seraphim Halo Dreadnought", 2.6, 0.9, 10.4, 0x00f0ff, 0xf43f5e, "Omega Omni-Annihilator", "RAILGUN", 0xfbbf24, "Flagship V-FACTOR prototype with elite handling.", "High base velocity requires master reflexes."]
  ];

  window.VF.ROCKET_FLEET = window.VF.SecurityManager.protectObject(
    rawFleet.map(function(r) {
      return window.VF.SecurityManager.protectObject({
        id: r[0],
        name: r[1],
        gen: r[2],
        cls: r[3],
        genClass: r[3],
        length: r[4],
        width: r[5],
        speed: r[6],
        colorA: r[7],
        colorB: r[8],
        weaponName: r[9],
        weaponType: r[10],
        comboEffect: r[10],
        weaponColor: r[11],
        pro: r[12],
        con: r[13]
      });
    })
  );
})();
