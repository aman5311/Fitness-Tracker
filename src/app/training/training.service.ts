import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from './exercise.model';
import { map,take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()

export class TrainingService {
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore,
                private uiService: UIService,
                private store : Store<fromTraining.State>) { }

    fetchAvailableExercise() {
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db.collection('availableExercise')
            .snapshotChanges()
            .pipe(map(docArray => {
                return docArray.map(doc => {
                    console.log(doc, doc.payload.doc.data())
                    const abc = JSON.parse(JSON.stringify(doc?.payload?.doc?.data()))
                    return {
                        id: doc.payload.doc.id,
                        name: abc?.name,
                        duration: abc?.duration,
                        calories: abc?.calories
                    };
                });
            }))
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Training.SetAvailableTrainings(exercises));
               
            },error =>{
                this.store.dispatch(new UI.StopLoading());
               // this.uiService.showSnackbar('Fetching exercise failed , try again later',null,3000);
            }
            ));
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex =>{
            this.addDataToDatabase({
                ...ex,
                date: new Date(),
                state: 'completed'
            });
            this.store.dispatch(new Training.StopTraining());
        })
        
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex =>{
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled',
            });
            this.store.dispatch(new Training.StopTraining());
        })
        
    }

    fetchCompletedOrCancelledExercise() {
        this.fbSubs.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
            }
            ))
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe);
    }


    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}