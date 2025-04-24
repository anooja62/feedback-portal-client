import React, { useState } from 'react';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('feedback', feedback);
    formData.append('rating', rating);
    if (image) formData.append('image', image);

    // TODO: Send formData to backend via Axios
    console.log('Submitting:', { feedback, rating, image });
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Submit Your Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="feedback" className="block mb-1 font-medium text-gray-700">Your Feedback</label>
            <textarea
              id="feedback"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`text-2xl ${rating >= val ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleRatingClick(val)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-600"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
