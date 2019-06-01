import Middleware, { EXECUTION_FLOW } from '../index';

describe('Exports execution flow', () => {
  it('concurrent is true', () => {
    expect(EXECUTION_FLOW.CONCURRENT_FLOW).toBe(true);
  });

  it('concurrent is false', () => {
    expect(EXECUTION_FLOW.CHAINING_FLOW).toBe(false);
  });
})

describe('Create instance', () => {
  const context = {
    var1: 1,
    var2: 2,
  };
  const middleware = new Middleware(context);

  it('defined', () => {
    expect(middleware).toBeDefined();
  });

  it('has context', () => {
    expect(context).toBe(middleware.ctx);
  });

  it('has use method', () => {
    expect(middleware.use).toBeDefined();
  });

  it('has onError method', () => {
    expect(middleware.onError).toBeDefined();
  });

  it('has run onError', () => {
    expect(middleware.run).toBeDefined();
  });
})
