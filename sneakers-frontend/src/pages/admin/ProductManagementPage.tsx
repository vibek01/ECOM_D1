import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';
import apiPrivate from '../../api/axios';
import type { Product } from '../../types';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Modal } from '../../components/common/Modal';

export const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Note: For simplicity, this admin page fetches all products without pagination.
  // For a large number of products, pagination could be added here as well.
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // We pass a high limit to fetch all products for the admin view.
      // A more advanced implementation could add pagination to this page too.
      const response = await apiPrivate.get('/products?limit=1000');
      
      // --- FIX: The API now returns an object { products, pagination }. ---
      // We need to access the .products property from the response data.
      setProducts(response.data.data.products);
      // --- END FIX ---

    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsModalOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await apiPrivate.delete(`/products/${productToDelete.id}`);
      fetchProducts(); // Re-fetch the list to show the updated state
    } catch (err) {
      setError('Failed to delete product.');
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
        </div>
      </Modal>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Management</h1>
            <p className="mt-1 text-slate-600">Add, edit, or delete products from your store.</p>
          </div>
          <Link to="/admin/products/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="mt-8 flow-root">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Brand</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.brand}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteModal(product)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};