<template>
  <div id="app">
    <nav class="sidebar">
      <router-link to="/order" class="nav-link" active-class="active-link">
        🧾 Take Order
      </router-link>
      <router-link to="/history" class="nav-link" active-class="active-link">
        📜 Order History
      </router-link>
      <router-link to="/dashboard" class="nav-link" active-class="active-link">
        Dashboard
      </router-link>
      <router-link to="/customer-history" class="nav-link" active-class="active-link">
        View Customer History
      </router-link>
    </nav>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
// no script needed here
</script>

<style>
#app {
  display: flex;
  min-height: 100vh;
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(180deg, #137a75 0%, #80d0c7 100%);
}

/* Sidebar vertical navigation */
.sidebar {
  width: 220px;
  background: linear-gradient(180deg, #13547a 0%, #80d0c7 100%);
  display: flex;
  flex-direction: column;
  padding: 50px 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

/* Nav link styling */
.nav-link {
  color: #e0f0f9;
  font-weight: 600;
  font-size: 18px;
  padding: 15px 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  user-select: none;
}

/* Hover effect */
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* Active link highlight */
.active-link {
  background-color: #0f2c45;
  color: #a1eafb;
  box-shadow: inset 4px 0 0 #a1eafb;
}

/* Main content area */
.content {
  flex: 1;
  padding: 30px 40px;
  background: #fff;
  box-shadow: inset 0 0 10px #ddd;
  overflow-y: auto;
}
</style>
