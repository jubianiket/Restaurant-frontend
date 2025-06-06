<template>
  <div>
    <canvas ref="doughnutCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const doughnutCanvas = ref(null)

onMounted(() => {
  new Chart(doughnutCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['Cash', 'Online', 'Pending'],
      datasets: [
        {
          label: 'Payments',
          data: [60, 30, 10],
          backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })
})
</script>

<style scoped>
canvas {
  max-width: 300px;
  height: 300px;
}
</style>
