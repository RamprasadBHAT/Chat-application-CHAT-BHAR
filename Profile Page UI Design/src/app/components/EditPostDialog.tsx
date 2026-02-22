import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ContentItem {
  id: string;
  type: 'image' | 'video' | 'carousel';
  thumbnail: string;
  slides?: string[];
  likes?: number;
  comments?: number;
  description?: string;
  hashtags?: string[];
}

interface EditPostDialogProps {
  post: ContentItem;
  onSave: (postId: string, data: {
    description: string;
    hashtags: string[];
    thumbnail?: string;
  }) => void;
}

export function EditPostDialog({ post, onSave }: EditPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: post.description || '',
    hashtags: post.hashtags?.join(' ') || '',
    thumbnail: post.thumbnail,
  });
  const [previewImage, setPreviewImage] = useState(post.thumbnail);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({ ...formData, thumbnail: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const hashtagsArray = formData.hashtags
      .split(' ')
      .filter(tag => tag.trim() !== '')
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
    
    onSave(post.id, {
      description: formData.description,
      hashtags: hashtagsArray,
      thumbnail: formData.thumbnail,
    });
    setOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      description: post.description || '',
      hashtags: post.hashtags?.join(' ') || '',
      thumbnail: post.thumbnail,
    });
    setPreviewImage(post.thumbnail);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm">
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update your post details, description, and hashtags
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preview Image */}
          <div className="space-y-2">
            <Label>Preview Image</Label>
            <div className="flex gap-4">
              <div className="w-32" style={{ aspectRatio: '3/4' }}>
                <ImageWithFallback
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <Label htmlFor="post-preview" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    Change preview image
                  </div>
                </Label>
                <Input
                  id="post-preview"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Update the thumbnail for this post
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write a caption..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              value={formData.hashtags}
              onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              placeholder="#travel #photography #nature"
            />
            <p className="text-xs text-muted-foreground">
              Separate hashtags with spaces
            </p>
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
