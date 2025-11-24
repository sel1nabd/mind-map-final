/**
 * ========================================================================
 * THE 7-NETWORK BRAIN (Yeo et al., 2011)
 * ========================================================================
 *
 * This structure defines the 7 functional networks of the brain.
 *
 * User Flow:
 * 1. User sees all 7 NETWORKS
 * 2. User clicks a NETWORK → view switches to show details
 * ========================================================================
 */

export const brainStructure = {

  // ========================================
  // NETWORK 1: Visual Network (VIS)
  // ========================================
  visual_network: {
    id: 'visual_network',
    name: 'Visual Network (VIS)',
    type: 'REGION',
    description: 'Located at the back of the brain (occipital lobe). Responsible for vision, motion detection, color, and shape processing.',
    color: '#8E44AD', // Purple/Violet
    position: [0, 0.2, -1.8], // Back
    size: [2.5, 2, 1.5],
    isMainRegion: true,
    parts: [],
    functions: [
      'Primary visual processing',
      'Motion detection',
      'Color and shape recognition',
      'Depth perception',
      'Visual attention'
    ]
  },

  // ========================================
  // NETWORK 2: Somatomotor Network (SMN)
  // ========================================
  somatomotor_network: {
    id: 'somatomotor_network',
    name: 'Somatomotor Network (SMN)',
    type: 'REGION',
    description: 'Runs in an arc along the top-middle of the brain (precentral & postcentral gyri). Controls movement, touch, and body sensation.',
    color: '#3498DB', // Blue
    position: [0, 1.9, 0.2], // Top Arc
    size: [3, 1.5, 1.5],
    isMainRegion: true,
    parts: [],
    functions: [
      'Voluntary movement control',
      'Touch sensation processing',
      'Proprioception (body position)',
      'Motor planning',
      'Tactile discrimination'
    ]
  },

  // ========================================
  // NETWORK 3: Dorsal Attention Network (DAN)
  // ========================================
  dorsal_attention_network: {
    id: 'dorsal_attention_network',
    name: 'Dorsal Attention Network (DAN)',
    type: 'REGION',
    description: 'Involves superior parietal and frontal eye fields. Responsible for goal-directed attention and focusing on targets.',
    color: '#2ECC71', // Green
    position: [1.2, 1.6, -0.5], // Top-Back-Side (Lateralized for interaction)
    size: [1.5, 1.5, 1.5],
    isMainRegion: true,
    parts: [],
    functions: [
      'Goal-directed attention',
      'Top-down attentional control',
      'Spatial orientation',
      'Eye movement control',
      'Focusing on specific objects'
    ]
  },

  // ========================================
  // NETWORK 4: Ventral Attention / Salience (VAN/SAL)
  // ========================================
  ventral_attention_network: {
    id: 'ventral_attention_network',
    name: 'Ventral Attention / Salience (VAN)',
    type: 'REGION',
    description: 'Centered on the insula and anterior cingulate. Detects salient events, errors, and threats. Acts as a "switch" between networks.',
    color: '#E67E22', // Orange
    position: [1.2, 0.5, 1.0], // Front-Side (Insula area)
    size: [1.5, 1.5, 1.5],
    isMainRegion: true,
    parts: [],
    functions: [
      'Salience detection (what is important)',
      'Error detection',
      'Threat monitoring',
      'Switching between DMN and CEN',
      'Interoception (internal body states)'
    ]
  },

  // ========================================
  // NETWORK 5: Limbic Network (LIM)
  // ========================================
  limbic_network: {
    id: 'limbic_network',
    name: 'Limbic Network (LIM)',
    type: 'REGION',
    description: 'Includes orbitofrontal cortex and temporal pole. Crucial for emotional regulation and memory associations.',
    color: '#F1C40F', // Warm Yellow/Cream
    position: [0, -0.5, 0.5], // Deep/Bottom Front
    size: [1.5, 1.2, 1.5],
    isMainRegion: true,
    parts: [],
    functions: [
      'Emotional regulation',
      'Memory association',
      'Motivation and reward',
      'Olfactory processing',
      'Social behavior'
    ]
  },

  // ========================================
  // NETWORK 6: Frontoparietal Control (FPN)
  // ========================================
  frontoparietal_network: {
    id: 'frontoparietal_network',
    name: 'Frontoparietal Control (FPN)',
    type: 'REGION',
    description: 'Spans middle frontal gyrus and inferior parietal lobule. Responsible for executive function, planning, and fluid intelligence.',
    color: '#9B59B6', // Deep Purple/Blue
    position: [1.4, 1.2, 1.2], // Front-Side (DLPFC area)
    size: [1.8, 1.5, 1.5],
    isMainRegion: true,
    parts: [],
    functions: [
      'Executive function',
      'Complex planning',
      'Problem solving',
      'Fluid intelligence',
      'Working memory',
      'Cognitive flexibility'
    ]
  },

  // ========================================
  // NETWORK 7: Default Mode Network (DMN)
  // ========================================
  default_mode_network: {
    id: 'default_mode_network',
    name: 'Default Mode Network (DMN)',
    type: 'REGION',
    description: 'Includes medial prefrontal cortex, posterior cingulate, and precuneus. Active during mind-wandering, self-reflection, and autobiographical thinking.',
    color: '#E74C3C', // Red/Pink
    position: [0, 1.0, 1.8], // Front-Midline (mPFC)
    size: [2.0, 2.0, 2.0],
    isMainRegion: true,
    parts: [],
    functions: [
      'Self-referential thought',
      'Mind-wandering',
      'Autobiographical memory',
      'Thinking about the future',
      'Social cognition (Theory of Mind)'
    ]
  }
};

/**
 * Get all main REGIONS (6 total)
 */
export const getMainRegions = () => {
  return Object.values(brainStructure).filter(region => region.type === 'REGION');
};

/**
 * Get region by ID (can be a REGION or PART)
 */
export const getRegionById = (id) => {
  // Check main regions
  if (brainStructure[id]) {
    return brainStructure[id];
  }

  // Check parts within regions
  for (const mainRegion of Object.values(brainStructure)) {
    if (mainRegion.parts) {
      const part = mainRegion.parts.find(p => p.id === id);
      if (part) {
        return { ...part, parentRegion: mainRegion.id };
      }
    }
  }

  return null;
};

/**
 * Get all PARTS of a main REGION
 */
export const getParts = (mainRegionId) => {
  return brainStructure[mainRegionId]?.parts || [];
};

/**
 * Get flattened list of all regions and parts
 */
export const getAllRegionsAndParts = () => {
  const all = [];

  Object.values(brainStructure).forEach(mainRegion => {
    all.push(mainRegion);
    if (mainRegion.parts) {
      all.push(...mainRegion.parts.map(part => ({
        ...part,
        parentRegion: mainRegion.id,
        parentName: mainRegion.name
      })));
    }
  });

  return all;
};

/**
 * Search regions and parts
 */
export const searchBrain = (query) => {
  const lowerQuery = query.toLowerCase();
  const results = { regions: [], parts: [] };

  Object.values(brainStructure).forEach(region => {
    // Search in main regions
    if (region.name.toLowerCase().includes(lowerQuery) ||
        region.description.toLowerCase().includes(lowerQuery)) {
      results.regions.push(region);
    }

    // Search in parts
    if (region.parts) {
      region.parts.forEach(part => {
        if (part.name.toLowerCase().includes(lowerQuery) ||
            part.description.toLowerCase().includes(lowerQuery) ||
            part.functions.some(f => f.toLowerCase().includes(lowerQuery))) {
          results.parts.push({
            ...part,
            parentRegion: region.id,
            parentName: region.name
          });
        }
      });
    }
  });

  return results;
};

export default brainStructure;
