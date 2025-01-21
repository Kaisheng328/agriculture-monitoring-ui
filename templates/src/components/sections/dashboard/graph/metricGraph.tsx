import { useMemo } from 'react';
import {Typography, Paper, SxProps } from '@mui/material';
import ReactEchart from 'components/base/ReactEchart';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

interface MetricGraphProps {
  title: string;
  data: {
    timestamp: string;
    value: number;
  }[];
  color: string;
  sx?: SxProps;
}

const MetricGraph = ({ title, data, color, sx }: MetricGraphProps) => {
  const option = useMemo(() => {
    const timestamps = data.map((item) => item.timestamp);
    const values = data.map((item) => item.value);

    return {
      tooltip: {
        trigger: 'axis',
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
          name: title,
          type: 'line',
          data: values,
          lineStyle: { color },
          itemStyle: { color },
        },
      ],
    };
  }, [data, title, color]);

  return (
    <Paper elevation={3} sx={{ p: 2, ...sx }}>
      <Typography variant="h6" textAlign="center" mb={2}>
        {title}
      </Typography>
      <ReactEchart echarts={echarts} option={option} style={{ height: 300 }} />
    </Paper>
  );
};

export default MetricGraph;
