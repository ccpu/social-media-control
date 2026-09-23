import type { ReactDevToolsHook } from './reactDevToolsHook';

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevToolsHook;
  }
}

// Hooks into React through the global React DevTools hook. Must be registered before React loads.
export class ReactDevTools {
  /**
   * Registers new React hooks. This preserves all preexisting hooks.
   * @param newHook The new hooks to register.
   */
  public static register(newHook: ReactDevToolsHook): void {
    // eslint-disable-next-line no-underscore-dangle -- React's global hook name.
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};

    // Inform React that we are supporting Fibers.
    // Otherwise, all hooks are ignored.
    hook.supportsFiber = true;

    if (newHook.inject) {
      const prevHook = hook.inject;
      hook.inject = function (...args) {
        prevHook?.(...args);
        newHook.inject?.(...args);
      };
    }

    if (newHook.onCommitFiberRoot) {
      const prevHook = hook.onCommitFiberRoot;
      hook.onCommitFiberRoot = function (...args) {
        prevHook?.(...args);
        newHook.onCommitFiberRoot?.(...args);
      };
    }

    if (newHook.onPostCommitFiberRoot) {
      const prevHook = hook.onPostCommitFiberRoot;
      hook.onPostCommitFiberRoot = function (...args) {
        prevHook?.(...args);
        newHook.onPostCommitFiberRoot?.(...args);
      };
    }

    if (newHook.onCommitFiberUnmount) {
      const prevHook = hook.onCommitFiberUnmount;
      hook.onCommitFiberUnmount = function (...args) {
        prevHook?.(...args);
        newHook.onCommitFiberUnmount?.(...args);
      };
    }

    // eslint-disable-next-line no-underscore-dangle -- React's global hook name.
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = hook;
  }
}
