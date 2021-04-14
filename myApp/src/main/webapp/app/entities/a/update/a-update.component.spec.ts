jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AService } from '../service/a.service';
import { IA, A } from '../a.model';

import { AUpdateComponent } from './a-update.component';

describe('Component Tests', () => {
  describe('A Management Update Component', () => {
    let comp: AUpdateComponent;
    let fixture: ComponentFixture<AUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let aService: AService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      aService = TestBed.inject(AService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const a: IA = { id: 456 };

        activatedRoute.data = of({ a });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(a));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const a = { id: 123 };
        spyOn(aService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ a });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: a }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(aService.update).toHaveBeenCalledWith(a);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const a = new A();
        spyOn(aService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ a });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: a }));
        saveSubject.complete();

        // THEN
        expect(aService.create).toHaveBeenCalledWith(a);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const a = { id: 123 };
        spyOn(aService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ a });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(aService.update).toHaveBeenCalledWith(a);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
