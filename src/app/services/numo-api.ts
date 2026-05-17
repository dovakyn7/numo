import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NumoApiService {
  private apiUrl = 'https://numo-api-802p.onrender.com';

  constructor(private http: HttpClient) {}

  //categorias
  getCategorias() {
    return this.http.get(this.apiUrl + '/categorias/');
  }

  crearCategoria(data: any) {
    return this.http.post(`${this.apiUrl}/categorias`, data);
  }

  updateCategoria(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/categorias/${id}`, data);
  }

  deleteCategoria(id: string) {
    return this.http.delete(`${this.apiUrl}/categorias/${id}`); //destruye lo que este en esta direccion no necesita informacion adicional por eso no lleva data al final
  }
  //se usa data cuendo se necesite entregar informacion al servidor, crear o actualizar

  //Registros

  getRegistros() {
    return this.http.get(`${this.apiUrl}/registros`);
  }

  crearRegistro(data: any) {
    return this.http.post(`${this.apiUrl}/registros`, data);
  }

  updateRegistro(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/registros/${id}`, data);
  }

  deleteRegistro(id: string) {
    return this.http.delete(`${this.apiUrl}/registros/${id}`);
  }
}
