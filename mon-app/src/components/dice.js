import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import './dice.css';

const FACE_TEXTURES = [
    '/textures/dice3.png',
    '/textures/dice4.png',
    '/textures/dice1.png',
    '/textures/dice6.png',
    '/textures/dice5.png',
    '/textures/dice2.png',
];

const faceEnHaut = {
    1: [0, 0, 0],
    2: [Math.PI / 2, 0, 0],
    3: [0, 0, Math.PI / 2],
    4: [0, 0, -Math.PI / 2],
    5: [-Math.PI / 2, 0, 0],
    6: [Math.PI, 0, 0],
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
    const mesh = useRef();
    const rollStartTime = useRef(0);
    const textures = useLoader(THREE.TextureLoader, FACE_TEXTURES);

    const materials = useMemo(
        () =>
            textures.map((texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                return new THREE.MeshStandardMaterial({ map: texture });
            }),
        [textures]
    );

    useEffect(() => {
        if (isRolling) {
            rollStartTime.current = performance.now();
        }
    }, [isRolling]);

    useFrame((_, delta) => {
        if (!mesh.current) return;

        if (isRolling) {
            const progress = Math.min(
                (performance.now() - rollStartTime.current) / ROLL_DURATION_MS,
                1
            );
            const speed = Math.sin(progress * Math.PI);
            const spin = delta * 14;

            mesh.current.rotation.x += spin * speed;
            mesh.current.rotation.y += spin * speed * 1.2;
            mesh.current.rotation.z += spin * speed * 0.5;
        } else if (dice > 0) {
            const [targetX, targetY, targetZ] = faceEnHaut[dice];
            const settle = 1 - Math.exp(-delta * 6);

            mesh.current.rotation.x += (targetX - mesh.current.rotation.x) * settle;
            mesh.current.rotation.y += (targetY - mesh.current.rotation.y) * settle;
            mesh.current.rotation.z += (targetZ - mesh.current.rotation.z) * settle;
        }
    });

    return (
        <mesh ref={mesh} material={materials}>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
        </mesh>
    );
}

export default Dice;
export { Dice3D, ROLL_DURATION_MS };
