<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoTracker - Advanced Crypto Analytics</title>
    
    <!-- Tailwind CSS and DaisyUI -->
    <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- AOS CSS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>
<body class="bg-base-200 min-h-screen">
    <!-- Navigation -->
    <div class="fixed top-0 left-0 right-0 z-50">
        <div class="navbar bg-base-100 shadow-xl animate-slide-in">
            <div class="navbar-start">
                <!-- Add mobile menu drawer -->
                <div class="dropdown lg:hidden">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                        <i class="fas fa-bars"></i>
                    </div>
                    <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                        <li><a href="{{ route('markets') }}">Markets</a></li>
                        <li><a href="{{ route('portfolio') }}">Portfolio</a></li>
                    </ul>
                </div>
                <a href="{{ route('landing') }}" class="btn btn-ghost text-xl">
                    <i class="fas fa-chart-line mr-2"></i>
                    <span class="hidden sm:inline">CryptoTracker</span>
                </a>
            </div>
            <div class="navbar-center hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                    <li><a href="{{ route('markets') }}">Markets</a></li>
                    <li><a href="{{ route('portfolio') }}">Portfolio</a></li>
                </ul>
            </div>
            <div class="navbar-end">
                <div class="flex items-center space-x-4">
                    @auth
                        <button class="btn btn-ghost btn-circle">
                            <i class="fas fa-bell"></i>
                        </button>
                        <div class="dropdown dropdown-end">
                            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                                <div class="w-10 rounded-full">
                                    <img alt="User Avatar" src="https://avatars.dicebear.com/api/avataaars/cryptouser.svg" />
                                </div>
                            </div>
                            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                                <li><a href="{{ route('markets') }}">Markets</a></li>
                                <li><a href="{{ route('portfolio') }}">Portfolio</a></li>
                                <li><form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit">Logout</button>
                                </form></li>
                            </ul>
                        </div>
                    @else
                        <a href="{{ route('login') }}" class="btn btn-ghost">Login</a>
                        <a href="{{ route('register') }}" class="btn btn-primary">Register</a>
                    @endauth
                </div>
            </div>
        </div>
    </div>
 
    <!-- Hero Section -->
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="lg:w-1/2" data-aos="fade-left" data-aos-duration="1000">
                <img src="https://placehold.co/600x400/3d4451/ffffff?text=Crypto+Analytics"
                     class="rounded-lg shadow-2xl animate-float"
                     alt="Crypto Analytics Dashboard Preview" />
            </div>
            <div class="lg:w-1/2" data-aos="fade-right" data-aos-duration="1000">
                <h1 class="text-5xl font-bold animate-gradient bg-clip-text text-transparent">
                    Track. Analyze. Profit.
                </h1>
                <p class="py-6 text-lg animate-fade-up" style="animation-delay: 0.3s;">
                    Advanced cryptocurrency tracking and portfolio management with real-time analytics, AI-powered insights, and gamified learning experience.
                </p>
                <div class="flex flex-wrap gap-4">
                    <button class="btn btn-primary hover-scale animate-fade-up" style="animation-delay: 0.5s;">
                        <i class="fas fa-rocket mr-2"></i>
                        Get Started
                    </button>
                    <button class="btn btn-outline hover-scale animate-fade-up" style="animation-delay: 0.7s;">
                        <i class="fas fa-play mr-2"></i>
                        Watch Demo
                    </button>
                </div>
                <div class="stats shadow mt-8">
                    <div class="stat">
                        <div class="stat-title">Active Users</div>
                        <div class="stat-value text-primary">25.6K</div>
                        <div class="stat-desc">21% more than last month</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title">Portfolio Tracked</div>
                        <div class="stat-value text-secondary">$4.2B</div>
                        <div class="stat-desc">↗︎ 400 (22%)</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 
    <!-- Features Section -->
    <div class="py-20 bg-base-100">
        <div class="container mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-12" data-aos="fade-up">Why Choose CryptoTracker?</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature Card 1 -->
                <div class="card bg-base-200 shadow-xl hover-scale" data-aos="fade-up" data-aos-delay="100">
                    <div class="card-body">
                        <div class="text-4xl text-primary mb-4 animate-pulse-slow">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3 class="card-title">Real-Time Analytics</h3>
                        <p>Track your portfolio with advanced real-time analytics and market insights powered by AI.</p>
                    </div>
                </div>
                
                <!-- Feature Card 2 -->
                <div class="card bg-base-200 shadow-xl hover-scale" data-aos="fade-up" data-aos-delay="200">
                    <div class="card-body">
                        <div class="text-4xl text-secondary mb-4 animate-pulse-slow">
                            <i class="fas fa-gamepad"></i>
                        </div>
                        <h3 class="card-title">Gamified Learning</h3>
                        <p>Learn while you earn! Complete challenges, earn XP, and unlock achievements as you master crypto trading.</p>
                    </div>
                </div>
                
                <!-- Feature Card 3 -->
                <div class="card bg-base-200 shadow-xl hover-scale" data-aos="fade-up" data-aos-delay="300">
                    <div class="card-body">
                        <div class="text-4xl text-accent mb-4 animate-pulse-slow">
                            <i class="fas fa-robot"></i>
                        </div>
                        <h3 class="card-title">AI Predictions</h3>
                        <p>Get smart trading suggestions and market predictions powered by advanced machine learning algorithms.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
 
    <!-- Live Market Section -->
    <div class="py-20 bg-base-200">
        <div class="container mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-12" data-aos="fade-up">Live Market Overview</h2>
            <div class="overflow-x-auto" data-aos="fade-up" data-aos-delay="200">
                <table class="table w-full">
                    <thead>
                        <tr>
                            <th>Coin</th>
                            <th>Price</th>
                            <th>24h Change</th>
                            <th>Market Cap</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="hover">
                            <td>
                                <div class="flex items-center space-x-3">
                                    <div class="avatar">
                                        <div class="mask mask-squircle w-12 h-12">
                                            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold">Bitcoin</div>
                                        <div class="text-sm opacity-50">BTC</div>
                                    </div>
                                </div>
                            </td>
                            <td>$45,678</td>
                            <td class="text-success">+2.3%</td>
                            <td>$876B</td>
                            <td>
                                <button class="btn btn-primary btn-sm">Track</button>
                            </td>
                        </tr>
                        <tr class="hover">
                            <td>
                                <div class="flex items-center space-x-3">
                                    <div class="avatar">
                                        <div class="mask mask-squircle w-12 h-12">
                                            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Ethereum" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold">Ethereum</div>
                                        <div class="text-sm opacity-50">ETH</div>
                                    </div>
                                </div>
                            </td>
                            <td>$3,245</td>
                            <td class="text-error">-1.2%</td>
                            <td>$389B</td>
                            <td>
                                <button class="btn btn-primary btn-sm">Track</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
 
    <!-- CTA Section -->
    <div class="py-20 bg-base-100">
        <div class="container mx-auto px-4">
            <div class="card bg-primary text-primary-content animate-gradient">
                <div class="card-body text-center" data-aos="zoom-in">
                    <h2 class="card-title text-3xl justify-center mb-4">Ready to Start Your Crypto Journey?</h2>
                    <p class="mb-6">Join thousands of traders who are already using CryptoTracker to optimize their trading strategy.</p>
                    <div class="card-actions justify-center">
                        <button class="btn btn-secondary hover-scale">
                            <i class="fas fa-user-plus mr-2"></i>
                            Create Free Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
 
    <!-- Footer -->
    <footer class="footer p-10 bg-base-200 text-base-content">
        <div>
            <span class="footer-title">Product</span>
            <a class="link link-hover">Features</a>
            <a class="link link-hover">Pricing</a>
            <a class="link link-hover">Tutorial</a>
        </div>
        <div>
            <span class="footer-title">Company</span>
            <a class="link link-hover">About us</a>
            <a class="link link-hover">Contact</a>
            <a class="link link-hover">Press kit</a>
        </div>
        <div>
            <span class="footer-title">Legal</span>
            <a class="link link-hover">Terms of use</a>
            <a class="link link-hover">Privacy policy</a>
            <a class="link link-hover">Cookie policy</a>
        </div>
        <div>
            <span class="footer-title">Social</span>
            <div class="grid grid-flow-col gap-4">
                <a class="text-2xl"><i class="fab fa-twitter"></i></a>
                <a class="text-2xl"><i class="fab fa-youtube"></i></a>
                <a class="text-2xl"><i class="fab fa-facebook"></i></a>
            </div>
        </div>
    </footer>
 
    <!-- Scripts -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="{{ asset('js/api.js') }}"></script>
    <script src="{{ asset('js/chart.js') }}"></script>
    <script src="{{ asset('js/gamification.js') }}"></script>
    <script>
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true
        });
    </script>
</body>
</html>