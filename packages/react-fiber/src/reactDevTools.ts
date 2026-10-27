import type { ReactDevToolsHook } from './reactDevToolsHook';

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevToolsHook;
  }
}

type HookCallback = (...args: never[]) => unknown;

// Calls the existing callback, then the new one. Errors are isolated so a failing callback cannot block the other,
// and the existing callback's result is kept (React reads the renderer id returned by `inject`).
function chain<T extends HookCallback>(prev: T | undefined, next: T): T {
  return function (this: unknown, ...args: Parameters<T>) {
    let result: unknown;
    try {
      result = prev?.apply(this, args);
    } catch (error) {
      console.error(error);
    }
    try {
      next.apply(this, args);
    } catch (error) {
      console.error(error);
    }
    return result;
  } as T;
}

// Hooks into React through the global React DevTools hook. Must be registered before React loads.
export class ReactDevTools {
  /**
   * Registers new React hooks. This preserves all preexisting hooks.
   * @param newHook The new hooks to register.
   */
  public static register(newHook: ReactDevToolsHook): void {
    // The React DevTools extension may already have installed its hook as a getter-only property, so it is extended
    // in place and only assigned when missing.
    // eslint-disable-next-line no-underscore-dangle -- React's global hook name.
    const existingHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const hook = existingHook ?? {};

    // Inform React that we are supporting Fibers.
    // Otherwise, all hooks are ignored.
    hook.supportsFiber = true;

    if (newHook.inject) {
      hook.inject = chain(hook.inject, newHook.inject);
    }

    if (newHook.onCommitFiberRoot) {
      hook.onCommitFiberRoot = chain(hook.onCommitFiberRoot, newHook.onCommitFiberRoot);
    }

    if (newHook.onPostCommitFiberRoot) {
      hook.onPostCommitFiberRoot = chain(
        hook.onPostCommitFiberRoot,
        newHook.onPostCommitFiberRoot,
      );
    }

    if (newHook.onCommitFiberUnmount) {
      hook.onCommitFiberUnmount = chain(
        hook.onCommitFiberUnmount,
        newHook.onCommitFiberUnmount,
      );
    }

    if (!existingHook) {
      // eslint-disable-next-line no-underscore-dangle -- React's global hook name.
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = hook;
    }
  }
}
