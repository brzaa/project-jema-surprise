import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

type TableProps = ThreeElements["group"];

export function Table({ children, ...groupProps }: TableProps) {
    const woodMaterial = new THREE.MeshStandardMaterial({
        color: "#4a3728",
        roughness: 0.6,
        metalness: 0.1,
    });

    return (
        <group {...groupProps}>
            {/* Table Top */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[10, 0.5, 10]} />
                <primitive object={woodMaterial} attach="material" />
            </mesh>

            {/* Table Legs */}
            {[
                [-4.5, -2, -4.5],
                [4.5, -2, -4.5],
                [-4.5, -2, 4.5],
                [4.5, -2, 4.5],
            ].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                    <cylinderGeometry args={[0.3, 0.2, 4, 16]} />
                    <primitive object={woodMaterial} attach="material" />
                </mesh>
            ))}
            {children}
        </group>
    );
}
