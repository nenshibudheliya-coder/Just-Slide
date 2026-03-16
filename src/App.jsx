import { useState } from 'react'
import Just from './Components/just.jsx'
import Home from './Components/Home.jsx'
import LevelSelect from './Components/LevelSelect.jsx'
import { LEVELS } from './data/levels.js'
import AdBanner from './Components/AdBanner.jsx'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('home'); // 'home', 'levels', 'game'
  const [showHomeAd, setShowHomeAd] = useState(false);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem('just_slide_unlocked');
    return saved ? parseInt(saved) : 0;
  });

  const startLevel = (idx) => {
    if (idx > unlockedLevel) return;
    setSelectedLevelIdx(idx);
    setGameState('game');
  };

  const handleLevelWin = (idx) => {
    if (idx + 1 > unlockedLevel) {
      const nextLevel = idx + 1;
      setUnlockedLevel(nextLevel);
      localStorage.setItem('just_slide_unlocked', nextLevel.toString());
    }
  };

  return (
    <>
      {gameState === 'home' && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Home onPlay={() => setShowHomeAd(true)} />
          {showHomeAd && (
            <div style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 9999, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)'
            }}>
              <AdBanner onClose={() => {
                setShowHomeAd(false);
                setGameState('levels');
              }} />
            </div>
          )}
        </div>
      )}

      {gameState === 'levels' && (
        <LevelSelect
          levels={LEVELS}
          currentLevelIdx={selectedLevelIdx}
          unlockedLevel={unlockedLevel}
          onSelect={startLevel}
          onClose={() => setGameState('home')}
        />
      )}

      {gameState === 'game' && (
        <Just
          initialLevelIdx={selectedLevelIdx}
          onBackToLevels={() => setGameState('levels')}
          onWin={handleLevelWin}
        />
      )}
    </>
  )
}

export default App