<script setup>
import { ref, watch, nextTick } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import html2canvas from 'html2canvas';

// Register Chart.js components once globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Props passed from App.vue
const props = defineProps(['chartData', 'chartOptions']);

// Chart and DOM references
const chartRef = ref();
const chartContainer = ref();

// Watch for chart updates
watch(
  () => [props.chartData, props.chartOptions],
  () => {
    // For vue-chartjs v5+, chart instance is available as chartRef.value.chart
    if (chartRef.value && chartRef.value.chart) {
      chartRef.value.chart.update();
    }
  },
  { deep: true }
);




// Print chart function - uses Electron print capabilities
const printChart = async () => {
  console.log('Print button pressed');
  try {
    if (!chartContainer.value) throw new Error('No chart container');

    // Hide buttons temporarily
    const buttons = document.querySelectorAll('.share-button, .print-button');
    buttons.forEach(btn => btn.style.visibility = 'hidden');

    // Disable tooltips before rendering
    let chartInstance = chartRef.value?.chart;
    let originalTooltipEnabled;
    if (chartInstance && chartInstance.options.plugins && chartInstance.options.plugins.tooltip) {
      originalTooltipEnabled = chartInstance.options.plugins.tooltip.enabled;
      chartInstance.options.plugins.tooltip.enabled = false;
      chartInstance.update();
    }

    await nextTick();
    await new Promise(r => setTimeout(r, 100)); // Wait for hover to clear

    const canvas = await html2canvas(chartContainer.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    // Re-enable tooltips
    if (chartInstance && chartInstance.options.plugins && chartInstance.options.plugins.tooltip) {
      chartInstance.options.plugins.tooltip.enabled = originalTooltipEnabled !== undefined ? originalTooltipEnabled : true;
      chartInstance.update();
    }

    // Show buttons again
    buttons.forEach(btn => btn.style.visibility = 'visible');

    // Convert to image
    const imgData = canvas.toDataURL('image/png');

    // Check if we're in Electron environment
    if (window.electronAPI) {
      try {
        // Use Electron's print capabilities
        await window.electronAPI.printChart(imgData);
      } catch (electronError) {
        console.error('Electron print failed, using fallback:', electronError);
        fallbackPrint(imgData);
      }
    } else {
      // Fallback for non-Electron environments
      fallbackPrint(imgData);
    }

  } catch (err) {
    console.error('Print error:', err);
    alert('Print failed: ' + err.message);
  }
};

// Fallback print function for non-Electron environments
const fallbackPrint = (imgData) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Unable to open print window. Please check popup blockers.');
    return;
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Run Chart - Print View<\/title>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        img {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
        }
        @media print {
          body { padding: 10px; }
          .no-print { display: none; }
        }
        .no-print {
          margin: 20px 0;
          text-align: center;
        }
        button {
          padding: 10px 20px;
          margin: 0 10px;
          font-size: 16px;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
        }
        button:hover {
          background-color: #0056b3;
        }
      <\/style>
    <\/head>
    <body>
      <div class="no-print">
        <button onclick="window.print()">Print Chart<\/button>
        <button onclick="downloadImage()">Download as Image<\/button>
      <\/div>
      <img src="${imgData}" alt="Run Chart" id="chartImage" />
      <script>
        function downloadImage() {
          const link = document.createElement('a');
          link.download = 'run_chart_' + Date.now() + '.png';
          link.href = document.getElementById('chartImage').src;
          link.click();
        }
        // Auto-trigger print dialog after page loads
        window.onload = function() {
          setTimeout(() => window.print(), 500);
        }
      <\/script>
    <\/body>
    <\/html>
  `);
  printWindow.document.close();
};

const shareChart = async () => {
  console.log('Share button pressed');
  try {
    if (!chartContainer.value) throw new Error('No chart container');
    const button = document.querySelector('.share-button');
    if (button) button.style.visibility = 'hidden';

    // Disable tooltips before rendering
    let chartInstance = chartRef.value?.chart;
    let originalTooltipEnabled;
    if (chartInstance && chartInstance.options.plugins && chartInstance.options.plugins.tooltip) {
      originalTooltipEnabled = chartInstance.options.plugins.tooltip.enabled;
      chartInstance.options.plugins.tooltip.enabled = false;
      chartInstance.update();
    }
    await nextTick();
    await new Promise(r => setTimeout(r, 100)); // Wait for hover to clear
    
    const origCanvas = await html2canvas(chartContainer.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    if (chartInstance && chartInstance.options.plugins && chartInstance.options.plugins.tooltip) {
      chartInstance.options.plugins.tooltip.enabled = originalTooltipEnabled !== undefined ? originalTooltipEnabled : true;
      chartInstance.update();
    }
    
    // Create a new canvas with extra space for the footer
    const footerHeight = 60;
    const canvas = document.createElement('canvas');
    canvas.width = origCanvas.width;
    canvas.height = origCanvas.height + footerHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(origCanvas, 0, 0);
    const footerText = 'More apps: https://patrickrutledge.github.io/apps/ | © Pat Rutledge';
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText(footerText, canvas.width / 2, canvas.height - 20);
    const imgData = canvas.toDataURL('image/png');
    console.log('Image data generated, length:', imgData.length);

    // Check if we're in Electron environment
    if (window.electronAPI) {
      try {
        // Use Electron's native save dialog
        const success = await window.electronAPI.saveFile({
          data: imgData,
          defaultName: `run_chart_${Date.now()}.png`,
          filters: [
            { name: 'PNG Images', extensions: ['png'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });
        
        if (success) {
          alert('Chart saved successfully! You can now share the saved image file.');
        } else {
          console.log('User cancelled save dialog');
        }
      } catch (electronError) {
        console.error('Electron save failed, using fallback:', electronError);
        fallbackSave(imgData);
      }
    } else {
      // Try Capacitor for mobile, then web APIs
      try {
        const { Share } = await import('@capacitor/share');
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        
        const base64Data = imgData.split(',')[1];
        const fileName = `run_chart_${Date.now()}.png`;
        const result = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache,
          recursive: true
        });
        console.log('File written:', result);
        await Share.share({
          title: 'Run Chart',
          text: 'Check out this run chart! Created with Run Chart Analytics.',
          url: result.uri,
          dialogTitle: 'Share your run chart'
        });
      } catch (capacitorError) {
        console.log('Capacitor not available, using web fallback');
        fallbackSave(imgData);
      }
    }
    
    if (button) button.style.visibility = 'visible';
  } catch (err) {
    console.error('Share error:', err);
    alert('Share failed: ' + err.message);
    const button = document.querySelector('.share-button');
    if (button) button.style.visibility = 'visible';
  }
};

// Fallback save function for non-Electron environments
const fallbackSave = (imgData) => {
  if (navigator.share && navigator.canShare) {
    // Try Web Share API first
    fetch(imgData)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'run_chart.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          return navigator.share({
            title: 'Run Chart',
            text: 'Check out this run chart! Created with Run Chart Analytics.',
            files: [file]
          });
        } else {
          throw new Error('File sharing not supported');
        }
      })
      .catch(shareError => {
        console.log('Web Share API failed, using download fallback:', shareError);
        downloadFallback(imgData);
      });
  } else {
    // Direct download fallback
    downloadFallback(imgData);
  }
};

// Final fallback - direct download
const downloadFallback = (imgData) => {
  const link = document.createElement('a');
  link.download = `run_chart_${Date.now()}.png`;
  link.href = imgData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  alert('Chart downloaded! You can now share the downloaded image file.');
};

</script>


<template>
  <div>
    <!-- Chart wrapper for sharing -->
    <div ref="chartContainer">
      <div class="chart-container debug-border">
        <Line
          v-if="chartData && chartData.labels && chartData.labels.length > 0"
          :data="chartData"
          :options="chartOptions"
          ref="chartRef"
        />
        <p v-else class="no-data-message">
          Enter production data to display the run chart.
        </p>
      </div>
    </div>
    <!-- Share and Print buttons -->
    <div style="text-align:center; margin-top: 20px;">
      <button @click="shareChart" class="share-button">
        Share Chart
      </button>
      <button @click="printChart" class="print-button" style="margin-left: 10px;">
        Print Chart
      </button>
    </div>
  </div>
</template>


<style scoped>
.chart-container {
  position: relative;
  height: 350px;
  width: 100%;
  min-width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.debug-border {
  border: 2px dashed #007bff;
}

.no-data-message {
  color: #666;
  font-size: 1.1em;
  text-align: center;
}

.share-button, .print-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.share-button:hover, .print-button:hover {
  background-color: #0056b3;
}

.print-button {
  background-color: #28a745;
}

.print-button:hover {
  background-color: #218838;
}


</style>

