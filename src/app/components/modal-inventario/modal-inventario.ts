import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-inventario.html',
  styleUrl: './modal-inventario.css',
})
export class ModalInventario {
  @Input() titulo: string = '';
  @Input() visible: boolean = false;
  @Output() onConfirmar = new EventEmitter<number>();
  @Output() onCerrar = new EventEmitter<void>();

  cantidad: number = 1;

  cerrar(){
    this.onCerrar.emit();
  }

  confirmar(){
    this.onConfirmar.emit(this.cantidad);
    this.cantidad = 1;
  }


}
