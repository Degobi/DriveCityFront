export interface User {
    id: number;
    email: string;
    token: string;
    nome: string;
    veiculo?: Array<any>;
}