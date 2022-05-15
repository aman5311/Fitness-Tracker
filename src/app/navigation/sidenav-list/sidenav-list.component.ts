import { Component, OnInit ,EventEmitter, Output} from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit  {

  @Output() closeSidenav =new EventEmitter<void>();
  isAuth$ : Observable<boolean> ;
  
  constructor(private authService:AuthService ,private store : Store<fromRoot.State>) { }


  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onClose()
  {
    this.closeSidenav.emit();
  }

  onLogout(){
    this.authService.logout();
    this.onClose();
  }
  
}
