import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export function Memories({ urls }: { urls: string[] }) {
    return (
        <group position={[-5, 2, -5]} rotation={[0, 0.5, 0]}>
            {urls.map((url, i) => (
                <PhotoFrame key={i} url={url} position={[i * 2.5, 0, i * -0.5]} rotation={[0, -0.2 * i, 0]} />
            ))}
        </group>
    );
}

function PhotoFrame({ url, position, rotation }: { url: string; position: [number, number, number]; rotation: [number, number, number] }) {
    const texture = useTexture(url);

    return (
        <group position={position} rotation={rotation}>
            {/* Frame */}
            <mesh castShadow>
                <boxGeometry args={[2.2, 2.2, 0.1]} />
                <meshStandardMaterial color="#fff" roughness={0.5} />
            </mesh>
            {/* Photo */}
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[2, 2]} />
                <meshStandardMaterial map={texture} transparent />
            </mesh>
            {/* Support */}
            <mesh position={[0.5, -1.1, -0.5]} rotation={[0.5, 0, 0]}>
                <boxGeometry args={[0.1, 1, 0.1]} />
                <meshStandardMaterial color="#ddd" />
            </mesh>
            <mesh position={[-0.5, -1.1, -0.5]} rotation={[0.5, 0, 0]}>
                <boxGeometry args={[0.1, 1, 0.1]} />
                <meshStandardMaterial color="#ddd" />
            </mesh>
        </group>
    );
}
