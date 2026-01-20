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
    const creamyMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#fdf5e6", // Mascarpone color
                roughness: 0.8,
                metalness: 0.1,
            }),
        []
    );

    const spongeMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#d2b48c", // Ladyfinger/Tan color
                roughness: 0.9,
                metalness: 0.0,
            }),
        []
    );

    const cocoaMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#3d2b1f", // Cocoa brown
                roughness: 1.0,
                metalness: 0.0,
            }),
        []
    );

    // Procedural cocoa powder (dusting)
    const toppings = useMemo(() => {
        const items = [];
        const count = 60; // More small "dust" particles
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.sqrt(Math.random()) * (cakeRadius - 0.2);
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;
            items.push(
                <mesh key={i} position={[x, cakeHeight + 0.05, z]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <primitive object={cocoaMaterial} attach="material" />
                </mesh>
            );
        }
        return items;
    }, [cakeRadius, cakeHeight, cocoaMaterial]);

    return (
        <group {...groupProps}>
            {/* Cake Body - Layered appearance */}
            <mesh position={[0, cakeHeight / 2, 0]}>
                <cylinderGeometry args={[cakeRadius, cakeRadius, cakeHeight, 64]} />
                <primitive object={creamyMaterial} attach="material" />
            </mesh>

            {/* Inner Sponge Layer (visual trick with a smaller ring/cylinder or stripes) */}
            <mesh position={[0, cakeHeight / 2, 0]}>
                <cylinderGeometry args={[cakeRadius + 0.01, cakeRadius + 0.01, cakeHeight * 0.4, 64]} />
                <primitive object={spongeMaterial} attach="material" />
            </mesh>

            {/* Frosting Top (Dusting base) */}
            <mesh position={[0, cakeHeight + frostingThickness / 2, 0]}>
                <cylinderGeometry args={[cakeRadius + 0.05, cakeRadius + 0.05, frostingThickness, 64]} />
                <primitive object={creamyMaterial} attach="material" />
            </mesh>

            {/* Toppings (Cocoa Powder) */}
            {toppings}

            {children}
        </group>
    );
}
