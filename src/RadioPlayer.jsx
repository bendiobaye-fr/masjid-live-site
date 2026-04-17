import { useEffect, useMemo, useRef, useState } from "react";

const OVENPLAYER_JS = "https://cdn.jsdelivr.net/npm/ovenplayer/dist/ovenplayer.js";
const OVENPLAYER_CSS = "https://cdn.jsdelivr.net/npm/ovenplayer/dist/ovenplayer.css";
const OME_HOST = "217.160.172.184";

function getWebRtcUrl(streamName) {
  return `ws://${OME_HOST}:3333/app/${streamName}`;
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

    const existing = document.querySelector(`script[src="${OVENPLAYER_JS}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.OvenPlayer));
      existing.addEventListener("error", reject);
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

        if (playerRef.current) {
          try {
            playerRef.current.remove();
          } catch (_) {}
          playerRef.current = null;
        }

        playerContainerRef.current.innerHTML = "";

        const player = OvenPlayer.create(playerContainerRef.current, {
          autoStart: true,
          autoFallback: true,
          mute: false,
          controls: true,
          showBigPlayButton: true,
          expandFullScreenUI: true,
          iOSFakeFullScreen: true,
          title: `${title} - ${selectedStream === "mobile" ? "Mobile" : "Studio"}`,
          sources: [
            {
              label: selectedStream === "mobile" ? "Mobile" : "Studio",
              type: "webrtc",
              file: signalingUrl,
            },
          ],
        });

        playerRef.current = player;

        if (player && typeof player.on === "function") {
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
              setError("Le player n'arrive pas à afficher ce flux.");
            }
          });
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setStatus("error");
          setError("Impossible de charger le player WebRTC.");
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
    <div
      style={{
        width: "100%",
        maxWidth: 980,
        margin: "0 auto",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setSelectedStream("stream")}
            style={{
              padding: "12px 18px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.35)",
              background: selectedStream === "stream" ? "#f3f3f3" : "#111",
              color: selectedStream === "stream" ? "#111" : "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            🎥 Studio
          </button>

          <button
            onClick={() => setSelectedStream("mobile")}
            style={{
              padding: "12px 18px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.35)",
              background: selectedStream === "mobile" ? "#111" : "#f3f3f3",
              color: selectedStream === "mobile" ? "#fff" : "#111",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            📱 Mobile
          </button>
        </div>

        <div style={{ fontSize: 14, opacity: 0.9 }}>
          Flux actif : <strong>{selectedStream}</strong>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          minHeight: 360,
          background: "#000",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        <div
          ref={playerContainerRef}
          id="ome-player"
          style={{
            width: "100%",
            height: "360px",
            background: "#000",
          }}
        />
      </div>

      <div style={{ marginTop: 14, fontSize: 14 }}>
        Statut : <strong>{status}</strong>
      </div>

      <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8, wordBreak: "break-all" }}>
        URL WebRTC : {signalingUrl}
      </div>

      {error ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            background: "#fff3f3",
            color: "#a10000",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}