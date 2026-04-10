import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Home, 
  Briefcase, 
  MoreVertical,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAddressStore, SavedAddress } from '@/stores/addressStore';
import { useToast } from '@/hooks/use-toast';
import { haptics } from '@/utils/haptics';
import { cn } from '@/lib/utils';

const addressLabels = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'other', label: 'Other', icon: MapPin },
];

export default function ManageAddressPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    savedAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useAddressStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    label: 'home',
  });

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '', label: 'home' });
    setEditingAddress(null);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (address: SavedAddress) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      label: address.label || 'home',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    haptics.success();

    if (editingAddress) {
      updateAddress(editingAddress.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        label: formData.label,
      });
      toast({
        title: 'Address updated',
        description: 'Your address has been updated successfully',
      });
    } else {
      addAddress({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        label: formData.label,
        isDefault: savedAddresses.length === 0,
      });
      toast({
        title: 'Address added',
        description: 'Your new address has been saved',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (addressToDelete) {
      haptics.medium();
      deleteAddress(addressToDelete);
      toast({
        title: 'Address deleted',
        description: 'The address has been removed',
      });
      setAddressToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSetDefault = (id: string) => {
    haptics.selection();
    setDefaultAddress(id);
    toast({
      title: 'Default address set',
      description: 'This address is now your default delivery address',
    });
  };

  const getLabelIcon = (label?: string) => {
    const found = addressLabels.find(l => l.value === label);
    return found?.icon || MapPin;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-display font-semibold">Manage Address</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Add New Address Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleOpenAddDialog}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/30 rounded-xl text-primary font-medium hover:bg-primary/5 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </motion.button>

        {/* Address List */}
        <AnimatePresence>
          {savedAddresses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No saved addresses</h3>
              <p className="text-muted-foreground text-sm">
                Add an address for faster checkout
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {savedAddresses.map((address, index) => {
                const LabelIcon = getLabelIcon(address.label);
                
                return (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'relative bg-card border rounded-xl p-4 transition-all',
                      address.isDefault 
                        ? 'border-primary shadow-lg shadow-primary/10' 
                        : 'border-border'
                    )}
                  >
                    {/* Default Badge */}
                    {address.isDefault && (
                      <div className="absolute -top-2 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        Default
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        address.isDefault ? 'bg-primary/10' : 'bg-secondary'
                      )}>
                        <LabelIcon className={cn(
                          'h-5 w-5',
                          address.isDefault ? 'text-primary' : 'text-muted-foreground'
                        )} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground capitalize">
                            {address.label || 'Address'}
                          </span>
                        </div>
                        <p className="font-medium text-foreground text-sm mb-0.5">
                          {address.name}
                        </p>
                        <p className="text-sm text-muted-foreground mb-0.5">
                          {address.phone}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {address.address}
                        </p>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!address.isDefault && (
                            <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                              <Check className="h-4 w-4 mr-2" />
                              Set as Default
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(address)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setAddressToDelete(address.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Label Selection */}
            <div className="space-y-2">
              <Label>Label</Label>
              <div className="flex gap-2">
                {addressLabels.map((label) => {
                  const Icon = label.icon;
                  return (
                    <button
                      key={label.value}
                      onClick={() => setFormData(prev => ({ ...prev, label: label.value }))}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
                        formData.label === label.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Recipient Name *</Label>
              <Input
                id="name"
                placeholder="Enter recipient name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Input
                id="address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingAddress ? 'Update' : 'Save'} Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90%] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
