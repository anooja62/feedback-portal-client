import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeedback,
  submitReply,
  fetchReplySuggestions,
} from "../redux/feedbackSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
const AdminDashboard = () => {
  const [filterRating, setFilterRating] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [replies, setReplies] = useState({});
  const [suggestionLoadingId, setSuggestionLoadingId] = useState(null); // NEW
  const navigate = useNavigate();

  const { feedbackList, error, suggestions } = useSelector(
    (state) => state.feedback
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...feedbackList];

    if (filterRating) {
      filtered = filtered.filter((f) => f.rating === Number(filterRating));
    }

    // Ensure the date is correctly compared
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at); // Make sure created_at is in Date format
      const dateB = new Date(b.created_at);

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredFeedback(filtered);
  }, [feedbackList, filterRating, sortOrder]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logout());
      navigate("/login");
    }
  };
  useEffect(() => {
    console.log("Suggestions state:", suggestions);
  }, [suggestions]);

  const handleReplyChange = (feedbackId, reply) => {
    setReplies((prev) => ({ ...prev, [feedbackId]: reply }));
  };

  const handleSubmitReply = async (feedbackId) => {
    const reply = replies[feedbackId];
    if (reply.trim()) {
      const resultAction = await dispatch(
        submitReply({ feedbackId, replyText: reply })
      );
      if (submitReply.fulfilled.match(resultAction)) {
        alert("Reply sent successfully!");
        setReplies((prev) => ({ ...prev, [feedbackId]: "" }));
      }
    }
  };
  

  const handleFetchSuggestions = async (feedbackId, text) => {
    setSuggestionLoadingId(feedbackId); // Start loading
    const resultAction = await dispatch(
      fetchReplySuggestions({ feedbackId, feedbackText: text })
    );
    setSuggestionLoadingId(null); // End loading

    if (fetchReplySuggestions.fulfilled.match(resultAction)) {
      console.log("Fetched Suggestions:", resultAction.payload);
      const firstSuggestion = resultAction.payload?.[0];
      if (firstSuggestion) {
        setReplies((prev) => ({ ...prev, [feedbackId]: firstSuggestion }));
      }
    }
  };

  const handleSuggestionClick = (feedbackId, suggestion) => {
    setReplies((prev) => ({
      ...prev,
      [feedbackId]: suggestion, // replace instead of append
    }));
  };



return (
  <div className="bg-gray-100 min-h-screen px-4 sm:px-6 py-6">
 <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
  Admin Dashboard
</h1>

<button
  onClick={handleLogout}
  className="fixed bottom-4 right-4 sm:top-4 sm:bottom-auto flex items-center gap-1 bg-red-700 text-white text-sm sm:text-base py-1 px-2 sm:py-2 sm:px-4 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition duration-300 ease-in-out"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v1"
    />
  </svg>
  Logout
</button>

    {/* Filter and Sort Controls */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <label className="block font-medium mb-1 sm:mb-0 sm:inline sm:mr-2">
          Filter by Rating:
        </label>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded px-3 py-1"
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
        <label className="block font-medium mb-1 sm:mb-0 sm:inline sm:mr-2">
          Sort by Date:
        </label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded px-3 py-1"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>

    {/* Feedback Table */}
    <div className="overflow-x-auto mb-10">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg text-sm sm:text-base">
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
              <tr key={item._id} className="border-t text-center">
                <td className="py-2 px-4 border break-words">
                  {item.user?.email}
                </td>
                <td className="py-2 px-4 border">{item.rating} ★</td>
                <td className="py-2 px-4 border break-words">{item.text}</td>
                <td className="py-2 px-4 border">
                  {new Date(item.created_at).toLocaleDateString("en-GB")}
                </td>
                <td className="py-2 px-4 border text-left min-w-[250px]">
                  <textarea
                    value={replies[item._id] || ""}
                    onChange={(e) =>
                      handleReplyChange(item._id, e.target.value)
                    }
                    placeholder="Write a reply..."
                    className="w-full p-1 border rounded mb-2 placeholder-gray-400 text-sm"
                  />
                  {Array.isArray(suggestions?.[item._id]) &&
                    suggestions[item._id].length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {suggestions[item._id].map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              handleSuggestionClick(item._id, suggestion)
                            }
                            className="bg-gray-200 hover:bg-gray-300 text-xs sm:text-sm px-3 py-1 rounded-full transition"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <button
                      onClick={() => handleSubmitReply(item._id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                    >
                      Submit Reply
                    </button>
                    <button
                      onClick={() =>
                        handleFetchSuggestions(item._id, item.text)
                      }
                      className="bg-gray-300 hover:bg-gray-400 text-sm px-2 py-1 rounded"
                    >
                      {suggestionLoadingId === item._id
                        ? "Loading..."
                        : "Suggest Replies"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

 

    
  </div>
);

};

export default AdminDashboard;
