# Interactive 3D Brain Viewer
AI slop readme aah, took like 3 hours to add that brain, still ongoing project.

An interactive 3D brain simulator that allows users to click on brain regions to learn about their functions.

## 🚀 Quick Start

### Option 1: Modern React App (Recommended)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your brain viewer!

### Option 2: Simple HTML Version

Simply open `brain-viewer.html` in your browser - no build step required!

## 📋 Features

- ✅ Interactive 3D brain model
- ✅ Click regions to highlight and display information
- ✅ Hover tooltips showing region names
- ✅ Detailed information panel with functions
- ✅ Smooth rotations and animations
- ✅ Responsive design

## 🧠 Integrating Real BrainBrowser Models

The current implementation uses simple geometric shapes for demonstration. Here's how to integrate actual brain models:

### Method 1: Using BrainBrowser's MNI Models

1. **Download brain surface files:**
   ```bash
   # Download from BrainBrowser data repository
   wget https://brainbrowser.cbrain.mcgill.ca/models/brain-surface.obj
   wget https://brainbrowser.cbrain.mcgill.ca/models/AAL_atlas.txt
   ```

2. **Place files in public directory:**
   ```
   public/
   ├── models/
   │   ├── brain-surface.obj
   │   └── AAL_atlas.txt
   ```

3. **Update the BrainModel component:**

```javascript
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';

function BrainModel({ onRegionClick }) {
  // Load actual brain model
  const brainObj = useLoader(OBJLoader, '/models/brain-surface.obj');
  
  // Load atlas labels (mapping vertices to regions)
  const [atlasData, setAtlasData] = useState(null);
  
  useEffect(() => {
    fetch('/models/AAL_atlas.txt')
      .then(res => res.text())
      .then(data => {
        // Parse atlas data
        const labels = parseAtlasLabels(data);
        setAtlasData(labels);
      });
  }, []);

  return (
    <primitive
      object={brainObj}
      onClick={(e) => {
        const vertexIndex = e.faceIndex * 3; // Get vertex from face
        const region = getRegionFromVertex(vertexIndex, atlasData);
        onRegionClick(region);
      }}
    />
  );
}

function parseAtlasLabels(atlasText) {
  // Parse the atlas file format
  // Format is typically: vertex_index region_id region_name
  const lines = atlasText.split('\n');
  const labels = {};
  
  lines.forEach(line => {
    const [index, regionId, ...nameParts] = line.split(/\s+/);
    if (index && regionId) {
      labels[parseInt(index)] = {
        id: parseInt(regionId),
        name: nameParts.join(' ')
      };
    }
  });
  
  return labels;
}
```

### Method 2: Using FreeSurfer Models

FreeSurfer provides high-quality brain surface models. Here's how to integrate them:

1. **Convert FreeSurfer surfaces to OBJ format:**

```bash
# Install FreeSurfer tools
# Then convert surfaces
mris_convert lh.pial lh.pial.obj
mris_convert rh.pial rh.pial.obj
```

2. **Load annotation files for region labels:**

```javascript
function loadFreeSurferAnnotation(annotFile) {
  // Load .annot file to get region labels
  // You'll need a library like "freesurfer-parser" or write a custom parser
  return fetch(annotFile)
    .then(res => res.arrayBuffer())
    .then(buffer => parseAnnotFile(buffer));
}
```

### Method 3: Using NIfTI Volume Data

For volumetric brain data (like MRI scans):

```bash
npm install nifti-reader-js
```

```javascript
import * as nifti from 'nifti-reader-js';

function loadNifti(niftiFile) {
  return fetch(niftiFile)
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const data = nifti.readHeader(buffer);
      const image = nifti.readImage(data, buffer);
      return { header: data, image: image };
    });
}
```

## 🎨 Color Schemes and Atlases

### Popular Brain Atlases:

1. **AAL (Automated Anatomical Labeling)** - 116 regions
2. **Desikan-Killiany** - 68 cortical regions
3. **Destrieux** - 148 cortical regions
4. **Harvard-Oxford** - Probabilistic atlas

### Using Custom Color Schemes:

```javascript
const colorSchemes = {
  anatomical: {
    frontal: '#FF6B6B',
    parietal: '#4ECDC4',
    temporal: '#95E1D3',
    occipital: '#F38181'
  },
  functional: {
    motor: '#E74C3C',
    sensory: '#3498DB',
    association: '#9B59B6',
    limbic: '#F39C12'
  },
  heatmap: (value) => {
    // Value from 0-1 representing activation level
    return `hsl(${(1 - value) * 240}, 100%, 50%)`;
  }
};
```

## 🔧 Advanced Features to Add

### 1. Real-time Highlighting with Raycasting

```javascript
import { Raycaster, Vector2 } from 'three';

function useRaycasting(meshRef, camera) {
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  
  const onMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const face = intersects[0].face;
      // Determine region from intersection
    }
  };
  
  return onMouseMove;
}
```

### 2. Add AI-Powered Explanations

```javascript
async function getAIExplanation(regionName) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Explain the ${regionName} of the brain in simple terms, including its main functions and interesting facts.`
      }]
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
}
```

### 3. Add Animation States

```javascript
function animateToRegion(camera, controls, targetPosition) {
  gsap.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });
}
```

## 📊 Data Sources

### Free Brain Model Resources:

1. **BrainBrowser** - https://brainbrowser.cbrain.mcgill.ca
2. **FreeSurfer** - https://surfer.nmr.mgh.harvard.edu
3. **Allen Brain Atlas** - https://brain-map.org
4. **Human Connectome Project** - https://www.humanconnectome.org
5. **NIH 3D Print Exchange** - https://3dprint.nih.gov (search "brain")

### Atlas Resources:

- **SPM Anatomy Toolbox** - Probabilistic cytoarchitectonic maps
- **JuBrain Atlas** - 3D probabilistic atlas
- **Brainnetome Atlas** - 246 subregions

## 🎓 Educational Enhancements

### Add Quiz Mode:

```javascript
const quizQuestions = [
  {
    question: "Which lobe is responsible for visual processing?",
    correctRegion: "occipital",
    options: ["frontal", "parietal", "occipital", "temporal"]
  },
  // Add more questions
];
```

### Add Comparison Mode:

```javascript
function ComparisonView({ regions }) {
  return (
    <div className="comparison">
      {regions.map(region => (
        <div key={region}>
          <BrainModel highlightedRegion={region} />
          <RegionInfo region={region} />
        </div>
      ))}
    </div>
  );
}
```

## 🐛 Common Issues & Solutions

### Issue: Model not loading
**Solution:** Check CORS headers. Host models on the same domain or configure CORS properly.

### Issue: Slow performance
**Solution:** 
- Use `decimation` to reduce polygon count
- Implement LOD (Level of Detail)
- Use instancing for repeated geometries

### Issue: Clicking doesn't work
**Solution:** Ensure `pointer-events` are enabled on the mesh and raycasting is configured correctly.

## 📱 Mobile Optimization

```javascript
// Detect mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Reduce quality on mobile
const meshQuality = isMobile ? 'low' : 'high';

// Touch controls
<OrbitControls
  enableZoom={true}
  enablePan={!isMobile}
  touches={{
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  }}
/>
```

## 🚀 Deployment

### Deploying to Vercel:

```bash
npm run build
vercel
```

### Deploying to Netlify:

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📝 License

MIT License - Feel free to use this for educational purposes!

## 🤝 Contributing

Pull requests welcome! Areas for improvement:
- More detailed anatomical data
- Better region detection algorithms
- Mobile touch controls
- VR support
- Multi-language support

---

**Pro Tip:** Start with the simple geometric version to get your UI/UX right, then progressively enhance with real brain models and atlas data!

ADD DESIKAN KILLIANY ATLAS FOR REGION INTEGRATION
