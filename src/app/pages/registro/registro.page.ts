import { Component, OnDestroy } from '@angular/core';
import { IonicModule, Platform, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // <- ajusta ruta si es necesario

interface Department {
  name: string;
  code: string;
  capital: string;
  area: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegistroPage implements OnDestroy {
  // -------- UI helpers (mostrar/ocultar password)
  showPass = false;
  showPassConfirm = false;
  get passType() { return this.showPass ? 'text' : 'password'; }
  get passConfirmType() { return this.showPassConfirm ? 'text' : 'password'; }
  togglePass() { this.showPass = !this.showPass; }
  togglePassConfirm() { this.showPassConfirm = !this.showPassConfirm; }

  // -------- State del Stepper
  currentStep: number = 1;

  // -------- Modelo del formulario
  nombre = '';
  apellido = '';
  tipoId = '';
  numId = '';
  pais = 'Colombia';
  ciudad = '';
  municipio = '';
  region = '';
  correo = '';
  contrasena = '';
  confirmContrasena = '';
  acceptTerms = false;

  // -------- Responsivo para ion-select
  isDesktop = false;
  selectOpts = { cssClass: 'bn-select-popover', translucent: true, showBackdrop: true };
  private _resizeHandler = () => {
    this.isDesktop = this.platform.width() >= 992 || this.platform.is('desktop');
  };

  // -------- Datos estáticos (países/departamentos/ciudades)
  countries: string[] = [
    'Argentina','Bolivia','Brasil','Chile','Colombia','Ecuador','México','Perú',
    'Venezuela','Estados Unidos','España','Canadá','Francia','Alemania','Italia'
  ];

  departments: Department[] = [
    { name: 'Amazonas', code: 'AM', capital: 'Leticia', area: '109,665' },
    { name: 'Antioquia', code: 'AN', capital: 'Medellín', area: '63,612' },
    { name: 'Arauca', code: 'AR', capital: 'Arauca', area: '23,818' },
    { name: 'Atlántico', code: 'AT', capital: 'Barranquilla', area: '3,388' },
    { name: 'Bogotá D.C.', code: 'DC', capital: 'Bogotá', area: '1,587' },
    { name: 'Bolívar', code: 'BL', capital: 'Cartagena', area: '25,978' },
    { name: 'Boyacá', code: 'BY', capital: 'Tunja', area: '23,189' },
    { name: 'Caldas', code: 'CL', capital: 'Manizales', area: '7,888' },
    { name: 'Caquetá', code: 'CQ', capital: 'Florencia', area: '88,965' },
    { name: 'Casanare', code: 'CS', capital: 'Yopal', area: '44,640' },
    { name: 'Cauca', code: 'CA', capital: 'Popayán', area: '29,308' },
    { name: 'Cesar', code: 'CE', capital: 'Valledupar', area: '22,905' },
    { name: 'Chocó', code: 'CH', capital: 'Quibdó', area: '46,530' },
    { name: 'Córdoba', code: 'CO', capital: 'Montería', area: '25,020' },
    { name: 'Cundinamarca', code: 'CU', capital: 'Bogotá', area: '24,210' },
    { name: 'Guainía', code: 'GN', capital: 'Inirida', area: '72,238' },
    { name: 'Guaviare', code: 'GV', capital: 'San José del Guaviare', area: '53,460' },
    { name: 'Huila', code: 'HU', capital: 'Neiva', area: '19,890' },
    { name: 'La Guajira', code: 'LG', capital: 'Riohacha', area: '20,848' },
    { name: 'Magdalena', code: 'MA', capital: 'Santa Marta', area: '23,188' },
    { name: 'Meta', code: 'ME', capital: 'Villavicencio', area: '82,805' },
    { name: 'Nariño', code: 'NA', capital: 'Pasto', area: '33,268' },
    { name: 'Norte de Santander', code: 'NS', capital: 'Cúcuta', area: '21,658' },
    { name: 'Putumayo', code: 'PU', capital: 'Mocoa', area: '24,885' },
    { name: 'Quindío', code: 'QD', capital: 'Armenia', area: '1,845' },
    { name: 'Risaralda', code: 'RI', capital: 'Pereira', area: '4,140' },
    { name: 'San Andrés y Providencia', code: 'SA', capital: 'San Andrés', area: '52' },
    { name: 'Santander', code: 'ST', capital: 'Bucaramanga', area: '30,537' },
    { name: 'Sucre', code: 'SU', capital: 'Sincelejo', area: '10,917' },
    { name: 'Tolima', code: 'TO', capital: 'Ibagué', area: '23,562' },
    { name: 'Valle del Cauca', code: 'VC', capital: 'Cali', area: '22,140' },
    { name: 'Vaupés', code: 'VP', capital: 'Mitú', area: '54,135' },
    { name: 'Vichada', code: 'VI', capital: 'Puerto Carreño', area: '100,242' }
  ];

  cities: string[] = [
    'Bogotá','Medellín','Cali','Barranquilla','Cartagena','Cúcuta','Bucaramanga',
    'Pereira','Ibagué','Buga','Santa Marta','Manizales','Villavicencio',
    'Valledupar','Montería'
  ];

  municipalities: { [key: string]: string[] } = {
    'Amazonas': ['Leticia', 'Puerto Nariño'],
    'Guainía': ['Barrancominas', 'Inirida'],
    'Guaviare': ['Calamar', 'El Retorno', 'Miraflores', 'San José del Guaviare'],
    'Quindío': ['Armenia', 'Buenavista', 'Calarcá', 'Circasia', 'Córdoba', 'Filandia', 'Génova', 'La Tebaida', 'Montenegro', 'Pijao', 'Quimbaya', 'Salento'],
    'Risaralda': ['Apía', 'Balboa', 'Belén de Umbría', 'Dosquebradas', 'Guática', 'La Celia', 'La Virginia', 'Marsella', 'Mistrató', 'Pereira', 'Pueblo Rico', 'Quinchía', 'Santa Rosa de Cabal', 'Santuario'],
    'San Andrés y Providencia': ['Providencia and Santa Catalina Islands'],
    'Vaupés': ['Carurú', 'Mitú', 'Taraira'],
    'Vichada': ['Cumaribo', 'La Primavera', 'Puerto Carreño', 'Santa Rosalía'],
    'Cundinamarca': ['Bogotá', 'Soacha', 'Chía', 'Zipaquirá', 'Facatativá', 'Sibaté','Fusagasuga', 'Choconta', 'Teta Ciudad'],
    'Antioquia': ['Medellín', 'Envigado', 'Itagüí', 'Bello', 'Rionegro'],
    'Bogotá D.C.': ['Bogotá D.C.']
  };

  currentMunicipios: string[] = [];

  // -------- Helpers
  private emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  get isColombia() { return this.pais === 'Colombia'; }

  constructor(
    private platform: Platform,
    private router: Router,
    private auth: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {
    this._resizeHandler();
    window.addEventListener('resize', this._resizeHandler);

    if (this.region) {
      this.loadMunicipios({ detail: { value: this.region } });
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this._resizeHandler);
  }

  // -------- UI events
  onCountryChange(event: any) {
    const selectedCountry = event.detail.value;
    if (selectedCountry !== 'Colombia') {
      this.ciudad = '';
      this.municipio = '';
      this.region = '';
      this.currentMunicipios = [];
    }
  }

  loadMunicipios(event: any) {
    const selectedRegion = event.detail.value;
    this.region = selectedRegion;
    this.currentMunicipios = this.municipalities[selectedRegion] || [];
    this.municipio = '';
  }

  async nextStep() {
    // valida el step actual antes de avanzar
    if (!this.isStepValid(this.currentStep)) {
      await this.toast('Completa los campos requeridos del paso actual', 'warning');
      return;
    }
    if (this.currentStep < 3) this.currentStep++;
  }

  // -------- Validación por pasos
  private isStepValid(step: number): boolean {
    if (step === 1) {
      return !!(this.nombre?.trim() && this.apellido?.trim() && this.tipoId?.trim() && this.numId?.trim());
    }
    if (step === 2) {
      if (this.isColombia) {
        return !!(this.region?.trim() && this.municipio?.trim());
      } else {
        return !!(this.ciudad?.trim());
      }
    }
    if (step === 3) {
      const passOk = this.contrasena?.length >= 8 && this.contrasena === this.confirmContrasena;
      return !!(this.emailRe.test(this.correo.trim().toLowerCase()) && passOk && this.acceptTerms);
    }
    return true;
  }

  // -------- Registro real (almacena en Preferences vía AuthService)
  async register() {
    // valida todo el formulario
    for (let s = 1; s <= 3; s++) {
      if (!this.isStepValid(s)) {
        this.currentStep = s;
        await this.toast('Verifica los datos del paso ' + s, 'warning');
        return;
      }
    }

    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loading.present();

    try {
      const name = `${this.nombre} ${this.apellido}`.replace(/\s+/g, ' ').trim();
      await this.auth.register({
        name,
        email: this.correo.trim().toLowerCase(),
        phone: this.numId.trim(),                 // opcional
        password: this.contrasena,
      });

      await loading.dismiss();
      await this.toast('Cuenta creada. Inicia sesión 👋', 'success');
      await this.router.navigate(['/login']);
    } catch (e: any) {
      await loading.dismiss();
      if (e?.message === 'EMAIL_TAKEN') {
        await this.toast('Ese correo ya está registrado', 'danger');
      } else {
        await this.toast('No se pudo crear la cuenta', 'danger');
        console.error('register error', e);
      }
    }
  }

  // -------- Toast helper
  private async toast(message: string, color: 'primary'|'success'|'warning'|'danger' = 'primary') {
    const t = await this.toastCtrl.create({ message, duration: 2200, color, position: 'bottom' });
    await t.present();
  }
}