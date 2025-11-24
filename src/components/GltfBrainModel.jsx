import { useRef, useState, useEffect, useMemo } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { brainStructure, getMainRegions } from '../data/brainStructure';

/**
 * GLTF Brain Model Component
 * Loads and renders a 3D brain model from a GLTF/GLB file
 * with interactive regions mapped to the brain structure data.
 * 
 * IMPROVEMENTS:
 * - Robust spatial mapping for meshes without proper names
 * - Normalized scaling to ensure model aligns with data coordinates
 * - Optimized material handling (no recreation on render)
 * - Raycasting-based interaction for better precision
 */
export function GltfBrainModel({
  onRegionClick,
  selectedRegion,
  modelPath = '/models/brainmodel.glb'
}) {
  const groupRef = useRef();
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [meshes, setMeshes] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [scale, setScale] = useState(0.12);
  const [meshRegionMap, setMeshRegionMap] = useState(new Map());
  const pulseRef = useRef(0);
  const { camera, raycaster, pointer } = useThree();

  // Load the GLTF model
  const { scene } = useGLTF(modelPath);

  // Animate pulsing effect for selected regions
  useFrame((state, delta) => {
    pulseRef.current += delta;
  });

  // Handle responsive scaling based on window size
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const minDimension = Math.min(width, height);
      let newScale;

      // Adjusted scales for Normalized Model (Size ~4 units)
      if (minDimension < 400) newScale = 2.5;       // Small mobile
      else if (minDimension < 600) newScale = 2.8;  // Mobile
      else if (minDimension < 768) newScale = 3.2;  // Tablet Portrait
      else if (minDimension < 1024) newScale = 3.8; // Tablet Landscape
      else newScale = 4.2;                          // Desktop

      const aspectRatio = width / height;
      if (aspectRatio < 0.6) newScale *= 0.8;       // Tall screens
      else if (aspectRatio < 0.75) newScale *= 0.9;
      else if (aspectRatio > 2.5) newScale *= 1.1;  // Ultra wide

      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Process model: Extract meshes, Center, Normalize Size, and Map to Regions
  useEffect(() => {
    if (scene) {
      const extractedMeshes = [];
      const newMeshRegionMap = new Map();

      // 1. Extract all meshes and bake their world transforms into the geometry
      // This ensures that even if the GLTF has a complex hierarchy, we get the correct "visual" position
      scene.updateMatrixWorld(true);
      
      scene.traverse((child) => {
        if (child.isMesh) {
          // Clone geometry and apply world matrix
          const geometry = child.geometry.clone();
          geometry.applyMatrix4(child.matrixWorld);
          
          // Create a new mesh with identity transform
          const newMesh = new THREE.Mesh(geometry, child.material ? child.material.clone() : undefined);
          newMesh.userData = { ...child.userData };
          newMesh.name = child.name; // Preserve name for mapping
          newMesh.castShadow = true;
          newMesh.receiveShadow = true;
          
          extractedMeshes.push(newMesh);
        }
      });

      if (extractedMeshes.length === 0) return;

      // 2. Calculate bounds of the entire extracted brain
      const totalBox = new THREE.Box3();
      extractedMeshes.forEach(mesh => {
        mesh.geometry.computeBoundingBox();
        totalBox.union(mesh.geometry.boundingBox);
      });

      const center = new THREE.Vector3();
      totalBox.getCenter(center);
      const size = new THREE.Vector3();
      totalBox.getSize(size);
      
      // 3. Normalize: Center at (0,0,0) and Scale to fit ~4 units
      const maxDim = Math.max(size.x, size.y, size.z);
      const normalizationScale = 4.0 / (maxDim || 1); // Avoid divide by zero

      extractedMeshes.forEach((mesh, index) => {
        // Translate to center
        mesh.geometry.translate(-center.x, -center.y, -center.z);
        // Scale to normalize
        mesh.geometry.scale(normalizationScale, normalizationScale, normalizationScale);
        
        // Recompute bounds for mapping
        mesh.geometry.computeBoundingBox();
        
        // Map to region
        const region = mapMeshToRegion(mesh, index);
        if (region) {
          newMeshRegionMap.set(mesh.uuid, region);
          mesh.userData.regionId = region.id;
        }
      });

      setMeshes(extractedMeshes);
      setMeshRegionMap(newMeshRegionMap);
      setModelLoaded(true);
      
      console.log(`Loaded and normalized brain model. Meshes: ${extractedMeshes.length}`);
    }
  }, [scene]);

  // Map mesh to brain region based on name or spatial position
  const mapMeshToRegion = (mesh, index) => {
    const meshName = mesh.name.toLowerCase();
    
    // Determine which regions are currently relevant
    const regionsToDisplay = getMainRegions();

    // 1. Try Name Matching
    for (const region of regionsToDisplay) {
      const regionName = region.name.toLowerCase();
      const regionId = region.id.toLowerCase();
      
      // Check exact and partial matches
      if (meshName.includes(regionId) || 
          meshName.includes(regionName.replace(/\s+/g, '')) ||
          meshName.includes(regionName.split(' ')[0])) {
        return region;
      }
    }

    // 2. Try Spatial Matching (Centroid Proximity)
    // Calculate mesh center in world space
    const geometry = mesh.geometry;
    geometry.computeBoundingBox();
    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    // Note: mesh.position is (0,0,0) because we baked transforms, so 'center' is the actual world position

    let closestRegion = null;
    let minDistance = Infinity;

    for (const region of regionsToDisplay) {
      // brainStructure positions are [x, y, z]
      const regionPos = new THREE.Vector3(...region.position);
      
      // Weight the distance by region size to prefer larger regions for ambiguous meshes
      // (Optional refinement)
      const distance = center.distanceTo(regionPos);

      if (distance < minDistance) {
        minDistance = distance;
        closestRegion = region;
      }
    }

    // Threshold for spatial matching
    // Increased threshold because normalized brain is ~4 units wide, so 3.0 covers most of it
    if (closestRegion && minDistance < 5.0) {
      return closestRegion;
    }

    // 3. Fallback: Distribute evenly if all else fails
    if (regionsToDisplay.length > 0) {
      return regionsToDisplay[index % regionsToDisplay.length];
    }

    return brainStructure.default_mode_network;
  };

  // Real-time Raycast Mapping
  // Instead of relying on pre-mapped meshes, we check where the cursor is
  // and find the closest region to that point in 3D space.
  const handlePointerMove = (e) => {
    // Get intersection point
    const point = e.point; // World space intersection point
    
    // Find closest region to this point
    const regionsToDisplay = getMainRegions();

    let closest = null;
    let minDist = Infinity;

    // Convert point to local space if needed (but our meshes are at 0,0,0 world)
    // The point is already in world space, and our normalized meshes are centered at 0,0,0
    // The brainStructure positions are relative to this center.
    
    // We need to account for the group scale!
    // The point is in world space. The regions are defined in "normalized model space" (approx -2 to 2).
    // The group is scaled by `scale` (approx 4.2).
    // So we need to divide the world point by `scale` to compare with brainStructure positions.
    const localPoint = point.clone().divideScalar(scale);

    for (const region of regionsToDisplay) {
      const regionPos = new THREE.Vector3(...region.position);
      const dist = localPoint.distanceTo(regionPos);
      
      if (dist < minDist) {
        minDist = dist;
        closest = region;
      }
    }

    if (closest && minDist < 2.0) { // Threshold in normalized space - Reduced for better precision
      setHoveredRegion(closest);
      document.body.style.cursor = 'pointer';
    } else {
      setHoveredRegion(null);
      document.body.style.cursor = 'auto';
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (hoveredRegion && onRegionClick) {
      onRegionClick(hoveredRegion);
    }
  };

  // Memoized Materials to prevent recreation on every frame
  const materials = useMemo(() => {
    const mats = new Map();
    
    meshes.forEach(mesh => {
      // We still use the mesh-based map for base coloring if available, 
      // but interaction is now raycast-based.
      const region = meshRegionMap.get(mesh.uuid);
      const isSelected = selectedRegion && (selectedRegion.id === region?.id);
      
      // Base material (clone original or create new)
      const material = mesh.userData.originalMaterial 
        ? mesh.userData.originalMaterial.clone() 
        : new THREE.MeshStandardMaterial({
            color: region?.color || '#cccccc',
            roughness: 0.4,
            metalness: 0.1
          });

      // Apply visual states
      if (isSelected) {
        material.emissive = new THREE.Color(region?.color).multiplyScalar(0.5);
        material.color = new THREE.Color(region?.color).multiplyScalar(1.2);
        material.opacity = 1;
        material.transparent = false;
      } else if (selectedRegion) {
        // Dim others
        material.color = new THREE.Color('#555555');
        material.opacity = 0.3;
        material.transparent = true;
      } else {
        // Default state
        material.color = new THREE.Color(region?.color || '#cccccc');
        material.opacity = 1;
        material.transparent = false;
      }

      mats.set(mesh.uuid, material);
    });
    return mats;
  }, [meshes, meshRegionMap, selectedRegion]);

  if (!modelLoaded || meshes.length === 0) {
    return (
      <Html center>
        <div style={{ color: 'white', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '8px' }}>
          Loading Brain Model...
        </div>
      </Html>
    );
  }

  return (
    <group ref={groupRef} scale={scale}>
      {meshes.map((mesh) => (
        <mesh
          key={mesh.uuid}
          geometry={mesh.geometry}
          material={materials.get(mesh.uuid)}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}
          onPointerMove={handlePointerMove}
          onPointerOut={() => setHoveredRegion(null)}
          onClick={handleClick}
          castShadow
          receiveShadow
        />
      ))}

      {/* EXTERNAL OVERLAY HIGHLIGHTING */}
      {/* This renders a separate glowing sphere at the detected region's position */}
      {hoveredRegion && (
        <group position={hoveredRegion.position}>
          {/* Inner Glow Core */}
          <mesh>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshBasicMaterial 
              color={hoveredRegion.color} 
              transparent 
              opacity={0.3} 
              depthWrite={false}
            />
          </mesh>
          
          {/* Outer Glow Shell */}
          <mesh>
            <sphereGeometry args={[1.6, 32, 32]} />
            <meshBasicMaterial 
              color={hoveredRegion.color} 
              transparent 
              opacity={0.1} 
              depthWrite={false}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Floating Label */}
          <Html position={[0, 1.5, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
            <div className="brain-tooltip" style={{ 
              borderColor: hoveredRegion.color,
              boxShadow: `0 0 25px ${hoveredRegion.color}60`
            }}>
              <div className="tooltip-type" style={{ color: hoveredRegion.color }}>
                {hoveredRegion.type}
              </div>
              <div className="tooltip-name">{hoveredRegion.name}</div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// Preload
useGLTF.preload('/models/brainmodel.glb');
