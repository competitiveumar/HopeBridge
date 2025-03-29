// Fixed gift card codes with their corresponding amounts
export const VALID_GIFT_CARDS = {
  'HOPE25': { amount: 25, isUsed: false },
  'GIVE50': { amount: 50, isUsed: false },
  'CARE75': { amount: 75, isUsed: false },
  'HELP100': { amount: 100, isUsed: false }
};

// Function to validate a gift card code
export const validateGiftCard = (code) => {
  const giftCard = VALID_GIFT_CARDS[code];
  
  if (!giftCard) {
    return {
      isValid: false,
      message: 'Invalid gift card code',
      amount: 0
    };
  }

  if (giftCard.isUsed) {
    return {
      isValid: false,
      message: 'Gift card has already been used',
      amount: 0
    };
  }

  return {
    isValid: true,
    message: 'Gift card is valid',
    amount: giftCard.amount
  };
};

// Function to mark a gift card as used
export const markGiftCardAsUsed = (code) => {
  if (VALID_GIFT_CARDS[code]) {
    VALID_GIFT_CARDS[code].isUsed = true;
    return true;
  }
  return false;
};

// Function to reset a gift card (for testing purposes)
export const resetGiftCard = (code) => {
  if (VALID_GIFT_CARDS[code]) {
    VALID_GIFT_CARDS[code].isUsed = false;
    return true;
  }
  return false;
}; 