/* V-FACTOR STUDIOS // @_the_v_factor_ // BUILT BY VINAY — NEXT-GEN 3D AERONAUTICAL FLEET, CROSSHAIRS, DRONES & HANGAR ENGINE */
"use strict";
window.VF = window.VF || {};

// ============================================================================
// 1. 32-CRAFT AERONAUTICAL MORPHOLOGY TABLE (`VF.SHIP_MORPHOLOGY`)
// ============================================================================
window.VF.SHIP_MORPHOLOGY = Object.freeze([
  null,
  { wing: 'DELTA', sweep: 0.35, dihedral: 0.0, nose: 'NEEDLE', engines: 3, nacelles: 0, tail: 'SINGLE', ring: false, booms: false },
  { wing: 'FORWARD', sweep: -0.42, dihedral: 0.08, nose: 'LANCE', engines: 3, nacelles: 0, tail: 'V_TAIL', ring: false, booms: false },
  { wing: 'DIAMOND', sweep: 0.0, dihedral: -0.12, nose: 'TURBINE', engines: 3, nacelles: 0, tail: 'TWIN', ring: false, booms: false },
  { wing: 'GULL_INV', sweep: 0.22, dihedral: -0.26, nose: 'INTAKE', engines: 3, nacelles: 0, tail: 'SINGLE', ring: false, booms: false },
  { wing: 'X_WING', sweep: -0.28, dihedral: 0.36, nose: 'SPIRE', engines: 4, nacelles: 0, tail: 'NONE', ring: false, booms: false },
  { wing: 'CRESCENT', sweep: 0.48, dihedral: 0.05, nose: 'SNUB_SIEGE', engines: 4, nacelles: 0, tail: 'TWIN', ring: false, booms: false },
  { wing: 'TRI_FIN', sweep: 0.18, dihedral: 0.15, nose: 'BEACON', engines: 3, nacelles: 0, tail: 'TRIPLE', ring: false, booms: false },
  { wing: 'FORWARD', sweep: -0.36, dihedral: 0.12, nose: 'TURBINE', engines: 3, nacelles: 2, tail: 'SINGLE', ring: false, booms: false },
  { wing: 'DELTA', sweep: 0.40, dihedral: 0.04, nose: 'INTAKE', engines: 4, nacelles: 2, tail: 'V_TAIL', ring: false, booms: false },
  { wing: 'GULL_UP', sweep: 0.25, dihedral: 0.28, nose: 'HAMMER', engines: 4, nacelles: 2, tail: 'TWIN', ring: false, booms: false },
  { wing: 'SWEPT_BACK', sweep: 0.52, dihedral: -0.10, nose: 'LANCE', engines: 4, nacelles: 2, tail: 'SINGLE', ring: false, booms: false },
  { wing: 'WIDE_DELTA', sweep: 0.32, dihedral: 0.0, nose: 'TWIN_PRONG', engines: 5, nacelles: 2, tail: 'TWIN', ring: false, booms: false },
  { wing: 'DIAMOND', sweep: 0.10, dihedral: 0.18, nose: 'TURBINE', engines: 4, nacelles: 2, tail: 'V_TAIL', ring: false, booms: false },
  { wing: 'FORWARD', sweep: -0.48, dihedral: -0.14, nose: 'RAIL_SPLIT', engines: 4, nacelles: 2, tail: 'TWIN', ring: false, booms: true },
  { wing: 'DELTA', sweep: 0.45, dihedral: 0.06, nose: 'RAIL_SPLIT', engines: 5, nacelles: 2, tail: 'TWIN', ring: false, booms: false },
  { wing: 'CRESCENT', sweep: 0.30, dihedral: 0.22, nose: 'INTAKE', engines: 4, nacelles: 2, tail: 'V_TAIL', ring: true, booms: false },
  { wing: 'X_WING', sweep: -0.38, dihedral: 0.40, nose: 'LANCE', engines: 5, nacelles: 2, tail: 'NONE', ring: false, booms: false },
  { wing: 'DIAMOND', sweep: 0.58, dihedral: -0.08, nose: 'SPIRE', engines: 4, nacelles: 2, tail: 'SINGLE', ring: false, booms: true },
  { wing: 'GULL_INV', sweep: -0.32, dihedral: -0.30, nose: 'ROTARY', engines: 5, nacelles: 2, tail: 'TWIN', ring: false, booms: false },
  { wing: 'SWEPT_BACK', sweep: 0.62, dihedral: 0.10, nose: 'TWIN_PRONG', engines: 5, nacelles: 2, tail: 'V_TAIL', ring: false, booms: true },
  { wing: 'FORWARD', sweep: -0.52, dihedral: 0.05, nose: 'LANCE', engines: 5, nacelles: 2, tail: 'TRIPLE', ring: false, booms: true },
  { wing: 'X_WING', sweep: -0.44, dihedral: 0.34, nose: 'RAIL_SPLIT', engines: 5, nacelles: 4, tail: 'TWIN', ring: false, booms: true },
  { wing: 'TRI_FIN', sweep: 0.28, dihedral: -0.20, nose: 'TURBINE', engines: 5, nacelles: 2, tail: 'TRIPLE', ring: false, booms: false },
  { wing: 'SWEPT_BACK', sweep: 0.55, dihedral: 0.14, nose: 'SIEGE_MORTAR', engines: 5, nacelles: 2, tail: 'V_TAIL', ring: false, booms: true },
  { wing: 'QUAD_SPONSON', sweep: 0.20, dihedral: -0.15, nose: 'HAMMER', engines: 6, nacelles: 4, tail: 'TWIN', ring: false, booms: true },
  { wing: 'QUAD_SPONSON', sweep: -0.25, dihedral: 0.12, nose: 'SNUB_SIEGE', engines: 6, nacelles: 4, tail: 'TWIN', ring: true, booms: false },
  { wing: 'WIDE_DELTA', sweep: 0.60, dihedral: 0.08, nose: 'RAIL_SPLIT', engines: 7, nacelles: 4, tail: 'TRIPLE', ring: false, booms: true },
  { wing: 'QUAD_SPONSON', sweep: 0.35, dihedral: -0.18, nose: 'HAMMER', engines: 7, nacelles: 4, tail: 'TWIN', ring: false, booms: true },
  { wing: 'CRESCENT', sweep: 0.0, dihedral: 0.0, nose: 'TURBINE', engines: 5, nacelles: 2, tail: 'NONE', ring: true, booms: false },
  { wing: 'ASYM_SHARD', sweep: -0.40, dihedral: 0.24, nose: 'SPIRE', engines: 5, nacelles: 2, tail: 'SINGLE', ring: false, booms: true },
  { wing: 'GULL_INV', sweep: -0.30, dihedral: -0.24, nose: 'TWIN_PRONG', engines: 6, nacelles: 2, tail: 'TWIN', ring: true, booms: true },
  { wing: 'X_WING', sweep: -0.46, dihedral: 0.38, nose: 'RAIL_SPLIT', engines: 8, nacelles: 4, tail: 'V_TAIL', ring: true, booms: true }
]);

// ============================================================================
// 2. BESPOKE 32-SHIP CROSSHAIR VECTOR GENERATOR (IMAGES 3, 4 & 5)
// ============================================================================
const _reticleTextureCache = {};

window.VF.getShipReticleTexture = function(spec, isLocked, isInnerLayer) {
  const shipId = (spec && spec.id) || 9;
  const gen = (spec && spec.gen) || 'GEN 2';
  const key = shipId + '_' + (isLocked ? 'L' : 'N') + '_' + (isInnerLayer ? 'I' : 'O');
  if (_reticleTextureCache[key]) return _reticleTextureCache[key];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const cx = 256;
  const cy = 256;
  const variant = (shipId - 1) % 6;
  ctx.clearRect(0, 0, 512, 512);

  if (gen === 'GEN 4' || gen === 'GEN 5') {
    const cyanCol = isLocked ? '#00ff88' : '#00e5ff';
    const redCol = isLocked ? '#ff0044' : '#ff1744';
    ctx.save();
    if (!isInnerLayer) {
      ctx.strokeStyle = cyanCol;
      ctx.shadowColor = cyanCol;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 6;
      const arcCount = (variant % 2 === 0) ? 4 : 3;
      for (let i = 0; i < arcCount; i++) {
        const a0 = (i * Math.PI * 2) / arcCount + 0.18;
        const a1 = ((i + 1) * Math.PI * 2) / arcCount - 0.18;
        ctx.beginPath();
        ctx.arc(cx, cy, 212, a0, a1);
        ctx.stroke();
      }
      ctx.lineWidth = 10;
      for (let t = 0; t < 36; t++) {
        if (variant === 1 && (t % 9 < 2)) continue;
        const ang = (t / 36) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 184, ang, ang + 0.09);
        ctx.stroke();
      }
      ctx.lineWidth = 3.5;
      for (let c = 0; c < 4; c++) {
        const ang = (c * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * 195, cy + Math.sin(ang) * 195);
        ctx.lineTo(cx + Math.cos(ang) * 242, cy + Math.sin(ang) * 242);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = 'rgba(255, 23, 68, 0.16)';
      ctx.beginPath();
      ctx.arc(cx, cy, 148, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = redCol;
      ctx.fillStyle = redCol;
      ctx.shadowColor = redCol;
      ctx.shadowBlur = 14;

      if (variant === 0 || variant === 3) {
        const wedgeCount = variant === 0 ? 2 : 4;
        for (let w = 0; w < wedgeCount; w++) {
          const ang = (w * Math.PI * 2) / wedgeCount;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(ang);
          ctx.beginPath();
          ctx.moveTo(22, 0);
          ctx.lineTo(142, -16);
          ctx.lineTo(142, 16);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      } else if (variant === 1 || variant === 4) {
        for (let b = 0; b < 3; b++) {
          const a0 = (b * Math.PI * 2) / 3 - Math.PI / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, 96, a0 - 0.35, a0 + 0.35);
          ctx.arc(cx, cy, 34, a0 + 0.35, a0 - 0.35, true);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        ctx.lineWidth = 14;
        for (let q = 0; q < 4; q++) {
          const a0 = (q * Math.PI) / 2 + 0.28;
          ctx.beginPath();
          ctx.arc(cx, cy, 118, a0, a0 + 1.0);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = cyanCol;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (gen === 'GEN 2' || gen === 'GEN 3') {
    const blueCol = isLocked ? '#00ff88' : '#00a8ff';
    const redCol = '#ff2a55';
    ctx.save();
    if (!isInnerLayer) {
      ctx.strokeStyle = blueCol;
      ctx.shadowColor = blueCol;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 8;
      if (variant % 3 === 0) {
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const ang = (s * Math.PI) / 3;
          const vx = cx + Math.cos(ang) * 204;
          const vy = cy + Math.sin(ang) * 204;
          if (s === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.stroke();
      } else if (variant % 3 === 1) {
        [-1, 1].forEach(function(side) {
          const bx = cx + side * 175;
          ctx.beginPath();
          ctx.moveTo(bx - side * 35, cy - 165);
          ctx.lineTo(bx, cy - 165);
          ctx.lineTo(bx, cy + 165);
          ctx.lineTo(bx - side * 35, cy + 165);
          ctx.stroke();
        });
      } else {
        for (let q = 0; q < 4; q++) {
          ctx.beginPath();
          ctx.arc(cx, cy, 198, (q * Math.PI) / 2 + 0.22, ((q + 1) * Math.PI) / 2 - 0.22);
          ctx.stroke();
        }
      }
    } else {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 215, cy);
      ctx.lineTo(cx - 32, cy);
      ctx.moveTo(cx + 32, cy);
      ctx.lineTo(cx + 215, cy);
      ctx.moveTo(cx, cy - 215);
      ctx.lineTo(cx, cy - 32);
      ctx.moveTo(cx, cy + 32);
      ctx.lineTo(cx, cy + 215);
      ctx.stroke();

      for (let tick = -160; tick <= 160; tick += 32) {
        if (Math.abs(tick) < 35) continue;
        ctx.beginPath();
        ctx.moveTo(cx + tick, cy - 8);
        ctx.lineTo(cx + tick, cy + 8);
        ctx.moveTo(cx - 8, cy + tick);
        ctx.lineTo(cx + 8, cy + tick);
        ctx.stroke();
      }

      ctx.strokeStyle = redCol;
      ctx.lineWidth = 5;
      ctx.strokeRect(cx - 46, cy - 46, 92, 92);
      ctx.fillStyle = redCol;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else {
    const greenCol = isLocked ? '#ff2a55' : '#00ff66';
    ctx.save();
    ctx.strokeStyle = greenCol;
    ctx.fillStyle = greenCol;
    ctx.shadowColor = greenCol;
    ctx.shadowBlur = 10;
    if (!isInnerLayer) {
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(cx, cy, 196, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, 218, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.lineWidth = (i % 2 === 0) ? 6 : 4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * 176, cy + Math.sin(ang) * 176);
        ctx.lineTo(cx + Math.cos(ang) * 212, cy + Math.sin(ang) * 212);
        ctx.stroke();
      }
    } else {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 92, 0, Math.PI * 2);
      ctx.stroke();

      for (let m = -140; m <= 140; m += 24) {
        if (Math.abs(m) < 28) continue;
        ctx.beginPath();
        ctx.moveTo(cx + m, cy - 6);
        ctx.lineTo(cx + m, cy + 6);
        ctx.moveTo(cx - 6, cy + m);
        ctx.lineTo(cx + 6, cy + m);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  _reticleTextureCache[key] = tex;
  return tex;
};

// ============================================================================
// 3. AERONAUTICAL AIRFOIL, GOLDEN SHIELD & PROJECTILE BUILDERS
// ============================================================================
window.VF.initSharedShipGeometries = function() {
  if (window.VF._sharedGeomsReady) return window.VF.SharedShipGeos;
  window.VF._sharedGeomsReady = true;
  window.VF.SharedShipGeos = {
    oblitWarheadInner: new THREE.IcosahedronGeometry(0.58, 1),
    oblitWarheadOuter: new THREE.IcosahedronGeometry(0.95, 1),
    oblitShockRing: new THREE.TorusGeometry(1.18, 0.08, 8, 28)
  };
  return window.VF.SharedShipGeos;
};

window.VF.createCustomWingPanel = function(spanX, rootChord, tipChord, sweepOffsetZ, thickness, mat, mirrorX) {
  const dir = mirrorX ? -1 : 1;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(dir * spanX, -sweepOffsetZ);
  shape.lineTo(dir * spanX, -sweepOffsetZ - tipChord);
  shape.lineTo(0, -rootChord);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025
  });
  geo.rotateX(Math.PI / 2);
  return new THREE.Mesh(geo, mat);
};

window.VF.createZeroGapWing = function(span, a1, a2, a3, a4, a5, a6, a7) {
  const defaultMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.85,
    roughness: 0.22,
    side: THREE.DoubleSide
  });
  if (arguments.length >= 7) {
    const wSpan = Math.abs(Number(span) || 1.4);
    const rZ1 = Number(a1) || 0.5;
    const rZ2 = Number(a2) || -0.5;
    const tZ1 = Number(a3) || 0.2;
    const tZ2 = Number(a4) || -0.4;
    const halfH = Math.max(0.012, (Number(a5) || 0.05) * 0.5);
    const mat = (a6 && a6.isMaterial) ? a6 : defaultMat;
    const sideSign = (Number(a7) < 0) ? -1 : 1;
    const tipX = sideSign * wSpan;

    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, halfH, rZ1,   tipX, halfH, tZ1,   tipX, halfH, tZ2,
      0, halfH, rZ1,   tipX, halfH, tZ2,   0, halfH, rZ2,
      0, -halfH, rZ1,  tipX, -halfH, tZ2,  tipX, -halfH, tZ1,
      0, -halfH, rZ1,  0, -halfH, rZ2,     tipX, -halfH, tZ2
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return new THREE.Mesh(geom, mat);
  }
  const mat = (a4 && a4.isMaterial) ? a4 : defaultMat;
  return window.VF.createCustomWingPanel(Number(span) || 1.5, Number(a1) || 1.2, Number(a2) || 0.4, Number(a3) || 0.5, 0.045, mat, false);
};

window.VF.buildGoldenHexSphereShield = function() {
  const shieldGroup = new THREE.Group();
  shieldGroup.visible = false;

  const hexTex = (window.VF.AssetCache && window.VF.AssetCache.goldenHexShieldTexture) || null;
  const innerMat = new THREE.MeshBasicMaterial({
    map: hexTex,
    color: 0xffd700,
    transparent: true,
    opacity: 0.46,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    wireframe: true,
    transparent: true,
    opacity: 0.26,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffe066,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
  });
  const rippleMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(1.75, 24, 18), innerMat);
  innerSphere.scale.set(1.05, 0.70, 1.48);
  const midWireSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.80, 2), wireMat);
  midWireSphere.scale.set(1.05, 0.70, 1.48);
  const outerHaloSphere = new THREE.Mesh(new THREE.SphereGeometry(1.88, 20, 16), haloMat);
  outerHaloSphere.scale.set(1.05, 0.70, 1.48);

  const eqRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.82, 0.032, 10, 48),
    new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
  );
  eqRing.rotation.x = Math.PI / 2;
  eqRing.scale.set(1.0, 1.42, 1.0);

  const impactRippleRing = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.68, 32), rippleMat);
  impactRippleRing.position.set(0, 0, -1.85);

  shieldGroup.add(innerSphere, midWireSphere, outerHaloSphere, eqRing, impactRippleRing);
  shieldGroup.userData = {
    innerSphere: innerSphere,
    midWireSphere: midWireSphere,
    outerHaloSphere: outerHaloSphere,
    eqRing: eqRing,
    impactRippleRing: impactRippleRing,
    innerMat: innerMat,
    wireMat: wireMat,
    haloMat: haloMat,
    rippleMat: rippleMat,
    rippleTimer: 0.0
  };
  return shieldGroup;
};

window.VF.buildSupernovaObliteratorProjectileMesh = function(colorHex) {
  const geos = window.VF.initSharedShipGeometries();
  const group = new THREE.Group();
  group.visible = false;
  const col = (typeof colorHex === 'number') ? colorHex : 0x00f0ff;

  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const outerShellMat = new THREE.MeshBasicMaterial({
    color: col,
    wireframe: true,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending
  });
  const plasmaTrailMat = new THREE.MeshBasicMaterial({
    color: col,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const coreMesh = new THREE.Mesh(geos.oblitWarheadInner, coreMat);
  const outerMesh = new THREE.Mesh(geos.oblitWarheadOuter, outerShellMat);
  const shockRing = new THREE.Mesh(geos.oblitShockRing, plasmaTrailMat);
  group.add(coreMesh, outerMesh, shockRing);

  return {
    group: group,
    outerShellMat: outerShellMat,
    plasmaTrailMat: plasmaTrailMat,
    shockRing: shockRing
  };
};

// ============================================================================
// 4. HYPERSONIC WHITE V-HUNTER DRONE WITH WARP-PORTAL RINGS & AIM BEAM
// ============================================================================
window.VF.buildWhiteVHunterDrone = function() {
  const droneGroup = new THREE.Group();
  const matCeramicWhite = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.86,
    roughness: 0.18,
    emissive: 0xe2e8f0,
    emissiveIntensity: 0.18
  });
  const matDarkTitanium = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.92,
    roughness: 0.24
  });
  const matCyanTrim = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const matRedEye = new THREE.MeshBasicMaterial({ color: 0xff1133 });

  const bwbBody = new THREE.Group();
  droneGroup.add(bwbBody);

  const noseGeo = new THREE.ConeGeometry(0.52, 1.65, 8);
  noseGeo.rotateX(Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, matCeramicWhite);
  nose.scale.set(1.25, 0.44, 1.0);
  nose.position.set(0, 0, 1.10);
  bwbBody.add(nose);

  const midGeo = new THREE.CylinderGeometry(0.52, 0.62, 1.35, 8);
  midGeo.rotateX(Math.PI / 2);
  const mid = new THREE.Mesh(midGeo, matCeramicWhite);
  mid.scale.set(1.30, 0.46, 1.0);
  mid.position.set(0, 0, -0.15);
  bwbBody.add(mid);

  const visorGeo = new THREE.CylinderGeometry(0.20, 0.36, 0.92, 6);
  visorGeo.rotateX(Math.PI / 2);
  const visor = new THREE.Mesh(visorGeo, matDarkTitanium);
  visor.scale.set(1.15, 0.48, 1.0);
  visor.position.set(0, 0.16, 0.35);
  bwbBody.add(visor);

  [-1, 1].forEach(function(side) {
    const wing = window.VF.createCustomWingPanel(2.35, 1.25, 0.32, -0.62, 0.048, matCeramicWhite, side < 0);
    wing.position.set(side * 0.42, 0, 0.48);
    wing.rotation.z = side * 0.05;
    bwbBody.add(wing);

    const leadStrip = window.VF.createCustomWingPanel(2.36, 0.16, 0.09, -0.62, 0.054, matCyanTrim, side < 0);
    leadStrip.position.set(side * 0.42, 0, 0.52);
    leadStrip.rotation.z = side * 0.05;
    bwbBody.add(leadStrip);

    const cantedFin = window.VF.createCustomWingPanel(0.64, 0.56, 0.18, 0.28, 0.040, matDarkTitanium, false);
    cantedFin.rotation.z = Math.PI / 2 - side * 0.38;
    cantedFin.position.set(side * 0.56, 0.14, -0.45);
    bwbBody.add(cantedFin);
  });

  const turretGroup = new THREE.Group();
  turretGroup.position.set(0, -0.18, 0.90);
  bwbBody.add(turretGroup);

  turretGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), matDarkTitanium));
  const coreLens = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), matRedEye);
  coreLens.position.set(0, 0, 0.18);
  turretGroup.add(coreLens);

  // Telegraph Targeting Laser Beam
  const aimGeo = new THREE.CylinderGeometry(0.025, 0.025, 36.0, 6);
  aimGeo.rotateX(Math.PI / 2);
  aimGeo.translate(0, 0, 18.0);
  const aimLaserMesh = new THREE.Mesh(
    aimGeo,
    new THREE.MeshBasicMaterial({ color: 0xff2a55, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
  );
  aimLaserMesh.visible = false;
  turretGroup.add(aimLaserMesh);

  const lockHaloMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const lockHalo = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.04, 8, 32), lockHaloMat);
  lockHalo.position.set(0, 0, 0.25);
  bwbBody.add(lockHalo);

  // Cinematic Forward Warp-Rift Portal Rings
  const spawnRingsGroup = new THREE.Group();
  spawnRingsGroup.visible = false;
  droneGroup.add(spawnRingsGroup);

  const spawnRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.06, 10, 36),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
  );
  const spawnRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.1, 0.045, 10, 36),
    new THREE.MeshBasicMaterial({ color: 0xb500ff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
  );
  spawnRingsGroup.add(spawnRing1, spawnRing2);

  droneGroup.scale.setScalar(1.42);
  droneGroup.userData = {
    baseScale: 1.42,
    bwbBodyGroup: bwbBody,
    turretGimbalGroup: turretGroup,
    coreLens: coreLens,
    lockHaloRing: lockHalo,
    lockHaloMat: lockHaloMat,
    aimLaserMesh: aimLaserMesh,
    spawnRingsGroup: spawnRingsGroup,
    spawnRing1: spawnRing1,
    spawnRing2: spawnRing2
  };
  return droneGroup;
};
window.VF.buildEnemyHunterGunship = window.VF.buildWhiteVHunterDrone;

window.VF.buildDronePlasmaBall = function(isMultiColor) {
  const ballGroup = new THREE.Group();
  ballGroup.visible = false;
  const whiteCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const radius = isMultiColor ? 0.68 : 0.58;
  const outerCol = isMultiColor ? 0xff00aa : 0x00e5ff;

  ballGroup.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 0.55, 14, 14), whiteCoreMat));
  const outerMat = new THREE.MeshBasicMaterial({
    color: outerCol,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending
  });
  ballGroup.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), outerMat));

  const ringMat = new THREE.MeshBasicMaterial({
    color: isMultiColor ? 0xffcc00 : 0x00f0ff,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending
  });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.15, 0.045, 8, 24), ringMat);
  ballGroup.add(ring1);

  ballGroup.userData = {
    isMultiColor: Boolean(isMultiColor),
    radius: radius,
    outerMat: outerMat,
    ring1: ring1
  };
  return ballGroup;
};

// ============================================================================
// 5. NEXT-GEN INNOVATIVE 3D SPACECRAFT BUILDER (`VF.buildWeaponizedSpacecraft`)
//    Features Sculpted Aero-Chines, Spinning Dorsal Fusion Cores, Floating
//    Wingtip V-Bit Stabilizers, Intake Fans & 6-Barrel Rotary Rail-Cannons
// ============================================================================
window.VF.getResolvedTrimColor = function(spec, trimOverride) {
  const palette = window.VF.CUSTOM_TRIM_PALETTE || [];
  const idx = (trimOverride !== undefined && trimOverride !== null)
    ? Number(trimOverride)
    : ((window.VF.state && window.VF.state.customTrimIndex) || 0);
  const entry = palette[idx];
  return (entry && typeof entry.hex === 'number') ? entry.hex : (spec ? spec.weaponColor : 0x00f0ff);
};

window.VF.buildWeaponizedSpacecraft = function(specParam, showWireframe, trimOverride) {
  const spec = specParam || (window.VF.ROCKET_FLEET && window.VF.ROCKET_FLEET[8]) || {
    id: 9, name: 'Apex V8', gen: 'GEN 2', cls: 'Gunship', length: 2.2, width: 1.0, speed: 8.5,
    colorA: 0x00f0ff, colorB: 0x7c3aed, weaponName: 'V8 Plasma Repeaters', weaponType: 'PLASMA', weaponColor: 0xa855f7
  };
  const wf = Boolean(showWireframe);
  const group = new THREE.Group();
  const morph = window.VF.SHIP_MORPHOLOGY[spec.id] || window.VF.SHIP_MORPHOLOGY[9];
  const trimColor = window.VF.getResolvedTrimColor(spec, trimOverride);

  const isCeramicHull = (spec.gen === 'GEN 4' || spec.gen === 'GEN 5' || spec.id % 3 === 1);
  const hullColorHex = isCeramicHull ? 0xf1f5f9 : spec.colorA;

  const matPrimary = new THREE.MeshStandardMaterial({
    color: hullColorHex,
    roughness: 0.24,
    metalness: 0.45,
    emissive: spec.colorA,
    emissiveIntensity: 0.18,
    wireframe: wf
  });
  const matSecondary = new THREE.MeshStandardMaterial({
    color: spec.colorB,
    roughness: 0.26,
    metalness: 0.48,
    emissive: spec.colorB,
    emissiveIntensity: 0.28,
    wireframe: wf
  });
  const matTitanium = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.55,
    emissive: 0x334155,
    emissiveIntensity: 0.15,
    wireframe: wf
  });
  const matDarkArmor = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.28,
    metalness: 0.48,
    emissive: spec.colorA,
    emissiveIntensity: 0.12,
    wireframe: wf
  });
  const matCanopy = new THREE.MeshPhysicalMaterial({
    color: spec.id % 2 === 0 ? 0xffaa00 : 0x00f0ff,
    roughness: 0.05,
    metalness: 0.60,
    transparent: true,
    opacity: 0.84,
    emissive: spec.id % 2 === 0 ? 0xf97316 : 0x00a8ff,
    emissiveIntensity: 0.58,
    wireframe: wf
  });
  const matVentGlow = new THREE.MeshBasicMaterial({
    color: spec.id % 3 === 0 ? 0x00f0ff : 0xffaa00, wireframe: wf
  });
  const matWeaponGlow = new THREE.MeshBasicMaterial({
    color: trimColor, wireframe: wf
  });
  const matPlumeOuter = new THREE.MeshBasicMaterial({
    color: 0x00f0ff, transparent: true, opacity: 0.90, blending: THREE.AdditiveBlending, wireframe: wf
  });
  const matPlumeCore = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: wf });

  const len = Math.min(3.40, Math.max(1.90, spec.length * 0.94));
  const wid = Math.min(1.60, Math.max(0.92, spec.width * 1.14));
  const bodyRadius = wid * (spec.gen === 'GEN 4' || spec.gen === 'GEN 5' ? 0.29 : 0.25);

  const fuselageGroup = new THREE.Group();
  const canopyGroup = new THREE.Group();
  const leftWingGroup = new THREE.Group();
  const rightWingGroup = new THREE.Group();
  const nozzleGroup = new THREE.Group();
  group.add(fuselageGroup, canopyGroup, leftWingGroup, rightWingGroup, nozzleGroup);

  // 1. Sculpted Multi-Section Chiseled Aeronautical Fuselage & Dorsal Spine
  const fuselageSegs = (spec.id % 3 === 0) ? 6 : (spec.id % 2 === 0 ? 8 : 12);
  const aftCoreGeo = new THREE.CylinderGeometry(bodyRadius * 0.88, bodyRadius * 1.08, len * 0.44, fuselageSegs);
  aftCoreGeo.rotateX(Math.PI / 2);
  const aftCore = new THREE.Mesh(aftCoreGeo, matDarkArmor);
  aftCore.position.set(0, 0, len * 0.15);
  fuselageGroup.add(aftCore);

  const midHullGeo = new THREE.CylinderGeometry(bodyRadius * 0.64, bodyRadius * 0.96, len * 0.54, fuselageSegs);
  midHullGeo.rotateX(Math.PI / 2);
  const midHull = new THREE.Mesh(midHullGeo, matPrimary);
  midHull.scale.set(1.24, 0.76, 1.0);
  midHull.position.set(0, 0, -len * 0.12);
  fuselageGroup.add(midHull);

  const spineChine = new THREE.Mesh(
    new THREE.BoxGeometry(bodyRadius * 1.18, bodyRadius * 0.42, len * 0.72),
    matTitanium
  );
  spineChine.position.set(0, bodyRadius * 0.44, -len * 0.04);
  fuselageGroup.add(spineChine);

  // Twin Forward-Swept Ram-Air Intake Fairings with Spinning Compressor Fans
  const intakeRotors = [];
  [-1, 1].forEach(function(side) {
    const intakeX = side * bodyRadius * 1.02;
    const intakeChine = new THREE.Mesh(
      new THREE.BoxGeometry(bodyRadius * 0.58, bodyRadius * 0.38, len * 0.60),
      matDarkArmor
    );
    intakeChine.position.set(intakeX, 0.03, 0.04);
    fuselageGroup.add(intakeChine);

    const intakeShroud = new THREE.Mesh(
      new THREE.TorusGeometry(bodyRadius * 0.24, 0.035, 8, 16),
      matWeaponGlow
    );
    intakeShroud.position.set(intakeX, 0.03, -len * 0.26);
    fuselageGroup.add(intakeShroud);

    const rotor = new THREE.Group();
    rotor.position.set(intakeX, 0.03, -len * 0.25);
    const bladeGeo = new THREE.BoxGeometry(bodyRadius * 0.42, 0.028, 0.02);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(bladeGeo, matTitanium);
      blade.rotation.z = (b * Math.PI) / 4;
      rotor.add(blade);
    }
    fuselageGroup.add(rotor);
    intakeRotors.push(rotor);
  });

  // Spinning Gyroscopic Dorsal Singularity Reactor Core
  const reactorGroup = new THREE.Group();
  reactorGroup.position.set(0, bodyRadius * 0.72, len * 0.12);
  const coreOctahedron = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), matWeaponGlow);
  const gimbalRingA = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.022, 8, 24), matTitanium);
  gimbalRingA.rotation.x = Math.PI / 2;
  const gimbalRingB = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.018, 8, 24), matVentGlow);
  reactorGroup.add(coreOctahedron, gimbalRingA, gimbalRingB);
  fuselageGroup.add(reactorGroup);

  // 2. Sculpted Bubble / Faceted Cockpit Canopy & Forward Canards
  const canopyGeo = new THREE.CylinderGeometry(bodyRadius * 0.32, bodyRadius * 0.56, len * 0.38, 6);
  canopyGeo.rotateX(Math.PI / 2);
  const canopy = new THREE.Mesh(canopyGeo, matCanopy);
  canopy.scale.set(1.14, 0.78, 1.0);
  canopy.position.set(0, bodyRadius * 0.62, -len * 0.16);
  canopyGroup.add(canopy);

  [-1, 1].forEach(function(side) {
    const canard = window.VF.createCustomWingPanel(bodyRadius * 1.15, 0.26, 0.09, -0.14, 0.032, matTitanium, side < 0);
    canard.position.set(side * bodyRadius * 0.48, 0.04, -len * 0.34);
    fuselageGroup.add(canard);
  });

  // 3. Precision Aeronautical Nose Prow Assembly per `morph.nose`
  const noseZ = -len * 0.38;
  if (morph.nose === 'TURBINE' || morph.nose === 'INTAKE') {
    const cowlGeo = new THREE.CylinderGeometry(bodyRadius * 0.56, bodyRadius * 0.66, len * 0.34, 14, 1, true);
    cowlGeo.rotateX(Math.PI / 2);
    const cowl = new THREE.Mesh(cowlGeo, matSecondary);
    cowl.position.z = noseZ - len * 0.14;
    fuselageGroup.add(cowl);
    const coreGlow = new THREE.Mesh(new THREE.CylinderGeometry(bodyRadius * 0.44, bodyRadius * 0.44, 0.12, 12), matVentGlow);
    coreGlow.rotation.x = Math.PI / 2;
    coreGlow.position.z = noseZ - len * 0.26;
    fuselageGroup.add(coreGlow);
  } else if (morph.nose === 'TWIN_PRONG' || morph.nose === 'RAIL_SPLIT') {
    const prongGeo = new THREE.BoxGeometry(bodyRadius * 0.28, bodyRadius * 0.36, len * 0.52);
    [-1, 1].forEach(function(s) {
      const prong = new THREE.Mesh(prongGeo, matSecondary);
      prong.position.set(s * bodyRadius * 0.50, 0, noseZ - len * 0.20);
      fuselageGroup.add(prong);
    });
    const centerCore = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len * 0.48, 8), matWeaponGlow);
    centerCore.rotation.x = Math.PI / 2;
    centerCore.position.z = noseZ - len * 0.18;
    fuselageGroup.add(centerCore);
  } else if (morph.nose === 'HAMMER' || morph.nose === 'SNUB_SIEGE') {
    const hammerProw = new THREE.Mesh(new THREE.BoxGeometry(wid * 0.96, bodyRadius * 0.58, len * 0.28), matSecondary);
    hammerProw.position.z = noseZ - len * 0.12;
    fuselageGroup.add(hammerProw);
    const siegePort = new THREE.Mesh(new THREE.TorusGeometry(bodyRadius * 0.32, 0.05, 8, 16), matWeaponGlow);
    siegePort.position.z = noseZ - len * 0.27;
    fuselageGroup.add(siegePort);
  } else {
    const noseLen = len * (morph.nose === 'LANCE' ? 0.56 : 0.44);
    const noseGeo = new THREE.ConeGeometry(bodyRadius * 0.64, noseLen, morph.nose === 'SPIRE' ? 4 : 10);
    noseGeo.rotateX(-Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, matPrimary);
    noseMesh.scale.set(1.15, 0.72, 1.0);
    noseMesh.position.z = noseZ - noseLen * 0.5;
    fuselageGroup.add(noseMesh);
  }

  // 4. Articulated 6-Barrel Rotary Rail-Cannons & Singularity Charge Rig
  const muzzleFlashGroup = new THREE.Group();
  muzzleFlashGroup.name = 'muzzleFlashGroup';
  muzzleFlashGroup.visible = false;
  group.add(muzzleFlashGroup);

  const noseCannonBarrel = new THREE.Group();
  group.add(noseCannonBarrel);

  const noseBarrelLen = len * 0.44;
  const noseBarrelGeo = new THREE.CylinderGeometry(0.038, 0.050, noseBarrelLen, 8);
  noseBarrelGeo.rotateX(Math.PI / 2);
  [-1, 1].forEach(function(side) {
    const bMesh = new THREE.Mesh(noseBarrelGeo, matTitanium);
    bMesh.position.set(side * bodyRadius * 0.52, -bodyRadius * 0.22, -len * 0.46);
    noseCannonBarrel.add(bMesh);

    const mTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), matWeaponGlow);
    mTip.position.set(side * bodyRadius * 0.52, -bodyRadius * 0.22, -len * 0.46 - noseBarrelLen * 0.5);
    muzzleFlashGroup.add(mTip);
  });

  const leftGunPivot = new THREE.Group();
  const rightGunPivot = new THREE.Group();
  const span = wid * (0.98 + (spec.id % 4) * 0.10);
  const rootC = len * 0.48;
  const tipC = len * (morph.wing === 'DIAMOND' ? 0.08 : 0.20);
  const sweepZ = len * morph.sweep;
  const pivotX = bodyRadius * 0.48 + span * 0.88;
  const pivotY = Math.sin(morph.dihedral) * span * 0.88;
  const pivotZ = -len * 0.16 + sweepZ * 0.8;

  leftGunPivot.position.set(-pivotX, pivotY, pivotZ);
  rightGunPivot.position.set(pivotX, pivotY, pivotZ);
  group.add(leftGunPivot, rightGunPivot);

  const gatlingCores = [];
  [leftGunPivot, rightGunPivot].forEach(function(piv, idx) {
    const side = idx === 0 ? -1 : 1;
    const podGeo = new THREE.CylinderGeometry(0.058, 0.072, len * 0.56, 8);
    podGeo.rotateX(Math.PI / 2);
    piv.add(new THREE.Mesh(podGeo, matDarkArmor));

    const rotaryGroup = new THREE.Group();
    rotaryGroup.position.set(0, 0, -len * 0.22);
    const microBarrelGeo = new THREE.CylinderGeometry(0.016, 0.016, len * 0.42, 6);
    microBarrelGeo.rotateX(Math.PI / 2);
    for (let g = 0; g < 6; g++) {
      const ang = (g * Math.PI) / 3;
      const mb = new THREE.Mesh(microBarrelGeo, matTitanium);
      mb.position.set(Math.cos(ang) * 0.036, Math.sin(ang) * 0.036, 0);
      rotaryGroup.add(mb);
    }
    piv.add(rotaryGroup);
    gatlingCores.push(rotaryGroup);

    const railBlade = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, len * 0.58), matTitanium);
    railBlade.position.set(side * 0.055, 0, -len * 0.08);
    piv.add(railBlade);

    const muzzleRing = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 16), matWeaponGlow);
    muzzleRing.position.set(0, 0, -len * 0.42);
    piv.add(muzzleRing);
  });

  // Singularity Energy Sphere + Dual Gyro Rings + Electric Lightning Arcs
  const energyBallMesh = new THREE.Group();
  energyBallMesh.position.set(0, 0.08, -2.35);
  energyBallMesh.scale.set(0.001, 0.001, 0.001);
  energyBallMesh.visible = false;
  energyBallMesh.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), new THREE.MeshBasicMaterial({ color: 0xffffff })));
  const outerShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.68, 1),
    new THREE.MeshBasicMaterial({ color: trimColor, wireframe: true, transparent: true, opacity: 0.90 })
  );
  const gyroRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.025, 8, 24), matVentGlow);
  const gyroRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.020, 8, 24), matWeaponGlow);
  gyroRing2.rotation.x = Math.PI / 2;
  energyBallMesh.add(outerShell, gyroRing1, gyroRing2);
  group.add(energyBallMesh);

  const gatherParticles = [];
  const moteGeo = new THREE.OctahedronGeometry(0.085, 0);
  for (let m = 0; m < 12; m++) {
    const mote = new THREE.Mesh(moteGeo, (m % 2 === 0) ? matWeaponGlow : matVentGlow);
    mote.visible = false;
    mote.userData = { baseAngle: (m / 12) * Math.PI * 2, radiusOffset: 1.15 + (m % 3) * 0.28 };
    group.add(mote);
    gatherParticles.push(mote);
  }

  // 5. Sculpted Layered Airfoils + Floating Wingtip V-Bit Stabilizers
  const magLockPods = [];
  if (morph.wing === 'X_WING') {
    [-1, 1].forEach(function(side) {
      const targetWingGrp = side < 0 ? leftWingGroup : rightWingGroup;
      [-1, 1].forEach(function(vDir) {
        const xWing = window.VF.createCustomWingPanel(span * 0.96, rootC * 0.76, tipC * 0.82, sweepZ, 0.052, matPrimary, side < 0);
        xWing.position.set(side * bodyRadius * 0.44, vDir * bodyRadius * 0.18, -len * 0.14);
        xWing.rotation.z = side * vDir * morph.dihedral;
        targetWingGrp.add(xWing);

        const edgeStrip = window.VF.createCustomWingPanel(span * 0.96, 0.12, 0.08, sweepZ, 0.058, matWeaponGlow, side < 0);
        edgeStrip.position.set(side * bodyRadius * 0.44, vDir * bodyRadius * 0.18, -len * 0.12);
        edgeStrip.rotation.z = side * vDir * morph.dihedral;
        targetWingGrp.add(edgeStrip);
      });
    });
  } else if (morph.wing === 'ASYM_SHARD') {
    const leftWing = window.VF.createCustomWingPanel(span * 1.22, rootC, tipC, -len * 0.42, 0.06, matPrimary, true);
    leftWing.position.set(-bodyRadius * 0.46, 0, -len * 0.15);
    leftWingGroup.add(leftWing);
    const rightWing = window.VF.createCustomWingPanel(span * 0.76, rootC * 0.82, tipC * 1.15, len * 0.34, 0.06, matSecondary, false);
    rightWing.position.set(bodyRadius * 0.46, 0.12, -len * 0.05);
    rightWingGroup.add(rightWing);
    const shardCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(wid * 0.38, 0), matWeaponGlow);
    shardCrystal.position.set(wid * 0.72, 0, -len * 0.12);
    rightWingGroup.add(shardCrystal);
  } else if (morph.wing === 'QUAD_SPONSON') {
    const sponsonGeo = new THREE.BoxGeometry(wid * 0.36, bodyRadius * 0.68, len * 0.76);
    [-1, 1].forEach(function(side) {
      const targetWingGrp = side < 0 ? leftWingGroup : rightWingGroup;
      const sponson = new THREE.Mesh(sponsonGeo, matDarkArmor);
      sponson.position.set(side * wid * 0.58, 0, len * 0.02);
      targetWingGrp.add(sponson);
      const wPanel = window.VF.createCustomWingPanel(span * 0.82, rootC * 0.82, tipC, sweepZ, 0.062, matPrimary, side < 0);
      wPanel.position.set(side * wid * 0.66, 0, -len * 0.15);
      wPanel.rotation.z = side * morph.dihedral;
      targetWingGrp.add(wPanel);
      const reactorCore = new THREE.Mesh(new THREE.SphereGeometry(bodyRadius * 0.26, 10, 10), matVentGlow);
      reactorCore.position.set(side * wid * 0.76, 0, -len * 0.10);
      targetWingGrp.add(reactorCore);
    });
  } else {
    [-1, 1].forEach(function(side) {
      const targetWingGrp = side < 0 ? leftWingGroup : rightWingGroup;
      const wPanel = window.VF.createCustomWingPanel(span, rootC, tipC, sweepZ, 0.058, matPrimary, side < 0);
      wPanel.position.set(side * bodyRadius * 0.46, 0, -len * 0.16);
      wPanel.rotation.z = side * morph.dihedral;
      targetWingGrp.add(wPanel);

      const leadingTrim = window.VF.createCustomWingPanel(span, 0.14, 0.08, sweepZ, 0.064, matWeaponGlow, side < 0);
      leadingTrim.position.set(side * bodyRadius * 0.46, 0, -len * 0.14);
      leadingTrim.rotation.z = side * morph.dihedral;
      targetWingGrp.add(leadingTrim);

      const vent = new THREE.Mesh(new THREE.BoxGeometry(span * 0.44, 0.032, len * 0.14), matVentGlow);
      vent.position.set(side * (bodyRadius * 0.48 + span * 0.42), -0.04, len * 0.04);
      vent.rotation.z = side * morph.dihedral;
      targetWingGrp.add(vent);
    });
  }

  // Floating Magnetic Wingtip V-Bit Stabilizers
  [-1, 1].forEach(function(side) {
    const targetWingGrp = side < 0 ? leftWingGroup : rightWingGroup;
    const vBit = new THREE.Group();
    const podX = side * (pivotX + 0.18);
    const podY = pivotY + 0.06;
    vBit.position.set(podX, podY, pivotZ);
    const bitBody = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, len * 0.46), matTitanium);
    const bitBlade = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.22, len * 0.54), matWeaponGlow);
    vBit.add(bitBody, bitBlade);
    targetWingGrp.add(vBit);
    magLockPods.push({ pod: vBit, baseY: podY, side: side });
  });

  // 6. Over-Wing / Outrigger Cylindrical Turbo-Nacelles
  if (morph.nacelles >= 2) {
    const nacLen = len * 0.60;
    const nacGeo = new THREE.CylinderGeometry(bodyRadius * 0.30, bodyRadius * 0.36, nacLen, 12);
    nacGeo.rotateX(Math.PI / 2);
    const positions = morph.nacelles === 4
      ? [[-wid * 0.50, bodyRadius * 0.42], [wid * 0.50, bodyRadius * 0.42], [-wid * 0.82, -bodyRadius * 0.28], [wid * 0.82, -bodyRadius * 0.28]]
      : [[-wid * 0.52, bodyRadius * 0.40], [wid * 0.52, bodyRadius * 0.40]];
    positions.forEach(function(pos) {
      const nx = pos[0];
      const ny = pos[1];
      const targetWingGrp = nx < 0 ? leftWingGroup : rightWingGroup;
      const nac = new THREE.Mesh(nacGeo, matDarkArmor);
      nac.position.set(nx, ny, len * 0.06);
      targetWingGrp.add(nac);
      const fanRing = new THREE.Mesh(new THREE.TorusGeometry(bodyRadius * 0.30, 0.036, 8, 16), matWeaponGlow);
      fanRing.position.set(nx, ny, len * 0.06 - nacLen * 0.5);
      targetWingGrp.add(fanRing);
    });
  }

  // 7. Twin Tail Booms & Floating Warp Ring Halo
  if (morph.booms) {
    const boomGeo = new THREE.BoxGeometry(0.11, 0.15, len * 0.90);
    [-1, 1].forEach(function(s) {
      const targetWingGrp = s < 0 ? leftWingGroup : rightWingGroup;
      const boom = new THREE.Mesh(boomGeo, matTitanium);
      boom.position.set(s * wid * 0.64, 0, len * 0.10);
      targetWingGrp.add(boom);
    });
  }
  let haloRingMesh = null;
  if (morph.ring) {
    haloRingMesh = new THREE.Mesh(new THREE.TorusGeometry(wid * 0.84, 0.055, 10, 36), matPlumeOuter);
    haloRingMesh.position.z = len * 0.04;
    fuselageGroup.add(haloRingMesh);
  }

  // 8. Vertical / V-Tail Stabilizer Fins
  if (morph.tail === 'SINGLE' || morph.tail === 'TRIPLE') {
    const cFin = window.VF.createCustomWingPanel(wid * 0.58, len * 0.36, len * 0.12, len * 0.15, 0.046, matPrimary, false);
    cFin.rotation.z = Math.PI / 2;
    cFin.position.set(0, bodyRadius * 0.48, len * 0.06);
    fuselageGroup.add(cFin);
  }
  if (morph.tail === 'TWIN' || morph.tail === 'V_TAIL' || morph.tail === 'TRIPLE') {
    const tilt = morph.tail === 'V_TAIL' ? 0.42 : 0.08;
    [-1, 1].forEach(function(s) {
      const tFin = window.VF.createCustomWingPanel(wid * 0.52, len * 0.34, len * 0.11, len * 0.14, 0.042, matSecondary, false);
      tFin.rotation.z = Math.PI / 2 - s * tilt;
      tFin.position.set(s * bodyRadius * 0.50, bodyRadius * 0.38, len * 0.08);
      fuselageGroup.add(tFin);
    });
  }

  // 9. Horizontal Multi-Nozzle Afterburner Array with Mach Shock-Diamonds
  const thrusterFlameGroup = new THREE.Group();
  thrusterFlameGroup.name = 'thrusterFlame';
  thrusterFlameGroup.position.z = len * 0.38;
  nozzleGroup.add(thrusterFlameGroup);

  const nCount = Math.max(3, morph.engines || 4);
  const nozzleRadius = bodyRadius * (nCount >= 6 ? 0.24 : nCount >= 4 ? 0.28 : 0.36);
  const nozzleOffsets = [];
  const totalNozzleSpan = Math.min(wid * 1.15, nCount * nozzleRadius * 2.15);
  for (let i = 0; i < nCount; i++) {
    const frac = nCount === 1 ? 0 : (i / (nCount - 1)) * 2 - 1;
    nozzleOffsets.push([frac * totalNozzleSpan * 0.5, (i % 2 === 0) ? 0.0 : -0.02]);
  }

  const nozCollarGeo = new THREE.CylinderGeometry(nozzleRadius * 0.88, nozzleRadius * 1.08, 0.22, 10);
  nozCollarGeo.rotateX(Math.PI / 2);
  const outerConeGeo = new THREE.ConeGeometry(nozzleRadius * 0.86, 0.98, 10);
  outerConeGeo.rotateX(Math.PI / 2);
  const innerConeGeo = new THREE.ConeGeometry(nozzleRadius * 0.48, 0.66, 8);
  innerConeGeo.rotateX(Math.PI / 2);

  nozzleOffsets.forEach(function(off) {
    const nx = off[0];
    const ny = off[1];
    const collar = new THREE.Mesh(nozCollarGeo, matTitanium);
    collar.position.set(nx, ny, len * 0.35);
    nozzleGroup.add(collar);

    const outerPlume = new THREE.Mesh(outerConeGeo, matPlumeOuter);
    outerPlume.position.set(nx, ny, 0.44);
    thrusterFlameGroup.add(outerPlume);

    const innerPlume = new THREE.Mesh(innerConeGeo, matPlumeCore);
    innerPlume.position.set(nx, ny, 0.28);
    thrusterFlameGroup.add(innerPlume);
  });

  // 10. Golden Hexagonal Honeycomb Shield (Strictly Invisible by Default)
  const goldenShieldMesh = window.VF.buildGoldenHexSphereShield();
  goldenShieldMesh.visible = false;
  group.add(goldenShieldMesh);

  const shatterParts = [
    { group: fuselageGroup, restPos: new THREE.Vector3(0, 0, 0), vx: 0, vy: 2.5, vz: -3.2, rx: 1.8, ry: 2.0, rz: 1.4 },
    { group: leftWingGroup, restPos: new THREE.Vector3(0, 0, 0), vx: -5.8, vy: 1.4, vz: -1.8, rx: 2.4, ry: -2.8, rz: 3.8 },
    { group: rightWingGroup, restPos: new THREE.Vector3(0, 0, 0), vx: 5.8, vy: 1.4, vz: -1.8, rx: -2.4, ry: 2.8, rz: -3.8 },
    { group: leftGunPivot, restPos: new THREE.Vector3(-pivotX, pivotY, pivotZ), vx: -4.2, vy: 4.5, vz: -3.5, rx: 3.2, ry: 1.8, rz: -3.0 },
    { group: rightGunPivot, restPos: new THREE.Vector3(pivotX, pivotY, pivotZ), vx: 4.2, vy: 4.5, vz: -3.5, rx: -3.2, ry: -1.8, rz: 3.0 },
    { group: nozzleGroup, restPos: new THREE.Vector3(0, 0, 0), vx: 0, vy: -2.8, vz: 4.5, rx: -2.6, ry: 1.4, rz: 2.4 }
  ];

  // Commanding 1.12x Flight Scale
  group.scale.setScalar(1.12);

  const rigData = {
    spec: spec,
    activeTrimColor: trimColor,
    wingSpan: span,
    fuselageGroup: fuselageGroup,
    canopyGroup: canopyGroup,
    leftWingPivot: leftWingGroup,
    rightWingPivot: rightWingGroup,
    nozzleGroup: nozzleGroup,
    thrusterFlameGroup: thrusterFlameGroup,
    intakeRotors: intakeRotors,
    coreOctahedron: coreOctahedron,
    gimbalRingA: gimbalRingA,
    gimbalRingB: gimbalRingB,
    haloRingMesh: haloRingMesh,
    magLockPods: magLockPods,
    gatlingCores: gatlingCores,
    leftGunPivot: leftGunPivot,
    rightGunPivot: rightGunPivot,
    leftRestX: -pivotX,
    rightRestX: pivotX,
    restY: pivotY,
    restZ: pivotZ,
    noseCannonBarrel: noseCannonBarrel,
    energyBallMesh: energyBallMesh,
    gyroRing1: gyroRing1,
    gyroRing2: gyroRing2,
    gatherParticles: gatherParticles,
    goldenShieldMesh: goldenShieldMesh,
    shatterParts: shatterParts,
    shatterActive: false,
    shatterTimer: 0.0,
    explodedLerp: 0.0,
    animActive: false,
    animTime: 0,
    firedCallbackDone: false,
    onFireCallback: null
  };

  group.userData.rig = rigData;
  group.userData.weaponRig = rigData;
  return group;
};
window.VF.buildRocketMesh = window.VF.buildWeaponizedSpacecraft;
window.VF.buildGen5CustomDreadnought = window.VF.buildWeaponizedSpacecraft;

window.VF.buildIntroFlagshipDreadnought = function() {
  const omegaSpec = (window.VF.ROCKET_FLEET && window.VF.ROCKET_FLEET[31]) || {
    id: 32, name: 'V-Factor Omega', gen: 'GEN 5', cls: 'Quad Dreadnought',
    length: 2.6, width: 0.9, speed: 10.4, colorA: 0x00f0ff, colorB: 0xf43f5e,
    weaponName: 'Omega Omni-Annihilator', weaponType: 'RAILGUN', weaponColor: 0xfbbf24
  };
  const ship = window.VF.buildWeaponizedSpacecraft(omegaSpec, false, 0);
  ship.scale.setScalar(1.25);
  return ship;
};

// ============================================================================
// 6. 3-STAGE ONE-SHOT WEAPON RIG, SHIELD & SHATTER ANIMATION CONTROLLERS
// ============================================================================
window.VF.triggerModularShatter = function(ship) {
  const targetShip = (ship && ship.userData && ship.userData.craftMesh) ? ship.userData.craftMesh : ship;
  if (!targetShip || !targetShip.userData || !targetShip.userData.rig) return;
  const rig = targetShip.userData.rig;
  rig.shatterActive = true;
  rig.shatterTimer = 0.90;
  targetShip.visible = true;
  if (typeof window.VF.spawnPooledSparks === 'function') {
    window.VF.spawnPooledSparks(ship.position.x, ship.position.y, ship.position.z, rig.activeTrimColor || 0x00f0ff, 18);
  }
};

window.VF.resetModularShatter = function(ship) {
  const targetShip = (ship && ship.userData && ship.userData.craftMesh) ? ship.userData.craftMesh : ship;
  if (!targetShip || !targetShip.userData || !targetShip.userData.rig) return;
  const rig = targetShip.userData.rig;
  rig.shatterActive = false;
  rig.shatterTimer = 0.0;
  for (let i = 0; i < rig.shatterParts.length; i++) {
    const sp = rig.shatterParts[i];
    sp.group.position.copy(sp.restPos);
    sp.group.rotation.set(0, 0, 0);
  }
};

window.VF.toggleHangarExplodedView = function(forceState) {
  const state = window.VF.state;
  if (!state) return false;
  state.explodedViewActive = (forceState !== undefined) ? Boolean(forceState) : !state.explodedViewActive;
  const btn = document.getElementById('btn-hangar-exploded');
  if (btn) {
    btn.classList.toggle('active', state.explodedViewActive);
    btn.textContent = state.explodedViewActive ? 'EXPLODED: ON' : 'EXPLODED VIEW';
  }
  return state.explodedViewActive;
};

window.VF.updateSpacecraftCinematicRig = function(ship, deltaTime, shipState) {
  const targetShip = (ship && ship.userData && ship.userData.craftMesh) ? ship.userData.craftMesh : ship;
  if (!targetShip || !targetShip.userData || !targetShip.userData.rig) return false;
  const rig = targetShip.userData.rig;
  const dt = deltaTime || 0.016;
  const nowMs = performance.now();

  if (rig.shatterActive) {
    rig.shatterTimer = Math.max(0, rig.shatterTimer - dt);
    const slowDt = dt * 0.55;
    for (let i = 0; i < rig.shatterParts.length; i++) {
      const sp = rig.shatterParts[i];
      sp.group.position.x += sp.vx * slowDt;
      sp.group.position.y += sp.vy * slowDt;
      sp.group.position.z += sp.vz * slowDt;
      sp.group.rotation.x += sp.rx * slowDt;
      sp.group.rotation.y += sp.ry * slowDt;
      sp.group.rotation.z += sp.rz * slowDt;
    }
    return true;
  }

  const isHangarTurntable = (_hangarShipMesh && targetShip === _hangarShipMesh);
  const isBoosting = Boolean(shipState && (shipState.boosting || shipState.isBoosting || shipState.boostToggledOn));

  const targetExplode = (isHangarTurntable && window.VF.state && window.VF.state.explodedViewActive) ? 1.0 : 0.0;
  rig.explodedLerp = window.VF.lerp ? window.VF.lerp(rig.explodedLerp || 0, targetExplode, dt * 8.0) : targetExplode;
  const explodeOffset = rig.explodedLerp * 0.35;
  rig.leftWingPivot.position.x = -explodeOffset;
  rig.rightWingPivot.position.x = explodeOffset;
  rig.canopyGroup.position.y = explodeOffset * 0.75;
  rig.nozzleGroup.position.z = explodeOffset * 0.65;

  // Spin Intake Compressor Fans, Dorsal Reactor Core, and Wingtip V-Bits
  const spinRate = (isBoosting ? 16.0 : 7.5) * dt;
  if (rig.intakeRotors) {
    for (let i = 0; i < rig.intakeRotors.length; i++) {
      rig.intakeRotors[i].rotation.z += spinRate * 1.6;
    }
  }
  if (rig.coreOctahedron) rig.coreOctahedron.rotation.y += spinRate;
  if (rig.gimbalRingA) rig.gimbalRingA.rotation.z += spinRate * 1.3;
  if (rig.gimbalRingB) rig.gimbalRingB.rotation.y -= spinRate * 1.1;
  if (rig.haloRingMesh) rig.haloRingMesh.rotation.z += spinRate * 0.5;
  if (rig.magLockPods) {
    for (let m = 0; m < rig.magLockPods.length; m++) {
      const mp = rig.magLockPods[m];
      mp.pod.position.y = mp.baseY + Math.sin(nowMs * 0.006 + mp.side) * 0.04;
    }
  }
  if (rig.gatlingCores) {
    const gatSpeed = (rig.animActive || (shipState && shipState.weaponOvercharged)) ? 26.0 : 3.0;
    for (let g = 0; g < rig.gatlingCores.length; g++) {
      rig.gatlingCores[g].rotation.z += gatSpeed * dt;
    }
  }

  if (rig.thrusterFlameGroup) {
    const flameZ = isBoosting ? 2.45 : (1.0 + Math.sin(nowMs * 0.03) * 0.16);
    const flameXY = isBoosting ? 1.30 : 1.0;
    rig.thrusterFlameGroup.scale.set(flameXY, flameXY, flameZ);
  }

  const isScreenPlaying = Boolean(window.VF.state && window.VF.state.inGame && !isHangarTurntable);
  const goldenShieldTimer = (shipState && shipState.goldenShieldTimer !== undefined) ? Number(shipState.goldenShieldTimer) : 0;
  const isRemoteShielded = Boolean(targetShip.userData.remoteGoldenShield || rig.remoteGoldenShield);

  if (rig.goldenShieldMesh) {
    const showShield = Boolean(isScreenPlaying && (goldenShieldTimer > 0 || isRemoteShielded));
    rig.goldenShieldMesh.visible = showShield;
    if (showShield && rig.goldenShieldMesh.userData) {
      const gData = rig.goldenShieldMesh.userData;
      gData.innerSphere.rotation.y += dt * 0.65;
      gData.midWireSphere.rotation.y -= dt * 0.95;
      gData.outerHaloSphere.rotation.z += dt * 0.40;
      gData.eqRing.rotation.z += dt * 1.2;
      const fadeAlpha = Math.min(1.0, (goldenShieldTimer || 1.0) * 1.4);
      gData.innerMat.opacity = 0.46 * fadeAlpha;
      gData.wireMat.opacity = 0.26 * fadeAlpha;
      gData.haloMat.opacity = 0.12 * fadeAlpha;
    }
  }

  if (!rig.animActive) {
    rig.energyBallMesh.visible = false;
    for (let i = 0; i < rig.gatherParticles.length; i++) {
      rig.gatherParticles[i].visible = false;
    }
    return false;
  }

  rig.animTime += dt;
  const t = rig.animTime;

  if (t <= 0.22) {
    const p = Math.min(1, t / 0.22);
    const ease = p * (2 - p);
    rig.leftGunPivot.position.x = rig.leftRestX * (1 - 0.28 * ease) - explodeOffset;
    rig.rightGunPivot.position.x = rig.rightRestX * (1 - 0.28 * ease) + explodeOffset;
    rig.leftGunPivot.position.y = rig.restY + 0.24 * ease;
    rig.rightGunPivot.position.y = rig.restY + 0.24 * ease;
    rig.leftGunPivot.position.z = rig.restZ - 0.55 * ease;
    rig.rightGunPivot.position.z = rig.restZ - 0.55 * ease;
    rig.leftGunPivot.rotation.y = -0.18 * ease;
    rig.rightGunPivot.rotation.y = 0.18 * ease;
    rig.noseCannonBarrel.position.z = -0.48 * ease;
  } else if (t <= 0.52) {
    const p = Math.min(1, (t - 0.22) / 0.30);
    rig.energyBallMesh.visible = true;
    const scaleVal = Math.max(0.08, p * 1.38);
    rig.energyBallMesh.scale.set(scaleVal, scaleVal, scaleVal);
    rig.energyBallMesh.rotation.y += dt * 14.0;
    if (rig.gyroRing1) rig.gyroRing1.rotation.x += dt * 18.0;
    if (rig.gyroRing2) rig.gyroRing2.rotation.y -= dt * 18.0;

    for (let i = 0; i < rig.gatherParticles.length; i++) {
      const mote = rig.gatherParticles[i];
      mote.visible = true;
      const spiralR = (1 - p) * mote.userData.radiusOffset + 0.12;
      const ang = mote.userData.baseAngle + p * 7.5;
      mote.position.set(Math.cos(ang) * spiralR, 0.08 + Math.sin(ang) * spiralR, -2.35 + (1 - p) * 0.65);
    }
  } else if (t <= 0.88) {
    if (!rig.firedCallbackDone) {
      rig.firedCallbackDone = true;
      rig.energyBallMesh.visible = false;
      rig.energyBallMesh.scale.set(0.001, 0.001, 0.001);
      for (let i = 0; i < rig.gatherParticles.length; i++) {
        rig.gatherParticles[i].visible = false;
      }
      try {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playOneShotBlastSFX) {
          window.VF.AudioEngine.playOneShotBlastSFX(rig.spec ? rig.spec.weaponType : 'LASER');
        }
      } catch (_) {}
      if (typeof rig.onFireCallback === 'function') {
        rig.onFireCallback(rig.spec);
      }
    }
    const p = Math.min(1, (t - 0.52) / 0.36);
    const rev = 1 - p;
    const kick = Math.sin(p * Math.PI) * 0.55;
    rig.leftGunPivot.position.x = rig.leftRestX * (1 - 0.28 * rev) - explodeOffset;
    rig.rightGunPivot.position.x = rig.rightRestX * (1 - 0.28 * rev) + explodeOffset;
    rig.leftGunPivot.position.y = rig.restY + 0.24 * rev;
    rig.rightGunPivot.position.y = rig.restY + 0.24 * rev;
    rig.leftGunPivot.position.z = rig.restZ + kick;
    rig.rightGunPivot.position.z = rig.restZ + kick;
    rig.leftGunPivot.rotation.y = -0.18 * rev;
    rig.rightGunPivot.rotation.y = 0.18 * rev;
    rig.noseCannonBarrel.position.z = kick * 0.65;
  } else {
    rig.animActive = false;
    rig.leftGunPivot.position.set(rig.leftRestX - explodeOffset, rig.restY, rig.restZ);
    rig.rightGunPivot.position.set(rig.rightRestX + explodeOffset, rig.restY, rig.restZ);
    rig.leftGunPivot.rotation.set(0, 0, 0);
    rig.rightGunPivot.rotation.set(0, 0, 0);
    rig.noseCannonBarrel.position.set(0, 0, 0);
    rig.energyBallMesh.visible = false;
    for (let i = 0; i < rig.gatherParticles.length; i++) {
      rig.gatherParticles[i].visible = false;
    }
    return false;
  }
  return true;
};
window.VF.updateOneShotAnimation = window.VF.updateSpacecraftCinematicRig;

window.VF.triggerOneShotAnimation = function(ship, spec, callback, isInstant) {
  const targetShip = (ship && ship.userData && ship.userData.craftMesh) ? ship.userData.craftMesh : ship;
  if (!targetShip || !targetShip.userData || !targetShip.userData.rig) {
    if (typeof callback === 'function') callback(spec);
    return false;
  }
  const rig = targetShip.userData.rig;
  if (rig.animActive) return false;

  rig.animActive = true;
  rig.onFireCallback = callback || null;
  rig.spec = spec || rig.spec;

  if (isInstant) {
    rig.animTime = 0.52;
    rig.firedCallbackDone = true;
    rig.energyBallMesh.visible = false;
    try {
      if (window.VF.AudioEngine && window.VF.AudioEngine.playOneShotBlastSFX) {
        window.VF.AudioEngine.playOneShotBlastSFX(rig.spec ? rig.spec.weaponType : 'LASER');
      }
    } catch (_) {}
    if (typeof rig.onFireCallback === 'function') {
      rig.onFireCallback(rig.spec);
    }
    return true;
  }

  rig.animTime = 0.0;
  rig.firedCallbackDone = false;
  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.playGunDeploySFX) {
      window.VF.AudioEngine.playGunDeploySFX();
    }
    setTimeout(function() {
      if (rig.animActive && window.VF.AudioEngine && window.VF.AudioEngine.playEnergyGatherSFX) {
        window.VF.AudioEngine.playEnergyGatherSFX();
      }
    }, 200);
  } catch (_) {}
  return true;
};

// ============================================================================
// 7. 32 DISTINCT 2D BLUEPRINT CANVAS THUMBNAILS & 3D HANGAR TURNTABLE
// ============================================================================
window.VF.drawShipBlueprint2D = function(canvas, spec) {
  if (!canvas || !spec) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = 160;
  const h = canvas.height = 44;
  ctx.clearRect(0, 0, w, h);

  const morph = window.VF.SHIP_MORPHOLOGY[spec.id] || window.VF.SHIP_MORPHOLOGY[9];
  const hexA = '#' + spec.colorA.toString(16).padStart(6, '0');
  const hexB = '#' + spec.colorB.toString(16).padStart(6, '0');
  const wepHex = '#' + spec.weaponColor.toString(16).padStart(6, '0');
  const cx = w * 0.5;
  const cy = h * 0.5;
  const L = Math.min(64, spec.length * 14.5 + 16);
  const W = Math.min(20, spec.width * 11.0 + 4);
  const sweepShift = -morph.sweep * L * 0.42;

  if (morph.ring) {
    ctx.beginPath();
    ctx.arc(cx - 2, cy, W * 0.86, 0, Math.PI * 2);
    ctx.strokeStyle = hexA + 'aa';
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  if (morph.booms) {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.4;
    [-1, 1].forEach(function(s) {
      ctx.beginPath();
      ctx.moveTo(cx - L * 0.52, cy + s * W * 0.65);
      ctx.lineTo(cx + L * 0.18, cy + s * W * 0.65);
      ctx.stroke();
    });
  }

  ctx.strokeStyle = hexA;
  ctx.fillStyle = hexB + '55';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  if (morph.nose === 'TWIN_PRONG' || morph.nose === 'RAIL_SPLIT') {
    ctx.moveTo(cx + L * 0.54, cy - 3.5);
    ctx.lineTo(cx + L * 0.25, cy - 1.5);
    ctx.lineTo(cx + L * 0.54, cy + 3.5);
  } else if (morph.nose === 'HAMMER' || morph.nose === 'SNUB_SIEGE') {
    ctx.moveTo(cx + L * 0.46, cy - 6);
    ctx.lineTo(cx + L * 0.46, cy + 6);
  } else {
    ctx.moveTo(cx + L * 0.56, cy);
  }
  const leftSpanW = morph.wing === 'ASYM_SHARD' ? W * 1.15 : W;
  const rightSpanW = morph.wing === 'ASYM_SHARD' ? W * 0.65 : W;
  ctx.lineTo(cx + sweepShift, cy - leftSpanW);
  ctx.lineTo(cx - L * 0.46, cy - leftSpanW * 0.55);
  ctx.lineTo(cx - L * 0.35, cy);
  ctx.lineTo(cx - L * 0.46, cy + rightSpanW * 0.55);
  ctx.lineTo(cx + (morph.wing === 'ASYM_SHARD' ? -sweepShift : sweepShift), cy + rightSpanW);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = spec.id % 2 === 0 ? '#ff9900' : '#00f0ff';
  ctx.beginPath();
  ctx.ellipse(cx + L * 0.10, cy, L * 0.14, 2.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = wepHex;
  ctx.lineWidth = 1.4;
  [-1, 1].forEach(function(s) {
    ctx.beginPath();
    ctx.moveTo(cx + L * 0.12, cy + s * W * 0.44);
    ctx.lineTo(cx + L * 0.52, cy + s * W * 0.44);
    ctx.stroke();
  });
};
window.VF.drawRocketBlueprint = window.VF.drawShipBlueprint2D;

let _hangarRenderer = null;
let _hangarScene = null;
let _hangarCam = null;
let _hangarShipMesh = null;
let _hangarTestBlast = null;
let _turntableRing = null;
let _turntableDisc = null;
let _hangarBlastTimer = 0.0;
let _hangarYaw = 0.65;
let _hangarPitch = 0.22;
let _hangarDragging = false;
let _hangarLastMouseX = 0;
let _hangarLastMouseY = 0;
let _hangarIsInitialized = false;

window.VF.resizeHangarViewport = function() {
  const canvas = document.getElementById('hangar-3d-canvas');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  const w = Math.max(200, Math.floor(rect.width || wrap.clientWidth || 250));
  const h = Math.max(120, Math.floor(rect.height || wrap.clientHeight || 165));

  if (_hangarRenderer) {
    _hangarRenderer.setSize(w, h, false);
  }
  if (_hangarCam) {
    _hangarCam.aspect = w / h;
    _hangarCam.updateProjectionMatrix();
  }
};

window.VF.stepHangarTurntable = function(deltaTime) {
  if (!_hangarShipMesh) return;
  const dt = deltaTime || 0.016;
  const isFiring = _hangarShipMesh.userData && _hangarShipMesh.userData.rig && _hangarShipMesh.userData.rig.animActive;
  if (!_hangarDragging && !isFiring) {
    _hangarYaw += 0.012;
  }
  _hangarShipMesh.rotation.y = _hangarYaw;
  _hangarShipMesh.rotation.x = _hangarPitch;

  if (_turntableRing) {
    _turntableRing.rotation.z += dt * 0.85;
  }

  window.VF.updateSpacecraftCinematicRig(_hangarShipMesh, dt, { goldenShieldTimer: 0, boosting: false });

  if (_hangarBlastTimer > 0 && _hangarTestBlast) {
    _hangarBlastTimer = Math.max(0, _hangarBlastTimer - dt);
    _hangarTestBlast.group.visible = true;
    _hangarTestBlast.group.position.z -= dt * 45.0;
    _hangarTestBlast.group.rotation.z += dt * 18.0;
    if (_hangarBlastTimer <= 0) {
      _hangarTestBlast.group.visible = false;
    }
  }

  if (_hangarRenderer && _hangarScene && _hangarCam) {
    _hangarRenderer.render(_hangarScene, _hangarCam);
  }
};

window.VF.updateHangarPreview = function(specParam) {
  let spec = specParam;
  if (!spec) {
    const previewId = Number((window.VF.state && (window.VF.state.previewRocketId || window.VF.state.equippedRocketId)) || 9);
    spec = window.VF.ROCKET_FLEET.find(function(r) { return r.id === previewId; }) || window.VF.ROCKET_FLEET[8];
  }
  if (!_hangarScene) return;

  if (_hangarShipMesh) {
    _hangarScene.remove(_hangarShipMesh);
  }
  _hangarShipMesh = window.VF.buildWeaponizedSpacecraft(spec, window.VF.state ? window.VF.state.wireframeHangar : false);
  const fitScale = 1.68 / Math.max(1.6, spec.length * 0.85);
  _hangarShipMesh.scale.setScalar(fitScale);
  _hangarShipMesh.rotation.y = _hangarYaw;
  _hangarShipMesh.rotation.x = _hangarPitch;
  _hangarScene.add(_hangarShipMesh);

  if (_turntableRing) {
    _turntableRing.material.color.setHex(window.VF.getResolvedTrimColor(spec));
  }

  const titleEl = document.getElementById('hangar-ship-title') || document.getElementById('hangar-ship-name');
  const genEl = document.getElementById('hangar-ship-gen') || document.getElementById('hangar-ship-class');
  if (titleEl) titleEl.textContent = '#' + String(spec.id).padStart(2, '0') + ' ' + spec.name;
  if (genEl) genEl.textContent = spec.gen + ' · ' + spec.cls;

  const lenVal = document.getElementById('stat-len-val');
  const widVal = document.getElementById('stat-wid-val');
  const spdVal = document.getElementById('stat-spd-val');
  if (lenVal) lenVal.textContent = spec.length.toFixed(1) + 'm';
  if (widVal) widVal.textContent = spec.width.toFixed(2) + 'm';
  if (spdVal) spdVal.textContent = spec.speed.toFixed(1);

  const lenBar = document.getElementById('stat-len-bar');
  const widBar = document.getElementById('stat-wid-bar');
  const spdBar = document.getElementById('stat-spd-bar');
  if (lenBar) lenBar.style.width = ((spec.length / 4.0) * 100) + '%';
  if (widBar) widBar.style.width = ((spec.width / 1.5) * 100) + '%';
  if (spdBar) spdBar.style.width = ((spec.speed / 11.0) * 100) + '%';

  const wepName = document.getElementById('hangar-weapon-name') || document.getElementById('hangar-ship-weapon');
  const proText = document.getElementById('hangar-pro-text') || document.getElementById('hangar-ship-pro');
  const conText = document.getElementById('hangar-con-text') || document.getElementById('hangar-ship-con');
  if (wepName) wepName.textContent = spec.weaponName;
  if (proText) proText.textContent = spec.pro;
  if (conText) conText.textContent = spec.con;

  window.VF.resizeHangarViewport();
};

window.VF.selectHangarShip = function(shipId) {
  const state = window.VF.state;
  if (!state) return;
  const numericId = Math.max(1, Math.min(32, Number(shipId) || state.equippedRocketId || 9));
  state.previewRocketId = numericId;

  const fleet = window.VF.ROCKET_FLEET || [];
  const spec = fleet.find(function(r) { return r.id === numericId; }) || fleet[8];
  window.VF.updateHangarPreview(spec);

  const grid = document.getElementById('hangar-fleet-grid') || document.getElementById('hangar-grid');
  if (grid) {
    const cards = grid.querySelectorAll('.fleet-card, .ship-card, .rocket-card');
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardId = Number(card.getAttribute('data-id') || card.getAttribute('data-rocket-id'));
      card.classList.toggle('selected', cardId === numericId);
      card.classList.toggle('active-preview', cardId === numericId);
    }
  }
};

window.VF.equipSelectedHangarShip = function() {
  const state = window.VF.state;
  if (!state) return;
  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) {
      window.VF.AudioEngine.playClickSFX();
    }
  } catch (_) {}

  window.VF.toggleHangarExplodedView(false);
  const chosenId = Number(state.previewRocketId || state.equippedRocketId || 9);
  state.equippedRocketId = chosenId;
  state.previewRocketId = chosenId;

  try {
    if (window.localStorage) {
      window.localStorage.setItem('VF_EQUIPPED_SHIP_ID', String(chosenId));
    }
    window.name = 'VF_SHIP_' + chosenId;
  } catch (_) {}

  const fleet = window.VF.ROCKET_FLEET || [];
  const spec = fleet.find(function(r) { return r.id === chosenId; }) || fleet[8];

  if (typeof window.VF.equipSpacecraftModel === 'function') {
    window.VF.equipSpacecraftModel(chosenId);
  } else if (typeof window.VF.rebuildPlayerRocket === 'function') {
    window.VF.rebuildPlayerRocket(chosenId);
  }

  const openBtn = document.getElementById('btn-open-hangar');
  if (openBtn && spec) {
    openBtn.innerHTML = 'SPACECRAFT HANGAR · <span id="equipped-ship-name" class="accent-text ship-highlight">' + spec.name + '</span>';
  }

  if (typeof window.VF.switchScreen === 'function') {
    window.VF.switchScreen('menu-screen');
  }
};

window.VF.populateHangarGrid = function(filterCategory) {
  const category = filterCategory || 'ALL';
  const state = window.VF.state || {};
  const grid = document.getElementById('hangar-fleet-grid') || document.getElementById('hangar-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const fleet = window.VF.ROCKET_FLEET || [];
  const shipList = category === 'ALL'
    ? fleet
    : fleet.filter(function(r) { return r.gen === category; });

  shipList.forEach(function(spec) {
    const card = document.createElement('div');
    const isPreview = (spec.id === state.previewRocketId);
    const isEquipped = (spec.id === state.equippedRocketId);

    card.className = 'ship-card fleet-card rocket-card' +
      (isPreview ? ' selected active-preview' : '') +
      (isEquipped ? ' equipped-ship' : '');
    card.setAttribute('data-id', String(spec.id));
    card.setAttribute('data-rocket-id', String(spec.id));

    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;font-size:0.65rem;font-weight:700;">' +
        '<span>#' + String(spec.id).padStart(2, '0') + ' ' + spec.name + '</span>' +
        '<span style="color:#38bdf8;">' + spec.speed.toFixed(1) + '</span>' +
      '</div>' +
      '<canvas class="bp-canvas fleet-card-canvas thumb-canvas"></canvas>' +
      '<div style="display:flex;justify-content:space-between;font-size:0.58rem;color:#94a3b8;">' +
        '<span>' + spec.gen + '</span>' +
        '<span style="color:#00f0ff;">' + spec.weaponType + '</span>' +
      '</div>';

    window.VF.drawShipBlueprint2D(card.querySelector('canvas'), spec);

    card.addEventListener('click', function(e) {
      e.stopPropagation();
      try {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playClickSFX) {
          window.VF.AudioEngine.playClickSFX();
        }
      } catch (_) {}
      window.VF.selectHangarShip(spec.id);
    });

    grid.appendChild(card);
  });
};

window.VF.initHangar = function() {
  if (_hangarIsInitialized) return;
  _hangarIsInitialized = true;

  const canvas = document.getElementById('hangar-3d-canvas');
  if (canvas) {
    _hangarRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'default'
    });
    _hangarRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    _hangarRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    _hangarRenderer.toneMappingExposure = 1.1;
  }

  _hangarScene = new THREE.Scene();
  _hangarCam = new THREE.PerspectiveCamera(40, 1.6, 0.1, 80);
  _hangarCam.position.set(0, 1.25, 4.2);
  _hangarCam.lookAt(0, -0.1, 0);

  _hangarScene.add(new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.2));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(4, 6, 5);
  _hangarScene.add(dirLight);

  const rimLight = new THREE.PointLight(0x00f0ff, 2.0, 18);
  rimLight.position.set(-4, 2, 3);
  _hangarScene.add(rimLight);

  const turntableGroup = new THREE.Group();
  turntableGroup.position.y = -0.72;
  _hangarScene.add(turntableGroup);

  _turntableRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.04, 14, 64),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff })
  );
  _turntableRing.rotation.x = Math.PI / 2;
  turntableGroup.add(_turntableRing);

  _turntableDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.48, 1.52, 0.06, 48),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 })
  );
  _turntableDisc.position.y = -0.04;
  turntableGroup.add(_turntableDisc);

  _hangarShipMesh = new THREE.Group();
  _hangarScene.add(_hangarShipMesh);

  _hangarTestBlast = window.VF.buildSupernovaObliteratorProjectileMesh(0x00f0ff);
  _hangarScene.add(_hangarTestBlast.group);

  const wrap = document.querySelector('.hangar-canvas-wrap') || document.getElementById('hangar-3d-preview-container');
  if (wrap) {
    wrap.addEventListener('pointerdown', function(e) {
      if (e.target && (e.target.tagName === 'BUTTON' || e.target.closest('button'))) return;
      _hangarDragging = true;
      _hangarLastMouseX = e.clientX;
      _hangarLastMouseY = e.clientY;
    });
  }

  window.addEventListener('pointermove', function(e) {
    if (!_hangarDragging) return;
    _hangarYaw += (e.clientX - _hangarLastMouseX) * 0.012;
    _hangarPitch = Math.max(-0.65, Math.min(0.65, _hangarPitch + (e.clientY - _hangarLastMouseY) * 0.01));
    _hangarLastMouseX = e.clientX;
    _hangarLastMouseY = e.clientY;
  });

  window.addEventListener('pointerup', function() {
    _hangarDragging = false;
  });

  const backBtn = document.getElementById('btn-hangar-back');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.VF.toggleHangarExplodedView(false);
      window.VF.switchScreen('menu-screen');
    });
  }

  const wireframeBtn = document.getElementById('btn-wireframe-toggle') || document.getElementById('btn-toggle-wireframe');
  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const state = window.VF.state;
      state.wireframeHangar = !state.wireframeHangar;
      e.target.textContent = 'WIREFRAME: ' + (state.wireframeHangar ? 'ON' : 'OFF');
      const fleet = window.VF.ROCKET_FLEET || [];
      const spec = fleet.find(function(r) { return r.id === state.previewRocketId; }) || fleet[8];
      window.VF.updateHangarPreview(spec);
    });
  }

  const equipBtn = document.getElementById('btn-hangar-equip') || document.getElementById('btn-close-hangar');
  if (equipBtn && !equipBtn._vfBound) {
    equipBtn._vfBound = true;
    equipBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.VF.equipSelectedHangarShip();
    });
  }

  document.querySelectorAll('#hangar-gen-tabs .gen-tab, #hangar-class-tabs .tab-btn').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#hangar-gen-tabs .gen-tab, #hangar-class-tabs .tab-btn').forEach(function(t) {
        t.classList.remove('active');
      });
      tab.classList.add('active');
      window.VF.populateHangarGrid(tab.getAttribute('data-gen'));
    });
  });

  window.VF.populateHangarGrid('ALL');
  window.VF.updateHangarPreview();
  window.VF.resizeHangarViewport();
};