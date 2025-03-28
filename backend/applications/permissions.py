from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_staff


class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to view or edit it.
    """
    
    def has_permission(self, request, view):
        # Allow all authenticated users to list and create
        if request.user and request.user.is_authenticated:
            return True
        
        # Anonymous users can only create applications
        return request.method == 'POST'
    
    def has_object_permission(self, request, view, obj):
        # Admin users can do anything
        if request.user and request.user.is_staff:
            return True
        
        # Check if the user is the owner of the application
        if hasattr(obj, 'contact_email'):
            return obj.contact_email == request.user.email
        
        # For application documents, check the parent application
        if hasattr(obj, 'application'):
            return obj.application.contact_email == request.user.email
        
        return False 