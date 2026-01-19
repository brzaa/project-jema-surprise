import { useRef } from "react";
import * as THREE from "three";
import { MeshReflectorMaterial, Float } from "@react-three/drei";

export function BakeryEnv() {
    return (
        <group>
            {/* Floor - Polished with reflections */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, 0]}>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#151515"
                    metalness={0.5}
                    mirror={0}
                />
            </mesh>

            {/* Back Wall with Wood Slats */}
            <group position={[0, 5, -10]}>
                <mesh>
                    <boxGeometry args={[30, 15, 0.5]} />
                    <meshStandardMaterial color="#2a1a10" />
                </mesh>
                {/* Wood Slats */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <mesh key={i} position={[(i - 20) * 0.6, 0, 0.3]}>
                        <boxGeometry args={[0.2, 15, 0.2]} />
                        <meshStandardMaterial color="#4a3728" roughness={0.5} />
                    </mesh>
                ))}
            </group>

            {/* Arches */}
            <Arch position={[-8, 3, -8]} scale={[1, 1.2, 1]} />
            <Arch position={[8, 3, -8]} scale={[1, 1.2, 1]} />

            {/* Pendant Lights */}
            <PendantLight position={[-5, 8, -5]} />
            <PendantLight position={[5, 8, -5]} />
            <PendantLight position={[0, 8, -2]} />

            {/* Side Walls */}
            <mesh position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[20, 15, 0.5]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[20, 15, 0.5]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>
    );
}

function Arch({ position, ...props }: any) {
    return (
        <group position={position} {...props}>
            <mesh>
                <torusGeometry args={[5, 1.5, 16, 32, Math.PI]} />
                <meshStandardMaterial color="#333" roughness={0.8} />
            </mesh>
            <mesh position={[5, -2, 0]}>
                <boxGeometry args={[2, 10, 2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[-5, -2, 0]}>
                <boxGeometry args={[2, 10, 2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    );
}

function PendantLight({ position }: { position: [number, number, number] }) {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position}>
                {/* Wire */}
                <mesh position={[0, 2.5, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 5]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
                {/* Bulb */}
                <mesh>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial
                        color="#fff"
                        emissive="#ffcc77"
                        emissiveIntensity={2}
                    />
                </mesh>
                <pointLight intensity={1} color="#ffcc77" distance={10} />
            </group>
        </Float>
    );
}
