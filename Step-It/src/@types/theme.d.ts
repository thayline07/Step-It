// Tipagem para o tema do projeto Step-It

export interface Theme {
  colors: {
    background_principal: string;
    background_gradient_linear: string[];
    background_gradient_diamond: string;
    texto: string;
    raio: string;
    numero: string;
    numero_legenda: string;
    titulo: string;
    borda_foto: string;
    circulo_degrade: string;
    circulo_borda: string;
    titulo_card: string;
    texto_principal: string;
    card: string;
    borda_card: string;
    botao_theme: {
      background: string;
      borda: string;
      sombra: string;
      icone: string;
    };
    navegacao: {
      background: string;
      sombra: string;
      borda: string;
      icones: string;
      icone_clicado: string;
      sombra_icone_clicado: string;
      fundo_icone_clicado: string;
      sombra_fundo_icone_clicado: string;
    };
    perfil: {
      titulo: string;
      card: string;
      link: string;
    };
    relatorios: {
      card: string;
      card_grafico: string;
      linha_grafico: string;
      borda: string;
      cor_grafico: string;
      borda_grafico: string;
      icones: string;
      background_icone_relatorio: string;
      background_icone_voltar: string;
      background_icone_data: string;
      borda_icone_relatorio: string;
      borda_icone_voltar: string;
      borda_icone_data: string;
      texto: string;
    };
    login: {
      title: string;
      sombra_title: string;
      texto: string;
      texto_input: string;
      icone: string;
      input: string;
      border_input: string;
      botao_background: string;
    };
  };
}
