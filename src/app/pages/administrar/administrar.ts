import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-administrar',
  imports: [CommonModule, Navbar, RouterLink],
  templateUrl: './administrar.html',
  styleUrl: './administrar.css',
})
export class Administrar {}
