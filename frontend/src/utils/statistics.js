/**
 * Helper utilities for statistical calculations on the frontend
 */

/**
 * Calculates the mean (average) of an array of numbers
 */
export function mean(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

/**
 * Replicates NumPy's histogram calculation
 * Returns an array of bin centers and their respective counts
 */
export function getHistogramData(values, numBins = 10) {
  if (!values || values.length === 0) return [];
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Handle edge case where all values are the same
  if (min === max) {
    return [{
      binStart: min - 0.5,
      binEnd: min + 0.5,
      center: min,
      count: values.length
    }];
  }
  
  const binWidth = (max - min) / numBins;
  const bins = Array.from({ length: numBins }, (_, i) => {
    const start = min + i * binWidth;
    const end = start + binWidth;
    const center = start + binWidth / 2;
    return {
      binStart: start,
      binEnd: end,
      center: Math.round(center * 100) / 100, // Round to 2 decimals
      count: 0
    };
  });
  
  for (const val of values) {
    let placed = false;
    for (let i = 0; i < numBins; i++) {
      const isLastBin = i === numBins - 1;
      const start = bins[i].binStart;
      const end = bins[i].binEnd;
      
      if (val >= start && (isLastBin ? val <= end : val < end)) {
        bins[i].count++;
        placed = true;
        break;
      }
    }
  }
  
  return bins;
}

/**
 * Calculates Pearson Correlation between two arrays of numbers
 */
export function calculateCorrelation(x, y) {
  const n = x.length;
  if (n === 0 || n !== y.length) return 0;
  
  const meanX = mean(x);
  const meanY = mean(y);
  
  let num = 0;
  let denX = 0;
  let denY = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    num += diffX * diffY;
    denX += diffX * diffX;
    denY += diffY * diffY;
  }
  
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}

/**
 * Calculates the correlation matrix for a set of numeric columns in an array of objects
 */
export function getCorrelationMatrix(data, columns) {
  const matrix = {};
  
  for (const col1 of columns) {
    matrix[col1] = {};
    for (const col2 of columns) {
      const x = data.map(d => d[col1]);
      const y = data.map(d => d[col2]);
      const corr = calculateCorrelation(x, y);
      matrix[col1][col2] = Math.round(corr * 100) / 100;
    }
  }
  
  return matrix;
}
