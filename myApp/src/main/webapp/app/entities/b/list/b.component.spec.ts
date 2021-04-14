import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BService } from '../service/b.service';

import { BComponent } from './b.component';

describe('Component Tests', () => {
  describe('B Management Component', () => {
    let comp: BComponent;
    let fixture: ComponentFixture<BComponent>;
    let service: BService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BComponent],
      })
        .overrideTemplate(BComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.bS?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
