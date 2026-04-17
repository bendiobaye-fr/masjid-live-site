import { useEffect, useMemo, useRef, useState } from "react";

const OVENPLAYER_JS = "https://cdn.jsdelivr.net/npm/ovenplayer/dist/ovenplayer.js";
const OVENPLAYER_CSS = "https://cdn.jsdelivr.net/npm/ovenplayer/dist/ovenplayer.css";

// 👉 TON DOMAINE OME
const OME_HOST = "stream.masdjidlive.com";

function getWebRtcUrl(streamName) {
  const isHttps = window.location.protocol === "https:";
  const protocol = isHttps ? "wss" : "ws";
  const port = isHttps ? "3334" : "3333";

  return `${protocol}://${OME_HOST}:${port}/app/${streamName}`;
}

function loadOvenPlayerAssets() {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${OVENPLAYER_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = OVENPLAYER_CSS;
      document.head.appendChild(link);
    }

    if (window.OvenPlayer) {
      resolve(window.OvenPlayer);
      return;
    }

    const script = document.createElement("script");
    script.src = OVENPLAYER_JS;
    script.async = true;
    script.onload = () => resolve(window.OvenPlayer);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function RadioPlayer({
  title = "Masjid Live",
  defaultStream = "stream",
}) {
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);

  const [selectedStream, setSelectedStream] = useState(defaultStream);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const signalingUrl = useMemo(
    () => getWebRtcUrl(selectedStream),
    [selectedStream]
  );

  useEffect(() => {
    let cancelled = false;

    async function initPlayer() {
      try {
        setError("");
        setStatus("loading");

        const OvenPlayer = await loadOvenPlayerAssets();
        if (cancelled || !playerContainerRef.current) return;

        // clean ancien player
        if (playerRef.current) {
          try {
            playerRef.current.remove();
          } catch (_) {}
          playerRef.current = null;
        }

        playerContainerRef.current.innerHTML = "";

        const player = OvenPlayer.create(playerContainerRef.current, {
          autoStart: true,
          mute: false, // 🔥 IMPORTANT pour entendre le son
          controls: true,
          showBigPlayButton: true,
          expandFullScreenUI: true,
          iOSFakeFullScreen: true,
          title:
            selectedStream === "mobile"
              ? `${title} - Mobile`
              : `${title} - Studio`,
          sources: [
            {
              label: selectedStream,
              type: "webrtc",
              file: signalingUrl,
            },
          ],
        });

        playerRef.current = player;

        player.on("ready", () => {
          if (!cancelled) setStatus("ready");
        });

        player.on("stateChanged", (data) => {
          if (!cancelled) {
            setStatus(data?.newstate || data?.state || "playing");
          }
        });

        player.on("error", (data) => {
          console.error("OvenPlayer error:", data);
          if (!cancelled) {
            setStatus("error");
            setError("❌ Impossible de lire le flux WebRTC");
          }
        });
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setStatus("error");
          setError("❌ Erreur chargement player");
        }
      }
    }

    initPlayer();

    return () => {
      cancelled = true;
    };
  }, [selectedStream, signalingUrl, title]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.remove();
        } catch (_) {}
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      {/* Boutons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button onClick={() => setSelectedStream("stream")}>
          🎥 Studio
        </button>

        <button onClick={() => setSelectedStream("mobile")}>
          📱 Mobile
        </button>
      </div>

      {/* Player */}
      <div
        ref={playerContainerRef}
        style={{
          width: "100%",
          height: 360,
          background: "#000",
          borderRadius: 10,
        }}
      />

      {/* Debug */}
      <div style={{ marginTop: 10 }}>
        <div>Status : {status}</div>
        <div style={{ fontSize: 12 }}>
          URL : {signalingUrl}
        </div>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: 10 }}>{error}</div>
      )}
    </div>
  );
}