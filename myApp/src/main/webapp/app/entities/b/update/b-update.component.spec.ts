jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BService } from '../service/b.service';
import { IB, B } from '../b.model';
import { IA } from 'app/entities/a/a.model';
import { AService } from 'app/entities/a/service/a.service';

import { BUpdateComponent } from './b-update.component';

describe('Component Tests', () => {
  describe('B Management Update Component', () => {
    let comp: BUpdateComponent;
    let fixture: ComponentFixture<BUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bService: BService;
    let aService: AService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bService = TestBed.inject(BService);
      aService = TestBed.inject(AService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call A query and add missing value', () => {
        const b: IB = { id: 456 };
        const a: IA = { id: 82173 };
        b.a = a;

        const aCollection: IA[] = [{ id: 97023 }];
        spyOn(aService, 'query').and.returnValue(of(new HttpResponse({ body: aCollection })));
        const additionalAS = [a];
        const expectedCollection: IA[] = [...additionalAS, ...aCollection];
        spyOn(aService, 'addAToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ b });
        comp.ngOnInit();

        expect(aService.query).toHaveBeenCalled();
        expect(aService.addAToCollectionIfMissing).toHaveBeenCalledWith(aCollection, ...additionalAS);
        expect(comp.aSSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const b: IB = { id: 456 };
        const a: IA = { id: 67157 };
        b.a = a;

        activatedRoute.data = of({ b });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(b));
        expect(comp.aSSharedCollection).toContain(a);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const b = { id: 123 };
        spyOn(bService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ b });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: b }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bService.update).toHaveBeenCalledWith(b);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const b = new B();
        spyOn(bService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ b });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: b }));
        saveSubject.complete();

        // THEN
        expect(bService.create).toHaveBeenCalledWith(b);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const b = { id: 123 };
        spyOn(bService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ b });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bService.update).toHaveBeenCalledWith(b);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAById', () => {
        it('Should return tracked A primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
