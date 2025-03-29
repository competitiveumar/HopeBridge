# Testing Stripe Integration in HopeBridge

This document outlines how to test the Stripe payment integration on the HopeBridge checkout page.

## Stripe Test Keys

The application is configured with the following Stripe test keys:

- **Publishable Key**: `pk_test_51QHsF0G1gQ9FCYqU9uxmuDnYM7j2JHHsatURg9MoIuU9fTtpQIxBkY3loT8upksRxJcrg0m4dnkmWEg9lz4QhisR00dVkROIrX`
- **Secret Key**: `sk_test_51QHsF0G1gQ9FCYqUnQ6bmG4vAGvzQCyfq0POT5X8DWQW0SK2b8sOD82CDLgKTQ9j9v32HjxjQ8zHgmym8fDzHwVF00s43JVUJm`

## Testing Credit Card Payments

### Test Card Information

Use the following test card details to simulate different payment scenarios:

- **Successful payment**:
  - Card Number: `4242 4242 4242 4242`
  - Expiry Date: Any future date
  - CVV: Any 3 digits
  - ZIP: Any 5 digits

- **Payment requiring authentication**:
  - Card Number: `4000 0025 0000 3155`
  - Expiry Date: Any future date
  - CVV: Any 3 digits
  - ZIP: Any 5 digits

- **Payment that will be declined**:
  - Card Number: `4000 0000 0000 0002`
  - Expiry Date: Any future date
  - CVV: Any 3 digits
  - ZIP: Any 5 digits

## Setting Up the Stripe CLI for Webhook Testing

1. **Download and Install the Stripe CLI**:
   - Visit [Stripe CLI](https://stripe.com/docs/stripe-cli) and follow installation instructions for your OS

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward Webhook Events to Your Local Server**:
   ```bash
   stripe listen --forward-to localhost:8000/api/donations/webhook/stripe/
   ```
   This command will output a webhook signing secret. If needed, update the `STRIPE_WEBHOOK_SECRET` in your `.env` file with this value.

4. **Trigger Test Events**:
   ```bash
   stripe trigger payment_intent.succeeded
   ```
   ```bash
   stripe trigger payment_intent.payment_failed
   ```

## Testing Flow

1. Add items to your cart
2. Proceed to checkout
3. Fill in the payment form with one of the test cards
4. Complete the payment
5. Check for successful navigation to the payment success page
6. Verify webhook functionality by monitoring the terminal where you're running the Stripe CLI

## Troubleshooting

- Ensure both the frontend and backend servers are running
- Check your browser console for errors
- Verify the backend server logs for any issues with Stripe API calls
- Make sure the webhook endpoint is accessible to the Stripe CLI

## Notes

- All payments made with the test keys will not result in actual charges
- To view test payments, log in to your [Stripe Dashboard](https://dashboard.stripe.com/test/payments) 