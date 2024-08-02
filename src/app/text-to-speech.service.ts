import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private apiKey = '35f8a3ca10334829ae5ee7b53e52cb55'
  private apiUrl = `http://api.voicerss.org/?key=${this.apiKey}&hl=en-us`

  constructor(private http: HttpClient) { }

  getSpeech(text: string): Observable<Blob> {
    const url = `${this.apiUrl}&src=${encodeURIComponent(text)}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}


