import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/members';

@Component({
  selector: 'app-members-card',
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.scss'],
})
export class MembersCardComponent implements OnInit {
  @Input() member: Member;
  constructor() {}

  ngOnInit(): void {}
}
