import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Cena 3D: mão segurando um celular que reproduz um vídeo vertical.
 * Carregada sob demanda (import dinâmico) para não pesar no bundle inicial.
 *
 * Sem modelo .glb, a mão é "esculpida" com primitivas — estilo escultura em argila,
 * coerente com a estética monocromática do site.
 */

export interface HandPhoneOptions {
  video: HTMLVideoElement;
  accent: string;
  /** Modelo opcional (.glb) com a malha da tela nomeada. */
  model?: { src: string; screenMesh: string };
  /** Reduz custo de render em telas pequenas. */
  lowPower?: boolean;
}

export interface HandPhoneScene {
  /** 0 → 1: progresso do scroll pela seção. */
  setProgress: (p: number) => void;
  /** -1 → 1: posição do ponteiro (parallax sutil). */
  setPointer: (x: number, y: number) => void;
  setAnimated: (on: boolean) => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
}

// Dimensões do celular (unidades de cena).
const PHONE = { w: 0.78, h: 1.62, d: 0.085, r: 0.1 };
const SCREEN = { w: 0.71, h: 1.54, r: 0.08 };

function capsuleBetween(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const length = Math.max(dir.length(), 0.001);
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 16), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  return mesh;
}

/** Retângulo arredondado com UVs normalizadas (0–1) para receber a textura do vídeo. */
function roundedScreenGeometry(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ShapeGeometry(s, 12);
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - x) / w;
    uv[i * 2 + 1] = (pos.getY(i) - y) / h;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

/** Ajusta a textura para "object-fit: cover" dentro da tela. */
function coverTexture(tex: THREE.Texture, planeAspect: number, mediaAspect: number) {
  if (mediaAspect > planeAspect) {
    tex.repeat.set(planeAspect / mediaAspect, 1);
    tex.offset.set((1 - tex.repeat.x) / 2, 0);
  } else {
    tex.repeat.set(1, mediaAspect / planeAspect);
    tex.offset.set(0, (1 - tex.repeat.y) / 2);
  }
}

function buildPhone(screenMaterial: THREE.Material) {
  const phone = new THREE.Group();

  const body = new THREE.Mesh(
    new RoundedBoxGeometry(PHONE.w, PHONE.h, PHONE.d, 6, PHONE.r),
    new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0.7, roughness: 0.32 }),
  );
  body.castShadow = true;
  phone.add(body);

  // Moldura preta da tela (vidro) e a tela com o vídeo.
  const glass = new THREE.Mesh(
    roundedScreenGeometry(PHONE.w - 0.03, PHONE.h - 0.03, PHONE.r - 0.015),
    new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.2, roughness: 0.15 }),
  );
  glass.position.z = PHONE.d / 2 + 0.001;
  phone.add(glass);

  const screen = new THREE.Mesh(roundedScreenGeometry(SCREEN.w, SCREEN.h, SCREEN.r), screenMaterial);
  screen.position.z = PHONE.d / 2 + 0.002;
  phone.add(screen);

  // "Dynamic island".
  const island = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.022, 0.12, 4, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
  );
  island.rotation.z = Math.PI / 2;
  island.position.set(0, SCREEN.h / 2 - 0.06, PHONE.d / 2 + 0.003);
  phone.add(island);

  // Botões laterais.
  const btnMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, metalness: 0.8, roughness: 0.3 });
  const power = new THREE.Mesh(new RoundedBoxGeometry(0.02, 0.22, 0.04, 2, 0.008), btnMat);
  power.position.set(PHONE.w / 2 + 0.006, 0.28, 0);
  phone.add(power);
  [0.42, 0.24].forEach((y) => {
    const vol = new THREE.Mesh(new RoundedBoxGeometry(0.02, 0.14, 0.04, 2, 0.008), btnMat);
    vol.position.set(-PHONE.w / 2 - 0.006, y, 0);
    phone.add(vol);
  });

  return phone;
}

/**
 * Mão direita em primeira pessoa: palma atrás do celular, polegar sobre a borda
 * direita e quatro dedos dando a volta pela borda esquerda.
 */
function buildHand() {
  const skin = new THREE.MeshStandardMaterial({ color: 0xc8cbd0, roughness: 0.3, metalness: 0.95 });
  const hand = new THREE.Group();
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const back = -PHONE.d / 2 - 0.075;
  const edgeL = -PHONE.w / 2;

  // Palma (atrás do celular, deslocada para baixo/direita).
  const palm = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.78, 0.2, 6, 0.09), skin);
  palm.position.set(0.12, -0.52, back - 0.06);
  palm.rotation.z = -0.18;
  palm.castShadow = true;
  hand.add(palm);

  // Base do polegar (eminência tenar) e antebraço saindo do quadro.
  hand.add(capsuleBetween(v(0.36, -0.86, back + 0.02), v(0.46, -0.5, 0.0), 0.12, skin));
  hand.add(capsuleBetween(v(0.3, -0.95, back - 0.08), v(0.85, -2.4, back - 0.25), 0.25, skin));

  // Polegar: sobe pela borda direita e repousa sobre a lateral da tela.
  hand.add(capsuleBetween(v(0.47, -0.52, 0.0), v(0.45, -0.25, PHONE.d / 2 + 0.035), 0.056, skin));
  hand.add(capsuleBetween(v(0.45, -0.25, PHONE.d / 2 + 0.035), v(0.4, -0.08, PHONE.d / 2 + 0.04), 0.05, skin));

  // Dedos: falange atrás do celular + curva pela borda esquerda até a frente.
  const fingers = [
    { y: 0.02, r: 0.052, reach: 0.0 },
    { y: -0.15, r: 0.056, reach: 0.015 },
    { y: -0.32, r: 0.054, reach: 0.01 },
    { y: -0.47, r: 0.047, reach: -0.01 },
  ];
  fingers.forEach(({ y, r, reach }) => {
    const knuckle = v(0.22, y - 0.06, back - 0.02);
    const bend = v(edgeL - 0.02, y, back + 0.01);
    const tip = v(edgeL + reach, y + 0.015, PHONE.d / 2 + 0.03);
    hand.add(capsuleBetween(knuckle, bend, r, skin));
    hand.add(capsuleBetween(bend, v(edgeL - 0.055, y + 0.008, 0), r * 0.96, skin));
    hand.add(capsuleBetween(v(edgeL - 0.055, y + 0.008, 0), tip, r * 0.9, skin));
  });

  return hand;
}

export async function createHandPhoneScene(canvas: HTMLCanvasElement, opts: HandPhoneOptions): Promise<HandPhoneScene> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.lowPower, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.lowPower ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0, 5.4);

  // Luz principal quente, preenchimento frio e um contorno com a cor de destaque.
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const key = new THREE.DirectionalLight(0xfff1e6, 2.2);
  key.position.set(-2.5, 3, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xbcd0ff, 0.5);
  fill.position.set(3, -1, 2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(new THREE.Color(opts.accent), 3.2);
  rim.position.set(3, 2, -3);
  scene.add(rim);

  // Textura do vídeo.
  const videoTex = new THREE.VideoTexture(opts.video);
  videoTex.colorSpace = THREE.SRGBColorSpace;
  videoTex.minFilter = THREE.LinearFilter;
  videoTex.generateMipmaps = false;
  const applyCover = () => {
    const { videoWidth: vw, videoHeight: vh } = opts.video;
    if (vw && vh) coverTexture(videoTex, SCREEN.w / SCREEN.h, vw / vh);
  };
  applyCover();
  opts.video.addEventListener("loadedmetadata", applyCover);
  const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTex, toneMapped: false });

  const rig = new THREE.Group(); // recebe scroll + ponteiro
  const float = new THREE.Group(); // recebe a flutuação ociosa
  rig.add(float);
  scene.add(rig);

  if (opts.model) {
    const gltf = await new GLTFLoader().loadAsync(opts.model.src);
    const model = gltf.scene;
    model.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o.name === opts.model!.screenMesh) (o as THREE.Mesh).material = screenMaterial;
    });
    // Normaliza tamanho e centraliza.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const scale = 2.4 / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(scale);
    box.setFromObject(model);
    model.position.sub(box.getCenter(new THREE.Vector3()));
    float.add(model);
  } else {
    float.add(buildPhone(screenMaterial));
    float.add(buildHand());
    float.position.y = 0.18;
  }

  // Estado animado.
  let progress = 0;
  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0, p: 0 };
  let animated = true;
  let running = false;
  let raf = 0;
  const timer = new THREE.Timer();

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Em telas estreitas, afasta a câmera para caber a cena.
    camera.position.z = camera.aspect < 0.8 ? 6.6 : 5.4;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const render = () => {
    timer.update();
    const t = timer.getElapsed();
    const k = animated ? 0.08 : 1;
    smooth.p += (progress - smooth.p) * k;
    smooth.x += (pointer.x - smooth.x) * k;
    smooth.y += (pointer.y - smooth.y) * k;

    // Scroll: o celular gira de perfil para frente, como quem levanta o aparelho para assistir.
    const p = smooth.p;
    rig.rotation.y = THREE.MathUtils.lerp(-0.75, 0.12, p) + smooth.x * 0.18;
    rig.rotation.x = THREE.MathUtils.lerp(0.35, -0.04, p) - smooth.y * 0.1;
    rig.rotation.z = THREE.MathUtils.lerp(0.22, 0.04, p);
    rig.position.y = THREE.MathUtils.lerp(-0.55, 0, p);

    if (animated) {
      float.rotation.z = Math.sin(t * 0.7) * 0.015;
      float.position.x = Math.sin(t * 0.5) * 0.02;
    }
    renderer.render(scene, camera);
  };

  const loop = () => {
    render();
    raf = requestAnimationFrame(loop);
  };

  return {
    setProgress: (p) => {
      progress = THREE.MathUtils.clamp(p, 0, 1);
      if (!running) render();
    },
    setPointer: (x, y) => {
      pointer.x = x;
      pointer.y = y;
    },
    setAnimated: (on) => {
      animated = on;
    },
    start: () => {
      if (running) return;
      running = true;
      loop();
    },
    stop: () => {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      opts.video.removeEventListener("loadedmetadata", applyCover);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m.dispose());
        }
      });
      videoTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
