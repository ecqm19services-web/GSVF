import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  description,
  align = 'center',
  light = false
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto'
  };

  return (
    <div className={`max-w-3xl mb-12 ${alignClasses[align]}`}>
      {subtitle && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${
          light 
            ? 'bg-white/10 text-orange-200' 
            : 'bg-orange-100 text-orange-800'
        }`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
        light ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg ${
          light ? 'text-orange-100' : 'text-gray-600'
        }`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
