import React from 'react';
import {View} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {colors} from './../../../constants/index';
import {width} from 'react-native-dimension';

const Chart = ({chartData}) => {
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  console.log(chartData,"data");
  return (
    <View>
      <PieChart
        data={chartData}
        width={width(90)}
        height={width(50)}
        chartConfig={chartConfig}
        // accessor={chartData.datasets[0].data.lenght}
        // center={[2, 0]}
          // absolute
      />
    </View>
  );
};

export default Chart;
