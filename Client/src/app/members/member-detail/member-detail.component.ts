import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/members';
import { Photo } from 'src/app/_models/photo';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  @Input() member: Member;
  galleryOption: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  constructor(
    private memberSrv: MembersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMember();
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

  loadMember() {
    this.memberSrv
      .getMember(this.route.snapshot.paramMap.get('username'))
      .subscribe({
        next: (member) => (this.member = member),
        complete: () => {
          this.galleryImages = this.getImages();
        },
      });
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
}
