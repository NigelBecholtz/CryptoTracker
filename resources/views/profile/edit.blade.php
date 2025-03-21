<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - CryptoQuest</title>
    
    <!-- Tailwind CSS and DaisyUI -->
    <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-base-200 min-h-screen">
    <!-- Navigation -->
    <div class="fixed top-0 left-0 right-0 z-50">
        <div class="navbar bg-base-100 shadow-xl">
            <div class="navbar-start">
                <a href="{{ route('landing') }}" class="btn btn-ghost text-xl">
                    <i class="fas fa-chart-line mr-2"></i>
                    <span class="hidden sm:inline">CryptoTracker</span>
                </a>
            </div>
            <div class="navbar-center hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li><a href="{{ route('home') }}" class="active">Home</a></li>
                    <li><a href="{{ route('market') }}">Market</a></li>
                    <li><a href="{{ route('portfolio') }}">Portfolio</a></li>
                </ul>
            </div>
            <div class="navbar-end">
                <div class="flex items-center space-x-4">
                    <button class="btn btn-ghost btn-circle">
                        <i class="fas fa-bell"></i>
                    </button>
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <div class="w-10 rounded-full">
                                <img alt="User Avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=cryptouser" />
                            </div>
                        </div>
                        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a href="{{ route('profile.edit') }}">Profile</a></li>
                            <li><a>Settings</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Profile Content -->
    <div class="container mx-auto px-4 pt-24">
        <!-- Profile Overview -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <!-- Profile Information -->
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-user mr-2"></i>
                        Profile Information
                    </h2>
                    <div class="space-y-2">
                        <div class="text-sm font-bold">Name:</div>
                        <div>{{ Auth::user()->name }}</div>

                        <div class="text-sm font-bold">Email:</div>
                        <div>{{ Auth::user()->email }}</div>
                    </div>
                </div>
            </div>

            <!-- Update Profile Form -->
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-edit mr-2"></i>
                        Update Profile
                    </h2>
                    <form action="{{ route('profile.update') }}" method="POST">
                        @csrf
                        @method('patch')
                        <div class="space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium">Name</label>
                                <input type="text" name="name" id="name" value="{{ Auth::user()->name }}" class="input input-bordered w-full" required>
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium">Email</label>
                                <input type="email" name="email" id="email" value="{{ Auth::user()->email }}" class="input input-bordered w-full" required>
                            </div>
                            <div class="text-right mt-4">
                                <button type="submit" class="btn btn-primary btn-sm">Update Profile</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Change Password -->
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-lock mr-2"></i>
                        Change Password
                    </h2>
                    @if ($errors->updatePassword->any())
                        <div class="alert alert-error mb-4">
                            <ul class="list-disc list-inside">
                                @foreach ($errors->updatePassword->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                    <form method="post" action="{{ route('password.update') }}">
                        @csrf
                        @method('put')
                        <div class="space-y-4">
                            <div>
                                <label for="update_password_current_password" class="block text-sm font-medium">Current Password</label>
                                <input type="password" name="current_password" id="update_password_current_password" 
                                    class="input input-bordered w-full @error('current_password', 'updatePassword') input-error @enderror" required>
                            </div>
                            <div>
                                <label for="update_password_password" class="block text-sm font-medium">New Password</label>
                                <input type="password" name="password" id="update_password_password" 
                                    class="input input-bordered w-full @error('password', 'updatePassword') input-error @enderror" required>
                            </div>
                            <div>
                                <label for="update_password_password_confirmation" class="block text-sm font-medium">Confirm New Password</label>
                                <input type="password" name="password_confirmation" id="update_password_password_confirmation" 
                                    class="input input-bordered w-full" required>
                            </div>
                            <div class="text-right mt-4">
                                <button type="submit" class="btn btn-primary btn-sm">Change Password</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Delete Account -->
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-trash mr-2"></i>
                        Delete Account
                    </h2>
                    <form action="{{ route('profile.destroy') }}" method="POST">
                        @csrf
                        @method('delete')
                        <div class="space-y-4">
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle mr-2"></i>
                                Deleting your account is permanent and cannot be undone.
                            </div>
                            <div class="text-right mt-4">
                                <button type="submit" class="btn btn-error btn-sm">Delete Account</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer p-10 bg-base-100 text-base-content mt-6">
        <div>
            <span class="footer-title">Juridisch</span> 
            <a href="services/Gebruikersvoorwaarden.html" class="link link-hover">Gebruikersvoorwaarden</a>
            <a href="services/Privacybeleid.html" class="link link-hover">Privacybeleid</a>
            <a href="services/cookiebeleid.html" class="link link-hover">Cookiebeleid</a>
        </div>
        <div>
            <span class="footer-title">Resources</span> 
            <a class="link link-hover">Market Analysis</a>
            <a class="link link-hover">Crypto Education</a>
            <a class="link link-hover">Community</a>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https
