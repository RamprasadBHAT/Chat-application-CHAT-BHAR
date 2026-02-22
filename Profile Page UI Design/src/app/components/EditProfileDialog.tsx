import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Upload, X, Plus } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface EditProfileDialogProps {
  profileImage: string;
  displayName: string;
  username: string;
  bio: string;
  socialLinks: SocialLink[];
  onSave: (data: {
    profileImage: string;
    displayName: string;
    bio: string;
    socialLinks: SocialLink[];
  }) => void;
}

export function EditProfileDialog({
  profileImage,
  displayName,
  username,
  bio,
  socialLinks,
  onSave,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    profileImage,
    displayName,
    bio,
    socialLinks: [...socialLinks],
  });
  const [imagePreview, setImagePreview] = useState(profileImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, profileImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [
        ...formData.socialLinks,
        { id: Date.now().toString(), platform: '', url: '' },
      ],
    });
  };

  const updateSocialLink = (id: string, field: 'platform' | 'url', value: string) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    });
  };

  const removeSocialLink = (id: string) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((link) => link.id !== id),
    });
  };

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      profileImage,
      displayName,
      bio,
      socialLinks: [...socialLinks],
    });
    setImagePreview(profileImage);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
          Edit Profile
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information, including your photo, bio, and social media links.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Image */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={imagePreview} alt={username} />
              <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="profile-image" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  <Upload className="h-4 w-4" />
                  Change profile photo
                </div>
              </Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display-name">Name</Label>
            <Input
              id="display-name"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              placeholder="Your display name"
            />
          </div>

          {/* Username (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">
              Username cannot be changed
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length} / 150 characters
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Social Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialLink}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </div>

            {formData.socialLinks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No social links added yet
              </p>
            )}

            <div className="space-y-3">
              {formData.socialLinks.map((link) => (
                <div key={link.id} className="flex gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Platform (e.g., Instagram)"
                      value={link.platform}
                      onChange={(e) =>
                        updateSocialLink(link.id, 'platform', e.target.value)
                      }
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(link.id, 'url', e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocialLink(link.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}