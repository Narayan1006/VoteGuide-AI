// src/components/BoothLocator/BoothLocator.jsx
import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MOCK_BOOTHS, getNearbyBooths, searchBoothsByCity } from '@data/boothData';
import toast from 'react-hot-toast';

const MAP_CONTAINER_STYLE = { width: '100%', height: '450px' };
const DEFAULT_CENTER      = { lat: 20.5937, lng: 78.9629 }; // Center of India

const MAP_OPTIONS = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#1a2744' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0F1B2D' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8899aa' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1e35' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3f6e' }] },
  ],
  disableDefaultUI: false,
  mapTypeControl: false,
  fullscreenControl: true,
  streetViewControl: false,
  zoomControl: true,
};

export default function BoothLocator({ language = 'en' }) {
  const [center,         setCenter]         = useState(DEFAULT_CENTER);
  const [zoom,           setZoom]           = useState(5);
  const [booths,         setBooths]         = useState(MOCK_BOOTHS.slice(0, 8));
  const [selectedBooth,  setSelectedBooth]  = useState(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [locating,       setLocating]       = useState(false);
  const [mapLoaded,      setMapLoaded]      = useState(false);
  const [mapError,       setMapError]       = useState(false);
  const searchRef                           = useRef(null);

  const apiKey = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = searchBoothsByCity(searchQuery);
    if (results.length > 0) {
      setBooths(results);
      setCenter({ lat: results[0].lat, lng: results[0].lng });
      setZoom(12);
      setSelectedBooth(null);
      toast.success(`Found ${results.length} booth${results.length > 1 ? 's' : ''} near "${searchQuery}"`);
    } else {
      toast.error(`No booths found for "${searchQuery}". Try: Delhi, Mumbai, Bangalore`);
    }
  }, [searchQuery]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error(language === 'hi' ? 'यह ब्राउज़र जियोलोकेशन का समर्थन नहीं करता।' : 'Geolocation is not supported by this browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const nearby = getNearbyBooths(lat, lng, 50);
        setCenter({ lat, lng });
        setZoom(13);
        setBooths(nearby.length > 0 ? nearby : MOCK_BOOTHS.slice(0, 5));
        setLocating(false);
        toast.success(nearby.length > 0
          ? `Found ${nearby.length} nearby booth${nearby.length > 1 ? 's' : ''}`
          : 'Showing nearest booths in our database'
        );
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error(language === 'hi'
            ? 'जियोलोकेशन की अनुमति अस्वीकार की गई।'
            : 'Location permission denied. Please allow location access.');
        } else {
          toast.error('Could not get your location. Please search by city name.');
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [language]);

  const t = (en, hi) => language === 'hi' ? hi : en;

  const hasApiKey = apiKey && apiKey !== 'your_google_maps_api_key_here';

  return (
    <section aria-labelledby="booth-locator-heading" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="booth-locator-heading" className="section-title">
            📍 {t('Find Your Polling Booth', 'अपना मतदान केंद्र खोजें')}
          </h2>
          <p className="section-subtitle">
            {t('Search by city or use your location to find nearby polling booths', 'शहर खोजें या अपनी लोकेशन से नज़दीकी मतदान केंद्र ढूंढें')}
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex gap-3 mb-6 max-w-2xl mx-auto"
          role="search"
          aria-label={t('Search polling booths', 'मतदान केंद्र खोजें')}
        >
          <label htmlFor="booth-search" className="sr-only">
            {t('Search by city name', 'शहर का नाम दर्ज करें')}
          </label>
          <input
            id="booth-search"
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('Search city (Delhi, Mumbai, Bangalore...)', 'शहर खोजें (दिल्ली, मुंबई...)')}
            className="input-field flex-1"
            aria-label={t('City name for booth search', 'बूथ खोज के लिए शहर का नाम')}
          />
          <button type="submit" className="btn-primary" aria-label={t('Search booths', 'बूथ खोजें')}>
            🔍 {t('Search', 'खोजें')}
          </button>
        </form>

        {/* Geolocation button */}
        <div className="text-center mb-6">
          <button
            onClick={handleGeolocate}
            disabled={locating}
            className="btn-secondary"
            aria-label={t('Use my current location to find nearby booths', 'मेरी वर्तमान लोकेशन से नज़दीकी बूथ खोजें')}
            aria-busy={locating}
          >
            {locating
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" aria-hidden="true" />
              : <span aria-hidden="true">📍</span>
            }
            {locating ? t('Locating...', 'लोकेशन ढूंढ रहे हैं...') : t('Use My Location', 'मेरी लोकेशन उपयोग करें')}
          </button>
          <p className="text-navy-400 text-xs mt-2">
            {t('Shows mock data for 10 Indian cities', 'दस भारतीय शहरों के लिए डेटा दिखाता है (डेमो)')}
          </p>
        </div>

        {/* Map */}
        <div className="card overflow-hidden mb-6 map-container" data-testid="map-container">
          {!hasApiKey ? (
            /* Map placeholder when no API key */
            <div className="w-full h-[450px] bg-navy-800 flex flex-col items-center justify-center text-center p-8">
              <div className="text-5xl mb-4" aria-hidden="true">🗺️</div>
              <h3 className="text-white font-bold text-lg mb-2">
                {t('Map requires Google Maps API Key', 'मानचित्र के लिए Google Maps API Key आवश्यक है')}
              </h3>
              <p className="text-navy-300 text-sm mb-4">
                {t(
                  'Add VITE_GOOGLE_MAPS_API_KEY to your .env file to enable the interactive map.',
                  '.env फ़ाइल में VITE_GOOGLE_MAPS_API_KEY जोड़ें।'
                )}
              </p>
              <div className="bg-navy-900 rounded-xl p-4 text-left text-xs text-emerald-400 font-mono max-w-sm w-full">
                VITE_GOOGLE_MAPS_API_KEY=your_key_here
              </div>
            </div>
          ) : (
            <LoadScript
              googleMapsApiKey={apiKey}
              onLoad={() => setMapLoaded(true)}
              onError={() => setMapError(true)}
            >
              {mapError ? (
                <div className="w-full h-[450px] bg-navy-800 flex items-center justify-center">
                  <p className="text-red-400">Failed to load Google Maps. Check your API key.</p>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={center}
                  zoom={zoom}
                  options={MAP_OPTIONS}
                  aria-label={t('Interactive map showing polling booths', 'मतदान केंद्र दिखाने वाला इंटरेक्टिव नक्शा')}
                >
                  {booths.map(booth => (
                    <Marker
                      key={booth.id}
                      position={{ lat: booth.lat, lng: booth.lng }}
                      onClick={() => setSelectedBooth(booth)}
                      title={booth.name}
                      icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                        scaledSize: mapLoaded ? new window.google.maps.Size(40, 40) : undefined,
                      }}
                    />
                  ))}
                  {selectedBooth && (
                    <InfoWindow
                      position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
                      onCloseClick={() => setSelectedBooth(null)}
                    >
                      <div className="p-2 max-w-[220px]">
                        <h3 className="font-bold text-navy-900 text-sm mb-1">{selectedBooth.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">📍 {selectedBooth.address}</p>
                        <p className="text-xs text-gray-600">🗳️ Booth: {selectedBooth.boothNumber}</p>
                        <p className="text-xs text-gray-600">👥 Voters: {selectedBooth.totalVoters.toLocaleString()}</p>
                        <p className="text-xs font-semibold text-orange-600 mt-1">{selectedBooth.constituency}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              )}
            </LoadScript>
          )}
        </div>

        {/* Booth list */}
        <div aria-label={t('Polling booth list', 'मतदान केंद्रों की सूची')}>
          <h3 className="text-white font-semibold mb-4">
            {t(`${booths.length} Polling Booths`, `${booths.length} मतदान केंद्र`)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {booths.map(booth => (
              <button
                key={booth.id}
                onClick={() => {
                  setSelectedBooth(booth);
                  setCenter({ lat: booth.lat, lng: booth.lng });
                  setZoom(15);
                }}
                className={`card p-4 text-left hover:border-saffron-500/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
                  selectedBooth?.id === booth.id ? 'border-saffron-500 bg-saffron-500/10' : 'border-white/10'
                }`}
                aria-label={`${booth.name}, ${booth.address}, Booth number ${booth.boothNumber}`}
                aria-pressed={selectedBooth?.id === booth.id}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">📍</span>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{booth.name}</h4>
                    <p className="text-saffron-400 text-xs font-medium">{booth.constituency}</p>
                    <p className="text-navy-400 text-xs mt-1">{booth.address}</p>
                    <div className="flex gap-3 mt-2 text-xs text-navy-500">
                      <span>🏷️ {booth.boothNumber}</span>
                      <span>👥 {booth.totalVoters.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
