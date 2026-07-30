import React from 'react';
import { MapPin, Clock, Share2, Copy } from 'lucide-react';
import { EmergencyCard as EmergencyCardType } from '../types/emergency';

interface EmergencyCardProps {
  card: EmergencyCardType;
  onShare?: () => void;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ card, onShare }) => {
  const copyToClipboard = () => {
    const cardText = `EMERGENCY ALERT
Type: ${card.emergencyType.replace('_', ' ').toUpperCase()}
Location: ${card.gpsCoordinates}
Time: ${card.timestamp}
${card.description ? `Details: ${card.description}` : ''}
${card.contactInfo || ''}

This is an automated emergency notification.`;

    navigator.clipboard.writeText(cardText);
  };

  const shareCard = () => {
    const cardText = `EMERGENCY ALERT - ${card.emergencyType.replace('_', ' ').toUpperCase()} at ${card.gpsCoordinates}. Time: ${card.timestamp}. ${card.description || ''} Please send help!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Alert',
        text: cardText
      });
    } else {
      onShare?.();
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-xl p-6 border border-red-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Emergency Card</h3>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 bg-red-800 hover:bg-red-900 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={shareCard}
            className="p-2 bg-red-800 hover:bg-red-900 rounded-lg transition-colors"
            title="Share emergency card"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-red-800 bg-opacity-50 rounded-lg p-3">
          <h4 className="font-semibold text-red-100 mb-1">Emergency Type</h4>
          <p className="text-lg font-bold capitalize">
            {card.emergencyType.replace('_', ' ')}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 mt-0.5 text-red-200" />
          <div>
            <h4 className="font-semibold text-red-100">Location</h4>
            <p className="text-sm font-mono">{card.gpsCoordinates}</p>
            <a
              href={`https://maps.google.com/?q=${card.gpsCoordinates}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-200 hover:text-white text-sm underline"
            >
              View on Map
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 mt-0.5 text-red-200" />
          <div>
            <h4 className="font-semibold text-red-100">Timestamp</h4>
            <p className="text-sm">{card.timestamp}</p>
          </div>
        </div>

        {card.description && (
          <div className="bg-red-800 bg-opacity-50 rounded-lg p-3">
            <h4 className="font-semibold text-red-100 mb-1">Details</h4>
            <p className="text-sm">{card.description}</p>
          </div>
        )}

        {card.contactInfo && (
          <div className="bg-red-800 bg-opacity-50 rounded-lg p-3">
            <h4 className="font-semibold text-red-100 mb-1">Contact</h4>
            <p className="text-sm">{card.contactInfo}</p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-red-900 bg-opacity-50 rounded-lg">
        <p className="text-xs text-red-200 text-center">
          This emergency card has been automatically generated and can be shared with emergency services or contacts.
        </p>
      </div>
    </div>
  );
};

export default EmergencyCard;