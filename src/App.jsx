import RadioPlayer from "./RadioPlayer";
import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MOSQUES = [
  {
    name: "Mosquée Sahaba",
    city: "Créteil",
    url: "https://sahaba.masdjidlive.com",
    description: {
      fr: "Prières, khutbas et rappels en direct.",
      en: "Prayers, khutbas and reminders live.",
      ar: "الصلوات والخطب والتذكير الديني مباشرة.",
    },
    lat: 48.7904,
    lng: 2.4556,
  },
  {
    name: "Mosquée Touba",
    city: "Paris",
    url: "https://touba.masdjidlive.com",
    description: {
      fr: "Station à venir.",
      en: "Station coming soon.",
      ar: "المحطة قريباً.",
    },
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    name: "Mosquée Médina",
    city: "Lyon",
    url: "https://medina.masdjidlive.com",
    description: {
      fr: "Station à venir.",
      en: "Station coming soon.",
      ar: "المحطة قريباً.",
    },
    lat: 45.764,
    lng: 4.8357,
  },
  {
    name: "Mosquée Ali Hacene-Blidi",
    city: "Marseille",
    url: "https://alihaceneblidi.masdjidlive.com",
    description: {
      fr: "Station à venir.",
      en: "Station coming soon.",
      ar: "المحطة قريباً.",
    },
    lat: 43.2965,
    lng: 5.3698,
  },
];

const translations = {
  fr: {
    badge: "Plateforme radio des mosquées",
    brand: "Masjid Live",
    heroTitle: "Trouvez une mosquée en direct",
    heroSubtitle:
      "Recherchez une mosquée par ville ou par nom, puis accédez directement à sa radio en direct.",
    searchLabel: "Rechercher par ville ou par nom de mosquée",
    searchPlaceholder: "Exemple : Créteil ou Sahaba",
    reset: "Réinitialiser",
    openPage: "Ouvrir la page",
    resultsSuffix: "résultat(s) trouvé(s)",
    mapTitle: "Carte interactive des mosquées",
    mapSubtitle:
      "Cliquez sur un marqueur pour accéder à la page dédiée de la mosquée.",
    noResultTitle: "Aucun résultat",
    noResultText:
      "Aucune mosquée ne correspond à cette recherche pour le moment.",
  },
  en: {
    badge: "Mosque radio platform",
    brand: "Masjid Live",
    heroTitle: "Find a mosque live",
    heroSubtitle:
      "Search for a mosque by city or name, then access its live radio directly.",
    searchLabel: "Search by city or mosque name",
    searchPlaceholder: "Example: Creteil or Sahaba",
    reset: "Reset",
    openPage: "Open page",
    resultsSuffix: "result(s) found",
    mapTitle: "Interactive mosque map",
    mapSubtitle: "Click on a marker to open the mosque page.",
    noResultTitle: "No result",
    noResultText: "No mosque matches this search yet.",
  },
  ar: {
    badge: "منصة إذاعات المساجد",
    brand: "مسجد لايف",
    heroTitle: "اعثر على مسجد مباشر",
    heroSubtitle:
      "ابحث عن مسجد حسب المدينة أو الاسم ثم ادخل مباشرة إلى البث الإذاعي المباشر.",
    searchLabel: "ابحث حسب المدينة أو اسم المسجد",
    searchPlaceholder: "مثال: كريتاي أو الصحابة",
    reset: "إعادة التعيين",
    openPage: "افتح الصفحة",
    resultsSuffix: "نتيجة",
    mapTitle: "خريطة المساجد التفاعلية",
    mapSubtitle: "اضغط على العلامة لفتح الصفحة الخاصة بالمسجد.",
    noResultTitle: "لا توجد نتائج",
    noResultText: "لا يوجد مسجد يطابق هذا البحث حالياً.",
  },
};

const sahabaTranslations = {
  fr: {
    badge: "Radio en direct de la mosquée Sahaba",
    brand: "Masjid Live",
    heroTitleBefore: "Écoutez la",
    heroTitleHighlight: "mosquée Sahaba",
    heroTitleAfter: "en direct",
    heroSubtitle:
      "Prières, khutbas et rappels accessibles partout, depuis votre téléphone, votre tablette ou votre ordinateur.",
    programButton: "Voir le programme",
    nowLive: "En direct maintenant",
    mosqueName: "Mosquée Sahaba",
    liveBadge: "LIVE",
    contentLabel: "Contenu",
    contentValue: "Prières, khutbas, rappels",
    accessLabel: "Accès",
    accessValue: "24h/24 sur le web",
    spiritualTitle: "Diffusion spirituelle",
    spiritualText:
      "Un accès simple aux temps forts de la mosquée Sahaba, même à distance.",
    listeningTitle: "Écoute facile",
    listeningText:
      "Un lecteur intégré, simple et adapté au mobile comme à l’ordinateur.",
    accessibleTitle: "Accessible partout",
    accessibleText: "Idéal pour les fidèles, les familles et la diaspora.",
    programLabel: "Programme",
    programTitle: "Temps forts de la mosquée Sahaba",
    dailyPrayerTitle: "Prières quotidiennes",
    dailyPrayerText:
      "Diffusion des temps de recueillement et annonces importantes.",
    khutbaTitle: "Khutba du vendredi",
    khutbaText: "Suivez le sermon en direct depuis le lecteur ci-dessus.",
    remindersTitle: "Rappels et cours",
    remindersText:
      "Écoutez les interventions et les rappels spirituels de la mosquée.",
  },
  en: {
    badge: "Live radio from Sahaba Mosque",
    brand: "Masjid Live",
    heroTitleBefore: "Listen to",
    heroTitleHighlight: "Sahaba Mosque",
    heroTitleAfter: "live",
    heroSubtitle:
      "Prayers, khutbas and reminders accessible everywhere from your phone, tablet or computer.",
    programButton: "See the schedule",
    nowLive: "Live now",
    mosqueName: "Sahaba Mosque",
    liveBadge: "LIVE",
    contentLabel: "Content",
    contentValue: "Prayers, khutbas, reminders",
    accessLabel: "Access",
    accessValue: "24/7 on the web",
    spiritualTitle: "Spiritual broadcast",
    spiritualText:
      "Easy access to the key moments of Sahaba Mosque, even from afar.",
    listeningTitle: "Easy listening",
    listeningText:
      "An integrated player, simple and adapted to mobile and desktop.",
    accessibleTitle: "Accessible everywhere",
    accessibleText: "Ideal for worshippers, families and the diaspora.",
    programLabel: "Schedule",
    programTitle: "Highlights of Sahaba Mosque",
    dailyPrayerTitle: "Daily prayers",
    dailyPrayerText:
      "Broadcast of prayer moments and important announcements.",
    khutbaTitle: "Friday khutba",
    khutbaText: "Follow the sermon live from the player above.",
    remindersTitle: "Reminders and lessons",
    remindersText:
      "Listen to talks and spiritual reminders from the mosque.",
  },
  ar: {
    badge: "إذاعة مباشرة من مسجد الصحابة",
    brand: "مسجد لايف",
    heroTitleBefore: "استمع إلى",
    heroTitleHighlight: "مسجد الصحابة",
    heroTitleAfter: "مباشرة",
    heroSubtitle:
      "الصلوات والخطب والتذكير الديني متاحة من أي مكان عبر الهاتف أو الجهاز اللوحي أو الحاسوب.",
    programButton: "عرض البرنامج",
    nowLive: "مباشر الآن",
    mosqueName: "مسجد الصحابة",
    liveBadge: "مباشر",
    contentLabel: "المحتوى",
    contentValue: "صلوات، خطب، تذكير ديني",
    accessLabel: "الوصول",
    accessValue: "على الويب 24/24",
    spiritualTitle: "بث روحاني",
    spiritualText: "وصول سهل إلى أبرز لحظات مسجد الصحابة حتى من بعيد.",
    listeningTitle: "استماع سهل",
    listeningText: "مشغل مدمج بسيط ومناسب للهاتف والحاسوب.",
    accessibleTitle: "متاح في كل مكان",
    accessibleText: "مناسب للمصلين والعائلات والجالية.",
    programLabel: "البرنامج",
    programTitle: "أبرز أوقات مسجد الصحابة",
    dailyPrayerTitle: "الصلوات اليومية",
    dailyPrayerText: "بث أوقات التعبد والإعلانات المهمة.",
    khutbaTitle: "خطبة الجمعة",
    khutbaText: "تابع الخطبة مباشرة عبر المشغل أعلاه.",
    remindersTitle: "الدروس والتذكير",
    remindersText: "استمع إلى الدروس والتذكير الروحي من المسجد.",
  },
};

function normalizeText(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function LanguageSelector({ language, setLanguage }) {
  const buttonStyle = (lang) => ({
    background: language === lang ? "#dc2626" : "rgba(255,255,255,0.08)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.25)",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 700,
    cursor: "pointer",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px",
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        style={buttonStyle("fr")}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        style={buttonStyle("en")}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        style={buttonStyle("ar")}
      >
        AR
      </button>
    </div>
  );
}

export default function App() {
  const hostname = window.location.hostname.toLowerCase();

  if (hostname.includes("sahaba")) {
    return <SahabaPage />;
  }

  return <PlatformPage />;
}

function SahabaPage() {
  const [language, setLanguage] = useState("fr");

  const t = sahabaTranslations[language];
  const isArabic = language === "ar";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        minHeight: "100vh",
        margin: 0,
        background:
          "linear-gradient(180deg, #0b3d2e 0%, #0f6b4f 55%, #f7f4ea 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        textAlign: isArabic ? "right" : "left",
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
          {t.badge}
        </div>

        <LanguageSelector language={language} setLanguage={setLanguage} />

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
              {t.brand}
            </p>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.1,
                margin: "0 0 18px",
              }}
            >
              {t.heroTitleBefore}{" "}
              <span style={{ color: "#facc15" }}>{t.heroTitleHighlight}</span>{" "}
              {t.heroTitleAfter}
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.92)",
                maxWidth: "620px",
              }}
            >
              {t.heroSubtitle}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                marginTop: "28px",
              }}
            >
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
                {t.programButton}
              </a>
            </div>
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
                  {t.nowLive}
                </p>
                <h2 style={{ margin: "6px 0 0", fontSize: "1.8rem" }}>
                  {t.mosqueName}
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
                {t.liveBadge}
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
              <RadioPlayer />
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
                <p style={{ color: "#d1fae5", margin: "0 0 8px" }}>
                  {t.contentLabel}
                </p>
                <p style={{ margin: 0, fontWeight: 700 }}>{t.contentValue}</p>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.09)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                  padding: "16px",
                }}
              >
                <p style={{ color: "#d1fae5", margin: "0 0 8px" }}>
                  {t.accessLabel}
                </p>
                <p style={{ margin: 0, fontWeight: 700 }}>{t.accessValue}</p>
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
              <h3 style={{ color: "#064e3b" }}>{t.spiritualTitle}</h3>
              <p style={{ lineHeight: 1.7 }}>{t.spiritualText}</p>
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
              <h3 style={{ color: "#92400e" }}>{t.listeningTitle}</h3>
              <p style={{ lineHeight: 1.7 }}>{t.listeningText}</p>
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
              <h3 style={{ color: "#064e3b" }}>{t.accessibleTitle}</h3>
              <p style={{ lineHeight: 1.7 }}>{t.accessibleText}</p>
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
              {t.programLabel}
            </p>

            <h2 style={{ marginTop: 0, fontSize: "2rem" }}>
              {t.programTitle}
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
                <h3>{t.dailyPrayerTitle}</h3>
                <p style={{ lineHeight: 1.7 }}>{t.dailyPrayerText}</p>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "22px",
                  padding: "20px",
                }}
              >
                <h3>{t.khutbaTitle}</h3>
                <p style={{ lineHeight: 1.7 }}>{t.khutbaText}</p>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "22px",
                  padding: "20px",
                }}
              >
                <h3>{t.remindersTitle}</h3>
                <p style={{ lineHeight: 1.7 }}>{t.remindersText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformPage() {
  const [language, setLanguage] = useState("fr");
  const [searchCity, setSearchCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const t = translations[language];
  const isArabic = language === "ar";

  const filteredMosques = useMemo(() => {
    const query = normalizeText(searchCity.trim());

    if (!query) return MOSQUES;

    return MOSQUES.filter((mosque) => {
      const city = normalizeText(mosque.city);
      const name = normalizeText(mosque.name);
      return city.includes(query) || name.includes(query);
    });
  }, [searchCity]);

  const suggestions = useMemo(() => {
    const values = [];

    MOSQUES.forEach((mosque) => {
      values.push(mosque.city);
      values.push(mosque.name);
    });

    const uniqueValues = [...new Set(values)];
    const query = normalizeText(searchCity.trim());

    if (!query) return uniqueValues;

    return uniqueValues.filter((value) => normalizeText(value).includes(query));
  }, [searchCity]);

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        minHeight: "100vh",
        margin: 0,
        background:
          "linear-gradient(180deg, #0b3d2e 0%, #0f6b4f 55%, #f7f4ea 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        textAlign: isArabic ? "right" : "left",
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
          {t.badge}
        </div>

        <LanguageSelector language={language} setLanguage={setLanguage} />

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
            {t.brand}
          </p>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1.1,
              margin: "0 0 18px",
            }}
          >
            {t.heroTitle}
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.92)",
              maxWidth: "700px",
            }}
          >
            {t.heroSubtitle}
          </p>
        </div>

        <div
          style={{
            marginTop: "32px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>
            {t.searchLabel}
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: "1 1 280px",
              }}
            >
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchCity}
                onChange={(e) => {
                  setSearchCity(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.96)",
                  color: "#0f172a",
                  fontSize: "1rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              {showSuggestions &&
                searchCity.trim() &&
                suggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      right: 0,
                      background: "white",
                      color: "#0f172a",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                      zIndex: 20,
                    }}
                  >
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setSearchCity(suggestion);
                          setShowSuggestions(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: isArabic ? "right" : "left",
                          padding: "12px 16px",
                          border: "none",
                          background: "white",
                          cursor: "pointer",
                          fontSize: "0.98rem",
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchCity("");
                setShowSuggestions(false);
              }}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "14px 18px",
                borderRadius: "16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.reset}
            </button>
          </div>

          <p
            style={{
              marginTop: "14px",
              marginBottom: 0,
              color: "#d1fae5",
            }}
          >
            {filteredMosques.length} {t.resultsSuffix}
          </p>
        </div>

        <div
          style={{
            marginTop: "30px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>{t.mapTitle}</h2>

          <p style={{ color: "#d1fae5", marginTop: 0, marginBottom: "18px" }}>
            {t.mapSubtitle}
          </p>

          <div
            style={{
              overflow: "hidden",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <MapContainer
              center={[46.6034, 1.8883]}
              zoom={6}
              scrollWheelZoom={true}
              style={{ height: "480px", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredMosques.map((mosque) => (
                <Marker
                  key={`${mosque.name}-${mosque.city}`}
                  position={[mosque.lat, mosque.lng]}
                >
                  <Popup>
                    <div style={{ minWidth: "180px" }}>
                      <strong>{mosque.name}</strong>
                      <br />
                      {mosque.city}
                      <br />
                      <span>{mosque.description[language]}</span>
                      <br />
                      <br />
                      <a
                        href={mosque.url}
                        style={{
                          color: "#0f766e",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        {t.openPage}
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {filteredMosques.map((mosque) => (
            <a
              key={`${mosque.name}-${mosque.city}`}
              href={mosque.url}
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
              <p
                style={{
                  marginTop: 0,
                  marginBottom: "8px",
                  color: "#d1fae5",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {mosque.city}
              </p>

              <h2 style={{ marginTop: 0 }}>{mosque.name}</h2>

              <p style={{ lineHeight: 1.7 }}>{mosque.description[language]}</p>

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
                {t.openPage}
              </div>
            </a>
          ))}
        </div>

        {filteredMosques.length === 0 && (
          <div
            style={{
              marginTop: "24px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "24px",
              padding: "24px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{t.noResultTitle}</h3>
            <p style={{ marginBottom: 0 }}>{t.noResultText}</p>
          </div>
        )}
      </div>
    </div>
  );
}