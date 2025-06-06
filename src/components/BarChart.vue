<template>
  <div>
    <canvas ref="barCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const barCanvas = ref(null)

onMounted(() => {
  new Chart(barCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Revenue',
          data: [12000, 15000, 8000, 18000, 22000],
          backgroundColor: '#42A5F5',
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
  max-width: 500px;
  height: 300px;
}
</style>
