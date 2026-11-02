/* V-FACTOR STUDIOS // @_the_v_factor_ // BUILT BY VINAY — APPLICATION, CROSS-CITY MULTIPLAYER & INPUT CONTROLLER */
(function() {
  "use strict";
  window.VF = window.VF || {};

  // ==========================================================================
  // 1. SAFE STATE INITIALIZATION & LOBBY SLOTS DICTIONARY
  // ==========================================================================
  window.VF.state = window.VF.state || {};
  window.VF.state.keys = window.VF.state.keys || {
    left: false,
    right: false,
    up: false,
    down: false
  };
  window.VF.keys = window.VF.state.keys;

  window.VF.initLobbySlotsDictionary = function(mode) {
    const state = window.VF.state;
    if (!state) return;
    const dict = {};
    if (mode === 'SOLO') {
      for (let i = 1; i <= 10; i++) {
        const key = String(i);
        dict[key] = (i === 1 && state.isHost)
          ? { occupantId: state.localPeerId, label: 'HOST', ready: true, rocketId: state.equippedRocketId || 9, alive: true }
          : null;
      }
    } else {
      ['1A', '1B', '2A', '2B'].forEach(function(key) {
        dict[key] = (key === '1A' && state.isHost)
          ? { occupantId: state.localPeerId, label: 'HOST', ready: true, rocketId: state.equippedRocketId || 9, alive: true }
          : null;
      });
    }
    state.lobbySlots = dict;
    window.VF.syncLegacySlotsFromDictionary();
  };

  window.VF.syncLegacySlotsFromDictionary = function() {
    const state = window.VF.state;
    if (!state) return;
    const dict = state.lobbySlots || {};
    state.soloSlots = state.soloSlots || [];
    state.lobbySeats = state.lobbySeats || {};

    if (state.mpSubMode === 'SOLO') {
      for (let i = 1; i <= 10; i++) {
        const key = String(i);
        const entry = dict[key];
        state.soloSlots[i - 1] = entry
          ? { slotNum: i, occupantId: entry.occupantId, label: entry.label || ('PILOT P' + i), ready: Boolean(entry.ready), rocketId: entry.rocketId || 9, alive: entry.alive !== false }
          : { slotNum: i, occupantId: null, label: 'VACANT', ready: false, rocketId: ((i * 3) % 32) + 1, alive: true };
        if (entry && entry.occupantId === state.localPeerId) state.mySoloSlot = i;
      }
    } else {
      ['1A', '1B', '2A', '2B'].forEach(function(key) {
        const entry = dict[key];
        state.lobbySeats[key] = entry
          ? { occupantId: entry.occupantId, label: entry.label || ('PILOT ' + key), ready: Boolean(entry.ready), rocketId: entry.rocketId || 9 }
          : { occupantId: null, label: 'VACANT', ready: false, rocketId: 14 };
        if (entry && entry.occupantId === state.localPeerId) state.mySeat = key;
      });
    }
  };

  // ==========================================================================
  // 2. PERSISTENCE ENGINE & BUTTON ORIENTATION ROUTING
  // ==========================================================================
  window.VF.saveUserPrefsToStorage = function() {
    try {
      const state = window.VF.state || {};
      const shipId = Number(state.equippedRocketId) || 9;
      const layout = String(state.buttonSideLayout || 'RIGHT_DEFAULT');
      if (window.localStorage) {
        window.localStorage.setItem('VF_EQUIPPED_SHIP_ID', String(shipId));
        window.localStorage.setItem('VF_BUTTON_LAYOUT', layout);
      }
      window.name = 'VF_SHIP_' + shipId + '__' + layout;
    } catch (_) {}
  };

  window.VF.loadUserPrefsFromStorage = function() {
    try {
      const state = window.VF.state;
      if (!state) return;
      let savedId = 9;
      let savedLayout = 'RIGHT_DEFAULT';
      if (window.localStorage) {
        const localId = window.localStorage.getItem('VF_EQUIPPED_SHIP_ID');
        const localLayout = window.localStorage.getItem('VF_BUTTON_LAYOUT');
        if (localId && !isNaN(Number(localId))) savedId = Number(localId);
        if (localLayout) savedLayout = localLayout;
      }
      if (savedId === 9 && window.name && window.name.indexOf('VF_SHIP_') === 0) {
        const parts = window.name.split('__');
        const parsedId = parseInt(parts[0].replace('VF_SHIP_', ''), 10);
        if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 32) savedId = parsedId;
        if (parts[1]) savedLayout = parts[1].trim();
      }
      savedId = Math.max(1, Math.min(32, savedId));
      state.equippedRocketId = savedId;
      state.previewRocketId = savedId;
      state.buttonSideLayout = savedLayout;
    } catch (_) {}
  };

  window.VF.persistEquippedShip = function(shipId) {
    if (window.VF.state && shipId !== undefined && shipId !== null) {
      const numericId = Math.max(1, Math.min(32, Number(shipId) || 9));
      window.VF.state.equippedRocketId = numericId;
      window.VF.state.previewRocketId = numericId;
    }
    window.VF.saveUserPrefsToStorage();
  };

  window.VF.applyButtonLayout = function(layoutMode) {
    const state = window.VF.state;
    if (!state) return;
    const mode = layoutMode || state.buttonSideLayout || 'RIGHT_DEFAULT';
    state.buttonSideLayout = mode;
    window.VF.saveUserPrefsToStorage();

    const actionsRight = document.querySelector('.hud-actions-right');
    const joystickZone = document.getElementById('mobile-joystick-zone');
    const selectBox = document.getElementById('select-button-side');
    if (selectBox && selectBox.value !== mode) selectBox.value = mode;

    const isLeft = (mode === 'LEFT_DEFAULT' || mode === 'LEFT_SWAPPED');
    const isSwapped = (mode === 'RIGHT_SWAPPED' || mode === 'LEFT_SWAPPED');

    if (actionsRight) {
      actionsRight.style.flexDirection = isSwapped ? 'row-reverse' : 'row';
      actionsRight.style.left = isLeft ? 'max(16px, env(safe-area-inset-left))' : 'auto';
      actionsRight.style.right = isLeft ? 'auto' : 'max(16px, env(safe-area-inset-right))';
    }
    if (joystickZone) {
      joystickZone.style.right = isLeft ? 'max(16px, env(safe-area-inset-right))' : 'auto';
      joystickZone.style.left = isLeft ? 'auto' : 'max(16px, env(safe-area-inset-left))';
    }
  };

  window.VF.initButtonSideSetting = function() {
    window.VF.loadUserPrefsFromStorage();
    const selectBox = document.getElementById('select-button-side');
    if (selectBox && !selectBox._vfBound) {
      selectBox._vfBound = true;
      selectBox.value = window.VF.state.buttonSideLayout || 'RIGHT_DEFAULT';
      selectBox.addEventListener('change', function(e) {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        window.VF.applyButtonLayout(e.target.value);
      });
    }
    window.VF.applyButtonLayout(window.VF.state.buttonSideLayout || 'RIGHT_DEFAULT');
  };

  // ==========================================================================
  // 3. BOOST CONTROLLER & DIRECT LANDSCAPE LOCK
  // ==========================================================================
  window.VF.syncBoostButtonVisuals = function() {
    const state = window.VF.state;
    if (!state) return;
    const button = document.getElementById('btn-boost');
    const subText = document.getElementById('boost-btn-sub');
    if (!button) return;

    const isLocked = (state.directionlessTimer > 0 || state.boosterLockoutTimer > 0);
    if (isLocked) {
      state.boostToggledOn = false;
      state.boosting = false;
      state.isBoosting = false;
      button.classList.remove('active-boost-glow', 'pressed');
      button.classList.add('locked');
      button.style.boxShadow = '';
      button.style.borderColor = '';
      button.style.transform = '';
      if (subText) {
        subText.textContent = state.directionlessTimer > 0
          ? ('EMP ' + state.directionlessTimer.toFixed(1) + 's')
          : ('LOCKED ' + state.boosterLockoutTimer.toFixed(1) + 's');
      }
      return;
    }

    button.classList.remove('locked');
    const isActive = Boolean((state.boostToggledOn || state.boosting) && state.inGame && !state.paused && !state.crashed);
    state.boosting = isActive;
    state.isBoosting = isActive;

    if (isActive) {
      button.classList.add('active-boost-glow', 'pressed');
      button.style.boxShadow = '0 0 28px #00f0ff, inset 0 0 18px #00f0ff';
      button.style.borderColor = '#ffffff';
      button.style.transform = 'scale(1.06)';
      if (subText) {
        subText.textContent = 'ACTIVE · ON';
        subText.style.color = '#ffffff';
      }
    } else {
      button.classList.remove('active-boost-glow', 'pressed');
      button.style.boxShadow = '';
      button.style.borderColor = '';
      button.style.transform = '';
      if (subText) {
        subText.textContent = 'TURBO';
        subText.style.color = '';
      }
    }
  };

  window.VF.forceResetBoostToggleState = function() {
    const state = window.VF.state;
    if (state) {
      state.boostToggledOn = false;
      state.isBoosting = false;
      state.boosting = false;
    }
    const button = document.getElementById('btn-boost');
    const subText = document.getElementById('boost-btn-sub');
    if (button) {
      button.classList.remove('active-boost-glow', 'pressed', 'locked');
      button.style.boxShadow = '';
      button.style.borderColor = '';
      button.style.transform = '';
    }
    if (subText) {
      subText.textContent = 'TURBO';
      subText.style.color = '';
    }
  };

  window.VF.setBoostingState = function(active) {
    const state = window.VF.state;
    if (!state || !state.inGame || state.paused || state.crashed) {
      window.VF.forceResetBoostToggleState();
      return;
    }
    if (active && (state.directionlessTimer > 0 || state.boosterLockoutTimer > 0)) {
      window.VF.forceResetBoostToggleState();
      if (window.VF.AudioEngine && window.VF.AudioEngine.playBoosterLockSFX) window.VF.AudioEngine.playBoosterLockSFX();
      if (window.VF.showCombatAlert) window.VF.showCombatAlert('BOOSTERS LOCKED!', false, 1400);
      return;
    }
    const nextState = Boolean(active);
    if (nextState && !state.boosting && window.VF.AudioEngine && window.VF.AudioEngine.playBoostSFX) {
      window.VF.AudioEngine.playBoostSFX();
    }
    state.boostToggledOn = nextState;
    state.boosting = nextState;
    state.isBoosting = nextState;
    window.VF.syncBoostButtonVisuals();
  };

  window.VF.toggleBoostLock = function() {
    const state = window.VF.state;
    if (!state || !state.inGame || !state.alive || state.crashed || state.paused) return;
    window.VF.setBoostingState(!state.boostToggledOn);
  };

  window.VF.lockLandscapeOrientation = function() {
    try {
      if (window.screen && window.screen.orientation && typeof window.screen.orientation.lock === 'function') {
        window.screen.orientation.lock('landscape').catch(function() {});
      } else if (window.screen && typeof window.screen.lockOrientation === 'function') {
        window.screen.lockOrientation('landscape');
      }
    } catch (_) {}
  };

  window.VF.checkOrientationLock = function() {
    const state = window.VF.state;
    if (!state) return;
    state.isPortraitBlocked = false;
    const overlay = document.getElementById('landscape-lock-overlay');
    if (overlay) {
      overlay.classList.remove('force-show');
      overlay.style.display = 'none';
    }
    if (state.isMobile) window.VF.lockLandscapeOrientation();
  };

  window.addEventListener('resize', window.VF.checkOrientationLock);
  window.addEventListener('orientationchange', function() {
    window.VF.checkOrientationLock();
    if (typeof window.VF.resizeRenderersImmediate === 'function') {
      setTimeout(window.VF.resizeRenderersImmediate, 120);
    }
  });

  ['touchstart', 'click'].forEach(function(evt) {
    window.addEventListener(evt, function() {
      window.VF.lockLandscapeOrientation();
    }, { passive: true });
  });

  // ==========================================================================
  // 4. KEYBOARD, KALMAN GYROSCOPE & DEVICE LAYOUT
  // ==========================================================================
  function updateKeyboardAxes() {
    const state = window.VF.state;
    if (!state) return;
    const k = (state && state.keys) || window.VF.keys || {};
    let ix = 0.0;
    let iy = 0.0;
    if (k.left || k.KeyA || k.ArrowLeft) ix -= 1.0;
    if (k.right || k.KeyD || k.ArrowRight) ix += 1.0;
    if (k.down || k.KeyS || k.ArrowDown) iy -= 1.0;
    if (k.up || k.KeyW || k.ArrowUp) iy += 1.0;

    if (ix !== 0.0 || iy !== 0.0) {
      state.inputX = ix;
      state.inputY = iy;
      state.usingCursor = false;
    } else if (!state.isMobile) {
      state.inputX = 0.0;
      state.inputY = 0.0;
    }
  }

  let lastKeyTime = 0;
  let lastKeyDir = 0;

  window.addEventListener('keydown', function(e) {
    const state = window.VF.state;
    if (!state) return;
    state.keys = state.keys || window.VF.keys || {};
    window.VF.keys = state.keys;

    if (state.directionlessTimer <= 0) {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') { state.keys.left = true; state.keys[e.code] = true; }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') { state.keys.right = true; state.keys[e.code] = true; }
      if (e.code === 'KeyW' || e.code === 'ArrowUp') { state.keys.up = true; state.keys[e.code] = true; }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') { state.keys.down = true; state.keys[e.code] = true; }
      updateKeyboardAxes();
    }

    if (state.inGame && !state.paused && !e.repeat) {
      const now = performance.now();
      let dir = 0;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') dir = -1;
      else if (e.code === 'KeyD' || e.code === 'ArrowRight') dir = 1;
      if (dir !== 0) {
        if (lastKeyDir === dir && (now - lastKeyTime) <= 260) {
          if (typeof window.VF.triggerBarrelRoll === 'function') window.VF.triggerBarrelRoll(dir);
          lastKeyTime = 0;
          lastKeyDir = 0;
        } else {
          lastKeyTime = now;
          lastKeyDir = dir;
        }
      }
    }

    if ((e.code === 'KeyQ' || e.code === 'KeyR') && !e.repeat && state.inGame && !state.paused) {
      if (typeof window.VF.triggerBarrelRoll === 'function') window.VF.triggerBarrelRoll(e.code === 'KeyQ' ? -1 : 1);
    }
    if (e.code === 'Space' && state.inGame && !state.paused) {
      e.preventDefault();
      state.keys.Space = true;
      window.VF.setBoostingState(true);
    }
    if ((e.code === 'KeyF' || e.code === 'KeyE' || e.code === 'Enter') && !e.repeat && state.inGame) {
      if (typeof window.VF.fireOneShot === 'function') window.VF.fireOneShot();
    }
    if (e.code === 'Escape' && state.inGame) {
      if (typeof window.VF.togglePause === 'function') window.VF.togglePause();
    }
  });

  window.addEventListener('keyup', function(e) {
    const state = window.VF.state;
    if (!state) return;
    state.keys = state.keys || window.VF.keys || {};
    window.VF.keys = state.keys;

    if (e.code === 'KeyA' || e.code === 'ArrowLeft') { state.keys.left = false; delete state.keys[e.code]; }
    if (e.code === 'KeyD' || e.code === 'ArrowRight') { state.keys.right = false; delete state.keys[e.code]; }
    if (e.code === 'KeyW' || e.code === 'ArrowUp') { state.keys.up = false; delete state.keys[e.code]; }
    if (e.code === 'KeyS' || e.code === 'ArrowDown') { state.keys.down = false; delete state.keys[e.code]; }
    if (e.code === 'Space') {
      delete state.keys.Space;
      window.VF.setBoostingState(false);
    }
    updateKeyboardAxes();
  });

  let rawBetaAngle = null;
  let rawGammaAngle = null;

  window.VF.calibrateGyroToRestingAngle = function() {
    const state = window.VF.state;
    if (!state) return;
    if (rawGammaAngle !== null && rawBetaAngle !== null) {
      state.gyroBaseGamma = rawGammaAngle;
      state.gyroBaseBeta = rawBetaAngle;
    } else {
      state.gyroBaseGamma = null;
      state.gyroBaseBeta = null;
    }
    state.gyroCurrentX = 0;
    state.gyroCurrentY = 0;
  };

  window.VF.requestGyroPermissionAndCalibrate = function() {
    window.VF.lockLandscapeOrientation();
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(function(res) { if (res === 'granted') window.VF.calibrateGyroToRestingAngle(); })
          .catch(function() {});
      } else {
        window.VF.calibrateGyroToRestingAngle();
      }
    } catch (_) {}
  };

  window.addEventListener('deviceorientation', function(e) {
    const state = window.VF.state;
    if (!state || !state.isMobile || e.gamma === null || e.beta === null) return;
    rawBetaAngle = e.beta;
    rawGammaAngle = e.gamma;
    const gyroActive = Boolean(state.gyroEnabled || (state.inputOverride === 'gyro'));
    if (!gyroActive || state.directionlessTimer > 0) return;

    if (state.gyroBaseGamma === null || state.gyroBaseBeta === null) {
      state.gyroBaseGamma = e.gamma;
      state.gyroBaseBeta = e.beta;
    }

    const angle = (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number')
      ? window.screen.orientation.angle
      : (typeof window.orientation === 'number' ? window.orientation : 90);
    const sign = (angle === -90 || angle === 270) ? -1 : 1;

    let rawX = sign * (e.beta - state.gyroBaseBeta);
    let rawY = -sign * (e.gamma - state.gyroBaseGamma);
    if (Math.abs(rawX) < 1.1) rawX = 0;
    if (Math.abs(rawY) < 1.1) rawY = 0;

    const clampedX = Math.max(-28, Math.min(28, rawX)) / 28;
    const clampedY = Math.max(-28, Math.min(28, rawY)) / 28;

    state.gyroCurrentX = window.VF.lerp ? window.VF.lerp(state.gyroCurrentX, clampedX, 0.38) : clampedX;
    state.gyroCurrentY = window.VF.lerp ? window.VF.lerp(state.gyroCurrentY, clampedY, 0.38) : clampedY;
    state.inputX = state.gyroCurrentX;
    state.inputY = state.gyroCurrentY;
    state.usingCursor = false;
  });

  window.VF.syncMobileGyroUI = function() {
    const state = window.VF.state;
    if (!state) return;
    state.mobileInputMode = state.gyroEnabled ? 'GYRO' : 'JOYSTICK';
    const toggleBtn = document.getElementById('btn-gyro-toggle');
    const recenterBtn = document.getElementById('btn-gyro-recenter');
    const joystickPad = document.getElementById('mobile-joystick-zone');
    if (!toggleBtn || !recenterBtn || !joystickPad) return;

    toggleBtn.style.display = state.isMobile ? 'inline-block' : 'none';
    recenterBtn.style.display = (state.isMobile && state.gyroEnabled) ? 'inline-block' : 'none';
    toggleBtn.textContent = state.gyroEnabled ? 'GYRO: ON' : 'JOYSTICK';

    const showJoystick = Boolean(state.isMobile || state.inputOverride === 'joystick');
    joystickPad.style.display = showJoystick ? 'flex' : 'none';
    joystickPad.style.opacity = (state.isMobile && state.gyroEnabled) ? '0.55' : '0.92';
    window.VF.applyButtonLayout(state.buttonSideLayout);
  };

  window.VF.updateDeviceLayout = function() {
    const state = window.VF.state;
    if (!state) return;
    const isTouchDevice = window.VF.detectMobileHardware ? window.VF.detectMobileHardware() : false;
    if (state.inputOverride === 'desktop') state.isMobile = false;
    else if (state.inputOverride === 'gyro') { state.isMobile = true; state.gyroEnabled = true; }
    else if (state.inputOverride === 'joystick') { state.isMobile = true; state.gyroEnabled = false; }
    else state.isMobile = isTouchDevice;
    window.VF.checkOrientationLock();
    window.VF.syncMobileGyroUI();
  };

  // ==========================================================================
  // 5. MULTIPLAYER SPAWN FORMATION, WORKER HEARTBEAT & WIN/ELIMINATION LOGIC
  // ==========================================================================
  window.VF.getMyTeamNumber = function() {
    const seat = (window.VF.state && window.VF.state.mySeat) || '1A';
    return String(seat).indexOf('2') === 0 ? 2 : 1;
  };

  window.VF.getConnectedHumanTeamSeats = function(teamNum) {
    const keys = teamNum === 1 ? ['1A', '1B'] : ['2A', '2B'];
    const slots = (window.VF.state && window.VF.state.lobbySlots) || {};
    return keys.filter(function(k) { return Boolean(slots[k] && slots[k].occupantId); });
  };

  window.VF.computeTightFormationCoords = function(indexInList, totalCount) {
    if (totalCount <= 1) return [0, -3.0];
    if (totalCount === 2) return indexInList === 0 ? [-2.4, -3.0] : [2.4, -3.0];
    const spreadX = ((indexInList / Math.max(1, totalCount - 1)) * 2 - 1) * 3.2;
    const rowY = (indexInList % 2 === 0) ? -3.4 : -1.9;
    return [spreadX, rowY];
  };

  window.VF.setSafeSpawnCoordinates = function() {
    const st = window.VF.state;
    if (!st) return;
    window.VF.syncLegacySlotsFromDictionary();

    if (st.mode === 'MP_TEAM') {
      const seatOrder = ['1A', '1B', '2A', '2B'];
      const occupied = seatOrder.filter(function(k) { return Boolean(st.lobbySlots && st.lobbySlots[k] && st.lobbySlots[k].occupantId); });
      const myIdx = Math.max(0, occupied.indexOf(st.mySeat));
      const coords = window.VF.computeTightFormationCoords(myIdx, Math.max(2, occupied.length));
      st.playerX = coords[0];
      st.playerY = coords[1];
      st.targetX = coords[0];
      st.targetY = coords[1];
      st.myTeam = window.VF.getMyTeamNumber();
      st.mySlotLabel = 'T' + st.myTeam + ' (' + st.mySeat + ')';
    } else if (st.mode === 'MP_SOLO') {
      const occupied = (st.soloSlots || []).filter(function(s) { return Boolean(s.occupantId); });
      const myIdx = Math.max(0, occupied.findIndex(function(s) { return s.occupantId === st.localPeerId; }));
      const coords = window.VF.computeTightFormationCoords(myIdx, Math.max(2, occupied.length));
      st.playerX = coords[0];
      st.playerY = coords[1];
      st.targetX = coords[0];
      st.targetY = coords[1];
      st.myTeam = st.mySoloSlot || 1;
      st.mySlotLabel = 'P' + (st.mySoloSlot || 1);
    } else {
      st.playerX = 0;
      st.playerY = -3.0;
      st.targetX = 0;
      st.targetY = -3.0;
    }
  };

  window.VF.preSpawnLobbyRemotePlayers = function() {
    const st = window.VF.state;
    if (!st || !window.VF.getOrCreateRemotePlayer) return;
    window.VF.syncLegacySlotsFromDictionary();

    if (st.mode === 'MP_SOLO') {
      const occupied = (st.soloSlots || []).filter(function(s) { return Boolean(s.occupantId); });
      occupied.forEach(function(s, idx) {
        if (s.occupantId && s.occupantId !== st.localPeerId) {
          const coords = window.VF.computeTightFormationCoords(idx, Math.max(2, occupied.length));
          window.VF.getOrCreateRemotePlayer(s.occupantId, {
            peerId: s.occupantId,
            shipId: s.rocketId || 17,
            team: s.slotNum,
            slotLabel: 'P' + s.slotNum,
            x: coords[0],
            y: coords[1],
            distance: 0,
            hull: 100,
            alive: true
          });
        }
      });
    } else if (st.mode === 'MP_TEAM') {
      const seatOrder = ['1A', '1B', '2A', '2B'];
      const occupied = seatOrder.filter(function(k) { return Boolean(st.lobbySlots && st.lobbySlots[k] && st.lobbySlots[k].occupantId); });
      occupied.forEach(function(sKey, idx) {
        const info = st.lobbySlots[sKey];
        if (info && info.occupantId && info.occupantId !== st.localPeerId) {
          const coords = window.VF.computeTightFormationCoords(idx, Math.max(2, occupied.length));
          const tm = sKey.indexOf('1') === 0 ? 1 : 2;
          window.VF.getOrCreateRemotePlayer(info.occupantId, {
            peerId: info.occupantId,
            shipId: info.rocketId || 17,
            team: tm,
            slotLabel: 'T' + tm + ' (' + sKey + ')',
            x: coords[0],
            y: coords[1],
            distance: 0,
            hull: 100,
            alive: true
          });
        }
      });
    }
  };

  window.VF.computeDeterministicBaseMeters = function(elapsedSec) {
    const ramp = Math.min(1.0, elapsedSec / 4.0);
    const baseSpd = window.VF.BASE_MP_SPEED || 40.0;
    return elapsedSec * baseSpd * (0.35 + 0.65 * ramp) * (1.0 + 0.015 * (elapsedSec / 10.0));
  };

  window.VF.broadcastLocalPlayerState = function() {
    const st = window.VF.state;
    if (!st || !st.inGame || !st.isMultiplayer || !window.VF.NetworkManager) return;
    window.VF.NetworkManager.sendPacket({
      type: 'PLAYER_STATE',
      roomCode: st.roomCode,
      senderId: st.localPeerId,
      peerId: st.localPeerId,
      shipId: st.equippedRocketId,
      team: st.myTeam || 1,
      slotLabel: st.mySlotLabel || ('P' + (st.mySoloSlot || 1)),
      x: st.playerX,
      y: st.playerY,
      distance: st.distance,
      tilt: st.playerTilt,
      alive: !st.crashed,
      hull: st.health,
      goldenShield: st.goldenShieldTimer > 0
    });
  };

  window.VF.applyIncomingWeaponHit = function(weaponType, damageAmount) {
    const state = window.VF.state;
    if (!state || !state.inGame || state.invulnTimer > 0) return;
    if (window.VF.AudioEngine && window.VF.AudioEngine.shieldHit) window.VF.AudioEngine.shieldHit();

    const nextHealth = Math.max(0, state.health - damageAmount);
    window.VF.updateHealthHUD(nextHealth);
    if (typeof window.VF.triggerGoldenHexShieldActivation === 'function') {
      window.VF.triggerGoldenHexShieldActivation(1.45);
    }

    if (weaponType === 'MISSILE' || weaponType === 'PLASMA') {
      state.knockbackVx = (Math.random() < 0.5 ? -1 : 1) * 11.5;
      state.knockbackVy = (Math.random() - 0.5) * 9.0;
    } else if (weaponType === 'EMP') {
      window.VF.setBoostingState(false);
      state.speedDebuffTimer = 2.4;
      state.lightDimFactor = 0.15;
    } else if (weaponType === 'RAILGUN') {
      state.knockbackVx = (Math.random() < 0.5 ? -1 : 1) * 14.0;
    }

    if (typeof window.VF.updateShipStatusHUD === 'function') window.VF.updateShipStatusHUD();
    window.VF.broadcastLocalPlayerState();
    if (typeof window.VF.showHudAlert === 'function') {
      window.VF.showHudAlert('ONE-SHOT HIT! HEALTH: ' + Math.round(state.health) + '%', '#ff2a55', 2200);
    }

    if (state.health <= 0) {
      if (state.mode === 'MP_SOLO') {
        window.VF.triggerCrash('Shattered by Rival One-Shot Ultimate Blast!');
      } else if (state.mode === 'MP_TEAM') {
        window.VF.updateHealthHUD(100);
        if (typeof window.VF.updateShipStatusHUD === 'function') window.VF.updateShipStatusHUD();
        window.VF.triggerCrash('One-Shot Breach by Enemy Fire — 1 Team Shield Lost!');
      }
    }
  };

  window.VF.checkSoloLastSurvivorWin = function() {
    const st = window.VF.state;
    if (!st || !st.inGame || st.mode !== 'MP_SOLO' || st.crashed) return;
    const humanOpponents = (st.soloSlots || []).filter(function(s) {
      return s.occupantId && s.occupantId !== st.localPeerId;
    });
    if (humanOpponents.length > 0) {
      const anyOpponentAlive = humanOpponents.some(function(s) { return s.alive !== false; });
      if (!anyOpponentAlive) {
        window.VF.NetworkManager.sendPacket({
          type: 'MATCH_OVER',
          roomCode: st.roomCode,
          winnerId: st.localPeerId,
          reason: 'All rival pilots shattered! Last survivor standing wins!'
        });
        if (typeof window.VF.finishMatchModal === 'function') {
          window.VF.finishMatchModal('SOLO MATCH REPORT', 'SOLO MATCH VICTORY!', 'All rival pilots shattered — Last Survivor Standing!', true);
        }
      }
    }
  };

  window.VF.checkTeamShieldElimination = function() {
    const state = window.VF.state;
    if (!state || !state.inGame || state.mode !== 'MP_TEAM') return false;
    if (state.team1Shields <= 0 || state.team2Shields <= 0) {
      const winningTeam = state.team1Shields <= 0 ? 2 : 1;
      const myTeam = window.VF.getMyTeamNumber();
      const isWin = (myTeam === winningTeam);
      const reason = 'Team ' + (winningTeam === 1 ? 2 : 1) + ' depleted all 3 Shared Shields!';
      if (window.VF.NetworkManager) {
        window.VF.NetworkManager.sendPacket({ type: 'MATCH_OVER', roomCode: state.roomCode, winningTeam: winningTeam, reason: reason });
      }
      if (typeof window.VF.finishMatchModal === 'function') {
        window.VF.finishMatchModal('2v2 TEAM CLASH REPORT', isWin ? 'TEAM ' + myTeam + ' VICTORY!' : 'TEAM ' + myTeam + ' ELIMINATED', reason, isWin);
      }
      return true;
    }
    return false;
  };

  window.VF.evaluateTeamFinishWin = function() {
    const state = window.VF.state;
    if (!state || !state.inGame || state.mode !== 'MP_TEAM') return false;
    const team1Humans = window.VF.getConnectedHumanTeamSeats(1);
    const team2Humans = window.VF.getConnectedHumanTeamSeats(2);
    const team1Done = team1Humans.length > 0 && team1Humans.every(function(k) { return Boolean(state.team1FinishedSeats[k]); }) && state.team1Shields > 0;
    const team2Done = team2Humans.length > 0 && team2Humans.every(function(k) { return Boolean(state.team2FinishedSeats[k]); }) && state.team2Shields > 0;

    if (team1Done || team2Done) {
      const winningTeam = team1Done ? 1 : 2;
      const myTeam = window.VF.getMyTeamNumber();
      const isWin = (myTeam === winningTeam);
      const reason = 'All members of Team ' + winningTeam + ' crossed ' + state.targetWinDistance + 'm first!';
      if (window.VF.NetworkManager) {
        window.VF.NetworkManager.sendPacket({ type: 'MATCH_OVER', roomCode: state.roomCode, winningTeam: winningTeam, reason: reason });
      }
      if (typeof window.VF.finishMatchModal === 'function') {
        window.VF.finishMatchModal('2v2 TEAM CLASH REPORT', isWin ? 'TEAM ' + myTeam + ' VICTORY!' : 'TEAM ' + myTeam + ' DEFEAT', reason, isWin);
      }
      return true;
    }
    return false;
  };

  window.VF.updateMultiplayerWorkerTick = function() {
    const st = window.VF.state;
    if (!st || !st.inGame || st.paused || st.crashed) return;
    if (st.mode !== 'MP_SOLO' && st.mode !== 'MP_TEAM') return;

    const nowWall = Date.now();
    const dt = Math.min(0.1, Math.max(0.005, (nowWall - (st.lastWorkerTickTime || nowWall)) / 1000));
    st.lastWorkerTickTime = nowWall;

    const elapsedSec = Math.max(0, (nowWall - (st.matchStartTimestamp || nowWall)) / 1000);
    st.elapsedRunTime = elapsedSec;
    const debuffMult = st.speedDebuffTimer > 0 ? 0.68 : 1.0;

    if (st.boosting || st.boostToggledOn) {
      st.boostBonusMeters = (st.boostBonusMeters || 0) + (window.VF.BASE_MP_SPEED || 40) * 0.45 * debuffMult * dt;
    }

    const baseMeters = window.VF.computeDeterministicBaseMeters(elapsedSec);
    const nextDist = baseMeters + (st.boostBonusMeters || 0);
    st.currentSpeed = Math.max(36, (nextDist - st.distance) / dt);
    st.distance = nextDist;
    st.score = Math.max(st.score || 0, st.distance * 3.2);

    if (window.VF.playerGroup) {
      window.VF.playerGroup.position.z = -st.distance + (st.recoilOffsetZ || 0);
    }

    const scoreEl = document.getElementById('hud-score') || document.getElementById('hud-score-val');
    const distEl = document.getElementById('hud-distance') || document.getElementById('hud-dist-val');
    if (scoreEl) scoreEl.textContent = Math.floor(st.score || 0).toLocaleString();
    if (distEl) distEl.textContent = Math.floor(st.distance || 0) + ' m';

    window.VF.broadcastLocalPlayerState();

    if (st.distance >= (st.targetWinDistance || 1500)) {
      if (st.mode === 'MP_SOLO') {
        window.VF.NetworkManager.sendPacket({
          type: 'MATCH_OVER',
          roomCode: st.roomCode,
          winnerId: st.localPeerId,
          reason: 'Pilot P' + (st.mySoloSlot || 1) + ' crossed the ' + st.targetWinDistance + 'm Finish Line first!'
        });
        if (typeof window.VF.finishMatchModal === 'function') {
          window.VF.finishMatchModal('SOLO MATCH REPORT', 'SOLO MATCH VICTORY!', 'Crossed the ' + st.targetWinDistance + 'm Finish Line in 1st Place!', true);
        }
      } else if (st.mode === 'MP_TEAM') {
        const myTeam = window.VF.getMyTeamNumber();
        const myTeamSet = myTeam === 1 ? st.team1FinishedSeats : st.team2FinishedSeats;
        if (!myTeamSet[st.mySeat]) {
          myTeamSet[st.mySeat] = true;
          window.VF.NetworkManager.sendPacket({ type: 'TEAM_MEMBER_FINISHED', roomCode: st.roomCode, team: myTeam, seat: st.mySeat });
          if (typeof window.VF.updateTeamShieldsHUD === 'function') window.VF.updateTeamShieldsHUD();
          if (!window.VF.evaluateTeamFinishWin() && typeof window.VF.showHudAlert === 'function') {
            window.VF.showHudAlert('FINISHED ' + st.targetWinDistance + 'M — WAITING FOR TEAMMATE!', '#00ff88', 3500);
          }
        }
      }
    }
  };

  window.VF.initBackgroundSafeWorker = function() {
    let workerStarted = false;
    try {
      const blob = new Blob(["setInterval(function(){postMessage('tick');},40);"], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const syncWorker = new Worker(workerUrl);
      syncWorker.onmessage = function() { window.VF.updateMultiplayerWorkerTick(); };
      workerStarted = true;
    } catch (_) {}
    if (!workerStarted) {
      setInterval(window.VF.updateMultiplayerWorkerTick, 40);
    }
  };
  window.VF.initBackgroundSafeWorker();

  // ==========================================================================
  // 6. GAME INITIALIZATION (`VF.startGame`)
  // ==========================================================================
  window.VF.startGame = function(selectedMode, fromNetwork, syncTimestamp) {
    const state = window.VF.state;
    if (!state) return;

    if (window.VF.NetworkManager && window.VF.NetworkManager.clearTimers) {
      window.VF.NetworkManager.clearTimers();
    }
    window.VF.lockLandscapeOrientation();

    try {
      if (window.VF.AudioEngine) {
        if (window.VF.AudioEngine.init) window.VF.AudioEngine.init();
        if (window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
      }
    } catch (_) {}

    if (state.isMobile && state.gyroEnabled) {
      window.VF.requestGyroPermissionAndCalibrate();
    }

    state.inIntro = false;
    if (window.VF.introLaunchBayGroup) {
      window.VF.introLaunchBayGroup.visible = false;
    }

    const combatAlert = document.getElementById('hud-combat-alert');
    if (combatAlert) combatAlert.classList.remove('visible', 'surge');

    if (typeof window.VF.clearAllRemoteShipsAndProjectiles === 'function') {
      window.VF.clearAllRemoteShipsAndProjectiles();
    }

    if (!fromNetwork && window.VF.SecurityManager && window.VF.SecurityManager.generateSecureSeed) {
      window.VF.setMatchSeed(window.VF.SecurityManager.generateSecureSeed());
    }

    const startWallTime = syncTimestamp || Date.now();
    state.mode = selectedMode;
    state.gameMode = selectedMode;
    state.isMultiplayer = (selectedMode === 'MP_SOLO' || selectedMode === 'MP_TEAM');
    state.screen = 'PLAYING';
    state.inGame = true;
    state.paused = false;
    state.crashed = false;
    state.alive = true;
    state.score = 0;
    state.distance = 0;
    state.boostBonusMeters = 0;
    state.matchStartWallTime = startWallTime;
    state.matchStartTimestamp = startWallTime;
    state.lastWorkerTickTime = Date.now();
    state.current500mStage = 0;
    state.elapsedRunTime = 0;
    state.currentSpeed = 44.0;
    state.inputX = 0;
    state.inputY = 0;
    state.usingCursor = !state.isMobile;

    window.VF.forceResetBoostToggleState();
    state.slowMoTimer = 0;
    state.freezeTurbineTimer = 0;
    state.flickerTimer = 0;
    state.lightDimFactor = 1.0;

    state.health = 100;
    state.hullArmor = 100;
    state.droneBallHits = 0;
    state.droneHitsTaken = 0;
    state.droneHitCount = 0;
    state.directionlessTimer = 0;
    state.boosterLockoutTimer = 0;
    state.goldenShieldTimer = 0;

    state.weaponCooldown = 0;
    state.weaponCharging = false;
    state.weaponOvercharged = false;
    state.hyperShieldTimer = 0;
    state.recoilOffsetZ = 0;
    state.fovPunch = 0;
    state.knockbackVx = 0;
    state.knockbackVy = 0;
    state.speedDebuffTimer = 0;

    state.comboMultiplier = 1.0;
    state.huntersDestroyed = 0;
    state.lockdownsBreached = 0;
    state.nearMissCount = 0;
    state.topSpeedReached = 0;

    state.team1Shields = 3;
    state.team2Shields = 3;
    state.team1Combo = 1;
    state.team2Combo = 1;
    state.team1FinishedSeats = {};
    state.team2FinishedSeats = {};
    state.invulnTimer = 0;
    if (state.soloSlots) {
      state.soloSlots.forEach(function(slot) { slot.alive = true; });
    }

    if (typeof window.VF.resetTunnelForMatch === 'function') {
      window.VF.resetTunnelForMatch(selectedMode);
    } else if (typeof window.VF.clearDebrisAndResetExteriorVista === 'function') {
      window.VF.clearDebrisAndResetExteriorVista();
    }
    window.VF.setSafeSpawnCoordinates();
    state.goldenShieldTimer = 0;

    if (typeof window.VF.equipSpacecraftModel === 'function') {
      window.VF.equipSpacecraftModel(state.equippedRocketId);
    }

    if (window.VF.playerGroup) {
      window.VF.playerGroup.visible = true;
      window.VF.playerGroup.position.set(state.playerX, state.playerY, 0);
      if (window.VF.playerGroup.userData && window.VF.playerGroup.userData.craftMesh) {
        window.VF.playerGroup.userData.craftMesh.visible = true;
      }
    }

    if (state.isMultiplayer) {
      window.VF.preSpawnLobbyRemotePlayers();
      window.VF.broadcastLocalPlayerState();
      setTimeout(window.VF.broadcastLocalPlayerState, 80);
    }

    window.VF.updateHealthHUD(100);
    if (typeof window.VF.updateTeamShieldsHUD === 'function') window.VF.updateTeamShieldsHUD();
    if (typeof window.VF.updateShipStatusHUD === 'function') window.VF.updateShipStatusHUD();
    window.VF.updateDroneStatusHUD();
    window.VF.syncBoostButtonVisuals();
    window.VF.applyButtonLayout(state.buttonSideLayout);

    const teamShieldsBox = document.getElementById('hud-team-shields-box');
    if (teamShieldsBox) {
      teamShieldsBox.style.display = (selectedMode === 'MP_TEAM') ? 'block' : 'none';
    }

    if (typeof window.VF.switchScreen === 'function') {
      window.VF.switchScreen('hud-screen');
    }
    window.VF.updateDeviceLayout();
  };

  // ==========================================================================
  // 7. CROSS-CITY WEBRTC BRIDGE (STUN + OPENRELAY TURN) & PACKET ROUTER
  // ==========================================================================
  window.VF.NetBridge = {
    peer: null,
    hostConn: null,
    clientConns: [],
    scriptLoading: false,
    currentRoomId: '',

    ensurePeerScript: function(callback) {
      if (typeof window.Peer === 'function') {
        if (callback) callback();
        return;
      }
      if (this.scriptLoading) return;
      this.scriptLoading = true;
      try {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = function() {
          window.VF.NetBridge.scriptLoading = false;
          if (callback) callback();
        };
        script.onerror = function() { window.VF.NetBridge.scriptLoading = false; };
        document.head.appendChild(script);
      } catch (_) {
        this.scriptLoading = false;
      }
    },

    teardown: function() {
      this.currentRoomId = '';
      if (this.hostConn) { try { this.hostConn.close(); } catch (_) {} this.hostConn = null; }
      for (let i = 0; i < this.clientConns.length; i++) {
        try { this.clientConns[i].close(); } catch (_) {}
      }
      this.clientConns.length = 0;
      if (this.peer) { try { this.peer.destroy(); } catch (_) {} this.peer = null; }
    },

    openRoom: function(isHost, roomCode) {
      const self = this;
      const cleanRoomCode = String(roomCode || '').replace(/[^A-Z0-9-]/g, '');
      if (!cleanRoomCode) return;
      const hostPeerId = 'VF-ROOM-' + cleanRoomCode;

      this.ensurePeerScript(function() {
        if (typeof window.Peer !== 'function') return;
        if (window.VF.state.roomCode !== roomCode) return;
        self.teardown();
        self.currentRoomId = hostPeerId;

        const peerConfig = {
          debug: 1,
          config: {
            iceTransportPolicy: 'all',
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' },
              { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
              { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
              { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' }
            ]
          }
        };

        try {
          if (isHost) {
            const p = new window.Peer(hostPeerId, peerConfig);
            self.peer = p;
            p.on('connection', function(conn) {
              self.clientConns.push(conn);
              conn.on('data', function(data) {
                if (data && typeof data === 'object') {
                  window.VF.NetworkManager.handleIncomingPacket(data);
                  for (let i = 0; i < self.clientConns.length; i++) {
                    const c = self.clientConns[i];
                    if (c && c !== conn && c.open) {
                      try { c.send(data); } catch (_) {}
                    }
                  }
                }
              });
              conn.on('open', function() {
                if (window.VF.state.isHost && window.VF.state.roomCode) {
                  window.VF.NetworkManager.broadcastLobbySettings();
                }
              });
            });
          } else {
            const p = new window.Peer(undefined, peerConfig);
            self.peer = p;
            p.on('open', function() {
              if (window.VF.state.roomCode !== roomCode) return;
              try {
                const conn = p.connect(hostPeerId, { reliable: true });
                self.hostConn = conn;
                conn.on('open', function() {
                  const state = window.VF.state;
                  window.VF.NetworkManager.sendPacket({
                    type: 'JOIN_REQ',
                    roomCode: state.roomCode,
                    senderId: state.localPeerId,
                    name: 'PILOT ' + state.localPeerId.slice(-2),
                    shipId: state.equippedRocketId
                  });
                });
                conn.on('data', function(data) {
                  if (data && typeof data === 'object') {
                    window.VF.NetworkManager.handleIncomingPacket(data);
                  }
                });
              } catch (_) {}
            });
          }
        } catch (_) {}
      });
    },

    send: function(signedPacket) {
      try {
        if (window.VF.state.isHost) {
          for (let i = this.clientConns.length - 1; i >= 0; i--) {
            const client = this.clientConns[i];
            if (client && client.open) {
              try { client.send(signedPacket); } catch (_) {}
            }
          }
        } else if (this.hostConn && this.hostConn.open) {
          this.hostConn.send(signedPacket);
        }
      } catch (_) {}
    }
  };

  window.VF.NetworkManager = {
    bc: null,
    hostBeaconTimer: null,
    joinHandshakeTimer: null,
    joinConfirmed: false,

    initChannel: function() {
      const self = this;
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          this.bc = new BroadcastChannel('VF_TURBO_NET_V14');
          this.bc.onmessage = function(e) { self.handleIncomingPacket(e.data); };
        }
      } catch (_) {}
    },

    clearTimers: function() {
      if (this.hostBeaconTimer) { clearInterval(this.hostBeaconTimer); this.hostBeaconTimer = null; }
      if (this.joinHandshakeTimer) { clearInterval(this.joinHandshakeTimer); this.joinHandshakeTimer = null; }
    },

    sendPacket: function(payload) {
      const base = Object.assign({}, payload, {
        roomCode: payload.roomCode || window.VF.state.roomCode || 'GLOBAL',
        senderId: payload.senderId || payload.peerId || window.VF.state.localPeerId,
        peerId: payload.peerId || payload.senderId || window.VF.state.localPeerId
      });
      const signed = (window.VF.SecurityManager && window.VF.SecurityManager.signPacket)
        ? window.VF.SecurityManager.signPacket(base)
        : base;
      try { if (this.bc) this.bc.postMessage(signed); } catch (_) {}
      if (window.VF.NetBridge) window.VF.NetBridge.send(signed);
    },

    discoverActiveRooms: function() {
      this.sendPacket({
        type: 'DISCOVER_ROOMS',
        roomCode: 'GLOBAL',
        mode: window.VF.state.mpSubMode,
        senderId: window.VF.state.localPeerId
      });
    },

    broadcastLobbySettings: function() {
      const state = window.VF.state;
      if (!state.isHost || !state.roomCode) return;
      window.VF.syncLegacySlotsFromDictionary();
      window.VF.syncLobbyInfoText();
      this.sendPacket({
        type: 'LOBBY_STATE_SYNC',
        roomCode: state.roomCode,
        mode: state.mpSubMode,
        targetWinDistance: state.targetWinDistance,
        themeIndex: state.hostThemeIdx,
        slots: state.lobbySlots,
        lobbySlots: state.lobbySlots
      });
    },

    assignJoinerToSlot: function(joinerId, shipId, customName) {
      const state = window.VF.state;
      const keys = state.mpSubMode === 'SOLO'
        ? ['1','2','3','4','5','6','7','8','9','10']
        : ['1A','2A','1B','2B'];

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (state.lobbySlots[key] && state.lobbySlots[key].occupantId === joinerId) {
          if (shipId) state.lobbySlots[key].rocketId = shipId;
          return;
        }
      }
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!state.lobbySlots[key] || !state.lobbySlots[key].occupantId) {
          state.lobbySlots[key] = {
            occupantId: joinerId,
            label: customName || (state.mpSubMode === 'SOLO' ? ('PILOT P' + key) : ('PILOT ' + key)),
            ready: false,
            rocketId: shipId || 17,
            alive: true
          };
          return;
        }
      }
    },

    handleIncomingPacket: function(pkt) {
      if (!pkt || typeof pkt !== 'object') return;
      const state = window.VF.state;
      const packetRoom = pkt.roomCode || pkt.room;
      const packetPeer = pkt.senderId || pkt.peerId;
      if (!packetPeer || packetPeer === state.localPeerId) return;

      if (pkt.type === 'DISCOVER_ROOMS') {
        const inLobby = (state.subStep === 'menu-sub-solo-lobby' || state.subStep === 'menu-sub-team-lobby');
        if (state.isHost && state.roomCode && !state.inGame && inLobby) {
          this.broadcastLobbySettings();
        }
        return;
      }

      if (pkt.type === 'LOBBY_STATE_SYNC' && !state.isHost && state.subStep === 'menu-sub-join-input') {
        const matches = (pkt.mode === state.mpSubMode) || (typeof packetRoom === 'string' && packetRoom.indexOf(state.mpSubMode + '-') === 0);
        if (matches && packetRoom) {
          const input = document.getElementById('join-room-input');
          const statusMsg = document.getElementById('join-status-msg');
          if (input && !input.value.trim()) input.value = packetRoom;
          if (statusMsg && !this.joinConfirmed) {
            statusMsg.textContent = 'Active Room Detected: ' + packetRoom + ' — Click JOIN ROOM!';
            statusMsg.style.color = '#00ff88';
          }
        }
      }

      if (!state.roomCode || packetRoom !== state.roomCode) return;

      if (pkt.type === 'JOIN_REQ' && state.isHost) {
        const shipId = Number(pkt.shipId) || 17;
        this.assignJoinerToSlot(packetPeer, shipId, pkt.name);
        if (state.mpSubMode === 'SOLO') window.VF.renderSoloRosterGrids();
        else window.VF.renderSeatMatrices();
        window.VF.evaluateHostStartUnlock();
        this.broadcastLobbySettings();
      } else if (pkt.type === 'LOBBY_STATE_SYNC') {
        if (pkt.themeIndex !== undefined) state.hostThemeIdx = Number(pkt.themeIndex);
        if (pkt.targetWinDistance) window.VF.setTargetWinDistance(Number(pkt.targetWinDistance), false);
        const incomingSlots = pkt.slots || pkt.lobbySlots;
        if (incomingSlots) {
          state.lobbySlots = incomingSlots;
          window.VF.syncLegacySlotsFromDictionary();
        }
        if (!state.isHost) {
          const keys = state.mpSubMode === 'SOLO' ? ['1','2','3','4','5','6','7','8','9','10'] : ['1A','1B','2A','2B'];
          const assigned = keys.some(function(k) { return state.lobbySlots[k] && state.lobbySlots[k].occupantId === state.localPeerId; });
          if (assigned) {
            this.joinConfirmed = true;
            if (this.joinHandshakeTimer) { clearInterval(this.joinHandshakeTimer); this.joinHandshakeTimer = null; }
            if (state.subStep === 'menu-sub-join-input') {
              window.VF.showMenuSubStep(state.mpSubMode === 'TEAM' ? 'menu-sub-team-lobby' : 'menu-sub-solo-lobby');
            }
          }
        }
        window.VF.syncLobbyInfoText();
        if (state.mpSubMode === 'SOLO') window.VF.renderSoloRosterGrids();
        else window.VF.renderSeatMatrices();
      } else if (pkt.type === 'SWAP_SLOT_REQ' && state.isHost) {
        const targetKey = String(pkt.targetKey || '');
        if (targetKey && (!state.lobbySlots[targetKey] || !state.lobbySlots[targetKey].occupantId)) {
          const keys = state.mpSubMode === 'SOLO' ? ['1','2','3','4','5','6','7','8','9','10'] : ['1A','1B','2A','2B'];
          let oldKey = null;
          keys.forEach(function(k) {
            if (state.lobbySlots[k] && state.lobbySlots[k].occupantId === packetPeer) oldKey = k;
          });
          if (oldKey) {
            state.lobbySlots[targetKey] = Object.assign({}, state.lobbySlots[oldKey], {
              label: state.mpSubMode === 'SOLO' ? ('PILOT P' + targetKey) : ('PILOT ' + targetKey)
            });
            state.lobbySlots[oldKey] = null;
            window.VF.syncLegacySlotsFromDictionary();
            if (state.mpSubMode === 'SOLO') window.VF.renderSoloRosterGrids();
            else window.VF.renderSeatMatrices();
            this.broadcastLobbySettings();
          }
        }
      } else if (pkt.type === 'READY_TOGGLE' && state.isHost) {
        const isReady = Boolean(pkt.ready);
        const shipId = Number(pkt.shipId) || 17;
        this.assignJoinerToSlot(packetPeer, shipId);
        const keys = state.mpSubMode === 'SOLO' ? ['1','2','3','4','5','6','7','8','9','10'] : ['1A','1B','2A','2B'];
        keys.forEach(function(k) {
          if (state.lobbySlots[k] && state.lobbySlots[k].occupantId === packetPeer) {
            state.lobbySlots[k].ready = isReady;
            state.lobbySlots[k].rocketId = shipId;
          }
        });
        window.VF.syncLegacySlotsFromDictionary();
        if (state.mpSubMode === 'SOLO') window.VF.renderSoloRosterGrids();
        else window.VF.renderSeatMatrices();
        window.VF.evaluateHostStartUnlock();
        this.broadcastLobbySettings();
      } else if (pkt.type === 'MATCH_LAUNCH' || pkt.type === 'REMATCH_LAUNCH') {
        this.clearTimers();
        window.VF.setMatchSeed(Number(pkt.seed) || 1337);
        if (pkt.themeIndex !== undefined) state.hostThemeIdx = Number(pkt.themeIndex);
        if (pkt.targetWinDistance) window.VF.setTargetWinDistance(Number(pkt.targetWinDistance), false);
        const incomingSlots = pkt.slots || pkt.lobbySlots;
        if (incomingSlots) {
          state.lobbySlots = incomingSlots;
          window.VF.syncLegacySlotsFromDictionary();
        }
        const wallTimestamp = Number(pkt.sharedStartWallTime || pkt.startTimestamp) || Date.now();
        window.VF.startGame(state.mpSubMode === 'TEAM' ? 'MP_TEAM' : 'MP_SOLO', true, wallTimestamp);
      } else if (pkt.type === 'PLAYER_STATE' && state.inGame) {
        if (window.VF.getOrCreateRemotePlayer) {
          const rp = window.VF.getOrCreateRemotePlayer(packetPeer, pkt);
          if (rp && rp.shipModel && rp.shipModel.userData) {
            const hasGS = Boolean(pkt.goldenShield);
            rp.shipModel.userData.remoteGoldenShield = hasGS;
            if (rp.shipModel.userData.rig) rp.shipModel.userData.rig.remoteGoldenShield = hasGS;
          }
        }
      } else if ((pkt.type === 'ONESHOT_FIRE' || pkt.type === 'ONESHOT_CHARGE_AND_FIRE') && state.inGame) {
        const rp = window.VF.getOrCreateRemotePlayer ? window.VF.getOrCreateRemotePlayer(packetPeer, pkt) : null;
        if (rp && rp.shipModel) {
          const spec = rp.spec || (window.VF.ROCKET_FLEET && window.VF.ROCKET_FLEET[8]);
          window.VF.triggerOneShotAnimation(rp.shipModel, spec, function(firedSpec) {
            if (!state.inGame || !rp.alive) return;
            if (typeof window.VF.launchPooledOneShotBlast === 'function') {
              window.VF.launchPooledOneShotBlast(rp.mesh.position.x, rp.mesh.position.y, rp.mesh.position.z - 2.4, firedSpec, true);
            }
          }, true);
        }
      } else if (pkt.type === 'WEAPON_HIT' && state.inGame && pkt.targetPeerId === state.localPeerId) {
        window.VF.applyIncomingWeaponHit(pkt.weaponType, Number(pkt.damage) || 65);
      } else if (pkt.type === 'SOLO_PLAYER_SHATTERED' && state.inGame && state.mode === 'MP_SOLO') {
        const rp = window.VF.remotePlayers ? window.VF.remotePlayers.get(packetPeer) : null;
        if (rp) {
          rp.alive = false;
          rp.mesh.visible = false;
        }
        if (state.soloSlots) {
          state.soloSlots.forEach(function(s) {
            if (s.occupantId === packetPeer) s.alive = false;
          });
        }
        window.VF.checkSoloLastSurvivorWin();
      } else if ((pkt.type === 'TEAM_SHIELD_SYNC' || pkt.type === 'TEAM_SHIELD_UPDATE') && state.inGame && state.mode === 'MP_TEAM') {
        state.team1Shields = Number(pkt.team1Shields !== undefined ? pkt.team1Shields : pkt.t1Shields);
        state.team2Shields = Number(pkt.team2Shields !== undefined ? pkt.team2Shields : pkt.t2Shields);
        if (typeof window.VF.updateTeamShieldsHUD === 'function') window.VF.updateTeamShieldsHUD();
        window.VF.checkTeamShieldElimination();
      } else if (pkt.type === 'TEAM_MEMBER_FINISHED' && state.inGame && state.mode === 'MP_TEAM') {
        if (pkt.team === 1) state.team1FinishedSeats[pkt.seat] = true;
        if (pkt.team === 2) state.team2FinishedSeats[pkt.seat] = true;
        if (typeof window.VF.updateTeamShieldsHUD === 'function') window.VF.updateTeamShieldsHUD();
        window.VF.evaluateTeamFinishWin();
      } else if (pkt.type === 'MATCH_OVER' && state.inGame) {
        if (state.mode === 'MP_SOLO') {
          const isWinner = (pkt.winnerId === state.localPeerId);
          if (typeof window.VF.finishMatchModal === 'function') {
            window.VF.finishMatchModal('SOLO MATCH REPORT', isWinner ? 'SOLO MATCH VICTORY!' : 'SOLO MATCH DEFEAT', pkt.reason || 'Match completed', isWinner);
          }
        } else if (state.mode === 'MP_TEAM') {
          const myTeam = window.VF.getMyTeamNumber();
          const isWinner = (Number(pkt.winningTeam) === myTeam);
          if (typeof window.VF.finishMatchModal === 'function') {
            window.VF.finishMatchModal('2v2 TEAM CLASH REPORT', isWinner ? 'TEAM ' + myTeam + ' VICTORY!' : 'TEAM ' + myTeam + ' DEFEAT', pkt.reason || 'Match completed', isWinner);
          }
        }
      }
    },

    openSession: function(isHost, code) {
      const self = this;
      const state = window.VF.state;
      this.clearTimers();
      state.isHost = isHost;
      state.roomCode = code;
      state.localReady = false;
      state.interchangeActive = false;
      state.hostSwapSource = null;
      this.joinConfirmed = false;

      if (typeof window.VF.clearAllRemoteShipsAndProjectiles === 'function') {
        window.VF.clearAllRemoteShipsAndProjectiles();
      }
      if (window.VF.NetBridge) {
        window.VF.NetBridge.openRoom(isHost, code);
      }

      const isTeam = (state.mpSubMode === 'TEAM');
      const soloControls = document.getElementById('solo-host-controls');
      const teamControls = document.getElementById('team-host-controls');
      const soloStart = document.getElementById('btn-solo-start');
      const teamStart = document.getElementById('btn-team-start');
      const soloReady = document.getElementById('btn-solo-ready');
      const teamReady = document.getElementById('btn-team-ready');

      if (soloControls) soloControls.style.display = isHost ? 'flex' : 'none';
      if (teamControls) teamControls.style.display = isHost ? 'flex' : 'none';
      if (soloStart) soloStart.style.display = isHost ? 'block' : 'none';
      if (teamStart) teamStart.style.display = isHost ? 'block' : 'none';
      if (soloReady) soloReady.style.display = isHost ? 'none' : 'block';
      if (teamReady) teamReady.style.display = isHost ? 'none' : 'block';

      const readyBtn = document.getElementById(isTeam ? 'btn-team-ready' : 'btn-solo-ready');
      if (readyBtn) {
        readyBtn.textContent = 'CLICK TO READY UP';
        readyBtn.classList.remove('ready-on');
      }

      window.VF.initLobbySlotsDictionary(state.mpSubMode);
      window.VF.syncLobbyInfoText();

      if (isHost) {
        state.mySoloSlot = 1;
        state.mySeat = '1A';
        window.VF.renderSoloRosterGrids();
        window.VF.renderSeatMatrices();
        window.VF.evaluateHostStartUnlock();
        this.broadcastLobbySettings();

        this.hostBeaconTimer = setInterval(function() {
          const inLobby = (state.subStep === 'menu-sub-solo-lobby' || state.subStep === 'menu-sub-team-lobby');
          if (!state.inGame && state.isHost && state.roomCode && inLobby) {
            self.broadcastLobbySettings();
          }
        }, 250);
      } else {
        const sendJoinRequest = function() {
          if (self.joinConfirmed || state.inGame || !state.roomCode) return;
          self.sendPacket({
            type: 'JOIN_REQ',
            roomCode: state.roomCode,
            senderId: state.localPeerId,
            name: 'PILOT ' + state.localPeerId.slice(-2),
            shipId: state.equippedRocketId
          });
        };
        sendJoinRequest();
        this.joinHandshakeTimer = setInterval(sendJoinRequest, 200);
      }
    }
  };
  window.VF.NetworkManager.initChannel();

  window.VF.syncLobbyInfoText = function() {
    const state = window.VF.state;
    if (!state) return;
    const distStr = state.targetWinDistance + 'm';
    const themes = window.VF.THEMES || [];
    const themeName = state.hostThemeIdx < 0
      ? 'Auto-Cycle'
      : (themes[state.hostThemeIdx] ? themes[state.hostThemeIdx].name : 'Auto-Cycle');

    const soloBadge = document.getElementById('solo-dist-badge');
    const teamBadge = document.getElementById('team-dist-badge');
    if (soloBadge) soloBadge.textContent = distStr;
    if (teamBadge) teamBadge.textContent = distStr;

    const soloInfo = document.getElementById('solo-joiner-info');
    if (soloInfo) soloInfo.innerHTML = 'Target Distance: <strong class="info-dist">' + distStr + '</strong> · Theme: <strong class="info-theme">' + themeName + '</strong>';
    const teamInfo = document.getElementById('team-joiner-info');
    if (teamInfo) teamInfo.innerHTML = 'Target Distance: <strong class="info-dist">' + distStr + '</strong> · Theme: <strong class="info-theme">' + themeName + '</strong>';
  };

  window.VF.setTargetWinDistance = function(meters, shouldBroadcast) {
    if (shouldBroadcast === undefined) shouldBroadcast = true;
    const clamped = Math.max(500, Math.min(10000, Math.round(Number(meters) / 250) * 250 || 1500));
    window.VF.state.targetWinDistance = clamped;

    ['solo-win-dist-select', 'team-win-dist-select'].forEach(function(selId) {
      const sel = document.getElementById(selId);
      if (!sel) return;
      let opt = Array.from(sel.options).find(function(o) { return Number(o.value) === clamped; });
      if (!opt) {
        opt = document.createElement('option');
        opt.value = String(clamped);
        opt.textContent = clamped + 'm (Custom)';
        sel.appendChild(opt);
      }
      sel.value = String(clamped);
    });

    if (typeof window.VF.updateFinishPortalZ === 'function') {
      window.VF.updateFinishPortalZ(clamped);
    }
    window.VF.syncLobbyInfoText();
    if (shouldBroadcast && window.VF.state.isHost && window.VF.state.roomCode) {
      window.VF.NetworkManager.broadcastLobbySettings();
    }
  };

  window.VF.renderSoloRosterGrids = function() {
    const state = window.VF.state;
    if (!state) return;
    window.VF.syncLegacySlotsFromDictionary();

    const grid = document.getElementById('solo-slots-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const btnInterchange = document.getElementById('btn-solo-interchange');
    if (btnInterchange) {
      btnInterchange.classList.toggle('active', Boolean(state.interchangeActive));
      btnInterchange.textContent = state.interchangeActive
        ? (state.isHost
          ? (state.hostSwapSource !== null ? 'SELECTED SLOT ' + state.hostSwapSource + ' — CLICK TARGET' : 'HOST SWAP — CLICK ANY SOURCE (1–10)')
          : 'SELECT ANY GLOWING VACANT SLOT')
        : 'INTERCHANGE PLACE';
    }

    for (let i = 1; i <= 10; i++) {
      const key = String(i);
      const entry = state.lobbySlots[key];
      const isVacant = !entry || !entry.occupantId;
      const isLocalMe = (!isVacant && entry.occupantId === state.localPeerId);

      const card = document.createElement('div');
      card.className = 'slot-card' + (isVacant ? ' vacant' : ' occupied');
      card.setAttribute('data-slot', key);

      if (state.interchangeActive) {
        if (!state.isHost && isVacant) card.classList.add('vacant-glow');
        else if (state.isHost) {
          if (state.hostSwapSource === key) card.classList.add('selected-source');
          else card.classList.add('host-target-glow');
        }
      }

      const readyTag = isVacant ? '' : (entry.ready ? ' [READY]' : ' [WAIT]');
      card.innerHTML = '<span>Slot ' + key + '</span><span>' + (isVacant ? 'VACANT' : ((entry.label || ('P' + key)) + (isLocalMe ? ' (YOU)' : '') + readyTag)) + '</span>';
      grid.appendChild(card);
    }
  };

  window.VF.renderSeatMatrices = function() {
    const state = window.VF.state;
    if (!state) return;
    window.VF.syncLegacySlotsFromDictionary();

    const btnInterchange = document.getElementById('btn-team-interchange');
    if (btnInterchange) {
      btnInterchange.classList.toggle('active', Boolean(state.interchangeActive));
      btnInterchange.textContent = state.interchangeActive
        ? (state.isHost
          ? (state.hostSwapSource ? 'SELECTED ' + state.hostSwapSource + ' — CLICK TARGET' : 'HOST SWAP — CLICK SOURCE SEAT')
          : 'SELECT GLOWING VACANT SEAT')
        : 'INTERCHANGE PLACE';
    }

    const cards = document.querySelectorAll('#team-seats-grid .slot-card');
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const seatKey = card.getAttribute('data-seat');
      const entry = state.lobbySlots[seatKey];
      const isVacant = !entry || !entry.occupantId;
      const isLocalMe = (!isVacant && entry.occupantId === state.localPeerId);

      card.classList.toggle('vacant', isVacant);
      card.classList.remove('vacant-glow', 'selected-source', 'host-target-glow');

      if (state.interchangeActive) {
        if (!state.isHost && isVacant) card.classList.add('vacant-glow');
        else if (state.isHost) {
          if (state.hostSwapSource === seatKey) card.classList.add('selected-source');
          else card.classList.add('host-target-glow');
        }
      }

      const labelEl = document.getElementById('seat-label-' + seatKey);
      if (labelEl) {
        const readyTag = (!isVacant && entry.ready) ? ' [READY]' : '';
        labelEl.textContent = isVacant ? 'VACANT' : ((entry.label || ('PILOT ' + seatKey)) + (isLocalMe ? ' (YOU)' : '') + readyTag);
      }
    }
  };

  window.VF.handleAuthoritativeSlotClick = function(slotKey) {
    const state = window.VF.state;
    if (!state || !state.interchangeActive) return;
    const key = String(slotKey);
    const entry = state.lobbySlots[key];
    const isVacant = !entry || !entry.occupantId;

    if (!state.isHost) {
      if (!isVacant) return;
      state.interchangeActive = false;
      if (state.mpSubMode === 'SOLO') window.VF.renderSoloRosterGrids();
      else window.VF.renderSeatMatrices();
      window.VF.NetworkManager.sendPacket({
        type: 'SWAP_SLOT_REQ',
        roomCode: state.roomCode,
        senderId: state.localPeerId,
        targetKey: key
      });
    } else {
      if (state.hostSwapSource === null) {
        state.hostSwapSource = key;
        if (state.mpSubMode === 'SOLO') window.VF.renderSoloRosterGrids();
        else window.VF.renderSeatMatrices();
      } else {
        const k1 = String(state.hostSwapSource);
        const k2 = key;
        if (k1 !== k2) {
          const tmp = state.lobbySlots[k1] ? Object.assign({}, state.lobbySlots[k1]) : null;
          state.lobbySlots[k1] = state.lobbySlots[k2] ? Object.assign({}, state.lobbySlots[k2]) : null;
          state.lobbySlots[k2] = tmp;
        }
        state.hostSwapSource = null;
        state.interchangeActive = false;
        window.VF.syncLegacySlotsFromDictionary();
        if (state.mpSubMode === 'SOLO') window.VF.renderSoloRosterGrids();
        else window.VF.renderSeatMatrices();
        window.VF.NetworkManager.broadcastLobbySettings();
      }
    }
  };

  window.VF.evaluateHostStartUnlock = function() {
    const state = window.VF.state;
    if (!state || !state.isHost) return;
    let joinedCount = 0;
    let readyCount = 0;
    const keys = state.mpSubMode === 'SOLO'
      ? ['1','2','3','4','5','6','7','8','9','10']
      : ['1A','1B','2A','2B'];

    keys.forEach(function(k) {
      const s = state.lobbySlots[k];
      if (s && s.occupantId && s.occupantId !== state.localPeerId) {
        joinedCount++;
        if (s.ready) readyCount++;
      }
    });

    const btn = document.getElementById(state.mpSubMode === 'SOLO' ? 'btn-solo-start' : 'btn-team-start');
    if (btn) {
      btn.disabled = !(joinedCount === 0 || readyCount === joinedCount);
    }
  };

  // ==========================================================================
  // 8. DOM EVENT BINDINGS & BOOTSTRAP ORCHESTRATION
  // ==========================================================================
  window.VF.bindAppDOMEvents = function() {
    window.VF.initButtonSideSetting();
    window.VF.checkOrientationLock();

    const fsBtn = document.getElementById('btn-fullscreen-toggle');
    if (fsBtn) {
      fsBtn.addEventListener('click', function() {
        window.VF.lockLandscapeOrientation();
        try {
          if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen().then(function() {
                window.VF.lockLandscapeOrientation();
              }).catch(function() {});
            }
          } else if (document.exitFullscreen) {
            document.exitFullscreen().catch(function() {});
          }
        } catch (_) {}
      });
    }

    const gyroToggleBtn = document.getElementById('btn-gyro-toggle');
    if (gyroToggleBtn) {
      gyroToggleBtn.addEventListener('click', function() {
        const state = window.VF.state;
        if (!state) return;
        state.gyroEnabled = !state.gyroEnabled;
        state.mobileInputMode = state.gyroEnabled ? 'GYRO' : 'JOYSTICK';
        if (state.gyroEnabled) window.VF.requestGyroPermissionAndCalibrate();
        window.VF.syncMobileGyroUI();
      });
    }

    const gyroRecenterBtn = document.getElementById('btn-gyro-recenter');
    if (gyroRecenterBtn) {
      gyroRecenterBtn.addEventListener('click', function() {
        window.VF.requestGyroPermissionAndCalibrate();
        if (typeof window.VF.showHudAlert === 'function') {
          window.VF.showHudAlert('GYROSCOPE RECENTERED', '#00f0ff', 1400);
        }
      });
    }

    const steerZone = document.getElementById('mobile-joystick-zone');
    const steerKnob = document.getElementById('mobile-joystick-knob') || document.getElementById('touch-steer-knob');
    let joystickPointerId = null;

    const updateJoystickCoordinates = function(clientX, clientY) {
      const state = window.VF.state;
      if (!state || state.directionlessTimer > 0) return;
      const rect = steerZone.getBoundingClientRect();
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      const maxRadius = Math.max(24, rect.width * 0.38);
      const dist = Math.min(maxRadius, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      const kx = Math.cos(angle) * dist;
      const ky = Math.sin(angle) * dist;

      if (steerKnob) steerKnob.style.transform = 'translate(' + kx + 'px, ' + ky + 'px)';
      state.inputX = kx / maxRadius;
      state.inputY = -(ky / maxRadius);
      state.usingCursor = false;
    };

    const resetJoystick = function() {
      joystickPointerId = null;
      if (steerKnob) steerKnob.style.transform = 'translate(0px, 0px)';
      if (window.VF.state && !window.VF.state.usingCursor) {
        window.VF.state.inputX = 0;
        window.VF.state.inputY = 0;
      }
    };

    if (steerZone) {
      steerZone.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        joystickPointerId = e.pointerId;
        if (window.VF.state) {
          window.VF.state.gyroEnabled = false;
          window.VF.syncMobileGyroUI();
        }
        try { steerZone.setPointerCapture(e.pointerId); } catch (_) {}
        updateJoystickCoordinates(e.clientX, e.clientY);
      });
      steerZone.addEventListener('pointermove', function(e) {
        if (joystickPointerId !== e.pointerId) return;
        e.preventDefault();
        e.stopPropagation();
        updateJoystickCoordinates(e.clientX, e.clientY);
      });
      steerZone.addEventListener('pointerup', function(e) {
        if (joystickPointerId !== e.pointerId) return;
        e.preventDefault();
        e.stopPropagation();
        try { steerZone.releasePointerCapture(e.pointerId); } catch (_) {}
        resetJoystick();
      });
      steerZone.addEventListener('pointercancel', resetJoystick);
    }

    const btnFire = document.getElementById('btn-fire');
    if (btnFire) {
      btnFire.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.VF.AudioEngine && window.VF.AudioEngine.init) window.VF.AudioEngine.init();
        if (typeof window.VF.fireOneShot === 'function') window.VF.fireOneShot();
      });
    }

    const btnBoost = document.getElementById('btn-boost');
    if (btnBoost) {
      btnBoost.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.VF.AudioEngine && window.VF.AudioEngine.init) window.VF.AudioEngine.init();
        if (window.VF.state && window.VF.state.isMobile) window.VF.toggleBoostLock();
        else window.VF.setBoostingState(true);
      });
      btnBoost.addEventListener('pointerup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.VF.state && !window.VF.state.isMobile) window.VF.setBoostingState(false);
      });
    }

    const btnNavMp = document.getElementById('btn-nav-mp');
    if (btnNavMp) {
      btnNavMp.addEventListener('click', function() {
        window.VF.lockLandscapeOrientation();
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        if (window.VF.NetBridge) window.VF.NetBridge.ensurePeerScript();
        window.VF.showMenuSubStep('menu-sub-mp-mode');
      });
    }

    const btnNavEndless = document.getElementById('btn-nav-endless');
    if (btnNavEndless) {
      btnNavEndless.addEventListener('click', function() {
        window.VF.startGame('ENDLESS', false, Date.now());
      });
    }

    const btnNavShift = document.getElementById('btn-nav-shift');
    if (btnNavShift) {
      btnNavShift.addEventListener('click', function() {
        window.VF.startGame('SHIFT', false, Date.now());
      });
    }

    const btnMpBack = document.getElementById('btn-mp-back');
    if (btnMpBack) {
      btnMpBack.addEventListener('click', function() {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        window.VF.showMenuSubStep('menu-sub-root');
      });
    }

    const btnMpSolo = document.getElementById('btn-mp-solo');
    if (btnMpSolo) {
      btnMpSolo.addEventListener('click', function() {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        window.VF.state.mpSubMode = 'SOLO';
        window.VF.showMenuSubStep('menu-sub-mp-action');
      });
    }

    const btnMpTeam = document.getElementById('btn-mp-team');
    if (btnMpTeam) {
      btnMpTeam.addEventListener('click', function() {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        window.VF.state.mpSubMode = 'TEAM';
        window.VF.showMenuSubStep('menu-sub-mp-action');
      });
    }

    const btnMpActionBack = document.getElementById('btn-mp-action-back');
    if (btnMpActionBack) {
      btnMpActionBack.addEventListener('click', function() {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        window.VF.showMenuSubStep('menu-sub-mp-mode');
      });
    }

    const btnMpHost = document.getElementById('btn-mp-host');
    if (btnMpHost) {
      btnMpHost.addEventListener('click', function() {
        const state = window.VF.state;
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        const code = window.VF.SecurityManager.generateRoomCode(state.mpSubMode);
        if (state.mpSubMode === 'SOLO') {
          const display = document.getElementById('solo-room-code-display');
          if (display) display.textContent = code;
          window.VF.showMenuSubStep('menu-sub-solo-lobby');
          window.VF.NetworkManager.openSession(true, code);
        } else {
          const display = document.getElementById('team-room-code-display');
          if (display) display.textContent = code;
          window.VF.showMenuSubStep('menu-sub-team-lobby');
          window.VF.NetworkManager.openSession(true, code);
        }
      });
    }

    const btnMpJoinView = document.getElementById('btn-mp-join-view');
    if (btnMpJoinView) {
      btnMpJoinView.addEventListener('click', function() {
        const state = window.VF.state;
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        state.roomCode = '';
        state.isHost = false;
        window.VF.NetworkManager.clearTimers();
        const input = document.getElementById('join-room-input');
        const statusMsg = document.getElementById('join-status-msg');
        if (input) input.value = '';
        if (statusMsg) {
          statusMsg.textContent = 'Scanning for active ' + state.mpSubMode + ' room or enter Room ID...';
          statusMsg.style.color = '#94a3b8';
        }
        window.VF.showMenuSubStep('menu-sub-join-input');
        window.VF.NetworkManager.discoverActiveRooms();
      });
    }

    const btnJoinBack = document.getElementById('btn-join-back');
    if (btnJoinBack) {
      btnJoinBack.addEventListener('click', function() {
        window.VF.NetworkManager.clearTimers();
        if (window.VF.NetBridge) window.VF.NetBridge.teardown();
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        window.VF.showMenuSubStep('menu-sub-mp-action');
      });
    }

    const btnJoinConnect = document.getElementById('btn-join-connect');
    if (btnJoinConnect) {
      btnJoinConnect.addEventListener('click', function() {
        const state = window.VF.state;
        const input = document.getElementById('join-room-input');
        const statusMsg = document.getElementById('join-status-msg');
        const code = window.VF.SecurityManager.validateRoomCode(input ? input.value : '', state.mpSubMode);
        if (!code) {
          if (statusMsg) {
            statusMsg.textContent = 'Enter a valid Room ID (e.g. ' + state.mpSubMode + '-XXXX-X)';
            statusMsg.style.color = '#ff2a55';
          }
          return;
        }
        if (input) input.value = code;
        if (code.indexOf('TEAM-') === 0) state.mpSubMode = 'TEAM';
        else if (code.indexOf('SOLO-') === 0) state.mpSubMode = 'SOLO';

        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        if (statusMsg) {
          statusMsg.textContent = 'Connecting to ' + code + '...';
          statusMsg.style.color = '#00f0ff';
        }
        if (state.mpSubMode === 'SOLO') {
          const display = document.getElementById('solo-room-code-display');
          if (display) display.textContent = code;
        } else {
          const display = document.getElementById('team-room-code-display');
          if (display) display.textContent = code;
        }
        window.VF.NetworkManager.openSession(false, code);
      });
    }

    ['btn-solo-copy', 'btn-team-copy'].forEach(function(id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function(e) {
        try { if (navigator.clipboard) navigator.clipboard.writeText(window.VF.state.roomCode); } catch (_) {}
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        e.target.textContent = 'COPIED!';
        setTimeout(function() { e.target.textContent = 'COPY ID'; }, 1200);
      });
    });

    ['btn-solo-share', 'btn-team-share'].forEach(function(id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function(e) {
        const code = window.VF.state.roomCode || '';
        try {
          if (navigator.share) navigator.share({ title: 'Turbo Racer Multiplayer', text: 'Join my Turbo Racer Room: ' + code });
          else if (navigator.clipboard) {
            navigator.clipboard.writeText(code);
            e.target.textContent = 'COPIED!';
            setTimeout(function() { e.target.textContent = 'SHARE'; }, 1200);
          }
        } catch (_) {}
      });
    });

    ['btn-solo-lobby-back', 'btn-team-lobby-back'].forEach(function(id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function() {
        window.VF.NetworkManager.clearTimers();
        if (window.VF.NetBridge) window.VF.NetBridge.teardown();
        window.VF.state.roomCode = '';
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        window.VF.showMenuSubStep('menu-sub-mp-action');
      });
    });

    const btnSoloInterchange = document.getElementById('btn-solo-interchange');
    if (btnSoloInterchange) {
      btnSoloInterchange.addEventListener('click', function() {
        const state = window.VF.state;
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        state.interchangeActive = !state.interchangeActive;
        state.hostSwapSource = null;
        window.VF.renderSoloRosterGrids();
      });
    }

    const soloGrid = document.getElementById('solo-slots-grid');
    if (soloGrid) {
      soloGrid.addEventListener('click', function(e) {
        const card = e.target.closest('.slot-card');
        if (!card) return;
        const slotKey = card.getAttribute('data-slot');
        if (slotKey) window.VF.handleAuthoritativeSlotClick(slotKey);
      });
    }

    const btnTeamInterchange = document.getElementById('btn-team-interchange');
    if (btnTeamInterchange) {
      btnTeamInterchange.addEventListener('click', function() {
        const state = window.VF.state;
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        state.interchangeActive = !state.interchangeActive;
        state.hostSwapSource = null;
        window.VF.renderSeatMatrices();
      });
    }

    const teamGrid = document.getElementById('team-seats-grid');
    if (teamGrid) {
      teamGrid.addEventListener('click', function(e) {
        const card = e.target.closest('.slot-card');
        if (!card) return;
        const seatKey = card.getAttribute('data-seat');
        if (seatKey) window.VF.handleAuthoritativeSlotClick(seatKey);
      });
    }

    ['solo-win-dist-select', 'team-win-dist-select'].forEach(function(id) {
      const sel = document.getElementById(id);
      if (!sel) return;
      sel.addEventListener('change', function(e) {
        window.VF.setTargetWinDistance(parseInt(e.target.value, 10) || 1500, true);
      });
    });

    ['btn-solo-dist-minus', 'btn-team-dist-minus'].forEach(function(id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function() {
        window.VF.setTargetWinDistance(window.VF.state.targetWinDistance - 250, true);
      });
    });

    ['btn-solo-dist-plus', 'btn-team-dist-plus'].forEach(function(id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function() {
        window.VF.setTargetWinDistance(window.VF.state.targetWinDistance + 250, true);
      });
    });

    const themes = window.VF.THEMES || [];
    const themeOptionsHtml = '<option value="-1">Auto-Cycle (Live Color Fusion)</option>' +
      themes.map(function(t) { return '<option value="' + t.id + '">' + (t.id + 1) + '. ' + t.name + '</option>'; }).join('');
    ['solo-theme-select', 'team-theme-select'].forEach(function(id) {
      const sel = document.getElementById(id);
      if (!sel) return;
      sel.innerHTML = themeOptionsHtml;
      sel.addEventListener('change', function(e) {
        window.VF.state.hostThemeIdx = parseInt(e.target.value, 10);
        window.VF.syncLobbyInfoText();
        window.VF.NetworkManager.broadcastLobbySettings();
      });
    });

    ['btn-solo-ready', 'btn-team-ready'].forEach(function(id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function(e) {
        const state = window.VF.state;
        state.localReady = !state.localReady;
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) window.VF.AudioEngine.playClickSFX();
        e.target.textContent = state.localReady ? 'READY! WAITING FOR HOST...' : 'CLICK TO READY UP';
        e.target.classList.toggle('ready-on', state.localReady);
        window.VF.NetworkManager.sendPacket({
          type: 'READY_TOGGLE',
          roomCode: state.roomCode,
          senderId: state.localPeerId,
          ready: state.localReady,
          shipId: state.equippedRocketId
        });
      });
    });

    ['btn-solo-start', 'btn-team-start'].forEach(function(id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function() {
        const state = window.VF.state;
        const seed = window.VF.SecurityManager.generateSecureSeed();
        const wallTimestamp = Date.now();
        window.VF.setMatchSeed(seed);
        window.VF.NetworkManager.sendPacket({
          type: 'MATCH_LAUNCH',
          roomCode: state.roomCode,
          seed: seed,
          mode: state.mpSubMode,
          themeIndex: state.hostThemeIdx,
          targetWinDistance: state.targetWinDistance,
          slots: state.lobbySlots,
          lobbySlots: state.lobbySlots,
          sharedStartWallTime: wallTimestamp,
          startTimestamp: wallTimestamp
        });
        window.VF.startGame(state.mpSubMode === 'TEAM' ? 'MP_TEAM' : 'MP_SOLO', true, wallTimestamp);
      });
    });

    if (typeof window.VF.initHangar === 'function') {
      window.VF.initHangar();
    }

    const btnOpenHangar = document.getElementById('btn-open-hangar');
    if (btnOpenHangar) {
      btnOpenHangar.addEventListener('click', function() {
        const state = window.VF.state;
        state.previewRocketId = state.equippedRocketId;
        const fleet = window.VF.ROCKET_FLEET || [];
        const spec = fleet.find(function(r) { return r.id === state.previewRocketId; }) || fleet[8];
        if (typeof window.VF.populateHangarGrid === 'function') window.VF.populateHangarGrid('ALL');
        window.VF.switchScreen('hangar-screen');
        if (typeof window.VF.updateHangarPreview === 'function' && spec) {
          window.VF.updateHangarPreview(spec);
          setTimeout(function() { window.VF.updateHangarPreview(spec); }, 50);
        }
      });
    }

    const btnOpenSettings = document.getElementById('btn-open-settings');
    if (btnOpenSettings) {
      btnOpenSettings.addEventListener('click', function() {
        window.VF.initButtonSideSetting();
        if (window.VF.SecurityManager && window.VF.SecurityManager.checkHealth) window.VF.SecurityManager.checkHealth();
        window.VF.switchScreen('settings-modal');
      });
    }

    const btnCloseSettings = document.getElementById('btn-settings-close');
    if (btnCloseSettings) {
      btnCloseSettings.addEventListener('click', function() {
        window.VF.switchScreen('menu-screen');
      });
    }

    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    if (btnAudioToggle) {
      btnAudioToggle.addEventListener('click', function() {
        if (window.VF.AudioEngine && window.VF.AudioEngine.toggleMute) window.VF.AudioEngine.toggleMute();
      });
    }

    ['slider-master', 'slider-music', 'slider-sfx'].forEach(function(id) {
      const slider = document.getElementById(id);
      if (!slider) return;
      slider.addEventListener('input', function() {
        const m = parseInt(document.getElementById('slider-master').value, 10) / 100;
        const mu = parseInt(document.getElementById('slider-music').value, 10) / 100;
        const s = parseInt(document.getElementById('slider-sfx').value, 10) / 100;
        if (window.VF.AudioEngine && window.VF.AudioEngine.setVolumes) window.VF.AudioEngine.setVolumes(m, mu, s);
      });
    });

    const sliderSens = document.getElementById('slider-sens');
    if (sliderSens) {
      sliderSens.addEventListener('input', function(e) {
        window.VF.state.sensitivity = parseInt(e.target.value, 10) / 100;
      });
    }

    const selectMode = document.getElementById('select-input-mode');
    if (selectMode) {
      selectMode.addEventListener('change', function(e) {
        window.VF.state.inputOverride = e.target.value;
        window.VF.updateDeviceLayout();
      });
    }

    window.VF.togglePause = function() {
      const state = window.VF.state;
      if (!state || !state.inGame) return;
      state.paused = !state.paused;

      if (state.paused) {
        const badge = document.getElementById('gameover-badge');
        const title = document.getElementById('gameover-title');
        const reason = document.getElementById('gameover-reason');
        const score = document.getElementById('gameover-score');
        const dist = document.getElementById('gameover-distance');
        const retryBtn = document.getElementById('btn-gameover-retry');

        if (badge) badge.textContent = 'FLIGHT STANDBY';
        if (title) title.textContent = 'GAME PAUSED';
        if (reason) reason.textContent = 'Systems holding in standby';
        if (score) score.textContent = Math.floor(state.score).toLocaleString();
        if (dist) dist.textContent = Math.floor(state.distance) + ' m';
        if (retryBtn) retryBtn.textContent = 'RESUME FLIGHT';
        window.VF.switchScreen('gameover-modal');
      } else {
        window.VF.switchScreen('hud-screen');
      }
    };

    const btnPause = document.getElementById('btn-hud-pause');
    if (btnPause) btnPause.addEventListener('click', window.VF.togglePause);

    const btnRetry = document.getElementById('btn-gameover-retry');
    if (btnRetry) {
      btnRetry.addEventListener('click', function() {
        const state = window.VF.state;
        if (state.paused) {
          state.paused = false;
          window.VF.switchScreen('hud-screen');
          return;
        }
        if (typeof window.VF.clearAllRemoteShipsAndProjectiles === 'function') {
          window.VF.clearAllRemoteShipsAndProjectiles();
        }
        if (state.isMultiplayer && state.roomCode) {
          const seed = window.VF.SecurityManager.generateSecureSeed();
          const wallTimestamp = Date.now();
          window.VF.setMatchSeed(seed);
          window.VF.NetworkManager.sendPacket({
            type: 'REMATCH_LAUNCH',
            roomCode: state.roomCode,
            seed: seed,
            mode: state.mpSubMode,
            themeIndex: state.hostThemeIdx,
            targetWinDistance: state.targetWinDistance,
            slots: state.lobbySlots,
            lobbySlots: state.lobbySlots,
            sharedStartWallTime: wallTimestamp,
            startTimestamp: wallTimestamp
          });
          window.VF.startGame(state.mode, true, wallTimestamp);
        } else {
          window.VF.startGame(state.mode || 'ENDLESS', false, Date.now());
        }
      });
    }

    const btnMainMenu = document.getElementById('btn-gameover-menu');
    if (btnMainMenu) {
      btnMainMenu.addEventListener('click', function() {
        const state = window.VF.state;
        state.inGame = false;
        state.paused = false;
        window.VF.forceResetBoostToggleState();
        state.screen = 'MENU';

        if (window.VF.NetworkManager) window.VF.NetworkManager.clearTimers();
        if (window.VF.NetBridge) window.VF.NetBridge.teardown();

        const combatAlert = document.getElementById('hud-combat-alert');
        if (combatAlert) combatAlert.classList.remove('visible', 'surge');

        if (window.VF.AudioEngine && window.VF.AudioEngine.updateThruster) {
          window.VF.AudioEngine.updateThruster(0, false);
        }
        if (typeof window.VF.clearAllRemoteShipsAndProjectiles === 'function') {
          window.VF.clearAllRemoteShipsAndProjectiles();
        }
        if (typeof window.VF.clearDebrisAndResetExteriorVista === 'function') {
          window.VF.clearDebrisAndResetExteriorVista();
        }
        if (typeof window.VF.equipSpacecraftModel === 'function') {
          window.VF.equipSpacecraftModel(state.equippedRocketId);
        }

        window.VF.showMenuSubStep('menu-sub-root');
        window.VF.switchScreen('menu-screen');
      });
    }
  };

  window.VF.startIntroBootSequence = function() {
    const state = window.VF.state;
    if (typeof window.VF.initAssetCache === 'function') {
      window.VF.initAssetCache();
    }

    const savedShipId = Math.max(1, Math.min(32, Number(
      (window.localStorage && window.localStorage.getItem('VF_EQUIPPED_SHIP_ID')) ||
      (window.name && window.name.indexOf('VF_SHIP_') === 0 ? window.name.replace('VF_SHIP_', '').split('__')[0] : 9) ||
      9
    ) || 9));
    state.equippedRocketId = savedShipId;
    state.previewRocketId = savedShipId;

    if (typeof window.VF.initEngine === 'function') {
      window.VF.initEngine();
    }
    if (window.VF.SecurityManager && typeof window.VF.SecurityManager.initDomGuard === 'function') {
      window.VF.SecurityManager.initDomGuard();
    }

    window.VF.bindAppDOMEvents();
    window.VF.initLobbySlotsDictionary('SOLO');

    if (typeof window.VF.clearDebrisAndResetExteriorVista === 'function') {
      window.VF.clearDebrisAndResetExteriorVista();
    }
    if (typeof window.VF.equipSpacecraftModel === 'function') {
      window.VF.equipSpacecraftModel(savedShipId);
    }

    const fleet = window.VF.ROCKET_FLEET || [];
    const spec = fleet.find(function(r) { return r.id === savedShipId; }) || fleet[8];
    const openHangarBtn = document.getElementById('btn-open-hangar');
    if (openHangarBtn && spec) {
      openHangarBtn.innerHTML = 'SPACECRAFT HANGAR · <span id="equipped-ship-name" class="accent-text ship-highlight">' + spec.name + '</span>';
    }

    window.VF.updateHealthHUD(100);
    window.VF.syncBoostButtonVisuals();
    window.VF.applyButtonLayout(state.buttonSideLayout);

    if (typeof window.VF.resizeRenderersImmediate === 'function') {
      window.VF.resizeRenderersImmediate();
    }
    if (window.VF.SecurityManager && typeof window.VF.SecurityManager.checkHealth === 'function') {
      window.VF.SecurityManager.checkHealth();
    }

    try {
      if (window.VF.renderer && window.VF.scene && window.VF.camera) {
        window.VF.renderer.compile(window.VF.scene, window.VF.camera);
      }
    } catch (_) {}

    if (typeof window.VF.animate === 'function') {
      requestAnimationFrame(window.VF.animate);
    }

    const introDuration = 3200;
    const introStartTime = performance.now();
    const fillElement = document.getElementById('intro-loader-fill') || document.getElementById('intro-loader-trail');
    const capsuleElement = document.getElementById('intro-rocket-capsule');

    const bootInterval = setInterval(function() {
      const elapsed = performance.now() - introStartTime;
      const pct = Math.min(100, (elapsed / introDuration) * 100);
      state.introProgress = pct;

      if (fillElement) fillElement.style.width = pct + '%';
      if (capsuleElement) capsuleElement.style.left = pct + '%';

      if (pct >= 100) {
        clearInterval(bootInterval);
        setTimeout(function() {
          state.inIntro = false;
          state.screen = 'MENU';
          if (window.VF.introLaunchBayGroup) {
            window.VF.introLaunchBayGroup.visible = false;
          }
          if (window.VF.playerGroup) {
            window.VF.playerGroup.visible = true;
            if (window.VF.playerGroup.userData && window.VF.playerGroup.userData.craftMesh) {
              window.VF.playerGroup.userData.craftMesh.visible = true;
            }
          }
          if (window.VF.camera) {
            window.VF.camera.fov = window.VF.baseFov;
            window.VF.camera.updateProjectionMatrix();
          }
          window.VF.showMenuSubStep('menu-sub-root');
          window.VF.switchScreen('menu-screen');
        }, 180);
      }
    }, 32);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.VF.startIntroBootSequence, { once: true });
  } else {
    window.VF.startIntroBootSequence();
  }
})();