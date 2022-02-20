import { IframeTrustedPipe } from './iframe-trusted.pipe';

describe('IframeTrustedPipe', () => {
  it('create an instance', () => {
    const pipe = new IframeTrustedPipe();
    expect(pipe).toBeTruthy();
  });
});
