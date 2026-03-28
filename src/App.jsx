import { useRef, useState } from "react";

export default function App() {
  const hostname = window.location.hostname;

  if (hostname === "sahaba.masdjidlive.com") {
    return <SahabaPage />;
  }

  return <PlatformPage />;
}

function SahabaPage() {
  const audioUrl = "https://radio.masdjidlive.com/listen/sahaba/radio.mp3";
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("");

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) {
      setStatus("Lecteur audio introuvable.");
      return;
    }

    try {
      if (audio.paused) {
        setStatus("Connexion au direct...");
        await audio.play();
        setIsPlaying(true);
        setStatus("Live en cours.");
      } else {
        audio.pause();
        setIsPlaying(false);
        setStatus("Live arrêté.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Impossible de lancer le live.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        background:
          "linear-gradient(180deg, #0b3d2e 0%, #0f6b4f 55%, #f7f4ea 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "10px 16px",
            borderRadius: "999px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#ef4444",
              display: "inline-block",
            }}
          />
          Radio en direct de la mosquée Sahaba
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <div>
            <p
              style={{
                color: "#d1fae5",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Masjid Live
            </p>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.1,
                margin: "0 0 18px",
              }}
            >
              Écoutez la{" "}
              <span style={{ color: "#facc15" }}>mosquée Sahaba</span> en direct
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.92)",
                maxWidth: "620px",
              }}
            >
              Prières, khutbas et rappels accessibles partout, depuis votre
              téléphone, votre tablette ou votre ordinateur.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                marginTop: "28px",
              }}
            >
              <button
                onClick={toggleAudio}
                type="button"
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "16px 24px",
                  borderRadius: "18px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(127,29,29,0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isPlaying ? "⏸️ Stop Live" : "🔴 Live Mosquée SAHABA"}
              </button>

              <a
                href="#programme"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.08)",
                  padding: "16px 24px",
                  borderRadius: "18px",
                }}
              >
                Voir le programme
              </a>
            </div>

            <p
              style={{
                marginTop: "14px",
                color: "#d1fae5",
                minHeight: "24px",
              }}
            >
              {status}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p style={{ color: "#d1fae5", margin: 0, fontSize: "14px" }}>
                  En direct maintenant
                </p>
                <h2 style={{ margin: "6px 0 0", fontSize: "1.8rem" }}>
                  Mosquée Sahaba
                </h2>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "999px",
                  background: "rgba(239,68,68,0.18)",
                  border: "1px solid rgba(252,165,165,0.25)",
                  color: "#fee2e2",
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    display: "inline-block",
                  }}
                />
                LIVE
              </div>
            </div>

            <div
              style={{
                marginTop: "22px",
                background: "rgba(6, 78, 59, 0.65)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "18px",
                padding: "16px",
              }}
            >
              <audio
                ref={audioRef}
                controls
                preload="none"
                onPlay={() => {
                  setIsPlaying(true);
                  setStatus("Live en cours.");
                }}
                onPause={() => {
                  setIsPlaying(false);
                  setStatus("Live arrêté.");
                }}
                onError={() => {
                  setIsPlaying(false);
                  setStatus("Erreur de lecture audio.");
                }}
                style={{ width: "100%" }}
              >
                <source src={audioUrl} type="audio/mpeg" />
              </audio>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginTop: "18px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.09)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                  padding: "16px",
                }}
              >
                <p style={{ color: "#d1fae5", margin: "0 0 8px" }}>Contenu</p>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  Prières, khutbas, rappels
                </p>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.09)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                  padding: "16px",
                }}
              >
                <p style={{ color: "#d1fae5", margin: "0 0 8px" }}>Accès</p>
                <p style={{ margin: 0, fontWeight: 700 }}>24h/24 sur le web</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#f8fafc",
          color: "#0f172a",
          marginTop: "30px",
          borderTopLeftRadius: "40px",
          borderTopRightRadius: "40px",
          padding: "40px 20px 60px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #d1fae5",
                borderRadius: "24px",
                padding: "24px",
              }}
            >
              <div style={{ fontSize: "2rem" }}>🕌</div>
              <h3 style={{ color: "#064e3b" }}>Diffusion spirituelle</h3>
              <p style={{ lineHeight: 1.7 }}>
                Un accès simple aux temps forts de la mosquée Sahaba, même à
                distance.
              </p>
            </div>

            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "24px",
                padding: "24px",
              }}
            >
              <div style={{ fontSize: "2rem" }}>📻</div>
              <h3 style={{ color: "#92400e" }}>Écoute facile</h3>
              <p style={{ lineHeight: 1.7 }}>
                Un lecteur intégré, simple et adapté au mobile comme à
                l’ordinateur.
              </p>
            </div>

            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #d1fae5",
                borderRadius: "24px",
                padding: "24px",
              }}
            >
              <div style={{ fontSize: "2rem" }}>🌍</div>
              <h3 style={{ color: "#064e3b" }}>Accessible partout</h3>
              <p style={{ lineHeight: 1.7 }}>
                Idéal pour les fidèles, les familles et la diaspora.
              </p>
            </div>
          </div>

          <div
            id="programme"
            style={{
              marginTop: "28px",
              background: "linear-gradient(90deg, #064e3b 0%, #0f766e 100%)",
              color: "white",
              borderRadius: "32px",
              padding: "28px",
            }}
          >
            <p
              style={{
                color: "#d1fae5",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Programme
            </p>
            <h2 style={{ marginTop: 0, fontSize: "2rem" }}>
              Temps forts de la mosquée Sahaba
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginTop: "18px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "22px",
                  padding: "20px",
                }}
              >
                <h3>Prières quotidiennes</h3>
                <p style={{ lineHeight: 1.7 }}>
                  Diffusion des temps de recueillement et annonces importantes.
                </p>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "22px",
                  padding: "20px",
                }}
              >
                <h3>Khutba du vendredi</h3>
                <p style={{ lineHeight: 1.7 }}>
                  Suivez le sermon en direct depuis le bouton Live.
                </p>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "22px",
                  padding: "20px",
                }}
              >
                <h3>Rappels et cours</h3>
                <p style={{ lineHeight: 1.7 }}>
                  Écoutez les interventions et les rappels spirituels de la
                  mosquée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        background:
          "linear-gradient(180deg, #0b3d2e 0%, #0f6b4f 55%, #f7f4ea 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 20px 60px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "10px 16px",
            borderRadius: "999px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#ef4444",
              display: "inline-block",
            }}
          />
          Plateforme radio des mosquées
        </div>

        <div style={{ marginTop: "30px" }}>
          <p
            style={{
              color: "#d1fae5",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            Masjid Live
          </p>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1.1,
              margin: "0 0 18px",
            }}
          >
            La plateforme des{" "}
            <span style={{ color: "#facc15" }}>mosquées en direct</span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.92)",
              maxWidth: "700px",
            }}
          >
            Écoutez les prières, khutbas et rappels de plusieurs mosquées depuis
            une seule plateforme.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <a
            href="https://sahaba.masdjidlive.com"
            style={{
              textDecoration: "none",
              color: "white",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Mosquée Sahaba</h2>
            <p style={{ lineHeight: 1.7 }}>
              Accéder à la page dédiée de la mosquée Sahaba et écouter le
              direct.
            </p>
            <div
              style={{
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#dc2626",
                color: "white",
                padding: "12px 18px",
                borderRadius: "14px",
                fontWeight: 700,
              }}
            >
              Ouvrir Sahaba
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}