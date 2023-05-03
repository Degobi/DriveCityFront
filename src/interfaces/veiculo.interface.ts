export interface Veiculo {
    id: number,
    marca: string,
    modelo: string,
    ano: number,
    cor: Cor,
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