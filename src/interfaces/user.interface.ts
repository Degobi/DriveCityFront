export interface User {
    id: number;
    email: string;
    token: string;
    nome: string;
    telefone: string;
    veiculo?: Array<any>;
}