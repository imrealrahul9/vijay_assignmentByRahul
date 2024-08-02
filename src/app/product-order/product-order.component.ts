import { Component } from '@angular/core';
import { TextToSpeechService } from '../text-to-speech.service'; // Import the service

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent {
  rows: { product: string; quantity: number; disabled: boolean }[] = [{ product: '', quantity: 0, disabled: false }];
  products: string[] = ['Pencil', 'Eraser', 'Pens', 'Sharpener']; // Updated products
  quantities: number[] = [0, 1, 2, 3, 4, 5];
  orderRows: { product: string; quantity: number }[] = []; // New state for the order summary
  showOrderSummary: boolean = false; // New boolean property to control visibility

  constructor(private ttsService: TextToSpeechService) { } // Inject the service

  addRow() {
    if (this.rows.length < 8) {
      this.rows.push({ product: '', quantity: 0, disabled: false });
    }
  }

  showOrder() {
    this.showOrderSummary = this.orderRows.length > 0; // Show order summary if there are items
  }

  onProductChange(index: number) {
    if (!this.rows[index].product) {
      this.rows[index].quantity = 0;
    }
  }

  addToOrder(index: number) {
    const row = this.rows[index];
    if (row.product && row.quantity !== 0) {
      // Convert row.quantity to a number
      const quantity = +row.quantity; 
  
     // console.log('Row quantity:', row.quantity, 'Converted to number:', quantity);
  
      // Check if the item already exists in the orderRows
      const existingOrder = this.orderRows.find(order => order.product === row.product);
      if (existingOrder) {
        // Update existing order
        existingOrder.quantity += quantity;
      } else {
        // Add new order item
        this.orderRows.push({ product: row.product, quantity });
      }
  
      this.addRow();
      // Disable the current row
      this.rows[index].disabled = true;
    } else {
      alert('Please choose both a product and quantity.');
    }
  }
  

  speakOrder() {
    const orderText = this.orderRows.map(row => `${row.product} with quantity ${row.quantity}`).join(', ');
    this.ttsService.getSpeech(orderText).subscribe(blob => {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      audio.oncanplaythrough = () => {
        audio.play().catch(error => {
          console.error('Audio playback failed:', error);
        });
      };

      audio.onerror = (error) => {
        console.error('Audio error:', error);
      };
    }, error => {
      console.error('Text-to-speech request failed:', error);
    });
  }
}
