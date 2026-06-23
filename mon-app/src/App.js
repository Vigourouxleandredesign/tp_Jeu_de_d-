import logo from './logo.svg';
import './App.css';
import Dice from './components/dice';

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <section className="App-intro">
          <img src={logo} className="App-logo" alt="React" />
          <h1 className="App-title">Jeu de dés</h1>
          <p className="App-subtitle">
            Teste du dé et de l'historique de lancers.
          </p>
        </section>
        <section className="App-content">
          <Dice />
        </section>
      </main>
    </div>
  );
}

export default App;
