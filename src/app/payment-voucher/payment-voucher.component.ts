import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
 
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-payment-voucher',
  templateUrl: './payment-voucher.component.html',
  styleUrls: ['./payment-voucher.component.scss'],
})
export class PaymentVoucherComponent implements OnInit {

 // @ViewChild('invoice') invoiceElement!: ElementRef;
  @ViewChild('payment_voucher') paymentVoucher!: ElementRef;
  
  constructor() { }

  ngOnInit() {}

  public generatePDF(): void {

    // html2canvas(this.paymentVoucher.nativeElement, { scale: 3 }).then((canvas) => {
    //   const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
    //   const fileWidth = 200;
    //   const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
    //   let PDF = new jsPDF('p', 'mm', 'a4',);
    //   PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight,'FAST');
    //   PDF.html(this.paymentVoucher.nativeElement.innerHTML)
    //   PDF.save('angular-invoice-pdf-demo.pdf');
    // });

    const doc = new jsPDF();
   
    const pdfTable = this.paymentVoucher.nativeElement;
   
    var html = htmlToPdfmake(pdfTable.innerHTML);
     
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open(); 

}
}

//https://howtojs.io/how-to-generate-pdf-file-in-angular-13-application-in-multiple-ways/