<div class="navbar bg-base-100">
    <div class="navbar-start">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                <i class="fas fa-bars"></i>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a href="{{ route('home') }}">Home</a></li>
                <li><a href="{{ route('market') }}">Market</a></li>
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
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><a href="{{ route('market') }}">Market</a></li>
            <li><a href="{{ route('portfolio') }}">Portfolio</a></li>
        </ul>
    </div>
    <div class="navbar-end">
        <div class="flex items-center space-x-4">
            @auth
                <!-- Wallet Balance - Consistently displayed on all pages -->
                <div class="hidden sm:flex items-center gap-2">
                    <i class="fas fa-wallet text-primary"></i>
                    <span class="text-primary font-semibold wallet-balance">€{{ number_format(Auth::user()->wallet_balance, 2) }}</span>
                </div>
            @endauth
            <button class="btn btn-ghost btn-circle">
                <i class="fas fa-bell"></i>
            </button>
            <div class="dropdown dropdown-end">
                <!-- User dropdown menu -->
                <!-- ... -->
            </div>
        </div>
    </div>
</div>