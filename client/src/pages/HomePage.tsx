import React, { useState, useEffect } from 'react';
import { Shield, Mic, Phone, Users, Heart, AlertTriangle } from 'lucide-react';
import EmergencyButton from '../components/EmergencyButton';
import FirstAidGuide from '../components/FirstAidGuide';
import EmergencyCard from '../components/EmergencyCard';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { classifyEmergency, getFirstAidInstructions, generateEmergencyCard, parseInstructionsToSteps, getCurrentLocation } from '../utils/emergencyUtils';
import { EmergencyCard as EmergencyCardType, FirstAidStep } from '../types/emergency';
import { createIncident, saveEmergencyCard } from '../services/api';

const HomePage: React.FC = () => {
  const [emergencyType, setEmergencyType] = useState<string | null>(null);
  const [emergencyCard, setEmergencyCard] = useState<EmergencyCardType | null>(null);
  const [firstAidSteps, setFirstAidSteps] = useState<FirstAidStep[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { speak } = useTextToSpeech();

  useEffect(() => {
    if (transcript) {
      setTextInput(transcript);
      handleEmergency(transcript);
    }
  }, [transcript]);

  const handleEmergency = async (input: string) => {
    const detectedType = classifyEmergency(input);
    
    if (detectedType === 'unknown') {
      speak("I couldn't identify the emergency type. Please call emergency services immediately.");
      return;
    }

    setEmergencyType(detectedType);
    setIsEmergencyActive(true);

    const instructions = getFirstAidInstructions(detectedType);
    const steps = parseInstructionsToSteps(instructions);
    setFirstAidSteps(steps);

    // Try to get GPS coordinates
    let gpsCoordinates: string | undefined;
    try {
      const pos = await getCurrentLocation();
      gpsCoordinates = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
    } catch {
      gpsCoordinates = undefined;
    }

    const card = generateEmergencyCard(detectedType, input);
    setEmergencyCard(card);

    // Persist to MySQL via API (non-blocking)
    createIncident({
      emergency_type: detectedType,
      description: input,
      gps_coordinates: gpsCoordinates,
      location: gpsCoordinates ? `GPS: ${gpsCoordinates}` : 'Location unavailable',
      source: 'web',
    })
      .then(incident => {
        // Also save the emergency card linked to this incident
        saveEmergencyCard({
          emergency_type: detectedType,
          gps_coordinates: gpsCoordinates || card.gpsCoordinates,
          description: input,
          contact_info: card.contactInfo,
          timestamp: card.timestamp,
          source: 'web',
          incident_id: incident.id,
        });
      })
      .catch(err => console.warn('API unavailable, running in offline mode:', err.message));

    speak(`Emergency detected: ${detectedType.replace('_', ' ')}. Stay calm, I will guide you through the necessary steps.`);
  };

  const handleStepComplete = (stepId: number) => {
    setFirstAidSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, isCompleted: true } : step
      )
    );
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setTextInput('');
      speak("Please describe your emergency after the beep.");
      setTimeout(() => {
        startListening();
      }, 2000);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleEmergency(textInput.trim());
    }
  };

  const resetEmergency = () => {
    setEmergencyType(null);
    setEmergencyCard(null);
    setFirstAidSteps([]);
    setTextInput('');
    setIsEmergencyActive(false);
    resetTranscript();
  };

  const callEmergencyServices = () => {
    speak("Calling emergency services now.");
    // In a real app, this would trigger an actual call
    window.open('tel:911', '_self');
  };

  if (isEmergencyActive && emergencyType) {
    return (
      <div className="min-h-screen bg-red-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                <h1 className="text-2xl font-bold text-red-900">Emergency Active</h1>
              </div>
              <div className="flex gap-2">
                <EmergencyButton variant="call" onClick={callEmergencyServices} size="sm">
                  Call 911
                </EmergencyButton>
                <button
                  onClick={resetEmergency}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <FirstAidGuide
                steps={firstAidSteps}
                onStepComplete={handleStepComplete}
                emergencyType={emergencyType}
              />
            </div>
            <div>
              {emergencyCard && <EmergencyCard card={emergencyCard} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Guardian Angel</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal emergency assistant providing real-time guidance, emotional support, and instant help coordination.
          </p>
        </div>

        {/* Emergency Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Emergency Response Center
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <EmergencyButton
              variant="primary"
              onClick={() => handleEmergency('general emergency')}
              size="lg"
            >
              Emergency!
            </EmergencyButton>

            {browserSupportsSpeechRecognition && (
              <EmergencyButton
                variant="voice"
                onClick={handleVoiceInput}
                isActive={isListening}
                size="lg"
              >
                {isListening ? 'Listening...' : 'Voice Help'}
              </EmergencyButton>
            )}

            <EmergencyButton
              variant="call"
              onClick={callEmergencyServices}
              size="lg"
            >
              Call 911
            </EmergencyButton>
          </div>

          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div>
              <label htmlFor="emergency-input" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your emergency situation:
              </label>
              <div className="flex gap-3">
                <input
                  id="emergency-input"
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g., 'Someone collapsed', 'Fire in building', 'Person choking'..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
                >
                  Get Help
                </button>
              </div>
            </div>
          </form>

          {isListening && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-blue-800 font-medium">Listening for your emergency description...</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Emergency Types */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Emergency Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'fire', label: 'Fire', icon: '🔥' },
              { type: 'heart attack', label: 'Heart Attack', icon: '❤️' },
              { type: 'choking', label: 'Choking', icon: '🫁' },
              { type: 'bleeding', label: 'Bleeding', icon: '🩸' },
              { type: 'earthquake', label: 'Earthquake', icon: '🏠' },
              { type: 'collapse', label: 'Collapsed', icon: '🆘' },
              { type: 'drowning', label: 'Drowning', icon: '🌊' },
              { type: 'poisoning', label: 'Poisoning', icon: '☠️' }
            ].map((emergency) => (
              <button
                key={emergency.type}
                onClick={() => handleEmergency(emergency.type)}
                className="p-4 text-center border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-lg transition-all group"
              >
                <div className="text-2xl mb-1">{emergency.icon}</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-red-700">
                  {emergency.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Guidance</h3>
            <p className="text-gray-600">Step-by-step instructions for emergency situations with voice guidance and visual cues.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Community Support</h3>
            <p className="text-gray-600">Connect with nearby volunteers and emergency responders when professional help is needed.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Emergency Cards</h3>
            <p className="text-gray-600">Automatically generated emergency information cards with GPS location and contact details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;