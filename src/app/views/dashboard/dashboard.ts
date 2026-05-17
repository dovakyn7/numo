import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumoApiService } from '../../services/numo-api';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  registros: any[] = [];
  categorias: any[] = [];
  balanceVisible = false;
  today = new Date();

  constructor(private api: NumoApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.api.getRegistros().subscribe((data: any) => {
      this.registros = data;
      this.cdr.detectChanges();
    });
    this.api.getCategorias().subscribe((data: any) => {
      this.categorias = data;
      this.cdr.detectChanges();
    });
  }

  get totalIngresos() {
    return this.registros
      .filter(r => r.categoria.tipo === 'ingreso')
      .reduce((sum, r) => sum + Number(r.monto), 0);
  }

  get totalGastos() {
    return this.registros
      .filter(r => r.categoria.tipo === 'gasto')
      .reduce((sum, r) => sum + Number(r.monto), 0);
  }

  get balance() {
    return this.totalIngresos - this.totalGastos;
  }

  get ingresosEsteMes() {
    const hoy = new Date();
    return this.registros
      .filter(r => {
        const fecha = new Date(r.fecha);
        return r.categoria.tipo === 'ingreso' &&
          fecha.getMonth() === hoy.getMonth() &&
          fecha.getFullYear() === hoy.getFullYear();
      })
      .reduce((sum, r) => sum + Number(r.monto), 0);
  }

  get gastosEsteMes() {
    const hoy = new Date();
    return this.registros
      .filter(r => {
        const fecha = new Date(r.fecha);
        return r.categoria.tipo === 'gasto' &&
          fecha.getMonth() === hoy.getMonth() &&
          fecha.getFullYear() === hoy.getFullYear();
      })
      .reduce((sum, r) => sum + Number(r.monto), 0);
  }

  get ahorroEsteMes() {
    return this.ingresosEsteMes - this.gastosEsteMes;
  }

  get gastosPorCategoria() {
    const mapa: any = {};
    this.registros
      .filter(r => r.categoria.tipo === 'gasto')
      .forEach(r => {
        const nombre = r.categoria.nombre;
        const color = r.categoria.color || '#1D9E75';
        if (!mapa[nombre]) mapa[nombre] = { nombre, total: 0, color };
        mapa[nombre].total += Number(r.monto);
      });
    const arr = Object.values(mapa) as any[];
    const max = Math.max(...arr.map((c: any) => c.total));
    return arr.map((c: any) => ({ ...c, porcentaje: Math.round((c.total / max) * 100) }))
      .sort((a: any, b: any) => b.total - a.total);
  }

  get ingresosPorCategoria() {
    const mapa: any = {};
    this.registros
      .filter(r => r.categoria.tipo === 'ingreso')
      .forEach( r => {
        const nombre = r.categoria.nombre;
        const color = r.categoria.color || '#1D9E75';
        if (!mapa[nombre]) mapa[nombre] = { nombre, total: 0, color };
        mapa[nombre].total += Number(r.monto);
      });
    const arr = Object.values(mapa) as any[];
    const max = Math.max(...arr.map((c: any) => c.total));
    return arr.map((c: any) => ({...c, porcentaje: Math.round((c.total / max) * 100) }))
      .sort((a: any, b: any) => b.total - a.total);
  }

  get ultimosRegistros() {
    return [...this.registros]
      .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
      .slice(0, 8);
  }

  toggleBalance() {
    this.balanceVisible = !this.balanceVisible;
  }
}