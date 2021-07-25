import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private REST_API_SERVER = environment.backendUrl;

  constructor(private readonly httpClient: HttpClient) {}

  public get(url: string) {
    return this.httpClient.get(this.REST_API_SERVER + url, {
      observe: "response",
    });
  }

  public post(url: string, params: any) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    let options = {
      headers: headers,
    };
    var json = JSON.stringify(params);
    return this.httpClient.post(this.REST_API_SERVER + url, json, options);
  }
}
