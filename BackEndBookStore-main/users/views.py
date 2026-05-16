from django.http import JsonResponse          
from django.contrib.auth.models import User   
from django.contrib.auth import authenticate, login  
from django.views.decorators.csrf import csrf_exempt 
from .models import Profile                  
import json              
                 
# Create your views here.
@csrf_exempt

def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            confirm_password=data.get('confirm_password')
            is_admin = data.get('is_admin' , False)

            if password!=confirm_password:
                return JsonResponse({'error': 'passwords do not match'}, status = 400)
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'this user already exsists'} , status =400)
            
            user = User.objects.create_user(username=username,email=email,password=password)
            Profile.objects.create( user=user , is_admin=is_admin )
            return JsonResponse({'message':'user created successfully'},status=201)
        except Exception as e:
            return JsonResponse({'error':str(e)},status =400)
        
    return JsonResponse({'error': 'only POST allowed'}, status=405)
@csrf_exempt
def loginn(request):
    if request.method=='POST':
        try:
            data = json.loads(request.body)
            username= data.get('username')
            password = data.get('password')

            user = authenticate(request,username=username,password=password)
            if user is not None:
                login(request,user)
                profile = Profile.objects.get(user =user)
                return JsonResponse ({'message':'logged in successfully', 'is_admin':bool(profile.is_admin)})
            else:
                return JsonResponse({'error':'wrong username or password'},status=400)

            
        except Exception as e:
            return JsonResponse({'error': str(e)},status=400)

    return JsonResponse({'error': 'only POST allowed'}, status=405)  

@csrf_exempt 
def get_Active_User(request):
    user =User.objects.order_by("-last_login").first()
    if user.username :
        return JsonResponse({'username': user.username})
    else :

        return JsonResponse({'error' : 'no user was found'},status=401)
            
         
            
            




 
 