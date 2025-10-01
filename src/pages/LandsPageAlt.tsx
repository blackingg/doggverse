import React, { useState, useEffect, useRef } from "react";
import {
  IoMapSharp,
  IoClose,
  IoWalletSharp,
  IoPeopleSharp,
  IoSearchSharp,
  IoGlobeSharp,
  IoCheckmarkCircle,
  IoLockClosedSharp,
  IoStarSharp,
} from "react-icons/io5";
import { Header } from "../components/Header";
import * as THREE from "three";
import type { LandData } from "../types";

export const LandsPageAlt: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLand, setSelectedLand] = useState<LandData | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const sceneRef = useRef<{
    landParcels: THREE.Mesh[];
    currentFilter: string;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const gridSize = 10;
    const cellSize = 114;
    let landParcels: THREE.Mesh[] = [];
    let selectedParcel: THREE.Mesh | null = null;
    let currentFilter = "all";

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 1500, 4000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      5000
    );
    camera.position.set(800, 600, 800);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1200, 1200, 600);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x0a84ff, 0.3);
    rimLight.position.set(-800, 400, -600);
    scene.add(rimLight);

    // Create grid
    const gridGroup = new THREE.Group();
    const colors = [0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0x06b6d4, 0x84cc16];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const geometry = new THREE.BoxGeometry(cellSize - 6, 25, cellSize - 6);
        const material = new THREE.MeshLambertMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          transparent: true,
          opacity: 0.9,
          emissive: new THREE.Color(0x000000),
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(
          (i - gridSize / 2 + 0.5) * cellSize,
          12.5,
          (j - gridSize / 2 + 0.5) * cellSize
        );
        cube.castShadow = true;
        cube.receiveShadow = true;

        cube.userData = {
          gridX: i,
          gridY: j,
          id: String.fromCharCode(65 + i) + (j + 1),
          price: Math.floor(Math.random() * 2000) + 500,
          type: ["Premium", "Standard", "Luxury"][
            Math.floor(Math.random() * 3)
          ],
          owned: Math.random() < 0.2,
        };

        const colorIndex = (i + j) % colors.length;
        cube.material.color.setHex(colors[colorIndex]);

        if (cube.userData.owned) {
          cube.material.color.setHex(0xef4444);
          cube.material.emissive.setHex(0x991b1b);
        }

        (cube as any).originalY = cube.position.y;
        (cube as any).hovered = false;
        landParcels.push(cube);
        gridGroup.add(cube);
      }
    }

    // Platform
    const platformSize = gridSize * cellSize + 300;
    const platformHeight = 60;
    const platformGeometry = new THREE.BoxGeometry(
      platformSize,
      platformHeight,
      platformSize
    );
    const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x1c1c1e });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -platformHeight / 2;
    platform.receiveShadow = true;
    gridGroup.add(platform);

    scene.add(gridGroup);

    // Controls
    const controls = {
      isRotating: false,
      isPanning: false,
      lastMouse: { x: 0, y: 0 },
      rotationSpeed: 0.005,
      panSpeed: 2,
      target: new THREE.Vector3(0, 0, 0),
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Event handlers
    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      const rect = canvasRef.current!.getBoundingClientRect();
      controls.lastMouse.x = event.clientX - rect.left;
      controls.lastMouse.y = event.clientY - rect.top;

      if (event.button === 0) controls.isRotating = true;
      else if (event.button === 2) controls.isPanning = true;
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (controls.isRotating || controls.isPanning) {
        const deltaX = mouseX - controls.lastMouse.x;
        const deltaY = mouseY - controls.lastMouse.y;

        if (controls.isRotating) {
          const spherical = new THREE.Spherical();
          const offset = new THREE.Vector3();
          offset.copy(camera.position).sub(controls.target);
          spherical.setFromVector3(offset);
          spherical.theta -= deltaX * controls.rotationSpeed;
          spherical.phi -= deltaY * controls.rotationSpeed;
          spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
          offset.setFromSpherical(spherical);
          camera.position.copy(controls.target).add(offset);
          camera.lookAt(controls.target);
        }

        controls.lastMouse.x = mouseX;
        controls.lastMouse.y = mouseY;
      }

      mouse.x = (mouseX / canvasRef.current!.clientWidth) * 2 - 1;
      mouse.y = -(mouseY / canvasRef.current!.clientHeight) * 2 + 1;

      // Hover effect
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        landParcels.filter((p) => p.visible)
      );

      landParcels.forEach((parcel) => {
        if ((parcel as any).hovered) {
          parcel.position.y = (parcel as any).originalY;
          (parcel as any).hovered = false;
        }
      });

      if (intersects.length > 0) {
        const hoveredObject = intersects[0].object as THREE.Mesh;
        hoveredObject.position.y = (hoveredObject as any).originalY + 15;
        (hoveredObject as any).hovered = true;
      }
    };

    const onMouseUp = () => {
      controls.isRotating = false;
      controls.isPanning = false;
    };

    const onClick = (event: MouseEvent) => {
      if (controls.isRotating || controls.isPanning) return;

      const rect = canvasRef.current!.getBoundingClientRect();
      mouse.x =
        ((event.clientX - rect.left) / canvasRef.current!.clientWidth) * 2 - 1;
      mouse.y =
        -((event.clientY - rect.top) / canvasRef.current!.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        landParcels.filter((p) => p.visible)
      );

      if (intersects.length > 0) {
        selectedParcel = intersects[0].object as THREE.Mesh;
        setSelectedLand(selectedParcel.userData as LandData);
        setShowBuyModal(true);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 50 : -50;
      const distance = camera.position.distanceTo(controls.target);
      const newDistance = Math.max(200, Math.min(2000, distance + delta));
      const direction = new THREE.Vector3();
      direction.subVectors(camera.position, controls.target).normalize();
      camera.position
        .copy(controls.target)
        .add(direction.multiplyScalar(newDistance));
    };

    canvasRef.current.addEventListener("mousedown", onMouseDown);
    canvasRef.current.addEventListener("mousemove", onMouseMove);
    canvasRef.current.addEventListener("mouseup", onMouseUp);
    canvasRef.current.addEventListener("click", onClick);
    canvasRef.current.addEventListener("wheel", onWheel);
    canvasRef.current.addEventListener("contextmenu", (e) =>
      e.preventDefault()
    );

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.0008;
      landParcels.forEach((parcel, index) => {
        if (!(parcel as any).hovered && parcel.visible) {
          parcel.position.y =
            (parcel as any).originalY + Math.sin(time + index * 0.15) * 1.5;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Store scene ref for filter updates
    sceneRef.current = { landParcels, currentFilter };

    return () => {
      window.removeEventListener("resize", handleResize);
      canvasRef.current?.removeEventListener("mousedown", onMouseDown);
      canvasRef.current?.removeEventListener("mousemove", onMouseMove);
      canvasRef.current?.removeEventListener("mouseup", onMouseUp);
      canvasRef.current?.removeEventListener("click", onClick);
      canvasRef.current?.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    const { landParcels } = sceneRef.current;

    landParcels.forEach((parcel: THREE.Mesh) => {
      const material = parcel.material as THREE.MeshLambertMaterial;
      parcel.visible = true;
      let shouldHighlight = false;

      switch (filter) {
        case "available":
          shouldHighlight = !parcel.userData.owned;
          break;
        case "owned":
          shouldHighlight = parcel.userData.owned;
          break;
        case "premium":
          shouldHighlight = parcel.userData.type === "Premium";
          break;
      }

      if (shouldHighlight) {
        material.color.setHex(0x00ff00);
        material.emissive.setHex(0x00aa00);
      } else {
        if (parcel.userData.owned) {
          material.color.setHex(0xef4444);
          material.emissive.setHex(0x991b1b);
        } else {
          const colors = [
            0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0x06b6d4, 0x84cc16,
          ];
          const colorIndex =
            (parcel.userData.gridX + parcel.userData.gridY) % colors.length;
          material.color.setHex(colors[colorIndex]);
          material.emissive.setHex(0x000000);
        }
      }
    });
  }, [filter]);

  return (
    <div className="pb-20 bg-[#000000] min-h-screen">
      <Header
        title="Land Marketplace"
        balance={500}
      />

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[70vh]"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />

        {/* Filter Dropdown */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="w-12 h-12 bg-[#1c1c1e] border border-gray-800 rounded-xl flex items-center justify-center text-white hover:bg-[#2c2c2e] transition-colors"
          >
            <IoSearchSharp size={20} />
          </button>

          {showFilterDropdown && (
            <div className="absolute top-14 right-0 bg-[#1c1c1e] border border-gray-800 rounded-xl overflow-hidden min-w-[160px]">
              {[
                { id: "all", label: "All Lands", Icon: IoGlobeSharp },
                {
                  id: "available",
                  label: "Available",
                  Icon: IoCheckmarkCircle,
                },
                { id: "owned", label: "Owned", Icon: IoLockClosedSharp },
                { id: "premium", label: "Premium", Icon: IoStarSharp },
              ].map((f) => {
                const Icon = f.Icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFilter(f.id);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center gap-2 text-sm ${
                      filter === f.id
                        ? "bg-[#0A84FF] text-white"
                        : "text-gray-400 hover:bg-[#2c2c2e]"
                    } transition-colors`}
                  >
                    <Icon size={18} />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && selectedLand && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-[#1c1c1e] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md animate-[slideUp_0.3s_ease-out] border-t border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Land Purchase</h3>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="w-10 h-10 bg-[#2c2c2e] rounded-full flex items-center justify-center text-white hover:bg-[#3c3c3e] transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <IoMapSharp
                  size={32}
                  className="text-[#0A84FF]"
                />
              </div>

              <div className="bg-[#000000] rounded-2xl p-4 mb-6 border border-gray-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Plot ID</span>
                  <span className="text-white font-semibold">
                    {selectedLand.id}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Size</span>
                  <span className="text-white font-semibold">114 × 114px</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-semibold">
                    {selectedLand.type}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedLand.owned
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {selectedLand.owned ? "Owned" : "Available"}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0A84FF]/20 to-[#0051D5]/20 rounded-2xl p-6 mb-6 border border-[#0A84FF]/30 text-center">
                <div className="text-sm text-gray-400 mb-1">Total Price</div>
                <div className="text-3xl font-bold text-[#0A84FF]">
                  {selectedLand.price} DOGG
                </div>
              </div>

              <div className="space-y-3">
                <button
                  disabled={selectedLand.owned}
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    selectedLand.owned
                      ? "bg-[#2c2c2e] text-gray-500 cursor-not-allowed"
                      : "bg-[#0A84FF] text-white hover:bg-[#0051D5] active:scale-[0.98]"
                  }`}
                >
                  <IoWalletSharp size={20} />
                  {selectedLand.owned ? "Already Owned" : "Buy Now"}
                </button>

                {!selectedLand.owned && (
                  <button className="w-full bg-[#2c2c2e] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 border border-gray-800">
                    <IoPeopleSharp size={20} />
                    Shared Buy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
