import { useEffect, useMemo, useRef, useState } from "react";

const OVENPLAYER_CDN = "https://cdn.jsdelivr.net/npm/ovenplayer/dist/ovenplayer.js";
const OME_HOST = "stream.masdjidlive.com";

function getWebRtcUrl(streamName) {
  const isHttps = window.location.protocol === "https:";
  const protocol = isHttps ? "wss" : "ws";
  const port = isHttps ? "3334" : "3333";
  return `${protocol}://${OME_HOST}:${port}/app/${streamName}`;
}

function loadOvenPlayerScript() {
  return new Promise((resolve, reject) => {
    if (window.OvenPlayer) {
      resolve(window.OvenPlayer);
      return;
    }

    const existing = document.querySelector(`script[src="${OVENPLAYER_CDN}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.OvenPlayer));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = OVENPLAYER_CDN;
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
  const containerRef = useRef(null);
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

    async function createPlayer() {
      try {
        setError("");
        setStatus("loading");

        const OvenPlayer = await loadOvenPlayerScript();
        if (cancelled || !containerRef.current) return;

        if (playerRef.current) {
          try {
            playerRef.current.remove();
          } catch (_) {}
          playerRef.current = null;
        }

        containerRef.current.innerHTML = "";

        const player = OvenPlayer.create(containerRef.current, {
          autoStart: true,
          autoFallback: true,
          controls: true,
          mute: false,
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
            if (cancelled) return;
            const nextState = data?.newstate || data?.state || "ready";
            setStatus(String(nextState));
          });

          player.on("error", (data) => {
            if (cancelled) return;
            console.error("OvenPlayer error:", data);
            setStatus("error");
            setError("Lecture impossible pour ce flux.");
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

    createPlayer();

    return () => {
      cancelled = true;
    };
  }, [signalingUrl, selectedStream, title]);

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
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedStream("stream")}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ccc",
              cursor: "pointer",
              background:
                selectedStream === "stream" ? "#111" : "#fff",
              color: selectedStream === "stream" ? "#fff" : "#111",
            }}
          >
            🎥 Studio
          </button>

          <button
            onClick={() => setSelectedStream("mobile")}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ccc",
              cursor: "pointer",
              background:
                selectedStream === "mobile" ? "#111" : "#fff",
              color: selectedStream === "mobile" ? "#fff" : "#111",
            }}
          >
            📱 Mobile
          </button>
        </div>

        <div
          style={{
            fontSize: 13,
            opacity: 0.75,
            wordBreak: "break-all",
            textAlign: "right",
          }}
        >
          Flux actif : <strong>{selectedStream}</strong>
        </div>
      </div>

      <div
        ref={containerRef}
        id="ome-player"
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          background: "#000",
          borderRadius: 14,
          overflow: "hidden",
        }}
      />

      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
        Statut : <strong>{status}</strong>
      </div>

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
        URL WebRTC : {signalingUrl}
      </div>

      {error ? (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
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