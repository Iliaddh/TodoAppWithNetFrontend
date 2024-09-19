import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('https://todoappdotnetbackend-bmfvekerfhghdfhw.canadacentral-01.azurewebsites.net/')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const todoItem = {
      title,
      description,
      isCompleted,
    };

    if (isEditing) {
      fetch(`https://todoappdotnetbackend-bmfvekerfhghdfhw.canadacentral-01.azurewebsites.net/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoItem),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Updated:', data);
          fetchTodos();
          setIsEditing(false);
          setEditId(null);
        })
        .catch((error) => {
          console.log('Error updating todo:', error);
        });
    } else {
      fetch('https://todoappdotnetbackend-bmfvekerfhghdfhw.canadacentral-01.azurewebsites.net/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoItem),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          fetchTodos();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    setTitle('');
    setDescription('');
    setIsCompleted(false);
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setIsCompleted(todo.isCompleted);
    setIsEditing(true);
    setEditId(todo.id);
  };

  const handleDelete = (id) => {
    fetch(`https://todoappdotnetbackend-bmfvekerfhghdfhw.canadacentral-01.azurewebsites.net/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('Todo deleted successfully');
          fetchTodos();
        } else {
          console.error('Error deleting todo');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center p-4">
      <div className="w-full lg:w-1/2 p-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Todo List</h1>

        {data.length > 0 ? (
          <ul className="space-y-4">
            {data.map((item, index) => (
              <li
                key={index}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500"
              >
                <div className="flex flex-col md:flex-row md:justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold text-gray-700">{item.title}</h3>
                    <span className="text-lg font-medium text-gray-600">{item.description}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        item.isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-300 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center font-bold">No todos!</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/3 mt-6 lg:mt-0"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {isEditing ? 'Edit Todo' : 'Add New Todo'}
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-6 flex items-center">
          <input
            id="isCompleted"
            type="checkbox"
            className="mr-2 leading-tight"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          <label className="text-gray-700 text-sm" htmlFor="isCompleted">
            Mark as Completed
          </label>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out"
          >
            {isEditing ? 'Update Todo' : 'Add Todo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
