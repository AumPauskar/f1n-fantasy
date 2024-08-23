import React, { useState, useEffect } from 'react';

const PredictionForm = () => {
  const [predictions, setPredictions] = useState({
    first: '',
    second: '',
    third: '',
    fourth: '',
    fifth: '',
    sixth: '',
    seventh: '',
    eighth: '',
    ninth: '',
    tenth: '',
  });

  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPredictions((prevPredictions) => ({
      ...prevPredictions,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      predictions: Object.values(predictions).map(Number),
    };

    try {
      const response = await fetch(`http://localhost:5000/api/v1/userpredictions/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Predictions updated');
      } else {
        alert('Failed to update predictions');
      }
    } catch (error) {
      alert('Error occurred while updating predictions');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i}>
          <label htmlFor={`field${i + 1}`} className="block text-sm font-medium text-gray-700">
            {`${i + 1}th`}
          </label>
          <input
            type="number"
            id={`field${i + 1}`}
            name={Object.keys(predictions)[i]}
            value={predictions[Object.keys(predictions)[i]]}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default PredictionForm;
