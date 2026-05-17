import { TestBed } from '@angular/core/testing';

import { NumoApi } from './numo-api';

describe('NumoApi', () => {
  let service: NumoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumoApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
