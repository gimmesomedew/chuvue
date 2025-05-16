
import { Activity, AlertCircle, AlignCenter, AlignLeft, AlignRight, Anchor, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, AtSign, Award, Backpack, BatteryCharging, Bell, Bluetooth, Bold, BookOpen, Bookmark, Box, Briefcase, Calendar, Camera, Cast, Check, ChevronDown, CircleDot, Clock, Cloud, Code, Coffee, Compass, Copy, CreditCard, Crop, Database, Delete, Disc, DollarSign, Download, Edit, Eye, Facebook, File, FileText, Film, Flag, Folder, FolderOpen, Gift, Github, Globe, Headphones, Heart, Home, Image, Inbox, Instagram, Key, Layers, Layout, LifeBuoy, Link, List, Lock, Mail, Map, MessageCircle, MessageSquare, Mic, Monitor, Moon, Music, Package, PenTool, Phone, Play, Plus, Printer, Radio, Search, Send, Settings, Share, Shield, ShoppingBag, ShoppingCart, Shuffle, Smartphone, Speaker, Star, Sun, Table, Tag, Target, Terminal, ThumbsUp, Trash, Trophy, Tv, Twitter, Umbrella, Upload, User, Video, Wallet, Watch, Wifi, Youtube, Zap } from 'lucide-react';
import { useState } from 'react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

const ICONS = [
  { name: 'Activity', component: Activity },
  { name: 'AlertCircle', component: AlertCircle },
  { name: 'AlignCenter', component: AlignCenter },
  { name: 'AlignLeft', component: AlignLeft },
  { name: 'AlignRight', component: AlignRight },
  { name: 'Anchor', component: Anchor },
  { name: 'Archive', component: Archive },
  { name: 'ArrowDown', component: ArrowDown },
  { name: 'ArrowLeft', component: ArrowLeft },
  { name: 'ArrowRight', component: ArrowRight },
  { name: 'ArrowUp', component: ArrowUp },
  { name: 'AtSign', component: AtSign },
  { name: 'Award', component: Award },
  { name: 'Backpack', component: Backpack },
  { name: 'BatteryCharging', component: BatteryCharging },
  { name: 'Bell', component: Bell },
  { name: 'Bluetooth', component: Bluetooth },
  { name: 'Bold', component: Bold },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Bookmark', component: Bookmark },
  { name: 'Box', component: Box },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Calendar', component: Calendar },
  { name: 'Camera', component: Camera },
  { name: 'Cast', component: Cast },
  { name: 'Check', component: Check },
  { name: 'ChevronDown', component: ChevronDown },
  { name: 'CircleDot', component: CircleDot },
  { name: 'Clock', component: Clock },
  { name: 'Cloud', component: Cloud },
  { name: 'Code', component: Code },
  { name: 'Coffee', component: Coffee },
  { name: 'Compass', component: Compass },
  { name: 'Copy', component: Copy },
  { name: 'CreditCard', component: CreditCard },
  { name: 'Crop', component: Crop },
  { name: 'Database', component: Database },
  { name: 'Delete', component: Delete },
  { name: 'Disc', component: Disc },
  { name: 'DollarSign', component: DollarSign },
  { name: 'Download', component: Download },
  { name: 'Edit', component: Edit },
  { name: 'Eye', component: Eye },
  { name: 'Facebook', component: Facebook },
  { name: 'File', component: File },
  { name: 'FileText', component: FileText },
  { name: 'Film', component: Film },
  { name: 'Flag', component: Flag },
  { name: 'Folder', component: Folder },
  { name: 'FolderOpen', component: FolderOpen },
  { name: 'Gift', component: Gift },
  { name: 'Github', component: Github },
  { name: 'Globe', component: Globe },
  { name: 'Headphones', component: Headphones },
  { name: 'Heart', component: Heart },
  { name: 'Home', component: Home },
  { name: 'Image', component: Image },
  { name: 'Inbox', component: Inbox },
  { name: 'Instagram', component: Instagram },
  { name: 'Key', component: Key },
  { name: 'Layers', component: Layers },
  { name: 'Layout', component: Layout },
  { name: 'LifeBuoy', component: LifeBuoy },
  { name: 'Link', component: Link },
  { name: 'List', component: List },
  { name: 'Lock', component: Lock },
  { name: 'Mail', component: Mail },
  { name: 'Map', component: Map },
  { name: 'MessageCircle', component: MessageCircle },
  { name: 'MessageSquare', component: MessageSquare },
  { name: 'Mic', component: Mic },
  { name: 'Monitor', component: Monitor },
  { name: 'Moon', component: Moon },
  { name: 'Music', component: Music },
  { name: 'Package', component: Package },
  { name: 'PenTool', component: PenTool },
  { name: 'Phone', component: Phone },
  { name: 'Play', component: Play },
  { name: 'Plus', component: Plus },
  { name: 'Printer', component: Printer },
  { name: 'Radio', component: Radio },
  { name: 'Search', component: Search },
  { name: 'Send', component: Send },
  { name: 'Settings', component: Settings },
  { name: 'Share', component: Share },
  { name: 'Shield', component: Shield },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Shuffle', component: Shuffle },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Speaker', component: Speaker },
  { name: 'Star', component: Star },
  { name: 'Sun', component: Sun },
  { name: 'Table', component: Table },
  { name: 'Tag', component: Tag },
  { name: 'Target', component: Target },
  { name: 'Terminal', component: Terminal },
  { name: 'ThumbsUp', component: ThumbsUp },
  { name: 'Trash', component: Trash },
  { name: 'Trophy', component: Trophy },
  { name: 'Tv', component: Tv },
  { name: 'Twitter', component: Twitter },
  { name: 'Umbrella', component: Umbrella },
  { name: 'Upload', component: Upload },
  { name: 'User', component: User },
  { name: 'Video', component: Video },
  { name: 'Wallet', component: Wallet },
  { name: 'Watch', component: Watch },
  { name: 'Wifi', component: Wifi },
  { name: 'Youtube', component: Youtube },
  { name: 'Zap', component: Zap },
] as const;

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Find the current icon component
  const currentIcon = ICONS.find(icon => icon.name === value);

  // Filter icons based on search term
  const filteredIcons = ICONS.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col gap-4">
      {/* Selected Icon Display */}
      <div className="flex h-10 items-center gap-2 rounded-md border border-gray-600 bg-gray-700 px-3 py-2">
        {currentIcon ? (
          <>
            <currentIcon.component className="h-5 w-5 text-white" />
            <span className="text-sm text-white">{currentIcon.name}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Select Icon</span>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search icons..."
          className="w-full rounded-md border border-gray-600 bg-gray-700 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Icon Grid */}
      <div className="grid max-h-[320px] grid-cols-6 gap-2 overflow-y-auto rounded-lg bg-gray-800 p-2">
        {filteredIcons.map(({ name, component: Icon }) => (
          <button
            key={name}
            onClick={() => onChange(name)}
            className={`
              flex h-10 w-10 items-center justify-center rounded-lg
              transition-colors duration-150 ease-in-out
              ${value === name ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'}
            `}
            title={name}
            type="button"
          >
            <Icon className="h-5 w-5 text-white" />
          </button>
        ))}
      </div>
    </div>
  );
}
