import { useState } from 'react';
import { ProfileHeader } from './components/ProfileHeader';
import { ContentGrid } from './components/ContentGrid';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Button } from './components/ui/button';
import { BarChart3, Grid3x3 } from 'lucide-react';
import profilePhoto from 'figma:asset/7b39d5a414e81cfe826127649394e391088d28fd.png';
import { Toaster } from './components/ui/sonner';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface ContentItem {
  id: string;
  type: 'image' | 'video' | 'carousel';
  thumbnail: string;
  slides?: string[];
  likes?: number;
  comments?: number;
  description?: string;
  hashtags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
}

// Mock data with descriptions and hashtags
const initialMockPosts: ContentItem[] = [
  {
    id: '1',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1598087216773-d02ad98034f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHBob3RvZ3JhcGh5JTIwY2l0eXxlbnwxfHx8fDE3NzE2NTcxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 1234,
    comments: 89,
    description: 'Exploring the urban jungle 🏙️ The city lights never looked better!',
    hashtags: ['#urbanphotography', '#cityscape', '#nightlife', '#architecture'],
    isPinned: true,
  },
  {
    id: '2',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1600257729950-13a634d32697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcxNTczMjA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 2456,
    comments: 145,
    description: 'Mountain adventures await! The view from the summit was absolutely breathtaking.',
    hashtags: ['#mountains', '#hiking', '#nature', '#adventure', '#landscape'],
  },
  {
    id: '3',
    type: 'carousel',
    thumbnail: 'https://images.unsplash.com/photo-1669743267803-03f1de4b89ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MTU4Mjg0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    slides: [
      'https://images.unsplash.com/photo-1669743267803-03f1de4b89ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MTU4Mjg0OXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBjbG90aGluZ3xlbnwxfHx8fDE3NzE1NzI2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1756227584303-f1400daaa69d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBtb2Rlcm4lMjBidWlsZGluZ3xlbnwxfHx8fDE3NzE1NzQ2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    likes: 3421,
    comments: 234,
    description: 'Food, fashion, and design - a perfect day out! Swipe to see more.',
    hashtags: ['#lifestyle', '#foodie', '#fashion', '#design'],
  },
  {
    id: '4',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBjbG90aGluZ3xlbnwxfHx8fDE3NzE1NzI2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 987,
    comments: 56,
    description: 'Fashion is about expressing who you are without saying a word.',
    hashtags: ['#fashion', '#style', '#ootd', '#streetstyle'],
  },
  {
    id: '5',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1594440344184-d59dfc86f8a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBiZWFjaHxlbnwxfHx8fDE3NzE1Njk1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 5678,
    comments: 342,
    description: 'Beach therapy 🌊 Nothing beats the sound of waves and salty air.',
    hashtags: ['#beach', '#travel', '#ocean', '#paradise', '#vacation'],
  },
  {
    id: '6',
    type: 'carousel',
    thumbnail: 'https://images.unsplash.com/photo-1756227584303-f1400daaa69d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBtb2Rlcm4lMjBidWlsZGluZ3xlbnwxfHx8fDE3NzE1NzQ2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    slides: [
      'https://images.unsplash.com/photo-1756227584303-f1400daaa69d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBtb2Rlcm4lMjBidWlsZGluZ3xlbnwxfHx8fDE3NzE1NzQ2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1721398511479-32d2c26618d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBjb2xvcmZ1bCUyMHNreXxlbnwxfHx8fDE3NzE2NDI2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1598087216773-d02ad98034f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHBob3RvZ3JhcGh5JTIwY2l0eXxlbnwxfHx8fDE3NzE2NTcxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600257729950-13a634d32697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcxNTczMjA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    likes: 1876,
    comments: 123,
    description: 'A collection of my favorite moments from this year. Each frame tells a story.',
    hashtags: ['#photography', '#memories', '#photooftheday', '#travelphotography'],
  },
  {
    id: '7',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1721398511479-32d2c26618d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBjb2xvcmZ1bCUyMHNreXxlbnwxfHx8fDE3NzE2NDI2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 4321,
    comments: 267,
    description: 'Golden hour magic ✨ Chasing sunsets and making memories.',
    hashtags: ['#sunset', '#goldenhour', '#nature', '#sky', '#photography'],
  },
  {
    id: '8',
    type: 'carousel',
    thumbnail: 'https://images.unsplash.com/photo-1758909894264-eae137ed71ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsaWZlc3R5bGUlMjBtb3JuaW5nfGVufDF8fHx8MTc3MTYyMDU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    slides: [
      'https://images.unsplash.com/photo-1758909894264-eae137ed71ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsaWZlc3R5bGUlMjBtb3JuaW5nfGVufDF8fHx8MTc3MTYyMDU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1594440344184-d59dfc86f8a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBiZWFjaHxlbnwxfHx8fDE3NzE1Njk1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    likes: 2987,
    comments: 178,
    description: 'Coffee first, adventures second ☕ Living my best life one cup at a time.',
    hashtags: ['#coffee', '#coffeelover', '#morningvibes', '#lifestyle'],
  },
  {
    id: '9',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1600257729950-13a634d32697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcxNTczMjA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 1543,
    comments: 92,
    description: 'Into the wild 🏔️ Nature is the best therapy.',
    hashtags: ['#nature', '#wilderness', '#explore', '#outdoors'],
  },
];

const initialMockVideos: ContentItem[] = [
  {
    id: 'v1',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1594440344184-d59dfc86f8a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBiZWFjaHxlbnwxfHx8fDE3NzE1Njk1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 6789,
    comments: 456,
    description: 'Beach day vibes 🌊 Watch till the end for the perfect sunset!',
    hashtags: ['#beachlife', '#reels', '#travel', '#sunset'],
  },
  {
    id: 'v2',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1598087216773-d02ad98034f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHBob3RvZ3JhcGh5JTIwY2l0eXxlbnwxfHx8fDE3NzE2NTcxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 4532,
    comments: 289,
    description: 'City lights time-lapse 🌃 48 hours condensed into 60 seconds.',
    hashtags: ['#timelapse', '#citylife', '#urban', '#video'],
  },
  {
    id: 'v3',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1721398511479-32d2c26618d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBjb2xvcmZ1bCUyMHNreXxlbnwxfHx8fDE3NzE2NDI2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 8234,
    comments: 567,
    description: 'Chasing that golden hour glow ✨',
    hashtags: ['#goldenhour', '#videography', '#cinematic'],
    isPinned: true,
  },
  {
    id: 'v4',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBjbG90aGluZ3xlbnwxfHx8fDE3NzE1NzI2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 3421,
    comments: 234,
    description: 'OOTD - Street style edition 👟',
    hashtags: ['#fashion', '#streetstyle', '#ootd', '#reels'],
  },
  {
    id: 'v5',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1756227584303-f1400daaa69d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBtb2Rlcm4lMjBidWlsZGluZ3xlbnwxfHx8fDE3NzE1NzQ2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 5123,
    comments: 345,
    description: 'Architectural wonders 🏛️ Modern design at its finest.',
    hashtags: ['#architecture', '#design', '#modern'],
  },
  {
    id: 'v6',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1758909894264-eae137ed71ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsaWZlc3R5bGUlMjBtb3JuaW5nfGVufDF8fHx8MTc3MTYyMDU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 2876,
    comments: 156,
    description: 'Morning coffee ritual ☕ The best way to start your day.',
    hashtags: ['#coffee', '#morning', '#lifestyle', '#coffeetime'],
  },
];

export default function App() {
  const [view, setView] = useState<'profile' | 'analytics'>('profile');
  const [profileData, setProfileData] = useState({
    profileImage: profilePhoto,
    displayName: 'Ram Prasad Bhat',
    bio: 'Content Creator & Developer 💻\nBuilding amazing digital experiences\n🎨 Creative | 🚀 Tech Enthusiast\n📍 India',
    socialLinks: [
      { id: '1', platform: 'Twitter', url: 'https://twitter.com/ramprasadbhat' },
      { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com/in/ramprasadbhat' },
      { id: '3', platform: 'GitHub', url: 'https://github.com/ramprasadbhat' },
    ] as SocialLink[],
  });

  const [posts, setPosts] = useState<ContentItem[]>(initialMockPosts);
  const [videos, setVideos] = useState<ContentItem[]>(initialMockVideos);
  const [saved] = useState<ContentItem[]>(initialMockPosts.slice(0, 6));
  const [tagged] = useState<ContentItem[]>(initialMockPosts.slice(2, 8));

  const handleProfileUpdate = (data: {
    profileImage: string;
    displayName: string;
    bio: string;
    socialLinks: SocialLink[];
  }) => {
    setProfileData(data);
  };

  const handleUpdatePost = (postId: string, updates: Partial<ContentItem>) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, ...updates } : post));
    setVideos(videos.map(video => video.id === postId ? { ...video, ...updates } : video));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    setVideos(videos.filter(video => video.id !== postId));
  };

  const handleArchivePost = (postId: string) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, isArchived: true } : post));
    setVideos(videos.map(video => video.id === postId ? { ...video, isArchived: true } : video));
  };

  const handlePinPost = (postId: string) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, isPinned: !post.isPinned } : post));
    setVideos(videos.map(video => video.id === postId ? { ...video, isPinned: !video.isPinned } : video));
  };

  const handleRemoveFromGrid = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    setVideos(videos.filter(video => video.id !== postId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProfileHeader
          profileImage={profileData.profileImage}
          username="ramprasadbhat"
          displayName={profileData.displayName}
          bio={profileData.bio}
          posts={42}
          followers={20500}
          following={387}
          socialLinks={profileData.socialLinks}
          onProfileUpdate={handleProfileUpdate}
        />

        <div className="flex gap-2 mb-6 border-b pb-4">
          <Button
            variant={view === 'profile' ? 'default' : 'ghost'}
            onClick={() => setView('profile')}
            className="gap-2"
          >
            <Grid3x3 className="h-4 w-4" />
            Profile
          </Button>
          <Button
            variant={view === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setView('analytics')}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        </div>

        {view === 'profile' ? (
          <ContentGrid
            posts={posts}
            videos={videos}
            saved={saved}
            tagged={tagged}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onArchivePost={handleArchivePost}
            onPinPost={handlePinPost}
            onRemoveFromGrid={handleRemoveFromGrid}
          />
        ) : (
          <AnalyticsDashboard />
        )}
      </div>
    </div>
  );
}
