# NomenV

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

Installing Tailwind v4

```
npm install -D tailwindcss @tailwindcss/vite

npx @tailwindcss/cli   <--- why?

```

Add tailwind to vite.config.ts


npm install @heroicons/vue
npm install @headlessui/vue

####################################################################################

Clicking OK on SimplePanel (e.g. incorrect answer) works, put pressing ENTER then gets sent to QeustionPanel and is trapped by the listener and it assumes that you are checking your answer.

CoPilot solution:

. The problem is that the Enter key release (keyup event) is being processed after the new question is generated, causing unintended behavior. This happens because the keydown event triggers the modal close and the new question generation, but the keyup event is still in the event queue and gets processed afterward.

To fix this, we need to consume the Enter key event entirely during the keydown phase and prevent the keyup event from being processed in the parent component (<QuestionPanel>). Here's how we can address this:
We can use a flag to track whether the Enter key has already been handled. This flag will prevent the keyup event from triggering unintended behavior after the new question is generated.

const isEnterHandled = ref(false); // Flag to track if Enter has been handled

function handleInputKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        if (isEnterHandled.value) {
            console.log('Enter key already handled, ignoring...');
            return; // Ignore the event if it has already been handled
        }

        event.preventDefault(); // Prevent default behavior
        isEnterHandled.value = true; // Mark Enter as handled
        checkAnswer();

        // Reset the flag after a short delay to allow the new question to load
        setTimeout(() => {
            isEnterHandled.value = false;
        }, 100);
    }

    console.log('Input key:', event.key);
    inputAnswer.value = document.querySelector('#inputAnswer') as HTMLInputElement;

    console.log('Input element:', inputAnswer.value?.value);

    // Set the value of the input element
    if (inputAnswer.value) {
        inputAnswer.value.value = toSubscript(inputAnswer.value.value);
    }
}

>>>>>>>>>>> what I'm doing instead is using ESC to exit SIMPLEPanel