import { TabelaPreco } from "./tabelaPreco";

export interface Empresa {
    id: number,
    nome: string,
    descricao: string,
    lat: string,
    lng: string,
    distancia: number,
    tempo: number,
    res: any,
    tabelaPrecos: Array<TabelaPreco>
}