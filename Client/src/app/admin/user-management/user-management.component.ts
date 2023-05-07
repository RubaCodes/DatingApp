import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> =
    new BsModalRef<RolesModalComponent>();
  availableRoles: string[] = ['Admin', 'Member', 'Moderator'];
  constructor(
    private adminSrv: AdminService,
    private modalSrv: BsModalService
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }
  getUsersWithRoles() {
    this.adminSrv.getUsersWithRoles().subscribe({
      next: (users) => (this.users = users),
    });
  }
  openRolesModal(user: User) {
    const initialState: ModalOptions = {
      initialState: {
        title: 'title',
        list: ['Do thing', 'Another thing', 'else'],
      },
    };
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles],
      },
    };
    this.bsModalRef = this.modalSrv.show(RolesModalComponent, config);
    this.bsModalRef.onHide.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content.selectedRoles;
        if (!this.arrayEqual(selectedRoles, user.roles)) {
          this.adminSrv
            .updateUserRoles(user.username, selectedRoles)
            .subscribe({
              next: (roles) => (user.roles = roles),
            });
        }
      },
    });
  }
  private arrayEqual(array1: any[], array2: any[]) {
    return JSON.stringify(array1.sort()) === JSON.stringify(array2.sort());
  }
}
