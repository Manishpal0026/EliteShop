import { createSlice } from '@reduxjs/toolkit';

// ==========================================
// GET CART FROM LOCAL STORAGE
// ==========================================

const savedCart = localStorage.getItem('cartItems');

let parsedCart = [];

try {
  parsedCart = savedCart ? JSON.parse(savedCart) : [];

  if (!Array.isArray(parsedCart)) {
    parsedCart = [];
  }
} catch (error) {
  console.error('Error loading cart:', error);
  parsedCart = [];
}


// ==========================================
// NORMALIZE CART ITEMS
// ==========================================

const normalizeCartItem = (item) => {
  const productId = item.productId || item._id;

  const price = Number(item.price) || 0;

  const qty =
    Number(item.qty) ||
    Number(item.quantity) ||
    1;

  return {
    ...item,

    productId,
    price,
    qty: qty > 0 ? qty : 1,

    name:
      item.name ||
      'Unnamed Product',

    imageUrl:
      item.imageUrl ||
      '',
  };
};


const initialState = {
  cartItems: parsedCart.map(normalizeCartItem),
};


// ==========================================
// CART SLICE
// ==========================================

const cartSlice = createSlice({

  name: 'cart',

  initialState,

  reducers: {

    // ======================================
    // ADD TO CART
    // ======================================

    addToCart: (state, action) => {

      const item = normalizeCartItem(action.payload);

      if (!item.productId) {
        console.error('Product ID missing');
        return;
      }

      const existingItem = state.cartItems.find(
        (x) => x.productId === item.productId
      );


      // ====================================
      // PRODUCT ALREADY EXISTS
      // ====================================

      if (existingItem) {

        existingItem.qty =
          Number(item.qty) || 1;

        existingItem.price =
          Number(item.price) || 0;

        existingItem.name =
          item.name || existingItem.name;

        existingItem.imageUrl =
          item.imageUrl || existingItem.imageUrl;

      }

      // ====================================
      // NEW PRODUCT
      // ====================================

      else {

        state.cartItems.push(item);

      }


      // ====================================
      // SAVE TO LOCAL STORAGE
      // ====================================

      localStorage.setItem(
        'cartItems',
        JSON.stringify(state.cartItems)
      );
    },


    // ======================================
    // REMOVE FROM CART
    // ======================================

    removeFromCart: (state, action) => {

      state.cartItems =
        state.cartItems.filter(
          (item) =>
            item.productId !== action.payload
        );

      localStorage.setItem(
        'cartItems',
        JSON.stringify(state.cartItems)
      );
    },


    // ======================================
    // CLEAR CART
    // ======================================

    clearCart: (state) => {

      state.cartItems = [];

      localStorage.removeItem('cartItems');
    },

  },

});


// ==========================================
// EXPORT ACTIONS
// ==========================================

export const {
  addToCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions;


// ==========================================
// EXPORT REDUCER
// ==========================================

export default cartSlice.reducer;

