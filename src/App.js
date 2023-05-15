import "./App.css";


import React, { useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [histogramData, setHistogramData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();
    const words = text.split(/\s+/);
    const frequency = {};
    words.forEach(word => {
      if (word in frequency) {
        frequency[word] += 1;
      } else {
        frequency[word] = 1;
      }
    });
    const data = Object.entries(frequency).map(([word, count]) => ({
      word,
      count
    }));
    const sortedData = data.sort((a, b) => b.count - a.count).slice(0, 20);
    setHistogramData(sortedData);
    setLoading(false);
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + histogramData.map(item => item.word + "," + item.count).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "histogram_data.csv");
    document.body.appendChild(link);
    link.click();
  }

  const handleBack = () => {
    setHistogramData([]);
  }

  return (
    <div className="App">
      {!loading && histogramData.length === 0 && (
        <div className="flex justify-center pt-10 my-10 text-5xl">
          <button className="bg-red-400 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-lg place-items-center animate-bounce"  onClick={fetchData}>Submit</button>
        </div>
      )}
      {loading && (
        <div className="center">
          <p>Loading...</p>
        </div>
      )}
      {histogramData.length > 0 && (
        <div className="p-4 bg-yellow-200">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <div  className="center flex justify-center py-4">
            <button className="bg-zinc-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2" onClick={downloadCSV}>Export</button>
            <button className="bg-zinc-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleBack}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
