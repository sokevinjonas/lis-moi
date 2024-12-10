import { TestBed } from '@angular/core/testing';

import { DownloadedBooksService } from './downloaded-books.service';

describe('DownloadedBooksService', () => {
  let service: DownloadedBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadedBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
