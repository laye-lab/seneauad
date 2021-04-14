import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CService } from '../service/c.service';

import { CComponent } from './c.component';

describe('Component Tests', () => {
  describe('C Management Component', () => {
    let comp: CComponent;
    let fixture: ComponentFixture<CComponent>;
    let service: CService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CComponent],
      })
        .overrideTemplate(CComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CService);

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
      expect(comp.cS?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
