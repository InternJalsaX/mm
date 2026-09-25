/* ==========================================================================
   MM MOTORS — 3D SHOWROOM STAGE

   Geometry is generated in the browser from a side profile, so there is no
   model to download: the whole scene costs one three.js chunk and nothing else.
   That keeps the Brand Bible's performance promise (§40) while still answering
   "what is it / how does it work / why does it matter" (§24).

   Budget, enforced here and in machine.js:
   - one renderer per page, ever
   - no shadow maps — the contact shadow is a baked radial gradient
   - pixel ratio capped
   - setAnimationLoop stopped whenever the section is off-screen
   ========================================================================== */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* Side profile, clockwise, in metres. Ground is y = 0.
   The notch between the seat front and the apron is the step-through floor —
   the defining feature of a scooter, so it is modelled, not smoothed away. */
const PROFILE = [
  /* upper surface, rear to front: tail, seat, step-through notch, deck, apron */
  [-0.88, 0.50], [-0.93, 0.68], [-0.84, 0.82], [-0.22, 0.78],
  [-0.14, 0.52], [ 0.32, 0.50], [ 0.48, 0.64], [ 0.56, 0.92],
  [ 0.60, 1.06], [ 0.76, 1.02], [ 0.72, 0.72],
  /* underside, front to rear. It rides HIGH over each wheel and dips low
     between them: that clearance is what lets the wheels read as wheels
     instead of disappearing inside the bodywork. */
  [ 0.64, 0.52], [ 0.46, 0.38], [-0.10, 0.30], [-0.42, 0.36], [-0.62, 0.52],
];

const MOTO_PROFILE = [
  [-0.86, 0.52], [-0.90, 0.72], [-0.30, 0.74], [-0.04, 0.86],
  [ 0.30, 0.90], [ 0.46, 0.82], [ 0.56, 0.96], [ 0.66, 0.94],
  [ 0.60, 0.72], [ 0.42, 0.58], [ 0.10, 0.52], [-0.30, 0.50],
];

/* A real scooter body is ~0.40 m across at its widest. 0.30 reads as a solid
   object from three-quarter view without the extrusion looking like a slab. */
const WIDTH = 0.30;

function profileShape(points) {
  const s = new THREE.Shape();
  s.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) s.lineTo(points[i][0], points[i][1]);
  s.closePath();
  return s;
}

/* Soft contact shadow as a texture — cheaper and calmer than a shadow map */
function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.45, 'rgba(0,0,0,0.22)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export async function createScene({ container, vehicle, mode = 'story' }) {
  /* ---------------- renderer ---------------- */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 900 ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = mode === 'viewer' ? 'pan-y' : 'auto';
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);

  /* The vehicle faces +X and its detail lives in the XY profile, so the camera
     sits mostly on +Z and looks across the flank. A camera near the +X axis
     stares down the nose and reduces the whole machine to its cross-section. */
  const AZIMUTH = 1.12; // radians from +X — a flank-led three-quarter
  camera.position.set(Math.cos(AZIMUTH) * 3, 1.05, Math.sin(AZIMUTH) * 3);

  /* ---------------- environment ---------------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(2.6, 3.4, 2.2);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffd9c4, 0.9);
  rim.position.set(-2.8, 1.6, -2.0);
  scene.add(rim);

  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  /* ---------------- materials ---------------- */
  const paintMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(vehicle.colours?.[0]?.paint || '#C8CCD2'),
    metalness: 0.42,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.15,
    transparent: true,
  });
  const rubberMat = new THREE.MeshStandardMaterial({
    color: 0x15171a, metalness: 0.1, roughness: 0.85, transparent: true,
  });
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xb4bac1, metalness: 0.95, roughness: 0.24, transparent: true,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x24272c, metalness: 0.5, roughness: 0.5, transparent: true,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xff4b12, metalness: 0.2, roughness: 0.4,
    emissive: 0xff4b12, emissiveIntensity: 0.25, transparent: true,
  });
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xf6f2e9, emissive: 0xfff2dd, emissiveIntensity: 0.75,
    metalness: 0.1, roughness: 0.2, transparent: true,
  });

  const allMats = [paintMat, rubberMat, metalMat, darkMat, accentMat, lampMat];

  /* ---------------- build ---------------- */
  const bike = new THREE.Group();
  scene.add(bike);

  /* Named parts, so focus() and explode share one vocabulary with the SVG */
  const parts = {};
  const addPart = (name, obj, explode = [0, 0, 0]) => {
    obj.userData.home = obj.position.clone();
    obj.userData.explode = new THREE.Vector3(...explode);
    parts[name] = obj;
    bike.add(obj);
    return obj;
  };

  function buildBody() {
    const isMoto = vehicle.art === 'motorcycle';
    const shape = profileShape(isMoto ? MOTO_PROFILE : PROFILE);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: WIDTH,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 3,
      curveSegments: 8,
    });
    geo.translate(0, 0, -WIDTH / 2);
    const mesh = new THREE.Mesh(geo, paintMat);
    return addPart('body', mesh, [0, 0, 0]);
  }

  function buildWheel(name, x, r, offset) {
    const g = new THREE.Group();
    g.position.set(x, r, 0);

    const tyre = new THREE.Mesh(new THREE.TorusGeometry(r - 0.045, 0.048, 12, 40), rubberMat);
    g.add(tyre);

    const rimGeo = new THREE.CylinderGeometry(r * 0.58, r * 0.58, 0.09, 28);
    rimGeo.rotateX(Math.PI / 2);
    g.add(new THREE.Mesh(rimGeo, metalMat));

    const hubGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.14, 16);
    hubGeo.rotateX(Math.PI / 2);
    g.add(new THREE.Mesh(hubGeo, darkMat));

    // Five spokes, as in the pictogram
    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(r * 0.52, 0.03, 0.05),
        metalMat
      );
      spoke.position.x = 0;
      spoke.rotation.z = (i / 5) * Math.PI * 2;
      spoke.translateX(r * 0.28);
      g.add(spoke);
    }

    return addPart(name, g, offset);
  }

  function buildHandlebar() {
    const g = new THREE.Group();
    const isMoto = vehicle.art === 'motorcycle';
    g.position.set(isMoto ? 0.42 : 0.66, isMoto ? 1.02 : 1.18, 0);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.2, 12), metalMat);
    stem.position.y = -0.1;
    g.add(stem);

    const barGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.62, 12);
    barGeo.rotateX(Math.PI / 2);
    g.add(new THREE.Mesh(barGeo, metalMat));

    [-1, 1].forEach((s) => {
      const gripGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.11, 12);
      gripGeo.rotateX(Math.PI / 2);
      const grip = new THREE.Mesh(gripGeo, rubberMat);
      grip.position.z = s * 0.25;
      g.add(grip);

      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8), metalMat);
      stalk.position.set(0, 0.08, s * 0.22);
      g.add(stalk);

      const mirror = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 10), darkMat);
      mirror.scale.set(1, 0.6, 0.35);
      mirror.position.set(0, 0.16, s * 0.22);
      g.add(mirror);
    });

    return addPart('handlebar', g, [0.06, 0.3, 0]);
  }

  function buildSeat() {
    const isMoto = vehicle.art === 'motorcycle';
    const geo = new THREE.BoxGeometry(isMoto ? 0.7 : 0.62, 0.1, 0.25);
    const mesh = new THREE.Mesh(geo, rubberMat);
    mesh.position.set(isMoto ? -0.42 : -0.52, isMoto ? 0.80 : 0.84, 0);
    return addPart('seat', mesh, [-0.1, 0.34, 0]);
  }

  function buildHeadlight() {
    const isMoto = vehicle.art === 'motorcycle';
    const geo = new THREE.BoxGeometry(0.1, 0.16, 0.2);
    const mesh = new THREE.Mesh(geo, lampMat);
    mesh.position.set(isMoto ? 0.62 : 0.74, isMoto ? 0.9 : 0.92, 0);
    mesh.rotation.z = -0.2;
    return addPart('headlight', mesh, [0.28, 0.06, 0]);
  }

  function buildPowertrain() {
    if (vehicle.fuel === 'electric') {
      const battery = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.1, 0.2), darkMat);
      battery.position.set(0.08, 0.38, 0);
      addPart('battery', battery, [0, -0.36, 0]);

      const cellGeo = new THREE.BoxGeometry(0.05, 0.07, 0.16);
      for (let i = 0; i < 6; i++) {
        const cell = new THREE.Mesh(cellGeo, accentMat);
        cell.position.set(-0.1 + i * 0.07, 0, 0);
        battery.add(cell);
      }

      const motorGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.13, 20);
      motorGeo.rotateX(Math.PI / 2);
      const motor = new THREE.Mesh(motorGeo, accentMat);
      motor.position.set(-0.62, 0.22, 0);
      addPart('motor', motor, [-0.4, 0.02, 0]);

      const port = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.09), accentMat);
      port.position.set(0.52, 0.78, 0.09);
      addPart('charge-port', port, [0.24, 0.16, 0.1]);
    } else {
      const engine = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.24), darkMat);
      engine.position.set(vehicle.art === 'motorcycle' ? 0.06 : -0.34, 0.40, 0);
      addPart('engine', engine, [-0.14, -0.34, 0]);

      const finGeo = new THREE.BoxGeometry(0.32, 0.02, 0.26);
      for (let i = 0; i < 4; i++) {
        const fin = new THREE.Mesh(finGeo, metalMat);
        fin.position.y = -0.08 + i * 0.055;
        engine.add(fin);
      }

      const pipeGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.5, 14);
      pipeGeo.rotateZ(Math.PI / 2);
      const exhaust = new THREE.Mesh(pipeGeo, metalMat);
      exhaust.position.set(-0.30, 0.22, 0.13);
      addPart('exhaust', exhaust, [-0.2, -0.16, 0.14]);
    }
  }

  function buildStorage() {
    const geo = new THREE.BoxGeometry(0.5, 0.22, 0.2);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xff4b12, transparent: true, opacity: 0 })
    );
    edges.position.set(-0.5, 0.6, 0);
    return addPart('storage', edges, [-0.14, 0.08, 0]);
  }

  buildBody();
  const wheelR = vehicle.art === 'motorcycle' ? 0.25 : 0.235;
  buildWheel('wheel-rear', -0.62, wheelR, [-0.34, 0, 0]);
  buildWheel('wheel-front', 0.62, wheelR, [0.34, 0, 0]);
  buildHandlebar();
  buildSeat();
  buildHeadlight();
  buildPowertrain();
  buildStorage();

  /* contact shadow */
  const shadowTex = shadowTexture();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 1.5),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  scene.add(shadow);

  /* ---------------- sizing ---------------- */
  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  /* ---------------- state ---------------- */
  const state = {
    yaw: mode === 'viewer' ? -0.34 : -0.15,
    yawTarget: mode === 'viewer' ? -0.34 : -0.15,
    explode: 0,
    explodeTarget: 0,
    active: true,
    focus: null,
  };

  /* drag to rotate — only in viewer mode */
  if (mode === 'viewer') {
    let dragging = false;
    let lastX = 0;
    const el = renderer.domElement;
    el.style.cursor = 'grab';

    const down = (x) => {
      dragging = true;
      lastX = x;
      el.style.cursor = 'grabbing';
    };
    const move = (x) => {
      if (!dragging) return;
      state.yawTarget += (x - lastX) * 0.009;
      lastX = x;
    };
    const up = () => {
      dragging = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('pointerdown', (e) => down(e.clientX));
    window.addEventListener('pointermove', (e) => move(e.clientX));
    window.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }

  /* ---------------- loop ---------------- */
  const clock = new THREE.Clock();
  let raf = null;

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);

    // Critically-damped-ish easing: controlled, never springy
    state.yaw += (state.yawTarget - state.yaw) * Math.min(dt * 5.5, 1);
    state.explode += (state.explodeTarget - state.explode) * Math.min(dt * 4, 1);

    bike.rotation.y = state.yaw;

    Object.entries(parts).forEach(([name, obj]) => {
      const { home, explode } = obj.userData;
      obj.position.copy(home).addScaledVector(explode, state.explode);

      // Internals only become visible as the machine opens
      const internal = ['battery', 'motor', 'engine', 'storage', 'charge-port'].includes(name);
      const target = internal ? state.explode : 1;
      obj.traverse((o) => {
        if (!o.material) return;
        const focusDim = state.focus && state.focus !== name ? 0.24 : 1;
        o.material.opacity = target * focusDim;
        o.material.depthWrite = o.material.opacity > 0.95;
      });
    });

    shadow.material.opacity = 1 - state.explode * 0.7;

    // Camera pulls back slightly as the machine opens, so nothing leaves frame
    const dist = 3.0 + state.explode * 0.6;
    camera.position.set(
      Math.cos(AZIMUTH) * dist,
      1.02 + state.explode * 0.24,
      Math.sin(AZIMUTH) * dist
    );
    camera.lookAt(0, 0.6, 0);

    renderer.render(scene, camera);
  }

  function setActive(on) {
    if (on === state.active) return;
    state.active = on;
    if (on) renderer.setAnimationLoop(tick);
    else renderer.setAnimationLoop(null);
  }
  renderer.setAnimationLoop(tick);

  /* ---------------- public API ---------------- */
  return {
    update(progress, exploded) {
      state.explodeTarget = exploded ? 1 : 0;
      if (mode === 'story') {
        // One controlled sweep: flank, round the front, and back to rest
        state.yawTarget = -0.15 + progress * 1.9;
      }
    },
    setExploded(on) {
      state.explodeTarget = on ? 1 : 0;
    },
    focus(part) {
      state.focus = part || null;
    },
    setColour(colour) {
      paintMat.color.set(colour.paint);
    },
    setVehicle(next) {
      // Only the powertrain differs between the two story heroes, so swap the
      // parts that changed rather than rebuilding the scene.
      ['battery', 'motor', 'charge-port', 'engine', 'exhaust'].forEach((name) => {
        const obj = parts[name];
        if (!obj) return;
        bike.remove(obj);
        obj.traverse((o) => o.geometry?.dispose());
        delete parts[name];
      });
      vehicle = next;
      paintMat.color.set(next.colours?.[0]?.paint || '#C8CCD2');
      buildPowertrain();
    },
    setActive,
    get yaw() {
      return state.yaw;
    },
    destroy() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      scene.traverse((o) => o.geometry?.dispose());
      allMats.forEach((m) => m.dispose());
      shadowTex.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
