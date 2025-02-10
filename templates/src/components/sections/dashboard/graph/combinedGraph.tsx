import { useMemo } from 'react';
import {Typography, Paper, SxProps } from '@mui/material';
import ReactEchart from 'components/base/ReactEchart';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

interface CombinedGraphProps {
  data: {
    timestamp: string;
    temperature: number;
    humidity: number;
    soil_moisture: number;
    is_abnormal: boolean;
  }[];
  sx?: SxProps;
}

const CombinedGraph = ({ data, sx }: CombinedGraphProps) => {
  const option = useMemo(() => {
    const timestamps = data.map((item) => new Date(item.timestamp).toLocaleString('en-GB', { timeZone: 'UTC' }));

    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Temperature', 'Humidity', 'Soil Moisture'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Temperature',
          type: 'line',
          data: data.map((item) => item.temperature),
          lineStyle: { color: '#ff7043' },
          itemStyle: { color: '#ff7043' },
        },
        {
          name: 'Humidity',
          type: 'line',
          data: data.map((item) => item.humidity),
          lineStyle: { color: '#42a5f5' },
          itemStyle: { color: '#42a5f5' },
        },
        {
          name: 'Soil Moisture',
          type: 'line',
          data: data.map((item) => item.soil_moisture),
          lineStyle: { color: '#66bb6a' },
          itemStyle: { color: '#66bb6a' },
        },
      ],
    };
  }, [data]);

  return (
    <Paper elevation={3} sx={{ p: 2, ...sx }}>
      <Typography variant="h6" textAlign="center" mb={2}>
        Combined Metrics
      </Typography>
      <ReactEchart echarts={echarts} option={option} style={{ height: 300 }} />
    </Paper>
  );
};

export default CombinedGraph;
