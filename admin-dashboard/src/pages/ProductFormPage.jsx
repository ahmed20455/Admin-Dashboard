import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // This gets the :id param from URL
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing product if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEdit) return;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Failed to fetch product:', error.message);
        setError('Could not load product data.');
        return;
      }
      setFormData(data);
    };

    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { name, price, stock } = formData;
    if (!name || !price || !stock || isNaN(price) || isNaN(stock)) {
      setError('Please fill in all required fields with valid numbers.');
      setSubmitting(false);
      return;
    }

    try {
      if (isEdit) {
        await supabase.from('products').update(formData).eq('id', id);
        console.log('Product updated!');
      } else {
        await supabase.from('products').insert([formData]);
        console.log('Product added!');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Submission error:', err.message);
      setError('Failed to submit the form.');
    } finally {
      setSubmitting(false);
    }
  };

  // ...existing code...
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #38e8ff 0%, #4f8cff 100%)',
        animation: 'gradientMove 8s ease-in-out infinite alternate',
      }}
    >
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .glass-form {
            background: rgba(255,255,255,0.18);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
            backdrop-filter: blur(8px);
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.18);
            transition: box-shadow 0.3s;
          }
          .glass-form:hover {
            box-shadow: 0 16px 48px 0 rgba(31, 38, 135, 0.37);
          }
          .input-focus:focus {
            border-color: #38e8ff;
            box-shadow: 0 0 0 2px #38e8ff33;
          }
          .form-btn {
            background: linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%);
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(79,140,255,0.15);
          }
          .form-btn:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 4px 16px rgba(79,140,255,0.25);
            background: linear-gradient(90deg, #38e8ff 0%, #4f8cff 100%);
          }
        `}
      </style>
      <div className="glass-form p-8 w-full max-w-md flex flex-col items-center mx-2">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-wide mb-6">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 px-2 py-1 rounded bg-red-50 border border-red-200 w-full text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {['name', 'description', 'price', 'category', 'stock'].map(field => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-2 text-gray-700 capitalize">
                {field}
              </label>
              <input
                type={['price', 'stock'].includes(field) ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="input-focus w-full border border-gray-300 p-3 rounded-lg bg-white bg-opacity-80 text-gray-900 transition"
                required={['name', 'price', 'stock'].includes(field)}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="form-btn w-full text-white font-bold py-3 rounded-lg text-lg shadow-lg"
          >
            {submitting ? 'Submitting...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductFormPage;
