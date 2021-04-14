jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CService } from '../service/c.service';
import { IC, C } from '../c.model';

import { CUpdateComponent } from './c-update.component';

describe('Component Tests', () => {
  describe('C Management Update Component', () => {
    let comp: CUpdateComponent;
    let fixture: ComponentFixture<CUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cService: CService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cService = TestBed.inject(CService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const c: IC = { id: 456 };

        activatedRoute.data = of({ c });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(c));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const c = { id: 123 };
        spyOn(cService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ c });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: c }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cService.update).toHaveBeenCalledWith(c);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const c = new C();
        spyOn(cService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ c });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: c }));
        saveSubject.complete();

        // THEN
        expect(cService.create).toHaveBeenCalledWith(c);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const c = { id: 123 };
        spyOn(cService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ c });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cService.update).toHaveBeenCalledWith(c);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
