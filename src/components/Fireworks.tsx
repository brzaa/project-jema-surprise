import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type FireworksProps = {
    isActive: boolean;
    origin?: [number, number, number];
};

const BURST_COUNT = 8;
const PARTICLES_PER_BURST = 100;
const TOTAL_PARTICLES = BURST_COUNT * PARTICLES_PER_BURST;

export function Fireworks({ isActive, origin = [0, 5, 0] }: FireworksProps) {
    const pointsRef = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const positions = new Float32Array(TOTAL_PARTICLES * 3);
        const velocities = new Float32Array(TOTAL_PARTICLES * 3);
        const colors = new Float32Array(TOTAL_PARTICLES * 3);
        const lifetimes = new Float32Array(TOTAL_PARTICLES);
        const startTimes = new Float32Array(TOTAL_PARTICLES);

        for (let b = 0; b < BURST_COUNT; b++) {
            const burstColor = new THREE.Color().setHSL(Math.random(), 1.0, 0.6);
            const burstStartTime = b * 0.4; // Staggered starts

            for (let p = 0; p < PARTICLES_PER_BURST; p++) {
                const i = b * PARTICLES_PER_BURST + p;

                // Initial position
                positions[i * 3] = origin[0] + (Math.random() - 0.5) * 2;
                positions[i * 3 + 1] = origin[1] + (Math.random() - 0.5) * 2;
                positions[i * 3 + 2] = origin[2] + (Math.random() - 0.5) * 2;

                // Velocity (spherical)
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const speed = 3 + Math.random() * 6;
                velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
                velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
                velocities[i * 3 + 2] = speed * Math.cos(phi);

                // Color
                colors[i * 3] = burstColor.r;
                colors[i * 3 + 1] = burstColor.g;
                colors[i * 3 + 2] = burstColor.b;

                // Lifecycle
                lifetimes[i] = 1.5 + Math.random() * 1.5;
                startTimes[i] = burstStartTime;
            }
        }

        return { positions, velocities, colors, lifetimes, startTimes };
    }, [origin, isActive]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        // Use a clone to avoid mutation issues if needed, but here we manage it
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(particles.positions), 3));
        geo.setAttribute("color", new THREE.BufferAttribute(particles.colors, 3));
        return geo;
    }, [particles]);

    const startTimeRef = useRef<number | null>(null);

    useFrame(({ clock }, _delta) => {
        if (!isActive) {
            if (pointsRef.current) pointsRef.current.visible = false;
            startTimeRef.current = null;
            return;
        }

        if (startTimeRef.current === null) {
            startTimeRef.current = clock.elapsedTime;
        }

        const elapsed = clock.elapsedTime - startTimeRef.current;

        if (pointsRef.current) {
            pointsRef.current.visible = true;
            const posAttr = pointsRef.current.geometry.attributes.position;
            const positions = posAttr.array as Float32Array;

            let anyVisible = false;

            for (let i = 0; i < TOTAL_PARTICLES; i++) {
                const t = elapsed - particles.startTimes[i];

                if (t < 0) {
                    // Not started yet, hide it
                    positions[i * 3] = 9999;
                    positions[i * 3 + 1] = 9999;
                    positions[i * 3 + 2] = 9999;
                    continue;
                }

                if (t > particles.lifetimes[i]) {
                    // Finished, hide it
                    positions[i * 3] = 9999;
                    positions[i * 3 + 1] = 9999;
                    positions[i * 3 + 2] = 9999;
                    continue;
                }

                anyVisible = true;

                // Update position with velocity and gravity
                const gravity = -2.5;
                positions[i * 3] = particles.positions[i * 3] + particles.velocities[i * 3] * t;
                positions[i * 3 + 1] = particles.positions[i * 3 + 1] + particles.velocities[i * 3 + 1] * t + 0.5 * gravity * t * t;
                positions[i * 3 + 2] = particles.positions[i * 3 + 2] + particles.velocities[i * 3 + 2] * t;
            }

            posAttr.needsUpdate = true;

            if (!anyVisible && elapsed > BURST_COUNT * 0.5 + 3) {
                pointsRef.current.visible = false;
            }
        }
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} attach="geometry" />
            <pointsMaterial
                size={0.12}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

