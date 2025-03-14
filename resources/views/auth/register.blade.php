<x-guest-layout>
    <form method="POST" action="{{ route('register') }}">
        @csrf

        <!-- Name -->
        <div class="form-control w-full">
            <label class="label">
                <span class="label-text">{{ __('Name') }}</span>
            </label>
            <input id="name" type="text" name="name" value="{{ old('name') }}" 
                class="input input-bordered w-full @error('name') input-error @enderror" 
                required autofocus autocomplete="name" />
            @error('name')
                <label class="label">
                    <span class="label-text-alt text-error">{{ $message }}</span>
                </label>
            @enderror
        </div>

        <!-- Email Address -->
        <div class="form-control w-full mt-4">
            <label class="label">
                <span class="label-text">{{ __('Email') }}</span>
            </label>
            <input id="email" type="email" name="email" value="{{ old('email') }}" 
                class="input input-bordered w-full @error('email') input-error @enderror" 
                required autocomplete="username" />
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
                required autocomplete="new-password" />
            @error('password')
                <label class="label">
                    <span class="label-text-alt text-error">{{ $message }}</span>
                </label>
            @enderror
        </div>

        <!-- Confirm Password -->
        <div class="form-control w-full mt-4">
            <label class="label">
                <span class="label-text">{{ __('Confirm Password') }}</span>
            </label>
            <input id="password_confirmation" type="password" name="password_confirmation" 
                class="input input-bordered w-full @error('password_confirmation') input-error @enderror" 
                required autocomplete="new-password" />
            @error('password_confirmation')
                <label class="label">
                    <span class="label-text-alt text-error">{{ $message }}</span>
                </label>
            @enderror
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mt-6">
            <a class="link link-hover text-sm" href="{{ route('login') }}">
                {{ __('Already registered?') }}
            </a>

            <button type="submit" class="btn btn-primary w-full sm:w-auto mt-4 sm:mt-0">
                {{ __('Register') }}
            </button>
        </div>
    </form>
</x-guest-layout>
