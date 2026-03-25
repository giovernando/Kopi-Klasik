import { useState } from 'react';
import { Save, Image, Upload } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminContent() {
  const { contentSettings, updateContentSettings } = useAdminStore();
  const [formData, setFormData] = useState(contentSettings);

  const handleSave = () => {
    updateContentSettings(formData);
    toast.success('Content updated successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Content Management</h1>
            <p className="text-[#6F4E37]/70">Edit homepage content and promotions</p>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-[#6F4E37] hover:bg-[#4E342E] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl p-6 border border-[#E5DDD3]">
          <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Special Offer */}
        <div className="bg-white rounded-xl p-6 border border-[#E5DDD3]">
          <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Special Offer Banner</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="offerTitle">Offer Title</Label>
              <Input
                id="offerTitle"
                value={formData.specialOfferTitle}
                onChange={(e) => setFormData({ ...formData, specialOfferTitle: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="offerDescription">Offer Description</Label>
              <Textarea
                id="offerDescription"
                value={formData.specialOfferDescription}
                onChange={(e) => setFormData({ ...formData, specialOfferDescription: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl p-6 border border-[#E5DDD3]">
          <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Gallery Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="aspect-square bg-[#FAF7F2] rounded-lg border-2 border-dashed border-[#E5DDD3] flex flex-col items-center justify-center cursor-pointer hover:border-[#6F4E37] transition-colors"
              >
                <Image className="w-8 h-8 text-[#6F4E37]/40" />
                <span className="text-xs text-[#6F4E37]/60 mt-2">Upload Image</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 border-[#E5DDD3]">
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl p-6 border border-[#E5DDD3]">
          <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Preview</h2>
          <div className="bg-gradient-to-br from-[#6F4E37] to-[#4E342E] rounded-xl p-6 text-white">
            <h3 className="text-2xl font-display font-bold">{formData.heroTitle}</h3>
            <p className="text-white/80 mt-1">{formData.heroSubtitle}</p>
          </div>
          <div className="bg-gradient-to-r from-[#C49A6C] to-[#D4A574] rounded-xl p-5 mt-4">
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">Special Offer</span>
            <h4 className="text-lg font-bold text-white mt-1">{formData.specialOfferTitle}</h4>
            <p className="text-sm text-white/80 mt-1">{formData.specialOfferDescription}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
