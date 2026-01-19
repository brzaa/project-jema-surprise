import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cake } from "./models/Cake";
import { Candle } from "./models/Candle";
import { Table } from "./models/Table";
import { Figure } from "./models/Figure";
import { Fireworks } from "./components/Fireworks";
import { BakeryEnv } from "./components/BakeryEnv";
import { Memories } from "./components/Memories";
import "./index.css";

const TYPED_LINES = [
  "> hello jema",
  "...",
  "> today is your special day",
  "...",
  "> i made you this little surprise",
  "...",
  "٩(◕‿◕)۶ hope you like it!"
];

const TYPED_CHAR_DELAY = 80;
const POST_TYPING_DELAY = 1000;

function Scene({ isPlaying, isCandleLit, photos }: { isPlaying: boolean; isCandleLit: boolean; photos: string[] }) {
  const cakeGroup = useRef<THREE.Group>(null);
  const tableGroup = useRef<THREE.Group>(null);
  const [animationTime, setAnimationTime] = useState(0);

  useFrame((state, delta) => {
    if (!isPlaying) return;
    setAnimationTime((t) => t + delta);

    const t = animationTime;

    // Cake entry (drop from top)
    if (cakeGroup.current) {
      const cakeY = Math.max(0, 10 * Math.exp(-t * 2));
      cakeGroup.current.position.y = cakeY;
      // Smooth continuous rotation after entry
      cakeGroup.current.rotation.y = t * 0.2 + (t > 2 ? Math.sin(t * 0.5) * 0.1 : 0);
    }

    // Table entry (slide from front)
    if (tableGroup.current) {
      const tableZ = Math.max(0, 20 * Math.exp(-t * 1.5));
      tableGroup.current.position.z = -tableZ;
      // Tilt table slightly for depth
      tableGroup.current.rotation.x = Math.max(0, 0.1 * Math.exp(-t));
    }

    // Gentle camera movement
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <BakeryEnv />
      <Memories urls={photos} />
      <Figure isLit={isCandleLit} />

      <group ref={tableGroup} position={[0, -2, 0]}>
        <Table />
        <ContactShadows opacity={0.6} scale={20} blur={2.5} far={10} resolution={512} color="#000000" />
      </group>

      <group ref={cakeGroup}>
        <Cake position={[0, -1.75, 0]} />
        <Candle position={[0, 0.25, 0]} isLit={isCandleLit} scale={0.5} />
      </group>
    </>
  );
}

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [sceneStarted, setSceneStarted] = useState(false);
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [photos, setPhotos] = useState<string[]>(["/placeholder_jema.png"]);

  // Typing logic
  useEffect(() => {
    if (!hasStarted) return;

    if (currentLineIndex >= TYPED_LINES.length) {
      const timeout = setTimeout(() => setSceneStarted(true), POST_TYPING_DELAY);
      return () => clearTimeout(timeout);
    }

    const currentLine = TYPED_LINES[currentLineIndex];
    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex(currentCharIndex + 1);
      }, TYPED_CHAR_DELAY);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(currentLineIndex + 1);
        setCurrentCharIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [hasStarted, currentLineIndex, currentCharIndex]);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleCandleClick = () => {
    if (sceneStarted && isCandleLit) {
      setIsCandleLit(false);
      setFireworksActive(true);
      setHasCompleted(true);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos].slice(-5)); // Keep last 5 photos
    }
  };

  return (
    <div className="App">
      {!hasStarted && (
        <div className="start-screen">
          <button className="start-button" onClick={handleStart}>
            Open Surprise
          </button>
        </div>
      )}

      {hasStarted && !sceneStarted && (
        <div className="typing-container">
          {TYPED_LINES.slice(0, currentLineIndex + 1).map((line, idx) => (
            <div key={idx} className="typing-line">
              {idx === currentLineIndex ? line.slice(0, currentCharIndex) : line}
              {idx === currentLineIndex && <span className="cursor">_</span>}
            </div>
          ))}
        </div>
      )}

      {sceneStarted && (
        <div className="canvas-container">
          <Canvas shadows camera={{ position: [0, 5, 12], fov: 45 }}>
            <Suspense fallback={null}>
              <Scene isPlaying={sceneStarted} isCandleLit={isCandleLit} photos={photos} />
              <Fireworks isActive={fireworksActive} origin={[0, 2, 0]} />

              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={2} castShadow shadow-mapSize={1024} />
              <spotLight position={[-10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
              <Environment preset="apartment" />

              <OrbitControls enablePan={false} minDistance={5} maxDistance={25} />
            </Suspense>
          </Canvas>

          {!hasCompleted && (
            <div className="ui-overlay">
              {isCandleLit && (
                <div className="hint" onClick={handleCandleClick}>
                  Make a wish and click the candle!
                </div>
              )}
              <div className="upload-section">
                <label className="upload-button">
                  Add Memories ✨
                  <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} hidden />
                </label>
              </div>
            </div>
          )}

          {hasCompleted && (
            <div className="final-message">
              <h1>Happy Birthday!</h1>
              <p>May all your dreams come true.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
