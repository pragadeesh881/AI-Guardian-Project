import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Volume2, VolumeX } from 'lucide-react';
import { FirstAidStep } from '../types/emergency';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface FirstAidGuideProps {
  steps: FirstAidStep[];
  onStepComplete: (stepId: number) => void;
  emergencyType: string;
}

const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ 
  steps, 
  onStepComplete, 
  emergencyType 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const { speak, cancel } = useTextToSpeech();

  useEffect(() => {
    if (isAudioEnabled && steps.length > 0) {
      const stepText = `Step ${currentStep + 1}: ${steps[currentStep]?.instruction}`;
      speak(stepText, { rate: 0.8 });
    }
  }, [currentStep, isAudioEnabled, steps, speak]);

  const handleStepComplete = (stepId: number) => {
    onStepComplete(stepId);
    if (stepId === steps[currentStep]?.id && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const toggleAudio = () => {
    if (isAudioEnabled) {
      cancel();
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  const getStepStatus = (step: FirstAidStep, index: number) => {
    if (step.isCompleted) return 'completed';
    if (index === currentStep) return 'current';
    if (index < currentStep) return 'missed';
    return 'pending';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 capitalize">
          {emergencyType.replace('_', ' ')} Instructions
        </h2>
        <button
          onClick={toggleAudio}
          className={`p-2 rounded-full transition-colors ${
            isAudioEnabled 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          
          return (
            <div
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                status === 'current' 
                  ? 'border-red-400 bg-red-50 shadow-md' 
                  : status === 'completed'
                  ? 'border-green-400 bg-green-50'
                  : status === 'missed'
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleStepComplete(step.id)}
                  className={`mt-1 transition-colors ${
                    step.isCompleted 
                      ? 'text-green-600 hover:text-green-700' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {step.isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium ${
                      status === 'current' ? 'text-red-700' : 'text-gray-600'
                    }`}>
                      Step {index + 1}
                    </span>
                    {step.isImportant && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                        Critical
                      </span>
                    )}
                    {status === 'current' && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium animate-pulse">
                        Current
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    status === 'current' 
                      ? 'text-red-800 font-medium' 
                      : step.isCompleted 
                      ? 'text-green-800' 
                      : 'text-gray-700'
                  }`}>
                    {step.instruction}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Remember:</strong> If at any time the situation worsens, immediately call emergency services.
        </p>
      </div>
    </div>
  );
};

export default FirstAidGuide;