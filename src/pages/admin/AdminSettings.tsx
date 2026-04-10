import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { storeSettings, updateStoreSettings } = useAdminStore();
  const [formData, setFormData] = useState(storeSettings);

  const handleSave = () => {
    updateStoreSettings(formData);
    toast.success('Settings saved successfully!');
  };

  const updateOpeningHours = (index: number, field: 'day' | 'hours', value: string) => {
    const newHours = [...formData.openingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setFormData({ ...formData, openingHours: newHours });
  };

  const addOpeningHours = () => {
    setFormData({
      ...formData,
      openingHours: [...formData.openingHours, { day: '', hours: '' }],
    });
  };

  const removeOpeningHours = (index: number) => {
    setFormData({
      ...formData,
      openingHours: formData.openingHours.filter((_, i) => i !== index),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Settings</h1>
            <p className="text-[#6F4E37]/70">Manage store information</p>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-[#6F4E37] hover:bg-[#4E342E] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Store Profile */}
        <div className="bg-white rounded-xl p-6 border border-[#E5DDD3]">
          <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Store Profile</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 border border-[#E5DDD3]">
          <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-xl p-6 border border-[#E5DDD3]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2E2E2E]">Opening Hours</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addOpeningHours}
              className="border-[#E5DDD3]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {formData.openingHours.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  value={item.day}
                  onChange={(e) => updateOpeningHours(index, 'day', e.target.value)}
                  placeholder="Day(s)"
                  className="flex-1"
                />
                <Input
                  value={item.hours}
                  onChange={(e) => updateOpeningHours(index, 'hours', e.target.value)}
                  placeholder="Hours"
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeOpeningHours(index)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl p-6 border border-[#E5DDD3]">
          <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Store Card Preview</h2>
          <div className="bg-[#FAF7F2] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#6F4E37] rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">☕</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-[#2E2E2E]">{formData.storeName}</h3>
                <p className="text-sm text-[#6F4E37]/70">{formData.address}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6F4E37]/70">Phone</span>
                <span className="text-[#2E2E2E]">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F4E37]/70">Email</span>
                <span className="text-[#2E2E2E]">{formData.email}</span>
              </div>
              <div className="pt-2 border-t border-[#E5DDD3] mt-2">
                <span className="text-[#6F4E37]/70 block mb-1">Opening Hours</span>
                {formData.openingHours.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-[#2E2E2E]">{item.day}</span>
                    <span className="text-[#6F4E37]">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
