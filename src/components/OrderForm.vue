<template>
  <div class="header">
    <h1>NISARG RESTAURANT</h1>
  </div>
  <div class="order-form-container">
    <!-- MENU ITEMS -->
    <div class="menu-section">
      <h3>Menu Items</h3>
      <input type="text" v-model="searchQuery" placeholder="Search menu items..." />
      <table border="1">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Rate(₹)</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredMenuItems" :key="item.id">
            <td>{{ item.item_name }}</td>
            <td>{{ item.rate.toFixed(2) }}</td>
            <td><button @click="addItem(item)">Add</button></td>
          </tr>
          <tr v-if="filteredMenuItems.length === 0">
            <td colspan="3">No items found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ORDER SECTION -->
    <div class="order-section">
      <div class="order-details">
        <label>
          Order Type:
          <select v-model="orderType">
            <option value="dine-in">Dine-in</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>
        </label>
        <label>
          Table Number:
          <input type="text" v-model="table_number" placeholder="Table Number" />
        </label>
        <label>
          Customer Name:
          <input type="text" v-model="customer_name" placeholder="Customer Name" />
        </label>
      </div>

      <h3>Selected Items</h3>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
            <th>Amount (₹)</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in orderItems" :key="idx">
            <td>{{ item.item_name }}</td>
            <td>{{ item.price.toFixed(2) }}</td>
            <td>
              <input type="number" min="1" v-model.number="item.quantity" style="width: 60px" />
            </td>
            <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
            <td>
              <button @click="removeItem(idx)">Remove</button>
            </td>
          </tr>
          <tr v-if="orderItems.length === 0">
            <td colspan="5">No items added.</td>
          </tr>
        </tbody>
      </table>

      <h3>Total: ₹{{ totalAmount.toFixed(2) }}</h3>

      <button
        @click="confirmOrder"
        :disabled="orderItems.length === 0 || !table_number || !customer_name"
      >
        Confirm Order
      </button>

      <!-- PAYMENT STATUS DROPDOWN -->
      <div v-if="showPaymentOptions">
        <label>
          Payment Status:
          <select v-model="paymentStatus" @change="handlePaymentStatus">
            <option disabled value="">Select Payment Status</option>
            <option value="Pending">Pending</option>
            <option value="By Cash">By Cash</option>
            <option value="Online">Online</option>
          </select>
        </label>
      </div>

      <h3>Confirmed Orders</h3>
      <div v-if="confirmedOrders.length === 0">No confirmed orders.</div>
      <div
        v-for="(order, idx) in confirmedOrders"
        :key="'confirmed-' + idx"
        class="confirmed-order"
      >
        <p><strong>Order Type:</strong> {{ order.order_type }}</p>
        <p><strong>Table Number:</strong> {{ order.table_number }}</p>
        <p><strong>Customer Name:</strong> {{ order.customer_name }}</p>
        <p><strong>Payment Status:</strong> {{ order.payment_status }}</p>

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in order.items" :key="i">
              <td>{{ item.item_name }}</td>
              <td>{{ item.price.toFixed(2) }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <p>
          <strong>Total:</strong>
          ₹{{ order.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2) }}
        </p>

        <button v-if="order.payment_status !== 'Pending'" @click="generateBill(idx)">
          Generate Bill
        </button>
        <button @click="editOrder(idx)">Edit Order</button>
      </div>
    </div>

    <!-- BILL PREVIEW -->
    <div v-if="billToPrint" id="print-section" class="bill-preview">
      <h2 style="text-align: center; margin-bottom: 0">NISARG RESTAURANT</h2>
      <p style="text-align: center; margin-top: 0"><strong>Contact No:</strong> +91-9876543210</p>
      <hr />
      <p><strong>Order ID:</strong> {{ billToPrint.orderId || 'N/A' }}</p>
      <p><strong>Order Type:</strong> {{ billToPrint.order_type }}</p>
      <p><strong>Table Number:</strong> {{ billToPrint.table_number }}</p>
      <p><strong>Customer Name:</strong> {{ billToPrint.customer_name }}</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px">
        <thead>
          <tr>
            <th style="border: 1px solid #333; padding: 8px">Item Name</th>
            <th style="border: 1px solid #333; padding: 8px">Price (₹)</th>
            <th style="border: 1px solid #333; padding: 8px">Quantity</th>
            <th style="border: 1px solid #333; padding: 8px">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in billToPrint.items" :key="i">
            <td style="border: 1px solid #333; padding: 8px">{{ item.item_name }}</td>
            <td style="border: 1px solid #333; padding: 8px">{{ item.price.toFixed(2) }}</td>
            <td style="border: 1px solid #333; padding: 8px">{{ item.quantity }}</td>
            <td style="border: 1px solid #333; padding: 8px">
              {{ (item.price * item.quantity).toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>

      <p><strong>Subtotal:</strong> ₹{{ billToPrint.subtotal.toFixed(2) }}</p>
      <p><strong>Discount (10%):</strong> -₹{{ billToPrint.discount.toFixed(2) }}</p>
      <p><strong>GST (18%):</strong> ₹{{ billToPrint.gst.toFixed(2) }}</p>
      <p style="text-align: right; margin-top: 10px">
        <strong>Total:</strong> ₹{{ billTotalAmount }}
      </p>

      <div style="margin-top: 20px; text-align: center">
        <button class="print-button print-control" @click="printBill">Print Bill</button>
        <button class="print-control" @click="closeBill">Close Preview</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      menuItems: [],
      searchQuery: '',
      orderItems: [],
      confirmedOrders: [],
      orderType: 'dine-in',
      table_number: '',
      customer_name: '',
      paymentStatus: '',
      showPaymentOptions: false,
      billToPrint: null,
      editingOrderIndex: null,
    }
  },
  computed: {
    filteredMenuItems() {
      return this.menuItems.filter((item) =>
        item.item_name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
    totalAmount() {
      return this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    billTotalAmount() {
      return this.billToPrint?.totalAmount || '0.00'
    },
  },
  methods: {
    async fetchMenuItems() {
      try {
        const res = await axios.get('https://restaurant-orders-3r73.onrender.com/api/menu-items')
        this.menuItems = res.data.map((item) => ({
          ...item,
          rate: parseFloat(item.rate),
        }))
      } catch (error) {
        console.error('Error loading menu items:', error)
      }
    },
    addItem(item) {
      const existing = this.orderItems.find((i) => i.id === item.id)
      if (existing) {
        existing.quantity++
      } else {
        this.orderItems.push({
          id: item.id,
          item_name: item.item_name,
          price: item.rate,
          quantity: 1,
        })
      }
    },
    removeItem(idx) {
      this.orderItems.splice(idx, 1)
    },
    confirmOrder() {
      this.showPaymentOptions = true
    },
    async handlePaymentStatus() {
      const order = {
        order_type: this.orderType,
        table_number: this.table_number,
        customer_name: this.customer_name,
        payment_status: this.paymentStatus,
        items: JSON.parse(JSON.stringify(this.orderItems)),
      }

      if (this.paymentStatus === 'Pending') {
        try {
          await axios.post('https://restaurant-orders-3r73.onrender.com/api/orders', order)
          alert('Order saved with Pending payment.')
          this.resetOrderForm()
        } catch (error) {
          alert('Failed to save order.')
          console.error(error)
        }
      } else {
        this.confirmedOrders.push(order)
        this.resetOrderForm()
      }
    },
    resetOrderForm() {
      this.orderItems = []
      this.table_number = ''
      this.customer_name = ''
      this.paymentStatus = ''
      this.showPaymentOptions = false
    },
    async generateBill(idx) {
      const order = this.confirmedOrders[idx]
      try {
        const response = await axios.post(
          'https://restaurant-orders-3r73.onrender.com/api/orders',
          order,
        )
        if (response.data.success) {
          alert(`Bill generated! Order ID: ${response.data.orderId}`)
          this.billToPrint = {
            orderId: response.data.orderId,
            billNumber: response.data.billNumber,
            subtotal: response.data.subtotal,
            discount: response.data.discount,
            gst: response.data.gst,
            totalAmount: response.data.totalAmount,
            ...order,
          }
          this.confirmedOrders.splice(idx, 1)
        } else {
          alert('Failed to generate bill.')
        }
      } catch (error) {
        console.error('Error generating bill:', error)
        alert('Error generating bill.')
      }
    },
    printBill() {
      const printContents = document.getElementById('print-section').innerHTML
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents
      window.location.reload()
    },
    closeBill() {
      this.billToPrint = null
    },
    editOrder(idx) {
      const order = this.confirmedOrders[idx]
      this.orderType = order.order_type
      this.table_number = order.table_number
      this.customer_name = order.customer_name
      this.orderItems = JSON.parse(JSON.stringify(order.items))
      this.editingOrderIndex = idx
      this.confirmedOrders.splice(idx, 1)
      this.billToPrint = null
      this.showPaymentOptions = true
      this.paymentStatus = ''
    },
  },
  mounted() {
    this.fetchMenuItems()
  },
}
</script>

<style scoped>
.header {
  background-color: #ff9800;
  padding: 20px;
  text-align: center;
  color: rgb(14, 13, 13);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 32px;
  font-weight: bold;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

body {
  background: linear-gradient(135deg, #f85032 0%, #e73827 100%);
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;

  /* ADDED: fix for text color on mobile browsers (ensure contrast) */
  color: #000 !important;
}
.input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: 100%;

  /* ADDED: font-size for better readability on mobile */
  font-size: 16px;
  color: #000; /* FIXED: ensure input text is visible */
}

.order-form-container {
  background: linear-gradient(180deg, #13547a 0%, #80d0c7 100%);
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 30px;
  width: 100%;
  max-width: 1100px;
  min-height: 600px;

  /* ADDED: allow scrolling on small screens if content is big */
  overflow-x: auto;
}

.menu-section {
  background: #d0e7ff; /* soft pastel blue */
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(30, 60, 90, 0.1);
  height: 100%;
  overflow-y: auto;
  width: 400px;

  /* FIXED: minimum width so menu text doesn't collapse */
  min-width: 280px;
}

.order-section {
  background: #d9f0d9; /* light pastel green */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(30, 60, 30, 0.1);
  height: 100%;
  overflow-y: auto;

  /* FIXED: min width to keep content visible */
  min-width: 280px;
}
.content-container {
  background: linear-gradient(180deg, #137a75 0%, #80d0c7 100%);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: auto;
  max-width: 1200px;

  /* ADDED: prevent content from shrinking too much */
  min-width: 320px;
}
@media print {
  body {
    margin: 0;
    padding: 0;
    width: 80mm; /* Typical thermal printer width: 58mm or 80mm */
    font-family: monospace, monospace;
    font-size: 12px;
    color: black;
  }

  #print-section {
    width: 80mm;
    margin: 0 auto;
    padding: 5px 10px;
  }

  #print-section h2,
  #print-section p,
  #print-section table {
    margin: 0;
    padding: 0;
    line-height: 1.2;
  }

  #print-section table {
    width: 100%;
    border-collapse: collapse;
  }

  #print-section th,
  #print-section td {
    border-bottom: 1px dashed #000;
    padding: 4px 0;
    text-align: left;
  }

  #print-section th {
    font-weight: bold;
  }

  #print-section td:last-child,
  #print-section th:last-child {
    text-align: right;
  }

  /* Hide buttons on print */
  .print-control {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .order-form-container {
    flex-direction: column;
    padding: 10px;
  }

  .menu-section,
  .order-section {
    width: 100%;
    height: auto;

    /* FIXED: add bottom margin for spacing on mobile */
    margin-bottom: 20px;
  }

  .header {
    font-size: 24px;
    padding: 10px;
  }

  table {
    font-size: 14px;
    overflow-x: auto;
  }

  button {
    font-size: 14px;
    padding: 6px 10px;

    /* ADDED: increase tap target size on mobile */
    min-width: 80px;
  }

  .input {
    font-size: 14px;
    padding: 8px;
  }
}

/* ADDED: fix for tables and text visibility on mobile */
table,
th,
td {
  color: #000 !important; /* enforce black text for readability */
  word-wrap: break-word;
  white-space: normal;
}

/* ADDED: fix for scrollbars on overflow containers */
.menu-section::-webkit-scrollbar,
.order-section::-webkit-scrollbar {
  width: 8px;
}

.menu-section::-webkit-scrollbar-thumb,
.order-section::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>
