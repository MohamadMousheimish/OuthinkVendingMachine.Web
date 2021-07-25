import { Component, OnInit } from "@angular/core";
import { HttpService } from "../../../app/services/http/http.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  coins = [
    { value: 0, displayText: "Ten Cent" },
    { value: 1, displayText: "Twenty Cent" },
    { value: 2, displayText: "Fifty Cent" },
    { value: 3, displayText: "One Euro" },
  ];

  vendingItems = [];
  insertedCoin = 0;
  selectedCoin = null;
  selectedItem;
  returnedMessage;
  returnedCoins = [];
  vendingMachineCoins = [];
  constructor(private http: HttpService) {}

  ngOnInit() {
    this.getItems();
    this.getCoins();
  }

  getItems() {
    this.http.get("items").subscribe(
      (res: any) => {
        this.vendingItems = res.body;
      },
      (err) => {}
    );
  }

  InsertCoin() {
    if (this.selectedCoin == 0) {
      this.insertedCoin = +(this.insertedCoin + 0.1).toFixed(2);
    } else if (this.selectedCoin == 1) {
      this.insertedCoin = +(this.insertedCoin + 0.2).toFixed(2);
    } else if (this.selectedCoin == 2) {
      this.insertedCoin = +(this.insertedCoin + 0.5).toFixed(2);
    } else if (this.selectedCoin == 3) {
      this.insertedCoin = +(this.insertedCoin + 1).toFixed(2);
    }
    var entity = {
      type: this.selectedCoin,
    };
    this.http.post("coins/insert-coin", entity).subscribe(
      (res) => {},
      (err) => {}
    );
    this.selectedCoin = null;
  }

  cancelOrder() {
    const self = this;
    this.http.post("orders/cancel-order", {}).subscribe(
      (res: any) => {
        if (res.coins) {
          for (let key in res.coins) {
            let value = res.coins[key];
            if (key === "TenCent") {
              self.returnedCoins.push({ display: "Ten Cent", value });
            } else if (key === "TwentyCent") {
              self.returnedCoins.push({ display: "Twenty Cent", value });
            } else if (key === "FiftyCent") {
              self.returnedCoins.push({ display: "Fifty Cent", value });
            } else if (key === "OneEuro") {
              self.returnedCoins.push({ display: "One Euro", value });
            }
          }
        }
      },
      (err) => {}
    );
    this.selectedItem = null;
    this.selectedCoin = null;
    this.insertedCoin = 0;
  }

  buyItem() {
    const self = this;
    var entity = {
      itemId: this.selectedItem,
    };
    this.returnedMessage = null;
    this.returnedCoins = [];
    this.http.post("orders/buy", entity).subscribe(
      (res: any) => {
        this.returnedMessage = res.note;
        if (res.returnedCoins) {
          for (let key in res.returnedCoins) {
            let value = res.returnedCoins[key];
            if (key === "TenCent") {
              self.returnedCoins.push({ display: "Ten Cent", value });
            } else if (key === "TwentyCent") {
              self.returnedCoins.push({ display: "Twenty Cent", value });
            } else if (key === "FiftyCent") {
              self.returnedCoins.push({ display: "Fifty Cent", value });
            } else if (key === "OneEuro") {
              self.returnedCoins.push({ display: "One Euro", value });
            }
          }
        }
        self.getCoins();
        self.getItems();
      },
      (err) => {
        self.getCoins();
        self.getItems();
      }
    );
    this.selectedItem = null;
    this.selectedCoin = null;
    this.insertedCoin = 0;
  }

  getCoins() {
    this.http.get("coins").subscribe(
      (res: any) => {
        this.vendingMachineCoins = res.body;
      },
      (err) => {}
    );
  }
}
