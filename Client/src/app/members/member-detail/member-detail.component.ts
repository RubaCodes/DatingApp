import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/members';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  @Input() member: Member;
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  galleryOption: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = this.getImages();
  activeTab: TabDirective;
  messages: Message[] = [];
  constructor(
    private memberSrv: MembersService,
    private route: ActivatedRoute,
    private messageSrv: MessageService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => (this.member = data['member']),
    });
    this.route.queryParams.subscribe({
      next: (res) => {
        res['tab'] && this.selectTab(res['tab']);
      },
    });
    this.galleryOption = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
  }

  getImages() {
    if (!this.member) return [];
    const imagesUrls = [];
    this.member.photos.forEach((photo) => {
      imagesUrls.push({
        small: photo.url,
        medium: photo.url,
        large: photo.url,
      });
    });
    return imagesUrls;
  }

  loadMessages() {
    if (this.member.userName) {
      this.messageSrv.getMessageThread(this.member.userName).subscribe({
        next: (res) => (this.messages = res),
      });
    }
  }
  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find((x) => x.heading === heading).active = true;
    }
  }
  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading == 'Messages') {
      this.loadMessages();
    }
  }
}
