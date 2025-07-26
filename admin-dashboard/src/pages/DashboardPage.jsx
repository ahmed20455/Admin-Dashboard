import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/login');
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate('/login');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 text-white flex items-center justify-center">
      <style>
        {`
          .glass-panel {
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            margin: 2rem auto;
            width: 90%; /* Use percentage width for responsiveness */
            max-width: 1200px; /* Set a max width for larger screens */
          }

          table {
            width: 100%;
            margin-top: 1rem;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
          }

          th, td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e2e8f0;
            text-align: left;
            color: #1f2937;
          }

          th {
            background-color: #1e293b;
            color: white;
          }

          tbody tr:nth-child(even) {
            background-color: #f8fafc;
          }

          tbody tr:hover {
            background-color: #e2e8f0;
          }
        `}
      </style>

      <div className="glass-panel p-6 mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">📦 Product Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-emerald-600 text-black py-2 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Logout
          </button>
           <button onClick={() =>
             navigate('/add-product')} className="bg-emerald-600 text-black py-2 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition">
        Add New Product
      </button>
        </div>

        {loading && <p className="text-white mt-4">Loading products...</p>}
        {error && <p className="text-red-200 mt-4">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-white mt-4">No products found.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="overflow-auto mt-4">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td>{prod.name}</td>
                    <td>{prod.category}</td>
                    <td>₹{prod.price}</td>
                    <td>{prod.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-8 text-xs text-white/70 text-center">
          &copy; {new Date().getFullYear()} Faheem Admin Dashboard
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
