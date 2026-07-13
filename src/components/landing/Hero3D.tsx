import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RouteLoop {
  curve: THREE.CatmullRomCurve3;
  group: THREE.Group;
  mover: THREE.Mesh;
  speed: number;
  rotSpeed: number;
}

function buildRouteLoop(
  scene: THREE.Scene,
  opts: {
    stopCount: number;
    baseRadius: number;
    radiusVariance: number;
    yScale: number;
    center: THREE.Vector3;
    lineColor: number;
    lineOpacity: number;
    nodeColor: number;
    nodeSize: number;
    depotColor: number;
    depotSize: number;
    moverColor: number;
    moverSize: number;
    moverEmissive: number;
    speed: number;
    rotSpeed: number;
  }
): RouteLoop {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < opts.stopCount; i++) {
    const angle = (i / opts.stopCount) * Math.PI * 2;
    const radius = opts.baseRadius + Math.sin(i * 1.7) * opts.radiusVariance;
    points.push(
      new THREE.Vector3(
        opts.center.x + Math.cos(angle) * radius,
        opts.center.y + Math.sin(angle * 1.3) * opts.yScale,
        opts.center.z + Math.sin(angle) * radius
      )
    );
  }

  const group = new THREE.Group();
  scene.add(group);

  const curve = new THREE.CatmullRomCurve3(points, true);
  const curvePoints = curve.getPoints(200);
  const lineGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
  const lineMat = new THREE.LineBasicMaterial({
    color: opts.lineColor,
    transparent: true,
    opacity: opts.lineOpacity,
  });
  group.add(new THREE.Line(lineGeom, lineMat));

  const nodeGeom = new THREE.SphereGeometry(opts.nodeSize, 16, 16);
  points.forEach((p, i) => {
    const isDepot = i === 0;
    const mat = new THREE.MeshStandardMaterial({
      color: isDepot ? opts.depotColor : opts.nodeColor,
      emissive: isDepot ? opts.depotColor : 0x000000,
      emissiveIntensity: isDepot ? 0.6 : 0,
      roughness: 0.4,
      metalness: 0.2,
      transparent: opts.lineOpacity < 1,
      opacity: opts.lineOpacity < 1 ? opts.lineOpacity + 0.3 : 1,
    });
    const mesh = new THREE.Mesh(nodeGeom, mat);
    mesh.position.copy(p);
    mesh.scale.setScalar(isDepot ? opts.depotSize / opts.nodeSize : 1);
    group.add(mesh);
  });

  // the moving "vehicle" traveling along this loop
  const moverGeom = new THREE.ConeGeometry(opts.moverSize, opts.moverSize * 2.2, 8);
  const moverMat = new THREE.MeshStandardMaterial({
    color: opts.moverColor,
    emissive: opts.moverColor,
    emissiveIntensity: opts.moverEmissive,
    roughness: 0.3,
    metalness: 0.3,
  });
  const mover = new THREE.Mesh(moverGeom, moverMat);
  group.add(mover);

  return { curve, group, mover, speed: opts.speed, rotSpeed: opts.rotSpeed };
}

export default function Hero3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // main, prominent route loop — the hero focal point
    const mainLoop = buildRouteLoop(scene, {
      stopCount: 9,
      baseRadius: 3,
      radiusVariance: 1.2,
      yScale: 1.8,
      center: new THREE.Vector3(0, 0, 0),
      lineColor: 0xf2a93b,
      lineOpacity: 0.6,
      nodeColor: 0x1d252c,
      nodeSize: 0.11,
      depotColor: 0xf2a93b,
      depotSize: 0.18,
      moverColor: 0xffffff,
      moverSize: 0.09,
      moverEmissive: 0.9,
      speed: 0.09,
      rotSpeed: 0.15,
    });

    // smaller, dimmer background loops — the "other small routes" moving
    // around the periphery, each on its own clock
    const secondaryLoops = [
      buildRouteLoop(scene, {
        stopCount: 6,
        baseRadius: 1.1,
        radiusVariance: 0.35,
        yScale: 0.7,
        center: new THREE.Vector3(-5.5, 2.4, -3),
        lineColor: 0xf2a93b,
        lineOpacity: 0.22,
        nodeColor: 0x1d252c,
        nodeSize: 0.05,
        depotColor: 0xf2a93b,
        depotSize: 0.07,
        moverColor: 0xf2a93b,
        moverSize: 0.045,
        moverEmissive: 0.5,
        speed: 0.16,
        rotSpeed: -0.22,
      }),
      buildRouteLoop(scene, {
        stopCount: 5,
        baseRadius: 0.9,
        radiusVariance: 0.3,
        yScale: 0.55,
        center: new THREE.Vector3(5.2, -1.8, -2.5),
        lineColor: 0xf2a93b,
        lineOpacity: 0.18,
        nodeColor: 0x1d252c,
        nodeSize: 0.045,
        depotColor: 0xf2a93b,
        depotSize: 0.06,
        moverColor: 0xf2a93b,
        moverSize: 0.04,
        moverEmissive: 0.5,
        speed: 0.12,
        rotSpeed: 0.28,
      }),
      buildRouteLoop(scene, {
        stopCount: 5,
        baseRadius: 0.7,
        radiusVariance: 0.2,
        yScale: 0.4,
        center: new THREE.Vector3(-3.8, -2.6, -4),
        lineColor: 0xf2a93b,
        lineOpacity: 0.15,
        nodeColor: 0x1d252c,
        nodeSize: 0.04,
        depotColor: 0xf2a93b,
        depotSize: 0.05,
        moverColor: 0xf2a93b,
        moverSize: 0.035,
        moverEmissive: 0.4,
        speed: 0.2,
        rotSpeed: -0.18,
      }),
    ];

    const allLoops = [mainLoop, ...secondaryLoops];

    // faint particle field for depth
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x2a333b, size: 0.035 });
    scene.add(new THREE.Points(particleGeom, particleMat));

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const point = new THREE.PointLight(0xf2a93b, 1.2);
    point.position.set(4, 4, 6);
    scene.add(point);
    const fillLight = new THREE.PointLight(0xffffff, 0.4);
    fillLight.position.set(-5, -3, 4);
    scene.add(fillLight);

    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const tangentHelper = new THREE.Vector3();
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();

      mainLoop.group.rotation.y = t * mainLoop.rotSpeed + mouseX * 0.3;
      mainLoop.group.rotation.x = Math.sin(t * 0.1) * 0.15 + mouseY * 0.15;

      secondaryLoops.forEach((loop, i) => {
        loop.group.rotation.y = t * loop.rotSpeed + i;
        loop.group.rotation.x = Math.sin(t * 0.08 + i) * 0.1;
      });

      // move each loop's "vehicle" marker along its own curve, oriented
      // to face its direction of travel
      allLoops.forEach((loop) => {
        const progress = (t * loop.speed) % 1;
        const pos = loop.curve.getPointAt(progress);
        const lookAhead = loop.curve.getPointAt((progress + 0.01) % 1);
        loop.mover.position.copy(pos);
        tangentHelper.copy(lookAhead).sub(pos).normalize();
        loop.mover.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangentHelper);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      particleGeom.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
