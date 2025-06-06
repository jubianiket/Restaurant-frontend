<template>
  <div class="container">
    <main class="main-content">
      <h1 class="page-title">Order History</h1>

      <table v-if="orders.length" class="orders-table">
        <thead>
          <tr>
            <th>Order Type</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Item</th>
            <th>Total Quantity</th>
            <th>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="index">
            <td>{{ order.order_type }}</td>
            <td>{{ order.customer_name }}</td>
            <td>{{ order.customer_phone || '-' }}</td>
            <td>{{ order.item_name }}</td>
            <td>{{ order.total_quantity }}</td>
            <td>{{ Number(order.total_spent_on_item).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="no-orders">No order history found.</p>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const orders = ref([])

    onMounted(async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/order-history')
        orders.value = response.data
      } catch (error) {
        console.error('Failed to fetch order history:', error)
      }
    })

    return { orders }
  },
}
</script>

<style scoped>
/* Container layout - center content */
.container {
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f8fa;
  display: flex;
  justify-content: center;
  padding: 2rem;
}

/* Main content width control */
.main-content {
  width: 100%;
  max-width: 1200px;
  background: white;
  padding: 2rem 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
}

.page-title {
  margin-bottom: 1.5rem;
  color: #13547a;
  font-size: 2.2rem;
  font-weight: 700;
  border-bottom: 3px solid #80d0c7;
  padding-bottom: 0.5rem;
  max-width: max-content;
  margin-left: auto;
  margin-right: auto;
}

/* Orders table styling */
.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.orders-table th,
.orders-table td {
  padding: 12px 25px;
  border-bottom: 1px solid #ddd;
  vertical-align: top;
  word-wrap: break-word;
  max-width: 160px;
}

.orders-table th {
  background-color: #13547a;
  color: white;
  text-align: left;
}

.orders-table tbody tr:hover {
  background-color: #eaf6f6;
}

.items-cell ul {
  padding-left: 1.2rem;
  margin: 0;
}

.items-cell li {
  margin-bottom: 4px;
  line-height: 1.3;
}

/* No orders text */
.no-orders {
  font-size: 1.25rem;
  color: #777;
  margin-top: 3rem;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .main-content {
    padding: 1.5rem 1.5rem 3rem;
  }

  .orders-table th,
  .orders-table td {
    max-width: none;
  }
}
</style>
