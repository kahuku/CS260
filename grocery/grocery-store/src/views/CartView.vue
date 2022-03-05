<template>
<div>
    <h1 class="center">Cart</h1>
    <p v-if="this.$root.$data.cart.length === 0" class="center">Cart is empty</p>
    <CartList :products="cart" />
</div>
</template>

<script>
import CartList from '../components/CartList.vue'
export default {
    name: 'CartView',
    components: {
        CartList
    },
    computed: {
        cart() {
            return this.$root.$data.cart;
        }
    }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 50%;
}

form {
  display: table;
  width: 100%;
}

i {
  display: table-cell;
  padding-left: 10px;
  width: 1px;
}

input {
  display: table-cell;
  font-size: 20px;
  border: none !important;
  box-shadow: none !important;
  width: 100%;
  height: 40px;
}

.center {
    text-align: center;
}
</style>