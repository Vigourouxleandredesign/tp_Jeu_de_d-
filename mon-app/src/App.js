import logo from './logo.svg';
import './App.css';
import Dice, { Dice3D, ROLL_DURATION_MS } from './components/dice';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';

function App() {
  const [dice, setDice] = useState(0);
  const [history, setHistory] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const controlsRef = useRef(null);

  const rollDice = () => {
    if (isRolling) return;

    controlsRef.current?.reset();

    const value = Math.floor(Math.random() * 6) + 1;
    setDice(value);
    setHistory([...history, value]);
    setIsRolling(true);
  };

  // Au chargement de la page : restaurer l'historique
  useEffect(() => {
    const saved = localStorage.getItem('diceHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // À chaque changement de history : sauvegarder
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('diceHistory', JSON.stringify(history));
    }
  }, [history]);

  // Fin de l'animation de lancer
  useEffect(() => {
    if (!isRolling) return;

    const timer = setTimeout(() => setIsRolling(false), ROLL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isRolling, dice]);

  const clearHistory = () => {
    localStorage.removeItem('diceHistory');
    setHistory([]);
    setDice(0);
  };

  return (
    <div className="App">
      <main className="App-main">
        <section className="App-intro">
          <img src={logo} className="App-logo" alt="React" />
          <h1 className="App-title">Jeu de dés</h1>
          <p className="App-subtitle">
            Teste du dé et de l'historique de lancers.
          </p>
          <div className="App-canvas-wrapper">
            <Canvas
              className="App-canvas"
              gl={{ alpha: true }}
              style={{ background: 'transparent' }}
              camera={{ position: [2, 2, 2], fov: 50 }}
            >
              <Suspense fallback={null}>
                <OrbitControls ref={controlsRef} enabled={!isRolling} />
                <Dice3D dice={dice} isRolling={isRolling} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
              </Suspense>
            </Canvas>
          </div>
        </section>
        <section className="App-content">
          <Dice
            dice={dice}
            history={history}
            rollDice={rollDice}
            onClearHistory={clearHistory}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
