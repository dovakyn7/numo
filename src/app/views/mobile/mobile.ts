import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumoApiService } from '../../services/numo-api';

@Component({
  selector: 'app-mobile',
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile.html',
  styleUrl: './mobile.css'
})
export class Mobile implements OnInit {
  categorias: any[] = [];
  categoriasFiltradas: any[] = [];
  ultimosRegistros: any[] = [];
  tipoSeleccionado: 'ingreso' | 'gasto' = 'gasto';

  form = {
    categoriaId: '',
    monto: null as number | null,
    descripcion: '',
  };

  constructor(private api: NumoApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarCategorias();
    this.cargarRegistros();
  }

  cargarCategorias() {
    this.api.getCategorias().subscribe((data: any) => {
      this.categorias = data;
      this.filtrarCategorias();
      if (this.categoriasFiltradas.length > 0) {
        this.form.categoriaId = this.categoriasFiltradas[0].id;
      }
      this.cdr.detectChanges();
    });
  }

  cargarRegistros() {
    this.api.getRegistros().subscribe((data: any) => {
      this.ultimosRegistros = data
        .sort((a: any, b: any) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
        .slice(0, 2);
      this.cdr.detectChanges();
    });
  }

  filtrarCategorias() {
    this.categoriasFiltradas = this.categorias.filter(
      c => c.tipo === this.tipoSeleccionado
    );
    if (this.categoriasFiltradas.length > 0) {
      this.form.categoriaId = this.categoriasFiltradas[0].id;
    }
    this.cdr.detectChanges();
  }

  seleccionarTipo(tipo: 'ingreso' | 'gasto') {
    this.tipoSeleccionado = tipo;
    this.filtrarCategorias();
  }

  guardarRegistro() {
    if (!this.form.monto || !this.form.categoriaId) return;

    const payload = {
      monto: this.form.monto,
      descripcion: this.form.descripcion,
      fecha: new Date().toISOString().split('T')[0],
      categoria: { id: this.form.categoriaId }
    };

    this.api.crearRegistro(payload).subscribe({
      next: () => {
        this.form.monto = null;
        this.form.descripcion = '';
        this.cargarRegistros();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}