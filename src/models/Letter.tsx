import { Text, Float } from "@react-three/drei";
import { useState } from "react";

export function Letter({ position, onClick }: {
    position: [number, number, number];
    onClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
                >
                    {/* Invisible Hitbox for easier clicking */}
                    <mesh visible={false}>
                        <boxGeometry args={[2.5, 3, 1]} />
                    </mesh>

                    {/* Paper Figure */}
                    <mesh castShadow rotation={[0, -0.2, 0]}>
                        <boxGeometry args={[1.5, 2, 0.05]} />
                        <meshStandardMaterial color="#f0ead6" roughness={0.9} />
                    </mesh>

                    {/* Duct Tape Accent (Top Left) */}
                    <mesh position={[-0.6, 0.9, 0.04]} rotation={[0, 0, 0.4]}>
                        <planeGeometry args={[0.6, 0.2]} />
                        <meshStandardMaterial color="#888" opacity={0.7} transparent />
                    </mesh>

                    {/* Duct Tape Accent (Bottom Right) */}
                    <mesh position={[0.6, -0.9, 0.04]} rotation={[0, 0, -0.4]}>
                        <planeGeometry args={[0.6, 0.2]} />
                        <meshStandardMaterial color="#888" opacity={0.7} transparent />
                    </mesh>

                    {/* "Handwritten" Title */}
                    <Text
                        position={[0, 0.5, 0.06]}
                        fontSize={0.2}
                        color="#222"
                    >
                        For You
                    </Text>

                    {/* Click Indicator */}
                    <Text
                        position={[0, -0.2, 0.06]}
                        fontSize={0.12}
                        color={hovered ? "#ff6b6b" : "#666"}
                        maxWidth={1.2}
                        textAlign="center"
                    >
                        (Click to Listen)
                    </Text>
                </group>
            </Float>
        </group>
    );
}
