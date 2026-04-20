/**
 * Curated subset of Lucide icons exposed to the design-mode icon
 * picker. We deliberately import a bounded set (~100) rather than the
 * full library (~2000 icons) so the editor bundle stays fast and the
 * picker UI isn't overwhelming. Icons are grouped loosely by semantic
 * category — the picker renders them in declaration order and
 * filters by name.
 *
 * To add more icons: import them from `lucide-react` and append to
 * the `ICON_LIBRARY` export below. Keep names in PascalCase (matching
 * the lucide-react export) so the picker's label generator can
 * produce a readable human label.
 */

import {
  // Actions & controls
  Play,
  Pause,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Copy,
  Trash2,
  Edit,
  Settings,
  MoreHorizontal,
  ExternalLink,
  // People & collaboration
  User,
  Users,
  UserPlus,
  UserCheck,
  UserCircle,
  // Communication
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  PhoneCall,
  Bell,
  Send,
  // Media
  Image as ImageIcon,
  Video,
  Music,
  Camera,
  Film,
  Mic,
  // Documents & data
  File,
  FileText,
  FolderOpen,
  Folder,
  Archive,
  ClipboardList,
  Clipboard,
  BookOpen,
  Book,
  Newspaper,
  Bookmark,
  // Business & analytics
  BarChart2,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Briefcase,
  Building,
  Building2,
  Target,
  Award,
  Trophy,
  Crown,
  // Science & labs
  FlaskConical,
  Microscope,
  Atom,
  Dna,
  TestTube,
  Pill,
  Stethoscope,
  HeartPulse,
  // Tech & infra
  Cpu,
  Server,
  Database,
  HardDrive,
  Cloud,
  CloudUpload,
  Wifi,
  Globe,
  Layers,
  Package,
  Box,
  Boxes,
  // Tools & utilities
  Wrench,
  Hammer,
  SlidersHorizontal,
  ToggleLeft,
  Cog,
  Puzzle,
  // Safety & trust
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  EyeOff,
  Eye,
  // Status & indicators
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  HelpCircle,
  Flag,
  Bookmark as BookmarkAlt,
  // Nature & misc
  Sparkles,
  Zap,
  Star,
  Heart,
  Sun,
  Moon,
  Leaf,
  Lightbulb,
  Compass,
  Map,
  MapPin,
  Calendar,
  Clock,
  Timer,
  Hourglass,
  Home,
  Rocket,
  type LucideIcon,
} from 'lucide-react'

export interface IconLibraryEntry {
  /** PascalCase name matching the lucide-react export. */
  name: string
  /** Human-readable label shown as a tooltip. */
  label: string
  /** The actual component to render. */
  Icon: LucideIcon
  /** Search tags — extra keywords beyond the name. */
  tags: string[]
}

/** Turn "FlaskConical" into "Flask Conical". */
function humanize(pascalCase: string): string {
  return pascalCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/([0-9]+)/g, ' $1')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase())
}

function entry(
  name: string,
  Icon: LucideIcon,
  tags: string[] = [],
): IconLibraryEntry {
  return { name, Icon, label: humanize(name), tags }
}

/**
 * Curated icon set for the design-mode picker. Ordered loosely by
 * category so adjacent icons are semantically related in the grid.
 */
export const ICON_LIBRARY: IconLibraryEntry[] = [
  // Actions & controls
  entry('Play', Play, ['start', 'run']),
  entry('Pause', Pause),
  entry('Plus', Plus, ['add', 'new']),
  entry('Minus', Minus, ['remove', 'subtract']),
  entry('X', X, ['close', 'cancel']),
  entry('Check', Check, ['done', 'complete', 'success']),
  entry('ChevronRight', ChevronRight, ['next']),
  entry('ChevronDown', ChevronDown, ['expand']),
  entry('ChevronLeft', ChevronLeft, ['back']),
  entry('ChevronUp', ChevronUp, ['collapse']),
  entry('ArrowRight', ArrowRight, ['forward']),
  entry('ArrowLeft', ArrowLeft, ['back']),
  entry('ArrowUp', ArrowUp),
  entry('ArrowDown', ArrowDown),
  entry('Search', Search, ['find', 'query']),
  entry('Filter', Filter),
  entry('RefreshCw', RefreshCw, ['reload', 'refresh']),
  entry('Download', Download),
  entry('Upload', Upload),
  entry('Share2', Share2, ['share']),
  entry('Copy', Copy, ['duplicate']),
  entry('Trash2', Trash2, ['delete', 'remove']),
  entry('Edit', Edit, ['pencil', 'write']),
  entry('Settings', Settings, ['gear', 'prefs']),
  entry('MoreHorizontal', MoreHorizontal, ['menu', 'dots']),
  entry('ExternalLink', ExternalLink, ['link', 'out']),
  // People
  entry('User', User, ['person']),
  entry('Users', Users, ['people', 'team']),
  entry('UserPlus', UserPlus, ['add member', 'invite']),
  entry('UserCheck', UserCheck, ['verified']),
  entry('UserCircle', UserCircle, ['avatar', 'profile']),
  // Communication
  entry('Mail', Mail, ['email', 'message']),
  entry('MessageCircle', MessageCircle, ['chat', 'comment']),
  entry('MessageSquare', MessageSquare, ['chat']),
  entry('Phone', Phone, ['call']),
  entry('PhoneCall', PhoneCall),
  entry('Bell', Bell, ['notify', 'alert']),
  entry('Send', Send),
  // Media
  entry('ImageIcon', ImageIcon, ['image', 'photo', 'picture']),
  entry('Video', Video, ['film', 'movie']),
  entry('Music', Music, ['audio', 'song']),
  entry('Camera', Camera, ['photo']),
  entry('Film', Film, ['video', 'movie']),
  entry('Mic', Mic, ['microphone', 'audio']),
  // Documents & data
  entry('File', File, ['document']),
  entry('FileText', FileText, ['doc']),
  entry('FolderOpen', FolderOpen),
  entry('Folder', Folder, ['directory']),
  entry('Archive', Archive, ['box', 'store']),
  entry('ClipboardList', ClipboardList, ['list', 'tasks']),
  entry('Clipboard', Clipboard, ['copy', 'paste']),
  entry('BookOpen', BookOpen, ['read', 'docs']),
  entry('Book', Book, ['read']),
  entry('Newspaper', Newspaper, ['news']),
  entry('Bookmark', Bookmark, ['save']),
  // Business & analytics
  entry('BarChart2', BarChart2, ['graph', 'analytics']),
  entry('BarChart3', BarChart3, ['graph', 'analytics']),
  entry('LineChart', LineChart, ['trend']),
  entry('PieChart', PieChart, ['share']),
  entry('TrendingUp', TrendingUp, ['growth']),
  entry('TrendingDown', TrendingDown, ['decline']),
  entry('DollarSign', DollarSign, ['money', 'cost', 'price']),
  entry('CreditCard', CreditCard, ['payment']),
  entry('Briefcase', Briefcase, ['work', 'business']),
  entry('Building', Building, ['office', 'company']),
  entry('Building2', Building2, ['enterprise']),
  entry('Target', Target, ['goal', 'aim']),
  entry('Award', Award, ['prize']),
  entry('Trophy', Trophy, ['win', 'award']),
  entry('Crown', Crown, ['premium', 'leader']),
  // Science & labs
  entry('FlaskConical', FlaskConical, ['science', 'lab', 'chemistry']),
  entry('Microscope', Microscope, ['science', 'research']),
  entry('Atom', Atom, ['science', 'physics']),
  entry('Dna', Dna, ['biology', 'genetics']),
  entry('TestTube', TestTube, ['science', 'lab']),
  entry('Pill', Pill, ['medicine', 'pharma']),
  entry('Stethoscope', Stethoscope, ['medical', 'health']),
  entry('HeartPulse', HeartPulse, ['vital', 'health']),
  // Tech
  entry('Cpu', Cpu, ['processor', 'chip']),
  entry('Server', Server, ['infra']),
  entry('Database', Database, ['data', 'storage']),
  entry('HardDrive', HardDrive, ['storage']),
  entry('Cloud', Cloud, ['infra']),
  entry('CloudUpload', CloudUpload, ['sync']),
  entry('Wifi', Wifi, ['network']),
  entry('Globe', Globe, ['web', 'world']),
  entry('Layers', Layers, ['stack']),
  entry('Package', Package, ['shipping', 'bundle']),
  entry('Box', Box, ['container']),
  entry('Boxes', Boxes),
  // Tools
  entry('Wrench', Wrench, ['tool', 'fix']),
  entry('Hammer', Hammer, ['build']),
  entry('SlidersHorizontal', SlidersHorizontal, ['controls', 'settings']),
  entry('ToggleLeft', ToggleLeft, ['switch']),
  entry('Cog', Cog, ['settings', 'gear']),
  entry('Puzzle', Puzzle, ['piece', 'module']),
  // Safety
  entry('Shield', Shield, ['protect']),
  entry('ShieldCheck', ShieldCheck, ['secure', 'verified']),
  entry('Lock', Lock, ['secure']),
  entry('Unlock', Unlock),
  entry('Key', Key, ['access']),
  entry('EyeOff', EyeOff, ['hide']),
  entry('Eye', Eye, ['show', 'view']),
  // Status
  entry('CheckCircle', CheckCircle, ['done', 'success']),
  entry('AlertCircle', AlertCircle, ['warning']),
  entry('Info', Info, ['help']),
  entry('AlertTriangle', AlertTriangle, ['warning', 'danger']),
  entry('HelpCircle', HelpCircle, ['question']),
  entry('Flag', Flag, ['mark']),
  entry('BookmarkAlt', BookmarkAlt, ['save']),
  // Nature & misc
  entry('Sparkles', Sparkles, ['magic', 'ai']),
  entry('Zap', Zap, ['energy', 'fast', 'bolt']),
  entry('Star', Star, ['favorite']),
  entry('Heart', Heart, ['love', 'like']),
  entry('Sun', Sun, ['light', 'day']),
  entry('Moon', Moon, ['night', 'dark']),
  entry('Leaf', Leaf, ['nature', 'plant']),
  entry('Lightbulb', Lightbulb, ['idea']),
  entry('Compass', Compass, ['direction', 'navigate']),
  entry('Map', Map),
  entry('MapPin', MapPin, ['location']),
  entry('Calendar', Calendar, ['date', 'schedule']),
  entry('Clock', Clock, ['time']),
  entry('Timer', Timer),
  entry('Hourglass', Hourglass, ['wait']),
  entry('Home', Home, ['house']),
  entry('Rocket', Rocket, ['launch', 'startup']),
]

/**
 * Find a curated icon entry by PascalCase name. Returns null if the
 * name isn't in the library — callers can decide whether to fall
 * back to a default.
 */
export function findIconByName(name: string): IconLibraryEntry | null {
  return ICON_LIBRARY.find((e) => e.name === name) ?? null
}

/**
 * Lightweight fuzzy-ish search: matches if every token of `query`
 * appears somewhere in the entry's name or tags. Case-insensitive.
 */
export function searchIcons(query: string): IconLibraryEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return ICON_LIBRARY
  const tokens = q.split(/\s+/)
  return ICON_LIBRARY.filter((e) => {
    const haystack = `${e.name} ${e.label} ${e.tags.join(' ')}`.toLowerCase()
    return tokens.every((t) => haystack.includes(t))
  })
}
