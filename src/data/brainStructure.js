/**
 * ========================================================================
 * SEVEN FUNCTIONAL BRAIN NETWORKS
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
    description: 'Occupies primary and secondary occipital cortex (V1-V4) plus the ventral visual stream. Transforms retinal input into detailed maps of edges, color, motion, and depth that guide perception and action.',
    color: '#8E44AD', // Purple/Violet
    position: [0, 0.2, -1.8], // Back
    size: [2.5, 2, 1.5],
    isMainRegion: true,
    parts: [],
    anatomicalLocation: 'Posterior occipital cortex, calcarine sulcus, lingual and fusiform gyri',
    keyRegions: ['Primary Visual Cortex (V1)', 'Extrastriate Cortex (V2-V4)', 'Middle Temporal Area (MT/V5)', 'Fusiform Face Area'],
    clinicalRelevance: 'Damage can cause visual field defects, motion blindness, or prosopagnosia (face blindness). Occipital lobe lesions impair conscious vision.',
    functions: [
      'Encodes edges, contrast, and orientation in early visual cortex (V1/V2)',
      'Detects motion speed and direction for navigation (MT/V5)',
      'Processes color, faces, and complex shapes along the ventral stream',
      'Maintains visual field maps that support eye-hand coordination',
      'Supports visual imagery when recalling scenes or planning movements'
    ]
  },

  // ========================================
  // NETWORK 2: Somatomotor Network (SMN)
  // ========================================
  somatomotor_network: {
    id: 'somatomotor_network',
    name: 'Somatomotor Network (SMN)',
    type: 'REGION',
    description: 'Forms a horseshoe along the precentral (motor) and postcentral (somatosensory) gyri. Integrates muscle commands with touch and proprioceptive feedback to keep the body coordinated.',
    color: '#3498DB', // Blue
    position: [0, 1.9, 0.2], // Top Arc
    size: [3, 1.5, 1.5],
    isMainRegion: true,
    parts: [],
    anatomicalLocation: 'Precentral gyrus (motor cortex), postcentral gyrus (somatosensory cortex), paracentral lobule',
    keyRegions: ['Primary Motor Cortex (M1)', 'Primary Somatosensory Cortex (S1)', 'Supplementary Motor Area', 'Premotor Cortex'],
    clinicalRelevance: 'Strokes here cause contralateral weakness or paralysis. Seizures can trigger involuntary movements. Essential for rehabilitation after motor injuries.',
    functions: [
      'Drives voluntary limb, face, and speech movements from primary motor cortex',
      'Maps tactile input from the skin to the primary somatosensory cortex homunculus',
      'Combines proprioception with motor plans to maintain posture and gait',
      'Supports fine hand control and tool use through premotor areas',
      'Links rehearsed movements to cerebellar timing for smooth execution'
    ]
  },

  // ========================================
  // NETWORK 3: Dorsal Attention Network (DAN)
  // ========================================
  dorsal_attention_network: {
    id: 'dorsal_attention_network',
    name: 'Dorsal Attention Network (DAN)',
    type: 'REGION',
    description: 'Links the superior parietal lobule, intraparietal sulcus, and frontal eye fields. Keeps attention anchored on task-relevant objects and steers the eyes and hands toward them.',
    color: '#2ECC71', // Green
    position: [1.2, 1.6, -0.5], // Top-Back-Side (Lateralized for interaction)
    size: [1.5, 1.5, 1.5],
    isMainRegion: true,
    parts: [],
    anatomicalLocation: 'Superior parietal lobule, intraparietal sulcus, frontal eye fields (dorsal premotor cortex)',
    keyRegions: ['Frontal Eye Fields (FEF)', 'Intraparietal Sulcus (IPS)', 'Superior Parietal Lobule (SPL)'],
    clinicalRelevance: 'Damage causes spatial neglect (ignoring one side of space) or difficulty with goal-directed eye movements. Critical for attention in ADHD research.',
    functions: [
      'Builds top-down \"priority maps\" for visual search and reading',
      'Plans saccades and coordinated reaches toward selected targets',
      'Shifts covert attention across the visual field without moving the eyes',
      'Stabilises visuospatial working memory during math, coding, or drawing',
      'Suppresses distractions so goal-relevant sensory input is amplified'
    ]
  },

  // ========================================
  // NETWORK 4: Ventral Attention / Salience (VAN/SAL)
  // ========================================
  ventral_attention_network: {
    id: 'ventral_attention_network',
    name: 'Ventral Attention / Salience (VAN)',
    type: 'REGION',
    description: 'Anchored in the anterior insula and dorsal anterior cingulate. Monitors the body and environment for salient, urgent changes and rapidly reallocates attention when something important happens.',
    color: '#E67E22', // Orange
    position: [1.2, 0.5, 1.0], // Front-Side (Insula area)
    size: [1.5, 1.5, 1.5],
    isMainRegion: true,
    parts: [],
    anatomicalLocation: 'Anterior insula, dorsal anterior cingulate cortex (dACC), inferior frontal gyrus',
    keyRegions: ['Anterior Insula', 'Dorsal Anterior Cingulate Cortex', 'Supramarginal Gyrus', 'Temporoparietal Junction'],
    clinicalRelevance: 'Implicated in anxiety disorders, PTSD, and chronic pain. Hyperactivity linked to panic attacks; hypoactivity seen in alexithymia (difficulty identifying emotions).',
    functions: [
      'Detects novel sights, sounds, or feelings that demand immediate attention',
      'Generates prediction-error signals when performance slips or surprises occur',
      'Tracks interoceptive cues such as heart rate and gut feelings',
      'Triggers switches between inward-focused (DMN) and task-focused (FPN/DAN) states',
      'Supports empathy by tagging emotionally charged social cues'
    ]
  },

  // ========================================
  // NETWORK 5: Limbic Network (LIM)
  // ========================================
  limbic_network: {
    id: 'limbic_network',
    name: 'Limbic Network (LIM)',
    type: 'REGION',
    description: 'Covers the orbitofrontal cortex, temporal pole, and ventral medial prefrontal areas that interface with the amygdala and hippocampus. Assigns emotional and motivational value to experiences.',
    color: '#F1C40F', // Warm Yellow/Cream
    position: [0, -0.5, 0.5], // Deep/Bottom Front
    size: [1.5, 1.2, 1.5],
    isMainRegion: true,
    parts: [],
    anatomicalLocation: 'Orbitofrontal cortex, temporal pole, ventromedial prefrontal cortex, anterior cingulate (subgenual)',
    keyRegions: ['Orbitofrontal Cortex (OFC)', 'Temporal Pole', 'Ventromedial Prefrontal Cortex', 'Subgenual Cingulate'],
    clinicalRelevance: 'Dysfunction linked to depression, addiction, and impulsive decision-making. OFC damage impairs social judgement and emotional regulation.',
    functions: [
      'Pairs sights, sounds, and smells with emotional memories',
      'Evaluates rewards and punishments to guide future choices',
      'Supports mood regulation and stress buffering',
      'Links olfactory and gustatory cues to appetite and satiety',
      'Interprets social cues such as tone of voice or facial expression'
    ]
  },

  // ========================================
  // NETWORK 6: Frontoparietal Control (FPN)
  // ========================================
  frontoparietal_network: {
    id: 'frontoparietal_network',
    name: 'Frontoparietal Control (FPN)',
    type: 'REGION',
    description: 'Links the dorsolateral prefrontal cortex with inferior parietal regions. Acts as a flexible control hub that keeps goals online, tests strategies, and supervises complex behaviour.',
    color: '#9B59B6', // Deep Purple/Blue
    position: [1.4, 1.2, 1.2], // Front-Side (DLPFC area)
    size: [1.8, 1.5, 1.5],
    isMainRegion: true,
    parts: [],
    anatomicalLocation: 'Dorsolateral prefrontal cortex (DLPFC), inferior parietal lobule, middle frontal gyrus',
    keyRegions: ['Dorsolateral Prefrontal Cortex', 'Inferior Parietal Lobule', 'Lateral Premotor Cortex', 'Anterior PFC'],
    clinicalRelevance: 'Impaired in schizophrenia, ADHD, and frontotemporal dementia. Critical target for cognitive training and brain stimulation therapies.',
    functions: [
      'Holds task rules and instructions in working memory',
      'Designs step-by-step plans for writing, coding, or lab work',
      'Evaluates evidence and updates strategies when conditions change',
      'Balances speed versus accuracy depending on goals',
      'Coordinates with DAN and SMN to translate decisions into action'
    ]
  },

  // ========================================
  // NETWORK 7: Default Mode Network (DMN)
  // ========================================
  default_mode_network: {
    id: 'default_mode_network',
    name: 'Default Mode Network (DMN)',
    type: 'REGION',
    description: 'Spans medial prefrontal cortex, posterior cingulate/precuneus, angular gyrus, and hippocampal formation. Dominates during quiet wakefulness when we replay memories or imagine the future.',
    color: '#E74C3C', // Red/Pink
    position: [0, 1.0, 1.8], // Front-Midline (mPFC)
    size: [2.0, 2.0, 2.0],
    isMainRegion: true,
    parts: [],
    anatomicalLocation: 'Medial prefrontal cortex, posterior cingulate cortex, precuneus, angular gyrus, medial temporal lobe',
    keyRegions: ['Medial Prefrontal Cortex (mPFC)', 'Posterior Cingulate Cortex (PCC)', 'Precuneus', 'Angular Gyrus'],
    clinicalRelevance: 'Overactivity linked to depression and rumination. Disrupted in Alzheimer\'s disease. Reduced connectivity seen in autism spectrum disorders.',
    functions: [
      'Retrieves autobiographical and episodic memories',
      'Simulates future plans and \"what if\" scenarios',
      'Supports self-reflection and moral reasoning',
      'Integrates bodily state signals during rest or meditation',
      'Enables theory-of-mind thinking about other people\'s perspectives'
    ]
  }
};

/**
 * Get all main REGIONS (7 total)
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
