import React from 'react';

const PerformanceChart = ({ scores, subject }) => {
  const maxScore = Math.max(...scores, 100);
  const minScore = Math.min(...scores, 0);
  const range = maxScore - minScore;

  const getBarHeight = (score) => {
    return ((score - minScore) / range) * 100;
  };

  const getBarColor = (score) => {
    if (score >= 90) return '#28a745';
    if (score >= 80) return '#ffc107';
    if (score >= 70) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <div className="chart-container">
      <div className="performance-chart">
        <div className="chart-bars">
          {scores.map((score, index) => (
            <div key={index} className="bar-container">
              <div className="bar-wrapper">
                <div
                  className="performance-bar"
                  style={{
                    height: `${getBarHeight(score)}%`,
                    backgroundColor: getBarColor(score)
                  }}
                  title={`Test ${index + 1}: ${score}%`}
                ></div>
              </div>
              <div className="bar-label">T{index + 1}</div>
              <div className="bar-score">{score}%</div>
            </div>
          ))}
        </div>
        
        <div className="chart-line">
          {scores.map((score, index) => (
            <div key={index} className="line-point" style={{
              left: `${(index / (scores.length - 1)) * 100}%`,
              bottom: `${getBarHeight(score)}%`,
              backgroundColor: getBarColor(score)
            }}></div>
          ))}
        </div>
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
          <span>90-100% (A)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffc107' }}></div>
          <span>80-89% (B)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fd7e14' }}></div>
          <span>70-79% (C)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#dc3545' }}></div>
          <span>Below 70% (D/F)</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
