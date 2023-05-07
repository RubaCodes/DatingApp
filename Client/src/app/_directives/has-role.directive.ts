import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]', //*appHasRole=[.....roles]
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  user: User;
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountSrv: AccountService
  ) {
    this.accountSrv.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }
  //worsk the same as ngif, if the condition in valid create the self template else clear it
  ngOnInit(): void {
    if (this.user.roles.some((r) => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
