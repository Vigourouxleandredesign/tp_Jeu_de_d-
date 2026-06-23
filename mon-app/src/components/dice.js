import { useState, useEffect } from 'react';
import './dice.css';

function Dice() {
    const [dice, setDice] = useState(0);
    const [history, setHistory] = useState([]);

    const rollDice = () => {
        const value = Math.floor(Math.random() * 6) + 1;
        setDice(value);
        setHistory([...history, value]);
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

    return (
        <div className="dice">
            <p className="dice-display">{dice > 0 ? dice : '—'}</p>
            <button className="dice-btn dice-btn--primary" onClick={rollDice}>Lancer le dé !</button>
            <ul className="dice-history">
                {history.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
            <button className="dice-btn dice-btn--ghost" onClick={() => localStorage.removeItem('diceHistory')}>Effacer l'historique</button>
        </div>
    );
}

export default Dice;
