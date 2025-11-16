import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaDirections, FaPhone } from 'react-icons/fa';
import { facilities } from '../data/facilities';
import { calculateDistance } from '../utils/distance';

// Map container styles
const mapContainerStyle = {
  width: '100%',
  minHeight: '400px',
  height: '400px',
};

// Default center (Nashville)
const defaultCenter = {
  lat: 36.1627,
  lng: -86.7816,
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
};

// Marker colors by facility type
const markerColors = {
  clinic: 'green',
  urgent_care: 'yellow',
  hospital: 'red',
};

// Simple location lookup for common cities
const cityCoordinates = {
  'nashville': { lat: 36.1627, lng: -86.7816 },
  'nashville, tn': { lat: 36.1627, lng: -86.7816 },
  'downtown nashville': { lat: 36.1627, lng: -86.7816 },
  'east nashville': { lat: 36.1833, lng: -86.7500 },
  'west nashville': { lat: 36.1500, lng: -86.8500 },
  'brentwood': { lat: 36.0331, lng: -86.7828 },
  'franklin': { lat: 35.9251, lng: -86.8689 },
  'murfreesboro': { lat: 35.8456, lng: -86.3903 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'sf': { lat: 37.7749, lng: -122.4194 },
  'oakland': { lat: 37.8044, lng: -122.2712 },
  'berkeley': { lat: 37.8716, lng: -122.2727 },
  'san jose': { lat: 37.3382, lng: -121.8863 },
  'palo alto': { lat: 37.4419, lng: -122.1430 },
  'daly city': { lat: 37.6879, lng: -122.4702 },
};

function MapPanel({ location, analysisResult, selectedFacility, onFacilitySelect }) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(defaultCenter);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Geocode location when it changes
  useEffect(() => {
    if (location) {
      const geocodeLocation = async () => {
        // First try simple lookup
        const normalizedLocation = location.toLowerCase().trim();
        if (cityCoordinates[normalizedLocation]) {
          const coords = cityCoordinates[normalizedLocation];
          setMapCenter(coords);
          setUserCoordinates(coords);
          return;
        }

        // Try to use Google Geocoding API if available
        if (isLoaded && window.google && window.google.maps) {
          try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: location }, (results, status) => {
              if (status === 'OK' && results[0]) {
                const coords = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                };
                setMapCenter(coords);
                setUserCoordinates(coords);
              }
            });
          } catch (err) {
            console.error('Geocoding error:', err);
          }
        }
      };

      geocodeLocation();
    }
  }, [location, isLoaded]);

  // Filter facilities based on AI recommendation
  const filteredFacilities = useMemo(() => {
    if (!analysisResult) {
      return facilities;
    }

    const { recommended_care_type, suggested_search_queries, urgency_level } = analysisResult;

    // Map urgency levels to facility types
    const urgencyToType = {
      self_care: ['clinic'],
      clinic: ['clinic', 'urgent_care'],
      urgent_care: ['urgent_care', 'hospital'],
      er: ['hospital'],
    };

    const relevantTypes = urgencyToType[urgency_level] || [];

    // Filter by relevant types
    let filtered = facilities.filter((facility) => relevantTypes.includes(facility.type));

    // If no matches, show all facilities
    if (filtered.length === 0) {
      filtered = facilities;
    }

    return filtered;
  }, [analysisResult]);

  // Sort facilities by distance
  const sortedFacilities = useMemo(() => {
    return [...filteredFacilities]
      .map((facility) => ({
        ...facility,
        distance: calculateDistance(
          userCoordinates.lat,
          userCoordinates.lng,
          facility.lat,
          facility.lng
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [filteredFacilities, userCoordinates]);

  // Get marker icon URL based on facility type
  const getMarkerIcon = useCallback((type) => {
    const color = markerColors[type] || 'red';
    const colorMap = {
      green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      yellow: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      red: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    };
    return colorMap[color];
  }, []);

  // Generate Google Maps navigation link
  const getNavigationLink = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  // Format facility type for display
  const formatFacilityType = (type) => {
    const typeMap = {
      clinic: 'Clinic',
      urgent_care: 'Urgent Care',
      hospital: 'Hospital',
    };
    return typeMap[type] || type;
  };

  // Get badge color class by type
  const getTypeBadgeClass = (type) => {
    const classMap = {
      clinic: 'bg-green-100 text-green-800',
      urgent_care: 'bg-yellow-100 text-yellow-800',
      hospital: 'bg-red-100 text-red-800',
    };
    return classMap[type] || 'bg-gray-100 text-gray-800';
  };

  // Handle marker click
  const handleMarkerClick = (facility) => {
    setSelectedMarker(facility);
    onFacilitySelect(facility);
  };

  // Handle map click (close info window)
  const handleMapClick = () => {
    setSelectedMarker(null);
  };

  // Render loading state
  if (loadError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-6">
        <h2 className="text-xl font-semibold mb-4">Nearby Facilities</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading Google Maps. Please check your API key.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-6">
        <h2 className="text-xl font-semibold mb-4">Nearby Facilities</h2>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-6">
      <h2 className="text-xl font-semibold mb-4">Nearby Facilities</h2>

      {/* Google Map Container */}
      <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={13}
          options={mapOptions}
          onClick={handleMapClick}
        >
          {/* Facility Markers */}
          {sortedFacilities.map((facility) => (
            <Marker
              key={facility.id}
              position={{ lat: facility.lat, lng: facility.lng }}
              icon={getMarkerIcon(facility.type)}
              onClick={() => handleMarkerClick(facility)}
            />
          ))}

          {/* InfoWindow for selected marker */}
          {selectedMarker && (
            <InfoWindow
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedMarker.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedMarker.address}</p>
                <a
                  href={getNavigationLink(selectedMarker.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Get Directions
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Clinic</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Urgent Care</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Hospital</span>
        </div>
      </div>

      {/* Facility List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedFacilities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No facilities found</p>
        ) : (
          sortedFacilities.map((facility) => (
            <div
              key={facility.id}
              onClick={() => handleMarkerClick(facility)}
              className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedMarker?.id === facility.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{facility.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeClass(facility.type)}`}>
                  {formatFacilityType(facility.type)}
                </span>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gray-400" />
                <span>{facility.address}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaPhone className="text-gray-400" />
                  <span>{facility.phone}</span>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {facility.distance} mi
                </span>
              </div>

              <a
                href={getNavigationLink(facility.address)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
              >
                <FaDirections />
                <span>Get Directions</span>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MapPanel;
