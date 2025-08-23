
export interface User {
  id: string;
  name: string;
}

export interface Ingredient {
  nome: string;
  quantidade: number;
  unidade: string;
}

export interface Recipe {
  id: string;
  nome: string;
  categoria: 'Culinária Geral' | 'Pastelaria';
  ingredientes: Ingredient[];
  preparo: string[];
  tempo: string;
  porcoes: number;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  imagem_urls: string[];
  video_url?: string;
  user_id: string;
  views: number;
}

export interface Product {
  id: string;
  nome: string;
  categoria: string;
  imagem_url: string;
  link_afiliado: string;
  preco?: string;
}

export interface Donation {
  metodo: string;
  link: string;
  imagem_qr?: string;
  descricao: string;
  chave?: string;
}

export interface ScheduledRecipe {
  id: string;
  recipeId: string;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface ShoppingListItem {
  id: number;
  text: string;
  category: string;
  checked: boolean;
}

export type ShoppingList = Record<string, ShoppingListItem[]>;