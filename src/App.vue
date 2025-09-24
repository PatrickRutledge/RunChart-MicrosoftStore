<script setup>
import { ref, computed, onErrorCaptured } from 'vue';
import RunChartDisplay from './components/RunChartDisplay.vue';

// Error handling
const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((err, instance, info) => {
  console.error('Component error captured:', err, info);
  hasError.value = true;
  errorMessage.value = err.message || 'An unknown error occurred';
  return false; // Prevent error from propagating
});

// Reactive variables for our inputs and chart title
// Start with example values to show a working chart
const chartTitle = ref('Production Run Chart Example');
const unitOfMeasure = ref('Pounds');
const timeScale = ref('Day');
const goalLine = ref(12);
const usl = ref(15);
const lsl = ref(8);

// Reactive variable for the raw text input of data
const rawDataInput = ref('10, 12, 11, 13, 12, 14, 11, 10, 12, 13, 11, 12, 14, 13, 12'); // Example data to show chart

// Reactive variable for input warning message
const inputWarning = ref(null);

// Removed More Apps functionality

// --- COMPUTED PROPERTIES FOR CHART ---
// Parse the raw text input into a numeric array
const productionData = computed(() => {
  const rawParts = rawDataInput.value.split(',');
  const parsedNumbers = rawParts.map(s => parseFloat(s.trim()));
  const validNumbers = parsedNumbers.filter(n => !isNaN(n));

  // Check for invalid entries
  if (validNumbers.length !== rawParts.length) {
    inputWarning.value = 'Warning: Some non-numeric values were ignored in the data input.';
  } else {
    inputWarning.value = null; // Clear warning if all are valid
  }

  return validNumbers;
});

// X-axis labels (e.g., 'Day 1', 'Day 2', etc.)
const chartLabels = computed(() => {
  // Only generate labels if there is production data
  if (productionData.value.length === 0) {
    return [];
  }
  // If timeScale is blank, use a generic label
  const scaleText = timeScale.value || 'Unit'; 
  return productionData.value.map((_, index) => `${scaleText} ${index + 1}`);
});

// Mean calculation - only calculate if data exists
const meanThroughput = computed(() => {
  if (productionData.value.length === 0) {
    return 0; // Return 0 or undefined if no data
  }
  const sum = productionData.value.reduce((a, b) => a + b, 0);
  return sum / productionData.value.length;
});

// Chart.js data object
const chartData = computed(() => {
  const labels = chartLabels.value;
  const dataPoints = productionData.value;
  const meanVal = meanThroughput.value;
  const goalVal = goalLine.value;
  const uslVal = usl.value;
  const lslVal = lsl.value;

  // If no data points, return an empty dataset to avoid errors
  if (dataPoints.length === 0) {
    return { labels: [], datasets: [] };
  }

  return {
    labels: labels,
    datasets: [
      {
        label: `${unitOfMeasure.value || 'Throughput'}`, // Use default if blank
        backgroundColor: '#42b983', // Greenish color for the main line
        borderColor: '#42b983',
        data: dataPoints,
        tension: 0.1, // Makes the line slightly curved
        fill: false, // Don't fill area under the line
      },
      {
        label: `Mean (${meanVal.toFixed(2)})`,
        data: Array(labels.length).fill(meanVal), // A horizontal line at the mean
        borderColor: 'red',
        borderDash: [5, 5], // Dashed line
        pointRadius: 0, // No points for the mean line
        fill: false,
        tooltip: { enabled: false } // No tooltip for this line
      },
      {
        label: `Goal (${goalVal !== null ? goalVal : 'N/A'})`, // Show N/A if blank
        data: Array(labels.length).fill(goalVal), // A horizontal line at the goal
        borderColor: 'green', // Green for goal line
        borderDash: [5, 5], // Dashed line as requested
        pointRadius: 0,
        fill: false,
        tooltip: { enabled: false }
      },
      {
        label: `USL (${uslVal !== null ? uslVal : 'N/A'})`, // Show N/A if blank
        data: Array(labels.length).fill(uslVal), // A horizontal line at USL
        borderColor: 'orange',
        borderDash: [], // Solid line
        pointRadius: 0,
        fill: false,
        tooltip: { enabled: false }
      },
      {
        label: `LSL (${lslVal !== null ? lslVal : 'N/A'})`, // Show N/A if blank
        data: Array(labels.length).fill(lslVal), // A horizontal line at LSL
        borderColor: 'orange',
        borderDash: [], // Solid line
        pointRadius: 0,
        fill: false,
        tooltip: { enabled: false }
      }
    ]
  };
});

// Chart.js options object
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: chartTitle.value || 'Run Chart', // Use default if blank
      font: {
        size: 20
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
    legend: {
      display: true,
      position: 'bottom' // Move legend to bottom to save horizontal space
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: `Time Period (${timeScale.value || 'Unit'})` // Use default if blank
      }
    },
    y: {
      title: {
        display: true,
        text: unitOfMeasure.value || 'Value' // Use default if blank
      },
      beginAtZero: true
    }
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  }
}));

// Function to reset all inputs to blank values (clear all fields)
const resetInputs = () => {
  chartTitle.value = '';
  unitOfMeasure.value = '';
  timeScale.value = '';
  goalLine.value = null;
  usl.value = null;
  lsl.value = null;
  rawDataInput.value = '';
  inputWarning.value = null; // Clear any warnings
};
</script>

<template>
  <div id="app-container">
    <!-- Error fallback display -->
    <div v-if="hasError" class="error-container">
      <h2>Application Error</h2>
      <p>The application encountered an error and is running in safe mode.</p>
      <p><strong>Error:</strong> {{ errorMessage }}</p>
      <button @click="hasError = false; errorMessage = ''" style="margin-top: 10px; padding: 8px 16px;">
        Try Again
      </button>
    </div>

    <!-- Normal application content -->
    <div v-else>
      <h1>{{ chartTitle || 'Run Chart Visualization' }}</h1> 
      <div class="controls-section">
      <div class="input-group">
        <p class="input-instruction">Enter your data values (comma separated):</p>
        <textarea id="rawData" v-model="rawDataInput" rows="5" cols="50" placeholder="Example: 8, 10, 12, 11, 9, 8, 10, 11, 12, 9

Paste your production data here, separated by commas."></textarea>
      </div>

      <p v-if="inputWarning" class="warning-message">{{ inputWarning }}</p>

      <div class="input-group">
        <label for="chartTitle">Chart Title:</label>
        <input type="text" id="chartTitle" v-model="chartTitle" size="40" placeholder="Enter your chart title (e.g., Production Report)" />
      </div>

      <div class="input-group">
        <label for="unitOfMeasure">Unit of Measure:</label>
        <input type="text" id="unitOfMeasure" v-model="unitOfMeasure" placeholder="e.g., Pounds, Units, Gallons" />
      </div>

      <div class="input-group">
        <label for="timeScale">Time Period:</label>
        <input type="text" id="timeScale" v-model="timeScale" placeholder="e.g., Day, Week, Hour" />
      </div>

      <div class="input-group">
        <label for="goalLine">Goal Line:</label>
        <input type="number" id="goalLine" v-model.number="goalLine" placeholder="Target value (e.g., 12)" />
      </div>

      <div class="input-group">
        <label for="usl">Upper Limit (USL):</label>
        <input type="number" id="usl" v-model.number="usl" placeholder="Maximum acceptable value" />
      </div>

      <div class="input-group">
        <label for="lsl">Lower Limit (LSL):</label>
        <input type="number" id="lsl" v-model.number="lsl" placeholder="Minimum acceptable value" />
      </div>

      <div class="button-group">
        <button @click="resetInputs">Reset All Fields</button>
      </div>

    </div>

    <div class="chart-section">
      <RunChartDisplay :chartData="chartData" :chartOptions="chartOptions" />
    </div>


    </div> <!-- End normal application content -->
  </div> <!-- End app-container -->
</template>

<style scoped>
/* Error handling styles */
.error-container {
  background-color: #ffe6e6;
  border: 2px solid #ff6b6b;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
}

.error-container h2 {
  color: #d63031;
  margin-top: 0;
}

.error-container p {
  color: #2d3436;
  margin: 10px 0;
}

/* Existing styles */
#app-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
}

.controls-section {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.input-instruction {
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
}

.input-group label {
  flex: 0 0 120px;
  margin-right: 8px;
  text-align: right;
  font-weight: bold;
  color: #333;
}

.input-group input[type="text"],
.input-group input[type="number"] {
  flex: 1 1 120px;
  min-width: 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
}

.input-group textarea {
  width: 100%;
  min-width: 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  vertical-align: top;
  resize: vertical;
}

.warning-message {
  color: red;
  font-weight: bold;
  margin-top: -5px;
  margin-bottom: 15px;
  text-align: center;
}

.button-group {
  margin-top: 20px;
  text-align: center;
}

.button-group button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.button-group button:hover {
  background-color: #0056b3;
}

.chart-section {
  border: 1px solid #e0e0e0;
  padding: 20px;
  min-height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  background-color: #fff;
  border-radius: 8px;
}

.chart-section:empty::before {
  content: 'Enter data above to generate your run chart';
  color: #999;
  font-style: italic;
}

</style>