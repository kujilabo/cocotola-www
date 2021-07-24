import Bar from './bar';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';

describe('App components', () => {
  test('render App components', () => {
    const { baseElement } = render(<Bar />);
    expect(baseElement).toBeTruthy();
  });
});
