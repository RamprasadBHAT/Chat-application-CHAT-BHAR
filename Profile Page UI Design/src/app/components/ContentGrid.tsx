import { useState } from 'react';
import { Grid3x3, Play, Bookmark, User, X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, MoreVertical, Archive, Pin, EyeOff, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { EditPostDialog } from './EditPostDialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { toast } from 'sonner';

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

interface ContentGridProps {
  posts: ContentItem[];
  videos: ContentItem[];
  saved: ContentItem[];
  tagged: ContentItem[];
  onUpdatePost?: (postId: string, updates: Partial<ContentItem>) => void;
  onDeletePost?: (postId: string) => void;
  onArchivePost?: (postId: string) => void;
  onPinPost?: (postId: string) => void;
  onRemoveFromGrid?: (postId: string) => void;
}

export function ContentGrid({ 
  posts, 
  videos, 
  saved, 
  tagged,
  onUpdatePost,
  onDeletePost,
  onArchivePost,
  onPinPost,
  onRemoveFromGrid,
}: ContentGridProps) {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
    setCurrentSlide(0);
    setLiked(false);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setCurrentSlide(0);
    setLiked(false);
  };

  const nextSlide = () => {
    if (selectedItem?.slides) {
      setCurrentSlide((prev) => (prev + 1) % selectedItem.slides.length);
    }
  };

  const prevSlide = () => {
    if (selectedItem?.slides) {
      setCurrentSlide((prev) => (prev - 1 + selectedItem.slides.length) % selectedItem.slides.length);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post',
        text: selectedItem?.description || 'Check out this post!',
      }).catch(() => {
        // User cancelled or error occurred
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleEdit = (postId: string, data: { description: string; hashtags: string[]; thumbnail?: string }) => {
    if (onUpdatePost) {
      onUpdatePost(postId, {
        description: data.description,
        hashtags: data.hashtags,
        thumbnail: data.thumbnail,
      });
      // Update the selected item if it's currently open
      if (selectedItem?.id === postId) {
        setSelectedItem({
          ...selectedItem,
          description: data.description,
          hashtags: data.hashtags,
          thumbnail: data.thumbnail || selectedItem.thumbnail,
        });
      }
      toast.success('Post updated successfully!');
    }
  };

  const handleDelete = (postId: string) => {
    if (onDeletePost) {
      onDeletePost(postId);
      handleClose();
      toast.success('Post deleted successfully!');
    }
  };

  const handleArchive = (postId: string) => {
    if (onArchivePost) {
      onArchivePost(postId);
      handleClose();
      toast.success('Post archived successfully!');
    }
  };

  const handlePin = (postId: string) => {
    if (onPinPost) {
      onPinPost(postId);
      if (selectedItem) {
        setSelectedItem({
          ...selectedItem,
          isPinned: !selectedItem.isPinned,
        });
      }
      toast.success(selectedItem?.isPinned ? 'Post unpinned' : 'Post pinned to top!');
    }
  };

  const handleRemoveFromGrid = (postId: string) => {
    if (onRemoveFromGrid) {
      onRemoveFromGrid(postId);
      handleClose();
      toast.success('Post removed from grid!');
    }
  };

  const renderGrid = (items: ContentItem[]) => (
    <>
      <div className="grid grid-cols-3 gap-1">
        {items.filter(item => !item.isArchived).map((item) => (
          <div
            key={item.id}
            className="relative cursor-pointer group overflow-hidden"
            style={{ aspectRatio: '3/4' }}
            onClick={() => handleItemClick(item)}
          >
            {item.isPinned && (
              <div className="absolute top-2 left-2 z-10">
                <Pin className="h-4 w-4 text-white fill-white drop-shadow-lg" />
              </div>
            )}
            <ImageWithFallback
              src={item.thumbnail}
              alt="Content"
              className="w-full h-full object-cover"
            />
            {item.type === 'video' && (
              <div className="absolute top-2 right-2">
                <Play className="h-5 w-5 text-white fill-white drop-shadow-lg" />
              </div>
            )}
            {item.type === 'carousel' && (
              <div className="absolute top-2 right-2">
                <Grid3x3 className="h-5 w-5 text-white drop-shadow-lg" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100">
              {item.likes !== undefined && (
                <span className="text-white font-semibold flex items-center gap-1">
                  ❤️ {item.likes}
                </span>
              )}
              {item.comments !== undefined && (
                <span className="text-white font-semibold flex items-center gap-1">
                  💬 {item.comments}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Detail Modal */}
      <Dialog open={selectedItem !== null} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>View Post</DialogTitle>
            <DialogDescription>
              Post by ramprasadbhat with {selectedItem?.likes || 0} likes and {selectedItem?.comments || 0} comments
            </DialogDescription>
          </VisuallyHidden>
          
          <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-6 w-6 text-white drop-shadow-lg" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {selectedItem && (
            <div className="flex flex-col md:flex-row bg-background max-h-[90vh]">
              {/* Image Section */}
              <div className="relative bg-black md:w-[60%] flex items-center justify-center">
                {selectedItem.type === 'carousel' && selectedItem.slides ? (
                  <div className="relative w-full">
                    <div className="relative" style={{ aspectRatio: '3/4' }}>
                      <div
                        className="flex transition-transform duration-300 ease-out h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                      >
                        {selectedItem.slides.map((slide, index) => (
                          <div key={index} className="min-w-full h-full flex-shrink-0">
                            <ImageWithFallback
                              src={slide}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedItem.slides.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-lg"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-lg"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {selectedItem.slides.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`h-1.5 rounded-full transition-all ${
                                index === currentSlide
                                  ? 'w-6 bg-white'
                                  : 'w-1.5 bg-white/50 hover:bg-white/80'
                              }`}
                              aria-label={`Go to slide ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ aspectRatio: '3/4' }}>
                    <ImageWithFallback
                      src={selectedItem.thumbnail}
                      alt="Content"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="md:w-[40%] flex flex-col">
                {/* Header with 3-dot menu */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <span className="font-semibold">ramprasadbhat</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-accent rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <EditPostDialog post={selectedItem} onSave={handleEdit} />
                      <DropdownMenuItem onClick={() => handlePin(selectedItem.id)}>
                        <Pin className="h-4 w-4 mr-2" />
                        {selectedItem.isPinned ? 'Unpin' : 'Pin to top'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(selectedItem.id)}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemoveFromGrid(selectedItem.id)}>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Remove from grid
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(selectedItem.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Description and Comments */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedItem.description && (
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold mr-2">ramprasadbhat</span>
                        {selectedItem.description}
                      </p>
                      {selectedItem.hashtags && selectedItem.hashtags.length > 0 && (
                        <p className="text-sm text-primary mt-2">
                          {selectedItem.hashtags.join(' ')}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    View all {selectedItem.comments || 0} comments
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="border-t p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setLiked(!liked)}
                      className="hover:opacity-60 transition"
                    >
                      <Heart
                        className={`h-6 w-6 ${liked ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                    <button className="hover:opacity-60 transition">
                      <MessageCircle className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="hover:opacity-60 transition"
                    >
                      <Share2 className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-semibold">
                      {(selectedItem.likes || 0) + (liked ? 1 : 0)} likes
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    2 DAYS AGO
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-center border-t">
        <TabsTrigger value="posts" className="gap-2">
          <Grid3x3 className="h-4 w-4" />
          POSTS
        </TabsTrigger>
        <TabsTrigger value="videos" className="gap-2">
          <Play className="h-4 w-4" />
          VIDEOS
        </TabsTrigger>
        <TabsTrigger value="saved" className="gap-2">
          <Bookmark className="h-4 w-4" />
          SAVED
        </TabsTrigger>
        <TabsTrigger value="tagged" className="gap-2">
          <User className="h-4 w-4" />
          TAGGED
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-0">
        {renderGrid(posts)}
      </TabsContent>

      <TabsContent value="videos" className="mt-0">
        {renderGrid(videos)}
      </TabsContent>

      <TabsContent value="saved" className="mt-0">
        {renderGrid(saved)}
      </TabsContent>

      <TabsContent value="tagged" className="mt-0">
        {renderGrid(tagged)}
      </TabsContent>
    </Tabs>
  );
}