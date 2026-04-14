import { useEffect, useRef, useState } from "react";

export default function RadioPlayer() {
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const [status, setStatus] = useState("Prêt à lire");
  const [showFallbackButton, setShowFallbackButton] = useState(false);

  const WEBRTC_URL = "wss://stream.masdjidlive.com:3334/app/stream";
  const FALLBACK_URL = "https://radio.masdjidlive.com/listen/sahaba/radio.mp3";

  const clearPlayer = () => {
    if (playerRef.current) {
      try {
        playerRef.current.remove();
      } catch (e) {}
      playerRef.current = null;
    }

    if (playerContainerRef.current) {
      playerContainerRef.current.innerHTML = "";
    }
  };

  const startWebRTC = () => {
    if (!playerContainerRef.current || !window.OvenPlayer) {
      setStatus("OvenPlayer introuvable");
      return;
    }

    setShowFallbackButton(false);
    clearPlayer();

    try {
      const div = document.createElement("div");
      div.style.width = "100%";
      div.style.height = "120px";
      playerContainerRef.current.appendChild(div);

      playerRef.current = window.OvenPlayer.create(div, {
        autoStart: true,
        sources: [
          {
            type: "webrtc",
            file: WEBRTC_URL,
          },
        ],
      });

      setStatus("Connexion WebRTC…");

      playerRef.current.on("ready", () => {
        setStatus("Player prêt");
      });

      playerRef.current.on("playing", () => {
        setStatus("En direct (WebRTC)");
      });

      playerRef.current.on("error", (err) => {
        console.error("Erreur WebRTC :", err);
        setStatus("Erreur WebRTC");
        setShowFallbackButton(true);
      });
    } catch (err) {
      console.error(err);
      setStatus("Impossible de lancer WebRTC");
      setShowFallbackButton(true);
    }
  };

  const startFallback = () => {
    clearPlayer();
    setStatus("Lecture via flux secours…");

    if (!playerContainerRef.current) return;

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = FALLBACK_URL;
    audio.style.width = "100%";
    audio.setAttribute("playsinline", "true");

    audio.onerror = (err) => {
      console.error("Erreur fallback:", err);
      setStatus("Erreur fallback");
    };

    playerContainerRef.current.appendChild(audio);

    audio
      .play()
      .then(() => setStatus("En lecture (fallback)"))
      .catch((err) => {
        console.error("Erreur fallback:", err);
        setStatus("Erreur fallback");
      });
  };

  const stopPlayer = () => {
    clearPlayer();
    setStatus("Arrêté");
    setShowFallbackButton(false);
  };

  useEffect(() => {
    return () => {
      clearPlayer();
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "auto",
        padding: 16,
        borderRadius: 16,
        background: "#111",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h3>🔊 Radio Masdjidlive</h3>
      <p>{status}</p>

      <div ref={playerContainerRef} />

      <div style={{ marginTop: 12 }}>
        <button onClick={startWebRTC}>▶ Lire</button>
        <button onClick={stopPlayer} style={{ marginLeft: 10 }}>
          ■ Stop
        </button>

        {showFallbackButton && (
          <button onClick={startFallback} style={{ marginLeft: 10 }}>
            Flux secours
          </button>
        )}
      </div>
    </div>
  );
}