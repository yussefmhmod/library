from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Profile
import json


@csrf_exempt
def signup(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'}, status=405)
    try:
        data             = json.loads(request.body)
        username         = data.get('username', '').strip()
        email            = data.get('email', '').strip()
        password         = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        is_admin         = data.get('is_admin', False)

        if not username:
            return JsonResponse({'error': 'Username is required'}, status=400)
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        # ── uniqueness checks ──────────────────────────────────────────────
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already taken'}, status=400)

        # FIX: prevent same email being used for multiple accounts
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'An account with this email already exists'}, status=400)

        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({'error': list(e.messages)}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        Profile.objects.create(user=user, is_admin=is_admin)
        return JsonResponse({'message': 'User created successfully'}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def loginn(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'}, status=405)
    try:
        data     = json.loads(request.body)
        username = data.get('username', '')
        password = data.get('password', '')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            profile = Profile.objects.get(user=user)
            return JsonResponse({
                'message':  'Logged in successfully',
                'is_admin': bool(profile.is_admin),
                'username': user.username,
            })
        return JsonResponse({'error': 'Wrong username or password'}, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def logoutt(request):
    """Log the current session user out."""
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'})


def get_Active_User(request):
    """
    FIX: was using order_by("-last_login") which returned the same user for
    every visitor.  Now correctly reads from the Django session.
    """
    if request.user.is_authenticated:
        return JsonResponse({'username': request.user.username})
    return JsonResponse({'error': 'Not logged in'}, status=401)
