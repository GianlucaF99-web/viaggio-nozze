import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Gift,
  CreditCard,
  Landmark,
  Plane,
  Globe,
  ArrowRight,
  Compass,
  Stars,
  Flag,
  MapPinned,
} from "lucide-react";
import countriesGeo from "world-atlas/countries-110m.json";
import { ComposableMap, Geographies, Geography, Marker, Line, Sphere } from "@vnedyalk0v/react19-simple-maps";

const PAYMENT_CARD_URL = "https://example.com/paga-con-carta";
const BANK_TRANSFER_PAGE_URL = "https://example.com/bonifico";
const IBAN = "IT25 O030 6917 4111 0000 0010 968";
const BIC = "BCITITMMXXX";
const ACCOUNT_HOLDER = "Simone Antonio Floris";
const PAYMENT_NOTE = "Regalo di nozze";
const GEO_URL = typeof window !== "undefined"
  ? new URL("/countries-110m.json", window.location.origin).toString()
  : "/countries-110m.json";

const START = { name: "Cagliari", lat: 39.2238, lon: 9.1217, flag: "🇮🇹" };
const START_PROGRESS_STAGE_NUMBER = 16;
const VISUAL_PREVIEW_MULTIPLIER = 8;

const VISITED_PLACES = [
  { name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
  { name: "Düsseldorf", lat: 51.2277, lon: 6.7735 },
  { name: "Santa Cruz de Tenerife", lat: 28.4636, lon: -16.2518 },
  { name: "Palma di Maiorca", lat: 39.5696, lon: 2.6502 },
  { name: "Minorca", lat: 39.9496, lon: 4.11 },
  { name: "Mombasa", lat: -4.0435, lon: 39.6682 },
  { name: "Kiwengwa (Zanzibar)", lat: -5.9893, lon: 39.3768 },
  { name: "Morogoro", lat: -6.8278, lon: 37.6591 },
  { name: "Mykonos", lat: 37.4467, lon: 25.3289 },
  { name: "Santorini", lat: 36.3932, lon: 25.4615 },
];

const DESTINATION_CAPITALS = [
{ name: "Madrid", lat: 40.4168, lon: -3.7038, flag: "🇪🇸", flagCode: "es" },
{ name: "Parigi", lat: 48.8566, lon: 2.3522, flag: "🇫🇷", flagCode: "fr" },
{ name: "Berlino", lat: 52.52, lon: 13.405, flag: "🇩🇪", flagCode: "de" },
{ name: "Londra", lat: 51.5072, lon: -0.1276, flag: "🇬🇧", flagCode: "gb" },
{ name: "Mosca", lat: 55.7558, lon: 37.6173, flag: "🇷🇺", flagCode: "ru" },
{ name: "Mumbai", lat: 19.076, lon: 72.8777, flag: "🇮🇳", flagCode: "in" },
{ name: "Calcutta", lat: 22.5726, lon: 88.3639, flag: "🇮🇳", flagCode: "in" },
{ name: "Bangkok", lat: 13.7563, lon: 100.5018, flag: "🇹🇭", flagCode: "th" },
{ name: "Giacarta", lat: -6.2088, lon: 106.8456, flag: "🇮🇩", flagCode: "id" },
{ name: "Hanoi", lat: 21.0278, lon: 105.8342, flag: "🇻🇳", flagCode: "vn" },
{ name: "Pechino", lat: 39.9042, lon: 116.4074, flag: "🇨🇳", flagCode: "cn" },
{ name: "Tokyo", lat: 35.6762, lon: 139.6503, flag: "🇯🇵", flagCode: "jp" },
{ name: "Port Moresby", lat: -9.4438, lon: 147.1803, flag: "🇵🇬", flagCode: "pg" },
{ name: "Sydney", lat: -33.8688, lon: 151.2093, flag: "🇦🇺", flagCode: "au" },
{ name: "Christchurch", lat: -43.5321, lon: 172.6362, flag: "🇳🇿", flagCode: "nz" },
{ name: "Honolulu", lat: 21.3099, lon: -157.8581, flag: "🇺🇸", flagCode: "us" },
{ name: "Ushuaia", lat: -54.8019, lon: -68.303, flag: "🇦🇷", flagCode: "ar" },
{ name: "Santiago del Cile", lat: -33.4489, lon: -70.6693, flag: "🇨🇱", flagCode: "cl" },
{ name: "Montevideo", lat: -34.9011, lon: -56.1645, flag: "🇺🇾", flagCode: "uy" },
{ name: "San Paolo", lat: -23.5505, lon: -46.6333, flag: "🇧🇷", flagCode: "br" },
{ name: "Salvador", lat: -12.9777, lon: -38.5016, flag: "🇧🇷", flagCode: "br" },
{ name: "Manaus", lat: -3.119, lon: -60.0217, flag: "🇧🇷", flagCode: "br" },
{ name: "Bogotà", lat: 4.711, lon: -74.0721, flag: "🇨🇴", flagCode: "co" },
{ name: "Maracaibo", lat: 10.6545, lon: -71.65, flag: "🇻🇪", flagCode: "ve" },
{ name: "Culiacán", lat: 24.8091, lon: -107.394, flag: "🇲🇽", flagCode: "mx" },
{ name: "San Francisco", lat: 37.7749, lon: -122.4194, flag: "🇺🇸", flagCode: "us" },
{ name: "Baltimora", lat: 39.2904, lon: -76.6122, flag: "🇺🇸", flagCode: "us" },
{ name: "Vancouver", lat: 49.2827, lon: -123.1207, flag: "🇨🇦", flagCode: "ca" },
{ name: "Montreal", lat: 45.5019, lon: -73.5674, flag: "🇨🇦", flagCode: "ca" },
{ name: "Anchorage", lat: 61.2181, lon: -149.9003, flag: "🇺🇸", flagCode: "us" },
{ name: "Astana", lat: 51.1694, lon: 71.4491, flag: "🇰🇿", flagCode: "kz" },
{ name: "Nordkapp", lat: 71.1725, lon: 25.7836, flag: "🇳🇴", flagCode: "no" },
{ name: "Stoccolma", lat: 59.3293, lon: 18.0686, flag: "🇸🇪", flagCode: "se" },
];

const ROUTE = [START, ...DESTINATION_CAPITALS];

function haversineMiles(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function buildRouteMeta(route) {
  const segments = [];
  let total = 0;
  for (let i = 0; i < route.length - 1; i += 1) {
    const from = route[i];
    const to = route[i + 1];
    const miles = haversineMiles(from, to);
    segments.push({ index: i, from, to, miles, startMiles: total, endMiles: total + miles });
    total += miles;
  }
  return { segments, totalMiles: total };
}

function getPositionOnRoute(meta, miles) {
  const safeMiles = Math.max(0, Math.min(miles, meta.totalMiles));
  const segment =
    meta.segments.find((item) => safeMiles >= item.startMiles && safeMiles <= item.endMiles) ||
    meta.segments[meta.segments.length - 1];

  const localMiles = safeMiles - segment.startMiles;
  const t = segment.miles === 0 ? 0 : localMiles / segment.miles;
  const lat = segment.from.lat + (segment.to.lat - segment.from.lat) * t;
  const lon = segment.from.lon + (segment.to.lon - segment.from.lon) * t;
  return { lat, lon, segment, t };
}

function getCurrentTarget(meta, miles) {
  const safeMiles = Math.max(0, Math.min(miles, meta.totalMiles));
  return meta.segments.find((item) => safeMiles < item.endMiles)?.to || meta.segments[meta.segments.length - 1]?.to;
}

function getCompletedStops(meta, miles) {
  return meta.segments.filter((item) => miles >= item.endMiles).length;
}

function getVisibleSegments(meta, progressStartStage) {
  return meta.segments.filter((segment) => segment.index + 1 >= progressStartStage);
}

function formatMiles(value) {
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 }).format(Math.round(value));
}

function formatEuro(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function useQueryParams() {
  const [params, setParams] = useState({ paid: false, amount: 150 });
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const paid = search.get("paid") === "1";
    const amount = Number(search.get("amount") || 150);
    setParams({ paid, amount: Number.isFinite(amount) && amount > 0 ? amount : 150 });
  }, []);
  return params;
}

function SoftStat({ label, value, helper }) {
  return (
    <div className="rounded-[4px] border border-stone-300 bg-[#fcfaf6] p-5 shadow-none">
      <div className="font-serif text-[11px] uppercase tracking-[0.24em] text-stone-500">{label}</div>
      <div className="mt-3 font-serif text-3xl font-semibold leading-tight text-slate-900">{value}</div>
      <div className="mt-2 text-sm leading-6 text-stone-600">{helper}</div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children, className = "" }) {
  return (
    <div className={`rounded-[30px] border border-stone-200 bg-white/88 p-6 shadow-sm shadow-stone-200/60 ${className}`}>
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 border border-stone-400 bg-transparent px-4 py-2">
          <Icon className="h-4 w-4 text-stone-700" />
          <h3 className="font-serif text-[12px] font-normal uppercase tracking-[0.28em] text-stone-700">
            {title}
          </h3>
        </div>
      </div>

      <div className="text-sm leading-7 text-stone-700">{children}</div>
    </div>
  );
}

function DestinationLegendItem({ stage, name, flag, active = false, reached = false }) {
  return (
    <div className={`rounded-[22px] border px-4 py-3 ${active ? "border-rose-200 bg-rose-50" : reached ? "border-amber-200 bg-amber-50/80" : "border-stone-200 bg-stone-50/80"}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold ${active ? "bg-rose-500 text-white" : reached ? "bg-amber-500 text-white" : "bg-white text-slate-900"}`}>
          {stage}
        </div>
        <div className="text-xl leading-none">{flag}</div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-900">{name}</div>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em]">
            {active ? <span className="text-rose-600">Tappa attuale</span> : null}
            {!active && reached ? <span className="text-amber-700">Già nel percorso</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitedPlaceItem({ name }) {
  return (
    <div className="rounded-[20px] border border-stone-200 bg-stone-50/85 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Flag className="h-4 w-4" />
        </div>
        <div className="text-sm font-medium text-slate-900">{name}</div>
      </div>
    </div>
  );
}

function VisitedFlagMarker({ coordinates }) {
  return (
    <Marker coordinates={coordinates}>
      <g opacity="0.98">
        <line x1="0" y1="0" x2="0" y2="-16" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="2.8" fill="#0f172a" />
        <path d="M0 -16 L10 -12 L0 -8 Z" fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
        <path d="M0 -16 L4 -14.3 L0 -12.8 Z" fill="#ffffff" />
      </g>
    </Marker>
  );
}

function StageMarker({ stop, stage, active, reached }) {
  const circleFill = active ? "#fbbf24" : reached ? "#fff7ed" : "#ffffff";
  const circleText = active ? "#7c2d12" : "#0f172a";

  return (
    <Marker coordinates={[stop.lon, stop.lat]}>
      <g opacity={active ? 1 : reached ? 0.62 : 1}>
        <circle cx="0" cy="4" r="13" fill="rgba(15,23,42,0.18)" />
        <circle
          cx="0"
          cy="0"
          r="13"
          fill={circleFill}
          stroke="rgba(15,23,42,0.18)"
          strokeWidth="1.4"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill={circleText}
          fontSize="10.5"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {stage}
        </text>

        <g transform="translate(17,-20)">
          <rect
            x="0"
            y="0"
            width="30"
            height="20"
            rx="6"
            fill="rgba(255,255,255,0.98)"
            stroke="rgba(15,23,42,0.15)"
          />
          <image
            href={`/flags/${stop.flagCode}.svg`}
            x="2"
            y="2"
            width="26"
            height="16"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>

        {active ? (
          <text
            x="50"
            y="-8"
            fill="#ffffff"
            fontSize="19"
            fontFamily="Georgia, serif"
          >
            {stop.name}
          </text>
        ) : null}
      </g>
    </Marker>
  );
}

function StartMarker() {
  return (
    <Marker coordinates={[START.lon, START.lat]}>
      <g>
        <circle cx="0" cy="4" r="14" fill="rgba(15,23,42,0.18)" />
        <circle cx="0" cy="0" r="14" fill="#f472b6" stroke="rgba(15,23,42,0.18)" strokeWidth="1.5" />

        <foreignObject x="-10" y="-13" width="28" height="28">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: "26px",
              height: "26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              lineHeight: 1,
            }}
          >
            <span>🏠</span>
          </div>
        </foreignObject>
      </g>
    </Marker>
  );
}

function WorldMap({ routeMeta, visibleMiles, previewMiles, progressStartStage, baseMiles, isSimulating}) {
  const currentPosition = getPositionOnRoute(routeMeta, visibleMiles);
  const previewPosition = getPositionOnRoute(routeMeta, previewMiles);
const basePosition = getPositionOnRoute(routeMeta, baseMiles);
const currentAngle = currentPosition.segment
  ? Math.atan2(
      currentPosition.segment.to.lat - currentPosition.segment.from.lat,
      currentPosition.segment.to.lon - currentPosition.segment.from.lon
    ) *
    (180 / Math.PI)
  : 0;	
  const target = getCurrentTarget(routeMeta, visibleMiles);
  const completedStops = getCompletedStops(routeMeta, visibleMiles);
  const allSegments = routeMeta.segments;

const traversedSegments = allSegments.filter(
  (segment) => visibleMiles >= segment.endMiles
);

const activeTraversedSegment = currentPosition.segment || null;

  return (
    <div className="relative overflow-hidden rounded-[8px] border border-stone-500 bg-[#d7dde0] p-5 shadow-none sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.07),transparent_18%)]" />
      <div className="absolute left-5 top-5 z-20 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-white/90 backdrop-blur">
        Rubrica speciale · La mappa del viaggio
      </div>

      <div className="relative z-10 h-[72vh] min-h-[620px] w-full overflow-hidden rounded-[6px] bg-[#d7dde0]">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 215, center: [0, 12] }}
          width={1200}
          height={620}
          style={{ width: "100%", height: "100%" }}
        >
          <Sphere fill="#7fc0de" />
<Geographies geography={countriesGeo}>
  {({ geographies }) =>
    geographies.map((geo) => (
      <Geography
        key={geo.rsmKey}
        geography={geo}
        fill="#f4f1ea"
        stroke="#8da4af"
        strokeWidth={0.8}
        style={{
          default: { outline: "none" },
          hover: { outline: "none" },
          pressed: { outline: "none" },
        }}
      />
    ))
  }
          </Geographies>

          {allSegments.map((segment) => (
  <Line
    key={`line-${segment.index}`}
    from={[segment.from.lon, segment.from.lat]}
    to={[segment.to.lon, segment.to.lat]}
    stroke="#d9d2c2"
    strokeWidth={2.1}
    strokeLinecap="round"
    strokeDasharray="8 8"
    opacity={0.38}
  />
))}

{traversedSegments.map((segment) => (
  <Line
    key={`traversed-${segment.index}`}
    from={[segment.from.lon, segment.from.lat]}
    to={[segment.to.lon, segment.to.lat]}
    stroke="#8b5e3c"
    strokeWidth={4}
    strokeLinecap="round"
    opacity={0.96}
  />
))}

{activeTraversedSegment ? (
  <Line
    from={[activeTraversedSegment.from.lon, activeTraversedSegment.from.lat]}
    to={[currentPosition.lon, currentPosition.lat]}
    stroke="#8b5e3c"
    strokeWidth={4}
    strokeLinecap="round"
    opacity={0.96}
  />
) : null}

          {VISITED_PLACES.map((place) => (
            <VisitedFlagMarker key={place.name} coordinates={[place.lon, place.lat]} />
          ))}

          <StartMarker />

          {DESTINATION_CAPITALS.map((stop, index) => {
            const stage = index + 1;
            const active = stop.name === target?.name;
            const reached = stage <= completedStops;
            return <StageMarker key={stop.name} stop={stop} stage={stage} active={active} reached={reached} />;
          })}

          {previewMiles > visibleMiles ? (
  <Marker coordinates={[previewPosition.lon, previewPosition.lat]}>
    <g>
      <circle r="16" fill="rgba(17,24,39,0.08)" />
      <circle r="4.8" fill="#6b7280" />
    </g>
  </Marker>
) : null}
{isSimulating ? (
  <>
    <Line
      from={[basePosition.lon, basePosition.lat]}
      to={[currentPosition.lon, currentPosition.lat]}
      stroke="#111827"
      strokeWidth={7}
      strokeLinecap="round"
      opacity={0.9}
    />
    <Marker coordinates={[basePosition.lon, basePosition.lat]}>
      <g>
        <circle r="22" fill="rgba(17,24,39,0.12)" />
        <circle r="7" fill="#111827" />
      </g>
    </Marker>
  </>
) : null}
    <Marker coordinates={[currentPosition.lon, currentPosition.lat]}>
  <g>
    <circle
      r={isSimulating ? 28 : 18}
      fill={isSimulating ? "rgba(17,24,39,0.16)" : "rgba(17,24,39,0.10)"}
    />
    <g transform={`translate(-14,-14) rotate(${currentAngle},14,14)`}>
      <Plane size={28} color="#111827" strokeWidth={2.2} />
    </g>
  </g>
</Marker>
        </ComposableMap>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 hidden gap-3 lg:grid lg:grid-cols-4">
        <div className="rounded-[22px] border border-white/12 bg-slate-900/35 px-4 py-3 text-sm text-white/92 backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">Partenza</div>
          <div className="mt-1 font-medium">Cagliari</div>
        </div>
        <div className="rounded-[22px] border border-white/12 bg-slate-900/35 px-4 py-3 text-sm text-white/92 backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">Tratto attivo</div>
          <div className="mt-1 font-medium">Dalla tappa 16 Honolulu alla tappa 17 Ushuaia</div>
        </div>
        <div className="rounded-[22px] border border-white/12 bg-slate-900/35 px-4 py-3 text-sm text-white/92 backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">Bandierine verdi</div>
          <div className="mt-1 font-medium">Luoghi già visitati dagli sposi</div>
        </div>
        <div className="rounded-[22px] border border-white/12 bg-slate-900/35 px-4 py-3 text-sm text-white/92 backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">Cerchi + bandiera</div>
          <div className="mt-1 font-medium">Tappa numerata e nazione corrispondente</div>
        </div>
      </div>
    </div>
  );
}

export default function LandingViaggioNozze() {
  const query = useQueryParams();
  const routeMeta = useMemo(() => buildRouteMeta(ROUTE), []);
  const [donationAmount, setDonationAmount] = useState(150);
  const [animateGift, setAnimateGift] = useState(false);

  useEffect(() => {
    if (query.paid) {
      setDonationAmount(query.amount);
      setAnimateGift(true);
    }
  }, [query]);

const hiddenBaseMiles = routeMeta.segments[START_PROGRESS_STAGE_NUMBER - 1]?.endMiles || 0;

const actualTargetMiles = hiddenBaseMiles + donationAmount;
const visualTargetMiles = Math.min(
  routeMeta.totalMiles,
  hiddenBaseMiles + donationAmount * VISUAL_PREVIEW_MULTIPLIER
);

const [displayMiles, setDisplayMiles] = useState(hiddenBaseMiles);

useEffect(() => {
  if (!animateGift) {
    setDisplayMiles(hiddenBaseMiles);
    return;
  }

  const from = hiddenBaseMiles;
  const to = visualTargetMiles;
  const duration = 2200;
  let frameId;
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    setDisplayMiles(from + (to - from) * eased);

    if (t < 1) frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frameId);
}, [animateGift, hiddenBaseMiles, visualTargetMiles]);

const visibleMiles = displayMiles;
const previewMiles = visualTargetMiles;
const nextTarget = getCurrentTarget(routeMeta, hiddenBaseMiles);
const nextTargetAfterGift = getCurrentTarget(routeMeta, visualTargetMiles);

  return (
    <div className="min-h-screen bg-[#ebe5dc] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-[8px] border border-stone-400 bg-[#f7f3ed] p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 border-y border-stone-400 py-4 text-stone-800">
              <div className="font-serif text-[18px] sm:text-[22px]">The Wedding Post</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.35em]">Giornale di viaggio · Edizione straordinaria</div>
            </div>
            <div className="inline-flex items-center gap-2 border border-stone-400 bg-transparent px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-stone-700">
              <Heart className="h-4 w-4 text-stone-700" />
              Cronaca rosa · Edizione speciale
            </div>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Il nostro <span className="text-stone-900 italic">giornale di viaggio</span> parte dalle coste occidentali della Sardegna, riprende dalle Hawaii verso l'estremo sud del mondo nella Terra del Fuoco.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl font-serif text-lg leading-8 text-stone-700">
              Come in un piccolo giornale di viaggio, questa pagina raccoglie i luoghi già vissuti, le tappe che ci attendono e i gesti d'affetto che, miglio dopo miglio, accompagneranno il nostro cammino insieme.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <SoftStat label="Regola" value="1€ = 1 miglio" helper="Ogni dono diventa strada, e ogni strada un passo in più nel nostro viaggio insieme." />
            <SoftStat label="Prossima tappa" value={nextTarget?.name || "In viaggio"} helper="Da Honolulu a Ushuaia, il racconto riprende e ci accompagna verso la prossima pagina del nostro mondo." />
            <SoftStat label="Luoghi già visitati" value={String(VISITED_PLACES.length)} helper="Le bandierine custodiscono i ricordi già vissuti: luoghi, incontri e orizzonti che ci hanno portati fino a qui." />
          </div>
        </section>

        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(248,241,233,0.86))] py-8 shadow-[0_18px_70px_rgba(148,163,184,0.14)] sm:py-10">
          <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 px-1 lg:flex-row lg:items-end lg:justify-between">
              <div>
             <div className="inline-flex items-center gap-2 border border-stone-400 bg-transparent px-4 py-2">
  <Globe className="h-4 w-4 text-stone-700" />
  <span className="font-serif text-[12px] font-normal uppercase tracking-[0.28em] text-stone-700">
    The Wedding Post · La spedizione
  </span>
</div>
<h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl">
  La nostra spedizione
</h2>
                <p className="mt-2 max-w-4xl text-sm leading-7 text-stone-600 sm:text-base">
                   Il nostro racconto prende forma un miglio alla volta. L'aeroplano parte simbolicamente dalla Sardegna e continua il suo viaggio in giro per le meraviglie del mondo attraversando i fordi norvegesi, sorvolando il medio oriente, per poi andare alla scoperta dell'asia fino ad arrivare ad accarezzare i kangaroos australiani. Ora meritato relax alle Hawaii per poi raggiungere la porta d'accesso all'antardide: Ushuaia.
                </p>
              </div>
              <div className="lg:max-w-md border-2 border-stone-700 bg-[#f7f3ed] px-5 py-4 text-stone-800">
  <div className="border-b border-stone-400 pb-3">
    <div className="flex items-center gap-2 font-serif text-[11px] uppercase tracking-[0.28em] text-stone-600">
      <Stars className="h-4 w-4 text-stone-700" />
      Edizione straordinaria
    </div>

    <div className="mt-2 font-serif text-2xl uppercase tracking-[0.06em] text-slate-900">
      Ultima chiamata al gate
    </div>
  </div>

  <div className="mt-4 space-y-2 text-[15px] leading-7 text-stone-700">
    <p>
      <span className="font-semibold uppercase tracking-[0.08em] text-slate-900">
        Volo S&amp;V260626
      </span>{" "}
      diretto a{" "}
      <span className="font-semibold uppercase tracking-[0.08em] text-slate-900">
        Ushuaia
      </span>.
    </p>

    <p>Imbarco previsto al gate numero 1.</p>

    <p>
      Si pregano i passeggeri{" "}
      <span className="font-semibold text-slate-900">
        Nanni Veronica e Floris Simone
      </span>{" "}
      di recarsi immediatamente all'imbarco.
    </p>
  </div>
</div>
            </div>

            <div className="grid gap-6">
              <WorldMap
                routeMeta={routeMeta}
                visibleMiles={visibleMiles}
                previewMiles={previewMiles}
                progressStartStage={START_PROGRESS_STAGE_NUMBER}
		baseMiles={hiddenBaseMiles}
		isSimulating={animateGift}
              />
	</div>
	</div>
	</section>
<section className="grid gap-6">
  <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
    <SectionCard icon={Gift} title="Potrete farlo qui">
      <p>
        Ogni regalo aggiunge un tratto al nostro cammino. Il puntino avanza sul planisfero e il viaggio continua, come una storia che si scrive poco alla volta. Fai una simulazione di dove potremo arrivare con il tuo contributo!
      </p>

      <div className="mt-6 rounded-[28px] border border-stone-200 bg-stone-50/80 p-5">
        <div className="text-sm text-stone-500">Importo selezionato</div>
        <div className="mt-2 text-4xl font-semibold text-slate-900">{formatEuro(donationAmount)}</div>
        <div className="mt-2 text-sm text-emerald-700">
          {formatMiles(donationAmount)} miglia aggiunte dal tuo regalo
        </div>

        <input
          className="mt-6 w-full accent-slate-800"
          type="range"
          min="25"
          max="1000"
          step="25"
          value={donationAmount}
          onChange={(e) => {
            setDonationAmount(Number(e.target.value));
            setAnimateGift(false);
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {[50, 100, 150, 250, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setDonationAmount(amount);
                setAnimateGift(false);
              }}
             className={`rounded-full border px-4 py-2 text-sm transition ${
  donationAmount === amount
    ? "border-slate-800 bg-slate-800 text-white"
    : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
}`}
            >
              {formatEuro(amount)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => setAnimateGift(true)}
          className="rounded-full border border-slate-800 bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Anteprima del movimento
        </button>
        <button
          onClick={() => setAnimateGift(false)}
          className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Reset
        </button>
      </div>

      <AnimatePresence>
        {animateGift ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"
          >
<p>
            Con questo regalo il puntino avanza di <strong>{formatMiles(donationAmount)} miglia</strong>.
            {nextTargetAfterGift?.name !== nextTarget?.name ? (
              <span> Nuova tappa raggiunta: <strong>{nextTargetAfterGift?.name}</strong>.</span>
            ) : (
              <span> Ci avviciniamo ancora di più a <strong>{nextTarget?.name}</strong>.</span>
            )}
  </p>
\
<p className="mt-2 text-emerald-800">
  Guarda sopra, nel planisfero, come la rotta si allunga un miglio alla volta.
</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionCard>

    <SectionCard icon={Landmark} title="Miglio dopo miglio">
      <p>
        Per chi vorrà accompagnarci con un pensiero, qua potrete lasciare il vostro contributo al viaggio, con la semplicità di un gesto che si trasforma subito in strada, rotta e meraviglia condivisa.
      </p>

      <div className="grid gap-3">
        <div className="rounded-[22px] border border-stone-200 bg-stone-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-stone-500">Intestatario</div>
          <div className="mt-2 text-base font-medium text-slate-900">{ACCOUNT_HOLDER}</div>
        </div>

        <div className="rounded-[22px] border border-stone-200 bg-stone-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-stone-500">IBAN</div>
          <div className="mt-2 break-all text-base font-medium text-slate-900">{IBAN}</div>
        </div>

        <div className="rounded-[22px] border border-stone-200 bg-stone-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-stone-500">BIC / SWIFT</div>
          <div className="mt-2 text-base font-medium text-slate-900">{BIC}</div>
        </div>

        <div className="rounded-[22px] border border-stone-200 bg-stone-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-stone-500">Causale</div>
          <div className="mt-2 text-base font-medium text-slate-900">{PAYMENT_NOTE}</div>
        </div>
      </div>
    </SectionCard>
  </div>

<SectionCard
  icon={Compass}
  title="La testimonianza"
  className="bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(250,247,242,0.95))]"
>
  <div className="space-y-6">
    <p className="max-w-4xl">
      Questa pagina intreccia due storie: i luoghi già vissuti, diventati memoria, e le mete che ancora ci chiamano. Le bandierine raccontano il passato, le tappe numerate danno forma al desiderio, sempre vivo, di continuare a partire.
    </p>

    <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-stone-50">
      <img
        src="/foto-testimonianza.png"
        alt="Simone e Veronica in un momento romantico del matrimonio"
        className="h-[520px] w-full object-cover object-center"
      />
    </div>
  </div>
</SectionCard>
</section>
      </div>
    </div>
  );
}