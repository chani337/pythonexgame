// The 3D view of 친구랑 눈싸움 (three.js). It only draws: the rules and the
// network live in SnowballDuel.tsx and src/utils/snowballDuel.ts, on a flat
// field of DUEL_W × DUEL_H. Here ground x = field x - DUEL_W/2 and ground
// z = field y - DUEL_H/2, so my side (large y) is near the camera.
import * as THREE from 'three';
import { DUEL_H, DUEL_W, HALF_TOP, WALL_DEPTH, WALL_HP, WALL_W, WALLS } from '../utils/snowballDuel';
import type { DuelBall, Point } from '../utils/snowballDuel';

export interface SceneState {
  me: Point;
  them: Point;
  walls: number[];
  theirWalls: number[];
  balls: DuelBall[];
  meHurt: boolean; // blinking after a hit
  themHit: number; // seconds of red flash left
  meThrow: number;
  themThrow: number;
  shake: number;
  showThem: boolean;
  puffs: { x: number; y: number; life: number }[];
}

const toGround = (p: Point) => new THREE.Vector3(p.x - DUEL_W / 2, 0, p.y - DUEL_H / 2);

interface Kid {
  group: THREE.Group;
  arm: THREE.Mesh;
  coat: THREE.MeshLambertMaterial;
  baseColor: THREE.Color;
}

function makeKid(coatColor: string, hatColor: string): Kid {
  const group = new THREE.Group();
  const coat = new THREE.MeshLambertMaterial({ color: coatColor });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(16, 26, 4, 12), coat);
  body.position.y = 32;
  group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(13, 16, 12), new THREE.MeshLambertMaterial({ color: '#ffd9b8' }));
  head.position.y = 70;
  group.add(head);
  const hat = new THREE.Mesh(new THREE.ConeGeometry(13, 24, 14), new THREE.MeshLambertMaterial({ color: hatColor }));
  hat.position.y = 90;
  group.add(hat);
  const brim = new THREE.Mesh(new THREE.TorusGeometry(12, 3, 8, 16), new THREE.MeshLambertMaterial({ color: '#ffffff' }));
  brim.rotation.x = Math.PI / 2;
  brim.position.y = 79;
  group.add(brim);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(4.5, 10, 8), new THREE.MeshLambertMaterial({ color: '#ffffff' }));
  pom.position.y = 103;
  group.add(pom);
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(5, 22, 3, 8), coat);
  arm.position.set(20, 44, 0);
  arm.geometry.translate(0, 12, 0); // pivot at the shoulder
  arm.rotation.z = -2.6;
  group.add(arm);
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(22, 20),
    new THREE.MeshBasicMaterial({ color: '#28466e', transparent: true, opacity: 0.18, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.6;
  group.add(shadow);
  return { group, arm, coat, baseColor: new THREE.Color(coatColor) };
}

function makeTree(): THREE.Group {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 30, 8), new THREE.MeshLambertMaterial({ color: '#6b4a2b' }));
  trunk.position.y = 15;
  g.add(trunk);
  const green = new THREE.MeshLambertMaterial({ color: '#2f6b4f' });
  const snow = new THREE.MeshLambertMaterial({ color: '#ffffff' });
  [0, 1, 2].forEach((i) => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(48 - i * 12, 60, 10), green);
    cone.position.y = 50 + i * 34;
    g.add(cone);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(20 - i * 4, 18, 10), snow);
    cap.position.y = 72 + i * 34;
    g.add(cap);
  });
  return g;
}

export class DuelScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private me: Kid;
  private them: Kid;
  private wallMeshes: THREE.Mesh[] = [];
  private theirWallMeshes: THREE.Mesh[] = [];
  private balls = new Map<string, THREE.Mesh>();
  private ballGeo = new THREE.SphereGeometry(8, 12, 10);
  private ballMat = new THREE.MeshLambertMaterial({ color: '#ffffff', emissive: '#334455', emissiveIntensity: 0.15 });
  private puffs: THREE.Points;
  private resize: ResizeObserver;
  private raycaster = new THREE.Raycaster();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private camX = 0;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('#bcd6ee');
    this.scene.fog = new THREE.Fog('#bcd6ee', 1300, 2600);
    this.camera = new THREE.PerspectiveCamera(50, 16 / 10, 1, 5000);

    this.scene.add(new THREE.HemisphereLight('#ffffff', '#9fb8d0', 1.6));
    const sun = new THREE.DirectionalLight('#ffffff', 1.4);
    sun.position.set(-300, 800, 400);
    this.scene.add(sun);

    // Snow field with a tinted half for each side and the middle line.
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(DUEL_W + 1600, DUEL_H + 1600), new THREE.MeshLambertMaterial({ color: '#f3f7fb' }));
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
    const halfDepth = DUEL_H - HALF_TOP + 40;
    const tint = (color: string, z: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(DUEL_W, halfDepth), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.08, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(0, 0.3, z);
      this.scene.add(m);
    };
    tint('#c0262d', DUEL_H / 2 - halfDepth / 2);
    tint('#1f6feb', -DUEL_H / 2 + halfDepth / 2);
    for (let x = -DUEL_W / 2; x < DUEL_W / 2; x += 50) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(26, 5), new THREE.MeshBasicMaterial({ color: '#8fb0d0' }));
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x + 25, 0.5, 0);
      this.scene.add(dash);
    }
    // Trees around the edge, for depth.
    for (let i = 0; i < 18; i++) {
      const t = makeTree();
      const side = i % 2 === 0 ? -1 : 1;
      t.position.set(side * (DUEL_W / 2 + 90 + (i % 3) * 70), 0, -DUEL_H / 2 - 100 + (i / 18) * (DUEL_H + 200));
      t.scale.setScalar(0.9 + ((i * 37) % 10) / 25);
      this.scene.add(t);
    }
    for (let i = 0; i < 9; i++) {
      const t = makeTree();
      t.position.set(-DUEL_W / 2 + i * (DUEL_W / 8), 0, -DUEL_H / 2 - 160 - (i % 2) * 60);
      t.scale.setScalar(1.1);
      this.scene.add(t);
    }

    const wallMat = new THREE.MeshLambertMaterial({ color: '#ffffff', emissive: '#a9c2dc', emissiveIntensity: 0.12 });
    const wallGeo = new THREE.BoxGeometry(WALL_W, 1, WALL_DEPTH * 1.6);
    wallGeo.translate(0, 0.5, 0); // grows up from the ground
    for (const w of WALLS) {
      const mine = new THREE.Mesh(wallGeo, wallMat);
      mine.position.copy(toGround(w));
      this.scene.add(mine);
      this.wallMeshes.push(mine);
      const theirs = new THREE.Mesh(wallGeo, wallMat);
      theirs.position.copy(toGround({ x: DUEL_W - w.x, y: DUEL_H - w.y }));
      this.scene.add(theirs);
      this.theirWallMeshes.push(theirs);
    }

    this.me = makeKid('#e5484d', '#c0262d');
    this.them = makeKid('#3b82f6', '#1f6feb');
    this.them.group.rotation.y = Math.PI; // facing me
    this.scene.add(this.me.group, this.them.group);

    const puffGeo = new THREE.BufferGeometry();
    puffGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(300 * 3), 3));
    puffGeo.setDrawRange(0, 0);
    this.puffs = new THREE.Points(puffGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 7 }));
    this.scene.add(this.puffs);

    this.resize = new ResizeObserver(() => this.fit());
    this.resize.observe(container);
    this.fit();
  }

  private fit() {
    const w = this.container.clientWidth || 800;
    const h = this.container.clientHeight || 500;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Narrow (phone) screens need to stand further back to see the width.
    this.camera.fov = w / h < 1 ? 80 : w / h < 1.3 ? 62 : 50;
    this.camera.updateProjectionMatrix();
  }

  /** The field point under a click, or null if it misses the ground. */
  pick(clientX: number, clientY: number): Point | null {
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hit = new THREE.Vector3();
    if (!this.raycaster.ray.intersectPlane(this.groundPlane, hit)) return null;
    return { x: hit.x + DUEL_W / 2, y: hit.z + DUEL_H / 2 };
  }

  render(s: SceneState, dt: number) {
    // Camera: behind and above my baseline, drifting a little with me.
    const meG = toGround(s.me);
    this.camX += (meG.x * 0.45 - this.camX) * Math.min(1, dt * 4);
    const shake = s.shake > 0 ? (Math.random() - 0.5) * s.shake * 30 : 0;
    this.camera.position.set(this.camX + shake, 560, DUEL_H / 2 + 520);
    this.camera.lookAt(this.camX * 0.6, 0, -60);

    this.me.group.position.copy(meG);
    this.me.group.visible = !s.meHurt || Math.floor(performance.now() / 90) % 2 === 0;
    this.me.arm.rotation.z = s.meThrow > 0 ? -0.4 : -2.6;
    this.them.group.position.copy(toGround(s.them));
    this.them.group.visible = s.showThem;
    this.them.arm.rotation.z = s.themThrow > 0 ? -0.4 : -2.6;
    this.them.coat.color.copy(this.them.baseColor).lerp(new THREE.Color('#ff2a2a'), Math.min(1, s.themHit * 3));

    const setWall = (m: THREE.Mesh, hp: number) => {
      m.visible = hp > 0;
      m.scale.y = 18 + 46 * (hp / WALL_HP);
    };
    s.walls.forEach((hp, i) => setWall(this.wallMeshes[i], hp));
    s.theirWalls.forEach((hp, i) => setWall(this.theirWallMeshes[i], hp));

    // Balls: one mesh per id, created and dropped as they come and go.
    const seen = new Set<string>();
    for (const b of s.balls) {
      seen.add(b.id);
      let m = this.balls.get(b.id);
      if (!m) {
        m = new THREE.Mesh(this.ballGeo, this.ballMat);
        this.scene.add(m);
        this.balls.set(b.id, m);
      }
      m.position.set(b.x - DUEL_W / 2, 42, b.y - DUEL_H / 2);
    }
    for (const [id, m] of this.balls) {
      if (!seen.has(id)) {
        this.scene.remove(m);
        this.balls.delete(id);
      }
    }

    const pos = this.puffs.geometry.getAttribute('position') as THREE.BufferAttribute;
    const n = Math.min(s.puffs.length, 300);
    for (let i = 0; i < n; i++) {
      const p = s.puffs[i];
      pos.setXYZ(i, p.x - DUEL_W / 2, 30 + (0.6 - p.life) * 60, p.y - DUEL_H / 2);
    }
    pos.needsUpdate = true;
    this.puffs.geometry.setDrawRange(0, n);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.resize.disconnect();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose());
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
