import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const Graph = ({ stats }) => {
  return (
    <LineChart
      width={900}
      height={330}
      data={stats}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="day" padding={{ left: 30, right: 30 }} />
      <YAxis padding={{ bottom: 30 }} allowDecimals={false} />
      <Tooltip />
      <Line type="monotone" dataKey="cards" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  );
};

export default Graph;
