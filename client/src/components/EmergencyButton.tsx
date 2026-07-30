import React from 'react';
import { AlertTriangle, Phone, Mic } from 'lucide-react';

interface EmergencyButtonProps {
  variant: 'primary' | 'call' | 'voice';
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  variant,
  onClick,
  disabled = false,
  children,
  size = 'md',
  isActive = false
}) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg active:scale-95";
  
  const variantClasses = {
    primary: `bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 ${isActive ? 'ring-4 ring-red-300' : ''}`,
    call: "bg-green-600 hover:bg-green-700 text-white border-2 border-green-700",
    voice: `bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-700 ${isActive ? 'ring-4 ring-blue-300 bg-blue-700' : ''}`
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm min-h-[48px]",
    md: "px-6 py-4 text-base min-h-[56px]",
    lg: "px-8 py-6 text-lg min-h-[72px]"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  const getIcon = () => {
    switch (variant) {
      case 'primary':
        return <AlertTriangle className="w-6 h-6" />;
      case 'call':
        return <Phone className="w-6 h-6" />;
      case 'voice':
        return <Mic className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`}
    >
      {getIcon()}
      {children}
    </button>
  );
};

export default EmergencyButton;