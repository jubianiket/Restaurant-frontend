<template>
  <div class="dashboard">
    <h2>Dashboard Analytics</h2>

    <div class="filters">
      <label>
        Start Date:
        <input type="date" v-model="filters.startDate" />
      </label>
      <label>
        End Date:
        <input type="date" v-model="filters.endDate" />
      </label>
      <button @click="fetchData">Apply Filters</button>
      <button @click="resetFilters">Reset</button>
    </div>

    <div class="charts-container">
      <div class="chart-card">
        <h3>Sales by Item</h3>
        <PieChart :chart-data="salesByItemChartData" />
      </div>

      <div class="chart-card">
        <h3>Daily Sales</h3>
        <BarChart :chart-data="dailySalesChartData" />
      </div>

      <div class="chart-card">
        <h3>Payment Status Distribution</h3>
        <DoughnutChart :chart-data="paymentStatusChartData" />
      </div>
    </div>

    <div class="table-section">
      <h3>Top 5 Customers with Pending Bills</h3>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Pending Bills</th>
            <th>Total Pending Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in topPendingCustomers" :key="customer.customer_phone">
            <td>{{ customer.customer_name }}</td>
            <td>{{ customer.customer_phone }}</td>
            <td>{{ customer.pending_bills_count }}</td>
            <td>{{ Number(customer.total_pending_amount).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PieChart from './PieChart.vue'
import BarChart from './BarChart.vue'
import DoughnutChart from './DoughnutChart.vue'

export default {
  name: 'DashboardComponent',
  components: {
    PieChart,
    BarChart,
    DoughnutChart,
  },
  setup() {
    const filters = ref({
      startDate: '',
      endDate: '',
    })

    const salesByItem = ref([])
    const dailySales = ref([])
    const paymentStatusDist = ref([])
    const topPendingCustomers = ref([])

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    }

    const prepareSalesByItemChartData = () => ({
      labels: salesByItem.value.map((i) => i.item_name),
      datasets: [
        {
          label: 'Total Sales',
          data: salesByItem.value.map((i) => Number(i.total_sales)),
          backgroundColor: salesByItem.value.map(() => getRandomColor()),
        },
      ],
    })

    const prepareDailySalesChartData = () => ({
      labels: dailySales.value.map((i) => i.date),
      datasets: [
        {
          label: 'Sales',
          data: dailySales.value.map((i) => Number(i.total_sales)),
          backgroundColor: '#4bc0c0',
        },
      ],
    })

    const preparePaymentStatusChartData = () => ({
      labels: paymentStatusDist.value.map((i) => i.payment_status),
      datasets: [
        {
          label: 'Orders Count',
          data: paymentStatusDist.value.map((i) => Number(i.count_orders)),
          backgroundColor: paymentStatusDist.value.map(() => getRandomColor()),
        },
      ],
    })

    const salesByItemChartData = ref({})
    const dailySalesChartData = ref({})
    const paymentStatusChartData = ref({})

    const fetchData = async () => {
      try {
        const params = {}
        if (filters.value.startDate) params.startDate = filters.value.startDate
        if (filters.value.endDate) params.endDate = filters.value.endDate

        const [salesRes, dailyRes, paymentRes, pendingRes] = await Promise.all([
          axios.get('https://restaurant-orders-3r73.onrender.com/api/dashboard/sales-by-item', {
            params,
          }),
          axios.get('https://restaurant-orders-3r73.onrender.com/api/dashboard/daily-sales', {
            params,
          }),
          axios.get(
            'https://restaurant-orders-3r73.onrender.com/api/dashboard/payment-status-distribution',
            { params },
          ),
          axios.get(
            'https://restaurant-orders-3r73.onrender.com/api/dashboard/top-pending-customers',
          ),
        ])

        salesByItem.value = salesRes.data
        dailySales.value = dailyRes.data
        paymentStatusDist.value = paymentRes.data
        topPendingCustomers.value = pendingRes.data

        salesByItemChartData.value = prepareSalesByItemChartData()
        dailySalesChartData.value = prepareDailySalesChartData()
        paymentStatusChartData.value = preparePaymentStatusChartData()
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    const resetFilters = () => {
      filters.value.startDate = ''
      filters.value.endDate = ''
      fetchData()
    }

    onMounted(fetchData)

    return {
      filters,
      fetchData,
      resetFilters,
      salesByItemChartData,
      dailySalesChartData,
      paymentStatusChartData,
      topPendingCustomers,
    }
  },
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  font-family: Arial, sans-serif;
}
.filters {
  margin-bottom: 20px;
}
.filters label {
  margin-right: 20px;
}
.charts-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.chart-card {
  width: 300px;
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
}
.table-section {
  margin-top: 30px;
}
table {
  border-collapse: collapse;
  width: 100%;
}
table th,
table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}
table th {
  background-color: #f4f4f4;
}
</style>
