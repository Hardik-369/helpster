import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function HelperForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    description: '',
    category: '',
    social_media: {
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  });
  const [categories, setCategories] = useState([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase.from('categories').select('name');
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data.map(c => c.name));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' && value === 'new') {
      setIsNewCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else if (name.startsWith('social_media.')) {
      const platform = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        social_media: { ...prev.social_media, [platform]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === 'category') setIsNewCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isNewCategory) {
        const { error } = await supabase.from('categories').insert({ name: formData.category });
        if (error) throw error;
      }

      const { data, error } = await supabase.from('helpers').insert([formData]).select();
      if (error) throw error;

      console.log('Helper added successfully:', data);
      if (data && data.length > 0) {
        onSubmit(data[0]);
      } else {
        // If no data is returned, pass the formData as a fallback
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error inserting helper:', error);
      alert('An error occurred while adding the helper. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Become a Helper</h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Write How Can You Help the People"
              value={formData.description}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <select
              name="category"
              value={isNewCategory ? 'new' : formData.category}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new">Add new category</option>
            </select>
            {isNewCategory && (
              <input
                type="text"
                name="category"
                placeholder="New Category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 p-2 w-full border rounded"
                required
              />
            )}
            <input
              type="text"
              name="social_media.instagram"
              placeholder="Instagram"
              value={formData.social_media.instagram}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
            />
            <input
              type="text"
              name="social_media.twitter"
              placeholder="Twitter"
              value={formData.social_media.twitter}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
            />
            <input
              type="text"
              name="social_media.linkedin"
              placeholder="LinkedIn"
              value={formData.social_media.linkedin}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
            />
            <div className="items-center px-4 py-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Submit
              </button>
            </div>
          </form>
          <button
            onClick={onClose}
            className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelperForm