import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;
const isSmallScreen = screenWidth < 375;

interface WorkoutData {
  points: string;
  name: string;
  date: string;
}

const UserFormScreen: React.FC = () => {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    points: '189',
    name: 'WOD Newton',
    date: '7/30/2022',
  });

  const [chartData, setChartData] = useState([-20, -5, -7, 8, 20]);
  const [orientation, setOrientation] = useState(screenWidth > screenHeight ? 'landscape' : 'portrait');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    return () => subscription?.remove();
  }, []);

  // Responsive chart dimensions
  const getChartWidth = () => {
    const containerPadding = isTablet ? 64 : 40; // Account for container padding
    const maxWidth = Math.min(screenWidth - containerPadding, isLargeScreen ? 600 : 400);
    return Math.max(280, maxWidth);
  };

  const getChartHeight = () => {
    if (isLargeScreen) return 220;
    if (isTablet) return 200;
    if (isSmallScreen) return 160;
    return 180;
  };

  const chartConfig = {
    backgroundColor: '#2c3e50',
    backgroundGradientFrom: '#2c3e50',
    backgroundGradientTo: '#34495e',
    decimalPlaces: 0,
    color: (opacity: number = 1) => `rgba(39, 174, 96, ${opacity})`,
    labelColor: (opacity: number = 1) => `rgba(127, 140, 141, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: isTablet ? '8' : '6',
      strokeWidth: '2',
      stroke: '#27ae60',
    },
    propsForBackgroundLines: {
      strokeDasharray: '5,5',
      stroke: '#7f8c8d',
      strokeWidth: 1,
    },
    formatYLabel: (value: string) => {
      const num = parseFloat(value);
      return num.toFixed(0);
    },
  };

  const data = {
    labels: ['', '', '', '', ''],
    datasets: [
      {
        data: chartData,
        color: (opacity: number = 1) => `rgba(39, 174, 96, ${opacity})`,
        strokeWidth: isTablet ? 4 : 3,
      },
    ],
    yAxisSuffix: '',
    yLabelsOffset: 20,
    min: -20,
    max: 20,
  };

  const updateWorkout = () => {
    const pointValue = parseInt(workoutData.points) || 0;
    const normalizedPoint = Math.max(-20, Math.min(20, pointValue / 10));

    setChartData(prevData => {
      const newData = [...prevData];
      newData.shift();
      newData.push(normalizedPoint);
      return newData;
    });

    Alert.alert('Success', 'Workout updated successfully!');
  };

  const handleInputChange = (field: keyof WorkoutData, value: string) => {
    setWorkoutData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[
        styles.contentContainer,
        isTablet && styles.contentContainerTablet,
        orientation === 'landscape' && isTablet && styles.contentContainerLandscape
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[
        styles.innerContainer,
        isTablet && styles.innerContainerTablet,
        isLargeScreen && styles.innerContainerLarge
      ]}>
        
        {/* Chart Section */}
        <View style={[
          styles.chartSection,
          isTablet && styles.chartSectionTablet
        ]}>
          <Text style={[
            styles.sectionTitle,
            isTablet && styles.sectionTitleTablet,
            isSmallScreen && styles.sectionTitleSmall
          ]}>
            Points per WOD
          </Text>
          <View style={[
            styles.chartContainer,
            isTablet && styles.chartContainerTablet
          ]}>
            <LineChart
              data={data}
              width={getChartWidth()}
              height={getChartHeight()}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              withDots={true}
              withShadow={false}
              withScrollableDot={false}
              segments={4}
              fromZero={false}
              yAxisInterval={10}
              yAxisSuffix=""
              yLabelsOffset={20}
            />
          </View>
        </View>

        {/* History Section */}
        <View style={[
          styles.historySection,
          isTablet && styles.historySectionTablet
        ]}>
          <Text style={[
            styles.sectionTitle,
            isTablet && styles.sectionTitleTablet,
            isSmallScreen && styles.sectionTitleSmall
          ]}>
            History:
          </Text>
          <View style={[
            styles.workoutCard,
            isTablet && styles.workoutCardTablet,
            orientation === 'landscape' && isTablet && styles.workoutCardLandscape
          ]}>
            <View style={[
              styles.workoutInfo,
              isTablet && styles.workoutInfoTablet
            ]}>
              <Text style={[
                styles.workoutDate,
                isTablet && styles.workoutDateTablet,
                isSmallScreen && styles.workoutDateSmall
              ]}>
                {workoutData.date}
              </Text>
              <View style={styles.workoutTitleRow}>
                <Text style={[
                  styles.workoutName,
                  isTablet && styles.workoutNameTablet,
                  isSmallScreen && styles.workoutNameSmall
                ]}>
                  {workoutData.name}
                </Text>
              </View>
              <View style={[
                styles.statsRow,
                isTablet && styles.statsRowTablet
              ]}>
                <Text style={[
                  styles.statText,
                  isTablet && styles.statTextTablet,
                  isSmallScreen && styles.statTextSmall
                ]}>
                  <Text style={styles.statLabel}>Time:</Text> 12:53
                </Text>
                <Text style={[
                  styles.statText,
                  isTablet && styles.statTextTablet,
                  isSmallScreen && styles.statTextSmall
                ]}>
                  <Text style={styles.statLabel}>Rest:</Text> 0:37 | 5%
                </Text>
                <View style={[
                  styles.heartRateContainer,
                  isTablet && styles.heartRateContainerTablet
                ]}>
                  <FontAwesome 
                    name="heart" 
                    size={isTablet ? 22 : isSmallScreen ? 14 : 18} 
                    color="#e74c3c" 
                    style={styles.heartIcon} 
                  />
                  <Text style={[
                    styles.heartRateText,
                    isTablet && styles.heartRateTextTablet,
                    isSmallScreen && styles.heartRateTextSmall
                  ]}>
                    167
                  </Text>
                </View>
              </View>
            </View>
            <View style={[
              styles.pointsDisplay,
              isTablet && styles.pointsDisplayTablet
            ]}>
              <Text style={[
                styles.pointsNumber,
                isTablet && styles.pointsNumberTablet,
                isSmallScreen && styles.pointsNumberSmall
              ]}>
                {parseInt(workoutData.points) > 0 ? '+' : ''}{workoutData.points}
              </Text>
              <Text style={[
                styles.pointsLabel,
                isTablet && styles.pointsLabelTablet,
                isSmallScreen && styles.pointsLabelSmall
              ]}>
                Total Points
              </Text>
            </View>
          </View>
        </View>

        {/* Form Section */}
        <View style={[
          styles.formSection,
          isTablet && styles.formSectionTablet
        ]}>
          <View style={[
            styles.formGroup,
            isTablet && styles.formGroupTablet
          ]}>
            <Text style={[
              styles.formLabel,
              isTablet && styles.formLabelTablet,
              isSmallScreen && styles.formLabelSmall
            ]}>
              Points
            </Text>
            <TextInput
              style={[
                styles.formInput,
                isTablet && styles.formInputTablet,
                isSmallScreen && styles.formInputSmall
              ]}
              value={workoutData.points}
              onChangeText={(value) => handleInputChange('points', value)}
              keyboardType="numeric"
              placeholderTextColor="#7f8c8d"
            />
          </View>

          <View style={[
            styles.formGroup,
            isTablet && styles.formGroupTablet
          ]}>
            <Text style={[
              styles.formLabel,
              isTablet && styles.formLabelTablet,
              isSmallScreen && styles.formLabelSmall
            ]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.formInput,
                isTablet && styles.formInputTablet,
                isSmallScreen && styles.formInputSmall
              ]}
              value={workoutData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholderTextColor="#7f8c8d"
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton,
              isTablet && styles.submitButtonTablet
            ]} 
            onPress={updateWorkout}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.submitButtonText,
              isTablet && styles.submitButtonTextTablet,
              isSmallScreen && styles.submitButtonTextSmall
            ]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: isTablet ? 32 : 20,
    paddingHorizontal: isTablet ? 24 : 16,
  },
  contentContainerTablet: {
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  contentContainerLandscape: {
    paddingVertical: 24,
  },
  innerContainer: {
    maxWidth: isLargeScreen ? 800 : isTablet ? 600 : 400,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#34495e',
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 28 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  innerContainerTablet: {
    borderRadius: 28,
    padding: 36,
  },
  innerContainerLarge: {
    padding: 40,
  },
  chartSection: {
    marginBottom: isTablet ? 40 : 32,
  },
  chartSectionTablet: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : isSmallScreen ? 16 : 18,
    fontWeight: '600',
    marginBottom: isTablet ? 20 : 16,
    color: '#ecf0f1',
  },
  sectionTitleTablet: {
    fontSize: 26,
    marginBottom: 24,
  },
  sectionTitleSmall: {
    fontSize: 14,
    marginBottom: 12,
  },
  chartContainer: {
    backgroundColor: '#2c3e50',
    borderRadius: 16,
    padding: isTablet ? 16 : 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chartContainerTablet: {
    borderRadius: 20,
    padding: 20,
  },
  chart: {
    borderRadius: 16,
  },
  historySection: {
    marginBottom: isTablet ? 40 : 32,
  },
  historySectionTablet: {
    marginBottom: 48,
  },
  workoutCard: {
    backgroundColor: '#2c3e50',
    borderRadius: 16,
    padding: isTablet ? 24 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutCardTablet: {
    borderRadius: 20,
    padding: 28,
  },
  workoutCardLandscape: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutInfoTablet: {
    flex: 1,
  },
  workoutDate: {
    fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
    color: '#95a5a6',
    marginBottom: 4,
  },
  workoutDateTablet: {
    fontSize: 18,
    marginBottom: 6,
  },
  workoutDateSmall: {
    fontSize: 11,
  },
  workoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  workoutName: {
    fontSize: isTablet ? 22 : isSmallScreen ? 16 : 18,
    fontWeight: '600',
    color: '#ecf0f1',
    marginRight: 8,
  },
  workoutNameTablet: {
    fontSize: 26,
  },
  workoutNameSmall: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statsRowTablet: {
    marginTop: 12,
  },
  statText: {
    color: '#ecf0f1',
    fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
    marginRight: 8,
    marginBottom: 4,
  },
  statTextTablet: {
    fontSize: 17,
    marginRight: 12,
  },
  statTextSmall: {
    fontSize: 10,
    marginRight: 4,
  },
  statLabel: {
    fontWeight: 'bold',
  },
  heartRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartRateContainerTablet: {
    marginTop: 0,
  },
  heartIcon: {
    marginRight: 4,
  },
  heartRateText: {
    fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
    color: '#ecf0f1',
    fontWeight: '600',
  },
  heartRateTextTablet: {
    fontSize: 18,
  },
  heartRateTextSmall: {
    fontSize: 11,
  },
  pointsDisplay: {
    backgroundColor: '#27ae60',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 20 : 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: isTablet ? 100 : 80,
  },
  pointsDisplayTablet: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderRadius: 16,
    minWidth: 120,
  },
  pointsNumber: {
    fontSize: isTablet ? 28 : isSmallScreen ? 20 : 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  pointsNumberTablet: {
    fontSize: 32,
    marginBottom: 4,
  },
  pointsNumberSmall: {
    fontSize: 18,
  },
  pointsLabel: {
    fontSize: isTablet ? 14 : isSmallScreen ? 10 : 12,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  pointsLabelTablet: {
    fontSize: 16,
  },
  pointsLabelSmall: {
    fontSize: 9,
  },
  formSection: {
    marginBottom: 20,
  },
  formSectionTablet: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: isTablet ? 24 : 20,
  },
  formGroupTablet: {
    marginBottom: 28,
  },
  formLabel: {
    fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
    fontWeight: '600',
    marginBottom: isTablet ? 12 : 8,
    color: '#ecf0f1',
  },
  formLabelTablet: {
    fontSize: 20,
    marginBottom: 16,
  },
  formLabelSmall: {
    fontSize: 12,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#2c3e50',
    borderWidth: 2,
    borderColor: '#34495e',
    borderRadius: 12,
    padding: isTablet ? 20 : 16,
    fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
    color: 'white',
    minHeight: isTablet ? 56 : 48,
  },
  formInputTablet: {
    borderRadius: 16,
    padding: 24,
    fontSize: 20,
    minHeight: 64,
  },
  formInputSmall: {
    padding: 12,
    fontSize: 13,
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: isTablet ? 20 : 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    minHeight: isTablet ? 56 : 48,
  },
  submitButtonTablet: {
    borderRadius: 16,
    padding: 24,
    minHeight: 64,
  },
  submitButtonText: {
    color: '#2c3e50',
    fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
  submitButtonTextTablet: {
    fontSize: 20,
  },
  submitButtonTextSmall: {
    fontSize: 13,
  },
});

export { UserFormScreen };
export default UserFormScreen;