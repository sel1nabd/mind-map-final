import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import './App.css';
import { brainStructure, getMainRegions, getParts } from './data/brainStructure';
import { createRealisticBrainGeometry, BrainMaterial } from './components/RealisticBrainGeometry';
import { fetchRelevantLinks } from './services/perplexityService';

// Wrapper component for realistic brain geometry
function RealisticBrainMesh({ region, isHovered, isSelected }) {
  const geometry = createRealisticBrainGeometry(region);

  return (
    <>
      <primitive object={geometry} attach="geometry" />
      <BrainMaterial region={region} isHovered={isHovered} isSelected={isSelected} />
    </>
  );
}

// Brain Model Component with hierarchical interaction and realistic shapes
function BrainModel({ onRegionClick, selectedRegion, selectedMainRegion, showSubparts }) {
  const [hovered, setHovered] = useState(null);

  // Get rotation for specific regions to orient them properly
  const getRotation = (id) => {
    switch(id) {
      case 'temporal_lobe':
        return [0, 0, Math.PI / 2];
      case 'corpus_callosum':
        return [0, 0, Math.PI / 2];
      case 'hippocampus':
        return [Math.PI / 2, 0, 0];
      case 'caudate_nucleus':
        return [0, 0, Math.PI / 6];
      case 'pons':
      case 'brainstem_pons':
      case 'medulla_oblongata':
      case 'brainstem_medulla':
        return [0, 0, 0];
      default:
        return [0, 0, 0];
    }
  };

  // Get regions to display
  const getRegionsToDisplay = () => {
    if (showSubparts && selectedMainRegion) {
      return getParts(selectedMainRegion);
    } else {
      return getMainRegions();
    }
  };

  const regionsToDisplay = getRegionsToDisplay();

  return (
    <group>
      {regionsToDisplay.map((region) => (
        <mesh
          key={region.id}
          position={region.position}
          rotation={getRotation(region.id)}
          onClick={(e) => {
            e.stopPropagation();
            onRegionClick(region);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(region);
          }}
          onPointerOut={() => setHovered(null)}
          castShadow
          receiveShadow
        >
          <RealisticBrainMesh
            region={region}
            isHovered={hovered?.id === region.id}
            isSelected={selectedRegion?.id === region.id}
          />
          {hovered?.id === region.id && (
            <Html distanceFactor={10}>
              <div className="brain-tooltip">
                <div className="tooltip-type" style={{ color: region.color }}>
                  {region.type}
                </div>
                <div className="tooltip-name">{region.name}</div>
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  );
}

// Main App Component
function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMainRegion, setSelectedMainRegion] = useState(null);
  const [showSubparts, setShowSubparts] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [relevantLinks, setRelevantLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  // Fetch relevant links when a region is selected
  useEffect(() => {
    if (selectedRegion) {
      setLoadingLinks(true);
      setRelevantLinks([]);

      fetchRelevantLinks(selectedRegion.name, selectedRegion.description)
        .then(links => {
          setRelevantLinks(links);
          setLoadingLinks(false);
        })
        .catch(error => {
          console.error('Error fetching links:', error);
          setLoadingLinks(false);
        });
    } else {
      setRelevantLinks([]);
    }
  }, [selectedRegion]);

  // Auto-open info panel when region is selected
  useEffect(() => {
    if (selectedRegion) {
      setIsInfoPanelOpen(true);
    }
  }, [selectedRegion]);

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = [];

    Object.values(brainStructure).forEach(region => {
      if (region.name.toLowerCase().includes(lowerQuery)) {
        results.push({ ...region, searchType: 'REGION' });
      }

      if (region.parts) {
        region.parts.forEach(part => {
          if (part.name.toLowerCase().includes(lowerQuery) ||
              part.description.toLowerCase().includes(lowerQuery)) {
            results.push({
              ...part,
              searchType: 'PART',
              parentRegion: region.id,
              parentName: region.name
            });
          }
        });
      }
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  // Navigate to search result
  const handleSearchResultClick = (result) => {
    if (result.searchType === 'REGION') {
      setSelectedMainRegion(result.id);
      setSelectedRegion(result);
      setShowSubparts(true);
    } else {
      setSelectedMainRegion(result.parentRegion);
      setShowSubparts(true);
      setTimeout(() => setSelectedRegion(result), 100);
    }
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleRegionClick = (region) => {
    if (region.isMainRegion) {
      setSelectedMainRegion(region.id);
      setSelectedRegion(region);
      setShowSubparts(true);
    } else {
      setSelectedRegion(region);
    }
  };

  const handleBackToMainRegions = () => {
    setShowSubparts(false);
    setSelectedMainRegion(null);
    setSelectedRegion(null);
  };

  const handleClearSelection = () => {
    setSelectedRegion(null);
    setSelectedMainRegion(null);
    setShowSubparts(false);
    setIsInfoPanelOpen(false);
  };

  return (
    <div className="app-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <div className="breadcrumb-content">
          <h1 className="app-title">Mind Map</h1>
          {selectedRegion && (
            <div className="breadcrumb-path">
              <button
                className="breadcrumb-link"
                onClick={handleBackToMainRegions}
              >
                Regions
              </button>
              <span className="breadcrumb-separator">/</span>
              {showSubparts && selectedMainRegion && (
                <>
                  <span className="breadcrumb-current" style={{ color: brainStructure[selectedMainRegion]?.color }}>
                    {brainStructure[selectedMainRegion]?.name}
                  </span>
                  {selectedRegion.type === 'PART' && (
                    <>
                      <span className="breadcrumb-separator">/</span>
                      <span className="breadcrumb-current" style={{ color: selectedRegion.color }}>
                        {selectedRegion.name}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#8080ff" />
          <directionalLight position={[5, -5, 5]} intensity={0.4} color="#ff8080" />
          <hemisphereLight
            skyColor="#ffffff"
            groundColor="#444444"
            intensity={0.5}
          />
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />
          <pointLight position={[0, -10, 0]} intensity={0.3} color="#4444ff" />
          <spotLight
            position={[15, 15, 15]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            castShadow
          />
          <Environment preset="studio" />
          <fog attach="fog" args={['#1a1a2e', 15, 30]} />

          <Suspense fallback={null}>
            <BrainModel
              onRegionClick={handleRegionClick}
              selectedRegion={selectedRegion}
              selectedMainRegion={selectedMainRegion}
              showSubparts={showSubparts}
            />
          </Suspense>
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            enableDamping
            dampingFactor={0.08}
            minDistance={5}
            maxDistance={20}
            enablePan={true}
            maxPolarAngle={Math.PI}
          />
        </Canvas>
      </div>

      {/* Bottom Control Bar */}
      <div className="control-bar">
        <div className="control-bar-content">
          {/* Search */}
          <div className="search-wrapper">
            <div className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search brain regions..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {showSearchResults && (
              <div className="search-dropdown">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    className="search-result"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <div className="search-result-badge" style={{
                      backgroundColor: result.color,
                      opacity: result.searchType === 'REGION' ? 1 : 0.7
                    }}></div>
                    <div className="search-result-content">
                      <div className="search-result-name">{result.name}</div>
                      <div className="search-result-type">
                        {result.searchType === 'PART' ? `Part of ${result.parentName}` : 'Main Region'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="control-buttons">
            {showSubparts && (
              <button className="control-btn control-btn-secondary" onClick={handleBackToMainRegions}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            <button
              className={`control-btn ${autoRotate ? 'control-btn-active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              Rotate
            </button>
            {selectedRegion && (
              <button className="control-btn control-btn-secondary" onClick={handleClearSelection}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
            <button
              className={`control-btn ${isInfoPanelOpen ? 'control-btn-active' : ''}`}
              onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Info
            </button>
          </div>

          {/* Region List */}
          <div className="region-selector">
            <div className="region-list">
              {(showSubparts ? getParts(selectedMainRegion) : getMainRegions()).map((item) => (
                <button
                  key={item.id}
                  className={`region-chip ${selectedRegion?.id === item.id ? 'region-chip-active' : ''}`}
                  onClick={() => handleRegionClick(item)}
                  style={{
                    '--region-color': item.color
                  }}
                >
                  <span className="region-chip-dot" style={{ backgroundColor: item.color }}></span>
                  <span className="region-chip-name">{item.name}</span>
                  {item.type === 'REGION' && !showSubparts && (
                    <span className="region-chip-count">{getParts(item.id).length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel Drawer */}
      <div className={`info-drawer ${isInfoPanelOpen ? 'info-drawer-open' : ''}`}>
        <button className="info-drawer-close" onClick={() => setIsInfoPanelOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="info-drawer-content">
          {selectedRegion ? (
            <>
              {/* Region Header */}
              <div className="info-header">
                <div className="info-badge" style={{ backgroundColor: selectedRegion.color }}>
                  {selectedRegion.type}
                </div>
                <h2 className="info-title">{selectedRegion.name}</h2>
                <p className="info-description">{selectedRegion.description}</p>
              </div>

              {/* Functions */}
              {selectedRegion.functions && selectedRegion.functions.length > 0 && (
                <div className="info-section">
                  <h3 className="info-section-title">Key Functions</h3>
                  <ul className="info-function-list">
                    {selectedRegion.functions.map((func, idx) => (
                      <li key={idx} className="info-function-item">
                        <span className="info-function-dot" style={{ backgroundColor: selectedRegion.color }}></span>
                        {func}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Region Info Notice */}
              {selectedRegion.type === 'REGION' && (
                <div className="info-notice" style={{ borderColor: selectedRegion.color }}>
                  <div className="info-notice-title" style={{ color: selectedRegion.color }}>
                    Exploring Main Region
                  </div>
                  <p>This region contains {getParts(selectedRegion.id).length} distinct parts. The view now shows these parts for detailed exploration.</p>
                </div>
              )}

              {/* Part Info Notice */}
              {selectedRegion.type === 'PART' && selectedRegion.partOf && (
                <div className="info-notice">
                  <div className="info-notice-title">Part of:</div>
                  <p>{selectedRegion.partOf}</p>
                </div>
              )}

              {/* Educational Resources */}
              <div className="info-section">
                <h3 className="info-section-title">Educational Resources</h3>
                {loadingLinks ? (
                  <div className="info-loading">
                    <div className="spinner"></div>
                    <p>Fetching relevant resources...</p>
                  </div>
                ) : relevantLinks.length > 0 ? (
                  <div className="info-links">
                    {relevantLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-link"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                        </svg>
                        <span>{link.title}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="info-empty">No resources available at the moment.</p>
                )}
              </div>
            </>
          ) : (
            <div className="info-welcome">
              <div className="info-welcome-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              {showSubparts ? (
                <>
                  <h3 className="info-welcome-title">
                    Exploring: {brainStructure[selectedMainRegion]?.name}
                  </h3>
                  <p className="info-welcome-text">
                    Click on any part in the visualization or select from the list below to see detailed information.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="info-welcome-title">Welcome to Mind Map</h3>
                  <p className="info-welcome-text">
                    Explore the brain's 6 main regions and their constituent parts. Click on any region to begin your journey.
                  </p>
                  <div className="info-welcome-guide">
                    <h4>Navigation Guide</h4>
                    <ul>
                      <li>Drag to rotate the brain</li>
                      <li>Scroll to zoom in and out</li>
                      <li>Click a region to explore its parts</li>
                      <li>Use search to find specific structures</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Background Overlay when drawer is open */}
      {isInfoPanelOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsInfoPanelOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;
