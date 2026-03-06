import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Wedding date for countdown
  const weddingDate = new Date('2026-11-10T14:00:00');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      setIsLocked(false);
      // Auto-play music after unlock - removed autoplay due to browser restrictions
      // Music will start when user clicks play button
    }, 1400);
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      console.log('Audio ref is null');
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Play failed:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      console.log('Audio loaded, duration:', audioRef.current.duration);
    }
  };

  const handleCanPlay = () => {
    console.log('Audio can play');
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    console.error('Audio error:', e);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * duration;
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setIsRepeat(!isRepeat);

  const skipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  // Countdown component
  const CountdownItem = ({ value, label }: { value: number; label: string }) => (
    <div className="countdown-item">
      <div className="countdown-circle">
        <span className="countdown-number">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="countdown-label">{label}</span>
    </div>
  );

  return (
    <div className="app">
      {/* Lock Screen */}
      {isLocked && (
        <div 
          className={`lock-screen ${isUnlocking ? 'unlocking' : ''}`} 
          onClick={handleUnlock}
        >
          <div className="lock-particles" id="lockParticles" />
          <div className="lock-rings">
            <div className="lock-ring" />
            <div className="lock-ring" />
            <div className="lock-ring" />
            <div className="lock-ring" />
          </div>
          <div className={`lock-envelope ${isUnlocking ? 'opening' : ''}`}>
            <div className="envelope-top" />
            <div className="envelope-bottom" />
          </div>
          <div className="lock-content">
            <div className="lock-monogram">
              <span className="lock-monogram-text">В&М</span>
            </div>
            <div className="lock-date">10 · 11 · 2026</div>
            <div className="lock-names">
              Василь <span className="lock-amp">&</span> Мирослова
            </div>
            <div className="lock-subtitle">запрошують на своє весілля</div>
            <div className="lock-open-btn">
              <div className="lock-open-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 8L12 16L21 8" />
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                </svg>
              </div>
              <div className="lock-open-text">Відкрити запрошення</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`main-content ${!isLocked ? 'visible' : ''}`}>
        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-bg-pattern" />
          <div className="corner-decor top-left" />
          <div className="corner-decor top-right" />
          <div className="corner-decor bottom-left" />
          <div className="corner-decor bottom-right" />
          <span className="float-decor left">V</span>
          <span className="float-decor right">M</span>
          <div className="hero-content">
            <div className="hero-date-top">Запрошення на весілля</div>
            <div className="hero-names">
              Василь
              <span className="amp">&</span>
              Мирослова
            </div>
            <div className="hero-subtitle">10 листопада 2026 року</div>

            {/* Embedded Music Player */}
            <div className={`music-player ${!isLocked ? 'show' : ''}`}>
              <div className="music-player-content">
                <span className="music-time">{formatTime(currentTime)}</span>
                <div className="music-progress" ref={progressRef} onClick={handleProgressClick}>
                  <div 
                    className="music-progress-bar" 
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  >
                    <div className="music-progress-thumb" />
                  </div>
                </div>
                <span className="music-time">{formatTime(duration)}</span>
              </div>
              <div className="music-controls">
                <button className="control-btn" onClick={toggleShuffle} title="Перемішати" style={{ opacity: isShuffle ? 1 : 0.6 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 3 21 3 21 8" />
                    <line x1="4" y1="20" x2="21" y2="3" />
                    <polyline points="21 16 21 21 16 21" />
                    <line x1="15" y1="15" x2="21" y2="21" />
                    <line x1="4" y1="4" x2="9" y2="9" />
                  </svg>
                </button>
                <button className="control-btn" onClick={skipBack} title="Назад">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="19 20 9 12 19 4 19 20" />
                    <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
                <button className="control-btn play-btn" onClick={togglePlay} title={isPlaying ? 'Пауза' : 'Відтворити'}>
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>
                <button className="control-btn" onClick={skipForward} title="Вперед">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 4 15 12 5 20 5 4" />
                    <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
                <button className="control-btn" onClick={toggleRepeat} title="Повтор" style={{ opacity: isRepeat ? 1 : 0.6 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                </button>
              </div>
              <audio 
                ref={audioRef}
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onError={handleAudioError}
                onEnded={() => {
                  if (isRepeat) {
                    audioRef.current?.play();
                  } else {
                    setIsPlaying(false);
                  }
                }}
                loop={isRepeat}
              >
                <source src="/music/Perfect-Ed_Sheeran.mp3" type="audio/mpeg" />
                Ваш браузер не підтримує аудіо елемент.
              </audio>
            </div>
          </div>
          <a href="#invitation" className="hero-scroll">
            <span>Гортай</span>
            <span className="scroll-line" />
          </a>
        </section>

        {/* Invitation */}
        <section className="section invitation" id="invitation">
          <div className="ornament">✦ ✦ </div>
          <h2 className="section-title">Любі Гості!</h2>
          <div className="divider" />
          <div className="invitation-text">
            <p>Ми раді повідомити, що наше спільне життя розпочинається з чарівного дня, коли два серця стають одним.</p>
            <p>Щиро та з великою радістю запрошуємо Вас розділити з нами цю неймовірну мить щастя та любові.</p>
            <span className="invitation-names-highlight">Василь та Мирослова</span>
            <p>Ваша присутність зробить цей день ще більш особливим та незабутнім для нас.</p>
          </div>
        </section>

        {/* Countdown */}
        <section className="section countdown-section" id="countdown">
          <h2 className="section-title">До нашого свята</h2>
          <div className="section-subtitle">Зворотний відлік</div>
          <div className="countdown-wrapper">
            <CountdownItem value={timeLeft.days} label="Днів" />
            <CountdownItem value={timeLeft.hours} label="Годин" />
            <CountdownItem value={timeLeft.minutes} label="Хвилин" />
            <CountdownItem value={timeLeft.seconds} label="Секунд" />
          </div>
        </section>

        {/* Schedule */}
        <section className="section schedule" id="schedule">
          <h2 className="section-title">Програма дня</h2>
          <div className="section-subtitle">Розклад</div>
          <div className="timeline">
            {[
              { time: '17:00', event: 'Фуршет', desc: 'Ласкаво просимо до Restaurace u Tatyany', icon: '🥂' },
              { time: '18:00', event: 'Банкет та Вечірка', desc: 'Святкування, танці, веселощі', icon: '🎉' },
              { time: '21:00', event: 'Весільний торт', desc: 'Солодкий момент разом', icon: '🎂' },
            ].map((item, idx) => (
              <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'odd' : 'even'}`}>
                <div className="timeline-content">
                  <div className="timeline-icon">{item.icon}</div>
                  <div className="timeline-time">{item.time}</div>
                  <div className="timeline-event">{item.event}</div>
                  <div className="timeline-desc">{item.desc}</div>
                </div>
                <div className="timeline-dot" />
                <div className="timeline-spacer" />
              </div>
            ))}
          </div>
        </section>

        {/* Venue */}
        <section className="section venue" id="venue">
          <h2 className="section-title">Локація</h2>
          <div className="section-subtitle">Де нас знайти</div>
          <div className="venue-cards">
            <div className="venue-card">
              <div className="venue-icon">🏛️</div>
              <h3>Restaurace u Tatyany</h3>
              <div className="venue-type">Банкет та вечірка</div>
              <p className="venue-address">Zvonařka 411<br />602 00 Brno-střed-Trnitá, Чехія</p>
              <p>Фуршет о 17:00<br />Банкет о 18:00</p>
              <a href="https://maps.google.com/?q=Zvonařka+411,+602+00+Brno-střed-Trnitá,+Чехія" target="_blank" className="map-btn">Показати на карті</a>
            </div>
          </div>
        </section>

        {/* Dress Code */}
        <section className="section dresscode" id="dresscode">
          <h2 className="section-title">Дрес-код</h2>
          <div className="section-subtitle">Вільний стиль</div>
          <div className="dresscode-text">
            Ми не встановлюємо суворих рамок для дрес-коду. Для нас головне — ваша присутність та гарний настрій!<br />
            Будь ласка, обирайте вбрання, у якому ви почуватиметеся максимально комфортно та впевнено, незалежно від кольору чи стилю.
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-names">Василь & Мирослова</div>
          <div className="footer-date">10 листопада 2026</div>
          <div className="footer-hearts">♥ ♥ ♥</div>
        </footer>
      </div>

    </div>
  );
}

export default App;
