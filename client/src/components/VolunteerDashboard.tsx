import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, CheckCircle, AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { getVolunteerRequests, updateVolunteerStatus, VolunteerRequest } from '../services/api';

const VolunteerDashboard: React.FC = () => {
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVolunteerRequests();
      setRequests(data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setError('Could not connect to database. Check that the API server is running on port 3001.');
      console.error('Failed to fetch volunteer requests:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Auto-refresh every 30 seconds for near-real-time updates
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const acceptRequest = async (id: number) => {
    try {
      const updated = await updateVolunteerStatus(id, 'accepted');
      setRequests(prev => prev.map(req => req.id === id ? updated : req));
    } catch (err: any) {
      console.error('Failed to update request:', err.message);
    }
  };

  const resolveRequest = async (id: number) => {
    try {
      const updated = await updateVolunteerStatus(id, 'resolved');
      setRequests(prev => prev.map(req => req.id === id ? updated : req));
    } catch (err: any) {
      console.error('Failed to resolve request:', err.message);
    }
  };

  const getStatusColor = (status: VolunteerRequest['status']) => {
    switch (status) {
      case 'active':   return 'text-red-600 bg-red-100';
      case 'accepted': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
    }
  };

  const getEmergencyTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fire: 'bg-red-500',
      heart_attack: 'bg-purple-500',
      cpr: 'bg-blue-500',
      choking: 'bg-orange-500',
      bleeding: 'bg-red-400',
      earthquake: 'bg-amber-500',
      drowning: 'bg-cyan-500',
      stroke: 'bg-pink-500',
      poisoning: 'bg-green-600',
      electric_shock: 'bg-yellow-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Volunteer Rescue Dashboard</h1>
            <p className="text-gray-600 text-sm">
              Live data from MySQL · Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-orange-800">Database Offline</p>
            <p className="text-sm text-orange-700 mt-1">{error}</p>
            <p className="text-xs text-orange-600 mt-1">Run: <code className="bg-orange-100 px-1 rounded">node server-api/index.js</code></p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <RefreshCw className="w-10 h-10 text-blue-400 mx-auto mb-3 animate-spin" />
          <p className="text-gray-600">Loading requests from MySQL...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && requests.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Emergencies</h3>
          <p className="text-gray-600">No emergency requests in the database at the moment.</p>
        </div>
      )}

      {/* Request Cards */}
      {!loading && requests.length > 0 && (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getEmergencyTypeColor(request.emergency_type)}`} />
                  <h3 className="text-lg font-bold text-gray-900 capitalize">
                    {request.emergency_type.replace(/_/g, ' ')} Emergency
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {request.distance && (
                    <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {request.distance} km away
                    </div>
                  )}
                  <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    #{request.id}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{request.location}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(request.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-600">{formatTimestamp(request.created_at)}</p>
                </div>

                {request.description && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <p className="text-gray-700">{request.description}</p>
                  </div>
                )}
              </div>

              {request.status === 'active' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => acceptRequest(request.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Accept & Respond
                  </button>
                  <button
                    onClick={() => resolveRequest(request.id)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}

              {request.status === 'accepted' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
                  <p className="text-yellow-800 text-sm font-medium">
                    You have accepted this request. Please proceed to the location safely.
                  </p>
                  <button
                    onClick={() => resolveRequest(request.id)}
                    className="ml-4 text-sm px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shrink-0"
                  >
                    Resolved
                  </button>
                </div>
              )}

              {request.status === 'resolved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> This emergency has been resolved.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Volunteer Guidelines */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Volunteer Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Only respond to emergencies within your skill level</li>
          <li>• Always prioritize your own safety</li>
          <li>• Professional emergency services should be contacted for all situations</li>
          <li>• Provide assistance only as a supplement to professional help</li>
        </ul>
      </div>
    </div>
  );
};

export default VolunteerDashboard;