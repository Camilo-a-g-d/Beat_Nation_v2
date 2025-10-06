import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class WelcomePage {
  currentSlide = 0;

  constructor(private router: Router) {}

  nextSlide() {
    if (this.currentSlide < 3) {
      this.currentSlide++;
    } else {
      this.router.navigate(['/login']); // 🔹 Redirige al login al terminar
    }
  }

  skip() {
    this.router.navigate(['/login']); // 🔹 Saltar al login
  }
}
