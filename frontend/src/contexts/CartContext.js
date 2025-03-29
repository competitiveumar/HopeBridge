import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize state from localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  
  const [isRecurring, setIsRecurring] = useState(() => {
    try {
      const savedRecurring = localStorage.getItem('isRecurring');
      return savedRecurring ? JSON.parse(savedRecurring) : false;
    } catch (error) {
      return false;
    }
  });
  
  const [recurringFrequency, setRecurringFrequency] = useState(() => {
    try {
      const savedFrequency = localStorage.getItem('recurringFrequency');
      return savedFrequency || 'monthly';
    } catch (error) {
      return 'monthly';
    }
  });
  
  const [giftCard, setGiftCard] = useState(() => {
    try {
      const savedGiftCard = localStorage.getItem('giftCard');
      return savedGiftCard ? JSON.parse(savedGiftCard) : null;
    } catch (error) {
      return null;
    }
  });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      localStorage.setItem('isRecurring', JSON.stringify(isRecurring));
      localStorage.setItem('recurringFrequency', recurringFrequency);
      if (giftCard) {
        localStorage.setItem('giftCard', JSON.stringify(giftCard));
      } else {
        localStorage.removeItem('giftCard');
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems, isRecurring, recurringFrequency, giftCard]);
  
  const addToCart = (item) => {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.id === item.id
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: updatedCartItems[existingItemIndex].quantity + (item.quantity || 1)
      };
      setCartItems(updatedCartItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...item, quantity: item.quantity || 1 }]);
    }
  };
  
  // Method specifically for handling donations to a charity/project
  const addOrUpdateDonation = (donationItem) => {
    // Find if we already have a donation for this project
    const existingDonationIndex = cartItems.findIndex(
      item => item.type === 'donation' && item.projectId === donationItem.projectId
    );
    
    if (existingDonationIndex !== -1) {
      // If donation exists, update it
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingDonationIndex] = {
        ...donationItem,
        id: cartItems[existingDonationIndex].id // Preserve the original ID
      };
      setCartItems(updatedCartItems);
      return 'updated';
    } else {
      // Add new donation to cart
      setCartItems([...cartItems, donationItem]);
      return 'added';
    }
  };
  
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };
  
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCartItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCartItems);
  };
  
  const clearCart = () => {
    setCartItems([]);
    setGiftCard(null);
    setIsRecurring(false);
    localStorage.removeItem('cart');
    localStorage.removeItem('giftCard');
    localStorage.removeItem('isRecurring');
  };
  
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  const addGiftCard = (card) => {
    setGiftCard(card);
  };
  
  const removeGiftCard = () => {
    setGiftCard(null);
  };
  
  const toggleRecurring = () => {
    setIsRecurring(!isRecurring);
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        isRecurring,
        recurringFrequency,
        giftCard,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSubtotal,
        getTotalItems,
        addGiftCard,
        removeGiftCard,
        toggleRecurring,
        setRecurringFrequency,
        addOrUpdateDonation
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 