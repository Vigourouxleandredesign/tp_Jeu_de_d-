import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/core/Gltf';
import * as THREE from 'three';
import './dice.css';

const MODEL_PATH = '/D6.glb';

// Paires opposées inversées sur le GLB : 1↔6, 2↔5, 3↔4
const faceEnHaut = {
    1: [Math.PI, 0, 0],
    2: [-Math.PI / 2, 0, 0],
    3: [0, 0, -Math.PI / 2],
    4: [0, 0, Math.PI / 2],
    5: [Math.PI / 2, 0, 0],
    6: [0, 0, 0],
};

const ROLL_DURATION_MS = 800;

function Dice({ dice, history, rollDice, onClearHistory }) {
    return (
        <div className="dice">
            <p className="dice-display">{dice > 0 ? dice : '—'}</p>
            <button className="dice-btn dice-btn--primary" onClick={rollDice}>Lancer le dé !</button>
            <ul className="dice-history">
                {history.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
            <button className="dice-btn dice-btn--ghost" onClick={onClearHistory}>Effacer l'historique</button>
        </div>
    );
}

function Dice3D({ dice, isRolling }) {
    const group = useRef();
    const rollStartTime = useRef(0);
    const targetQuat = useRef(new THREE.Quaternion());
    const { nodes } = useGLTF(MODEL_PATH);

    const model = useMemo(() => nodes.d6.clone(true), [nodes]);

    useEffect(() => {
        if (dice > 0) {
            const [tx, ty, tz] = faceEnHaut[dice];
            targetQuat.current.setFromEuler(new THREE.Euler(tx, ty, tz));
        }
    }, [dice]);

    useEffect(() => {
        if (isRolling) {
            rollStartTime.current = performance.now();
        }
    }, [isRolling]);

    useFrame((_, delta) => {
        if (!group.current) return;

        if (isRolling) {
            const progress = Math.min(
                (performance.now() - rollStartTime.current) / ROLL_DURATION_MS,
                1
            );
            const speed = Math.sin(progress * Math.PI);
            const spin = delta * 14;

            group.current.rotation.x += spin * speed;
            group.current.rotation.y += spin * speed * 1.2;
            group.current.rotation.z += spin * speed * 0.5;
        } else if (dice > 0) {
            const settle = 1 - Math.exp(-delta * 8);
            group.current.quaternion.slerp(targetQuat.current, settle);
        }
    });

    return (
        <group ref={group} scale={0.8}>
            <primitive object={model} />
        </group>
    );
}

useGLTF.preload(MODEL_PATH);

export default Dice;
export { Dice3D, ROLL_DURATION_MS };
