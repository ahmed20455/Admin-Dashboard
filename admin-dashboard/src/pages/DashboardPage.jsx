import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleDelete = async (id) => {
        setDeletingId(id);
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) {
            setDeletingId(null);
            return;
        }
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            setError('Error deleting product: ' + error.message);
        } else {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
        setDeletingId(null);
    };

    // Filtered products
    const filteredProducts = products.filter(p =>
    (p.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (p.category?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
);


    return (
        <div className="h-screen w-screen bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 text-white flex flex-col items-center px-4">
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
                    width: 100%;
                    max-width: 1200px;
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

            {/* NavBar */}
            <nav className="w-full max-w-5xl mt-6 mb-4 px-4 py-3 rounded-xl bg-white/30 backdrop-blur-md shadow flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-2xl font-bold text-indigo-900 tracking-tight">Admin Dashboard</span>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-indigo-700 hover:text-indigo-900 font-semibold px-3 py-1 rounded transition"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/add-product')}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold px-3 py-1 rounded transition"
                    >
                        Add Product
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-emerald-600 text-blue-200 py-2 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                    Logout
                </button>
            </nav>

            <div className="glass-panel p-6 w-full overflow-x-auto">
                <h1 className="text-3xl font-bold mb-2 text-center text-white">📦 Product Dashboard</h1>
                <p className="text-sm text-white/80 mb-4 text-center">Manage your products efficiently and easily.</p>

                {/* Search Bar */}
<div className="w-full flex justify-center mb-4">
    <input
        type="text"
        placeholder="Search by name or category..."
        className="w-full md:w-1/2 p-2 rounded shadow border text-black"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
</div>


{loading && (
    <div className="flex justify-center items-center mt-6 min-h-[200px]">
        <svg className="animate-spin h-6 w-6 text-white mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span>Loading products...</span>
    </div>
)}


                {error && (
                    <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded mt-4 text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && filteredProducts.length === 0 && (
                    <p className="text-blue-200/80 mt-4 text-center">No matching products found.</p>
                )}

                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="overflow-auto">
                        <table className="min-w-[600px]">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((prod) => (
                                    <tr key={prod.id}>
                                        <td>{prod.name}</td>
                                        <td>{prod.category}</td>
                                        <td>₹{prod.price}</td>
                                        <td>{prod.stock}</td>
                                        <td className="flex gap-2 flex-wrap mt-1 mb-1">
                                            <button
                                                onClick={() => navigate(`/products/edit/${prod.id}`)}
                                                className="bg-blue-600 text-blue-200 px-4 py-1 rounded hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(prod.id)}
                                                disabled={deletingId === prod.id}
                                                className={`bg-red-600 text-blue-200 px-4 py-1 rounded hover:bg-red-700 flex items-center ${deletingId === prod.id ? 'opacity-60' : ''}`}
                                            >
                                                {deletingId === prod.id && (
                                                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                )}
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <p className="mt-6 text-xs text-center text-white/70">
                    &copy; {new Date().getFullYear()} Admin Dashboard By Faheem
                </p>
            </div>
        </div>
    );
};

export default DashboardPage;
