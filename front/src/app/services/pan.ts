import { Injectable } from '@angular/core';
import { Pan } from '../models/pan';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class PanService {
  private apiUrl = `${environment.apiUrl}/panes`;

  constructor(private http: HttpClient) {}

  getPanes(): Observable<Pan[]> {
    return this.http.get<Pan[]>(this.apiUrl);
  }

  createPan(pan: Omit<Pan, 'idPan'>): Observable<{ message: string; idPan: number }> {
    return this.http.post<{ message: string; idPan: number }>(this.apiUrl, pan);
  }

  updatePan(id: number, pan: Omit<Pan, 'idPan'>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, pan);
  }

  deletePan(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
