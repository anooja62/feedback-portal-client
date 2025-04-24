import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedback, submitReply } from "../redux/feedbackSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [filterRating, setFilterRating] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [replies, setReplies] = useState({});
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // Access feedback data from Redux store
  const { feedbackList, loading, error } = useSelector(
    (state) => state.feedback
  );

  const dispatch = useDispatch();

  // Fetch feedback data when the component mounts
  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...feedbackList];
    if (filterRating) {
      filtered = filtered.filter((f) => f.rating === Number(filterRating));
    }
    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );
    setFilteredFeedback(filtered);
  }, [feedbackList, filterRating, sortOrder]);
  const handleReplyChange = (feedbackId, reply) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [feedbackId]: reply,
    }));
  };
  const handleSubmitReply = (feedbackId) => {
    const reply = replies[feedbackId];
    if (reply.trim()) {
      // Dispatch the submitReply action to save the reply
      dispatch(submitReply({ feedbackId, replyText: reply }));

      // Optionally, clear the reply input
      setReplies((prevReplies) => ({
        ...prevReplies,
        [feedbackId]: "",
      }));
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Admin Dashboard
      </h1>

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
              <option key={r} value={r}>
                {r} Star
              </option>
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
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
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
              {filteredFeedback.map((item) => (
                <tr key={item._id} className="text-center border-t">
                  <td className="py-2 px-4 border">{item.user?.email}</td>
                  <td className="py-2 px-4 border">{item.rating} ★</td>
                  <td className="py-2 px-4 border">{item.text}</td>
                  <td className="py-2 px-4 border">
                    {new Date(item.created_at).toLocaleDateString("en-GB")}
                  </td>

                  <td className="py-2 px-4 border">
                    <textarea
                      value={replies[item._id] || ""}
                      onChange={(e) =>
                        handleReplyChange(item._id, e.target.value)
                      }
                      placeholder="Write a reply..."
                      className="w-full p-1 border rounded"
                    />
                    <button
                      onClick={() => handleSubmitReply(item._id)}
                      className="bg-blue-500 text-white py-1 px-3 mt-2 rounded"
                    >
                      Submit Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
