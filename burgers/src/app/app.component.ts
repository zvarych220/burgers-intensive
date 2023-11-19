import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [AppService]
})

export class AppComponent {
  currency = "$";

  productsData: any; 

  constructor(private fb:FormBuilder , private appService: AppService){

  }

  ngOnInit(){
    this.appService.getData().subscribe(data => this.productsData = data);
  }

  scrollTo(target: HTMLElement, burger?: any){
    target.scrollIntoView({ behavior: "smooth" });
    if (burger) {
      this.form.patchValue({order: burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
    }
  }

  confirnOrder(){
    if(this.form.valid){

      this.appService.sendOrder(this.form.value)
      .subscribe(
        {
          next:(response: any)=>{
            alert(response.message);
            this.form.reset();
          },
          error:(response)=>{
            alert(response.error.message);
          },
        }
      );
    }
  }

  form = this.fb.group({
    order :["", Validators.required],
    name :["", Validators.required],
    phone :["", Validators.required],
  })
  changeCurrency(){
    let newCurrency = "$";
    let coefficient = 1;

    if (this.currency === "$") {
        newCurrency = "₽";
        coefficient = 80;
    } else if (this.currency === "₽") {
        newCurrency = "BYN";
        coefficient = 3;
    }
    else if (this.currency === 'BYN') {
        newCurrency = '€';
        coefficient = 0.9;
    } else if (this.currency === '€') {
        newCurrency = '¥';
        coefficient = 6.9;
    }
    else if (this.currency === '¥') {
        newCurrency = '₴';
        coefficient = 4.15;
    } 

    this.currency = newCurrency;
    
    this.productsData.forEach((item: any) => {
      item.price = +(item.basePrice * coefficient).toFixed(1);
    })
  }
}
