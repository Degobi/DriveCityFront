export interface Veiculo {
    id: number,
    tipo: string,
    placa: string,
    intUsuarioId: number
}

export enum Cor {
    Vermelho = "vermelho",
    Azul     = "azul",
    Verde    = "verde",
    Amarelo  = "amarelo",
    Preto    = "preto",
    Branco   = "branco",
    Prata    = "prata"
}