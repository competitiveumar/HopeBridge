import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [giftCard, setGiftCard] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Add new function for handling donations
  const addOrUpdateDonation = (donationItem) => {
    // Check if a donation for this project already exists
    const existingItemIndex = cartItems.findIndex(
      item => item.type === 'donation' && item.projectId === donationItem.projectId
    );
    
    let result = 'added';
    
    if (existingItemIndex !== -1) {
      // Update existing donation
      setCartItems(prev => 
        prev.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, price: donationItem.price, amount: donationItem.amount }
            : item
        )
      );
      result = 'updated';
    } else {
      // Add new donation
      setCartItems(prev => [...prev, donationItem]);
    }
    
    return result;
  };

  // Toggle recurring donation
  const toggleRecurring = () => {
    setIsRecurring(!isRecurring);
  };

  // Add gift card
  const addGiftCard = (card) => {
    setGiftCard(card);
  };

  // Remove gift card
  const removeGiftCard = () => {
    setGiftCard(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getTotalItems,
        addOrUpdateDonation,
        isRecurring,
        toggleRecurring,
        recurringFrequency,
        setRecurringFrequency,
        giftCard,
        addGiftCard,
        removeGiftCard
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 