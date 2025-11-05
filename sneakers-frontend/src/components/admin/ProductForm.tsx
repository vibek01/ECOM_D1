import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Spinner } from '../common/Spinner';
import { PlusCircle, Trash2 } from 'lucide-react';

// Zod schema for validation
const VariantSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  stock: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().min(0, 'Stock cannot be negative')),
});

export const ProductFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  brand: z.string().min(2, 'Brand is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().min(0, 'Price must be positive')),
  image: z.any().optional(), // We'll handle file validation separately
  variants: z.array(VariantSchema).min(1, 'At least one variant is required'),
});

export type TProductFormSchema = z.infer<typeof ProductFormSchema>;

interface ProductFormProps {
  onSubmit: (data: TProductFormSchema, formData: FormData) => void;
  initialData?: TProductFormSchema;
  isLoading: boolean;
  submitButtonText?: string;
}

export const ProductForm = ({
  onSubmit,
  initialData,
  isLoading,
  submitButtonText = 'Create Product',
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TProductFormSchema>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: initialData || {
      variants: [{ size: '', color: '', stock: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const handleFormSubmit = (data: TProductFormSchema) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('variants', JSON.stringify(data.variants));
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }
    onSubmit(data, formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Main Product Details */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <Input id="name" {...register('name')} className="mt-1" />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
            <Input id="brand" {...register('brand')} className="mt-1" />
            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <Input id="price" type="number" step="0.01" {...register('price')} className="mt-1" />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="mt-1 flex w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
          <Input id="image" type="file" {...register('image')} className="mt-1" />
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
        </div>
      </div>

      {/* Variants Section */}
      <div>
        <h3 className="text-lg font-medium">Variants</h3>
        {errors.variants?.root && <p className="mt-1 text-sm text-red-600">{errors.variants.root.message}</p>}
        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4 rounded-md border p-4">
              <div className="grid flex-1 grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium">Size</label>
                  <Input {...register(`variants.${index}.size`)} />
                  {errors.variants?.[index]?.size && <p className="text-xs text-red-600">{errors.variants[index].size.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium">Color</label>
                  <Input {...register(`variants.${index}.color`)} />
                  {errors.variants?.[index]?.color && <p className="text-xs text-red-600">{errors.variants[index].color.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium">Stock</label>
                  <Input type="number" {...register(`variants.${index}.stock`)} />
                  {errors.variants?.[index]?.stock && <p className="text-xs text-red-600">{errors.variants[index].stock.message}</p>}
                </div>
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="mt-5">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ size: '', color: '', stock: 0 })}
          className="mt-4"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" color="light" /> : submitButtonText}
        </Button>
      </div>
    </form>
  );
};