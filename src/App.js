import React, { useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = React.useState([]); 
  useEffect(() => { 
    fetch('http://localhost:5082')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-lg p-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Todo List</h1>
        
        {data.length > 0 ? (
          <ul className="space-y-4">
            {data.map((item, index) => (
              <li key={index} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">{item.description}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                      item.completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {item.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">Loading todos...</p>
        )}
      </div>
    </div>
  );
}

export default App;
