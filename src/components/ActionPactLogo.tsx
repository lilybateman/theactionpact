import React from 'react';

interface ActionPactLogoProps {
  language?: 'en' | 'fr';
}

const ActionPactLogo: React.FC<ActionPactLogoProps> = ({ language = 'en' }) => {
  const logoSrc = language === 'fr' 
    ? '/images/newestfrenchlogo.png' 
    : '/images/logo.png';
  
  const sizeClass = language === 'fr' 
    ? 'h-[11.75rem] md:h-[19.375rem]' 
    : 'h-48 md:h-80';
  
  return (
    <div className={`flex items-start -ml-2 md:-ml-4 ${language === 'fr' ? 'pb-[7px] md:pb-[11px]' : ''}`}>
      <img
        src={logoSrc}
        alt={language === 'fr' ? "Le Pacte d'Action Logo" : "The Action Pact Logo"}
        className={`${sizeClass} w-auto object-contain object-top`}
      />
    </div>
  );
};

export default ActionPactLogo;
