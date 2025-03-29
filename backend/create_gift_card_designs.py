import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from gift_cards.models import GiftCardDesign

# Create gift card designs
designs = [
    {
        'name': 'Birthday',
        'is_active': True
    },
    {
        'name': 'Thank You',
        'is_active': True
    },
    {
        'name': 'Holiday',
        'is_active': True
    },
    {
        'name': 'Congratulations',
        'is_active': True
    }
]

def create_gift_card_designs():
    # Delete existing designs
    GiftCardDesign.objects.all().delete()
    print("Deleted existing gift card designs")
    
    # Create new designs
    for design in designs:
        GiftCardDesign.objects.create(
            name=design['name'],
            is_active=design['is_active']
        )
        print(f"Created gift card design: {design['name']}")

if __name__ == "__main__":
    print("Creating gift card designs...")
    create_gift_card_designs()
    print(f"Created {GiftCardDesign.objects.count()} gift card designs") 