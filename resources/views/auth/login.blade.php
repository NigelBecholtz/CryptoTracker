<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Email Address -->
        <div class="form-control w-full">
            <label class="label">
                <span class="label-text">{{ __('Email') }}</span>
            </label>
            <input id="email" type="email" name="email" value="{{ old('email') }}" 
                class="input input-bordered w-full @error('email') input-error @enderror" 
                required autofocus autocomplete="username" />
            @error('email')
                <label class="label">
                    <span class="label-text-alt text-error">{{ $message }}</span>
                </label>
            @enderror
        </div>

        <!-- Password -->
        <div class="form-control w-full mt-4">
            <label class="label">
                <span class="label-text">{{ __('Password') }}</span>
            </label>
            <input id="password" type="password" name="password" 
                class="input input-bordered w-full @error('password') input-error @enderror" 
                required autocomplete="current-password" />
            @error('password')
                <label class="label">
                    <span class="label-text-alt text-error">{{ $message }}</span>
                </label>
            @enderror
        </div>

        <!-- Remember Me -->
        <div class="form-control mt-4">
            <label class="label cursor-pointer justify-start">
                <input id="remember_me" type="checkbox" name="remember" class="checkbox checkbox-primary mr-2" />
                <span class="label-text">{{ __('Remember me') }}</span>
            </label>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mt-6">
            @if (Route::has('password.request'))
                <a class="link link-hover text-sm" href="{{ route('password.request') }}">
                    {{ __('Forgot your password?') }}
                </a>
            @endif

            <button type="submit" class="btn btn-primary w-full sm:w-auto mt-4 sm:mt-0">
                {{ __('Log in') }}
            </button>
        </div>
        
        <div class="divider my-6">OR</div>
        
        <div class="text-center">
            <a href="{{ route('register') }}" class="btn btn-outline btn-block">
                {{ __('Create New Account') }}
            </a>
        </div>
    </form>
</x-guest-layout>
