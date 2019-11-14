export function getAveragePercentageOfSuccess(trend) {
  if (trend.length === 0) return 0;
  const sumPercentageOfSuccess = trend.reduce((accumulator, statOfTheDay) => {
    const percentage =
      (statOfTheDay[1] * 100) / (statOfTheDay[1] + statOfTheDay[2]);
    accumulator += percentage;
    return accumulator;
  }, 0);
  return Math.floor(sumPercentageOfSuccess / trend.length);
}
