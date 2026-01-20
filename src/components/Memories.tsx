import { useTexture } from "@react-three/drei";
import { useState } from "react";

export function Memories({ urls }: { urls: string[] }) {
    return (
        <group position={[-3.5, 0, 0]} rotation={[0, 0.4, 0]}>
            {urls.map((url, i) => (
                <PhotoFrame key={i} url={url} position={[i * 2.5, 0, i * -1.0]} rotation={[0, -0.1 * i, 0]} />
            ))}
        </group>
    );
}

function PhotoFrame({ url, position, rotation }: { url: string; position: [number, number, number]; rotation: [number, number, number] }) {
    const texture = useTexture(url);
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        window.open("https://bj-memories.vercel.app/", "_blank");
    };

    return (
        <group
            position={position}
            rotation={rotation}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Frame */}
            <mesh castShadow scale={hovered ? 1.05 : 1}>
                <boxGeometry args={[2.2, 2.2, 0.1]} />
                <meshStandardMaterial color={hovered ? "#ffeb3b" : "#ffffff"} roughness={0.5} />
            </mesh>
            {/* Photo */}
            <mesh position={[0, 0, 0.06]} scale={hovered ? 1.05 : 1}>
                <planeGeometry args={[2, 2]} />
                <meshStandardMaterial map={texture} transparent />
            </mesh>
            {/* Support (Legs) */}
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
