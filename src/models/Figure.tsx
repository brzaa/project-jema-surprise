import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

export function Figure({ isLit }: { isLit: boolean }) {
    const group = useRef<THREE.Group>(null);
    const armL = useRef<THREE.Mesh>(null);
    const armR = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (group.current) {
            // Gentle bobbing
            group.current.position.y = Math.sin(t * 2) * 0.1 + 0.5;
            // Rotation based on movement
            group.current.rotation.y = Math.sin(t * 0.5) * 0.2;
        }

        if (isLit) {
            // Waving animation when candle is lit
            if (armL.current) armL.current.rotation.z = Math.sin(t * 4) * 0.5 + 0.5;
            if (armR.current) armR.current.rotation.z = -Math.sin(t * 4) * 0.5 - 0.5;
        } else {
            // "Celebration" or "Surprise" pose
            if (armL.current) armL.current.rotation.z = 2.5;
            if (armR.current) armR.current.rotation.z = -2.5;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <group ref={group} position={[3, 0, 2]} scale={0.8}>
                {/* Body - Rounded Cube/Bean */}
                <mesh position={[0, 1, 0]} castShadow>
                    <capsuleGeometry args={[0.5, 1, 16, 32]} />
                    <meshStandardMaterial color="#ff85a1" roughness={0.3} />
                </mesh>

                {/* Eyes */}
                <mesh position={[-0.2, 1.4, 0.45]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
                <mesh position={[0.2, 1.4, 0.45]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color="#000" />
                </mesh>

                {/* Arms */}
                <mesh ref={armL} position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.5]}>
                    <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
                    <meshStandardMaterial color="#ff85a1" />
                </mesh>
                <mesh ref={armR} position={[0.6, 1.2, 0]} rotation={[0, 0, -0.5]}>
                    <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
                    <meshStandardMaterial color="#ff85a1" />
                </mesh>

                {/* Hat */}
                <mesh position={[0, 1.8, 0]}>
                    <coneGeometry args={[0.3, 0.6, 16]} />
                    <meshStandardMaterial color="#ffcc77" />
                </mesh>
            </group>
        </Float>
    );
}
