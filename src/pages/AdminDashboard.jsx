import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const mockFeedbackData = [
  {
    id: 1,
    user: 'john@example.com',
    rating: 4,
    text: 'Great service!',
    date: '2025-04-20',
    image: null,
  },
  {
    id: 2,
    user: 'sara@example.com',
    rating: 2,
    text: 'Could be better.',
    date: '2025-04-21',
    image: null,
  },
];

const AdminDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filterRating, setFilterRating] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetch and apply filter/sort
    let filtered = [...mockFeedbackData];
    if (filterRating) {
      filtered = filtered.filter((f) => f.rating === Number(filterRating));
    }
    filtered.sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );
    setFeedbackList(filtered);
  }, [filterRating, sortOrder]);

  // Handle logout
  const handleLogout = () => {
    // Clear user data from localStorage (assuming JWT stored there)
    localStorage.removeItem('authToken'); // Or however you're storing JWT

    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 font-medium">Filter by Rating:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="">All</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} Star</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Sort by Date:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Rating</th>
              <th className="py-2 px-4 border">Feedback</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Reply</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((item) => (
              <tr key={item.id} className="text-center border-t">
                <td className="py-2 px-4 border">{item.user}</td>
                <td className="py-2 px-4 border">{item.rating} ★</td>
                <td className="py-2 px-4 border">{item.text}</td>
                <td className="py-2 px-4 border">{item.date}</td>
                <td className="py-2 px-4 border">
                  <textarea
                    placeholder="Write a reply..."
                    className="w-full p-1 border rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logout Button */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
