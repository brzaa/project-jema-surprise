import type { ThreeElements } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

type CakeProps = ThreeElements["group"];

export function Cake({ children, ...groupProps }: CakeProps) {
    // Cake parameters
    const cakeRadius = 2.5;
    const cakeHeight = 2.0;
    const frostingThickness = 0.1;

    // Materials
    const cakeMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#f5e6d3", // Creampuff color
                roughness: 0.8,
                metalness: 0.1,
            }),
        []
    );

    const frostingMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#ffc0cb", // Pink frosting
                roughness: 0.3,
                metalness: 0.1,
            }),
        []
    );

    const toppingMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#ff0000", // Strawberry red
                roughness: 0.4,
                metalness: 0.2,
            }),
        []
    );

    // Procedural toppings (strawberries)
    const toppings = useMemo(() => {
        const items = [];
        const count = 8;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * (cakeRadius - 0.5);
            const z = Math.sin(angle) * (cakeRadius - 0.5);
            items.push(
                <mesh key={i} position={[x, cakeHeight + 0.1, z]} rotation={[0.2, angle, 0]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <primitive object={toppingMaterial} attach="material" />
                </mesh>
            );
        }
        return items;
    }, [cakeRadius, cakeHeight, toppingMaterial]);

    return (
        <group {...groupProps}>
            {/* Cake Body */}
            <mesh position={[0, cakeHeight / 2, 0]}>
                <cylinderGeometry args={[cakeRadius, cakeRadius, cakeHeight, 64]} />
                <primitive object={cakeMaterial} attach="material" />
            </mesh>

            {/* Frosting Top */}
            <mesh position={[0, cakeHeight + frostingThickness / 2, 0]}>
                <cylinderGeometry args={[cakeRadius + 0.05, cakeRadius + 0.05, frostingThickness, 64]} />
                <primitive object={frostingMaterial} attach="material" />
            </mesh>

            {/* Frosting Drips (Simplified as a ring for now) */}
            <mesh position={[0, cakeHeight - 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[cakeRadius + 0.02, 0.15, 16, 64]} />
                <primitive object={frostingMaterial} attach="material" />
            </mesh>

            {/* Toppings */}
            {toppings}

            {children}
        </group>
    );
}
