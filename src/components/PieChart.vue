<template>
  <div>
    <canvas ref="pieCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const pieCanvas = ref(null)

onMounted(() => {
  new Chart(pieCanvas.value, {
    type: 'pie',
    data: {
      labels: ['Dine-in', 'Takeaway', 'Delivery'],
      datasets: [
        {
          label: 'Order Types',
          data: [45, 30, 25],
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
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
