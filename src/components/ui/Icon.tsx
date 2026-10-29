import React from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';

type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
type IconSize = 16 | 20 | 24 | 32 | 48;

interface IconProps {
  name: string;
  size?: IconSize;
  weight?: IconWeight;
  className?: string;
  color?: string;
}

// Map of icon names to Phosphor components
const iconMap: Record<string, React.ComponentType<any>> = {
  // Navigation
  'house': PhosphorIcons.House,
  'file': PhosphorIcons.File,
  'files': PhosphorIcons.Files,
  'users': PhosphorIcons.Users,
  'user': PhosphorIcons.User,
  'package': PhosphorIcons.Package,
  'chart-bar': PhosphorIcons.ChartBar,
  'currency-dollar': PhosphorIcons.CurrencyDollar,
  'timer': PhosphorIcons.Timer,
  'gear': PhosphorIcons.Gear,
  
  // Actions
  'plus': PhosphorIcons.Plus,
  'minus': PhosphorIcons.Minus,
  'x': PhosphorIcons.X,
  'check': PhosphorIcons.Check,
  'arrow-up-right': PhosphorIcons.ArrowUpRight,
  'arrow-right': PhosphorIcons.ArrowRight,
  'arrow-left': PhosphorIcons.ArrowLeft,
  'arrow-down': PhosphorIcons.ArrowDown,
  'arrow-up': PhosphorIcons.ArrowUp,
  'caret-down': PhosphorIcons.CaretDown,
  'caret-up': PhosphorIcons.CaretUp,
  'caret-left': PhosphorIcons.CaretLeft,
  'caret-right': PhosphorIcons.CaretRight,
  'chevron-down': PhosphorIcons.CaretDown,
  'chevron-up': PhosphorIcons.CaretUp,
  'chevron-left': PhosphorIcons.CaretLeft,
  'chevron-right': PhosphorIcons.CaretRight,
  'pencil-simple': PhosphorIcons.PencilSimple,
  'trash': PhosphorIcons.Trash,
  'copy': PhosphorIcons.Copy,
  'download': PhosphorIcons.Download,
  'upload': PhosphorIcons.Upload,
  'printer': PhosphorIcons.Printer,
  'magnifying-glass': PhosphorIcons.MagnifyingGlass,
  'funnel': PhosphorIcons.Funnel,
  'dots-three': PhosphorIcons.DotsThree,
  'dots-three-vertical': PhosphorIcons.DotsThreeVertical,
  
  // Status
  'check-circle': PhosphorIcons.CheckCircle,
  'x-circle': PhosphorIcons.XCircle,
  'warning': PhosphorIcons.Warning,
  'info': PhosphorIcons.Info,
  'clock': PhosphorIcons.Clock,
  'calendar': PhosphorIcons.Calendar,
  
  // UI
  'sun': PhosphorIcons.Sun,
  'moon': PhosphorIcons.Moon,
  'monitor': PhosphorIcons.Monitor,
  'command': PhosphorIcons.Command,
  'keyboard': PhosphorIcons.Keyboard,
  'question': PhosphorIcons.Question,
  'export': PhosphorIcons.Export,
  'archive': PhosphorIcons.Archive,
  'link': PhosphorIcons.Link,
  'paperclip': PhosphorIcons.Paperclip,
  'image': PhosphorIcons.Image,
  'bank': PhosphorIcons.Bank,
  'credit-card': PhosphorIcons.CreditCard,
  'whatsapp-logo': PhosphorIcons.WhatsappLogo,
  'envelope': PhosphorIcons.Envelope,
  
  // Document
  'file-text': PhosphorIcons.FileText,
  'file-arrow-up': PhosphorIcons.FileArrowUp,
  'file-arrow-down': PhosphorIcons.FileArrowDown,
  'receipt': PhosphorIcons.Receipt,
  'invoice': PhosphorIcons.FileText,
  'quote': PhosphorIcons.ChatCenteredText,
  
  // Business
  'briefcase': PhosphorIcons.Briefcase,
  'identification-card': PhosphorIcons.IdentificationCard,
  'globe': PhosphorIcons.Globe,
  'phone': PhosphorIcons.Phone,
  'map-pin': PhosphorIcons.MapPin,
  
  // Misc
  'flame': PhosphorIcons.Flame,
  'star': PhosphorIcons.Star,
  'heart': PhosphorIcons.Heart,
  'lightning': PhosphorIcons.Lightning,
  'sparkle': PhosphorIcons.Sparkle,
  
  // Additional
  'clock-counter-clockwise': PhosphorIcons.ClockCounterClockwise,
  'plus-circle': PhosphorIcons.PlusCircle,
};

export function Icon({ name, size = 20, weight = 'regular', className = '', color }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <IconComponent
      size={size}
      weight={weight}
      className={className}
      color={color}
      aria-hidden="true"
    />
  );
}

// Logo mark component
export function LogoMark({ size = 32 }: { size?: number }) {
  const iconSize = Math.round(size * 0.5) as IconSize;
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-flame"
      style={{ width: size, height: size }}
    >
      <Icon name="arrow-up-right" size={iconSize} weight="bold" color="white" />
    </div>
  );
}
