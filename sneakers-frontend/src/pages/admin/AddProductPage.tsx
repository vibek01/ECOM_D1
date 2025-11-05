import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../../components/admin/ProductForm';
import apiPrivate from '../../api/axios';

export const AddProductPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIX: The handler now correctly accepts only one argument: the FormData object.
  const handleCreateProduct = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiPrivate.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while creating the product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Product</h1>
      <p className="mt-1 text-slate-600">Fill in the details below to add a new sneaker to the store.</p>
      
      {error && (
        <div className="my-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm">
        <ProductForm onSubmit={handleCreateProduct} isLoading={isLoading} submitButtonText="Create Product" />
      </div>
    </div>
  );
};