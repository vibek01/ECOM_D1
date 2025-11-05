import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { addItem } from '../../store/cartSlice';
import type { Product, ProductVariant } from '../../types';
import type { AppDispatch } from '../../store/store';
import { apiPublic } from '../../api/axios';

interface QuickAddModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal = ({ productId, isOpen, onClose }: QuickAddModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        setLoading(true);
        try {
          const response = await apiPublic.get(`/products/${productId}`);
          const fetchedProduct: Product = response.data.data;
          setProduct(fetchedProduct);
          if (fetchedProduct.variants?.length > 0) {
            setSelectedVariant(fetchedProduct.variants.find(v => v.stock > 0) || fetchedProduct.variants[0]);
          }
        } catch (error) {
          console.error("Failed to fetch product for modal", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchProductDetails();
    } else {
      // Reset state when modal closes
      setProduct(null);
      setSelectedVariant(null);
    }
  }, [productId, isOpen]);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      dispatch(addItem({
        id: selectedVariant.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: selectedVariant.size,
        color: selectedVariant.color,
        quantity: 1,
        stock: selectedVariant.stock,
      }));
      onClose(); // Close modal on successful add
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product?.name || 'Select Options'}>
      {loading && <div className="flex justify-center p-8"><Spinner /></div>}
      {!loading && product && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-100 p-4">
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col space-y-4">
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? 'primary' : 'outline'}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                  >
                    {variant.size}
                  </Button>
                ))}
              </div>
            </div>
            <Button onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
              {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};