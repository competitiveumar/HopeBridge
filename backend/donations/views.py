from rest_framework import viewsets, status, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django.conf import settings
from django.db.models import Q
import stripe
import logging
from .models import Project, Donation, FundAllocation, CartItem, Payment
from .serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
    DonationSerializer,
    FundAllocationSerializer,
    CartItemSerializer,
    PaymentSerializer,
    PaymentIntentSerializer
)
from rest_framework.views import APIView

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location', 'categories', 'organization']
    ordering_fields = ['created_at', 'raised', 'goal']
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(categories__contains=[category])

        # Filter by location
        location = self.request.query_params.get('location')
        if location and location != 'All':
            queryset = queryset.filter(location__icontains=location)

        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param and status_param != 'All':
            queryset = queryset.filter(status=status_param.lower())

        # Sort by
        sort = self.request.query_params.get('sort')
        if sort:
            if sort == 'Most Funded':
                queryset = queryset.order_by('-raised')
            elif sort == 'Newest':
                queryset = queryset.order_by('-created_at')
            elif sort == 'Most Urgent':
                queryset = queryset.filter(status='urgent').order_by('-created_at')
            # Default is 'Most Relevant' which is handled by the database's default ordering

        return queryset

    @action(detail=True, methods=['post'])
    def donate(self, request, pk=None):
        project = self.get_object()
        amount = request.data.get('amount')
        
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except (TypeError, ValueError):
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Create a donation serializer
            donation_data = {
                'project': project.id,
                'amount': amount,
                'anonymous': request.data.get('anonymous', False),
                'message': request.data.get('message', '')
            }
            
            # Add donor if authenticated
            if request.user.is_authenticated:
                donation_data['donor'] = request.user.id
            else:
                # For anonymous users, require email
                email = request.data.get('email')
                if not email:
                    return Response(
                        {'error': 'Email is required for non-authenticated users'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                donation_data['email'] = email
            
            serializer = DonationSerializer(data=donation_data)
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create Stripe payment intent
            metadata = {
                'project_id': project.id,
                'donation_data': str(donation_data)
            }
            if request.user.is_authenticated:
                metadata['user_id'] = request.user.id
                
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency='usd',
                metadata=metadata
            )
            
            # Save payment ID to donation
            donation = serializer.save(payment_id=intent.id)

            return Response({
                'client_secret': intent.client_secret,
                'donation_id': donation.id
            })

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Donation error: {str(e)}")
            return Response(
                {'error': 'An error occurred processing your donation'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DonationViewSet(viewsets.ModelViewSet):
    serializer_class = DonationSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'webhook']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Donation.objects.all()
        if self.request.user.is_authenticated:
            return Donation.objects.filter(donor=self.request.user)
        return Donation.objects.none()

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        donation = self.get_object()
        
        try:
            payment_intent = stripe.PaymentIntent.retrieve(
                donation.payment_id
            )

            if payment_intent.status == 'succeeded':
                donation.status = 'completed'
                donation.save()
                return Response({'status': 'payment confirmed'})
            
            return Response(
                {'error': 'Payment not completed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def webhook(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
            
            # Handle the event
            if event['type'] == 'payment_intent.succeeded':
                payment_intent = event['data']['object']
                self._handle_payment_success(payment_intent)
            elif event['type'] == 'payment_intent.payment_failed':
                payment_intent = event['data']['object']
                self._handle_payment_failure(payment_intent)
                
            return Response({'status': 'success'})
            
        except ValueError as e:
            logger.error(f"Invalid payload: {str(e)}")
            return Response(
                {'error': 'Invalid payload'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid signature: {str(e)}")
            return Response(
                {'error': 'Invalid signature'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Webhook error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _handle_payment_success(self, payment_intent):
        try:
            donation = Donation.objects.get(payment_id=payment_intent['id'])
            donation.status = 'completed'
            donation.save()
            logger.info(f"Payment succeeded for donation {donation.id}")
        except Donation.DoesNotExist:
            logger.error(f"Donation not found for payment {payment_intent['id']}")
    
    def _handle_payment_failure(self, payment_intent):
        try:
            donation = Donation.objects.get(payment_id=payment_intent['id'])
            donation.status = 'failed'
            donation.save()
            logger.info(f"Payment failed for donation {donation.id}")
        except Donation.DoesNotExist:
            logger.error(f"Donation not found for payment {payment_intent['id']}")

class FundAllocationViewSet(viewsets.ModelViewSet):
    queryset = FundAllocation.objects.all()
    serializer_class = FundAllocationSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()] 

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        session_id = self.request.query_params.get('session_id')
        
        if user.is_authenticated:
            # For authenticated users, get items by user
            return CartItem.objects.filter(user=user)
        elif session_id:
            # For anonymous users, get items by session
            return CartItem.objects.filter(session_id=session_id)
        else:
            # No user or session, return empty queryset
            return CartItem.objects.none()
    
    def perform_create(self, serializer):
        user = self.request.user
        session_id = self.request.data.get('session_id')
        
        if user.is_authenticated:
            serializer.save(user=user)
        else:
            serializer.save(session_id=session_id)
    
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """
        Process checkout for all items in cart
        """
        user = request.user
        session_id = request.data.get('session_id')
        
        # Get cart items
        if user.is_authenticated:
            cart_items = CartItem.objects.filter(user=user)
        elif session_id:
            cart_items = CartItem.objects.filter(session_id=session_id)
        else:
            return Response(
                {'error': 'User must be authenticated or provide a session ID'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not cart_items.exists():
            return Response(
                {'error': 'No items in cart'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get payment data
        payment_method = request.data.get('payment_method')
        if not payment_method:
            return Response(
                {'error': 'Payment method is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate total amount
        total_amount = sum(item.amount * item.quantity for item in cart_items)
        
        try:
            # Create Stripe payment intent
            intent = stripe.PaymentIntent.create(
                amount=int(total_amount * 100),  # Convert to cents
                currency='usd',
                payment_method_types=['card'],
                metadata={
                    'user_id': str(user.id) if user.is_authenticated else None,
                    'session_id': session_id,
                    'is_cart': 'true'
                }
            )
            
            # Create donations for each cart item
            donations = []
            for item in cart_items:
                # Create donation
                donation_data = {
                    'amount': float(item.amount * item.quantity),
                    'nonprofit': item.nonprofit,
                    'payment_id': intent.id,
                    'payment_provider': 'stripe',
                    'status': 'pending',
                    'is_recurring': item.is_recurring,
                    'recurring_frequency': item.recurring_frequency if item.is_recurring else None,
                    'gift_card': item.gift_card
                }
                
                if user.is_authenticated:
                    donation_data['donor'] = user
                    donation_data['donor_email'] = user.email
                    donation_data['donor_name'] = f"{user.first_name} {user.last_name}"
                else:
                    donation_data['donor_email'] = request.data.get('email')
                    donation_data['donor_name'] = request.data.get('name')
                
                donation = Donation.objects.create(**donation_data)
                donations.append(donation)
            
            # Clear cart
            cart_items.delete()
            
            return Response({
                'client_secret': intent.client_secret,
                'donation_ids': [donation.id for donation in donations]
            })
            
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error processing checkout: {str(e)}")
            return Response(
                {'error': 'An error occurred while processing your donation'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def add_gift_card(self, request):
        """
        Add a gift card to cart items
        """
        user = request.user
        session_id = request.data.get('session_id')
        gift_card_code = request.data.get('gift_card_code')
        
        if not gift_card_code:
            return Response(
                {'error': 'Gift card code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get cart items
        if user.is_authenticated:
            cart_items = CartItem.objects.filter(user=user)
        elif session_id:
            cart_items = CartItem.objects.filter(session_id=session_id)
        else:
            return Response(
                {'error': 'User must be authenticated or provide a session ID'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not cart_items.exists():
            return Response(
                {'error': 'No items in cart'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get gift card
        try:
            from gift_cards.models import GiftCard
            gift_card = GiftCard.objects.get(code=gift_card_code, is_redeemed=False)
        except GiftCard.DoesNotExist:
            return Response(
                {'error': 'Invalid or already redeemed gift card'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Apply gift card to all cart items
        for item in cart_items:
            item.gift_card = gift_card
            item.save()
        
        return Response({
            'success': True,
            'message': f'Gift card {gift_card_code} applied to cart',
            'amount': float(gift_card.amount)
        })

class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def post(self, request):
        serializer = PaymentIntentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                amount = int(float(serializer.validated_data['amount']) * 100)  # Convert to cents
                currency = serializer.validated_data['currency'].lower()
                payment_method_id = serializer.validated_data['payment_method_id']
                is_recurring = serializer.validated_data.get('is_recurring', False)
                recurring_frequency = serializer.validated_data.get('recurring_frequency', None)
                donation_id = serializer.validated_data.get('donation_id', None)
                email = serializer.validated_data.get('email', None)
                name = serializer.validated_data.get('name', None)
                
                # Create metadata for the payment intent
                metadata = {
                    'is_recurring': str(is_recurring),
                }
                
                if recurring_frequency:
                    metadata['recurring_frequency'] = recurring_frequency
                
                if donation_id:
                    metadata['donation_id'] = str(donation_id)
                
                # Create customer if email is provided
                customer = None
                if email:
                    # Check if customer already exists
                    customers = stripe.Customer.list(email=email, limit=1)
                    
                    if customers.data:
                        customer = customers.data[0]
                    else:
                        # Create new customer
                        customer_data = {'email': email}
                        if name:
                            customer_data['name'] = name
                        
                        customer = stripe.Customer.create(**customer_data)
                
                # Create the payment intent
                intent_data = {
                    'amount': amount,
                    'currency': currency,
                    'payment_method': payment_method_id,
                    'confirmation_method': 'manual',
                    'confirm': True,
                    'metadata': metadata,
                    'return_url': f"{settings.FRONTEND_URL}/payment-success",
                }
                
                # Add customer if exists
                if customer:
                    intent_data['customer'] = customer.id
                
                # Handle recurring payments
                if is_recurring:
                    # For recurring payments, we would create a subscription
                    # This is simplified for the example
                    pass
                
                intent = stripe.PaymentIntent.create(**intent_data)
                
                logger.info(f"Created payment intent: {intent.id}")
                
                # Create Payment record in our database
                payment = Payment.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    donation_id=donation_id,
                    payment_intent_id=intent.id,
                    payment_method_id=payment_method_id,
                    amount=serializer.validated_data['amount'],
                    currency=serializer.validated_data['currency'],
                    status='pending',
                    payment_method='stripe',
                    is_recurring=is_recurring,
                    recurring_frequency=recurring_frequency,
                    billing_email=email,
                    billing_name=name,
                    metadata={
                        'stripe_status': intent.status,
                        'client_secret': intent.client_secret,
                    }
                )
                
                # Check if payment requires additional action
                if intent.status == 'requires_action':
                    return Response({
                        'requires_action': True,
                        'payment_intent_client_secret': intent.client_secret,
                        'payment_id': payment.id,
                    })
                elif intent.status == 'succeeded':
                    # Update payment status
                    payment.status = 'completed'
                    payment.save()
                    
                    return Response({
                        'success': True,
                        'payment_id': payment.id,
                        'reference_number': payment.reference_number,
                    })
                else:
                    # Payment failed
                    payment.status = 'failed'
                    payment.save()
                    
                    return Response({
                        'error': f"Payment failed with status: {intent.status}"
                    }, status=status.HTTP_400_BAD_REQUEST)
                
            except stripe.error.StripeError as e:
                logger.error(f"Stripe error: {str(e)}")
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StripeWebhookView(APIView):
    permission_classes = []
    authentication_classes = []
    
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET
        
        logger.info(f"Received webhook with signature: {sig_header}")
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
            logger.info(f"Webhook event type: {event['type']}")
            
        except ValueError as e:
            logger.error(f"Invalid payload: {str(e)}")
            return Response({"error": "Invalid payload"}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid signature: {str(e)}")
            return Response({"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle specific events
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            logger.info(f"Payment succeeded: {payment_intent['id']}")
            
            # Update payment in database
            try:
                payment = Payment.objects.get(payment_intent_id=payment_intent['id'])
                payment.status = 'completed'
                payment.save()
                logger.info(f"Updated payment {payment.id} status to completed")
                
                # Process donation if applicable
                if payment.donation:
                    donation = payment.donation
                    donation.status = 'completed'
                    donation.save()
                    logger.info(f"Updated donation {donation.id} status to completed")
            except Payment.DoesNotExist:
                logger.warning(f"Payment not found for payment intent: {payment_intent['id']}")
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            logger.info(f"Payment failed: {payment_intent['id']}")
            
            # Update payment in database
            try:
                payment = Payment.objects.get(payment_intent_id=payment_intent['id'])
                payment.status = 'failed'
                payment.save()
                logger.info(f"Updated payment {payment.id} status to failed")
            except Payment.DoesNotExist:
                logger.warning(f"Payment not found for payment intent: {payment_intent['id']}")
        
        return Response({"success": True}, status=status.HTTP_200_OK) 