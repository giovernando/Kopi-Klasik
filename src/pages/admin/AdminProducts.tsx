import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminStore } from '@/stores/adminStore';
import { Product, ProductCategory } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const categoryLabels: Record<ProductCategory, string> = {
  coffee: 'Coffee',
  tea: 'Tea',
  pastry: 'Pastry',
  sandwich: 'Food',
  dessert: 'Dessert',
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee' as ProductCategory,
    isAvailable: true,
    image: '/menu/default.jpg',
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'coffee',
      isAvailable: true,
      image: '/menu/default.jpg',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      isAvailable: product.isAvailable,
      image: product.image,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const productData: Product = {
      id: editingProduct?.id || `product-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price) || 0,
      category: formData.category,
      isAvailable: formData.isAvailable,
      image: formData.image,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Products</h1>
            <p className="text-[#6F4E37]/70">Manage your menu items</p>
          </div>
          <Button 
            onClick={openAddDialog}
            className="bg-[#6F4E37] hover:bg-[#4E342E] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F4E37]/50" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[#E5DDD3]"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAF7F2]">
                <TableHead className="text-[#6F4E37]">Product</TableHead>
                <TableHead className="text-[#6F4E37]">Category</TableHead>
                <TableHead className="text-[#6F4E37]">Price</TableHead>
                <TableHead className="text-[#6F4E37]">Status</TableHead>
                <TableHead className="text-[#6F4E37]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-[#FAF7F2]/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#FAF7F2] rounded-lg flex items-center justify-center text-2xl">
                        ☕
                      </div>
                      <div>
                        <p className="font-medium text-[#2E2E2E]">{product.name}</p>
                        <p className="text-sm text-[#6F4E37]/60 truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-[#C49A6C] text-[#6F4E37]">
                      {categoryLabels[product.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-[#2E2E2E]">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell>
                    <Badge className={product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {product.isAvailable ? 'Available' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="text-[#6F4E37] hover:bg-[#6F4E37]/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteConfirm(product.id)}
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
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="price">Price (IDR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: ProductCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="tea">Tea</SelectItem>
                    <SelectItem value="pastry">Pastry</SelectItem>
                    <SelectItem value="sandwich">Food</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Available</Label>
                <Switch
                  id="available"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-[#6F4E37] hover:bg-[#4E342E] text-white"
              >
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Product?</DialogTitle>
            </DialogHeader>
            <p className="text-[#6F4E37]/70">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
