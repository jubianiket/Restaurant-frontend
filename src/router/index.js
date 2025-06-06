// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import OrderForm from '@/components/OrderForm.vue';
import OrderHistory from '@/components/OrderHistory.vue';
import DashboardComponent from '@/components/DashboardComponent.vue';
import CustomerHistoryComponent from '@/components/CustomerHistoryComponent.vue';

const routes = [
  { path: '/', redirect: '/order' },
  { path: '/order', component: OrderForm },
  { path: '/history', component: OrderHistory },
  { path: '/dashboard', component: DashboardComponent },
  { path: '/customer-history', component: CustomerHistoryComponent }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
