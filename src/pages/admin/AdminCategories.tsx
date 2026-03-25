import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { categories } from '@/data/products';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/stores/adminStore';

export default function AdminCategories() {
  const { products } = useAdminStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof categories[0] | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
  });

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter(p => p.category === categoryId).length;
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: typeof categories[0]) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Categories</h1>
            <p className="text-[#6F4E37]/70">Manage product categories</p>
          </div>
          <Button 
            onClick={openAddDialog}
            className="bg-[#6F4E37] hover:bg-[#4E342E] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAF7F2]">
                <TableHead className="text-[#6F4E37]">Icon</TableHead>
                <TableHead className="text-[#6F4E37]">Name</TableHead>
                <TableHead className="text-[#6F4E37]">ID</TableHead>
                <TableHead className="text-[#6F4E37]">Products</TableHead>
                <TableHead className="text-[#6F4E37]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-[#FAF7F2]/50">
                  <TableCell>
                    <div className="w-10 h-10 bg-[#FAF7F2] rounded-lg flex items-center justify-center text-xl">
                      {category.icon}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-[#2E2E2E]">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-[#6F4E37]/70">
                    {category.id}
                  </TableCell>
                  <TableCell className="text-[#2E2E2E]">
                    {getCategoryProductCount(category.id)} products
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(category)}
                        className="text-[#6F4E37] hover:bg-[#6F4E37]/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="mt-1"
                  placeholder="☕"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => setIsDialogOpen(false)}
                className="bg-[#6F4E37] hover:bg-[#4E342E] text-white"
              >
                {editingCategory ? 'Save Changes' : 'Add Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
