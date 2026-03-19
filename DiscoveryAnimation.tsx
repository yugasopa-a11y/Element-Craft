import type { Element } from '../lib/storage';

interface ElementCardProps {
  element: Element;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  isSelected?: boolean;
  isDragging?: boolean;
  isNew?: boolean;
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  uncommon: 'from-green-500 to-green-600',
  rare: 'from-blue-500 to-blue-600',
  legendary: 'from-purple-500 to-pink-500'
};

const categoryColors = {
  nature: 'bg-green-100 text-green-800',
  technology: 'bg-blue-100 text-blue-800',
  society: 'bg-yellow-100 text-yellow-800',
  abstract: 'bg-purple-100 text-purple-800',
  fantasy: 'bg-pink-100 text-pink-800',
  art: 'bg-orange-100 text-orange-800'
};

export function ElementCard({ 
  element, 
  onClick, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  isSelected, 
  isDragging,
  isNew 
}: ElementCardProps) {
  const scale = isSelected ? 'scale-105' : isDragging ? 'scale-110' : '';
  const opacity = isDragging ? 'opacity-50' : '';
  
  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className={`
        relative p-4 rounded-xl cursor-pointer
        bg-gradient-to-br ${rarityColors[element.rarity as keyof typeof rarityColors] || rarityColors.common}
        text-white shadow-lg
        hover:shadow-xl transition-shadow duration-200
        ${scale} ${opacity}
        ${isSelected ? 'ring-4 ring-white ring-opacity-50' : ''}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${isNew ? 'animate-bounce-in' : ''}
      `}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          ✨
        </div>
      )}
      
      <div className="text-4xl mb-2">{element.emoji}</div>
      <div className="font-bold text-sm truncate">{element.name}</div>
      <div className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${categoryColors[element.category as keyof typeof categoryColors] || categoryColors.nature}`}>
        {element.category}
      </div>
    </div>
  );
}
