jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DService } from '../service/d.service';
import { ID, D } from '../d.model';

import { DUpdateComponent } from './d-update.component';

describe('Component Tests', () => {
  describe('D Management Update Component', () => {
    let comp: DUpdateComponent;
    let fixture: ComponentFixture<DUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let dService: DService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      dService = TestBed.inject(DService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const d: ID = { id: 456 };

        activatedRoute.data = of({ d });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(d));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const d = { id: 123 };
        spyOn(dService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ d });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: d }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(dService.update).toHaveBeenCalledWith(d);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const d = new D();
        spyOn(dService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ d });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: d }));
        saveSubject.complete();

        // THEN
        expect(dService.create).toHaveBeenCalledWith(d);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const d = { id: 123 };
        spyOn(dService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ d });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(dService.update).toHaveBeenCalledWith(d);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
