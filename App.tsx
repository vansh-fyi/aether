import React from 'react';
import { useDesignSystemStore } from './store/useDesignSystemStore';
import { InputStateComponent } from './components/features/InputStateComponent';
import { GeneratorStateComponent } from './components/features/GeneratorStateComponent';
import { CompletionStateComponent } from './components/features/CompletionStateComponent';

export default function App() {
  const { currentStep } = useDesignSystemStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'input':
        return <InputStateComponent />;
      case 'generator':
        return <GeneratorStateComponent />;
      case 'completion':
        return <CompletionStateComponent />;
      default:
        return <InputStateComponent />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container-enhanced section-enhanced">
        {renderCurrentStep()}
      </div>
    </div>
  );
}