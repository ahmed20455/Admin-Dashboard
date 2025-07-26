import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProductFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price)) newErrors.price = 'Price must be a number';

    if (!formData.stock) newErrors.stock = 'Stock is required';
    else if (isNaN(formData.stock)) newErrors.stock = 'Stock must be a number';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error as the user types
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
      }]);

      if (error) throw error;

      console.log('Product added!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to add product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-500 to-indigo-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md w-full max-w-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Add Product</h2>

        {submitError && <p className="text-red-600 text-sm text-center">{submitError}</p>}

        {/* Name */}
        <div>
          <label className="block font-semibold text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold text-gray-700">Price (₹) *</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block font-semibold text-gray-700">Stock *</label>
          <input
            type="text"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
          {errors.stock && <p className="text-red-600 text-sm">{errors.stock}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-black font-bold py-2 px-4 rounded transition"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ProductFormPage;
