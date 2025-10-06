import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class SplashPage implements OnInit, OnDestroy {
  private splashTimer: any | undefined;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.splashTimer = setTimeout(() => {
      this.goToGome();
    }, 2500);
  }

  ngOnDestroy(): void {
    if(this.splashTimer) {
      clearTimeout(this.splashTimer);
    }
  }

  goToGome(): void {
    this.router.navigate(['/welcome']);
  }
}
