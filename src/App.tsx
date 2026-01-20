import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Text, Html } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Cake } from "./models/Cake";
import { Candle } from "./models/Candle";
import { Table } from "./models/Table";
import { Figure } from "./models/Figure";
import { Fireworks } from "./components/Fireworks";
import { BakeryEnv } from "./components/BakeryEnv";
import { Memories } from "./components/Memories";
import { Letter } from "./models/Letter";
import "./index.css";

const TYPED_LINES = [
  "> hi baby",
  "...",
  "> 22 years ago a prettiest angel has been born",
  "...",
  "> so i made this temple to worship her",
  "...",
  "٩(◕‿◕)۶ hope you accept my sacrifice"
];

const TYPED_CHAR_DELAY = 50;
const POST_TYPING_DELAY = 1500;

function Scene({ isPlaying, isCandleLit, photos, onOpenLetter }: {
  isPlaying: boolean;
  isCandleLit: boolean;
  photos: string[];
  onOpenLetter: () => void;
}) {
  const cakeGroup = useRef<THREE.Group>(null);
  const tableGroup = useRef<THREE.Group>(null);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    console.log("3D Scene Mounted");
  }, []);

  // Single "22" themed candle
  const simplifiedCandle = useMemo(() => {
    return (
      <group position={[0, 2.2, 0]}>
        <Candle
          isLit={isCandleLit}
          scale={0.8}
        />
        <Text
          position={[0, 0.4, 0.35]}
          fontSize={0.6}
          color="#ff067e"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          22
        </Text>
      </group>
    );
  }, [isCandleLit]);

  useFrame((state, delta) => {
    if (!isPlaying) return;
    setAnimationTime((t) => t + delta);

    const t = animationTime;

    // Cake entry (drop from top)
    if (cakeGroup.current) {
      const cakeY = Math.max(0, 5 * Math.exp(-t * 2));
      cakeGroup.current.position.y = -1.75 + cakeY; // Base y is -1.75 (on table)
      cakeGroup.current.rotation.y = t * 0.2 + (t > 2 ? Math.sin(t * 0.5) * 0.1 : 0);
    }

    // Table entry (slide from front)
    if (tableGroup.current) {
      const tableZ = Math.max(0, 10 * Math.exp(-t * 1.5)); // Reduced from 20 to 10
      tableGroup.current.position.z = -tableZ;
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
      <Letter
        position={[2, -1.6, 3.5]} // Moved closer and more central-right for easy access
        onClick={onOpenLetter}
      />

      <group ref={tableGroup} position={[0, -2, 0]}>
        <Table />
        <ContactShadows opacity={0.6} scale={20} blur={2.5} far={10} resolution={512} color="#000000" />
      </group>

      <group ref={cakeGroup} position={[0, -1.75, 0]}>
        <Cake>
          {simplifiedCandle}
        </Cake>
      </group>

      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2.5} castShadow />
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
  const [photos, setPhotos] = useState<string[]>(["/photoo.jpg"]);

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
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [hasStarted, currentLineIndex, currentCharIndex]);


  const handleStart = () => {
    setHasStarted(true);
  };

  const handleExtinguish = () => {
    if (isCandleLit) {
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

      <div
        className="canvas-container"
        style={{
          opacity: 1,
          visibility: sceneStarted ? 'visible' : 'hidden',
          pointerEvents: sceneStarted ? 'auto' : 'none'
        }}
      >
        <Canvas shadows camera={{ position: [0, 5, 12], fov: 45 }}>
          <Suspense fallback={<Html center><div style={{ color: 'white', fontFamily: 'Inter', fontSize: '1.2rem' }}>Loading Surprise...</div></Html>}>
            {sceneStarted && (
              <>
                <Scene
                  isPlaying={sceneStarted}
                  isCandleLit={isCandleLit}
                  photos={photos}
                  onOpenLetter={() => window.open('https://sendthesong.xyz/details/696fb274a371d3479e189821', '_blank')}
                />
                <Fireworks isActive={fireworksActive} origin={[0, 2, 0]} />
              </>
            )}

            <ambientLight intensity={2.0} />
            <pointLight position={[10, 10, 10]} intensity={3} castShadow />
            <color attach="background" args={['#1a1010']} />
            <OrbitControls enablePan={false} minDistance={5} maxDistance={25} />
          </Suspense>
        </Canvas>

        {sceneStarted && !hasCompleted && (
          <div className="ui-overlay">
            {isCandleLit && (
              <div className="hint" onClick={handleExtinguish}>
                Make a wish and click to blow the candles! 🎂✨
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
            <h1>Happy Birthday my sweetest angel baby! 🎂</h1>
            <p className="wishes-text">semoga tahun ini makin sayang bram baby cepet tambah gyattt cepet lulus cepet dapet kerja cepet dapet momongan</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '20px',
                border: 'none',
                background: '#ff85a1',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 133, 161, 0.4)'
              }}
            >
              Restart Surprise ✨
            </button>
          </div>
        )}
      </div>
    </div >
  );
}
