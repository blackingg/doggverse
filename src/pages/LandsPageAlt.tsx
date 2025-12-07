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
import { useAppData } from "../context/AppDataContext";

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

  const { wallet, islands, lands, soldLands, purchaseLand } = useAppData();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

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

    // Create multiple islands using centralized data
    const gridGroup = new THREE.Group();
    const islandSize = 5;

    // Build cubes from centralized lands data
    lands.forEach((land) => {
      const island = islands.find(i => i.name === land.island);
      if (!island) return;

      const geometry = new THREE.BoxGeometry(cellSize - 6, 25, cellSize - 6);
      
      const material = new THREE.MeshLambertMaterial({
        color: land.originalColor,
        transparent: true,
        opacity: 0.9,
        emissive: new THREE.Color(0x000000),
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (land.gridX - islandSize / 2 + 0.5) * cellSize + island.offsetX,
        12.5,
        (land.gridY - islandSize / 2 + 0.5) * cellSize + island.offsetZ
      );
      cube.castShadow = true;
      cube.receiveShadow = true;

      // Set userData to the land data
      cube.userData = land;

      cube.material.color.setHex(land.originalColor);
      cube.material.emissive.setHex(land.originalEmissive);

      if (soldLands.has(land.id)) {
        // Make sold lands dark and muted with subtle red glow
        cube.material.color.setHex(0x2c2c2e);
        cube.material.emissive.setHex(0x4a1f1f);
        cube.material.opacity = 0.7;
      }

      (cube as any).originalY = cube.position.y;
      (cube as any).hovered = false;
      landParcels.push(cube);
      gridGroup.add(cube);
    });

    // Create platforms for each island
    islands.forEach((island) => {
      const platformSize = islandSize * cellSize + 100;
      const platformHeight = 60;
      const platformGeometry = new THREE.BoxGeometry(
        platformSize,
        platformHeight,
        platformSize
      );
      const platformMaterial = new THREE.MeshLambertMaterial({ 
        color: island.platformColor,
        transparent: true,
        opacity: 0.8,
      });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.set(island.offsetX, -platformHeight / 2, island.offsetZ);
      platform.receiveShadow = true;
      gridGroup.add(platform);
    });

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

    // Touch event handlers for mobile support
    let lastTouchDistance = 0;
    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };
    let touchMoved = false;
    
    const onTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      const rect = canvasRef.current!.getBoundingClientRect();
      touchStartTime = Date.now();
      touchMoved = false;

      if (event.touches.length === 1) {
        // Single touch - prepare for rotation
        const touch = event.touches[0];
        controls.lastMouse.x = touch.clientX - rect.left;
        controls.lastMouse.y = touch.clientY - rect.top;
        touchStartPos.x = controls.lastMouse.x;
        touchStartPos.y = controls.lastMouse.y;
        controls.isRotating = true;
      } else if (event.touches.length === 2) {
        // Two fingers - prepare for pinch zoom
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
        controls.isRotating = false;
        touchMoved = true; // Pinch is always movement
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const rect = canvasRef.current!.getBoundingClientRect();

      if (event.touches.length === 1 && controls.isRotating) {
        // Single touch - rotate
        const touch = event.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        const deltaX = touchX - controls.lastMouse.x;
        const deltaY = touchY - controls.lastMouse.y;

        // Mark as moved if movement is significant (> 5px)
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          touchMoved = true;
        }

        if (touchMoved) {
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

        controls.lastMouse.x = touchX;
        controls.lastMouse.y = touchY;
      } else if (event.touches.length === 2) {
        // Two fingers - pinch zoom
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastTouchDistance > 0) {
          const delta = (lastTouchDistance - distance) * 2;
          const currentDistance = camera.position.distanceTo(controls.target);
          const newDistance = Math.max(200, Math.min(2000, currentDistance + delta));
          const direction = new THREE.Vector3();
          direction.subVectors(camera.position, controls.target).normalize();
          camera.position
            .copy(controls.target)
            .add(direction.multiplyScalar(newDistance));
        }

        lastTouchDistance = distance;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      event.preventDefault();
      const touchDuration = Date.now() - touchStartTime;

      // If it was a quick tap (< 300ms) with no significant movement, treat as click
      if (touchDuration < 300 && event.changedTouches.length === 1 && !touchMoved) {
        const touch = event.changedTouches[0];
        const rect = canvasRef.current!.getBoundingClientRect();
        
        mouse.x = ((touch.clientX - rect.left) / canvasRef.current!.clientWidth) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / canvasRef.current!.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          landParcels.filter((p) => p.visible)
        );

        if (intersects.length > 0) {
          selectedParcel = intersects[0].object as THREE.Mesh;
          setSelectedLand(selectedParcel.userData as LandData);
          setShowBuyModal(true);
        }
      }

      controls.isRotating = false;
      controls.isPanning = false;
      lastTouchDistance = 0;
      touchMoved = false;
    };

    // Add mouse event listeners
    canvasRef.current.addEventListener("mousedown", onMouseDown);
    canvasRef.current.addEventListener("mousemove", onMouseMove);
    canvasRef.current.addEventListener("mouseup", onMouseUp);
    canvasRef.current.addEventListener("click", onClick);
    canvasRef.current.addEventListener("wheel", onWheel);
    canvasRef.current.addEventListener("contextmenu", (e) =>
      e.preventDefault()
    );

    // Add touch event listeners
    canvasRef.current.addEventListener("touchstart", onTouchStart, { passive: false });
    canvasRef.current.addEventListener("touchmove", onTouchMove, { passive: false });
    canvasRef.current.addEventListener("touchend", onTouchEnd, { passive: false });

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
      canvasRef.current?.removeEventListener("touchstart", onTouchStart);
      canvasRef.current?.removeEventListener("touchmove", onTouchMove);
      canvasRef.current?.removeEventListener("touchend", onTouchEnd);
    };
  }, [lands, islands, soldLands]);

  useEffect(() => {
    if (!sceneRef.current) return;
    const { landParcels } = sceneRef.current;

    // Helper function to blend two colors
    const blendColors = (color1: number, color2: number, ratio: number) => {
      const r1 = (color1 >> 16) & 0xff;
      const g1 = (color1 >> 8) & 0xff;
      const b1 = color1 & 0xff;
      
      const r2 = (color2 >> 16) & 0xff;
      const g2 = (color2 >> 8) & 0xff;
      const b2 = color2 & 0xff;
      
      const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
      
      return (r << 16) | (g << 8) | b;
    };

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
        // Blend original color with filter effect
        if (filter === "owned") {
          // Red highlight for sold items
          material.color.setHex(0xff4444);
          material.emissive.setHex(0xaa0000);
          material.opacity = 1.0;
        } else if (filter === "premium") {
          // Golden highlight blended with original color
          const blendedColor = blendColors(parcel.userData.originalColor, 0xffd700, 0.5);
          material.color.setHex(blendedColor);
          material.emissive.setHex(0xaa8800);
          material.opacity = 1.0;
        } else if (filter === "available") {
          // Brighten the original color for available filter
          const island = parcel.userData.island;
          let boostColor = 0xffffff;
          
          // Different boost based on island
          if (island === "TONVERSE") {
            boostColor = 0x60a5fa;
          } else if (island === "Notverse") {
            boostColor = 0x4ade80; 
          } else if (island === "Xverse") {
            boostColor = 0xc084fc;
          }
          
          const blendedColor = blendColors(parcel.userData.originalColor, boostColor, 0.4);
          material.color.setHex(blendedColor);
          material.emissive.setHex(parcel.userData.originalEmissive);
          material.opacity = 1.0;
        }
      } else {
        // Restore original colors
        if (parcel.userData.owned) {
          material.color.setHex(0x2c2c2e);
          material.emissive.setHex(0x4a1f1f);
          material.opacity = 0.7;
        } else {
          material.color.setHex(parcel.userData.originalColor);
          material.emissive.setHex(parcel.userData.originalEmissive);
          material.opacity = 0.9;
        }
      }
    });
  }, [filter]);

  return (
    <div className="pb-20 bg-[#000000] min-h-screen">
      <Header
        title="Land Marketplace"
        balance={wallet.balance}
      />

      <div
        ref={containerRef}
        className="relative w-full h-[70vh] border-b border-gray-800"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />

        <div className="absolute top-4 left-4 bg-[#1c1c1e]/90 backdrop-blur-sm border border-gray-800 rounded-xl px-3 py-2 max-w-[220px]">
          <p className="text-xs text-gray-400">
            <span className="text-[#0A84FF] font-semibold">Swipe</span> to rotate • <span className="text-[#0A84FF] font-semibold">Pinch</span> to zoom • <span className="text-[#0A84FF] font-semibold">Tap</span> to select
          </p>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="w-12 h-12 bg-[#1c1c1e]/90 backdrop-blur-sm border border-gray-800 rounded-xl flex items-center justify-center text-white hover:bg-[#2c2c2e] transition-all active:scale-95 shadow-lg"
          >
            <IoSearchSharp size={20} className={showFilterDropdown ? "text-[#0A84FF]" : "text-white"} />
          </button>

          {showFilterDropdown && (
            <div className="absolute top-14 right-0 bg-[#1c1c1e]/95 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden min-w-[180px] shadow-2xl animate-[slideDown_0.2s_ease-out]">
              {[
                { id: "all", label: "All Lands", Icon: IoGlobeSharp },
                {
                  id: "available",
                  label: "Available",
                  Icon: IoCheckmarkCircle,
                },
                { id: "owned", label: "Sold", Icon: IoLockClosedSharp },
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
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 text-sm ${
                      filter === f.id
                        ? "bg-[#0A84FF] text-white"
                        : "text-gray-300 hover:bg-[#2c2c2e]"
                    } transition-all active:scale-95`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{f.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1c1c1e]/95 backdrop-blur-md border border-gray-800 rounded-xl px-4 py-3 shadow-lg">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30"></div>
              <span className="text-gray-300 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#2c2c2e] shadow-lg shadow-red-900/40 border border-red-900/50"></div>
              <span className="text-gray-300 font-medium">Sold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30"></div>
              <span className="text-gray-300 font-medium">Premium</span>
            </div>
          </div>
        </div>
      </div>

      {showBuyModal && selectedLand && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setShowBuyModal(false)}
        >
          <div 
            className="bg-[#1c1c1e] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md animate-[slideUp_0.3s_ease-out] border-t sm:border border-gray-800 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Land Details</h3>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="w-10 h-10 bg-[#2c2c2e] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3c3c3e] transition-all active:scale-95"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="w-20 h-20 bg-gradient-to-br from-[#0A84FF]/20 to-[#0051D5]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#0A84FF]/30">
                <IoMapSharp
                  size={40}
                  className="text-[#0A84FF]"
                />
              </div>

              <div className="bg-[#000000] rounded-2xl p-5 mb-6 border border-gray-800 space-y-4">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Island</span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    selectedLand.island === "TONVERSE" 
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : selectedLand.island === "Notverse"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  }`}>
                    {selectedLand.island}
                  </span>
                </div>
                <div className="h-px bg-gray-800"></div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Plot ID</span>
                  <span className="text-white font-bold text-base">
                    {selectedLand.id}
                  </span>
                </div>
                <div className="h-px bg-gray-800"></div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Size</span>
                  <span className="text-white font-semibold">114 × 114</span>
                </div>
                <div className="h-px bg-gray-800"></div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Type</span>
                  <div className="flex items-center gap-2">
                    {selectedLand.type === "Premium" && (
                      <IoStarSharp size={14} className="text-yellow-500" />
                    )}
                    <span className={`font-semibold ${selectedLand.type === "Premium" ? "text-yellow-500" : "text-white"}`}>
                      {selectedLand.type}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-gray-800"></div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      selectedLand.owned
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}
                  >
                    {selectedLand.owned ? "Sold Out" : "Available"}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0A84FF]/30 via-[#0A84FF]/20 to-[#0051D5]/30 rounded-2xl p-6 mb-6 border border-[#0A84FF]/40 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
                <div className="relative">
                  <div className="text-sm text-gray-300 mb-2 font-medium">Total Price</div>
                  <div className="text-4xl font-black text-[#0A84FF] drop-shadow-[0_0_10px_rgba(10,132,255,0.5)]">
                    {selectedLand.price}
                  </div>
                  <div className="text-sm text-gray-400 mt-1 font-medium">DOGG</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  disabled={selectedLand.owned}
                  onClick={async () => {
                    if (!selectedLand.owned) {
                      const success = await purchaseLand(selectedLand.id, selectedLand.price);
                      if (success) {
                        setShowBuyModal(false);
                      }
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    selectedLand.owned
                      ? "bg-[#2c2c2e] text-gray-600 cursor-not-allowed border border-gray-800"
                      : "bg-gradient-to-r from-[#0A84FF] to-[#0051D5] text-white hover:shadow-lg hover:shadow-[#0A84FF]/30 active:scale-[0.98]"
                  }`}
                >
                  <IoWalletSharp size={22} />
                  {selectedLand.owned ? "Already Sold" : "Buy Now"}
                </button>

                {!selectedLand.owned && (
                  <button className="w-full bg-[#2c2c2e] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-gray-700 hover:bg-[#3c3c3e]">
                    <IoPeopleSharp size={20} />
                    Shared Buy
                  </button>
                )}
              </div>

              {selectedLand.owned && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    This land has been sold to another user
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Marketplace Overview</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <IoGlobeSharp size={18} className="text-[#0A84FF]" />
              <span className="text-xs text-gray-400 font-medium">Total Lands</span>
            </div>
            <div className="text-2xl font-black text-white">75</div>
            <div className="text-xs text-gray-500 mt-0.5">Across 3 islands</div>
          </div>

          <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <IoCheckmarkCircle size={18} className="text-green-500" />
              <span className="text-xs text-gray-400 font-medium">Available</span>
            </div>
            <div className="text-2xl font-black text-green-400">
              {sceneRef.current?.landParcels.filter(p => !p.userData.owned).length || 60}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <IoLockClosedSharp size={18} className="text-red-500" />
              <span className="text-xs text-gray-400 font-medium">Sold</span>
            </div>
            <div className="text-2xl font-black text-red-400">
              {sceneRef.current?.landParcels.filter(p => p.userData.owned).length || 15}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <IoStarSharp size={18} className="text-yellow-500" />
              <span className="text-xs text-gray-400 font-medium">Avg. Price</span>
            </div>
            <div className="text-2xl font-black text-[#0A84FF]">1.2K</div>
            <div className="text-xs text-gray-500 mt-0.5">DOGG</div>
          </div>
        </div>

        <div className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3">Islands</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-sm text-gray-300">TONVERSE</span>
              </div>
              <span className="text-xs text-gray-500">25 plots</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-sm text-gray-300">Notverse</span>
              </div>
              <span className="text-xs text-gray-500">25 plots</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span className="text-sm text-gray-300">Xverse</span>
              </div>
              <span className="text-xs text-gray-500">25 plots</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#0A84FF]/20 via-[#0A84FF]/10 to-transparent border border-[#0A84FF]/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#0A84FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <IoMapSharp size={20} className="text-[#0A84FF]" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">Own Your Piece of Doggverse</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Choose from three unique metaverse islands: TONVERSE (blue), Notverse (green), and Xverse (purple). Each plot is unique and can be customized. Premium lands offer exclusive benefits.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button 
            onClick={() => setFilter("available")}
            className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 active:scale-95 transition-all hover:border-gray-700">
            <div className="w-10 h-10 bg-[#0A84FF]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <IoSearchSharp size={20} className="text-[#0A84FF]" />
            </div>
            <div className="text-sm font-semibold text-white">Explore Lands</div>
            <div className="text-xs text-gray-500 mt-1">Browse available plots</div>
          </button>

          <button 
            onClick={() => setFilter("premium")}
            className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 active:scale-95 transition-all hover:border-gray-700">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <IoStarSharp size={20} className="text-yellow-500" />
            </div>
            <div className="text-sm font-semibold text-white">Premium Only</div>
            <div className="text-xs text-gray-500 mt-1">View exclusive lands</div>
          </button>
        </div>
      </div>
    </div>
  );
};
