import { Settings, Grid, BarChart3, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { EditProfileDialog } from './EditProfileDialog';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface ProfileHeaderProps {
  profileImage: string;
  username: string;
  displayName: string;
  bio: string;
  posts: number;
  followers: number;
  following: number;
  socialLinks?: SocialLink[];
  onProfileUpdate?: (data: {
    profileImage: string;
    displayName: string;
    bio: string;
    socialLinks: SocialLink[];
  }) => void;
}

export function ProfileHeader({
  profileImage,
  username,
  displayName,
  bio,
  posts,
  followers,
  following,
  socialLinks = [],
  onProfileUpdate,
}: ProfileHeaderProps) {
  const handleProfileSave = (data: {
    profileImage: string;
    displayName: string;
    bio: string;
    socialLinks: SocialLink[];
  }) => {
    if (onProfileUpdate) {
      onProfileUpdate(data);
    }
  };

  return (
    <div className="border-b pb-8 mb-6">
      <div className="flex items-start gap-8 mb-6">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profileImage} alt={username} />
          <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-xl">{username}</h1>
            <EditProfileDialog
              profileImage={profileImage}
              displayName={displayName}
              username={username}
              bio={bio}
              socialLinks={socialLinks}
              onSave={handleProfileSave}
            />
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex gap-8 mb-6">
            <div>
              <span className="font-semibold">{posts}</span> posts
            </div>
            <div>
              <span className="font-semibold">{followers.toLocaleString()}</span> followers
            </div>
            <div>
              <span className="font-semibold">{following}</span> following
            </div>
          </div>
          
          <div>
            <p className="font-semibold mb-1">{displayName}</p>
            <p className="text-sm whitespace-pre-line">{bio}</p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}