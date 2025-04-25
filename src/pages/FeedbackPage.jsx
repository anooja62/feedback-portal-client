import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitFeedback } from "../redux/feedbackSlice";
import { logout } from "../redux/authSlice"; 
import { useNavigate } from "react-router-dom"; 

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { loading, error, success } = useSelector((state) => state.feedback);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", feedback);
    formData.append("rating", rating);
    if (image) formData.append("image", image);

    dispatch(submitFeedback(formData));
  };

  useEffect(() => {
    if (success) {
      setFeedback("");
      setRating(0);
      setImage(null);
    }
  }, [success]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-md">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center gap-2 bg-red-700 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition duration-300 ease-in-out"
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

        <h2 className="text-2xl font-semibold text-center mb-6">
          Submit Your Feedback
        </h2>

        {/* Success and Error Messages */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="text"
              className="block mb-1 font-medium text-gray-700"
            >
              Your Feedback
            </label>
            <textarea
              id="text"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`text-2xl ${
                    rating >= val ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleRatingClick(val)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Upload Image (optional)
            </label>
            <div className="relative w-full">
              <input
                type="file"
                accept="image/*"
                className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-200 peer-hover:border-blue-500 peer-hover:text-blue-600">
                <span className="text-sm font-medium">
                  Click to upload or drag and drop
                </span>
              </div>
            </div>
            {image && (
    <p className="mt-2 text-sm text-gray-600 text-center">
      Selected file: <span className="font-medium">{image.name}</span>
    </p>
  )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={loading || rating === 0 || feedback.trim() === ""}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
