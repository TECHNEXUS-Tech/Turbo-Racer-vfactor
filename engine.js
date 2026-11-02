/* V-FACTOR STUDIOS // @_the_v_factor_ // BUILT BY VINAY — 3D AERONAUTICAL TUNNEL, AI DRONES & MULTIPLAYER FLIGHT ENGINE */
"use strict";
window.VF = window.VF || {};

// ============================================================================
// 1. ENGINE CONSTANTS & SCENIC REGISTERS
// ============================================================================
window.VF.TUNNEL_RADIUS = 14.0;
window.VF.HUB_VISUAL_RADIUS = 2.25;
window.VF.HUB_HIT_RADIUS = 2.15;
window.VF.MAX_PLAYER_RADIUS = 10.4;
window.VF.PORTAL_MOUTH_Z = -45.0;
window.VF.BASE_SPEED = 44.0;
window.VF.BASE_MP_SPEED = 40.0;
window.VF.BASE_TRAP_SPACING = 62.0;
window.VF.TOTAL_ACTIVE_TRAPS = 12;

window.VF.keys = (window.VF.state && window.VF.state.keys) || window.VF.keys || {
  left: false,
  right: false,
  up: false,
  down: false
};
window.VF.remotePlayers = window.VF.remotePlayers || new Map();

let _scene = null;
let _camera = null;
let _renderer = null;
let _playerGroup = null;
let _craftMeshInstance = null;
let _turbineGroup = null;
let _droneGroup = null;
let _parallaxLandmarksGroup = null;
let _introGroup = null;
let _lockdownGroup = null;
let _reticleGroup = null;
let _targetLockBox = null;
let _projectilesGroup = null;
let _debrisGroup = null;
let _finishPortalGroup = null;

let _chaseLight = null;
let _forwardBeamLight = null;
let _muzzlePointLight = null;

let _wallMetalMat = null;
let _structuralRibMat = null;
let _turbineBladeMetalMat = null;
let _bulkheadCoverMat = null;
let _brassHubMat = null;
let _neonStripMatA = null;
let _neonStripMatB = null;
let _searchlightMat = null;
let _vFactorBulkheadBadgeMat = null;
let _laserFilamentMat = null;
let _laserCoreMat = null;
let _laserHaloMat = null;
let _emitterLensMat = null;
let _emitterHousingMat = null;

let _reticleOuterMesh = null;
let _reticleInnerMesh = null;
let _reticleOuterMat = null;
let _reticleInnerMat = null;
let _guideThreadMat = null;
let _targetLockDiamond = null;
let _lastReticleShipId = -1;
let _lastReticleLocked = false;

let _turbines = [];
let _tunnelSegments = [];
let _parallaxMidMeshes = [];
let _drones = [];
let _droneBolts = [];
let _oneShotPool = [];
let _sparkPool = [];
let _ringPool = [];
let _activeBeamEffects = [];

let _cursorTargetX = 0.0;
let _cursorTargetY = -3.0;
let _isDesktopCursorActive = false;
let _lastDesktopDownTime = 0;
let _desktopHoldBoostActive = false;

let _lastFrameTime = performance.now();
let _lastMenuRenderTime = 0.0;
let _nowTime = 0.0;
let _lastDroneSpawnStage = -1;

let _introArchLights = [];
let _introOmegaShip = null;
let _sonicBoomRing = null;
let _introWarpIris = null;

let _lockdownWallState = {
  active: false,
  cleared: false,
  milestoneDistance: 1500,
  overcharged: false
};

const _LOCKDOWN_MILESTONES = [
  1500, 2500, 3750, 5000, 6250, 7500, 8750, 10000, 11250, 12500
];

const _WALL_SEG_LEN = 16.0;
const _WALL_SEG_COUNT = 26;
const _colorTmpA = new THREE.Color();
const _colorTmpB = new THREE.Color();

// ============================================================================
// 2. MATH, CLEAR-ZONE & GEOMETRY HELPERS
// ============================================================================
window.VF.normAngle = function(a) {
  const twoPi = Math.PI * 2;
  return ((a % twoPi) + twoPi) % twoPi;
};

window.VF.angleDiff = function(a, b) {
  const d = Math.abs(window.VF.normAngle(a) - window.VF.normAngle(b));
  return Math.min(d, Math.PI * 2 - d);
};

window.VF.pointToSegmentDist2D = function(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 0.0001) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
};

window.VF.getCurrentTrapSpacing = function(distanceParam) {
  const dist = Number(distanceParam !== undefined ? distanceParam : (window.VF.state && window.VF.state.distance) || 0);
  if (dist <= 800) return 62.0;
  return Math.max(46.0, 62.0 * Math.pow(0.985, (dist - 800) / 800));
};

window.VF.isDistanceInParallaxGap = function(d) {
  if (d < 45) return true;
  const nearest500 = Math.round(d / 500) * 500;
  return (nearest500 >= 500 && Math.abs(d - nearest500) <= 42);
};

function _isDistanceNearLockdown(d) {
  for (let i = 0; i < _LOCKDOWN_MILESTONES.length; i++) {
    const m = _LOCKDOWN_MILESTONES[i];
    if (d >= m - 165.0 && d <= m + 65.0) return true;
  }
  return false;
}

window.VF.getSafeObstacleWorldDist = function(proposedDist) {
  let d = Math.max(125, proposedDist);
  while (window.VF.isDistanceInParallaxGap(d) || _isDistanceNearLockdown(d)) {
    d += 36;
  }
  return d;
};

// ============================================================================
// 3. BELL-MOUTH PORTALS & 500M EXTERIOR PARALLAX MEGASTRUCTURES
// ============================================================================
window.VF.buildPortalMouthAssembly = function(includeGantry) {
  if (includeGantry === undefined) includeGantry = true;
  const TR = window.VF.TUNNEL_RADIUS;
  const pGroup = new THREE.Group();

  const outerCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(TR + 2.8, TR + 0.8, 5.5, 48, 1, true),
    _structuralRibMat
  );
  outerCollar.rotation.x = Math.PI / 2;
  pGroup.add(outerCollar);

  const bellMouthOuter = new THREE.Mesh(new THREE.TorusGeometry(TR + 1.5, 1.95, 18, 64), _wallMetalMat);
  pGroup.add(bellMouthOuter);

  const bellMouthBevel = new THREE.Mesh(new THREE.TorusGeometry(TR + 0.3, 0.72, 16, 64), _turbineBladeMetalMat);
  bellMouthBevel.position.z = 1.2;
  pGroup.add(bellMouthBevel);

  const portalGlowRing = new THREE.Mesh(new THREE.TorusGeometry(TR + 0.08, 0.28, 12, 64), _neonStripMatA);
  portalGlowRing.position.z = 1.85;
  pGroup.add(portalGlowRing);

  if (includeGantry) {
    for (let p = 1; p <= 4; p++) {
      const guideZ = p * 14.0;
      const hexTruss = new THREE.Mesh(new THREE.TorusGeometry(24.0, 0.65, 8, 6), _structuralRibMat);
      hexTruss.position.z = guideZ;
      hexTruss.rotation.z = p * 0.4;
      pGroup.add(hexTruss);

      const outerGantry = new THREE.Mesh(
        new THREE.TorusGeometry(35.0, 0.32, 8, 48),
        p % 2 === 0 ? _neonStripMatA : _neonStripMatB
      );
      outerGantry.position.z = guideZ - 5.0;
      pGroup.add(outerGantry);
    }
  }
  return pGroup;
};

window.VF.rebuildParallaxLandmarks = function() {
  if (!_parallaxLandmarksGroup) return;
  while (_parallaxLandmarksGroup.children.length > 0) {
    _parallaxLandmarksGroup.remove(_parallaxLandmarksGroup.children[0]);
  }
  _parallaxMidMeshes.length = 0;

  const startPortal = window.VF.buildPortalMouthAssembly(true);
  startPortal.position.z = -45;
  _parallaxLandmarksGroup.add(startPortal);

  const strutBarGeo = new THREE.BoxGeometry(1.1, 1.1, 82);
  const beamConeGeo = new THREE.ConeGeometry(7.5, 42, 16, 1, true);

  for (let k = 1; k <= 14; k++) {
    const centerDist = k * 500;
    if (_isDistanceNearLockdown(centerDist)) continue;
    const exitDist = centerDist - 40;
    const intakeDist = centerDist + 40;

    const exitPortal = window.VF.buildPortalMouthAssembly(false);
    exitPortal.position.z = -exitDist;
    _parallaxLandmarksGroup.add(exitPortal);

    const nextIntakePortal = window.VF.buildPortalMouthAssembly(true);
    nextIntakePortal.position.z = -intakeDist;
    _parallaxLandmarksGroup.add(nextIntakePortal);

    for (let s = 0; s < 6; s++) {
      const ang = (s / 6) * Math.PI * 2;
      const strut = new THREE.Mesh(strutBarGeo, _structuralRibMat);
      strut.position.set(Math.cos(ang) * 25.0, Math.sin(ang) * 25.0, -centerDist);
      _parallaxLandmarksGroup.add(strut);
    }

    for (let m = 0; m < 4; m++) {
      const gapZ = -(exitDist + 14 + m * 17);
      const hexFrame = new THREE.Mesh(new THREE.TorusGeometry(25.0, 0.68, 8, 6), _wallMetalMat);
      hexFrame.position.z = gapZ;
      hexFrame.rotation.z = m * 0.52;
      _parallaxLandmarksGroup.add(hexFrame);
      _parallaxMidMeshes.push({ mesh: hexFrame, factor: 0.06 });

      const outerRing = new THREE.Mesh(
        new THREE.TorusGeometry(36.0, 0.42, 10, 48),
        m % 2 === 0 ? _neonStripMatA : _neonStripMatB
      );
      outerRing.position.z = gapZ - 4;
      _parallaxLandmarksGroup.add(outerRing);
      _parallaxMidMeshes.push({ mesh: outerRing, factor: 0.14 });

      if (m % 2 === 0) {
        const sLight = new THREE.Mesh(beamConeGeo, _searchlightMat);
        const lSide = m === 0 ? 1 : -1;
        sLight.position.set(lSide * 22.0, 12.0, gapZ);
        sLight.rotation.z = lSide * 0.95;
        _parallaxLandmarksGroup.add(sLight);
      }
    }
  }

  _finishPortalGroup = new THREE.Group();
  _finishPortalGroup.position.z = -((window.VF.state && window.VF.state.targetWinDistance) || 1500);
  _finishPortalGroup.add(new THREE.Mesh(
    new THREE.TorusGeometry(window.VF.TUNNEL_RADIUS - 0.15, 0.85, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0x00ff88 })
  ));
  _finishPortalGroup.add(new THREE.Mesh(
    new THREE.RingGeometry(window.VF.TUNNEL_RADIUS - 2.4, window.VF.TUNNEL_RADIUS - 0.25, 48),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
  ));
  _parallaxLandmarksGroup.add(_finishPortalGroup);

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i++) {
    const rad = window.VF.TUNNEL_RADIUS * 1.8 + Math.random() * 95;
    const ang = Math.random() * Math.PI * 2;
    starPos[i * 3] = Math.cos(ang) * rad;
    starPos[i * 3 + 1] = Math.sin(ang) * rad;
    starPos[i * 3 + 2] = 20 - Math.random() * 6800;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  _parallaxLandmarksGroup.add(new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.58, transparent: true, opacity: 0.82 })
  ));
};

window.VF.updateFinishPortalZ = function(meters) {
  if (_finishPortalGroup) _finishPortalGroup.position.z = -(Number(meters) || 1500);
};

window.VF.resetTunnelWallPositions = function() {
  for (let i = 0; i < _tunnelSegments.length; i++) {
    const worldDist = 45 + (i + 0.5) * _WALL_SEG_LEN;
    _tunnelSegments[i].userData.worldDist = worldDist;
    _tunnelSegments[i].position.z = -worldDist;
    _tunnelSegments[i].visible = !window.VF.isDistanceInParallaxGap(worldDist);
  }
  window.VF.rebuildParallaxLandmarks();
};

// ============================================================================
// 4. REALISTIC TRIPLE-LAYER LASERS & ZERO-OVERLAP TURBINES
// ============================================================================
function _buildTripleLayerLaserBeam(length, rotZ, px, py) {
  const beamGroup = new THREE.Group();
  beamGroup.position.set(px || 0, py || 0, 0);
  beamGroup.rotation.z = rotZ || 0;

  const filament = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, length, 8), _laserFilamentMat);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, length, 10), _laserCoreMat);
  const halo = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, length, 12), _laserHaloMat);
  beamGroup.add(filament, core, halo);
  return beamGroup;
}

window.VF.createCircularWallLaserRing = function(worldDist, index) {
  const TR = window.VF.TUNNEL_RADIUS;
  const group = new THREE.Group();
  group.position.z = -worldDist;

  const mountRing = new THREE.Mesh(new THREE.TorusGeometry(TR - 0.12, 0.36, 12, 48), _emitterHousingMat);
  group.add(mountRing);

  const patternType = index % 4;
  const rotOffset = ((index * 1.15) % (Math.PI * 2));
  let chordAnglePairs = [];

  if (patternType === 0) {
    chordAnglePairs = [
      [-0.35, Math.PI * 0.5 + 0.35],
      [Math.PI * 0.5 - 0.35, Math.PI + 0.35],
      [Math.PI - 0.35, Math.PI * 1.5 + 0.35],
      [Math.PI * 1.5 - 0.35, Math.PI * 2 + 0.35]
    ];
  } else if (patternType === 1) {
    chordAnglePairs = [
      [0.42, Math.PI - 0.42],
      [-0.42, Math.PI + 0.42],
      [0.85, Math.PI - 0.85],
      [-0.85, Math.PI + 0.85]
    ];
  } else if (patternType === 2) {
    chordAnglePairs = [
      [0.0, Math.PI * 0.72],
      [Math.PI * 0.66, Math.PI * 1.38],
      [Math.PI * 1.33, Math.PI * 2.05]
    ];
  } else {
    chordAnglePairs = [
      [0.25, Math.PI + 0.65],
      [-0.25, Math.PI - 0.65],
      [Math.PI * 0.42, Math.PI * 1.58]
    ];
  }

  const rWall = TR - 0.30;
  const laserSegments = [];
  const diodeBoxGeo = new THREE.BoxGeometry(1.1, 0.9, 1.1);
  const lensSphereGeo = new THREE.SphereGeometry(0.40, 12, 12);

  chordAnglePairs.forEach(function(pair) {
    const a1 = pair[0] + rotOffset;
    const a2 = pair[1] + rotOffset;
    const x1 = Math.cos(a1) * rWall;
    const y1 = Math.sin(a1) * rWall;
    const x2 = Math.cos(a2) * rWall;
    const y2 = Math.sin(a2) * rWall;

    const mx = (x1 + x2) * 0.5;
    const my = (y1 + y2) * 0.5;
    const chordLen = Math.hypot(x2 - x1, y2 - y1);
    const beamAng = Math.atan2(y2 - y1, x2 - x1);

    group.add(_buildTripleLayerLaserBeam(chordLen, beamAng - Math.PI / 2, mx, my));

    [[x1, y1, a1], [x2, y2, a2]].forEach(function(pt) {
      const housing = new THREE.Mesh(diodeBoxGeo, _emitterHousingMat);
      housing.position.set(pt[0], pt[1], 0);
      housing.rotation.z = pt[2];
      group.add(housing);

      const lens = new THREE.Mesh(lensSphereGeo, _emitterLensMat);
      lens.position.set(pt[0] * 0.96, pt[1] * 0.96, 0);
      group.add(lens);
    });

    laserSegments.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
  });

  _turbineGroup.add(group);
  return {
    isLaserRing: true,
    worldDist: worldDist,
    group: group,
    rotorGroup: new THREE.Group(),
    uprightBadges: [],
    index: index,
    laserSegments: laserSegments,
    passed: false,
    grazeAwarded: false
  };
};

window.VF.createFullRadiusMetalBulkhead = function(innerR, outerR, sectorStartAng, sectorSpan, depthZ) {
  if (depthZ === undefined) depthZ = 0.42;
  const bulkheadGroup = new THREE.Group();
  const margin = 0.09;
  const a0 = sectorStartAng + margin;
  const a1 = sectorStartAng + sectorSpan - margin;
  const segs = 24;

  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, a0, a1, false);
  shape.absarc(0, 0, innerR, a1, a0, true);
  shape.closePath();

  const plateGeo = new THREE.ExtrudeGeometry(shape, {
    depth: depthZ,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
    curveSegments: segs
  });
  plateGeo.translate(0, 0, -depthZ * 0.5);
  bulkheadGroup.add(new THREE.Mesh(plateGeo, _bulkheadCoverMat));

  const midR1 = innerR + (outerR - innerR) * 0.35;
  const midR2 = innerR + (outerR - innerR) * 0.72;
  [midR1, midR2].forEach(function(rPos) {
    const arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, rPos + 0.18, a0 + 0.03, a1 - 0.03, false);
    arcShape.absarc(0, 0, rPos - 0.18, a1 - 0.03, a0 + 0.03, true);
    arcShape.closePath();
    const ribGeo = new THREE.ExtrudeGeometry(arcShape, { depth: depthZ + 0.06, bevelEnabled: false, curveSegments: segs });
    ribGeo.translate(0, 0, -(depthZ + 0.06) * 0.5);
    bulkheadGroup.add(new THREE.Mesh(ribGeo, _turbineBladeMetalMat));
  });

  const midAngle = sectorStartAng + sectorSpan * 0.5;
  const badgeRadius = window.VF.TUNNEL_RADIUS * 0.58;
  const badgePivot = new THREE.Group();
  badgePivot.position.set(Math.cos(midAngle) * badgeRadius, Math.sin(midAngle) * badgeRadius, 0.34);
  const badgePlate = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.55), _vFactorBulkheadBadgeMat);
  badgePivot.add(badgePlate);
  bulkheadGroup.add(badgePivot);

  return { bulkheadGroup: bulkheadGroup, badgePivot: badgePivot, startAng: a0, endAng: a1 };
};

window.VF.createSculptedMetalBlade = function(innerR, outerR, angleRad) {
  const bladeHolder = new THREE.Group();
  bladeHolder.rotation.z = angleRad;
  const length = outerR - innerR;
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, -0.44);
  bladeShape.quadraticCurveTo(length * 0.5, -0.95, length, -0.54);
  bladeShape.lineTo(length, 0.54);
  bladeShape.quadraticCurveTo(length * 0.5, 0.95, 0, 0.44);
  bladeShape.closePath();

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.30,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05
  });
  bladeGeo.translate(innerR * 0.94, 0, -0.15);
  const mesh = new THREE.Mesh(bladeGeo, _turbineBladeMetalMat);
  mesh.rotation.x = 0.26;
  bladeHolder.add(mesh);
  return bladeHolder;
};

window.VF.createTurbine = function(proposedDist, index) {
  const worldDist = window.VF.getSafeObstacleWorldDist(proposedDist);
  const TR = window.VF.TUNNEL_RADIUS;

  if (index >= 2 && index % 3 === 2) {
    return window.VF.createCircularWallLaserRing(worldDist, index);
  }

  const group = new THREE.Group();
  group.position.z = -worldDist;

  const ductShroud = new THREE.Mesh(new THREE.CylinderGeometry(TR, TR, 2.3, 48, 1, true), _structuralRibMat);
  ductShroud.rotation.x = Math.PI / 2;
  group.add(ductShroud);

  const ductLipFront = new THREE.Mesh(new THREE.TorusGeometry(TR - 0.15, 0.46, 14, 48), _wallMetalMat);
  ductLipFront.position.z = 0.85;
  group.add(ductLipFront);

  const ductLipBack = ductLipFront.clone();
  ductLipBack.position.z = -0.85;
  group.add(ductLipBack);

  const rotorGroup = new THREE.Group();
  group.add(rotorGroup);

  const stageIdx = Math.floor(worldDist / 500);
  const isBreatherTunnel = (stageIdx % 2 === 1);
  const bladeCount = index < 4 ? 3 : isBreatherTunnel ? 3 : (3 + (index % 2));
  const rpmBase = index < 4 ? 0.48 : (0.78 + Math.min(1.35, index * 0.038));
  const dir = index % 2 === 0 ? 1 : -1;

  const hasSpeedShiftTrap = (worldDist > 350 && index >= 5 && (index % 5 === 0));
  const speedShiftMult = (window.VF.seededRandom() < 0.5) ? 0.28 : 2.05;
  let trapRingMesh = null;
  if (hasSpeedShiftTrap) {
    trapRingMesh = new THREE.Mesh(
      new THREE.TorusGeometry(TR - 0.45, 0.18, 10, 48),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    );
    trapRingMesh.position.z = 1.35;
    group.add(trapRingMesh);
  }

  const hubRadius = 2.25;
  const hubCyl = new THREE.Mesh(new THREE.CylinderGeometry(hubRadius, hubRadius, 1.6, 24), _structuralRibMat);
  hubCyl.rotation.x = Math.PI / 2;
  rotorGroup.add(hubCyl);

  const spinnerCone = new THREE.Mesh(new THREE.ConeGeometry(hubRadius * 0.94, 1.85, 24), _turbineBladeMetalMat);
  spinnerCone.rotation.x = Math.PI / 2;
  spinnerCone.position.z = 1.4;
  rotorGroup.add(spinnerCone);

  const brassBearing = new THREE.Mesh(new THREE.TorusGeometry(hubRadius * 0.72, 0.18, 12, 28), _brassHubMat);
  brassBearing.position.z = 0.85;
  rotorGroup.add(brassBearing);

  const sectorSpan = (Math.PI * 2) / bladeCount;
  const bladeAngles = [];
  const bladeHalfWidth = 0.095;

  for (let b = 0; b < bladeCount; b++) {
    const ang = b * sectorSpan;
    bladeAngles.push(ang);
    rotorGroup.add(window.VF.createSculptedMetalBlade(hubRadius * 0.94, TR, ang));
  }

  const shutters = [];
  const uprightBadges = [];
  if (index > 0) {
    const isClosing = (index >= 4 && index % 4 === 0);
    const sectorStart = bladeAngles[1];
    const bh = window.VF.createFullRadiusMetalBulkhead(hubRadius * 0.95, TR - 0.15, sectorStart, sectorSpan, 0.42);
    if (isClosing) bh.bulkheadGroup.scale.set(0.22, 0.22, 1);
    rotorGroup.add(bh.bulkheadGroup);
    uprightBadges.push(bh.badgePivot);

    shutters.push({
      isClosing: isClosing,
      progress: isClosing ? 0.22 : 1.0,
      startAng: bh.startAng,
      endAng: bh.endAng,
      mesh: bh.bulkheadGroup,
      warned: !isClosing
    });
  }

  let airflowType = 'NONE';
  let logicGapColor = 'NONE';
  const vortexRings = [];

  if (window.VF.state && window.VF.state.mode === 'SHIFT' && index >= 1) {
    if (index % 2 === 0) {
      airflowType = index % 4 === 0 ? 'PULL' : 'PUSH';
      const vortexColor = airflowType === 'PULL' ? 0x00f0ff : 0xff2a55;
      for (let v = 1; v <= 3; v++) {
        const vRing = new THREE.Mesh(
          new THREE.TorusGeometry(TR * (0.35 + v * 0.18), 0.16, 10, 36),
          new THREE.MeshBasicMaterial({ color: vortexColor, transparent: true, opacity: 0.72 })
        );
        vRing.position.z = v * 6.0;
        group.add(vRing);
        vortexRings.push(vRing);
      }
    }

    const types = ['GOLD', 'VIOLET', 'CYAN'];
    logicGapColor = types[index % types.length];
    const colorHex = logicGapColor === 'GOLD' ? 0xfbbf24 : logicGapColor === 'VIOLET' ? 0xc084fc : 0x00f0ff;

    const gateShape = new THREE.Shape();
    const gStart = bladeHalfWidth * 1.1;
    const gEnd = sectorSpan - bladeHalfWidth * 1.1;
    gateShape.absarc(0, 0, TR - 0.35, gStart, gEnd, false);
    gateShape.absarc(0, 0, hubRadius + 0.35, gEnd, gStart, true);
    gateShape.closePath();

    const gateMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(gateShape, 24),
      new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.36,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      })
    );
    rotorGroup.add(gateMesh);

    const rimArc = new THREE.Mesh(
      new THREE.TorusGeometry(TR - 0.35, 0.24, 10, 24, gEnd - gStart),
      new THREE.MeshBasicMaterial({ color: colorHex })
    );
    rimArc.rotation.z = gStart;
    rotorGroup.add(rimArc);
  }

  _turbineGroup.add(group);
  return {
    isLaserRing: false,
    worldDist: worldDist,
    group: group,
    rotorGroup: rotorGroup,
    uprightBadges: uprightBadges,
    vortexRings: vortexRings,
    index: index,
    bladeCount: bladeCount,
    bladeAngles: bladeAngles,
    bladeHalfWidth: bladeHalfWidth,
    hubRadius: hubRadius,
    baseRpm: rpmBase * dir,
    rpm: rpmBase * dir,
    hasSpeedShiftTrap: hasSpeedShiftTrap,
    speedShiftMult: speedShiftMult,
    speedShiftTriggered: false,
    trapRingMesh: trapRingMesh,
    shutters: shutters,
    airflowType: airflowType,
    logicGapColor: logicGapColor,
    passed: false,
    grazeAwarded: false
  };
};

window.VF.resetTurbines = function() {
  if (!_turbineGroup) return;
  while (_turbineGroup.children.length > 0) {
    _turbineGroup.remove(_turbineGroup.children[0]);
  }
  _turbines.length = 0;
  let nextDist = 125;
  for (let i = 0; i < window.VF.TOTAL_ACTIVE_TRAPS; i++) {
    const tb = window.VF.createTurbine(nextDist, i);
    _turbines.push(tb);
    nextDist = tb.worldDist + window.VF.getCurrentTrapSpacing(tb.worldDist);
  }
  _turbineGroup.visible = true;
};

// ============================================================================
// 5. FULL-TUNNEL 36-BEAM LASER LOCKDOWN WALL & REDUCED-OPACITY V-SIGHT RETICLE
// ============================================================================
function _assembleLockdownMegastructure() {
  _lockdownGroup = new THREE.Group();
  _lockdownGroup.visible = false;
  _scene.add(_lockdownGroup);

  const mats = window.VF.AssetCache ? window.VF.AssetCache.sharedMaterials : {};
  _lockdownGroup.add(new THREE.Mesh(new THREE.TorusGeometry(13.95, 0.52, 16, 64), _emitterHousingMat));

  const webContainer = new THREE.Group();
  _lockdownGroup.add(webContainer);

  for (let i = 0; i < 12; i++) {
    const py = (i - 5.5) * 2.1;
    const chordLen = Math.sqrt(Math.max(1.0, 196.0 - py * py)) * 2.0;
    webContainer.add(_buildTripleLayerLaserBeam(chordLen, Math.PI / 2, 0, py));
  }
  for (let i = 0; i < 12; i++) {
    const px = (i - 5.5) * 2.1;
    const chordLen = Math.sqrt(Math.max(1.0, 196.0 - px * px)) * 2.0;
    webContainer.add(_buildTripleLayerLaserBeam(chordLen, 0, px, 0));
  }
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4.0;
    webContainer.add(_buildTripleLayerLaserBeam(27.6, angle, 0, 0));
  }
  [3.5, 7.0, 10.5, 13.5].forEach(function(radius) {
    webContainer.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.14, 12, 48), _laserCoreMat));
    webContainer.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.34, 12, 48), _laserHaloMat));
  });

  const buttonCore = new THREE.Mesh(new THREE.SphereGeometry(1.75, 24, 24), new THREE.MeshBasicMaterial({ color: 0xff1744 }));
  buttonCore.name = 'redBtnCore';
  _lockdownGroup.add(buttonCore);

  const buttonHalo = new THREE.Mesh(
    new THREE.TorusGeometry(2.15, 0.12, 12, 48),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
  );
  buttonHalo.position.z = 0.5;
  _lockdownGroup.add(buttonHalo);

  const buttonSign = new THREE.Mesh(new THREE.CircleGeometry(1.68, 32), mats.redButtonMat || _laserCoreMat);
  buttonSign.position.z = 1.95;
  _lockdownGroup.add(buttonSign);
}

function _assembleReticleAndLockScope() {
  const defaultSpec = (window.VF.ROCKET_FLEET && window.VF.ROCKET_FLEET[8]) || { id: 9, gen: 'GEN 2' };
  const texOuter = window.VF.getShipReticleTexture ? window.VF.getShipReticleTexture(defaultSpec, false, false) : null;
  const texInner = window.VF.getShipReticleTexture ? window.VF.getShipReticleTexture(defaultSpec, false, true) : null;

  _reticleGroup = new THREE.Group();
  _reticleGroup.position.set(0, 0, -22.0);
  window.VF.sciFiReticleGroup = _reticleGroup;

  // Reduced Crosshair Opacity so upcoming obstacles remain crystal-clear
  _reticleOuterMat = new THREE.MeshBasicMaterial({
    map: texOuter,
    transparent: true,
    opacity: 0.52,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  _reticleInnerMat = new THREE.MeshBasicMaterial({
    map: texInner,
    transparent: true,
    opacity: 0.56,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const scopePlaneGeo = new THREE.PlaneGeometry(4.0, 4.0);
  _reticleOuterMesh = new THREE.Mesh(scopePlaneGeo, _reticleOuterMat);
  _reticleInnerMesh = new THREE.Mesh(scopePlaneGeo, _reticleInnerMat);
  _reticleInnerMesh.position.z = 0.03;

  _reticleGroup.add(_reticleOuterMesh, _reticleInnerMesh);

  _guideThreadMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const guideThreadGeo = new THREE.CylinderGeometry(0.010, 0.004, 21.0, 6);
  guideThreadGeo.rotateX(Math.PI / 2);

  [-0.95, 0.95].forEach(function(mountOffsetX) {
    const startVec = new THREE.Vector3(mountOffsetX, 0.12, 21.0);
    const focalVec = new THREE.Vector3(0, 0, 0);
    const midVec = startVec.clone().add(focalVec).multiplyScalar(0.5);
    const threadMesh = new THREE.Mesh(guideThreadGeo, _guideThreadMat);
    threadMesh.position.copy(midVec);
    threadMesh.lookAt(focalVec);
    _reticleGroup.add(threadMesh);
  });

  _targetLockBox = new THREE.Group();
  _targetLockBox.visible = false;
  _scene.add(_targetLockBox);

  const bracketGreenMat = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const bracketRedMat = new THREE.MeshBasicMaterial({
    color: 0xff2a55,
    transparent: true,
    opacity: 0.90,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const cornerHGeo = new THREE.BoxGeometry(0.75, 0.10, 0.06);
  const cornerVGeo = new THREE.BoxGeometry(0.10, 0.75, 0.06);
  [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(function(c) {
    const ch = new THREE.Mesh(cornerHGeo, bracketGreenMat);
    ch.position.set(c[0] * 1.45, c[1] * 1.75, 0.6);
    const cv = new THREE.Mesh(cornerVGeo, bracketGreenMat);
    cv.position.set(c[0] * 1.75, c[1] * 1.45, 0.6);
    _targetLockBox.add(ch, cv);
  });

  _targetLockDiamond = new THREE.Mesh(new THREE.RingGeometry(1.22, 1.38, 4), bracketRedMat);
  _targetLockDiamond.position.z = 0.65;
  _targetLockBox.add(_targetLockDiamond);
}

function _updateReticleSight(dt, nowMs, isLocked, targetWorldPos, spec) {
  if (!_reticleGroup) return;
  _reticleGroup.visible = true;

  const shipId = (spec && spec.id) || 9;
  if ((shipId !== _lastReticleShipId || Boolean(isLocked) !== _lastReticleLocked) && typeof window.VF.getShipReticleTexture === 'function') {
    _lastReticleShipId = shipId;
    _lastReticleLocked = Boolean(isLocked);
    _reticleOuterMat.map = window.VF.getShipReticleTexture(spec, isLocked, false);
    _reticleInnerMat.map = window.VF.getShipReticleTexture(spec, isLocked, true);
    _reticleOuterMat.needsUpdate = true;
    _reticleInnerMat.needsUpdate = true;
  }

  if (_reticleOuterMesh) _reticleOuterMesh.rotation.z += dt * 0.55;
  if (_reticleInnerMesh) _reticleInnerMesh.rotation.z -= dt * 0.35;

  if (isLocked && targetWorldPos) {
    const pulse = 1.15 + 0.06 * Math.sin(nowMs * 0.022);
    _reticleOuterMesh.scale.setScalar(pulse);
    _reticleInnerMesh.scale.setScalar(pulse);
    _reticleOuterMat.opacity = 0.74;
    _reticleInnerMat.opacity = 0.78;
    _guideThreadMat.color.setHex(0x00ff88);
    _guideThreadMat.opacity = 0.34;

    _targetLockBox.position.copy(targetWorldPos);
    _targetLockBox.visible = true;
    _targetLockDiamond.rotation.z += dt * 4.8;
    _targetLockBox.scale.setScalar(1.0 + 0.08 * Math.sin(nowMs * 0.020));
  } else {
    _reticleOuterMesh.scale.setScalar(1.0);
    _reticleInnerMesh.scale.setScalar(1.0);
    _reticleOuterMat.opacity = 0.52;
    _reticleInnerMat.opacity = 0.56;
    _guideThreadMat.color.setHex((spec && (spec.gen === 'GEN 1')) ? 0x00ff66 : 0x00e5ff);
    _guideThreadMat.opacity = 0.12;
    if (_targetLockBox) _targetLockBox.visible = false;
  }
}

// ============================================================================
// 6. OBJECT POOLS & PREDICTIVE BALLISTIC LEAD-TARGETING AI DRONES
// ============================================================================
function _initObjectPools() {
  _oneShotPool.length = 0;
  _sparkPool.length = 0;
  _ringPool.length = 0;
  _activeBeamEffects.length = 0;

  for (let i = 0; i < 8; i++) {
    const pGroup = new THREE.Group();
    pGroup.visible = false;
    pGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.58, 1), new THREE.MeshBasicMaterial({ color: 0xffffff })));

    const outerShellMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending
    });
    pGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), outerShellMat));

    const plasmaTrailMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending
    });
    const trailGeo = new THREE.CylinderGeometry(0.18, 0.55, 14.0, 10);
    trailGeo.rotateX(Math.PI / 2);
    const trailMesh = new THREE.Mesh(trailGeo, plasmaTrailMat);
    trailMesh.position.z = 7.0;
    pGroup.add(trailMesh);

    const shockRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.88
    });
    pGroup.add(new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.08, 8, 28), shockRingMat));

    _projectilesGroup.add(pGroup);
    _oneShotPool.push({
      active: false,
      mesh: pGroup,
      outerShellMat: outerShellMat,
      plasmaTrailMat: plasmaTrailMat,
      shockRingMat: shockRingMat,
      x: 0,
      y: 0,
      z: 0,
      vz: -250,
      weaponType: 'LASER',
      damage: 75,
      color: 0x00f0ff,
      isRemoteVisual: false
    });
  }

  for (let i = 0; i < 42; i++) {
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(0.24), mat);
    mesh.visible = false;
    _debrisGroup.add(mesh);
    _sparkPool.push({ active: false, mesh: mesh, mat: mat, vx: 0, vy: 0, vz: 0, life: 0 });
  }

  for (let i = 0; i < 6; i++) {
    const mat = new THREE.MeshBasicMaterial({ color: 0xff2a55, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.95, 32), mat);
    mesh.visible = false;
    _debrisGroup.add(mesh);
    _ringPool.push({ active: false, mesh: mesh, mat: mat, opacity: 0.9 });
  }
}

window.VF.spawnPooledSparks = function(x, y, z, hexColor, count) {
  const maxSparks = count || 12;
  let spawned = 0;
  for (let i = 0; i < _sparkPool.length && spawned < maxSparks; i++) {
    const sp = _sparkPool[i];
    if (!sp.active) {
      sp.active = true;
      sp.life = 0.78;
      sp.mat.color.setHex(hexColor || 0x00f0ff);
      sp.mesh.position.set(x, y, z);
      sp.mesh.visible = true;
      sp.vx = (Math.random() - 0.5) * 22;
      sp.vy = (Math.random() - 0.5) * 22;
      sp.vz = (Math.random() - 0.5) * 22;
      spawned += 1;
    }
  }
};

window.VF.spawnPooledExplosionRing = function(x, y, z, hexColor) {
  for (let i = 0; i < _ringPool.length; i++) {
    const r = _ringPool[i];
    if (!r.active) {
      r.active = true;
      r.opacity = 0.96;
      r.mat.color.setHex(hexColor || 0xff2a55);
      r.mat.opacity = 0.96;
      r.mesh.position.set(x, y, z);
      r.mesh.scale.set(1, 1, 1);
      r.mesh.visible = true;
      break;
    }
  }
  window.VF.spawnPooledSparks(x, y, z, hexColor || 0xff2a55, 16);
};
window.VF.spawnGoldSparkRing = window.VF.spawnPooledExplosionRing;

function _spawnSupernovaBeamEffect(x, y, startZ, colorHex) {
  const beamGroup = new THREE.Group();
  beamGroup.position.set(x, y, startZ);

  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending
  });
  const outerMat = new THREE.MeshBasicMaterial({
    color: colorHex || 0x00f0ff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending
  });

  const coreGeo = new THREE.CylinderGeometry(0.18, 0.08, 85.0, 8);
  coreGeo.rotateX(Math.PI / 2);
  coreGeo.translate(0, 0, -42.5);
  beamGroup.add(new THREE.Mesh(coreGeo, coreMat));

  const outerGeo = new THREE.CylinderGeometry(0.52, 0.22, 85.0, 12);
  outerGeo.rotateX(Math.PI / 2);
  outerGeo.translate(0, 0, -42.5);
  beamGroup.add(new THREE.Mesh(outerGeo, outerMat));

  const muzzleRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 8, 28), outerMat);
  beamGroup.add(muzzleRing);

  _scene.add(beamGroup);
  _activeBeamEffects.push({
    group: beamGroup,
    coreMat: coreMat,
    outerMat: outerMat,
    muzzleRing: muzzleRing,
    life: 0.28
  });

  window.VF.spawnPooledSparks(x, y, startZ - 1.5, colorHex || 0x00f0ff, 14);
}

function _constructDroneHunterSquadron() {
  if (!_droneGroup) {
    _droneGroup = new THREE.Group();
    _scene.add(_droneGroup);
  }
  _drones.length = 0;
  _droneBolts.length = 0;

  for (let i = 0; i < 4; i++) {
    const dMesh = (typeof window.VF.buildWhiteVHunterDrone === 'function')
      ? window.VF.buildWhiteVHunterDrone()
      : new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.0, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    dMesh.visible = false;
    _droneGroup.add(dMesh);
    dMesh.userData = dMesh.userData || {};
    dMesh.userData.slotIndex = i;
    dMesh.userData.active = false;
    dMesh.userData.peelingOff = false;
    dMesh.userData.spawnTimer = 0.0;
    dMesh.userData.postFireSlowTimer = 0.0;
    dMesh.userData.fireTimer = 1.2 + i * 0.65;
    dMesh.userData.jinkVx = 0.0;
    dMesh.userData.jinkVy = 0.0;
    dMesh.userData.jinkCooldown = 0.0;
    dMesh.userData.aiBrain = {
      freqX: 0.0029 + i * 0.00085,
      freqY: 0.0036 + (3 - i) * 0.00075,
      phaseX: i * 2.15,
      phaseY: i * 1.65 + 0.8,
      orbitSign: (i % 2 === 0) ? 1 : -1,
      waypointX: (i % 2 === 0 ? -4.2 : 4.2),
      waypointY: (i < 2 ? 2.8 : -2.4),
      waypointTimer: 0.0
    };
    _drones.push(dMesh);
  }

  for (let i = 0; i < 12; i++) {
    const isMulti = (i % 3 === 2);
    const bMesh = (typeof window.VF.buildDronePlasmaBall === 'function')
      ? window.VF.buildDronePlasmaBall(isMulti)
      : new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
    bMesh.visible = false;
    _scene.add(bMesh);
    bMesh.userData = bMesh.userData || {};
    bMesh.userData.active = false;
    bMesh.userData.interacted = false;
    bMesh.userData.vz = 72.0;
    bMesh.userData.isMulti = isMulti;
    _droneBolts.push(bMesh);
  }
}

window.VF.hasAnyActiveDrone = function() {
  for (let i = 0; i < _drones.length; i++) {
    if (_drones[i] && _drones[i].userData && _drones[i].userData.active && !_drones[i].userData.peelingOff) {
      return true;
    }
  }
  return false;
};

window.VF.spawnWhiteDroneSquadronAtDistance = function(currentDist) {
  const st = window.VF.state || {};
  const stage = Math.floor((Number(currentDist) || 0) / 1250);
  if (stage === _lastDroneSpawnStage) return false;
  _lastDroneSpawnStage = stage;

  if (_droneGroup) _droneGroup.visible = true;
  const count = (st.mode === 'MP_SOLO' || st.mode === 'MP_TEAM') ? 4 : 2;
  const shipWorldZ = -(st.distance || 0);

  for (let i = 0; i < _drones.length; i++) {
    const d = _drones[i];
    if (i < count) {
      d.visible = true;
      d.scale.setScalar(0.12);
      d.userData.active = true;
      d.userData.peelingOff = false;
      d.userData.spawnTimer = 0.0;
      d.userData.postFireSlowTimer = 0.0;
      d.userData.fireTimer = 1.25 + i * 0.65;
      d.userData.jinkVx = 0.0;
      d.userData.jinkVy = 0.0;
      d.userData.jinkCooldown = 0.0;

      const side = (i % 2 === 0) ? -1 : 1;
      const tier = (i < 2) ? 1 : -1;
      const portalX = side * (3.8 + (i % 2) * 1.4);
      const portalY = tier * 2.6;
      const portalZ = shipWorldZ - 92.0 - i * 8.0;

      d.userData.aiBrain.waypointX = portalX;
      d.userData.aiBrain.waypointY = portalY;
      d.userData.aiBrain.waypointTimer = 0.8 + i * 0.35;
      d.position.set(portalX, portalY, portalZ);

      if (d.userData.spawnRingsGroup) {
        d.userData.spawnRingsGroup.visible = true;
        d.userData.spawnRingsGroup.scale.setScalar(1.8);
      }
      window.VF.spawnPooledExplosionRing(portalX, portalY, portalZ, 0x00f0ff);
    } else {
      d.visible = false;
      d.userData.active = false;
    }
  }

  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.playSpaceBridgeSpoolSFX) {
      window.VF.AudioEngine.playSpaceBridgeSpoolSFX();
    }
  } catch (_) {}

  if (typeof window.VF.showCombatAlert === 'function') {
    window.VF.showCombatAlert('QUANTUM RIFT DETECTED: ' + count + 'x AI V-HUNTER DRONES WARPING IN AHEAD!', false, 2400);
  }
  return true;
};

// PREDICTIVE BALLISTIC LEAD-TARGETING SOLVER: Calculates exact intercept vector!
function _fireDronePlasmaFromDrone(shooter, isMultiColor) {
  if (!shooter || !shooter.userData.active || shooter.userData.peelingOff) return;

  shooter.userData.postFireSlowTimer = 2.0;
  if (shooter.userData.aimLaserMesh) {
    shooter.userData.aimLaserMesh.visible = false;
  }

  const st = window.VF.state || {};
  const shipWorldZ = -(st.distance || 0);
  const startZ = shooter.position.z + 1.2;
  const distZ = Math.max(8.0, Math.abs(shipWorldZ - startZ));

  // Bolt travels at +68 m/s in +Z while player travels at st.currentSpeed in -Z
  const boltVz = 68.0;
  const closingSpeedZ = (st.currentSpeed || 48.0) + boltVz;
  const tFlight = Math.max(0.14, distZ / closingSpeedZ);

  // Predict player's future (X, Y) at impact time tFlight
  const predX = Math.max(-9.8, Math.min(9.8, (st.playerX || 0) + (st.velX || 0) * tFlight * 0.55));
  const predY = Math.max(-9.8, Math.min(9.8, (st.playerY !== undefined ? st.playerY : -3.0) + (st.velY || 0) * tFlight * 0.55));

  for (let i = 0; i < _droneBolts.length; i++) {
    const bolt = _droneBolts[i];
    if (!bolt.userData.active && Boolean(bolt.userData.isMulti) === Boolean(isMultiColor)) {
      bolt.userData.active = true;
      bolt.userData.interacted = false;
      bolt.userData.vz = boltVz;
      bolt.userData.vx = (predX - shooter.position.x) / tFlight;
      bolt.userData.vy = (predY - (shooter.position.y - 0.15)) / tFlight;
      bolt.position.set(shooter.position.x, shooter.position.y - 0.15, startZ);
      bolt.visible = true;
      try {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playDroneFireSFX) {
          window.VF.AudioEngine.playDroneFireSFX();
        }
      } catch (_) {}
      break;
    }
  }
}

window.VF.triggerGoldenHexShieldActivation = function(seconds) {
  const st = window.VF.state;
  if (!st) return;
  st.goldenShieldTimer = Math.max(st.goldenShieldTimer || 0, Number(seconds) || 1.45);
  if (_playerGroup && _playerGroup.userData && _playerGroup.userData.rig && _playerGroup.userData.rig.goldenShieldMesh) {
    _playerGroup.userData.rig.goldenShieldMesh.visible = true;
  }
  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.playGoldenShieldImpactSFX) {
      window.VF.AudioEngine.playGoldenShieldImpactSFX();
    }
  } catch (_) {}
};

window.VF.launchPooledOneShotBlast = function(x, y, startWorldZ, spec, isRemote) {
  const st = window.VF.state || {};
  const wColor = spec ? spec.weaponColor : 0x00f0ff;

  _spawnSupernovaBeamEffect(x, y, startWorldZ, wColor);

  if (!isRemote) {
    if (_lockdownWallState.active && !_lockdownWallState.cleared) {
      const distToWall = _lockdownWallState.milestoneDistance - st.distance;
      if (distToWall > 0 && distToWall <= 175.0) {
        if (Math.hypot(x, y) <= 5.5) {
          window.VF.breachLockdownGateWithOneShot();
        } else if (window.VF.showCombatAlert) {
          window.VF.showCombatAlert('MISSED CENTER RED BUTTON — ALIGN V-SIGHT TO (0, 0) & FIRE!', false, 1600);
          st.weaponCooldown = 0.35;
        }
      }
    }
    if (window.VF.hasAnyActiveDrone()) {
      let hitAny = false;
      for (let i = 0; i < _drones.length; i++) {
        const d = _drones[i];
        if (!d.userData.active || d.userData.peelingOff) continue;
        const errDist = Math.hypot(d.position.x - x, d.position.y - y);
        if (errDist <= 3.1) {
          d.userData.active = false;
          d.visible = false;
          window.VF.triggerDroneDestructionAnimation(d);
          st.huntersDestroyed = (st.huntersDestroyed || 0) + 1;
          st.score = (st.score || 0) + 1000;
          st.hyperShieldTimer = 2.0;
          hitAny = true;
          if (window.VF.showCombatAlert) {
            window.VF.showCombatAlert('+1,000 V-HUNTER OBLITERATED! 2.0S HYPER-SHIELD!', true, 2100);
          }
          break;
        }
      }
      if (!hitAny) {
        for (let i = 0; i < _drones.length; i++) {
          const d = _drones[i];
          if (d.userData.active && !d.userData.peelingOff && (d.userData.postFireSlowTimer || 0) <= 0) {
            const jinkDir = (i % 2 === 0) ? 1 : -1;
            d.userData.jinkVx = jinkDir * 24.0;
            d.userData.jinkVy = (Math.random() > 0.5 ? 1 : -1) * 18.0;
          }
        }
      }
    }
  }

  for (let i = 0; i < _oneShotPool.length; i++) {
    const p = _oneShotPool[i];
    if (!p.active) {
      const wType = spec ? spec.weaponType : 'LASER';
      const dmg = spec && spec.gen === 'GEN 5' ? 100 : (spec && spec.gen === 'GEN 4' ? 80 : 65);

      p.active = true;
      p.x = x;
      p.y = y;
      p.z = startWorldZ;
      p.vz = -((st.currentSpeed || 48) + 250);
      p.weaponType = wType;
      p.damage = dmg;
      p.color = wColor;
      p.isRemoteVisual = Boolean(isRemote);

      p.outerShellMat.color.setHex(wColor);
      p.plasmaTrailMat.color.setHex(wColor);
      p.shockRingMat.color.setHex(wColor);
      p.mesh.position.set(x, y, startWorldZ);
      p.mesh.visible = true;
      break;
    }
  }
};

window.VF.fireOneShot = function() {
  const st = window.VF.state;
  if (!st || !st.inGame || st.paused || st.crashed) return;
  if (st.weaponCooldown > 0 || st.weaponCharging) return;

  const spec = (window.VF.ROCKET_FLEET && window.VF.ROCKET_FLEET.find(function(r) { return r.id === st.equippedRocketId; })) || window.VF.ROCKET_FLEET[8];
  st.weaponCharging = true;
  st.weaponOvercharged = false;
  st.maxWeaponCooldown = window.VF.hasAnyActiveDrone() ? 1.15 : 2.8;
  if (window.VF.updateShipStatusHUD) window.VF.updateShipStatusHUD();

  const fireBtn = document.getElementById('btn-fire');
  if (fireBtn) {
    fireBtn.classList.add('pressed');
    setTimeout(function() { fireBtn.classList.remove('pressed'); }, 550);
  }

  if ((st.mode === 'MP_SOLO' || st.mode === 'MP_TEAM') && window.VF.NetworkManager) {
    window.VF.NetworkManager.sendPacket({
      type: 'ONESHOT_CHARGE_AND_FIRE',
      roomCode: st.roomCode,
      peerId: st.localPeerId,
      shipId: st.equippedRocketId,
      x: st.playerX,
      y: st.playerY,
      distance: st.distance
    });
  }

  const isUrgentTarget = Boolean(_lockdownWallState.active || window.VF.hasAnyActiveDrone());
  window.VF.triggerOneShotAnimation(_playerGroup, spec, function(firedSpec) {
    st.weaponCharging = false;
    st.weaponCooldown = window.VF.hasAnyActiveDrone() ? 1.15 : 2.8;
    st.muzzleFlashTimer = 0.22;
    st.recoilOffsetZ = 0.68;
    st.fovPunch = 5.0;

    if (_muzzlePointLight) {
      _muzzlePointLight.color.setHex(firedSpec.weaponColor);
      _muzzlePointLight.intensity = 5.5;
      _muzzlePointLight.position.set(st.playerX, st.playerY, -st.distance - 2.4);
    }
    if (window.VF.updateShipStatusHUD) window.VF.updateShipStatusHUD();
    window.VF.launchPooledOneShotBlast(st.playerX, st.playerY, -st.distance - 2.4, firedSpec, false);
  }, isUrgentTarget);
};
window.VF.fireOneShotWeapon = window.VF.fireOneShot;
window.VF.triggerPlayerOneShot = window.VF.fireOneShot;
window.VF.launchOneShotProjectile = window.VF.fireOneShot;

window.VF.breachLockdownGateWithOneShot = function() {
  if (!_lockdownWallState.active || _lockdownWallState.cleared) return false;
  _lockdownWallState.cleared = true;
  if (_lockdownGroup) _lockdownGroup.visible = false;

  const st = window.VF.state || {};
  st.lockdownsBreached = (st.lockdownsBreached || 0) + 1;
  st.score = (st.score || 0) + 1500;
  st.slowMoTimer = 0.28;
  st.hyperShieldTimer = 2.0;
  st.weaponOvercharged = false;

  window.VF.spawnPooledExplosionRing(0, 0, -_lockdownWallState.milestoneDistance, 0x00f0ff);
  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.playLockdownBreachSFX) {
      window.VF.AudioEngine.playLockdownBreachSFX();
    }
  } catch (_) {}
  if (window.VF.showCombatAlert) {
    window.VF.showCombatAlert('+1,500 LOCKDOWN BREACHED! 2.0S HYPER-SHIELD!', true, 2500);
  }
  return true;
};

window.VF.handleNetworkLockdownCleared = window.VF.breachLockdownGateWithOneShot;
window.VF.handleNetworkDroneDestroyed = function(pkt) {
  const idx = Number(pkt && pkt.droneIndex);
  if (_drones[idx] && _drones[idx].userData.active) {
    _drones[idx].userData.active = false;
    _drones[idx].visible = false;
    window.VF.triggerDroneDestructionAnimation(_drones[idx]);
    return true;
  }
  return false;
};

window.VF.triggerDroneDestructionAnimation = function(target) {
  const pos = (target && target.position) ? target.position : new THREE.Vector3(0, 0, -35);
  window.VF.spawnPooledExplosionRing(pos.x, pos.y, pos.z, 0xffaa00);
  window.VF.spawnPooledSparks(pos.x, pos.y, pos.z, 0x00f0ff, 22);
  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.playTargetDestroyedSFX) {
      window.VF.AudioEngine.playTargetDestroyedSFX();
    }
  } catch (_) {}
};

// ============================================================================
// 7. REMOTE PLAYERS & PLAYER SHIP MOUNTING WITH RETICLE
// ============================================================================
window.VF.clearAllRemoteShipsAndProjectiles = function() {
  window.VF.remotePlayers.forEach(function(rp) {
    if (rp.mesh && _scene) _scene.remove(rp.mesh);
  });
  window.VF.remotePlayers.clear();

  for (let i = 0; i < _oneShotPool.length; i++) {
    _oneShotPool[i].active = false;
    _oneShotPool[i].mesh.visible = false;
  }
  for (let i = 0; i < _sparkPool.length; i++) {
    _sparkPool[i].active = false;
    _sparkPool[i].mesh.visible = false;
  }
  for (let i = 0; i < _ringPool.length; i++) {
    _ringPool[i].active = false;
    _ringPool[i].mesh.visible = false;
  }
  for (let i = 0; i < _drones.length; i++) {
    _drones[i].visible = false;
    _drones[i].userData.active = false;
  }
  for (let i = 0; i < _droneBolts.length; i++) {
    _droneBolts[i].visible = false;
    _droneBolts[i].userData.active = false;
  }
};
window.VF.clearRemotePlayers = window.VF.clearAllRemoteShipsAndProjectiles;

window.VF.createRemotePlayerNameplateSprite = function() {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4.6, 1.15, 1);
  sprite.position.set(0, 1.9, 0);
  sprite.renderOrder = 999;
  sprite.userData = { canvas: canvas, texture: texture, lastKey: '' };
  return sprite;
};
window.VF.acquireNameplateSprite = window.VF.createRemotePlayerNameplateSprite;

window.VF.updateRemotePlayerNameplate = function(sprite, labelText, hullPct, isTeammate) {
  if (!sprite || !sprite.userData || !sprite.userData.canvas) return;
  const clampedHull = Math.max(0, Math.min(100, Math.round(hullPct || 100)));
  const key = labelText + '|' + clampedHull + '|' + (isTeammate ? '1' : '0');
  if (sprite.userData.lastKey === key) return;
  sprite.userData.lastKey = key;

  const ctx = sprite.userData.canvas.getContext('2d');
  ctx.clearRect(0, 0, 384, 96);
  const accent = isTeammate ? '#00f0ff' : '#ff2a55';
  ctx.fillStyle = 'rgba(6, 10, 22, 0.88)';
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.fillRect(8, 8, 368, 80);
  ctx.strokeRect(8, 8, 368, 80);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px "Orbitron", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText + ' | ' + clampedHull + '%', 192, 35);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(28, 58, 328, 16);
  ctx.fillStyle = clampedHull > 40 ? (isTeammate ? '#00ff88' : '#00f0ff') : '#ff2a55';
  ctx.fillRect(28, 58, (328 * clampedHull) / 100, 16);
  sprite.userData.texture.needsUpdate = true;
};

window.VF.getOrCreateRemotePlayer = function(peerIdParam, pktParam) {
  let pkt = pktParam;
  let peerId = peerIdParam;
  if (typeof peerId === 'object' && peerId !== null) {
    pkt = peerId;
    peerId = pkt.senderId || pkt.peerId;
  }
  const st = window.VF.state;
  if (!peerId || !st || peerId === st.localPeerId) return null;
  pkt = pkt || {};

  const shipId = (pkt.shipId >= 1 && pkt.shipId <= 32) ? Number(pkt.shipId) : 9;
  const remoteTeam = Number(pkt.team) || 2;
  const myTeam = typeof window.VF.getMyTeamNumber === 'function' ? window.VF.getMyTeamNumber() : 1;
  const isTeammate = (st.mode === 'MP_TEAM' && remoteTeam === myTeam);
  let rp = window.VF.remotePlayers.get(peerId);

  if (!rp) {
    const spec = window.VF.ROCKET_FLEET[shipId - 1] || window.VF.ROCKET_FLEET[8];
    const container = new THREE.Group();
    const shipModel = window.VF.buildWeaponizedSpacecraft(spec, false);
    container.add(shipModel);

    const haloColor = isTeammate ? 0x00f0ff : 0xff2a55;
    const haloMesh = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.065, 10, 36),
      new THREE.MeshBasicMaterial({ color: haloColor })
    );
    container.add(haloMesh);

    const nameplate = window.VF.createRemotePlayerNameplateSprite();
    container.add(nameplate);

    const initX = typeof pkt.x === 'number' ? pkt.x : 2.2;
    const initY = typeof pkt.y === 'number' ? pkt.y : -3.0;
    const initZ = -(Number(pkt.distance) || st.distance || 0);
    container.position.set(initX, initY, initZ);
    _scene.add(container);

    rp = {
      peerId: peerId,
      shipId: shipId,
      spec: spec,
      shipName: spec.name.toUpperCase(),
      shipModel: shipModel,
      team: remoteTeam,
      slotLabel: pkt.slotLabel || (st.mode === 'MP_TEAM' ? 'TEAM ' + remoteTeam : 'RIVAL'),
      mesh: container,
      haloMesh: haloMesh,
      nameplate: nameplate,
      targetX: initX,
      targetY: initY,
      targetZ: initZ,
      targetVec: new THREE.Vector3(initX, initY, initZ),
      tilt: 0,
      hull: typeof pkt.hull === 'number' ? pkt.hull : 100,
      alive: pkt.alive !== false
    };
    window.VF.remotePlayers.set(peerId, rp);
  }

  if (typeof pkt.x === 'number') rp.targetX = pkt.x;
  if (typeof pkt.y === 'number') rp.targetY = pkt.y;
  if (typeof pkt.distance === 'number') rp.targetZ = -pkt.distance;
  if (typeof pkt.tilt === 'number') rp.tilt = pkt.tilt;
  if (typeof pkt.hull === 'number') rp.hull = pkt.hull;
  if (typeof pkt.alive === 'boolean') rp.alive = pkt.alive;

  window.VF.updateRemotePlayerNameplate(rp.nameplate, rp.slotLabel + ' · ' + rp.shipName, rp.hull, isTeammate);
  rp.mesh.visible = rp.alive;
  return rp;
};
window.VF.syncRemotePlayerState = window.VF.getOrCreateRemotePlayer;
window.VF.updateRemotePlayer = window.VF.getOrCreateRemotePlayer;

window.VF.equipSpacecraftModel = function(rocketId) {
  const st = window.VF.state;
  if (!st || !_playerGroup) return;
  const targetId = Number(rocketId || st.equippedRocketId || 9);
  st.equippedRocketId = targetId;
  if (window.VF.persistEquippedShip) window.VF.persistEquippedShip(targetId);

  const spec = window.VF.ROCKET_FLEET.find(function(r) { return r.id === targetId; }) || window.VF.ROCKET_FLEET[8];

  while (_playerGroup.children.length > 0) {
    _playerGroup.remove(_playerGroup.children[0]);
  }

  if (_reticleGroup) {
    _playerGroup.add(_reticleGroup);
  }

  _craftMeshInstance = window.VF.buildWeaponizedSpacecraft(spec, false, st.customTrimIndex || 0);
  _craftMeshInstance.visible = true;
  _playerGroup.add(_craftMeshInstance);

  _playerGroup.userData.craftMesh = _craftMeshInstance;
  _playerGroup.userData.rig = _craftMeshInstance.userData ? _craftMeshInstance.userData.rig : null;
  _playerGroup.userData.weaponRig = _playerGroup.userData.rig;

  if (_playerGroup.userData.rig && _playerGroup.userData.rig.goldenShieldMesh) {
    _playerGroup.userData.rig.goldenShieldMesh.visible = false;
  }

  _lastReticleShipId = -1;
  _playerGroup.visible = !st.crashed && !st.inIntro;
  _playerGroup.position.set(st.playerX || 0, st.playerY || -3.0, -(st.distance || 0));

  const nameEl = document.getElementById('equipped-ship-name') || document.getElementById('equipped-rocket-label');
  if (nameEl) nameEl.textContent = spec.name;
};
window.VF.rebuildPlayerRocket = window.VF.equipSpacecraftModel;
window.VF.rebuildPlayerSpacecraft = window.VF.equipSpacecraftModel;
window.VF.refreshPlayerShip = window.VF.equipSpacecraftModel;

// ============================================================================
// 8. CINEMATIC 3D ORBITAL LAUNCH CONDUIT INTRO (`buildIntroLaunchBay`)
// ============================================================================
window.VF.buildIntroLaunchBay = function() {
  if (!_introGroup) {
    _introGroup = new THREE.Group();
    _scene.add(_introGroup);
  }
  while (_introGroup.children.length > 0) {
    _introGroup.remove(_introGroup.children[0]);
  }
  window.VF.introLaunchBayGroup = _introGroup;
  _introArchLights.length = 0;

  // Dedicated Studio Key & Rim Lights inside Launch Bay so Flagship Hull is 100% Brightly Lit!
  const bayKeyLight = new THREE.PointLight(0xffffff, 2.2, 45);
  bayKeyLight.position.set(4.5, 3.5, 4.5);
  _introGroup.add(bayKeyLight);

  const bayFillLight = new THREE.PointLight(0x00f0ff, 1.8, 45);
  bayFillLight.position.set(-4.5, 1.5, -3.5);
  _introGroup.add(bayFillLight);

  // Enclosed Brushed-Titanium Orbital Launch Tube
  const bayShellGeo = new THREE.CylinderGeometry(8.8, 8.8, 80.0, 36, 1, true);
  bayShellGeo.rotateX(Math.PI / 2);
  const bayShellMat = new THREE.MeshStandardMaterial({
    color: 0x0c162c,
    metalness: 0.55,
    roughness: 0.38,
    side: THREE.BackSide
  });
  const bayShell = new THREE.Mesh(bayShellGeo, bayShellMat);
  bayShell.position.set(0, -1.6, -24.0);
  _introGroup.add(bayShell);

  // Sequential Magnetic Accelerator Gantry Arches
  for (let a = 0; a < 12; a++) {
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(6.5, 0.14, 10, 48),
      new THREE.MeshBasicMaterial({ color: 0x1e293b })
    );
    arch.position.set(0, -1.65, 5.0 - a * 4.5);
    _introGroup.add(arch);
    _introArchLights.push(arch);
  }

  _introWarpIris = new THREE.Mesh(
    new THREE.TorusGeometry(6.2, 0.26, 12, 6),
    new THREE.MeshBasicMaterial({ color: 0xb500ff })
  );
  _introWarpIris.position.set(0, -1.65, -45.0);
  _introGroup.add(_introWarpIris);

  _introOmegaShip = window.VF.buildIntroFlagshipDreadnought();
  _introOmegaShip.position.set(0, -1.65, 0);
  _introGroup.add(_introOmegaShip);

  _sonicBoomRing = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 1.35, 36),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.92 })
  );
  _sonicBoomRing.position.set(0, -1.65, 1.2);
  _sonicBoomRing.visible = false;
  _introGroup.add(_sonicBoomRing);
};

window.VF.updateIntroChoreography = function(progressPct) {
  const st = window.VF.state;
  if (!_introGroup || !_camera) return;
  _introGroup.visible = true;
  if (_playerGroup) _playerGroup.visible = false;
  if (_turbineGroup) _turbineGroup.visible = false;
  if (_parallaxLandmarksGroup) _parallaxLandmarksGroup.visible = false;
  for (let s = 0; s < _tunnelSegments.length; s++) {
    _tunnelSegments[s].visible = false;
  }

  const pct = Math.max(0, Math.min(100, Number(progressPct) || 0)) / 100;
  const litCount = Math.floor(pct * _introArchLights.length);
  for (let i = 0; i < _introArchLights.length; i++) {
    _introArchLights[i].material.color.setHex(
      i <= litCount ? (i % 2 === 0 ? 0x00f0ff : 0xfbbf24) : 0x1e293b
    );
  }
  if (_introWarpIris) {
    _introWarpIris.rotation.z += 0.035;
  }

  if (_introOmegaShip) {
    _introOmegaShip.position.y = -1.65 + Math.sin(performance.now() * 0.004) * 0.06;
    window.VF.updateSpacecraftCinematicRig(_introOmegaShip, 0.016, {
      boosting: pct > 0.68,
      goldenShieldTimer: 0
    });
  }

  if (pct < 0.84) {
    const t = pct / 0.84;
    const smoothT = t * t * (3 - 2 * t);
    const orbitAng = (1 - smoothT) * 2.25;
    const camRad = 4.6 - smoothT * 0.4;
    _camera.position.set(
      Math.sin(orbitAng) * camRad,
      -0.95 + Math.cos(orbitAng * 0.5) * 0.35,
      Math.cos(orbitAng) * 5.2
    );
    _camera.lookAt(0, -1.60, -0.8);
  } else {
    if (!st.introFlyByTriggered) {
      st.introFlyByTriggered = true;
      if (_sonicBoomRing) _sonicBoomRing.visible = true;
      try {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playSonicBoomSFX) {
          window.VF.AudioEngine.playSonicBoomSFX();
        }
      } catch (_) {}
    }
    const flyT = (pct - 0.84) / 0.16;
    if (_introOmegaShip) {
      _introOmegaShip.position.z = -Math.pow(flyT, 1.6) * 22.0;
    }
    if (_sonicBoomRing) {
      _sonicBoomRing.scale.setScalar(1 + flyT * 10.0);
      _sonicBoomRing.material.opacity = Math.max(0, 1 - flyT);
    }
    _camera.position.set(0, -1.05, 5.4);
    _camera.lookAt(0, -1.65, -24);
  }
};

window.VF.clearDebrisAndResetExteriorVista = function() {
  const st = window.VF.state || {};
  window.VF.clearAllRemoteShipsAndProjectiles();

  st.crashed = false;
  st.alive = true;
  st.distance = 0;
  st.boostBonusMeters = 0;
  st.current500mStage = 0;
  st.health = 100;
  st.hullArmor = 100;
  st.weaponCooldown = 0;
  st.weaponCharging = false;
  st.weaponOvercharged = false;
  st.goldenShieldTimer = 0;
  st.recoilOffsetZ = 0;
  st.knockbackVx = 0;
  st.knockbackVy = 0;
  st.playerX = 0;
  st.playerY = -3.0;
  st.targetX = 0;
  st.targetY = -3.0;
  _cursorTargetX = 0;
  _cursorTargetY = -3.0;
  _desktopHoldBoostActive = false;
  _lastDesktopDownTime = 0;
  _lastDroneSpawnStage = -1;
  _lockdownWallState.active = false;
  _lockdownWallState.cleared = false;
  _lockdownWallState.overcharged = false;
  if (_lockdownGroup) _lockdownGroup.visible = false;
  if (_targetLockBox) _targetLockBox.visible = false;

  if (window.VF.forceResetBoostToggleState) {
    window.VF.forceResetBoostToggleState();
  }
  if (window.VF.resetModularShatter) window.VF.resetModularShatter(_playerGroup);
  window.VF.resetTunnelWallPositions();
  window.VF.resetTurbines();

  if (_parallaxLandmarksGroup) _parallaxLandmarksGroup.visible = !st.inIntro;
  if (_turbineGroup) _turbineGroup.visible = !st.inIntro;

  if (_playerGroup) {
    _playerGroup.visible = !st.inIntro;
    _playerGroup.position.set(0, -3.0, 0);
    _playerGroup.rotation.set(0, 0, 0);
    if (_craftMeshInstance) _craftMeshInstance.visible = true;
  }

  if (_camera) {
    _camera.position.set(0, -3.0 * 0.78 + 1.2, window.VF.cameraZOffset);
    _camera.lookAt(0, -3.0 * 0.85, -25);
  }
};

window.VF.resetTunnelForMatch = function(gameMode) {
  if (gameMode && window.VF.state) {
    window.VF.state.mode = gameMode;
    window.VF.state.gameMode = gameMode;
  }
  window.VF.clearDebrisAndResetExteriorVista();
  if (_playerGroup) {
    _playerGroup.visible = true;
    if (_craftMeshInstance) _craftMeshInstance.visible = true;
  }
  if (_turbineGroup) _turbineGroup.visible = true;
  if (_parallaxLandmarksGroup) _parallaxLandmarksGroup.visible = true;
};
window.VF.resetMatchState = window.VF.resetTunnelForMatch;
window.VF.prepareTunnelForMatch = window.VF.resetTunnelForMatch;

window.VF.launchMatch = function(gameMode) {
  window.VF.resetTunnelForMatch(gameMode);
  if (window.VF.startGame) {
    window.VF.startGame(gameMode || 'ENDLESS', false, Date.now());
  }
};
window.VF.startGameplayLoop = window.VF.launchMatch;

window.VF.triggerBarrelRoll = function(direction) {
  const st = window.VF.state;
  if (!st || !st.inGame || st.paused || st.crashed || st.barrelRollTimer > 0) return;
  st.barrelRollTimer = 0.62;
  st.barrelRollDir = Number(direction) || 1;
  st.invulnTimer = Math.max(st.invulnTimer || 0, 0.62);
  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.playBarrelRollWhooshSFX) {
      window.VF.AudioEngine.playBarrelRollWhooshSFX();
    }
  } catch (_) {}
};

window.VF.finishMatchModal = function(badgeTitle, modalTitle, reasonText, isVictory) {
  const st = window.VF.state || {};
  st.inGame = false;
  st.alive = false;
  st.paused = false;
  st.screen = 'GAMEOVER';
  _desktopHoldBoostActive = false;

  if (window.VF.forceResetBoostToggleState) window.VF.forceResetBoostToggleState();

  const badgeEl = document.getElementById('gameover-badge');
  const titleEl = document.getElementById('gameover-title') || document.getElementById('end-modal-title');
  const reasonEl = document.getElementById('gameover-reason') || document.getElementById('end-modal-sub');
  const scoreEl = document.getElementById('gameover-score') || document.getElementById('end-score-val');
  const distEl = document.getElementById('gameover-distance') || document.getElementById('end-dist-val');
  const mvpEl = document.getElementById('gameover-mvp-stats');
  const retryBtn = document.getElementById('btn-gameover-retry') || document.getElementById('btn-retry-game');

  if (badgeEl) badgeEl.textContent = badgeTitle || 'TELEMETRY REPORT';
  if (titleEl) titleEl.textContent = modalTitle || 'HULL SHATTERED';
  if (reasonEl) reasonEl.textContent = reasonText || 'Flight Terminated';
  if (scoreEl) scoreEl.textContent = Math.floor(st.score || 0).toLocaleString();
  if (distEl) distEl.textContent = Math.floor(st.distance || 0) + ' m';
  if (mvpEl) {
    mvpEl.textContent = 'Top Speed: ' + (st.topSpeedReached || 54) +
      ' m/s | V-Hunters Destroyed: ' + (st.huntersDestroyed || 0) +
      ' | Lockdowns Breached: ' + (st.lockdownsBreached || 0) +
      ' | Near-Misses: ' + (st.nearMissCount || 0);
  }
  if (retryBtn) retryBtn.textContent = st.isMultiplayer ? 'SYNCED REMATCH' : 'LAUNCH AGAIN';

  if (window.VF.switchScreen) window.VF.switchScreen('gameover-modal');
  try {
    if (window.VF.AudioEngine) {
      if (isVictory && window.VF.AudioEngine.playVictorySFX) window.VF.AudioEngine.playVictorySFX();
      else if (!isVictory && window.VF.AudioEngine.playGameOverSFX) window.VF.AudioEngine.playGameOverSFX();
    }
  } catch (_) {}
};

// MULTIPLAYER-AWARE CRASH HANDLER: Broadcasts SOLO_PLAYER_SHATTERED & TEAM_SHIELD_SYNC!
window.VF.triggerCrash = function(reason) {
  const st = window.VF.state;
  if (!st || !st.inGame) return;

  if (st.mode === 'MP_TEAM') {
    if (st.invulnTimer > 0) return;
    st.invulnTimer = 2.2;
    window.VF.triggerGoldenHexShieldActivation(2.2);
    window.VF.updateHealthHUD(100);
    const myTeam = String(st.mySeat || '1A').indexOf('1') === 0 ? 1 : 2;
    if (myTeam === 1) st.team1Shields = Math.max(0, (st.team1Shields || 3) - 1);
    else st.team2Shields = Math.max(0, (st.team2Shields || 3) - 1);
    if (window.VF.updateTeamShieldsHUD) window.VF.updateTeamShieldsHUD();

    if (window.VF.NetworkManager) {
      window.VF.NetworkManager.sendPacket({
        type: 'TEAM_SHIELD_SYNC',
        roomCode: st.roomCode,
        t1Shields: st.team1Shields,
        t2Shields: st.team2Shields,
        t1Combo: st.team1Combo,
        t2Combo: st.team2Combo
      });
    }
    if (window.VF.checkTeamShieldElimination && window.VF.checkTeamShieldElimination()) return;
    return;
  }

  st.inGame = false;
  st.crashed = true;
  st.alive = false;
  st.screen = 'GAMEOVER';
  _desktopHoldBoostActive = false;
  window.VF.updateHealthHUD(0);

  if (typeof window.VF.broadcastLocalPlayerState === 'function') {
    window.VF.broadcastLocalPlayerState();
  }

  if (st.mode === 'MP_SOLO' && window.VF.NetworkManager) {
    if (st.soloSlots) {
      st.soloSlots.forEach(function(s) {
        if (s.occupantId === st.localPeerId) s.alive = false;
      });
    }
    window.VF.NetworkManager.sendPacket({
      type: 'SOLO_PLAYER_SHATTERED',
      roomCode: st.roomCode,
      peerId: st.localPeerId,
      reason: reason
    });
  }

  const spec = window.VF.ROCKET_FLEET.find(function(r) { return r.id === st.equippedRocketId; }) || window.VF.ROCKET_FLEET[8];
  window.VF.spawnPooledExplosionRing(st.playerX, st.playerY, -st.distance, spec.colorA);
  window.VF.spawnPooledSparks(st.playerX, st.playerY, -st.distance, spec.colorA, 24);
  if (_playerGroup) _playerGroup.visible = false;
  if (_targetLockBox) _targetLockBox.visible = false;

  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.playCrashSFX) {
      window.VF.AudioEngine.playCrashSFX();
    }
  } catch (_) {}

  setTimeout(function() {
    window.VF.finishMatchModal(
      'TELEMETRY REPORT',
      st.mode === 'MP_SOLO' ? 'SOLO MATCH — SHATTERED' : 'HULL SHATTERED',
      reason || 'Impact with obstacle',
      false
    );
  }, 550);
};
window.VF.handlePlayerImpact = window.VF.triggerCrash;

// ============================================================================
// 9. ENGINE INITIALIZATION (`VF.initEngine`) & DESKTOP DOUBLE-CLICK BOOST
// ============================================================================
window.VF.resizeRenderersImmediate = function() {
  const w = Math.max(280, window.innerWidth || 800);
  const h = Math.max(220, window.innerHeight || 450);
  const maxPR = (window.VF.state && window.VF.state.isMobile) ? 1.25 : 1.75;
  if (_renderer) {
    _renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPR));
    _renderer.setSize(w, h, false);
  }
  if (_camera) {
    const aspect = w / h;
    _camera.aspect = aspect;
    _camera.fov = aspect < 1 ? Math.min(88, 62 / Math.max(0.55, aspect)) : 62;
    window.VF.cameraZOffset = aspect < 1 ? (7.8 + (1 - aspect) * 4.2) : 7.8;
    _camera.updateProjectionMatrix();
  }
  if (typeof window.VF.resizeHangarViewport === 'function') {
    window.VF.resizeHangarViewport();
  }
};
window.addEventListener('resize', window.VF.resizeRenderersImmediate);

window.VF.initEngine = function() {
  const gameCanvas = document.getElementById('game-canvas');
  _renderer = new THREE.WebGLRenderer({
    canvas: gameCanvas,
    antialias: !(window.VF.state && window.VF.state.isMobile),
    powerPreference: 'default',
    alpha: false
  });
  _renderer.toneMapping = THREE.ACESFilmicToneMapping;
  _renderer.toneMappingExposure = 1.06;
  window.VF.renderer = _renderer;

  _scene = new THREE.Scene();
  _scene.fog = new THREE.FogExp2(window.VF.THEMES[0].fog, 0.0035);
  window.VF.scene = _scene;

  _camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 480);
  _camera.position.set(0, -2.2, 7.8);
  window.VF.camera = _camera;
  window.VF.cameraZOffset = 7.8;
  window.VF.baseFov = 62;

  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.90);
  _scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.12);
  dirLight.position.set(10, 22, 18);
  _scene.add(dirLight);
  _chaseLight = new THREE.PointLight(0x00f0ff, 1.55, 95);
  _chaseLight.position.set(0, 2.0, 5);
  _scene.add(_chaseLight);
  _forwardBeamLight = new THREE.PointLight(0xe2e8f0, 1.25, 145);
  _forwardBeamLight.position.set(0, 0, -26);
  _scene.add(_forwardBeamLight);
  _muzzlePointLight = new THREE.PointLight(0x00f0ff, 0, 32);
  _scene.add(_muzzlePointLight);

  const badgeTex = (window.VF.AssetCache && window.VF.AssetCache.vfactorBadgeTexture) || null;
  _wallMetalMat = new THREE.MeshStandardMaterial({ color: window.VF.THEMES[0].wallMetal, metalness: 0.65, roughness: 0.42, side: THREE.DoubleSide });
  _structuralRibMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.78, roughness: 0.30 });
  _turbineBladeMetalMat = new THREE.MeshStandardMaterial({ color: window.VF.THEMES[0].bladeMetal, metalness: 0.82, roughness: 0.22 });
  _bulkheadCoverMat = new THREE.MeshStandardMaterial({ color: window.VF.THEMES[0].bulkheadMetal, metalness: 0.72, roughness: 0.28, emissive: window.VF.THEMES[0].wallMetal, emissiveIntensity: 0.16 });
  _brassHubMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.86, roughness: 0.22 });
  _neonStripMatA = new THREE.MeshBasicMaterial({ color: window.VF.THEMES[0].ringA });
  _neonStripMatB = new THREE.MeshBasicMaterial({ color: window.VF.THEMES[0].ringB });
  _searchlightMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.14, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
  _vFactorBulkheadBadgeMat = new THREE.MeshBasicMaterial({ map: badgeTex, side: THREE.DoubleSide });

  _laserFilamentMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  _laserCoreMat = new THREE.MeshBasicMaterial({
    color: 0xff0044, transparent: true, opacity: 0.94, blending: THREE.AdditiveBlending
  });
  _laserHaloMat = new THREE.MeshBasicMaterial({
    color: 0xff1744, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false
  });
  _emitterLensMat = new THREE.MeshBasicMaterial({ color: 0xff5252 });
  _emitterHousingMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.88, roughness: 0.22 });

  _playerGroup = new THREE.Group();
  window.VF.playerGroup = _playerGroup;
  window.VF.playerRocketGroup = _playerGroup;
  _scene.add(_playerGroup);

  _turbineGroup = new THREE.Group();
  _scene.add(_turbineGroup);
  _droneGroup = new THREE.Group();
  _scene.add(_droneGroup);
  _parallaxLandmarksGroup = new THREE.Group();
  _scene.add(_parallaxLandmarksGroup);
  _projectilesGroup = new THREE.Group();
  _scene.add(_projectilesGroup);
  _debrisGroup = new THREE.Group();
  _scene.add(_debrisGroup);

  const cylWallGeo = new THREE.CylinderGeometry(window.VF.TUNNEL_RADIUS, window.VF.TUNNEL_RADIUS, _WALL_SEG_LEN - 0.22, 48, 1, true);
  cylWallGeo.rotateX(Math.PI / 2);
  const ribFlangeGeo = new THREE.TorusGeometry(window.VF.TUNNEL_RADIUS - 0.18, 0.34, 10, 48);
  const lightRingGeo = new THREE.TorusGeometry(window.VF.TUNNEL_RADIUS - 0.24, 0.10, 8, 48);
  const longPipeGeo = new THREE.CylinderGeometry(0.22, 0.22, _WALL_SEG_LEN - 0.2, 8);
  longPipeGeo.rotateX(Math.PI / 2);

  _tunnelSegments.length = 0;
  for (let i = 0; i < _WALL_SEG_COUNT; i++) {
    const segGroup = new THREE.Group();
    segGroup.add(new THREE.Mesh(cylWallGeo, _wallMetalMat));

    const flange = new THREE.Mesh(ribFlangeGeo, _structuralRibMat);
    flange.position.z = _WALL_SEG_LEN * 0.5;
    segGroup.add(flange);

    segGroup.add(new THREE.Mesh(lightRingGeo, i % 2 === 0 ? _neonStripMatA : _neonStripMatB));

    for (let r = 0; r < 8; r++) {
      const rAng = (r / 8) * Math.PI * 2 + (Math.PI / 8);
      const lPipe = new THREE.Mesh(longPipeGeo, _structuralRibMat);
      lPipe.position.set(Math.cos(rAng) * (window.VF.TUNNEL_RADIUS - 0.22), Math.sin(rAng) * (window.VF.TUNNEL_RADIUS - 0.22), 0);
      segGroup.add(lPipe);
    }

    const worldDist = 45 + (i + 0.5) * _WALL_SEG_LEN;
    segGroup.userData.worldDist = worldDist;
    segGroup.position.z = -worldDist;
    _scene.add(segGroup);
    _tunnelSegments.push(segGroup);
  }

  _initObjectPools();
  _assembleReticleAndLockScope();
  _assembleLockdownMegastructure();
  _constructDroneHunterSquadron();

  const onMouseMove = function(e) {
    const st = window.VF.state;
    if (!st || !st.inGame || st.paused || st.crashed || e.pointerType === 'touch') return;
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    _cursorTargetX = nx * window.VF.MAX_PLAYER_RADIUS * (st.sensitivity || 1.0);
    _cursorTargetY = ny * window.VF.MAX_PLAYER_RADIUS * (st.sensitivity || 1.0);
    _isDesktopCursorActive = true;
    if (_desktopHoldBoostActive && e.buttons !== undefined && (e.buttons & 1) === 0) {
      _desktopHoldBoostActive = false;
      if (window.VF.setBoostingState) window.VF.setBoostingState(false);
    }
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('pointermove', onMouseMove, { passive: true });

  window.addEventListener('contextmenu', function(e) {
    if (window.VF.state && window.VF.state.inGame) e.preventDefault();
  });

  // Strict Desktop Double-Click-and-Hold Boost on #game-canvas (Requires elapsedRunTime > 0.35s)
  window.addEventListener('mousedown', function(e) {
    const st = window.VF.state;
    if (!st || !st.inGame || st.paused || st.crashed || st.isMobile) return;
    if (e.target !== gameCanvas || (st.elapsedRunTime || 0) < 0.35) return;
    if (e.button === 2) {
      window.VF.fireOneShot();
    } else if (e.button === 0) {
      const nowMs = performance.now();
      if (nowMs - _lastDesktopDownTime <= 340) {
        _desktopHoldBoostActive = true;
        if (window.VF.setBoostingState) window.VF.setBoostingState(true);
      }
      _lastDesktopDownTime = nowMs;
    }
  });

  const endDesktopHoldBoost = function() {
    if (_desktopHoldBoostActive) {
      _desktopHoldBoostActive = false;
      if (window.VF.setBoostingState) window.VF.setBoostingState(false);
    }
  };
  window.addEventListener('mouseup', endDesktopHoldBoost);
  window.addEventListener('pointerup', endDesktopHoldBoost);
  window.addEventListener('blur', endDesktopHoldBoost);
  document.addEventListener('mouseleave', endDesktopHoldBoost);

  window.VF.buildIntroLaunchBay();
  window.VF.clearDebrisAndResetExteriorVista();
  window.VF.resizeRenderersImmediate();
};
window.VF.initThreeEngine = window.VF.initEngine;

window.VF.updateAmbientThemeMorph = function(dt) {
  const st = window.VF.state;
  const THEMES = window.VF.THEMES;
  if (!st || !THEMES) return;
  const isMP = st.inGame && (st.mode === 'MP_SOLO' || st.mode === 'MP_TEAM');

  if (isMP && st.hostThemeIdx >= 0) {
    st.themeIdxA = st.hostThemeIdx;
    st.themeIdxB = st.hostThemeIdx;
    st.themeLerp = 0;
  } else {
    st.themeTimer = (st.themeTimer || 0) + dt;
    if (st.themeTimer > 15) {
      st.themeLerp = (st.themeLerp || 0) + dt / 5.0;
      if (st.themeLerp >= 1) {
        st.themeIdxA = st.themeIdxB;
        st.themeIdxB = ((st.themeIdxB || 0) + 1) % THEMES.length;
        st.themeLerp = 0;
        st.themeTimer = 0;
      }
    }
  }

  if (st.inGame && !st.paused && st.distance > 350) {
    st.flickerTimer = (st.flickerTimer || 0) + dt;
    const cycle = st.flickerTimer % 9.5;
    if (cycle > 8.1 && cycle < 8.65) {
      st.lightDimFactor = (Math.sin(_nowTime * 0.08) > 0) ? 0.18 : 0.45;
    } else {
      st.lightDimFactor = window.VF.lerp(st.lightDimFactor || 1.0, 1.0, dt * 8);
    }
  } else {
    st.lightDimFactor = 1.0;
  }

  const tA = THEMES[st.themeIdxA || 0] || THEMES[0];
  const tB = THEMES[st.themeIdxB || 0] || THEMES[0];
  const f = st.themeLerp || 0;

  _colorTmpA.setHex(tA.bg).lerp(_colorTmpB.setHex(tB.bg), f);
  if (_renderer) _renderer.setClearColor(_colorTmpA, 1);

  _colorTmpA.setHex(tA.fog).lerp(_colorTmpB.setHex(tB.fog), f);
  if (_scene && _scene.fog) _scene.fog.color.copy(_colorTmpA);

  _colorTmpA.setHex(tA.wallMetal).lerp(_colorTmpB.setHex(tB.wallMetal), f);
  _wallMetalMat.color.copy(_colorTmpA);
  _bulkheadCoverMat.emissive.copy(_colorTmpA);

  _colorTmpA.setHex(tA.bulkheadMetal).lerp(_colorTmpB.setHex(tB.bulkheadMetal), f);
  _bulkheadCoverMat.color.copy(_colorTmpA);

  _colorTmpA.setHex(tA.bladeMetal).lerp(_colorTmpB.setHex(tB.bladeMetal), f);
  _turbineBladeMetalMat.color.copy(_colorTmpA);

  _colorTmpA.setHex(tA.ringA).lerp(_colorTmpB.setHex(tB.ringA), f).multiplyScalar(st.lightDimFactor);
  _neonStripMatA.color.copy(_colorTmpA);

  _colorTmpA.setHex(tA.ringB).lerp(_colorTmpB.setHex(tB.ringB), f).multiplyScalar(st.lightDimFactor);
  _neonStripMatB.color.copy(_colorTmpA);

  _colorTmpA.setHex(tA.accent).lerp(_colorTmpB.setHex(tB.accent), f);
  _chaseLight.color.copy(_colorTmpA);
  _chaseLight.intensity = 1.45 * st.lightDimFactor;
  _forwardBeamLight.intensity = 1.15 * st.lightDimFactor;
};
window.VF.applyThemeColors = window.VF.updateAmbientThemeMorph;

// ============================================================================
// 10. MAIN 60 FPS FLIGHT, MULTIPLAYER & COLLISION RENDER LOOP (`VF.animate`)
// ============================================================================
window.VF.animate = function(now) {
  requestAnimationFrame(window.VF.animate);
  if (document.hidden) {
    _lastFrameTime = now;
    return;
  }

  const st = window.VF.state;
  if (!st || !_renderer) return;

  if (!st.inGame && !st.inIntro) {
    if (now - _lastMenuRenderTime < 32) return;
    _lastMenuRenderTime = now;
  }

  _nowTime = now;
  const rawDt = Math.min(0.05, Math.max(0.001, (now - _lastFrameTime) / 1000));
  _lastFrameTime = now;

  const hangarScreen = document.getElementById('hangar-screen');
  if (hangarScreen && hangarScreen.classList.contains('active')) {
    if (typeof window.VF.stepHangarTurntable === 'function') {
      window.VF.stepHangarTurntable(rawDt);
    }
    return;
  }

  window.VF.updateAmbientThemeMorph(rawDt);

  if (st.inIntro) {
    if (_reticleGroup) _reticleGroup.visible = false;
    if (_targetLockBox) _targetLockBox.visible = false;
    window.VF.updateIntroChoreography(st.introProgress);
    _renderer.render(_scene, _camera);
    return;
  }

  if (_introGroup) _introGroup.visible = false;
  if (_parallaxLandmarksGroup) _parallaxLandmarksGroup.visible = true;
  if (_turbineGroup) _turbineGroup.visible = true;

  for (let i = 0; i < _sparkPool.length; i++) {
    const sp = _sparkPool[i];
    if (sp.active) {
      sp.life -= rawDt;
      if (sp.life <= 0) {
        sp.active = false;
        sp.mesh.visible = false;
      } else {
        sp.mesh.position.x += sp.vx * rawDt;
        sp.mesh.position.y += sp.vy * rawDt;
        sp.mesh.position.z += sp.vz * rawDt;
        sp.mesh.rotation.x += 3.2 * rawDt;
        sp.mesh.rotation.y += 3.2 * rawDt;
      }
    }
  }
  for (let i = 0; i < _ringPool.length; i++) {
    const rg = _ringPool[i];
    if (rg.active) {
      rg.opacity -= rawDt * 2.2;
      if (rg.opacity <= 0) {
        rg.active = false;
        rg.mesh.visible = false;
      } else {
        rg.mat.opacity = rg.opacity;
        rg.mesh.scale.addScalar(14.0 * rawDt);
      }
    }
  }
  for (let i = _activeBeamEffects.length - 1; i >= 0; i--) {
    const bf = _activeBeamEffects[i];
    bf.life -= rawDt;
    if (bf.life <= 0) {
      _scene.remove(bf.group);
      _activeBeamEffects.splice(i, 1);
    } else {
      const alpha = bf.life / 0.28;
      bf.coreMat.opacity = alpha;
      bf.outerMat.opacity = alpha * 0.85;
      bf.muzzleRing.scale.addScalar(rawDt * 18.0);
    }
  }

  if (!st.inGame || st.paused) {
    if (_reticleGroup) _reticleGroup.visible = false;
    if (_targetLockBox) _targetLockBox.visible = false;
    if (!st.crashed && !st.paused && _playerGroup) {
      _playerGroup.visible = true;
      const hoverX = Math.sin(now * 0.0011) * 0.55;
      const hoverY = -3.0 + Math.cos(now * 0.0015) * 0.35;
      _playerGroup.position.set(hoverX, hoverY, 0);
      _playerGroup.rotation.z = -Math.cos(now * 0.0011) * 0.12;
      _camera.position.set(hoverX * 0.78, hoverY * 0.78 + 1.25, window.VF.cameraZOffset);
      _camera.lookAt(hoverX * 0.85, hoverY * 0.85, window.VF.PORTAL_MOUTH_Z);
    }
    for (let i = 0; i < _turbines.length; i++) {
      const tb = _turbines[i];
      tb.rotorGroup.rotation.z += (tb.rpm || 0.5) * 0.35 * rawDt;
      for (let b = 0; b < tb.uprightBadges.length; b++) {
        tb.uprightBadges[b].rotation.z = -tb.rotorGroup.rotation.z;
      }
    }
    _renderer.render(_scene, _camera);
    return;
  }

  const spec = window.VF.ROCKET_FLEET.find(function(r) { return r.id === st.equippedRocketId; }) || window.VF.ROCKET_FLEET[8];
  const isMultiplayer = (st.mode === 'MP_SOLO' || st.mode === 'MP_TEAM');

  // Ensure Desktop Boost is strictly OFF unless actively double-click-held or Spacebar-held!
  if (!st.isMobile && !_desktopHoldBoostActive && !(st.keys && st.keys.Space)) {
    if (st.boosting || st.boostToggledOn) {
      window.VF.setBoostingState(false);
    }
  }
  const isBoosting = Boolean(st.boosting || st.boostToggledOn);

  if (st.invulnTimer > 0) {
    st.invulnTimer = Math.max(0, st.invulnTimer - rawDt);
    _playerGroup.visible = (Math.floor(now * 0.025) % 2 === 0);
  } else {
    _playerGroup.visible = true;
  }

  if (st.muzzleFlashTimer > 0) {
    st.muzzleFlashTimer -= rawDt;
    if (st.muzzleFlashTimer <= 0 && _muzzlePointLight) _muzzlePointLight.intensity = 0;
  }
  if (st.recoilOffsetZ > 0) st.recoilOffsetZ = Math.max(0, st.recoilOffsetZ - rawDt * 2.4);
  if (st.weaponCooldown > 0) st.weaponCooldown = Math.max(0, st.weaponCooldown - rawDt);
  if (st.speedDebuffTimer > 0) st.speedDebuffTimer = Math.max(0, st.speedDebuffTimer - rawDt);
  if (st.freezeTurbineTimer > 0) st.freezeTurbineTimer = Math.max(0, st.freezeTurbineTimer - rawDt);
  if (st.goldenShieldTimer > 0) st.goldenShieldTimer = Math.max(0, st.goldenShieldTimer - rawDt);
  if (st.hyperShieldTimer > 0) st.hyperShieldTimer = Math.max(0, st.hyperShieldTimer - rawDt);
  if (st.barrelRollTimer > 0) st.barrelRollTimer = Math.max(0, st.barrelRollTimer - rawDt);

  let stepDist = 0;
  let rampProgress = 1.0;
  const debuffMult = st.speedDebuffTimer > 0 ? 0.68 : 1.0;

  if (isMultiplayer) {
    const elapsedSec = Math.max(0, (Date.now() - (st.matchStartTimestamp || Date.now())) / 1000);
    st.elapsedRunTime = elapsedSec;
    rampProgress = Math.min(1.0, elapsedSec / 4.0);
    const targetTotalDist = window.VF.computeDeterministicBaseMeters(elapsedSec) + (st.boostBonusMeters || 0);
    stepDist = Math.max(0, targetTotalDist - st.distance);
    st.distance = targetTotalDist;
    st.currentSpeed = (window.VF.BASE_MP_SPEED || 40) * (0.35 + 0.65 * rampProgress) * (isBoosting ? 1.48 : 1.0);
  } else {
    st.elapsedRunTime = (st.elapsedRunTime || 0) + rawDt;
    rampProgress = Math.min(1.0, st.elapsedRunTime / 4.0);
    const smoothRamp = 0.38 + 0.62 * rampProgress;
    const gradualDistanceAccel = 1.0 + 0.038 * (st.distance / 500.0) + 0.25 * (1.0 - Math.exp(-st.distance / 3600.0));
    const baseCruise = spec.speed * 4.35 * smoothRamp * debuffMult * Math.min(2.2, gradualDistanceAccel);
    const targetSpeed = baseCruise * (isBoosting ? 1.52 : 1.0);
    st.currentSpeed = (st.currentSpeed || 34) + (targetSpeed - (st.currentSpeed || 34)) * Math.min(1, rawDt * 5.5);
    stepDist = st.currentSpeed * rawDt;
    st.distance += stepDist;
  }

  st.topSpeedReached = Math.max(st.topSpeedReached || 0, Math.round(st.currentSpeed));
  st.comboMultiplier = Number((1.0 + Math.min(3.0, st.distance / 1500)).toFixed(1));

  const comboBadgeEl = document.getElementById('hud-combo-badge');
  if (comboBadgeEl) comboBadgeEl.textContent = st.comboMultiplier.toFixed(1) + 'x AERO STREAK';

  if (st.slowMoTimer > 0) st.slowMoTimer -= rawDt;
  const distanceSpinScale = 1.0 + Math.min(0.65, st.distance / 6000.0);
  const worldTimeScale = st.freezeTurbineTimer > 0 ? 0.0 : ((st.slowMoTimer > 0 ? 0.42 : 1.0) * distanceSpinScale);

  const keys = (st && st.keys) || window.VF.keys || {};
  const steerRate = (11.5 - spec.width * 1.6) * (st.sensitivity || 1.0);
  const hasDirectKeyOrStick = Boolean(
    keys.left || keys.right || keys.up || keys.down ||
    (st.inputX && Math.abs(st.inputX) > 0.05) ||
    (st.inputY && Math.abs(st.inputY) > 0.05)
  );

  if (!hasDirectKeyOrStick && _isDesktopCursorActive) {
    st.targetX = _cursorTargetX;
    st.targetY = _cursorTargetY;
  } else {
    if (hasDirectKeyOrStick) _isDesktopCursorActive = false;
    if (keys.left) st.targetX -= steerRate * rawDt * 1.5;
    if (keys.right) st.targetX += steerRate * rawDt * 1.5;
    if (keys.up) st.targetY += steerRate * rawDt * 1.5;
    if (keys.down) st.targetY -= steerRate * rawDt * 1.5;
    if (st.inputX) st.targetX += st.inputX * steerRate * rawDt * 1.5;
    if (st.inputY) st.targetY += st.inputY * steerRate * rawDt * 1.5;
    if (st.isMobile && st.gyroEnabled && st.gyroBaseGamma !== null && !hasDirectKeyOrStick) {
      st.targetX = st.gyroCurrentX * window.VF.MAX_PLAYER_RADIUS * st.sensitivity;
      st.targetY = st.gyroCurrentY * window.VF.MAX_PLAYER_RADIUS * st.sensitivity;
    }
  }

  st.targetX += (st.knockbackVx || 0) * rawDt;
  st.targetY += (st.knockbackVy || 0) * rawDt;
  st.knockbackVx = (st.knockbackVx || 0) * Math.pow(0.08, rawDt);
  st.knockbackVy = (st.knockbackVy || 0) * Math.pow(0.08, rawDt);

  const curRad = Math.hypot(st.targetX, st.targetY);
  if (curRad > window.VF.MAX_PLAYER_RADIUS) {
    st.targetX = (st.targetX / curRad) * window.VF.MAX_PLAYER_RADIUS;
    st.targetY = (st.targetY / curRad) * window.VF.MAX_PLAYER_RADIUS;
  }

  const prevPlayerX = st.playerX || 0;
  const prevPlayerY = st.playerY !== undefined ? st.playerY : -3.0;
  st.playerX = window.VF.lerp(prevPlayerX, st.targetX, Math.min(1, rawDt * 11.5));
  st.playerY = window.VF.lerp(prevPlayerY, st.targetY, Math.min(1, rawDt * 11.5));
  st.velX = (st.playerX - prevPlayerX) / Math.max(0.008, rawDt);
  st.velY = (st.playerY - prevPlayerY) / Math.max(0.008, rawDt);

  const rollAdd = st.barrelRollTimer > 0 ? (1.0 - st.barrelRollTimer / 0.62) * Math.PI * 2 * (st.barrelRollDir || 1) : 0;
  st.playerTilt = -(st.targetX - st.playerX) * 0.22 + rollAdd;

  const shipWorldZ = -st.distance;
  _playerGroup.position.set(st.playerX, st.playerY, shipWorldZ + (st.recoilOffsetZ || 0));
  _playerGroup.rotation.z = st.playerTilt;
  _playerGroup.rotation.x = (st.targetY - st.playerY) * 0.14;

  if (typeof window.VF.updateSpacecraftCinematicRig === 'function') {
    window.VF.updateSpacecraftCinematicRig(_playerGroup, rawDt, st);
  }

  const camLerp = Math.min(1, rawDt * 10.5);
  _camera.position.x = window.VF.lerp(_camera.position.x, st.playerX * 0.78, camLerp);
  _camera.position.y = window.VF.lerp(_camera.position.y, st.playerY * 0.78 + 1.15, camLerp);
  _camera.position.z = shipWorldZ + window.VF.cameraZOffset;
  _camera.lookAt(st.playerX * 0.85, st.playerY * 0.85, shipWorldZ - 25);

  if (st.fovPunch > 0) {
    st.fovPunch = Math.max(0, st.fovPunch - rawDt * 14.0);
    _camera.fov = (window.VF.baseFov || 62) + st.fovPunch;
    _camera.updateProjectionMatrix();
  }

  _chaseLight.position.set(st.playerX * 0.8, st.playerY * 0.8 + 2.0, shipWorldZ + 5.0);
  _forwardBeamLight.position.set(st.playerX * 0.5, st.playerY * 0.5, shipWorldZ - 24.0);

  const myCombo = st.mode === 'MP_TEAM'
    ? ((String(st.mySeat || '1A').indexOf('1') === 0 ? st.team1Combo : st.team2Combo) || 1)
    : st.comboMultiplier;
  st.score += stepDist * (isBoosting ? 2.4 : 1.2) * myCombo;

  try {
    if (window.VF.AudioEngine && window.VF.AudioEngine.updateThruster) {
      window.VF.AudioEngine.updateThruster(rampProgress, isBoosting);
    }
  } catch (_) {}
  if (window.VF.updateShipStatusHUD) window.VF.updateShipStatusHUD();

  // Smoothly Interpolate & Render All Remote Multiplayer Ships in 3D World Space
  if (isMultiplayer) {
    window.VF.remotePlayers.forEach(function(rp) {
      if (!rp.alive) {
        rp.mesh.visible = false;
        return;
      }
      rp.targetVec.set(rp.targetX, rp.targetY, rp.targetZ);
      rp.mesh.position.lerp(rp.targetVec, 0.35);
      rp.mesh.rotation.z = window.VF.lerp(rp.mesh.rotation.z, rp.tilt || 0, 0.25);
      rp.haloMesh.rotation.z += rawDt * 2.4;
      rp.mesh.visible = (rp.mesh.position.z < _camera.position.z - 1.0 && rp.mesh.position.z > shipWorldZ - 280);
    });
  }

  // Step One-Shot Projectiles (Checks Lockdown Wall Breach, Rival Hits & Turbine Sparks)
  for (let i = 0; i < _oneShotPool.length; i++) {
    const p = _oneShotPool[i];
    if (!p.active) continue;
    p.z += p.vz * rawDt;
    p.mesh.position.z = p.z;
    p.mesh.rotation.z += rawDt * 9.0;

    if (!p.isRemoteVisual && _lockdownWallState.active && !_lockdownWallState.cleared && Math.abs(p.z - (-_lockdownWallState.milestoneDistance)) < 12.0) {
      if (Math.hypot(p.x, p.y) <= 6.2) {
        window.VF.breachLockdownGateWithOneShot();
        p.active = false;
        p.mesh.visible = false;
        continue;
      }
    }

    if (p.active && !p.isRemoteVisual && isMultiplayer) {
      const myTeam = typeof window.VF.getMyTeamNumber === 'function' ? window.VF.getMyTeamNumber() : 1;
      window.VF.remotePlayers.forEach(function(rp) {
        if (!p.active || !rp.alive) return;
        if (st.mode === 'MP_TEAM' && rp.team === myTeam) return;
        if (Math.abs(p.z - rp.mesh.position.z) < 4.5 && Math.hypot(p.x - rp.mesh.position.x, p.y - rp.mesh.position.y) < 3.0) {
          window.VF.spawnPooledExplosionRing(rp.mesh.position.x, rp.mesh.position.y, rp.mesh.position.z, p.color);
          p.active = false;
          p.mesh.visible = false;
          st.score += 500;
          if (window.VF.NetworkManager) {
            window.VF.NetworkManager.sendPacket({
              type: 'WEAPON_HIT',
              roomCode: st.roomCode,
              targetPeerId: rp.peerId,
              weaponType: p.weaponType,
              damage: p.damage
            });
          }
          if (window.VF.showHudAlert) {
            window.VF.showHudAlert('ONE-SHOT DIRECT HIT ON ' + rp.slotLabel + '! (+500 PTS)', '#00ff88', 1800);
          }
        }
      });
    }

    for (let tIdx = 0; tIdx < _turbines.length; tIdx++) {
      const tb = _turbines[tIdx];
      if (!tb.isLaserRing && tb.group.visible && Math.abs(p.z - tb.group.position.z) < 1.35) {
        window.VF.spawnPooledSparks(p.x, p.y, p.z, p.color, 10);
        p.active = false;
        p.mesh.visible = false;
        break;
      }
    }
    if (p.active && p.z < shipWorldZ - 240) {
      p.active = false;
      p.mesh.visible = false;
    }
  }

  // Full-Tunnel 36-Beam Laser Lockdown Wall Logic
  if (!_lockdownWallState.active) {
    for (let mIdx = 0; mIdx < _LOCKDOWN_MILESTONES.length; mIdx++) {
      const mDist = _LOCKDOWN_MILESTONES[mIdx];
      if (st.distance >= mDist - 220 && st.distance < mDist - 10) {
        _lockdownWallState.active = true;
        _lockdownWallState.cleared = false;
        _lockdownWallState.overcharged = false;
        _lockdownWallState.milestoneDistance = mDist;
        _lockdownGroup.position.z = -mDist;
        _lockdownGroup.visible = true;
        const btn = _lockdownGroup.getObjectByName('redBtnCore');
        if (btn) btn.visible = true;
        break;
      }
    }
  }

  const distToLockdown = _lockdownWallState.active ? (_lockdownWallState.milestoneDistance - st.distance) : 99999;
  if (_lockdownWallState.active) {
    if (!_lockdownWallState.cleared && distToLockdown > 0 && distToLockdown <= 145 && !_lockdownWallState.overcharged) {
      _lockdownWallState.overcharged = true;
      st.weaponOvercharged = true;
      st.weaponCooldown = 0;
      if (window.VF.updateShipStatusHUD) window.VF.updateShipStatusHUD();
      if (window.VF.showCombatAlert) {
        window.VF.showCombatAlert('LOCKDOWN WALL (135m) — LOCK V-SIGHT ON CENTER RED BUTTON (0, 0) & FIRE!', false, 2800);
      }
    }
    if (!_lockdownWallState.cleared && Math.abs(_lockdownWallState.milestoneDistance - st.distance) < 1.25) {
      window.VF.triggerCrash('Sliced by Full-Tunnel Laser Lockdown Barrier!');
      return;
    }
    if (st.distance > _lockdownWallState.milestoneDistance + 18) {
      _lockdownWallState.active = false;
      _lockdownGroup.visible = false;
    }
  }

  // ==========================================================================
  // PREDICTIVE BALLISTIC AI V-HUNTER DRONE SQUADRON
  // ==========================================================================
  if (!window.VF.hasAnyActiveDrone() && distToLockdown > 250 && (st.distance % 1250) > 380 && (st.distance % 1250) < 820) {
    window.VF.spawnWhiteDroneSquadronAtDistance(st.distance);
  }

  let anyDrone = false;
  for (let i = 0; i < _drones.length; i++) {
    const d = _drones[i];
    if (!d.userData.active) continue;
    anyDrone = true;
    d.visible = true;

    if (distToLockdown <= 190 && !d.userData.peelingOff) {
      d.userData.peelingOff = true;
      if (d.userData.aimLaserMesh) d.userData.aimLaserMesh.visible = false;
      try {
        if (window.VF.AudioEngine && window.VF.AudioEngine.playSonicBoomSFX) {
          window.VF.AudioEngine.playSonicBoomSFX();
        }
      } catch (_) {}
    }

    if (d.userData.peelingOff) {
      d.position.y += 26 * rawDt;
      d.position.z -= 48 * rawDt;
      if (d.position.y > 22) {
        d.userData.active = false;
        d.visible = false;
      }
      continue;
    }

    d.userData.spawnTimer = (d.userData.spawnTimer || 0) + rawDt;
    if (d.userData.jinkCooldown > 0) d.userData.jinkCooldown -= rawDt;

    if (d.userData.spawnTimer < 0.65) {
      const warpP = Math.min(1.0, d.userData.spawnTimer / 0.65);
      const easeWarp = warpP * (2 - warpP);
      d.scale.setScalar(0.12 + 1.30 * easeWarp);
      if (d.userData.spawnRingsGroup) {
        d.userData.spawnRingsGroup.visible = true;
        d.userData.spawnRingsGroup.scale.setScalar(1.8 * (1.0 - warpP * 0.65));
        if (d.userData.spawnRing1) d.userData.spawnRing1.rotation.z += rawDt * 8.0;
        if (d.userData.spawnRing2) d.userData.spawnRing2.rotation.z -= rawDt * 6.0;
      }
    } else {
      d.scale.setScalar(1.42);
      if (d.userData.spawnRingsGroup) d.userData.spawnRingsGroup.visible = false;
    }

    // 2.0-Second Post-Fire Slowdown Window
    let isSlowedAfterFiring = false;
    if (d.userData.postFireSlowTimer > 0) {
      d.userData.postFireSlowTimer = Math.max(0, d.userData.postFireSlowTimer - rawDt);
      isSlowedAfterFiring = true;
      if (d.userData.lockHaloMat) d.userData.lockHaloMat.color.setHex(0xffaa00);
    } else {
      if (d.userData.lockHaloMat) d.userData.lockHaloMat.color.setHex(0x00f0ff);
    }

    // 3D Gimbal Turret Tracking & Predictive Firing
    if (!isSlowedAfterFiring && d.userData.spawnTimer > 0.70 && distToLockdown > 190) {
      d.userData.fireTimer -= rawDt;
      if (d.userData.turretGimbalGroup) {
        d.userData.turretGimbalGroup.lookAt(st.playerX, st.playerY, shipWorldZ);
      }
      if (d.userData.aimLaserMesh) {
        d.userData.aimLaserMesh.visible = (d.userData.fireTimer > 0 && d.userData.fireTimer <= 0.50);
      }
      if (d.userData.fireTimer <= 0) {
        _fireDronePlasmaFromDrone(d, i % 2 === 1);
        d.userData.fireTimer = 1.85 + i * 0.55 + Math.random() * 0.45;
      }
    }

    const brain = d.userData.aiBrain;
    brain.waypointTimer -= rawDt;
    if (brain.waypointTimer <= 0 && !isSlowedAfterFiring) {
      brain.waypointTimer = 0.70 + Math.random() * 0.55;
      // Adaptive Stalking: Bias waypoints toward player's quadrant while weaving!
      const randAngle = Math.random() * Math.PI * 2;
      const randRad = 2.4 + Math.random() * 4.8;
      brain.waypointX = st.playerX * 0.45 + Math.cos(randAngle) * randRad;
      brain.waypointY = st.playerY * 0.45 + Math.sin(randAngle) * randRad;
    }

    const aimDist = Math.hypot(d.position.x - st.playerX, d.position.y - st.playerY);
    if (!isSlowedAfterFiring && aimDist < 3.1 && d.userData.jinkCooldown <= 0 && d.userData.spawnTimer > 0.75) {
      d.userData.jinkCooldown = 0.72;
      const dodgeAngle = Math.atan2(d.position.y - st.playerY, d.position.x - st.playerX) + brain.orbitSign * 1.15;
      d.userData.jinkVx = Math.cos(dodgeAngle) * 22.5;
      d.userData.jinkVy = Math.sin(dodgeAngle) * 22.5;
    }

    d.userData.jinkVx = (d.userData.jinkVx || 0) * Math.pow(0.05, rawDt);
    d.userData.jinkVy = (d.userData.jinkVy || 0) * Math.pow(0.05, rawDt);

    let sepX = 0;
    let sepY = 0;
    for (let j = 0; j < _drones.length; j++) {
      if (i === j || !_drones[j].userData.active) continue;
      const dx = d.position.x - _drones[j].position.x;
      const dy = d.position.y - _drones[j].position.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 18.0 && distSq > 0.01) {
        const invD = 1.0 / Math.sqrt(distSq);
        sepX += dx * invD * 5.5;
        sepY += dy * invD * 5.5;
      }
    }

    const orbitX = Math.sin(now * brain.freqX + brain.phaseX) * 4.2 * brain.orbitSign;
    const orbitY = Math.cos(now * brain.freqY + brain.phaseY) * 3.5;
    const desiredX = Math.max(-9.4, Math.min(9.4, brain.waypointX + orbitX + sepX));
    const desiredY = Math.max(-9.4, Math.min(9.4, brain.waypointY + orbitY + sepY));

    const aiAgilityMult = isSlowedAfterFiring ? 0.22 : 1.0;
    const prevX = d.position.x;
    d.position.x = window.VF.lerp(d.position.x, desiredX, rawDt * 6.5 * aiAgilityMult) + d.userData.jinkVx * rawDt * aiAgilityMult;
    d.position.y = window.VF.lerp(d.position.y, desiredY, rawDt * 6.5 * aiAgilityMult) + d.userData.jinkVy * rawDt * aiAgilityMult;

    const targetDroneZ = shipWorldZ - 34.0 - (i % 2) * 3.0;
    d.position.z = window.VF.lerp(d.position.z, targetDroneZ, rawDt * 4.8);
    d.rotation.z = Math.max(-0.75, Math.min(0.75, -(d.position.x - prevX) / Math.max(0.008, rawDt) * 0.048));
  }

  // Step Predictive Plasma Bolts & Check Player Impact
  for (let i = 0; i < _droneBolts.length; i++) {
    const b = _droneBolts[i];
    if (!b.userData.active) continue;
    const prevBoltZ = b.position.z;
    b.position.x += (b.userData.vx || 0) * rawDt;
    b.position.y += (b.userData.vy || 0) * rawDt;
    b.position.z += b.userData.vz * rawDt;

    const crossedPlayerZ = (prevBoltZ <= shipWorldZ + 1.4 && b.position.z >= shipWorldZ - 1.4);
    if (!b.userData.interacted && crossedPlayerZ) {
      const hd = Math.hypot(b.position.x - st.playerX, b.position.y - st.playerY);
      if (hd < 1.35 && st.invulnTimer <= 0 && st.hyperShieldTimer <= 0) {
        b.userData.interacted = true;
        b.userData.active = false;
        b.visible = false;
        window.VF.triggerGoldenHexShieldActivation(1.45);
        if (st.health > 50) {
          window.VF.updateHealthHUD(50);
          if (window.VF.showCombatAlert) {
            window.VF.showCombatAlert('PLASMA IMPACT! GOLDEN SHIELD DEPLOYED · HEALTH 50%!', false, 2000);
          }
        } else {
          window.VF.triggerCrash('Shattered by V-Hunter Plasma Volley!');
          return;
        }
      } else if (hd < 2.85 && st.invulnTimer <= 0 && st.hyperShieldTimer <= 0) {
        b.userData.interacted = true;
        b.userData.active = false;
        b.visible = false;
        window.VF.triggerGoldenHexShieldActivation(1.45);
        st.droneHitCount = Math.min(6, (st.droneHitCount || 0) + 1);
        window.VF.updateDroneStatusHUD();
        if (window.VF.showHudAlert) {
          window.VF.showHudAlert('PLASMA WAKE GRAZE (' + st.droneHitCount + '/6)', '#ffaa00', 1200);
        }
      }
    }
    if (b.position.z > _camera.position.z + 5) {
      b.userData.active = false;
      b.visible = false;
    }
  }

  // 500m Parallax Landmarks & Tunnel Wall Recycling
  const newStage = Math.floor(st.distance / 500);
  if (newStage > (st.current500mStage || 0)) {
    st.current500mStage = newStage;
    if (!isMultiplayer && st.hostThemeIdx < 0) {
      st.themeIdxA = st.themeIdxB;
      st.themeIdxB = ((st.themeIdxB || 0) + 1) % window.VF.THEMES.length;
      st.themeLerp = 0;
    }
  }
  for (let i = 0; i < _parallaxMidMeshes.length; i++) {
    const pm = _parallaxMidMeshes[i];
    pm.mesh.position.x = -_camera.position.x * pm.factor;
    pm.mesh.position.y = -_camera.position.y * pm.factor;
  }
  for (let i = 0; i < _tunnelSegments.length; i++) {
    const seg = _tunnelSegments[i];
    if (seg.position.z > _camera.position.z + 10) {
      seg.userData.worldDist += _WALL_SEG_COUNT * _WALL_SEG_LEN;
      seg.position.z = -seg.userData.worldDist;
    }
    seg.visible = !window.VF.isDistanceInParallaxGap(seg.userData.worldDist);
  }

  // Obstacles: Multi-Chord Laser Rings & Zero-Overlap Sculpted Turbines
  const shipZHalf = spec.length * 0.34;
  const shipHitRadius = spec.width * 0.32;

  for (let i = 0; i < _turbines.length; i++) {
    const t = _turbines[i];
    t.group.position.z = -t.worldDist;

    const blockedByLockdown = Boolean(
      _lockdownWallState.active &&
      !_lockdownWallState.cleared &&
      Math.abs(t.worldDist - _lockdownWallState.milestoneDistance) < 160.0
    );
    if (blockedByLockdown) {
      t.group.visible = false;
      t.passed = true;
      continue;
    }

    t.group.visible = !(t.group.position.z > _playerGroup.position.z - 0.2);
    const zDiff = t.group.position.z - shipWorldZ;

    if (t.isLaserRing) {
      if (!t.passed && Math.abs(zDiff) < shipZHalf + 0.42 && st.invulnTimer <= 0 && st.hyperShieldTimer <= 0) {
        for (let s = 0; s < t.laserSegments.length; s++) {
          const seg = t.laserSegments[s];
          const distToBeam = window.VF.pointToSegmentDist2D(st.playerX, st.playerY, seg.x1, seg.y1, seg.x2, seg.y2);
          if (distToBeam < shipHitRadius + 0.14) {
            window.VF.triggerCrash('Sliced by Circular Wall Security Laser Beam!');
            return;
          } else if (distToBeam < shipHitRadius + 0.90 && !t.grazeAwarded) {
            t.grazeAwarded = true;
            window.VF.triggerGoldenHexShieldActivation(0.85);
            st.score += 250;
            st.nearMissCount = (st.nearMissCount || 0) + 1;
            if (window.VF.showHudAlert) window.VF.showHudAlert('+250 LASER GRAZE!', '#00f0ff', 900);
          }
        }
      }
      if (!t.passed && zDiff > shipZHalf + 0.5) {
        t.passed = true;
        st.score += 150 * myCombo;
      }
    } else {
      if (t.hasSpeedShiftTrap && !t.speedShiftTriggered && zDiff > -45) {
        t.speedShiftTriggered = true;
        t.rpm = t.baseRpm * t.speedShiftMult;
      }
      if (t.trapRingMesh) {
        t.trapRingMesh.visible = (Math.floor(now * 0.015) % 2 === 0);
      }

      t.rotorGroup.rotation.z += t.rpm * worldTimeScale * rawDt;
      for (let b = 0; b < t.uprightBadges.length; b++) {
        t.uprightBadges[b].rotation.z = -t.rotorGroup.rotation.z;
      }

      if (zDiff > -65 && st.freezeTurbineTimer <= 0) {
        for (let s = 0; s < t.shutters.length; s++) {
          const sh = t.shutters[s];
          if (sh.isClosing && sh.progress < 1.0) {
            sh.progress = Math.min(1.0, sh.progress + rawDt * 0.85 * worldTimeScale);
            sh.mesh.scale.set(sh.progress, sh.progress, 1);
          }
        }
      }

      if (!t.passed && Math.abs(zDiff) < shipZHalf + 0.40 && st.invulnTimer <= 0 && st.hyperShieldTimer <= 0) {
        const r = Math.hypot(st.playerX, st.playerY);
        if (r < t.hubRadius + spec.width * 0.24) {
          window.VF.triggerCrash('Central Metallic Spinner Hub Impact');
          return;
        }

        let relAngle = (Math.atan2(st.playerY, st.playerX) - t.rotorGroup.rotation.z) % (Math.PI * 2);
        if (relAngle < 0) relAngle += Math.PI * 2;
        const shipAngMargin = (spec.width * 0.26) / Math.max(2.6, r);

        for (let b = 0; b < t.bladeCount; b++) {
          const diff = window.VF.angleDiff(relAngle, t.bladeAngles[b]);
          if (diff < t.bladeHalfWidth + shipAngMargin) {
            window.VF.triggerCrash('Ducted Metal Propeller Blade Impact');
            return;
          } else if (diff < t.bladeHalfWidth + shipAngMargin + 0.14 && !t.grazeAwarded) {
            t.grazeAwarded = true;
            window.VF.triggerGoldenHexShieldActivation(0.85);
            st.score += 250 * myCombo;
            st.nearMissCount = (st.nearMissCount || 0) + 1;
            if (window.VF.showHudAlert) window.VF.showHudAlert('+250 BLADE GRAZE!', '#fbbf24', 900);
          }
        }

        for (let s = 0; s < t.shutters.length; s++) {
          const sh = t.shutters[s];
          const activeOuterRadius = window.VF.TUNNEL_RADIUS * sh.progress;
          if (r <= activeOuterRadius && relAngle >= sh.startAng && relAngle <= sh.endAng) {
            window.VF.triggerCrash('V-FACTOR Armored Metal Sector Bulkhead Impact');
            return;
          }
        }
      }

      if (!t.passed && zDiff > shipZHalf + 0.45) {
        t.passed = true;
        st.score += 250 * myCombo;

        if (st.mode === 'SHIFT' && t.logicGapColor !== 'NONE') {
          const nextT = _turbines[(i + 1) % _turbines.length];
          const durMult = spec.id === 31 ? 1.35 : 1.0;
          if (t.logicGapColor === 'GOLD') {
            st.freezeTurbineTimer = 3.0 * durMult;
            if (window.VF.showHudAlert) window.VF.showHudAlert('GOLD GATE — TURBINES FROZEN 3.0S!', '#fbbf24', 1800);
          } else if (t.logicGapColor === 'VIOLET' && nextT && !nextT.isLaserRing) {
            nextT.rpm *= -1;
            if (window.VF.showHudAlert) window.VF.showHudAlert('VIOLET GATE — TURBINE ROTATION REVERSED!', '#c084fc', 1800);
          } else if (t.logicGapColor === 'CYAN') {
            st.slowMoTimer = 2.5 * durMult;
            if (window.VF.showHudAlert) window.VF.showHudAlert('CYAN GATE — 2.5S TIME DILATION!', '#00f0ff', 1800);
          }
        }
      }
    }

    if (zDiff > 8.5) {
      let maxWorldDist = 0;
      for (let k = 0; k < _turbines.length; k++) {
        if (_turbines[k].worldDist > maxWorldDist) maxWorldDist = _turbines[k].worldDist;
      }
      const nextIdx = t.index + _turbines.length;
      _turbineGroup.remove(t.group);
      _turbines[i] = window.VF.createTurbine(maxWorldDist + window.VF.getCurrentTrapSpacing(maxWorldDist), nextIdx);
    }
  }

  let reticleLocked = false;
  let lockTargetPos = null;

  if (_lockdownWallState.active && !_lockdownWallState.cleared && distToLockdown > 0 && distToLockdown <= 175) {
    if (Math.hypot(st.playerX, st.playerY) <= 5.5) {
      reticleLocked = true;
      lockTargetPos = new THREE.Vector3(0, 0, -_lockdownWallState.milestoneDistance);
    }
  }
  if (!reticleLocked && anyDrone) {
    for (let i = 0; i < _drones.length; i++) {
      const d = _drones[i];
      if (d.userData.active && !d.userData.peelingOff && Math.hypot(d.position.x - st.playerX, d.position.y - st.playerY) <= 3.1) {
        reticleLocked = true;
        lockTargetPos = d.position;
        break;
      }
    }
  }
  _updateReticleSight(rawDt, now, reticleLocked, lockTargetPos, spec);

  const scoreEl = document.getElementById('hud-score') || document.getElementById('hud-score-val');
  const distEl = document.getElementById('hud-distance') || document.getElementById('hud-dist-val');
  const progEl = document.getElementById('hud-race-progress-fill') || document.getElementById('hud-top-progress-fill');
  if (scoreEl) scoreEl.textContent = Math.floor(st.score || 0).toLocaleString();
  if (distEl) distEl.textContent = Math.floor(st.distance || 0) + ' m';
  if (progEl) {
    const goal = isMultiplayer ? (st.targetWinDistance || 1500) : 1500;
    progEl.style.width = Math.min(100, ((st.distance % goal) / goal) * 100).toFixed(1) + '%';
  }

  _renderer.render(_scene, _camera);
};