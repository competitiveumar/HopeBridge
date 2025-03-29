from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import GiftCardDesign, GiftCard, GiftCardRedemption
from .serializers import GiftCardDesignSerializer, GiftCardSerializer, GiftCardRedemptionSerializer

class GiftCardDesignViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for gift card designs
    """
    queryset = GiftCardDesign.objects.filter(is_active=True)
    serializer_class = GiftCardDesignSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

class GiftCardViewSet(viewsets.ModelViewSet):
    """
    API endpoint for gift cards
    """
    serializer_class = GiftCardSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'sender_name', 'recipient_name', 'recipient_email']
    ordering_fields = ['purchased_at', 'expiration_date', 'amount']
    ordering = ['-purchased_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return GiftCard.objects.all()
        elif user.is_authenticated:
            return GiftCard.objects.filter(created_by=user)
        return GiftCard.objects.none()
    
    def get_permissions(self):
        if self.action in ['create', 'validate_code']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['post'], url_path='validate')
    def validate_code(self, request):
        """Validate a gift card code"""
        code = request.data.get('code')
        if not code:
            return Response(
                {'error': 'Gift card code is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            gift_card = GiftCard.objects.get(code=code)
            if gift_card.is_valid():
                serializer = self.get_serializer(gift_card)
                return Response(serializer.data)
            return Response(
                {'error': 'Gift card is no longer valid'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except GiftCard.DoesNotExist:
            return Response(
                {'error': 'Invalid gift card code'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], url_path='user')
    def user_gift_cards(self, request):
        """Get all gift cards for the authenticated user"""
        user = request.user
        if not user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get gift cards created by the user
        gift_cards = GiftCard.objects.filter(created_by=user)
        serializer = self.get_serializer(gift_cards, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='redeemed')
    def redeemed_gift_cards(self, request):
        """Get all gift cards redeemed by the authenticated user"""
        user = request.user
        if not user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get gift cards redeemed by the user
        gift_cards = GiftCard.objects.filter(redeemed_by=user)
        serializer = self.get_serializer(gift_cards, many=True)
        return Response(serializer.data)

class GiftCardRedemptionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for gift card redemptions
    """
    serializer_class = GiftCardRedemptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return GiftCardRedemption.objects.all()
        return GiftCardRedemption.objects.filter(redeemed_by=user)
    
    def perform_create(self, serializer):
        serializer.save(redeemed_by=self.request.user)
