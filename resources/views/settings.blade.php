<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Settings') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    @if (session('success'))
                        <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span class="block sm:inline">{{ session('success') }}</span>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('settings.update') }}" class="space-y-6">
                        @csrf
                        @method('POST')

                        <!-- Theme Selection -->
                        <div>
                            <x-input-label for="theme" :value="__('Theme')" />
                            <select id="theme" name="theme" class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                            <x-input-error :messages="$errors->get('theme')" class="mt-2" />
                        </div>

                        <!-- Language Selection -->
                        <div>
                            <x-input-label for="language" :value="__('Language')" />
                            <select id="language" name="language" class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">
                                <option value="en">English</option>
                                <option value="nl">Nederlands</option>
                            </select>
                            <x-input-error :messages="$errors->get('language')" class="mt-2" />
                        </div>

                        <!-- Notifications -->
                        <div class="flex items-center">
                            <input id="notifications" name="notifications" type="checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-indigo-600 dark:focus:ring-indigo-600">
                            <x-input-label for="notifications" :value="__('Enable Notifications')" class="ml-2" />
                            <x-input-error :messages="$errors->get('notifications')" class="mt-2" />
                        </div>

                        <div class="flex items-center gap-4">
                            <x-primary-button>{{ __('Save Settings') }}</x-primary-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout> 