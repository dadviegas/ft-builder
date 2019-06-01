function isFunction(obj) {
  return obj instanceof Function;
}

function isArray(obj) {
  return Array.isArray(obj);
}

export const EXECUTION_FLOW = {
  CONCURRENT_FLOW: true,
  CHAINING_FLOW: false,
};

export default class Middleware {
  constructor(ctx = {}) {
    this.stack = [];
    this.ctx = ctx;
  }

  use(...args) {
    const obj = args[0];
    if (isFunction(obj)) {
      this._addAsyncMiddleware(args[0], args[1]);
    } else if (isArray(obj) && obj.length) {
      const middlewares = args[0];
      const executeInParallel = args[1] || false;
      const predicate = args[2];

      if (executeInParallel) {
        this._addAsyncMiddleware((ctx, next, notifyError) => {
          const promises = [];
          middlewares.forEach(middleware => {
            const promise = new Promise((resolve, reject) => {
              middleware(ctx, resolve, reject);
            });

            promises.push(promise);
          });

          Promise.all(promises)
            .then(next)
            .catch(notifyError);
        }, predicate);
      } else {
        middlewares.forEach(middleware => this._addAsyncMiddleware(middleware, predicate));
      }
    }

    return this;
  }

  onError(callback) {
    this.onError = callback;

    return this;
  }

  notifyError(e) {
    if (this.onError) this.onError(e);
  }

  run(endFn) {
    this._addAsyncMiddleware(endFn);
    this.notifyError = error => this.onError(error, this.ctx);
    this._applyMiddleware(this.stack.reverse(), this.notifyError)();
  }

  destroy() {
    this.stack.length = 0;
    this.endFn = undefined;
    // eslint-disable-next-line
    for (var key in this.ctx){
      // eslint-disable-next-line no-prototype-builtins
      if (this.ctx.hasOwnProperty(key)) {
        delete this.ctx[key];
      }
    }
  }

  // setTimeout avoid block the thread.
  _asyncFunc = (fn, predicateFunc) => (ctx, next, notifyError) =>
    setTimeout(() => {
      if (isFunction(predicateFunc)) {
        if (predicateFunc(ctx)) {
          fn(ctx, next, notifyError);
        } else {
          // eslint-disable-next-line no-unused-expressions
          next && next();
        }
      } else {
        fn(ctx, next, notifyError);
      }
    }, 0);

  _addAsyncMiddleware(fn, predicateFunc) {
    if (fn) {
      this.stack.push(this._asyncFunc(fn, predicateFunc));
    }
  }

  _applyMiddleware = (fns, notifyError) => fns.reduce((next, fn2) => () => fn2(this.ctx, next, notifyError), undefined);
}
