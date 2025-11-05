import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../../components/admin/ProductForm';
import apiPrivate from '../../api/axios';
import type { Product } from '../../types';
import { Spinner } from '../../components/common/Spinner';

export const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      // FIX: Add a guard clause to ensure 'id' is defined before fetching.
      // This prevents sending "undefined" to the backend.
      if (!id) {
        setIsFetching(false);
        setError('Product ID is missing.');
        return;
      }
      try {
        const response = await apiPrivate.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        setError('Failed to fetch product data.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiPrivate.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while updating the product.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  if (error && !product) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Product</h1>
      <p className="mt-1 text-slate-600">Update the details for "{product?.name}".</p>

      {error && (
        <div className="my-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm">
        {product && (
          <ProductForm
            onSubmit={handleUpdateProduct}
            isLoading={isLoading}
            initialData={product}
            submitButtonText="Update Product"
          />
        )}
      </div>
    </div>
  );
};