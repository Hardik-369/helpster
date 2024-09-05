import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import HelperList from './components/helperlists'
import HelperForm from './components/helperform'
import { Moon, Sun } from 'lucide-react' // Import Moon and Sun icons

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [helpers, setHelpers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchHelpers();
    fetchCategories();
  }, []);

  async function fetchHelpers() {
    setIsLoading(true);
    let query = supabase.from('helpers').select('*')
    if (selectedCategory) {
      query = query.eq('category', selectedCategory)
    }
    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
    }
    const { data, error } = await query
    if (error) {
      console.error('Error fetching helpers:', error);
      alert('Failed to fetch helpers. Please try again.');
    } else {
      setHelpers(data);
    }
    setIsLoading(false);
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('name');
    if (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories. Please try again.');
    } else {
      setCategories(data.map(c => c.name));
    }
  }

  useEffect(() => {
    fetchHelpers();
  }, [selectedCategory, searchTerm]);

  const handleNewHelper = (newHelper) => {
    setHelpers(prevHelpers => [...prevHelpers, newHelper]);
    setShowForm(false);
    fetchCategories(); // Refresh categories in case a new one was added
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Helpster</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Become a Helper
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/2">
                <label htmlFor="search-input" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Search by Name
                </label>
                <input
                  type="text"
                  id="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter name..."
                  className={`block w-full pl-3 pr-10 py-2 text-base ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                />
              </div>
              <div className="w-full md:w-1/2">
                <label htmlFor="category-select" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Select Category
                </label>
                <div className="relative">
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`block w-full pl-3 pr-10 py-2 text-base ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-500'}`}></div>
              </div>
            ) : (
              <HelperList helpers={helpers} darkMode={darkMode} />
            )}
          </div>
        </div>
      </main>
      {showForm && (
        <HelperForm 
          onClose={() => setShowForm(false)} 
          onSubmit={(newHelper) => {
            handleNewHelper(newHelper);
            fetchHelpers();
          }} 
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default App