import React from 'react';
import { Twitter, Instagram, Linkedin } from "lucide-react";

function HelperList({ helpers, darkMode }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {helpers.map((helper) => (
        <div 
          key={helper.id} 
          className={`flex flex-col transition-all duration-300 ease-in-out transform hover:shadow-xl hover:-translate-y-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg overflow-hidden border`}
        >
          <div className="text-center p-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
              <span className="text-3xl font-bold text-white">{`${helper.first_name[0]}${helper.last_name[0]}`}</span>
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>{`${helper.first_name} ${helper.last_name}`}</h2>
            <div className="mb-4">
              <span className={`px-4 py-1.5 text-xs font-semibold ${darkMode ? 'text-indigo-300 bg-indigo-900' : 'text-indigo-800 bg-indigo-100'} rounded-full uppercase tracking-wide shadow-sm inline-block`}>
                {helper.category}
              </span>
            </div>
          </div>
          <div className="flex-grow text-center px-6 pb-6">
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{helper.description}</p>
          </div>
          <div className={`flex justify-center space-x-4 pt-4 pb-6 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t`}>
            {Object.entries(helper.social_media)
              .filter(([platform, link]) => link && link.trim() !== '')
              .map(([platform, link]) => (
                <a 
                  key={platform} 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors duration-300`}
                >
                  {platform === 'twitter' && <Twitter className="h-5 w-5 text-blue-400" />}
                  {platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-500" />}
                  {platform === 'linkedin' && <Linkedin className="h-5 w-5 text-blue-700" />}
                  <span className="sr-only">{`${platform} profile of ${helper.first_name} ${helper.last_name}`}</span>
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HelperList;